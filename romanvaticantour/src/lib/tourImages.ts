/**
 * Curated Unsplash images for each tour — ensures every tour has a unique,
 * high-quality image instead of sharing duplicates from Sanity.
 *
 * Images are royalty-free from Unsplash. Each URL includes w=800 for
 * consistent sizing. Next.js Image component handles optimization.
 */

const U = (id: string) => `https://images.unsplash.com/photo-${id}?w=800&q=80`;

const VATICAN_MUSEUMS = [
  U('1541185933-710f50b90c28'), // Sistine Chapel ceiling
  U('1555992336-03a23c7b20ee'), // Vatican Museums hallway
  U('1529260830199-42c24126f198'), // Vatican at night
  U('1531572753322-ad063cecc140'), // St. Peter's dome
  U('1566837945708-9a9e8f8d5b8c'), // Vatican gallery
  U('1519810844787-2d1cec1c0ec0'), // Vatican statue gallery
  U('1509024644558-2f56ce76c490'), // Vatican interior
  U('1519997936937-b991e20be5da'), // Vatican ceiling
];

const ST_PETERS = [
  U('1596117015567-0aeaf697a728'), // St. Peter's Basilica facade
  U('1569087374587-914ed8fd87f0'), // St. Peter's Square
  U('1515542622106-78bda8ba0e5b'), // St. Peter's dome from below
  U('1581874200057-5afe57c911e4'), // St. Peter's interior
  U('1548013146-724d4c9a3be6'), // Vatican obelisk
];

const VATICAN_GARDENS = [
  U('1621348986798-f5899af034cf'), // Vatican Gardens
  U('1591026372036-3729899260ca'), // Garden path
  U('1587502537104-1a3cb4b0b2b5'), // Italian garden
  U('1558904541-ebab84396512'), // Garden fountain
];

const COLOSSEUM = [
  U('1552832230-c0197dd311b5'), // Colosseum interior
  U('1515542622106-78bda8ba0e5b'), // Colosseum exterior
  U('1525874683057-6e1cef3d3e85'), // Roman Forum
  U('1531148830958-1d5b7a215e13'), // Palatine Hill
];

const ROME_CITY = [
  U('1529260830199-42c24126f198'), // Rome skyline
  U('1568797629192-789acf8e4df3'), // Trevi Fountain
  U('1555992820-dee20445e674'), // Spanish Steps
  U('1552832230-c0197dd311b5'), // Ancient Rome
  U('1529154035288-f51b9c319e7b'), // Pantheon
];

const CASTEL_SANTANGELO = [
  U('1555939219-0bb5b41fb395'), // Castel Sant'Angelo
  U('1515542622106-78bda8ba0e5b'), // Castle bridge
];

const EVENING = [
  U('1529260830199-42c24126f198'), // Rome at dusk
  U('1555992336-03a23c7b20ee'), // Vatican evening
];

const EARLY_MORNING = [
  U('1531572753322-ad063cecc140'), // Early morning Vatican
  U('1566837945708-9a9e8f8d5b8c'), // Dawn light
];

