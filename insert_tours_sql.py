#!/usr/bin/env python3
"""
Insert all tours directly into PostgreSQL — bypasses Payload API entirely.
Uses the Payload schema: tours table + related array tables.
"""
import json, urllib.request, urllib.parse, sys, time, re

SANITY_TOKEN = "skyJ0deue49BLM0SSS1CyMjc6pr33oUA7z5a6FKiPkWM61ETlIGHhOYGyHTzCrRP1EETBKObLR8yj6gvf7H2DNAv5C7iMT0NPQq5bdkIzNCDRi6ElWyQM51Q6Ja53qwqnZLrD7Wepx3MqjJfSbQGoBgP5XU9kyrPxj5qj93LXI8Vb6TRuUDw"

R2 = "https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos"
R2_IMGS = {
    "vatican":     [f"{R2}/pexels-akarsh-chandran-2156074716-34026966.jpg", f"{R2}/pexels-giorgi-gobadze-2160475859-36770779.jpg", f"{R2}/pexels-giorgi-gobadze-2160475859-36770780.jpg"],
    "colosseum":   [f"{R2}/pexels-axp-photography-500641970-18991563.jpg",  f"{R2}/pexels-axp-photography-500641970-33009102.jpg",  f"{R2}/pexels-c1superstar-27096007.jpg"],
    "city":        [f"{R2}/pexels-alex-250137-757239.jpg", f"{R2}/pexels-efrem-efre-2786187-17282659.jpg", f"{R2}/pexels-filiamariss-30785778.jpg"],
    "hidden-gems": [f"{R2}/pexels-gaborbalazs97-34279960.jpg", f"{R2}/pexels-gaborbalazs97-34279976.jpg", f"{R2}/pexels-imagenesclau-35046617.jpg"],
    "private":     [f"{R2}/pexels-matteobasilephoto-11200578.jpg"],
}
_idx = {k: 0 for k in R2_IMGS}

def r2img(cat):
    c = (cat or "city").lower()
    if c not in R2_IMGS: c = "city"
    imgs = R2_IMGS[c]
    i = _idx[c] % len(imgs)
    _idx[c] += 1
    return imgs[i]

CAT_MAP = {
    "vatican tours": "vatican", "hidden-gems": "hidden-gems",
    "hidden gems": "hidden-gems", "special": "city",
    "colosseum": "colosseum", "vatican": "vatican", "city": "city",
    "private": "private",
}
def norm_cat(c): return CAT_MAP.get((c or "city").lower(), "city")

def make_slug(base, suffix):
    s = re.sub(r"[^a-z0-9]+", "-", base.lower()).strip("-")[:45]
    return f"{s}-{suffix}"

def sanity_fetch():
    q = urllib.parse.quote('*[_type == "tour" && ("wondersofrome" in sites[]->slug.current || "ticketsinrome" in sites[]->slug.current)]{_id,title,slug,price,duration,category,rating,reviewCount,groupSize,meetingPoint,guestTypes,includes,highlights,badge,maxParticipants,tags,excludes,importantInfo,"imageUrl":mainImage.asset->url,"sites":sites[]->slug.current}')
    req = urllib.request.Request(
        f"https://aknmkkwd.api.sanity.io/v2024-01-01/data/query/production?query={q}",
        headers={"Authorization": f"Bearer {SANITY_TOKEN}"}
    )
    with urllib.request.urlopen(req, timeout=20) as r:
        return json.loads(r.read()).get("result", [])

# Output SQL file
lines = []
lines.append("-- Tour migration SQL")
lines.append("BEGIN;")

tour_id = 1

