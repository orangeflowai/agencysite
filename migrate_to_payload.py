#!/usr/bin/env python3
"""
Migrate Sanity tours to Payload CMS + create 10 tours for 3 sites
"""
import json, urllib.request, urllib.error, time, sys, re

SANITY_TOKEN = "skyJ0deue49BLM0SSS1CyMjc6pr33oUA7z5a6FKiPkWM61ETlIGHhOYGyHTzCrRP1EETBKObLR8yj6gvf7H2DNAv5C7iMT0NPQq5bdkIzNCDRi6ElWyQM51Q6Ja53qwqnZLrD7Wepx3MqjJfSbQGoBgP5XU9kyrPxj5qj93LXI8Vb6TRuUDw"
PAYLOAD_URL   = "http://localhost:3003"
PAYLOAD_TOKEN = sys.argv[1] if len(sys.argv) > 1 else ""

R2 = "https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos"
R2_IMGS = {
    "vatican":     [f"{R2}/pexels-akarsh-chandran-2156074716-34026966.jpg", f"{R2}/pexels-giorgi-gobadze-2160475859-36770779.jpg", f"{R2}/pexels-giorgi-gobadze-2160475859-36770780.jpg", f"{R2}/pexels-giorgi-gobadze-2160475859-36770781.jpg"],
    "colosseum":   [f"{R2}/pexels-axp-photography-500641970-18991563.jpg",  f"{R2}/pexels-axp-photography-500641970-33009102.jpg",  f"{R2}/pexels-c1superstar-27096007.jpg"],
    "city":        [f"{R2}/pexels-alex-250137-757239.jpg", f"{R2}/pexels-efrem-efre-2786187-17282659.jpg", f"{R2}/pexels-filiamariss-30785778.jpg", f"{R2}/pexels-holodna-29692553.jpg"],
    "hidden-gems": [f"{R2}/pexels-gaborbalazs97-34279960.jpg", f"{R2}/pexels-gaborbalazs97-34279976.jpg", f"{R2}/pexels-imagenesclau-35046617.jpg"],
}
_img_idx = {k: 0 for k in R2_IMGS}

def r2img(cat):
    c = cat.lower() if cat else "city"
    if c not in R2_IMGS: c = "city"
    imgs = R2_IMGS[c]
    i = _img_idx[c] % len(imgs)
    _img_idx[c] += 1
    return imgs[i]

CAT_MAP = {
    "vatican tours": "vatican", "hidden-gems": "hidden-gems",
    "hidden gems": "hidden-gems", "special": "city",
    "colosseum": "colosseum", "vatican": "vatican", "city": "city",
}

def norm_cat(c):
    return CAT_MAP.get((c or "city").lower(), "city")

def make_slug(base, suffix):
    s = re.sub(r"[^a-z0-9]+", "-", base.lower()).strip("-")[:45]
    return f"{s}-{suffix}"

def post(path, data):
    body = json.dumps(data).encode()
    req = urllib.request.Request(
        f"{PAYLOAD_URL}{path}", data=body,
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {PAYLOAD_TOKEN}"},
        method="POST"
    )
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            return json.loads(r.read()), r.status
    except urllib.error.HTTPError as e:
        return json.loads(e.read()), e.code

def sanity_fetch():
    q = urllib.parse.quote('*[_type == "tour" && ("wondersofrome" in sites[]->slug.current || "ticketsinrome" in sites[]->slug.current)]{_id,title,slug,price,duration,category,rating,reviewCount,groupSize,meetingPoint,guestTypes,includes,highlights,badge,maxParticipants,tags,excludes,importantInfo,"imageUrl":mainImage.asset->url,"sites":sites[]->slug.current}')
    req = urllib.request.Request(
        f"https://aknmkkwd.api.sanity.io/v2024-01-01/data/query/production?query={q}",
        headers={"Authorization": f"Bearer {SANITY_TOKEN}"}
    )
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read()).get("result", [])

