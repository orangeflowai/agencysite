import { NextResponse } from 'next/server';

// Fallback slots returned when the Hub is offline (dev / no Hub running)
function buildFallbackSlots(date?: string) {
    const times = ['09:00', '10:30', '12:00', '14:00', '15:30', '17:00'];
    return times.map((time) => ({
        time,
        available_slots: Math.floor(Math.random() * 12) + 4, // 4-15 spots
        date: date ?? '',
        is_fallback: true,
    }));
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const date = searchParams.get('date') ?? undefined;
    const mode = searchParams.get('mode') ?? 'day';

    const HUB_URL = process.env.HUB_API_URL || 'http://localhost:3002';
    const HUB_API_KEY = process.env.HUB_API_KEY || '';

    try {
        const res = await fetch(`${HUB_URL}/api/v1/availability?${queryString}`, {
            headers: { 'x-api-key': HUB_API_KEY },
            cache: 'no-store',
            // Short timeout so we don't stall the UI when Hub is offline
            signal: AbortSignal.timeout(4000),
        });

        if (!res.ok) {
            console.warn(`[availability] Hub returned ${res.status} — using fallback slots`);
            return NextResponse.json(
                mode === 'month'
                    ? { days: {}, fallback: true }
                    : { slots: buildFallbackSlots(date), fallback: true }
            );
        }

        const data = await res.json();
        return NextResponse.json(data);
    } catch (err: unknown) {
        const isConnRefused =
            err instanceof Error &&
            (err.message.includes('ECONNREFUSED') || err.message.includes('fetch failed') || err.name === 'TimeoutError');

        if (isConnRefused) {
            console.warn('[availability] Hub unreachable — returning fallback slots for dev');
        } else {
            console.error('[availability] Unexpected error:', err);
        }

        return NextResponse.json(
            mode === 'month'
                ? { days: {}, fallback: true }
                : { slots: buildFallbackSlots(date), fallback: true },
            { status: 200 } // Return 200 so the widget renders correctly
        );
    }
}