def add_tour(title, slug, tenant, category, price, duration, group_size,
             rating, review_count, badge, max_participants, meeting_point,
             image_url, guest_types, highlights, includes, excludes,
             important_info, tags):
    global tour_id
    tid = tour_id
    tour_id += 1

    cat = norm_cat(category)
    img = image_url or r2img(cat)
    slug_clean = re.sub(r"[^a-z0-9-]", "", slug.lower().replace(" ", "-"))[:80]
    dur = (duration or "3 hours").replace("'", "''")
    gs = (group_size or "Small Group").replace("'", "''")
    mp = (meeting_point or "Rome city centre").replace("'", "''")
    t = title.replace("'", "''")
    b = (badge or "").replace("'", "''")
    img_clean = img.replace("'", "''")

    lines.append(f"""
INSERT INTO tours (id, title, slug, tenant, category, price, duration, group_size, rating, review_count, badge, max_participants, meeting_point, image_url, active, updated_at, created_at)
VALUES ({tid}, '{t}', '{slug_clean}', '{tenant}', '{cat}', {price or 49}, '{dur}', '{gs}', {rating or 4.9}, {review_count or 120}, '{b}', {max_participants or 20}, '{mp}', '{img_clean}', true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;""")

    # guest_types
    for i, gt in enumerate(guest_types or []):
        gn = (gt.get("name") or "Adult").replace("'", "''")
        gp = gt.get("price") or price or 49
        gd = (gt.get("description") or "").replace("'", "''")
        lines.append(f"INSERT INTO tours_guest_types (_order, _parent_id, id, name, price, description) VALUES ({i+1}, {tid}, gen_random_uuid()::text, '{gn}', {gp}, '{gd}') ON CONFLICT DO NOTHING;")

    # highlights
    for i, h in enumerate(highlights or []):
        hv = str(h).replace("'", "''")[:200]
        lines.append(f"INSERT INTO tours_highlights (_order, _parent_id, id, item) VALUES ({i+1}, {tid}, gen_random_uuid()::text, '{hv}') ON CONFLICT DO NOTHING;")

    # includes
    for i, inc in enumerate(includes or []):
        iv = str(inc).replace("'", "''")[:200]
        lines.append(f"INSERT INTO tours_includes (_order, _parent_id, id, item) VALUES ({i+1}, {tid}, gen_random_uuid()::text, '{iv}') ON CONFLICT DO NOTHING;")

    # excludes
    for i, exc in enumerate(excludes or []):
        ev = str(exc).replace("'", "''")[:200]
        lines.append(f"INSERT INTO tours_excludes (_order, _parent_id, id, item) VALUES ({i+1}, {tid}, gen_random_uuid()::text, '{ev}') ON CONFLICT DO NOTHING;")

    # important_info
    for i, info in enumerate(important_info or []):
        iv = str(info).replace("'", "''")[:200]
        lines.append(f"INSERT INTO tours_important_info (_order, _parent_id, id, item) VALUES ({i+1}, {tid}, gen_random_uuid()::text, '{iv}') ON CONFLICT DO NOTHING;")

    # tags
    for i, tag in enumerate(tags or []):
        tv = str(tag).replace("'", "''")[:100]
        lines.append(f"INSERT INTO tours_tags (_order, _parent_id, id, tag) VALUES ({i+1}, {tid}, gen_random_uuid()::text, '{tv}') ON CONFLICT DO NOTHING;")

# ── 1. Sanity tours for wondersofrome + ticketsinrome ─────────────────────────
print("Fetching Sanity tours...")
sanity_tours = sanity_fetch()
print(f"Got {len(sanity_tours)} tours")

for t in sanity_tours:
    sites = t.get("sites") or []
    for tenant in [s for s in ["wondersofrome", "ticketsinrome"] if s in sites]:
        suffix = "wor" if tenant == "wondersofrome" else "tir"
        base_slug = t["slug"]["current"] if isinstance(t.get("slug"), dict) else (t.get("slug") or t["title"])
        slug = make_slug(base_slug, suffix)
        img = t.get("imageUrl") or r2img(t.get("category"))
        gts = t.get("guestTypes") or [
            {"name": "Adult",  "price": t.get("price") or 49, "description": "Age 18+"},
            {"name": "Youth",  "price": round((t.get("price") or 49) * 0.85), "description": "Age 6-17"},
            {"name": "Child",  "price": 0, "description": "Under 6"},
        ]
        add_tour(
            title=t["title"], slug=slug, tenant=tenant,
            category=t.get("category"), price=t.get("price") or 49,
            duration=t.get("duration"), group_size=t.get("groupSize"),
            rating=t.get("rating"), review_count=t.get("reviewCount"),
            badge=t.get("badge"), max_participants=t.get("maxParticipants") or 20,
            meeting_point=t.get("meetingPoint"),
            image_url=img, guest_types=gts,
            highlights=t.get("highlights") or [],
            includes=t.get("includes") or [],
            excludes=t.get("excludes") or [],
            important_info=t.get("importantInfo") or [],
            tags=t.get("tags") or [],
        )

