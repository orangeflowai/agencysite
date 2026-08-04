import { NextResponse } from 'next/server';
import { client } from '@/lib/sanityService';

export const dynamic = 'force-dynamic';

interface KeywordResult {
    keywords: string[];
    categories: string[];
    destinations: string[];
    activities: string[];
}

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const topic = searchParams.get('topic') || '';
        const limit = parseInt(searchParams.get('limit') || '15');

        // Fetch all tours directly from Sanity
        const tours = await client.fetch(`
            *[_type == "tour"] {
                _id,
                title,
                slug,
                description,
                category,
                tags,
                price,
                duration
            }
        `);

        // Extract keywords from tours
        const extractedKeywords = extractKeywordsFromTours(tours, topic);

        // Combine with topic-based keywords
        const topicKeywords = generateTopicKeywords(topic);

        // Merge and deduplicate
        const allKeywords = Array.from(new Set([
            ...extractedKeywords.keywords,
            ...topicKeywords,
            ...extractedKeywords.categories,
            ...extractedKeywords.destinations,
            ...extractedKeywords.activities
        ]));

        // Prioritize and limit
        const prioritized = prioritizeKeywords(allKeywords, topic, limit);

        return NextResponse.json({
            keywords: prioritized,
            categories: extractedKeywords.categories,
            destinations: extractedKeywords.destinations,
            activities: extractedKeywords.activities,
            relatedTours: extractedKeywords.relatedTours,
            suggestedInternalLinks: generateSuggestedLinks(extractedKeywords.relatedTours)
        });

    } catch (err: any) {
        console.error('Keyword extraction error:', err);
        return NextResponse.json(
            { error: err.message || 'Failed to extract keywords' },
            { status: 500 }
        );
    }
}

function extractKeywordsFromTours(tours: any[], topic: string) {
    const keywords = new Set<string>();
    const categories = new Set<string>();
    const destinations = new Set<string>();
    const activities = new Set<string>();
    const relatedTours: any[] = [];

    // Topic words for relevance scoring
    const topicWords = topic.toLowerCase().split(/\s+/);

    tours.forEach(tour => {
        const tourText = `${tour.title} ${tour.description || ''} ${tour.category || ''}`.toLowerCase();

        // Check relevance to topic
        const relevanceScore = topicWords.reduce((score, word) => {
            return score + (tourText.includes(word) ? 1 : 0);
        }, 0);

        // If relevant, add to related tours
        if (relevanceScore > 0) {
            relatedTours.push({
                _id: tour._id,
                title: tour.title,
                slug: tour.slug?.current,
                category: tour.category,
                relevance: relevanceScore
            });
        }

        // Extract from title
        if (tour.title) {
            const titleWords = tour.title.toLowerCase()
                .replace(/[^\w\s]/g, ' ')
                .split(/\s+/)
                .filter((w: string) => w.length > 3 && !isStopWord(w));
            titleWords.forEach((w: string) => keywords.add(w));
        }

        // Extract from category
        if (tour.category) {
            categories.add(tour.category.toLowerCase());
            keywords.add(tour.category.toLowerCase());
        }

        // Extract from tags
        if (tour.tags) {
            tour.tags.forEach((tag: string) => {
                keywords.add(tag.toLowerCase());

                // Categorize tags
                if (isActivity(tag)) activities.add(tag.toLowerCase());
                if (isDestination(tag)) destinations.add(tag.toLowerCase());
            });
        }

        // Extract from description
        if (tour.description) {
            const descKeywords = extractFromText(tour.description);
            descKeywords.forEach(k => keywords.add(k));
        }
    });

    // Sort related tours by relevance
    relatedTours.sort((a, b) => b.relevance - a.relevance);

    return {
        keywords: Array.from(keywords),
        categories: Array.from(categories),
        destinations: Array.from(destinations),
        activities: Array.from(activities),
        relatedTours: relatedTours.slice(0, 5) // Top 5 related tours
    };
}

function extractFromText(text: string): string[] {
    const keywords: string[] = [];

    // Common Rome tourism phrases
    const phrases = [
        'skip the line',
        'guided tour',
        'small group',
        'private tour',
        'early access',
        'vip access',
        'combo tour',
        'day trip',
        'walking tour',
        'underground',
        'roof top',
        'night tour',
        'family friendly',
        'wheelchair accessible'
    ];

    const lowerText = text.toLowerCase();
    phrases.forEach(phrase => {
        if (lowerText.includes(phrase)) {
            keywords.push(phrase);
        }
    });

    // Extract key nouns (Rome landmarks)
    const landmarks = [
        'vatican', 'colosseum', 'forum', 'pantheon', 'trevi', 'spanish steps',
        'borghese', 'sistine chapel', 'st peters', 'catacombs', 'palatine',
        'circus maximus', 'appian way', 'trastevere', 'navona'
    ];

    landmarks.forEach(landmark => {
        if (lowerText.includes(landmark)) {
            keywords.push(landmark);
        }
    });

    return keywords;
}

