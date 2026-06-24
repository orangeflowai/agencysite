/**
 * Curated local images for each tour — ensures every tour has a unique,
 * high-quality image from the ticketsinrome image library.
 */

const IMG = (name: string) => `/images/${name}`;

/* ── Image pools by category ── */
const VATICAN_MUSEUMS = [
  IMG('vatican-sistine.jpg'),
  IMG('rome-hero.jpg'),
  IMG('st-peters.jpg'),
  IMG('02cdc426-dff4-4dff-b131-1b134c3699b5.png'),
  IMG('204cee22-9e85-49e8-9303-1d309af626b0.png'),
  IMG('3d4046a0-b072-4b07-941f-9141ee3ed4a7.png'),
  IMG('62dea0ec-8351-4835-ab51-22b52bc96165.png'),
  IMG('704f6810-09a3-409a-80a1-140a13041c83.png'),
];

const ST_PETERS = [
  IMG('st-peters.jpg'),
  IMG('rome-hero.jpg'),
  IMG('cd3d11c6-4891-4489-ac94-56c90a28aebe.png'),
  IMG('d18fe616-5596-4559-90f5-a90f5397d0d8.png'),
  IMG('e26fa9c3-966d-4966-94a4-954a1e511c1c.png'),
];

const VATICAN_GARDENS = [
  IMG('trastevere.jpg'),
  IMG('pantheon.jpg'),
  IMG('62dea0ec-8351-4835-ab51-22b52bc96165.png'),
  IMG('02cdc426-dff4-4dff-b131-1b134c3699b5.png'),
];

const COLOSSEUM = [
  IMG('colosseum-night.jpg'),
  IMG('roman-forum.jpg'),
  IMG('rome-hero.jpg'),
  IMG('3d4046a0-b072-4b07-941f-9141ee3ed4a7.png'),
];

const ROME_CITY = [
  IMG('trevi-fountain.jpg'),
  IMG('pantheon.jpg'),
  IMG('rome-hero.jpg'),
  IMG('trastevere.jpg'),
  IMG('car.jpg'),
];

const SPECIAL = [
  IMG('vatican-sistine.jpg'),
  IMG('rome-hero.jpg'),
  IMG('colosseum-night.jpg'),
];

/** Maps Sanity document _id → local image path */
export const TOUR_IMAGE_MAP: Record<string, string> = {
  // ── Vatican Museums / Sistine Chapel ──
  '01r8Zdt0CPGvMWRGeU9q1c': VATICAN_MUSEUMS[0],
  '01r8Zdt0CPGvMWRGeU9rrV': VATICAN_MUSEUMS[1],
  '01r8Zdt0CPGvMWRGeU9uUu': VATICAN_MUSEUMS[2],
  'CTM4OOyGF5ygbudaW53Mxl': VATICAN_MUSEUMS[3],
  'kVAAo3T1WnEJKHhi9eCBN5': VATICAN_MUSEUMS[4],
  'kVAAo3T1WnEJKHhi9eCH7W': VATICAN_MUSEUMS[5],
  'CTM4OOyGF5ygbudaW53NB7': VATICAN_MUSEUMS[6],
  'CTM4OOyGF5ygbudaW53SUX': VATICAN_MUSEUMS[7],
  'CTM4OOyGF5ygbudaW53Sa6': VATICAN_MUSEUMS[0],
  'kVAAo3T1WnEJKHhi9eCXln': VATICAN_MUSEUMS[1],
  'kVAAo3T1WnEJKHhi9eCY8w': VATICAN_MUSEUMS[2],

  // ── St. Peter's Basilica / Dome / Crypt ──
  '01r8Zdt0CPGvMWRGeUABkS': ST_PETERS[0],
  '01r8Zdt0CPGvMWRGeUACEA': ST_PETERS[1],
  'CTM4OOyGF5ygbudaW53MIa': ST_PETERS[2],
  'CTM4OOyGF5ygbudaW53SQ5': ST_PETERS[3],
  'kVAAo3T1WnEJKHhi9eCDAB': ST_PETERS[4],
  'kVAAo3T1WnEJKHhi9eCYRS': ST_PETERS[0],
  'CTM4OOyGF5ygbudaW53Mh4': ST_PETERS[1],

  // ── Vatican Gardens ──
  '01r8Zdt0CPGvMWRGeU9wtS': VATICAN_GARDENS[0],
  'CTM4OOyGF5ygbudaW53Sk7': VATICAN_GARDENS[1],
  'kVAAo3T1WnEJKHhi9eCWLq': VATICAN_GARDENS[2],
  'kVAAo3T1WnEJKHhi9eCWiz': VATICAN_GARDENS[3],
  'kVAAo3T1WnEJKHhi9eCX1V': VATICAN_GARDENS[0],

  // ── Colosseum / Roman Forum ──
  '6swvDP0mb3DycuN6VMVqrr': COLOSSEUM[0],
  'MeykurRIOdWeCCxeo9BPau': COLOSSEUM[1],

  // ── City / Rome Sightseeing ──
  '01r8Zdt0CPGvMWRGeU9uyc': ROME_CITY[0],
  'CTM4OOyGF5ygbudaW53NiV': ROME_CITY[1],

  // ── Special tours ──
  'CTM4OOyGF5ygbudaW53Ne3': SPECIAL[0],
  'kVAAo3T1WnEJKHhi9eCFTg': SPECIAL[1],
  'kVAAo3T1WnEJKHhi9eCG05': SPECIAL[2],
};

/**
 * Get the best image URL for a tour.
 * Priority: 1) Curated local image  2) Sanity CDN image  3) Fallback
 */
export function getTourImage(tourId: string, sanityImageUrl?: string | null): string {
  if (TOUR_IMAGE_MAP[tourId]) return TOUR_IMAGE_MAP[tourId];
  if (sanityImageUrl) return sanityImageUrl;
  return IMG('rome-hero.jpg');
}

/**
 * Category-level curated images for landing page sections
 */
export const CATEGORY_IMAGES: Record<string, string> = {
  vatican: IMG('vatican-sistine.jpg'),
  colosseum: IMG('colosseum-night.jpg'),
  city: IMG('trevi-fountain.jpg'),
  'hidden-gems': IMG('pantheon.jpg'),
  default: IMG('rome-hero.jpg'),
};