# ── 2. 10 tours for goldenrometour, romanvaticantour, romewander ──────────────
TOURS_10 = [
    {"title": "Vatican Museums & Sistine Chapel Skip-the-Line",    "slug": "vatican-museums-sistine-chapel",     "cat": "vatican",    "price": 69,  "dur": "3 hours",   "badge": "Best Seller",     "rating": 4.9, "rc": 1240, "gs": "Up to 20", "mp": "Via Tunisi 43, Rome — 5 min from Cipro Metro (Line A)", "hl": ["Skip-the-line entry", "Sistine Chapel", "Raphael Rooms", "Expert guide", "Max 20 guests"], "inc": ["Skip-the-line ticket", "Expert guide", "Instant confirmation"], "exc": ["Hotel pickup", "Gratuities"]},
    {"title": "Colosseum Arena Floor & Roman Forum Tour",           "slug": "colosseum-arena-floor-roman-forum",  "cat": "colosseum",  "price": 85,  "dur": "3 hours",   "badge": "Likely to Sell Out","rating": 4.9, "rc": 980,  "gs": "Up to 15", "mp": "Piazza del Colosseo — Metro Line B, Colosseo stop", "hl": ["Arena floor access", "Roman Forum", "Palatine Hill", "Expert guide"], "inc": ["Arena floor ticket", "Roman Forum & Palatine Hill", "Expert guide"], "exc": ["Hotel pickup", "Gratuities"]},
    {"title": "Early Morning Vatican Tour — Before the Crowds",     "slug": "early-morning-vatican-tour",         "cat": "vatican",    "price": 99,  "dur": "3 hours",   "badge": "Exclusive",       "rating": 5.0, "rc": 654,  "gs": "Up to 12", "mp": "Vatican Museums entrance, Viale Vaticano, Rome", "hl": ["Before public opening", "Sistine Chapel in silence", "Exclusive access", "Private guide"], "inc": ["Early access ticket", "Private guide", "Instant confirmation"], "exc": ["Hotel pickup", "Gratuities"]},
    {"title": "Colosseum Underground & Arena VIP Tour",             "slug": "colosseum-underground-vip",          "cat": "colosseum",  "price": 129, "dur": "2.5 hours", "badge": "VIP Experience",  "rating": 4.9, "rc": 432,  "gs": "Up to 10", "mp": "Piazza del Colosseo, Rome", "hl": ["Underground hypogeum", "Arena floor", "Gladiator cells", "Expert guide", "Max 10 guests"], "inc": ["Underground ticket", "Arena floor", "Expert guide"], "exc": ["Hotel pickup", "Gratuities"]},
    {"title": "Rome City Highlights Walking Tour",                  "slug": "rome-city-highlights-walking",       "cat": "city",       "price": 39,  "dur": "3 hours",   "badge": "",                "rating": 4.8, "rc": 876,  "gs": "Up to 20", "mp": "Trevi Fountain, Piazza di Trevi, Rome", "hl": ["Trevi Fountain", "Pantheon", "Piazza Navona", "Spanish Steps", "Expert local guide"], "inc": ["Expert guide", "Instant confirmation"], "exc": ["Museum entries", "Hotel pickup"]},
    {"title": "Borghese Gallery Skip-the-Line Tour",                "slug": "borghese-gallery-skip-the-line",     "cat": "city",       "price": 65,  "dur": "2 hours",   "badge": "Must Book Early", "rating": 4.9, "rc": 543,  "gs": "Up to 15", "mp": "Piazzale del Museo Borghese, Rome", "hl": ["Bernini sculptures", "Caravaggio paintings", "Skip-the-line", "Expert art guide"], "inc": ["Skip-the-line ticket", "Expert guide"], "exc": ["Hotel pickup", "Gratuities"]},
    {"title": "Pantheon Guided Tour with Priority Entry",           "slug": "pantheon-guided-priority-entry",     "cat": "city",       "price": 35,  "dur": "1.5 hours", "badge": "",                "rating": 4.8, "rc": 765,  "gs": "Up to 20", "mp": "Piazza della Rotonda, Rome", "hl": ["Priority entry", "Ancient Roman architecture", "Expert guide", "Oculus explained"], "inc": ["Priority entry ticket", "Expert guide"], "exc": ["Hotel pickup", "Gratuities"]},
    {"title": "Castel Sant Angelo Skip-the-Line Guided Tour",       "slug": "castel-santangelo-guided-tour",      "cat": "city",       "price": 48,  "dur": "2 hours",   "badge": "",                "rating": 4.8, "rc": 432,  "gs": "Up to 20", "mp": "Lungotevere Castello 50, Rome", "hl": ["Skip-the-line entry", "Papal apartments", "Rooftop views", "Expert guide"], "inc": ["Skip-the-line ticket", "Expert guide"], "exc": ["Hotel pickup", "Gratuities"]},
    {"title": "Rome in a Day Vatican and Colosseum Combo",          "slug": "rome-in-a-day-vatican-colosseum",    "cat": "city",       "price": 149, "dur": "8 hours",   "badge": "Best Value",      "rating": 4.9, "rc": 1100, "gs": "Up to 15", "mp": "Via Tunisi 43, Rome — near Vatican", "hl": ["Vatican Museums", "Sistine Chapel", "Colosseum", "Roman Forum", "Full day expert guide"], "inc": ["All skip-the-line tickets", "Expert guide", "Instant confirmation"], "exc": ["Hotel pickup", "Lunch", "Gratuities"]},
    {"title": "Appian Way and Catacombs Walking Tour",              "slug": "appian-way-catacombs-tour",          "cat": "hidden-gems","price": 65,  "dur": "3 hours",   "badge": "Hidden Gem",      "rating": 4.8, "rc": 387,  "gs": "Up to 15", "mp": "Via Appia Antica 78, Rome", "hl": ["Ancient Roman road", "Underground catacombs", "Christian history", "Expert guide"], "inc": ["Catacombs entry", "Expert guide", "Instant confirmation"], "exc": ["Hotel pickup", "Gratuities"]},
]

