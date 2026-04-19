/**
 * pexels.ts — Pexels API integration for Golden Rome Tours
 */

const PEXELS_KEY = '1cb5f7zhxpxYgMzje2lu1CZn284JWWzkthdl7WnnoM5E0grs7qdQsgVi';

export async function getPexelsImages(query: string, perPage: number = 10) {
  try {
    const res = await fetch(`https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=${perPage}`, {
      headers: {
        Authorization: PEXELS_KEY,
      },
      next: { revalidate: 86400 } // Cache for 24 hours
    });

    if (!res.ok) throw new Error('Pexels fetch failed');
    const data = await res.json();
    return data.photos.map((p: any) => ({
      url: p.src.large2x,
      alt: p.alt || query,
      photographer: p.photographer,
    }));
  } catch (e) {
    console.error('[Pexels] Error:', e);
    return [];
  }
}

// Pre-defined high-fidelity sets
export const ROME_QUERIES = {
    vatican: 'Vatican Museums Sistine Chapel',
    colosseum: 'Colosseum Rome Ancient',
    city: 'Rome Streets Trevi Fountain Pantheon',
    luxury: 'Luxury Rome Travel Architecture',
};