def build(t, tenant, slug_suffix):
    img = t.get("imageUrl") or r2img(t.get("category"))
    cat = norm_cat(t.get("category"))
    slug = make_slug(
        t["slug"]["current"] if isinstance(t.get("slug"), dict) else (t.get("slug") or t["title"]),
        slug_suffix
    )
    gts = t.get("guestTypes") or [
        {"name": "Adult",  "price": t.get("price") or 49, "description": "Age 18+"},
        {"name": "Youth",  "price": round((t.get("price") or 49) * 0.85), "description": "Age 6-17"},
        {"name": "Child",  "price": 0, "description": "Under 6"},
    ]
    return {
        "tenant": tenant, "title": t["title"], "slug": slug,
        "category": cat, "price": t.get("price") or 49,
        "duration": t.get("duration") or "3 hours",
        "groupSize": t.get("groupSize") or "Small Group",
        "rating": t.get("rating") or 4.9,
        "reviewCount": t.get("reviewCount") or 120,
        "badge": t.get("badge") or "",
        "maxParticipants": t.get("maxParticipants") or 20,
        "meetingPoint": t.get("meetingPoint") or "Rome city centre — exact location sent after booking",
        "guestTypes": gts,
        "highlights": t.get("highlights") or ["Expert licensed guide", "Skip-the-line access", "Small group"],
        "includes": t.get("includes") or ["Skip-the-line ticket", "Expert guide", "Instant confirmation"],
        "excludes": t.get("excludes") or ["Hotel pickup", "Gratuities"],
        "importantInfo": t.get("importantInfo") or ["Arrive 15 min early", "Shoulders & knees covered for Vatican"],
        "tags": t.get("tags") or [],
        "imageUrl": img,
        "active": True,
    }

# ── 1. Migrate wondersofrome + ticketsinrome ──────────────────────────────────
print("\n=== MIGRATING SANITY → PAYLOAD (wondersofrome + ticketsinrome) ===")
tours = sanity_fetch()
print(f"Fetched {len(tours)} tours from Sanity")

ok = err = 0
for t in tours:
    sites = t.get("sites") or []
    for tenant in [s for s in ["wondersofrome", "ticketsinrome"] if s in sites]:
        suffix = "wor" if tenant == "wondersofrome" else "tir"
        payload = build(t, tenant, suffix)
        res, status = post("/api/tours", payload)
        if status in (200, 201):
            ok += 1
            print(f"  ✓ [{tenant[:3]}] {t['title'][:55]}")
        else:
            err += 1
            print(f"  ✗ [{tenant[:3]}] {t['title'][:40]} → {str(res)[:80]}")
        time.sleep(0.08)

print(f"\n  Migrated: {ok} | Errors: {err}")

