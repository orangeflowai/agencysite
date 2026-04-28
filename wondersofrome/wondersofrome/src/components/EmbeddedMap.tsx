'use client';

interface EmbeddedMapProps {
    location: string;       // text address (meetingPoint) — used as fallback
    locationUrl?: string;   // Google Maps URL from Sanity `location` field
    className?: string;
}

/**
 * Converts a regular Google Maps URL to an embeddable iframe src.
 * Handles share links, place links, and search links.
 */
function toEmbedUrl(url: string, fallbackAddress: string): string {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

    try {
        // Already an embed URL — use as-is
        if (url.includes('google.com/maps/embed')) return url;

        // Extract coordinates from /place/.../@lat,lng or /@lat,lng
        const coordMatch = url.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
        if (coordMatch) {
            const [, lat, lng] = coordMatch;
            return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}`;
        }

        // Extract place from /place/PlaceName/
        const placeMatch = url.match(/\/place\/([^/@?]+)/);
        if (placeMatch) {
            const placeName = decodeURIComponent(placeMatch[1].replace(/\+/g, ' '));
            return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(placeName)}`;
        }

        // Extract query param ?q=...
        const qMatch = url.match(/[?&]q=([^&]+)/);
        if (qMatch) {
            return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${qMatch[1]}`;
        }
    } catch {
        // fall through to address fallback
    }

    // Fallback: use the text address
    return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(fallbackAddress + ', Rome, Italy')}`;
}

export default function EmbeddedMap({ location, locationUrl, className = '' }: EmbeddedMapProps) {
    const embedUrl = locationUrl
        ? toEmbedUrl(locationUrl, location)
        : `https://www.google.com/maps/embed/v1/place?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}&q=${encodeURIComponent(location + ', Rome, Italy')}`;

    return (
        <div className={`w-full rounded-2xl overflow-hidden border-2 border-border shadow-lg ${className}`}>
            <iframe
                width="100%"
                height="400"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={embedUrl}
                title={`Map showing ${location}`}
            />
        </div>
    );
}