for site in ["goldenrometour", "romanvaticantour", "romewander"]:
    sfx = {"goldenrometour": "grt", "romanvaticantour": "rvt", "romewander": "rwd"}[site]
    for td in TOURS_10:
        gts = [
            {"name": "Adult", "price": td["price"],                    "description": "Age 18+"},
            {"name": "Youth", "price": round(td["price"] * 0.85),      "description": "Age 6-17, ID required"},
            {"name": "Child", "price": 0,                              "description": "Under 6, free"},
        ]
        add_tour(
            title=td["title"], slug=make_slug(td["slug"], sfx),
            tenant=site, category=td["cat"], price=td["price"],
            duration=td["dur"], group_size=td["gs"],
            rating=td["rating"], review_count=td["rc"],
            badge=td.get("badge", ""), max_participants=20,
            meeting_point=td["mp"], image_url=r2img(td["cat"]),
            guest_types=gts, highlights=td["hl"],
            includes=td["inc"], excludes=td["exc"],
            important_info=["Arrive 15 min early", "Shoulders and knees covered for Vatican tours", "Bring valid ID"],
            tags=[],
        )

# Reset sequence
lines.append(f"\nSELECT setval('tours_id_seq', {tour_id});")
lines.append("COMMIT;")

sql = "\n".join(lines)
with open("/var/www/payload-admin/insert_tours.sql", "w") as f:
    f.write(sql)

print(f"Written {len(lines)} SQL lines, {tour_id-1} tours total")
print("File: /var/www/payload-admin/insert_tours.sql")
