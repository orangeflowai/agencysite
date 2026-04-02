
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Length configurations
const LENGTH_CONFIG = {
    short: { wordCount: '500-700', blocks: 8 },
    medium: { wordCount: '1000-1500', blocks: 15 },
    long: { wordCount: '2000-2500', blocks: 25 },
};

// Free AI Providers Configuration
const AI_PROVIDERS = {
    groq: {
        name: 'Groq',
        url: 'https://api.groq.com/openai/v1/chat/completions',
        models: {
            fast: 'llama-3.1-8b-instant',      // Fastest, good quality
            balanced: 'llama-3.1-70b-versatile', // Best for blogs (recommended)
            powerful: 'mixtral-8x7b-32768',      // Most capable
        },
        authHeader: (key: string) => `Bearer ${key}`,
    },
    together: {
        name: 'Together AI',
        url: 'https://api.together.xyz/v1/chat/completions',
        models: {
            balanced: 'meta-llama/Meta-Llama-3.1-70B-Instruct-Turbo',
            powerful: 'mistralai/Mixtral-8x7B-Instruct-v0.1',
        },
        authHeader: (key: string) => `Bearer ${key}`,
    },
    mistral: {
        name: 'Mistral',
        url: 'https://api.mistral.ai/v1/chat/completions',
        models: {
            fast: 'mistral-tiny',
            balanced: 'mistral-small',
            powerful: 'mistral-medium',
        },
        authHeader: (key: string) => `Bearer ${key}`,
    },
    openai: {
        name: 'OpenAI',
        url: 'https://api.openai.com/v1/chat/completions',
        models: {
            balanced: 'gpt-4-turbo-preview',
            powerful: 'gpt-4o',
        },
        authHeader: (key: string) => `Bearer ${key}`,
    },
    anthropic: {
        name: 'Anthropic',
        url: 'https://api.anthropic.com/v1/messages',
        models: {
            balanced: 'claude-3-sonnet-20240229',
            powerful: 'claude-3-opus-20240229',
        },
        authHeader: (key: string) => key, // Anthropic uses x-api-key header
    },
    gemini: {
        name: 'Google Gemini',
        url: (key: string) => `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${key}`,
        models: {
            balanced: 'gemini-pro',
        },
        authHeader: () => '',
    },
};

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { topic, keywords, tone, length, provider = 'groq', model = 'balanced' } = body;

        if (!topic) {
            return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
        }

        const config = LENGTH_CONFIG[length as keyof typeof LENGTH_CONFIG] || LENGTH_CONFIG.medium;

        // Build the system prompt for travel blogging
        const systemPrompt = `You are an expert travel blog writer specializing in Rome and Vatican tourism. 
Your content is engaging, SEO-optimized, and helps tourists plan their perfect trip.
Always respond with valid JSON only.`;

        // Build the user prompt
        const userPrompt = `Write a ${tone} blog post about "${topic}" for a Rome tour company website.

Requirements:
- Length: ${config.wordCount} words
- Tone: ${tone}
- Target audience: Tourists visiting Rome
- Keywords to include: ${keywords.join(', ') || 'rome tours, vatican, travel tips'}
- Structure: Engaging title, compelling introduction, informative body with headings, conclusion with call-to-action

IMPORTANT: Respond ONLY with a JSON object in this exact format:
{
    "title": "Engaging Blog Post Title (SEO optimized)",
    "excerpt": "2-3 sentence summary for SEO meta description (150-200 characters)",
    "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
    "body": [
        {
            "_type": "block",
            "style": "h2",
            "children": [{"_type": "span", "text": "Heading Text"}]
        },
        {
            "_type": "block",
            "style": "normal",
            "children": [{"_type": "span", "text": "Paragraph text here..."}]
        }
    ]
}

The body should be an array of Portable Text blocks suitable for Sanity CMS. Include:
- h2 headings for major sections
- Normal paragraphs
- One bullet list for tips
- A compelling conclusion with call-to-action`;

        let result;

        // Try providers in order of preference
        const providerOrder = ['groq', 'together', 'mistral', 'openai', 'anthropic', 'gemini'];

        for (const prov of providerOrder) {
            const envKey = prov === 'gemini'
                ? process.env.GEMINI_API_KEY
                : prov === 'groq'
                    ? process.env.GROQ_API_KEY
                    : prov === 'together'
                        ? process.env.TOGETHER_API_KEY
                        : process.env[`${prov.toUpperCase()}_API_KEY`];

            if (envKey) {
                try {
                    console.log(`[AI Blog] Trying ${prov}...`);
                    result = await generateWithProvider(prov, envKey, model, systemPrompt, userPrompt);
                    console.log(`[AI Blog] Success with ${prov}`);
                    break;
                } catch (err: any) {
                    console.warn(`[AI Blog] ${prov} failed:`, err.message);
                    continue;
                }
            }
        }

        // If no provider worked, use mock
        if (!result) {
            console.log('[AI Blog] No API keys found, using mock content');
            result = generateMockContent(topic, keywords, tone, config);
        }

        return NextResponse.json(result);

    } catch (err: any) {
        console.error('AI Generation Error:', err);
        return NextResponse.json(
            { error: err.message || 'Failed to generate content' },
            { status: 500 }
        );
    }
}

