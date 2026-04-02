import { headers } from 'next/headers';
import { NextResponse } from 'next/server';

export async function validateApiKey() {
    const headersList = await headers();
    const apiKey = headersList.get('x-api-key');

    // For development/testing, if no API key is specified in env, allow it.
    // In production, require it.
    const expectedKey = process.env.HUB_API_KEY;
    
    if (expectedKey && apiKey !== expectedKey) {
        return NextResponse.json({ error: 'Unauthorized: Invalid API Key' }, { status: 401 });
    }
    
    return null; // Valid
}
