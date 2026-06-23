import { NextResponse } from 'next/server';
import { getTours, getSite, getPosts, DEFAULT_SITE_ID } from '@/lib/sanityService';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { format, addDays } from 'date-fns';

export const dynamic = 'force-dynamic';

const AI_PROVIDERS = {
    groq: {
        url: 'https://api.groq.com/openai/v1/chat/completions',
        models: { balanced: 'llama-3.3-70b-versatile' },
        authHeader: (key: string) => `Bearer ${key}`,
    },
    gemini: {
        url: (key: string) => `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`,
        authHeader: () => '',
    }
};

const FAQS = [
    { q: "What is the dress code for the Vatican?", a: "Both men and women must cover their knees and shoulders. Sleeveless tops and shorts are not permitted." },
    { q: "Do I need to print my tickets?", a: "No, digital tickets on your smartphone are perfectly acceptable." },
    { q: "What happens if I'm late?", a: "Vatican entry times are strict. Arrive 15 minutes early. If you miss your slot, entry may be denied." },
    { q: "Cancellation policy?", a: "Most tours can be cancelled up to 24-48 hours before for a full refund." }
];

export async function POST(req: Request) {
    try {
        const { message, history } = await req.json();
        const siteId = req.headers.get('x-site-id') || DEFAULT_SITE_ID;

        // 1. Gather Rich Context
        const [site, tours, posts] = await Promise.all([
            getSite(siteId),
            getTours(siteId),
            getPosts(siteId)
        ]);

        // 2. Fetch Near-term Availability for all tours
        const today = format(new Date(), 'yyyy-MM-dd');
        const { data: availability, error: availError } = await supabaseAdmin
            .from('tour_slots')
            .select('tour_slug, date, time, available_slots')
            .gte('date', today)
            .lte('date', format(addDays(new Date(), 14), 'yyyy-MM-dd')) // Next 2 weeks
            .gt('available_slots', 0)
            .eq('is_paused', false)
            .order('date', { ascending: true })
            .limit(200);

        if (availError) console.error('[Chat Context] Availability Error:', availError);

        // Group availability by tour
        const availMap: Record<string, string[]> = {};
        (availability || []).forEach(slot => {
            if (!availMap[slot.tour_slug]) availMap[slot.tour_slug] = [];
            if (availMap[slot.tour_slug].length < 3) {
                const label = `${format(new Date(slot.date), 'MMM dd')} @ ${slot.time}`;
                if (!availMap[slot.tour_slug].includes(label)) availMap[slot.tour_slug].push(label);
            }
        });

        const tourContext = tours.map(t => {
            const avail = availMap[t.slug?.current || ''] || [];
            return `- ${t.title} (€${t.price}): ${t.description?.slice(0, 150)}... ${avail.length > 0 ? `[Next Slots: ${avail.join(', ')}]` : '[No immediate slots]'}`;
        }).join('\n');

        const blogContext = posts.slice(0, 5).map(p => `- Blog: ${p.title} (${p.excerpt})`).join('\n');
        const faqContext = FAQS.map(f => `Q: ${f.q}\nA: ${f.a}`).join('\n');

        const systemPrompt = `You are the "Wonders of Rome Assistant", a high-end, expert AI travel concierge for "${site?.title || 'Wonders of Rome'}".
You provide specific, data-driven advice about visiting Rome, the Vatican, and booking our tours.

SITE INFO:
${site?.seo?.metaDescription || ''}
WhatsApp: ${site?.whatsappNumber || ''}
Email: ${site?.contactEmail || ''}

CURRENT TOUR CATALOG & LIVE AVAILABILITY (Next 14 Days):
${tourContext}

LATEST ARTICLES & GUIDES:
${blogContext}

POLICIES & COMMON QUESTIONS:
${faqContext}

STRICT GUIDELINES:
- ALWAYS identify yourself as the "Wonders of Rome Assistant" if asked.
- NEVER give generic responses. Always refer to specific tours or blog posts when relevant.
- If a user asks "When is the next Vatican tour?", look at the availability in the catalog above and give exact dates/times.
- Use Italian flair (Ciao, Benvenuti, Prego) but remain professional.
- Conciseness is key: 2-3 detailed sentences are better than long paragraphs.
- If a specific tour is fully booked or not listed, suggest an alternative from the catalog or direct them to WhatsApp.
- If asked about dress codes or arrival times, use the specific policy data provided.`;

        // 3. Call AI (Prefer Groq for speed, fallback to Gemini)
        let reply = '';
        const groqKey = process.env.GROQ_API_KEY;
        const geminiKey = process.env.GEMINI_API_KEY;

        if (groqKey) {
            try {
                const groqRes = await fetch(AI_PROVIDERS.groq.url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': AI_PROVIDERS.groq.authHeader(groqKey),
                    },
                    body: JSON.stringify({
                        model: AI_PROVIDERS.groq.models.balanced,
                        messages: [
                            { role: 'system', content: systemPrompt },
                            ...history.map((h: any) => ({ role: h.role === 'assistant' ? 'assistant' : 'user', content: h.content })),
                            { role: 'user', content: message }
                        ],
                        temperature: 0.5,
                        max_tokens: 600,
                    }),
                });

                if (groqRes.ok) {
                    const data = await groqRes.json();
                    reply = data?.choices?.[0]?.message?.content;
                } else {
                    const err = await groqRes.text();
                    console.error('[Groq Error]:', groqRes.status, err);
                }
            } catch (e) {
                console.error('[Groq Exception]:', e);
            }
        }

        if (!reply && geminiKey) {
            try {
                const geminiRes = await fetch(AI_PROVIDERS.gemini.url(geminiKey), {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [
                            { role: 'user', parts: [{ text: `SYSTEM: ${systemPrompt}` }] },
                            ...history.map((h: any) => ({ 
                                role: h.role === 'assistant' ? 'model' : 'user', 
                                parts: [{ text: h.content }] 
                            })),
                            { role: 'user', parts: [{ text: message }] }
                        ],
                        generationConfig: { temperature: 0.5, maxOutputTokens: 600 }
                    }),
                });
                if (geminiRes.ok) {
                    const data = await geminiRes.json();
                    reply = data?.candidates?.[0]?.content?.parts?.[0]?.text;
                } else {
                    const err = await geminiRes.text();
                    console.error('[Gemini Error]:', geminiRes.status, err);
                }
            } catch (e) {
                console.error('[Gemini Exception]:', e);
            }
        }

        if (!reply) {
            reply = "I'm currently perfecting my espresso recipe! Please try again in a moment, or click the WhatsApp button above to chat directly with our team.";
        }

        return NextResponse.json({ reply });

    } catch (err) {
        console.error('Chat API Error:', err);
        return NextResponse.json({ reply: "I'm having a bit of trouble right now. Please try again later!" }, { status: 500 });
    }
}
