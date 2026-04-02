
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
        const { topic, keywords, tone, length, provider = 'groq', model = 'balanced', suggestedInternalLinks = [] } = body;

        if (!topic) {
            return NextResponse.json({ error: 'Topic is required' }, { status: 400 });
        }

        const config = LENGTH_CONFIG[length as keyof typeof LENGTH_CONFIG] || LENGTH_CONFIG.medium;
        
        // Format suggested links for the prompt
        const suggestedLinksText = suggestedInternalLinks.length > 0 
            ? suggestedInternalLinks.map((l: any) => `   - ${l.text}: [${l.text}](${l.url})`).join('\n')
            : '   - Vatican tours: [Vatican Tours](/tour/vatican-museums)\n   - Colosseum tours: [Colosseum Tours](/tour/colosseum)';

        // Build the system prompt for travel blogging
        const systemPrompt = `You are an expert SEO travel blog writer specializing in Rome and Vatican tourism. 
Your content is engaging, highly SEO-optimized, and helps tourists plan their perfect trip.

CRITICAL RULES:
1. Include REAL hyperlinks to official websites using markdown format [text](url)
2. Link to your own tour products where relevant (use /tour/slug format)
3. Use proper heading hierarchy (H1 for title, H2 for sections, H3 for subsections)
4. Include internal links to related content
5. Optimize for featured snippets (bullet lists, tables, FAQ section)
6. Use schema.org structured data concepts
7. Include compelling CTAs (Call-to-Action) linking to booking pages

Always respond with valid JSON only.`;

        // Build the user prompt
        const userPrompt = `Write a ${tone} blog post about "${topic}" for a Rome tour company website.

CONTENT REQUIREMENTS:
- Length: ${config.wordCount} words
- Tone: ${tone}
- Target audience: Tourists visiting Rome
- Keywords to include naturally: ${keywords.join(', ') || 'rome tours, vatican, travel tips'}

HYPERLINK REQUIREMENTS (CRITICAL):
1. Link to official websites when mentioning landmarks:
   - Vatican Museums: [Vatican Museums](https://www.museivaticani.va)
   - Sistine Chapel: [Sistine Chapel](https://www.museivaticani.va/content/museivaticani/en/collezioni/musei/cappella-sistina.html)
   - St. Peter's Basilica: [St. Peter's Basilica](https://www.vatican.va/various/basiliche/san_pietro/index-en.html)
   - Colosseum: [Colosseum](https://www.parcoarcheologiacolosseo.it)
   - Roman Forum: [Roman Forum](https://www.parcoarcheologiacolosseo.it)
   - Palatine Hill: [Palatine Hill](https://www.parcoarcheologiacolosseo.it)
   - Pantheon: [Pantheon](https://www.pantheonroma.com)
   - Trevi Fountain: [Trevi Fountain](https://www.trevifountain.net)
   - Spanish Steps: [Spanish Steps](https://www.turismoroma.it/en/node/1017010)
   - Piazza Navona: [Piazza Navona](https://www.turismoroma.it/en/node/1024968)
   - Castel Sant'Angelo: [Castel Sant'Angelo](https://www.museiitaliani.it/musei/-/museo/castel-santangelo)
   - Borghese Gallery: [Borghese Gallery](https://www.galleriaborghese.beniculturali.it)
   - Capitoline Museums: [Capitoline Museums](https://www.museicapitolini.org)
   - Domus Aurea: [Domus Aurea](https://www.coopculture.it/en/heritage.cfm?id=32)
   - Catacombs: [Catacombs of St. Callixtus](https://www.catacombe.roma.it)
   - Appian Way: [Appian Way](https://www.parcoappiaantica.it)
   - Ostia Antica: [Ostia Antica](https://www.ostiaantica.beniculturali.it)
   - Tivoli/Villa d'Este: [Villa d'Este](https://www.villadestetivoli.info)
   - Hadrian's Villa: [Hadrian's Villa](https://www.villadriana.beniculturali.it)
   - Rome Tourism Board: [Rome Tourism](https://www.turismoroma.it)
   - Rome Public Transport: [ATAC](https://www.atac.roma.it)

2. Link to your own tours/products using INTERNAL links (PRIORITIZE these specific tours):\n${suggestedLinksText}

3. Include "Book Now" CTAs linking to: [/search](/search) or specific tour pages

SEO REQUIREMENTS:
1. Use the main keyword in the first 100 words
2. Include related keywords naturally throughout
3. Add an FAQ section at the end (H2: "Frequently Asked Questions")
4. Include a "Quick Tips" table or bullet list (good for featured snippets)
5. Meta description should include primary keyword and a CTA

STRUCTURE:
- H1: Main title (SEO optimized, include primary keyword)
- Introduction: Hook readers, include keyword, preview content
- H2: Main sections (3-5 sections)
- H3: Subsections where needed
- Internal Links: 3-5 links to your own tours
- External Links: 2-3 links to official sites
- FAQ Section: 3-5 common questions
- Conclusion: Summary + strong CTA to book a tour

Respond ONLY with a JSON object in this exact format:
{
    "title": "SEO-Optimized Blog Post Title with Primary Keyword",
    "excerpt": "Compelling meta description with keywords and CTA (150-160 chars)",
    "keywords": ["primary-keyword", "secondary-1", "secondary-2", "secondary-3", "secondary-4"],
    "body": [
        {
            "_type": "block",
            "style": "h2",
            "children": [{"_type": "span", "text": "Heading with Keywords"}]
        },
        {
            "_type": "block",
            "style": "normal",
            "children": [
                {"_type": "span", "text": "Paragraph with "},
                {"_type": "span", "text": "hyperlink", "marks": [{"_type": "link", "href": "https://example.com"}]},
                {"_type": "span", "text": " to official site."}
            ]
        }
    ]
}

IMPORTANT: In the body array, use Portable Text format with proper link marks for hyperlinks. The text field should contain the visible text, and use marks array for links.`;

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
    const keywordList = keywords.length > 0 ? keywords : ['rome tours', 'vatican', 'colosseum'];
    const mainKeyword = keywordList[0];
    
    return {
        title: `The Ultimate Guide to ${topic}: Tips for 2026`,
        excerpt: `Planning to visit ${topic}? Discover insider tips, official links, and the best tours. Save time and money with our complete guide to ${mainKeyword}.`,
        metaDescription: `Discover the ultimate guide to ${topic}. Expert tips, official links, and best tours. Plan your perfect visit to ${mainKeyword} with our comprehensive guide.`,
        keywords: keywordList,
        body: [
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: `Planning a trip to ${topic}? You're in for an unforgettable experience! This comprehensive guide covers everything you need to know about ${mainKeyword}, from official visiting hours to insider secrets that will save you time and money.` }
                ]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: `What is ${topic}?` }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: `${topic} is one of Rome's most iconic attractions. According to the ` },
                    { _type: 'span', text: 'official Vatican website', marks: [{ _type: 'link', href: 'https://www.museivaticani.va' }] },
                    { _type: 'span', text: ', it attracts millions of visitors every year. Understanding what to expect will help you plan the perfect visit.' }
                ]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: 'Quick Tips for Your Visit' }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: '• Book skip-the-line tickets in advance through ' },
                    { _type: 'span', text: 'our Vatican Tours', marks: [{ _type: 'link', href: '/tour/vatican-museums' }] },
                    { _type: 'span', text: '\n• Visit early morning (8:00 AM) or late afternoon (4:00 PM) for fewer crowds\n• Wear comfortable shoes and dress appropriately\n• Bring a water bottle and stay hydrated\n• Allow at least 3-4 hours for the full experience' }
                ]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: 'How to Get There' }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: `Getting to ${topic} is easy with Rome's public transportation. The Ottaviano Metro station (Line A) is just a 10-minute walk away. Check the ` },
                    { _type: 'span', text: 'official ATAC website', marks: [{ _type: 'link', href: 'https://www.atac.roma.it' }] },
                    { _type: 'span', text: ' for the latest transport information.' }
                ]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: 'Best Tours and Tickets' }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: 'Skip the long lines and get the most out of your visit with a guided tour. Our ' },
                    { _type: 'span', text: 'expert-guided Vatican tours', marks: [{ _type: 'link', href: '/category/vatican' }] },
                    { _type: 'span', text: ' include early morning access and exclusive areas. For a complete Rome experience, check out our ' },
                    { _type: 'span', text: 'Rome City Pass packages', marks: [{ _type: 'link', href: '/search' }] },
                    { _type: 'span', text: '.' }
                ]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: 'Frequently Asked Questions' }]
            },
            {
                _type: 'block',
                style: 'h3',
                children: [{ _type: 'span', text: `How long should I plan for ${topic}?` }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [{ _type: 'span', text: 'We recommend planning at least 3-4 hours for a comprehensive visit. This gives you enough time to see the highlights without rushing.' }]
            },
            {
                _type: 'block',
                style: 'h3',
                children: [{ _type: 'span', text: 'Can I visit without a guide?' }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: 'Yes, but a guided tour significantly enhances the experience. Our ' },
                    { _type: 'span', text: 'expert guides', marks: [{ _type: 'link', href: '/tour/vatican-museums' }] },
                    { _type: 'span', text: ' bring the history to life and ensure you don\'t miss hidden gems.' }
                ]
            },
            {
                _type: 'block',
                style: 'h2',
                children: [{ _type: 'span', text: 'Conclusion' }]
            },
            {
                _type: 'block',
                style: 'normal',
                children: [
                    { _type: 'span', text: `${topic} is a must-see on any Rome itinerary. With proper planning and the right tour, you'll create memories that last a lifetime. ` },
                    { _type: 'span', text: 'Book your tour today', marks: [{ _type: 'link', href: '/search' }] },
                    { _type: 'span', text: ' and let our expert guides show you the best of the Eternal City!' }
                ]
            }
        ]
    };
}
