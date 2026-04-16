/**
 * R2 Image Library
 * All images hosted on Cloudflare R2 — pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev
 * 
 * NOTE: Requires public access enabled on the R2 bucket in Cloudflare dashboard:
 * R2 → romeagencywebsites → Settings → Public access → Allow Access
 */

const R2 = 'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev';

// ── Named Rome photos (Pexels originals) ──────────────────────────────────────
export const R2_ROME_PHOTOS = {
  colosseum1:    `${R2}/rome%20photos/pexels-c1superstar-27096007.jpg`,
  colosseum2:    `${R2}/rome%20photos/pexels-efrem-efre-2786187-17282659.jpg`,
  colosseum3:    `${R2}/rome%20photos/pexels-gaborbalazs97-34279960.jpg`,
  vatican1:      `${R2}/rome%20photos/pexels-alex-250137-757239.jpg`,
  vatican2:      `${R2}/rome%20photos/pexels-elifinatlasi-66733727-19215808.jpg`,
  vatican3:      `${R2}/rome%20photos/pexels-filiamariss-30785778.jpg`,
  vatican4:      `${R2}/rome%20photos/pexels-giorgi-gobadze-2160475859-36770779.jpg`,
  trevi:         `${R2}/rome%20photos/pexels-hoang-vu-257779885-16594756.jpg`,
  forum:         `${R2}/rome%20photos/pexels-holodna-29692553.jpg`,
  pantheon:      `${R2}/rome%20photos/pexels-imagenesclau-35046617.jpg`,
  streets1:      `${R2}/rome%20photos/pexels-jarod-16240019.jpg`,
  streets2:      `${R2}/rome%20photos/pexels-jcosta-36396966.jpg`,
  guide1:        `${R2}/rome%20photos/pexels-luis-antonio-funcia-3534384-30827354.jpg`,
  guide2:        `${R2}/rome%20photos/pexels-manish-jain-1176829519-36755134.jpg`,
  tourists1:     `${R2}/rome%20photos/pexels-marina-gr-109305987-9793914.jpg`,
  tourists2:     `${R2}/rome%20photos/pexels-matteobasilephoto-11200578.jpg`,
  aerial:        `${R2}/rome%20photos/pexels-mypointviews-34789638.jpg`,
  ruins1:        `${R2}/rome%20photos/pexels-nastiz-12604242.jpg`,
  ruins2:        `${R2}/rome%20photos/pexels-regan-dsouza-1315522347-33322418.jpg`,
  sunset:        `${R2}/rome%20photos/pexels-robert-schwarz-1488822070-34071463.jpg`,
  piazza:        `${R2}/rome%20photos/pexels-slimmars-13-197677686-12061560.jpg`,
  architecture1: `${R2}/rome%20photos/pexels-alexandre-ribeiro-45077807-7753126.jpg`,
  architecture2: `${R2}/rome%20photos/pexels-alina-rossoshanska-338724645-29319294.jpg`,
  architecture3: `${R2}/rome%20photos/pexels-axp-photography-500641970-18991563.jpg`,
  architecture4: `${R2}/rome%20photos/pexels-akarsh-chandran-2156074716-34026966.jpg`,
  misc1:         `${R2}/rome%20photos/5b916a89ac68f9925479bcb993cf7a5f.jpg`,
  misc2:         `${R2}/rome%20photos/7a7a1aaf8a210f4c317ff7fa391e6738.jpg`,
  misc3:         `${R2}/rome%20photos/f02afd2b49eb147f3aeac6fac279128f.jpg`,
  misc4:         `${R2}/rome%20photos/f8dc34db687eb4769b32be8032324505.jpg`,
  misc5:         `${R2}/rome%20photos/fb4d6b804484ebe61d7e113e8523b5d8.jpg`,
} as const;