# ── 2. Create 10 tours for goldenrometour, romanvaticantour, romewander ───────
TOURS_10 = [
    {"title": "Vatican Museums & Sistine Chapel Skip-the-Line",    "slug": "vatican-museums-sistine-chapel",     "category": "vatican",    "price": 69,  "duration": "3 hours",   "badge": "Best Seller",     "rating": 4.9, "reviewCount": 1240, "groupSize": "Up to 20", "meetingPoint": "Via Tunisi 43, Rome — 5 min from Cipro Metro (Line A)", "highlights": ["Skip-the-line entry", "Sistine Chapel", "Raphael Rooms", "Expert guide", "Max 20 guests"], "includes": ["Skip-the-line ticket", "Expert guide", "Instant confirmation"], "excludes": ["Hotel pickup", "Gratuities"]},
    {"title": "Colosseum Arena Floor & Roman Forum Tour",           "slug": "colosseum-arena-floor-roman-forum",  "category": "colosseum",  "price": 85,  "duration": "3 hours",   "badge": "Likely to Sell Out","rating": 4.9, "reviewCount": 980,  "groupSize": "Up to 15", "meetingPoint": "Piazza del Colosseo — Metro Line B, Colosseo stop", "highlights": ["Arena floor access", "Roman Forum", "Palatine Hill", "Expert guide", "Skip the queue"], "includes": ["Arena floor ticket", "Roman Forum & Palatine Hill", "Expert guide"], "excludes": ["Hotel pickup", "Gratuities"]},
    {"title": "Early Morning Vatican Tour — Before the Crowds",     "slug": "early-morning-vatican-tour",         "category": "vatican",    "price": 99,  "duration": "3 hours",   "badge": "Exclusive",       "rating": 5.0, "reviewCount": 654,  "groupSize": "Up to 12", "meetingPoint": "Vatican Museums entrance, Viale Vaticano, Rome", "highlights": ["Before public opening", "Sistine Chapel in silence", "Exclusive access", "Private guide"], "includes": ["Early access ticket", "Private guide", "Instant confirmation"], "excludes": ["Hotel pickup", "Gratuities"]},
    {"title": "Colosseum Underground & Arena VIP Tour",             "slug": "colosseum-underground-vip",          "category": "colosseum",  "price": 129, "duration": "2.5 hours", "badge": "VIP Experience",  "rating": 4.9, "reviewCount": 432,  "groupSize": "Up to 10", "meetingPoint": "Piazza del Colosseo, Rome", "highlights": ["Underground hypogeum", "Arena floor", "Gladiator cells", "Expert guide", "Max 10 guests"], "includes": ["Underground ticket", "Arena floor", "Expert guide"], "excludes": ["Hotel pickup", "Gratuities"]},
    {"title": "Rome City Highlights Walking Tour",                  "slug": "rome-city-highlights-walking",       "category": "city",       "price": 39,  "duration": "3 hours",   "badge": "",                "rating": 4.8, "reviewCount": 876,  "groupSize": "Up to 20", "meetingPoint": "Trevi Fountain, Piazza di Trevi, Rome", "highlights": ["Trevi Fountain", "Pantheon", "Piazza Navona", "Spanish Steps", "Expert local guide"], "includes": ["Expert guide", "Instant confirmation"], "excludes": ["Museum entries", "Hotel pickup"]},
    {"title": "Borghese Gallery Skip-the-Line Tour",                "slug": "borghese-gallery-skip-the-line",     "category": "city",       "price": 65,  "duration": "2 hours",   "badge": "Must Book Early", "rating": 4.9, "reviewCount": 543,  "groupSize": "Up to 15", "meetingPoint": "Piazzale del Museo Borghese, Rome", "highlights": ["Bernini sculptures", "Caravaggio paintings", "Skip-the-line", "Expert art guide"], "includes": ["Skip-the-line ticket", "Expert guide"], "excludes": ["Hotel pickup", "Gratuities"]},
    {"title": "Pantheon Guided Tour with Priority Entry",           "slug": "pantheon-guided-priority-entry",     "category": "city",       "price": 35,  "duration": "1.5 hours", "badge": "",                "rating": 4.8, "reviewCount": 765,  "groupSize": "Up to 20", "meetingPoint": "Piazza della Rotonda, Rome", "highlights": ["Priority entry", "Ancient Roman architecture", "Expert guide", "Oculus explained"], "includes": ["Priority entry ticket", "Expert guide"], "excludes": ["Hotel pickup", "Gratuities"]},
    {"title": "Castel Sant'Angelo Skip-the-Line Guided Tour",       "slug": "castel-santangelo-guided-tour",      "category": "city",       "price": 48,  "duration": "2 hours",   "badge": "",                "rating": 4.8, "reviewCount": 432,  "groupSize": "Up to 20", "meetingPoint": "Lungotevere Castello 50, Rome", "highlights": ["Skip-the-line entry", "Papal apartments", "Rooftop views", "Expert guide"], "includes": ["Skip-the-line ticket", "Expert guide"], "excludes": ["Hotel pickup", "Gratuities"]},
    {"title": "Rome in a Day: Vatican & Colosseum Combo",           "slug": "rome-in-a-day-vatican-colosseum",    "category": "city",       "price": 149, "duration": "8 hours",   "badge": "Best Value",      "rating": 4.9, "reviewCount": 1100, "groupSize": "Up to 15", "meetingPoint": "Via Tunisi 43, Rome — near Vatican", "highlights": ["Vatican Museums", "Sistine Chapel", "Colosseum", "Roman Forum", "Full day expert guide"], "includes": ["All skip-the-line tickets", "Expert guide", "Instant confirmation"], "excludes": ["Hotel pickup", "Lunch", "Gratuities"]},
    {"title": "Appian Way & Catacombs Walking Tour",                "slug": "appian-way-catacombs-tour",          "category": "hidden-gems","price": 65,  "duration": "3 hours",   "badge": "Hidden Gem",      "rating": 4.8, "reviewCount": 387,  "groupSize": "Up to 15", "meetingPoint": "Via Appia Antica 78, Rome", "highlights": ["Ancient Roman road", "Underground catacombs", "Christian history", "Expert guide", "Off the beaten path"], "includes": ["Catacombs entry", "Expert guide", "Instant confirmation"], "excludes": ["Hotel pickup", "Gratuities"]},
]