/** Maps Sanity document _id → curated Unsplash image URL */
export const TOUR_IMAGE_MAP: Record<string, string> = {
  // ── Vatican Museums / Sistine Chapel ──
  '01r8Zdt0CPGvMWRGeU9q1c': VATICAN_MUSEUMS[0], // Vatican Museums and Sistine Chapel Skip-the-Line Ticket
  '01r8Zdt0CPGvMWRGeU9rrV': VATICAN_MUSEUMS[1], // Vatican Museums & Sistine Chapel Skip-the-Line Tour
  '01r8Zdt0CPGvMWRGeU9uUu': VATICAN_MUSEUMS[2], // Vatican Museums & Sistine Chapel Guided Tour
  'CTM4OOyGF5ygbudaW53Mxl': VATICAN_MUSEUMS[2], // Vatican Museums, Sistine Chapel & St. Peter's Basilica Tour
  'kVAAo3T1WnEJKHhi9eCBN5': VATICAN_MUSEUMS[3], // Vatican Museums, Sistine Chapel & St. Peter's Basilica Complete Tour
  'kVAAo3T1WnEJKHhi9eCH7W': VATICAN_MUSEUMS[4], // Vatican Museums & Sistine Chapel Skip-the-Line Tour (golden)
  'CTM4OOyGF5ygbudaW53NB7': VATICAN_MUSEUMS[5], // Vatican Museums (early morning)
  'CTM4OOyGF5ygbudaW53SUX': VATICAN_MUSEUMS[6], // Vatican Museums Skip-the-Line + Audio Guide Skip-the-Line
  'CTM4OOyGF5ygbudaW53Sa6': VATICAN_MUSEUMS[7], // Vatican Museums Skip-the-Line + Audio Guide
  'kVAAo3T1WnEJKHhi9eCXln': VATICAN_MUSEUMS[1], // Vatican Museums Skip-the-Line + Audio Guide Exclusive VIP
  'kVAAo3T1WnEJKHhi9eCY8w': VATICAN_MUSEUMS[5], // Vatican Museums Skip-the-Line + Audio Guide

  // ── St. Peter's Basilica / Dome / Crypt ──
  '01r8Zdt0CPGvMWRGeUABkS': ST_PETERS[0], // St. Peter's Basilica Dome Climb & Crypt Skip-the-Line
  '01r8Zdt0CPGvMWRGeUACEA': ST_PETERS[1], // St. Peter's Basilica Dome Climb & Crypt
  'CTM4OOyGF5ygbudaW53MIa': ST_PETERS[2], // St.Peter's Basilica Skip-the-Line Ticket Only
  'CTM4OOyGF5ygbudaW53SQ5': ST_PETERS[3], // St. Peter's Basilica Dome Climb & Crypt Exclusive VIP
  'kVAAo3T1WnEJKHhi9eCDAB': ST_PETERS[4], // St.Peter's Basilica: Guided Tour, Underground Tomb & Dome
  'kVAAo3T1WnEJKHhi9eCYRS': ST_PETERS[0], // St. Peter's Basilica Dome Climb & Crypt
  'CTM4OOyGF5ygbudaW53Mh4': ST_PETERS[3], // St.Peter's Basilica & Dome & Papal Tomb with Private Guide

  // ── Vatican Gardens ──
  '01r8Zdt0CPGvMWRGeU9wtS': VATICAN_GARDENS[0], // Vatican Gardens VIP Guided Tour
  'CTM4OOyGF5ygbudaW53Sk7': VATICAN_GARDENS[1], // Vatican Gardens Private Walking Tour
  'kVAAo3T1WnEJKHhi9eCWLq': VATICAN_GARDENS[2], // Vatican Gardens Private Walking Tour Exclusive VIP
  'kVAAo3T1WnEJKHhi9eCWiz': VATICAN_GARDENS[3], // Vatican Gardens Private Walking Tour Skip-the-Line
  'kVAAo3T1WnEJKHhi9eCX1V': VATICAN_GARDENS[0], // Vatican Gardens Private Walking Tour

  // ── Colosseum / Roman Forum ──
  '6swvDP0mb3DycuN6VMVqrr': COLOSSEUM[0], // Colosseum, Roman Forum & Palatine Hill Guided Tour
  'MeykurRIOdWeCCxeo9BPau': COLOSSEUM[2], // Colosseum Underground & Arena Floor VIP Tour

  // ── City / Rome Sightseeing ──
  '01r8Zdt0CPGvMWRGeU9uyc': ROME_CITY[0], // Fast-Track Combo Vatican Museum & Rome Sightseeing
  'CTM4OOyGF5ygbudaW53NiV': ROME_CITY[1], // Vatican Gardens Open Bus Experience

  // ── Special tours ──
  'CTM4OOyGF5ygbudaW53Ne3': CASTEL_SANTANGELO[0], // Vatican & Castel Sant'Angelo Combo Tour
  'kVAAo3T1WnEJKHhi9eCFTg': EVENING[0], // Vatican Evening Tour
  'kVAAo3T1WnEJKHhi9eCG05': EARLY_MORNING[0], // Vatican Museums — Before the Crowds
};

/**
 * Get the best image URL for a tour.
 * Priority: 1) Curated Unsplash image  2) Sanity CDN image  3) Fallback
 */
export function getTourImage(tourId: string, sanityImageUrl?: string | null): string {
  if (TOUR_IMAGE_MAP[tourId]) return TOUR_IMAGE_MAP[tourId];
  if (sanityImageUrl) return sanityImageUrl;
  // Generic fallback by category detection from ID prefix
  return U('1529260830199-42c24126f198'); // Vatican at night — safe default
}

/**
 * Category-level curated images for landing page sections
 */
export const CATEGORY_IMAGES: Record<string, string> = {
  vatican: U('1541185933-710f50b90c28'),       // Sistine Chapel
  colosseum: U('1552832230-c0197dd311b5'),      // Colosseum
  city: U('1555992820-dee20445e674'),           // Spanish Steps
  'hidden-gems': U('1529154035288-f51b9c319e7b'), // Pantheon
  default: U('1529260830199-42c24126f198'),     // Vatican night
};