// ── High-res tour images (Sanity CDN copies) ──────────────────────────────────
export const R2_TOUR_IMAGES = [
  `${R2}/022b960a3ff410e28b35f92c7631b60245c5708c-3888x2592-1.jpg`,
  `${R2}/026eb926c0771ae0fb52a67221b5d5bbd9a36dd3-4000x6000-1.jpg`,
  `${R2}/04ba65f9e977f8476f412798ac399a1923cd5572-768x1024-1.jpg`,
  `${R2}/07d1c644f21f39d365c86d424b132bfb267287f5-2448x3264-1.jpg`,
  `${R2}/095e1cf3c06bd3791379763c5634a793797bda5f-640x425-1.jpg`,
  `${R2}/11d3f702dd2f5e0a02b3581a1e3b825ef14b4714-720x1280-1.jpg`,
  `${R2}/1af4fde35a0ce969cab2dece2d6d2aae99912f01-1280x719-1.jpg`,
  `${R2}/242b11996ab336a30c54face7fa41bf81635559b-722x480-1.jpg`,
  `${R2}/28cd2d96c26ea2b342ec0d310060412aa2d9794c-5832x4921-1.jpg`,
  `${R2}/2fce6cfca50b23786f43a6a7fce5651ad2928511-4061x2714-1.jpg`,
  `${R2}/304d8713794a0e64b54c2e8a81f49f5eac54594a-1272x1920-1.jpg`,
  `${R2}/34d3546172cae8c057c763f4370ed7e1a737f1c0-3000x4000-1.jpg`,
  `${R2}/3656fde161af27709030aceb5579d62aa733818f-1944x1296-1.jpg`,
  `${R2}/3b7f089b46ff6db38602c6b87423e7c30ddcdbbd-2000x3008-1.jpg`,
  `${R2}/4e757e6d31608863acafd3a0b94ea0234a9cba63-3499x6000-1.jpg`,
  `${R2}/522a64b25093146a5794c7fae1de88b5f4e0fc9b-2100x1400-1.jpg`,
  `${R2}/536feb7012714d62a8127ea113f73a745aa65f95-3509x3271-1.jpg`,
  `${R2}/5af8a07c0e869264d686304adff750c9844b1760-1500x773-1.jpg`,
  `${R2}/710b6d8ee243f320688d560084abc170012312cf-2970x4023-1.jpg`,
  `${R2}/7177a945330b71e49bf7990fd028fad49187de69-1920x1440-1.jpg`,
  `${R2}/8ba45561fbcb0dc482bb42f251b16381e1565ef7-3264x4928-1.jpg`,
  `${R2}/8ee0a9a15331c610ce3a4c7943e1bf196c757413-9397x6265-1.jpg`,
  `${R2}/8f6471b2604eba4061a3b8a7b98cd07f63d800a7-2500x1250-1.jpg`,
  `${R2}/99b26bed4422986338b98f48cde8d017be984675-1280x960-1.jpg`,
  `${R2}/a7b2f970977f3d617c01338de81d641fb7cf3d85-2400x1600-1.jpg`,
  `${R2}/b17d78186cc1016a73581bc2a07cd561b7f2627a-2560x1707-1.jpg`,
  `${R2}/b72d0624e3ad42a10ba6d258b0e8221129d97766-2541x1915-1.jpg`,
  `${R2}/bea1ce40418f03da8f5796e8a94bd54e4154efa9-1280x960-1.jpg`,
  `${R2}/bea22c949e312041356b6f132a2e2fe0a154bbbd-1200x853-1.jpg`,
  `${R2}/c1b9a59768383c0a8c6581461ee6545935feb7c4-1000x743-1.jpg`,
  `${R2}/c5f1e362feec4dd26db613187f46f146efc69d47-1000x743-1.jpg`,
  `${R2}/c8bdf4dabd6cbf6272ca6f6d34430e9c22634131-4460x2973-1.jpg`,
  `${R2}/ca705737f643724df6d4f7ad4ca6ecc22cc8c8a9-3803x5343-1.jpg`,
  `${R2}/cea341bc124d9869c1a02bf31a9aa2281e163908-3000x4000-1.jpg`,
  `${R2}/cfd3b287b7d75712419f9ed21fc09db212d16e19-8075x5383-1.jpg`,
  `${R2}/d20da74ac9f1eed17e870e2b8f19986211cded44-2112x2816-1.jpg`,
  `${R2}/d2bcfaa1119d20b1da68999fd6cc3edd0d4f0b46-2000x1333-1.jpg`,
  `${R2}/d9248cdbb5d6c9ab53bb0f752e59625414d524d9-2592x1556-1.jpg`,
  `${R2}/dac56dbb1f9dc6f96e080bb044a1ff64e6a52ada-1280x851-1.jpg`,
  `${R2}/dff8ce77b806ee85d524c8bab9201a024587f2f5-640x423-1.jpg`,
  `${R2}/ed33f084d40cd2d184c76e94aeadc1f69c14a739-5472x3648-1.jpg`,
  `${R2}/fb78cddb9ccc74ac6991b3a2b8ffe03efd792773-1600x1224-1.webp`,
] as const;

