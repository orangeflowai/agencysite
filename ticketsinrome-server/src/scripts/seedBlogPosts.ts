/**
 * Seed 8 SEO-optimised blog posts into Sanity for Wonders of Rome.
 * Run: npx tsx src/scripts/seedBlogPosts.ts
 *
 * Requires SANITY_API_TOKEN and NEXT_PUBLIC_SANITY_PROJECT_ID in .env
 */
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
});

// Helper: convert plain-text body to Sanity Portable Text blocks
function toBlocks(text: string) {
    return text.trim().split('\n\n').map(para => ({
        _type: 'block',
        _key: Math.random().toString(36).slice(2, 9),
        style: para.startsWith('## ') ? 'h2' : para.startsWith('### ') ? 'h3' : 'normal',
        markDefs: [],
        children: [{
            _type: 'span',
            _key: Math.random().toString(36).slice(2, 9),
            marks: [],
            text: para.replace(/^#{2,3} /, ''),
        }],
    }));
}

const POSTS = [
    {
        title: 'Best Time to Visit the Colosseum: A Month-by-Month Guide',
        slug: 'best-time-to-visit-the-colosseum',
        excerpt: 'Discover which months offer smaller crowds, cooler temperatures, and the best light for photos at Rome\'s most iconic landmark.',
        keywords: ['colosseum', 'rome travel tips', 'best time to visit rome', 'skip the line colosseum'],
        body: `## Best Time to Visit the Colosseum

The Colosseum draws roughly 7 million visitors per year — making timing everything. If you want a meaningful experience rather than a sweaty shuffle through crowds, here is what you need to know.

### April & May: The Sweet Spot

Spring is widely considered the best time to visit Rome. Temperatures sit between 15–22°C, the light is golden, and crowds are manageable. Book at least 2–3 weeks ahead for skip-the-line tickets.

### June & July: Peak Season

Summer is hot (30°C+), and the crowds are at their maximum. Lines can stretch to 3–4 hours for walk-in visitors. If you visit in summer, a guided tour with pre-booked access is essentially mandatory. Early morning slots (9 AM) are significantly cooler and less crowded.

### August: Local Holiday Month

Many Romans leave the city in August, which paradoxically makes it slightly easier to navigate central Rome — but international tourism is at its peak. Heat is intense.

### September & October: Second Best Window

Autumn brings cooler air, harvest-season food, and noticeably shorter queues. The light is warm and photogenic. October in particular is excellent value.

### November to February: Quiet and Cold

Winter offers the shortest queues and lowest prices. Rain is possible but not constant. The Colosseum itself is no less impressive, and smaller crowds mean guides can spend more time at each section. Many visitors are pleasantly surprised.

## Practical Tips

Always book timed entry tickets in advance — walk-up queues can be 2–3 hours even in winter. Arena Floor and Underground access require a separate ticket and are worth the upgrade. Dress in layers year-round; the underground sections are noticeably cooler.`,
    },
    {
        title: 'Vatican Dress Code: What to Wear (and What Will Get You Turned Away)',
        slug: 'vatican-dress-code-what-to-wear',
        excerpt: 'St. Peter\'s Basilica and the Vatican Museums enforce a strict dress code. Find out exactly what is and isn\'t allowed before you queue.',
        keywords: ['vatican dress code', 'st peter\'s basilica entry requirements', 'what to wear vatican', 'rome church dress code'],
        body: `## Vatican Dress Code: The Complete Guide

Every year, thousands of tourists are turned away at the Vatican entrance for violating the dress code. This is one of the most easily avoidable travel disappointments.

## The Rules

The Vatican enforces modesty requirements for entry to both St. Peter's Basilica and the Vatican Museums. The rules are:

- **Shoulders must be covered.** No sleeveless tops, tank tops, or off-shoulder clothing.
- **Knees must be covered.** No shorts, short skirts, or dresses above the knee.
- **No hats inside** St. Peter's Basilica (the Vatican Museums are more relaxed on this).

These rules apply regardless of age, nationality, or the weather outside.

## What Works

Light linen trousers or loose-fit jeans are ideal in summer. A light scarf or pashmina carried in your bag works perfectly — you can wrap it around bare shoulders or tie it as a skirt over shorts.

Long maxi dresses or palazzo trousers with a blouse are a very comfortable summer option that requires no adjustments at the entrance.

## What Gets You Turned Away

Flip flops alone won't cause problems, but sleeveless tops and shorts absolutely will. Enforcement is inconsistent but genuine — guards do turn people away, particularly at St. Peter's.

## Buying Scarves Outside

Street vendors sell cheap scarves outside the Vatican specifically for this purpose. They work fine, but buying one in advance saves hassle and money.`,
    },
    {
        title: 'Skip the Line at the Colosseum: Your Complete 2025 Guide',
        slug: 'skip-the-line-colosseum-guide-2025',
        excerpt: 'Booking skip-the-line access is no longer optional for the Colosseum. Here\'s exactly how it works, what it costs, and whether a guide is worth it.',
        keywords: ['skip the line colosseum', 'colosseum tickets 2025', 'rome tours', 'colosseum guided tour'],
        body: `## Skip the Line at the Colosseum

The Italian Ministry of Culture requires all Colosseum visitors to book a timed entry slot in advance. There is no longer a "just turn up" option for reasonable wait times.

## How Skip-the-Line Access Works

When you book a timed entry ticket, you arrive at your designated time window (usually 30 minutes) and enter via a dedicated queue that typically takes 5–15 minutes — versus 2–4 hours for the standard walk-up line.

Not all "skip the line" products are equal. Check that your ticket includes:
- A specific entry time (not just priority over standard)  
- The Colosseum, Roman Forum, and Palatine Hill all on one ticket
- Optional: Arena Floor or Underground access

## Is a Guided Tour Worth It?

Yes — and here's why. The Colosseum itself has minimal on-site interpretation. Most visitors walk through in 45 minutes and leave without understanding what they saw.

A guided tour of 2–2.5 hours transforms the experience. You understand the seating hierarchy, how the gladiatorial system worked, and how the Hypogeum (underground) functioned as a backstage for combat.

## What to Book

Look for tours that include:
- Arena Floor access (where gladiators entered)
- A maximum group size under 20 people
- A qualified guide with archaeological credentials
- Combined Roman Forum entry

## Ticket Prices in 2025

Standard timed entry: approximately €18–22. Guided tour with skip-the-line: €40–65 depending on group size and what's included. Private tours: €150–300+ for a group.`,
    },
    {
        title: 'Rome in 3 Days: The Definitive Itinerary',
        slug: 'rome-3-day-itinerary',
        excerpt: 'Three days is enough to see Rome\'s highlights without rushing — if you plan it right. Here\'s a day-by-day guide that actually works.',
        keywords: ['rome itinerary 3 days', 'rome travel guide', 'what to see in rome', 'rome trip planning'],
        body: `## Rome in 3 Days: Day-by-Day Itinerary

Three days in Rome is enough to cover the major sites without feeling rushed — provided you don't try to "see everything" and waste hours in transit.

## Day 1: Ancient Rome

Start early at the Colosseum (7 AM entry is ideal — coolest and least crowded). Book the Arena Floor access to stand where gladiators entered. Allow 2.5 hours with a guide.

From there, walk 5 minutes to the Roman Forum. Another 45 minutes on your own or with a guide is sufficient.

Afternoon: Palatine Hill overlooks the Forum and takes about an hour. Then walk to the Circus Maximus and on to Trastevere for dinner — one of Rome's most atmospheric neighbourhoods.

## Day 2: Vatican

An entire day is warranted for the Vatican Museums, Sistine Chapel, and St. Peter's Basilica. Book first entry (8 AM) to see the Sistine Chapel with dramatically fewer people.

After Vatican: cross the Tiber to Castel Sant'Angelo, originally built as a mausoleum and later used as a papal fortress. The rooftop view of Rome is underrated.

Evening: dinner near Piazza Navona.

## Day 3: City Rome

Day 3 is for Rome's living city. Start at the Pantheon (book timed entry — it's not free as of 2023). Then Piazza della Rotonda, Campo de' Fiori market (morning only), and the Trevi Fountain (go early or late evening for manageable crowds).

Afternoon: Spanish Steps, Villa Borghese gardens, then the Borghese Gallery if you booked ahead (required — only 360 visitors allowed per 2-hour slot).

## Practical Notes

Book everything in advance. Rome's major sites all require timed entry tickets. Walking between sites is usually faster than the metro for central Rome distances.`,
    },
    {
        title: 'Vatican Museums vs Sistine Chapel: What\'s the Difference?',
        slug: 'vatican-museums-vs-sistine-chapel',
        excerpt: 'Many first-time visitors are confused — is the Sistine Chapel inside the Vatican Museums? Do you need two separate tickets? We clear it up.',
        keywords: ['vatican museums tickets', 'sistine chapel entry', 'visiting the vatican', 'rome museums guide'],
        body: `## Vatican Museums vs Sistine Chapel: Clearing Up the Confusion

This is one of the most common questions from first-time Rome visitors, and the answer is straightforward once you know it.

## The Short Answer

The Sistine Chapel is inside the Vatican Museums. One ticket covers both. You walk through the Vatican Museums — a 7km gallery of art — before emerging into the Sistine Chapel as the final room.

## What the Vatican Museums Include

The Vatican Museums are actually a series of interconnected museums accumulated over centuries. They include:

- The Gallery of Maps — one of the most visually stunning halls in Rome
- The Raphael Rooms — four rooms painted by Raphael directly on commission from Pope Julius II
- The Gallery of Tapestries
- The Pinecone Courtyard
- And finally: the Sistine Chapel

## St. Peter's Basilica: Separate

St. Peter's Basilica is not part of the Museums ticket. It has its own (free) entry queue and can be visited separately. The climb to the dome requires a separate fee.

## Which Route to Take

Most guided tours take you through the key gallery highlights in 2–2.5 hours before the Sistine Chapel. Independent visitors should allow 3–4 hours minimum to avoid rushing.

## Practical Booking Tip

Book the first morning entry (8 AM). The Sistine Chapel is quietest in the first hour. By 10 AM it can hold 600+ people at once and becomes uncomfortably crowded.`,
    },
    {
        title: 'Hidden Rome: 7 Places Locals Love That Tourists Miss',
        slug: 'hidden-rome-locals-love',
        excerpt: 'Beyond the Colosseum and Trevi Fountain lies a Rome most visitors never see. These seven spots are genuinely off the tourist trail.',
        keywords: ['hidden gems rome', 'secret rome', 'rome off the beaten path', 'rome travel tips', 'hidden rome'],
        body: `## 7 Hidden Places in Rome That Locals Love

Rome's greatest landmarks are magnificent — but the city's real character hides in places most tourists walk straight past.

## 1. The Aventine Keyhole

At the Knights of Malta priory on the Aventine Hill, a small keyhole in the wooden door offers a precisely framed view of St. Peter's dome, perfectly centred through the hedges of three separate gardens. The effect is deliberate — designed to symbolise the unity of three sovereign states. Free, and almost always uncrowded.

## 2. Capuchin Bone Crypt

Beneath the Church of Santa Maria della Concezione near Via Veneto lie six chapels entirely decorated with the bones and skulls of 3,700 Capuchin friars. It is one of the most extraordinary spaces in Rome — and largely unknown outside specialist circles.

## 3. Centrale Montemartini

This former power station in Ostiense houses ancient Roman sculptures against a backdrop of industrial machinery. The contrast between marble gods and iron turbines is startling. Rarely more than a handful of visitors.

## 4. Piazza dei Cavalieri di Malta

The same Aventine Hill that holds the keyhole also has this extraordinarily quiet piazza designed by Piranesi. Almost no tourists. Views over Rome.

## 5. Non-Catholic Cemetery

The Protestant Cemetery near the Pyramid of Cestius is one of Rome's most peaceful corners. Keats and Shelley are buried here. Beautiful, green, and meditative.

## 6. The Appian Way on Sunday

On Sundays, the ancient Appian Way closes to motor traffic. Romans cycle and walk along a road that Julius Caesar himself would have used. Catacombs and ancient tombs line the route.

## 7. Quartiere Coppedè

A tiny neighbourhood near Villa Borghese built in an eccentric fairy-tale Art Nouveau style entirely unlike the rest of Rome. Almost no one goes there. It takes 20 minutes to walk through and is genuinely otherworldly.`,
    },
    {
        title: 'Is a Colosseum Tour Guide Worth the Money?',
        slug: 'is-colosseum-tour-guide-worth-it',
        excerpt: 'A guided Colosseum tour costs 3–4x more than a standard ticket. We break down what you actually get for the premium and whether it\'s justified.',
        keywords: ['colosseum guided tour review', 'colosseum tour guide worth it', 'rome tour value', 'colosseum skip the line guided'],
        body: `## Is a Colosseum Guided Tour Worth the Money?

Standard Colosseum entry is around €18. A guided tour with skip-the-line access runs €45–65. That's a significant premium. Here's an honest breakdown.

## What You Don't Get Without a Guide

The Colosseum has minimal on-site interpretation. Plaques are brief. Audio guides cover the basics. Most independent visitors walk through in 40–50 minutes, take photos, and leave with a vague impression of "big arena, Roman, gladiators."

What they miss: why the seating was organised by social class, how the velarium (sun shade) worked, what happened in the hours before a fight, the role of the Hypogeum as a mechanical theatre, and the specific stories of the most famous events held there.

## What a Good Guide Adds

A qualified guide with archaeological training turns 50 minutes into 2.5 hours of genuinely engaging history. You understand what you're looking at rather than photographing something you'll Google later.

The best guides specialise. A guide who focuses exclusively on Ancient Rome will give a substantially better Colosseum tour than a generalist.

## The Skip-the-Line Arithmetic

In peak season (June–September), the standard walk-up queue is 2–4 hours. If you value your time at any reasonable rate, this alone justifies the premium.

In low season, the queues are much shorter — so in January or February, a standard ticket plus audio guide is a perfectly reasonable choice.

## Our Verdict

For first-time visitors in any season: yes, a guided tour is worth it. The cost difference is €25–45, and the difference in experience is enormous. For repeat visitors who already know the history, a self-guided return is fine.`,
    },
    {
        title: 'Rome with Kids: The Essential Guide for Families',
        slug: 'rome-with-kids-family-guide',
        excerpt: 'Ancient gladiators, underground tunnels, and 2,000-year-old buildings — Rome is actually fantastic for children. Here\'s how to make it work.',
        keywords: ['rome with kids', 'rome family travel', 'family tours rome', 'colosseum kids', 'rome with children'],
        body: `## Rome with Kids: How to Make It Work

Rome is a surprisingly wonderful destination for children — provided you approach it the right way. Ancient gladiators, hidden underground passages, and the sheer scale of 2,000-year-old buildings capture young imaginations in ways that many adults underestimate.

## The Right Age

Children aged 8 and above typically engage well with guided tours. Under 8, shorter itineraries and very visual sites work best.

## Best Sites for Kids

**The Colosseum** is the obvious choice. Frame it as a gladiatorial arena — the Arena Floor access lets children stand exactly where fighters entered. The drama of the space is immediate.

**The catacombs** (Via Appia) are popular with older children — underground tunnels, early Christian history, and a genuine sense of adventure.

**Borghese Gallery and gardens** — the gardens are Rome's best for a picnic and let-off-steam session. The gallery itself is manageable in 2 hours (maximum visit time) and spectacular.

**Trastevere neighbourhood** — not a "sight" exactly, but excellent for gelato, narrow medieval streets, and outdoor restaurants where tired children can eat without judgment.

## Practical Tips

Book early-morning slots everywhere — 9 AM or earlier. Children manage heat and queues worst in mid-afternoon. Always have food and water. Rome's summer heat is intense.

Private tours are worth the premium for families — the guide tailors the story to the children's level and pace, and you don't need to keep up with a group.

Entry is free for EU citizens under 18 at all state museums, and for non-EU children under 6 at most sites.`,
    },
];

async function seedPosts() {
    // Find the wondersofrome site document
    const site = await client.fetch(`*[_type == "site" && slug.current == "wondersofrome"][0]{_id}`);
    if (!site?._id) {
        console.error('Could not find wondersofrome site document in Sanity. Make sure it exists.');
        process.exit(1);
    }

    console.log(`Found site: ${site._id}`);
    console.log(`Seeding ${POSTS.length} blog posts...`);

    for (const post of POSTS) {
        // Check if already exists
        const existing = await client.fetch(
            `*[_type == "post" && slug.current == $slug][0]{_id}`,
            { slug: post.slug }
        );

        if (existing?._id) {
            console.log(`  ⏭  Skipping "${post.title}" — already exists`);
            continue;
        }

        await client.create({
            _type: 'post',
            site: { _type: 'reference', _ref: site._id },
            title: post.title,
            slug: { _type: 'slug', current: post.slug },
            publishedAt: new Date().toISOString(),
            excerpt: post.excerpt,
            keywords: post.keywords,
            body: toBlocks(post.body),
        });

        console.log(`  ✓  Created: "${post.title}"`);
    }

    console.log('\nDone! All posts seeded.');
}

seedBlogPosts().catch(err => {
    console.error(err);
    process.exit(1);
});

async function seedBlogPosts() {
    await seedPosts();
}