print("\n=== CREATING 10 TOURS FOR 3 SITES ===")
SITE_SUFFIXES = {"goldenrometour": "grt", "romanvaticantour": "rvt", "romewander": "rwd"}

for site, suffix in SITE_SUFFIXES.items():
    print(f"\n  [{site}]")
    for td in TOURS_10:
        t = dict(td)
        t["imageUrl"] = r2img(t["category"])
        t["guestTypes"] = [
            {"name": "Adult", "price": t["price"],                   "description": "Age 18+"},
            {"name": "Youth", "price": round(t["price"] * 0.85),     "description": "Age 6-17, ID required"},
            {"name": "Child", "price": 0,                            "description": "Under 6, free"},
        ]
        payload = {
            "tenant": site, "title": t["title"],
            "slug": make_slug(t["slug"], suffix),
            "category": norm_cat(t["category"]),
            "price": t["price"], "duration": t["duration"],
            "groupSize": t["groupSize"], "rating": t["rating"],
            "reviewCount": t["reviewCount"], "badge": t.get("badge", ""),
            "maxParticipants": 20, "meetingPoint": t["meetingPoint"],
            "guestTypes": t["guestTypes"], "highlights": t["highlights"],
            "includes": t["includes"], "excludes": t["excludes"],
            "importantInfo": ["Arrive 15 min early", "Shoulders & knees covered for Vatican tours", "Bring valid ID"],
            "tags": [], "imageUrl": t["imageUrl"], "active": True,
        }
        res, status = post("/api/tours", payload)
        if status in (200, 201):
            print(f"    ✓ {t['title'][:55]}")
        else:
            print(f"    ✗ {t['title'][:45]} → {str(res)[:80]}")
        time.sleep(0.08)

# ── 3. Verify counts ──────────────────────────────────────────────────────────
print("\n=== VERIFYING PAYLOAD TOUR COUNTS ===")
for tenant in ["wondersofrome", "ticketsinrome", "goldenrometour", "romanvaticantour", "romewander"]:
    q = urllib.parse.quote(f"tenant={tenant}")
    req = urllib.request.Request(
        f"{PAYLOAD_URL}/api/tours?where[tenant][equals]={tenant}&limit=0",
        headers={"Authorization": f"Bearer {PAYLOAD_TOKEN}"}
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as r:
            d = json.loads(r.read())
            print(f"  {tenant}: {d.get('totalDocs', '?')} tours")
    except Exception as e:
        print(f"  {tenant}: ERROR {e}")

print("\n=== ALL DONE ===")