async function generateWithProvider(
    provider: string,
    apiKey: string,
    modelTier: string,
    systemPrompt: string,
    userPrompt: string
) {
    const provConfig = AI_PROVIDERS[provider as keyof typeof AI_PROVIDERS];
    if (!provConfig) throw new Error(`Unknown provider: ${provider}`);

    const model = provConfig.models[modelTier as keyof typeof provConfig.models] ||
        provConfig.models.balanced ||
        Object.values(provConfig.models)[0];

    let response;

    if (provider === 'groq' || provider === 'together' || provider === 'openai' || provider === 'mistral') {
        // OpenAI-compatible API format
        const url = typeof provConfig.url === 'function' ? provConfig.url(apiKey) : provConfig.url;

        response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': provConfig.authHeader(apiKey),
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ],
                temperature: 0.7,
                max_tokens: 4000,
                response_format: provider === 'groq' || provider === 'openai' ? { type: 'json_object' } : undefined,
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || `${provConfig.name} API error`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        return JSON.parse(content);

    } else if (provider === 'anthropic') {
        // Anthropic format
        const url = typeof provConfig.url === 'function' ? provConfig.url(apiKey) : provConfig.url;

        response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01',
            },
            body: JSON.stringify({
                model: model,
                max_tokens: 4000,
                system: systemPrompt,
                messages: [{ role: 'user', content: userPrompt }],
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Anthropic API error');
        }

        const data = await response.json();
        const content = data.content[0].text;
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        return JSON.parse(jsonMatch ? jsonMatch[0] : content);

    } else if (provider === 'gemini') {
        // Gemini format
        const url = typeof provConfig.url === 'function' ? provConfig.url(apiKey) : provConfig.url;

        response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    role: 'user',
                    parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }]
                }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 4000,
                    responseMimeType: 'application/json',
                },
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error?.message || 'Gemini API error');
        }

        const data = await response.json();
        const content = data.candidates[0].content.parts[0].text;
        return JSON.parse(content);
    }

    throw new Error(`Unsupported provider: ${provider}`);
}

function generateMockContent(topic: string, keywords: string[], tone: string, config: any) {
    const keywordList = keywords.length > 0 ? keywords : ['rome tours', 'vatican', 'travel tips'];

    return {
        title: `The Ultimate Guide to ${topic}`,
        excerpt: `Discover everything you need to know about ${topic}. From insider tips to practical advice, this guide will help you make the most of your Rome adventure.`,
        keywords: keywordList,
        body: [
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: `Why ${topic} Matters` }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: `When planning your trip to Rome, understanding ${topic} is essential for making the most of your visit. This comprehensive guide covers everything from the best times to visit to insider secrets that will save you time and money.` }]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: 'Top Tips for Visitors' }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: '1. Book your tickets in advance to skip the lines\n2. Visit early morning or late afternoon for fewer crowds\n3. Wear comfortable shoes as you\'ll be walking a lot\n4. Bring a water bottle and stay hydrated' }]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: 'What to Expect' }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: `Your experience with ${topic} will be unforgettable. From the moment you arrive, you'll be surrounded by history, art, and culture that spans thousands of years. Take your time, soak in the atmosphere, and don't forget to take photos!` }]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: 'Conclusion' }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: `Ready to experience ${topic}? Book your tour today and let our expert guides show you the hidden gems and fascinating stories that make Rome one of the world's most beloved destinations.` }]
            }
        ]
    };
}