// ── Curated sets by use-case ───────────────────────────────────────────────────

/** Hero / full-screen backgrounds — wide landscape images */
export const R2_HERO_IMAGES = [
  R2_ROME_PHOTOS.colosseum1,
  R2_ROME_PHOTOS.vatican1,
  R2_ROME_PHOTOS.trevi,
  R2_ROME_PHOTOS.aerial,
  R2_ROME_PHOTOS.sunset,
  R2_ROME_PHOTOS.architecture3,
  `${R2}/8f6471b2604eba4061a3b8a7b98cd07f63d800a7-2500x1250-1.jpg`,
  `${R2}/5af8a07c0e869264d686304adff750c9844b1760-1500x773-1.jpg`,
  `${R2}/1af4fde35a0ce969cab2dece2d6d2aae99912f01-1280x719-1.jpg`,
  `${R2}/d9248cdbb5d6c9ab53bb0f752e59625414d524d9-2592x1556-1.jpg`,
];

/** Gallery mosaic — varied aspect ratios */
export const R2_GALLERY_IMAGES = [
  R2_ROME_PHOTOS.colosseum1,
  R2_ROME_PHOTOS.vatican2,
  R2_ROME_PHOTOS.trevi,
  R2_ROME_PHOTOS.forum,
  R2_ROME_PHOTOS.pantheon,
  R2_ROME_PHOTOS.streets1,
  R2_ROME_PHOTOS.aerial,
  R2_ROME_PHOTOS.sunset,
  R2_ROME_PHOTOS.ruins1,
  R2_ROME_PHOTOS.piazza,
  R2_ROME_PHOTOS.architecture1,
  R2_ROME_PHOTOS.tourists1,
];

/** Tour card fallbacks — square-ish images */
export const R2_TOUR_CARD_FALLBACKS = [
  R2_ROME_PHOTOS.colosseum1,
  R2_ROME_PHOTOS.vatican1,
  R2_ROME_PHOTOS.trevi,
  R2_ROME_PHOTOS.forum,
  R2_ROME_PHOTOS.pantheon,
  R2_ROME_PHOTOS.ruins1,
  R2_ROME_PHOTOS.streets1,
  R2_ROME_PHOTOS.architecture2,
];

/** Category hero images */
export const R2_CATEGORY_IMAGES: Record<string, string[]> = {
  vatican: [
    R2_ROME_PHOTOS.vatican1,
    R2_ROME_PHOTOS.vatican2,
    R2_ROME_PHOTOS.vatican3,
    R2_ROME_PHOTOS.vatican4,
  ],
  colosseum: [
    R2_ROME_PHOTOS.colosseum1,
    R2_ROME_PHOTOS.colosseum2,
    R2_ROME_PHOTOS.colosseum3,
    R2_ROME_PHOTOS.ruins1,
  ],
  city: [
    R2_ROME_PHOTOS.trevi,
    R2_ROME_PHOTOS.pantheon,
    R2_ROME_PHOTOS.piazza,
    R2_ROME_PHOTOS.streets1,
  ],
  'hidden-gems': [
    R2_ROME_PHOTOS.ruins2,
    R2_ROME_PHOTOS.streets2,
    R2_ROME_PHOTOS.misc1,
    R2_ROME_PHOTOS.misc2,
  ],
};

/** Video hero */
export const R2_HERO_VIDEO = `${R2}/rome%20photos/Video_Generation_Complete.mp4`;

/** Assets */
export const R2_ASSETS = {
  logo:        `${R2}/logo.png`,
  tripadvisor: `${R2}/tripAdvisor.png`,
  heroPoster:  `${R2}/hero-poster.jpg`,
};

export const R2_BASE_URL = R2;