function generateTopicKeywords(topic: string): string[] {
    const baseKeywords: Record<string, string[]> = {
        'vatican': ['vatican museums', 'sistine chapel', 'st peters basilica', 'vatican tours', 'vatican city', 'papal audience'],
        'colosseum': ['colosseum tours', 'roman forum', 'palatine hill', 'gladiator', 'ancient rome', 'colosseo'],
        'pantheon': ['pantheon rome', 'best preserved', 'roman temple', 'piazza della rotonda'],
        'trevi': ['trevi fountain', 'fontana di trevi', 'coin toss', 'baroque fountain'],
        'food': ['food tour', 'roman cuisine', 'pasta', 'gelato', 'wine tasting', 'trastevere food'],
        'night': ['night tour', 'rome by night', 'evening tour', 'illuminated'],
        'private': ['private tour', 'personal guide', 'custom itinerary', 'exclusive'],
        'family': ['family tour', 'kids friendly', 'children activities', 'family friendly'],
        'skip': ['skip the line', 'fast track', 'priority access', 'no wait'],
        'catacombs': ['catacombs', 'underground rome', 'christian burial', 'appian way'],
        'day trip': ['day trip', 'tivoli', 'pompeii', 'florence', ' Tuscany'],
        'borghese': ['borghese gallery', 'villa borghese', 'bernini', 'caravaggio'],
        'walking': ['walking tour', 'rome on foot', 'city center', 'historic center'],
    };

    const lowerTopic = topic.toLowerCase();
    const result: string[] = [];

    // Find matching base keywords
    Object.entries(baseKeywords).forEach(([key, words]) => {
        if (lowerTopic.includes(key)) {
            result.push(...words);
        }
    });

    // Always add general Rome keywords
    result.push('rome tours', 'rome attractions', 'visit rome', 'rome travel guide');

    return result;
}

function prioritizeKeywords(keywords: string[], topic: string, limit: number): string[] {
    const topicWords = topic.toLowerCase().split(/\s+/);

    // Score each keyword
    const scored = keywords.map(keyword => {
        let score = 0;
        const lowerKeyword = keyword.toLowerCase();

        // Higher score if matches topic words
        topicWords.forEach(word => {
            if (lowerKeyword.includes(word)) score += 10;
            if (word.includes(lowerKeyword)) score += 5;
        });

        // Prefer longer, more specific keywords
        if (keyword.length > 15) score += 3;
        else if (keyword.length > 10) score += 2;
        else if (keyword.length > 5) score += 1;

        // Prefer multi-word keywords (long-tail)
        if (keyword.includes(' ')) score += 3;

        // Prefer popular search terms
        const highValueTerms = ['tour', 'tickets', 'skip', 'guided', 'private', 'best', 'top', 'visit'];
        highValueTerms.forEach(term => {
            if (lowerKeyword.includes(term)) score += 2;
        });

        return { keyword, score };
    });

    // Sort by score and take top N
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, limit).map(k => k.keyword);
}

function isStopWord(word: string): boolean {
    const stopWords = new Set([
        'the', 'and', 'for', 'with', 'from', 'that', 'this', 'have', 'has',
        'had', 'been', 'were', 'they', 'their', 'what', 'when', 'where',
        'who', 'how', 'why', 'which', 'while', 'during', 'before', 'after',
        'above', 'below', 'between', 'through', 'into', 'onto', 'upon',
        'tour', 'rome', 'your', 'will', 'can', 'our', 'all', 'but', 'not'
    ]);
    return stopWords.has(word.toLowerCase());
}

function isActivity(tag: string): boolean {
    const activities = ['walking', 'food', 'bike', 'segway', 'bus', 'cooking', 'wine', 'photography', 'art'];
    return activities.some(a => tag.toLowerCase().includes(a));
}

function isDestination(tag: string): boolean {
    const destinations = ['vatican', 'colosseum', 'forum', 'pantheon', 'trevi', 'trastevere', 'borghese'];
    return destinations.some(d => tag.toLowerCase().includes(d));
}

function generateSuggestedLinks(relatedTours: any[]): Array<{ text: string, url: string }> {
    return relatedTours.map(tour => ({
        text: tour.title,
        url: `/tour/${tour.slug}`
    }));
}
