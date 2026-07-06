/**
 * Seed audio guide sights into Sanity — matches R2 bucket structure exactly.
 *
 * R2 structure:  {lang}/{slug}/deep.mp3  (12 languages, 11 sights)
 * Public URL:    https://pub-7389b9102db544bb85bdf6f8e1417995.r2.dev
 *
 * Usage:  npx tsx src/scripts/seedSights.ts
 */

import { createClient } from '@sanity/client'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN!

const R2_PUBLIC = 'https://pub-7389b9102db544bb85bdf6f8e1417995.r2.dev'

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

// Languages that have audio files in R2
const LANGS = ['en', 'it', 'es', 'fr', 'de', 'ar', 'ja', 'ko', 'pl', 'pt', 'ru', 'zh']

// Track types — R2 currently has deep.mp3 only. Quick and Kids are placeholders.
const TRACK_TYPES = ['quick', 'deep', 'kids'] as const

function makeAudio(lang: string, slug: string) {
  const tracks: Record<string, Record<string, unknown>> = {}
  for (const track of TRACK_TYPES) {
    // Deep tracks exist for all langs/slugs. Quick and Kids are placeholders.
    const hasFile = track === 'deep'
    tracks[`audio${track.charAt(0).toUpperCase() + track.slice(1)}`] = {
      _type: 'object',
      url: hasFile ? `${R2_PUBLIC}/${lang}/${slug}/${track}.mp3` : undefined,
      duration: track === 'quick' ? 120 : track === 'deep' ? 600 : 300,
    }
  }
  return tracks
}

interface SightInput {
  name: string
  name_it: string
  slug: string
  category: 'ancient' | 'religious' | 'museum' | 'piazza' | 'other'
  pack: 'essential' | 'full'
  description: string
  lat: number
  lng: number
  radius?: number
  tips?: string[]
  kidsMyth?: string
}

const sights: SightInput[] = [
  {
    name: 'Colosseum',
    name_it: 'Colosseo',
    slug: 'colosseum',
    category: 'ancient',
    pack: 'essential',
    description: 'The iconic Flavian Amphitheatre, completed in 80 AD. It held over 50,000 spectators for gladiatorial contests, animal hunts, and mock naval battles. A testament to Roman engineering that has endured for nearly 2,000 years.',
    lat: 41.8902, lng: 12.4922, radius: 50,
    tips: ['Book skip-the-line tickets weeks in advance', 'Visit early morning or late afternoon to avoid crowds', 'The upper tiers offer the best photo angles of the Forum'],
    kidsMyth: 'Legend says a Roman sorcerer buried a golden egg under the Colosseum. When it cracks, Rome will fall and the Colosseum will turn to dust!',
  },
  {
    name: 'Roman Forum',
    name_it: 'Foro Romano',
    slug: 'forum',
    category: 'ancient',
    pack: 'essential',
    description: 'The beating heart of ancient Rome — a sprawling valley of temples, basilicas, and public squares where politics, commerce, and religion intertwined for over a millennium. Walk the Via Sacra where triumphant generals once paraded.',
    lat: 41.8925, lng: 12.4853, radius: 60,
    tips: ['Combine with Palatine Hill ticket — they share one entrance', 'Download a map before visiting — it is easy to get lost', 'The Temple of Saturn columns are the most photographed spot'],
  },
  {
    name: 'Pantheon',
    name_it: 'Pantheon',
    slug: 'pantheon',
    category: 'religious',
    pack: 'essential',
    description: 'The best-preserved monument of ancient Rome — a temple dedicated to all gods, rebuilt by Emperor Hadrian around 126 AD. Its unreinforced concrete dome, with a central oculus open to the sky, remains the largest of its kind ever built.',
    lat: 41.8986, lng: 12.4769, radius: 30,
    tips: ['Entry is free — but book weekend slots in advance', 'Visit when it rains to see water falling through the oculus', "Raphael's tomb is inside, to the left of the main altar"],
    kidsMyth: 'The oculus — the big hole in the roof — was made by a giant who punched through the dome while escaping angry Roman gods!',
  },
  {
    name: 'Sistine Chapel',
    name_it: 'Cappella Sistina',
    slug: 'sistine-chapel',
    category: 'religious',
    pack: 'essential',
    description: "The Pope's private chapel and the site of papal conclaves. Michelangelo's ceiling frescoes — nine scenes from Genesis including the Creation of Adam — and his awe-inspiring Last Judgment on the altar wall make this the crown jewel of Renaissance art.",
    lat: 41.9029, lng: 12.4545, radius: 20,
    tips: ['The chapel is at the END of the Vatican Museums route — plan accordingly', 'Silence is strictly enforced; guards will shush you', 'No photography allowed inside'],
  },
  {
    name: "St. Peter's Basilica",
    name_it: 'Basilica di San Pietro',
    slug: 'st-peters-basilica',
    category: 'religious',
    pack: 'essential',
    description: "The largest church in Christendom — built over the tomb of Saint Peter, the first Pope. Michelangelo's soaring dome, Bernini's bronze baldacchino, and the Pietà together create the most important pilgrimage site in the Catholic world.",
    lat: 41.9022, lng: 12.4533, radius: 40,
    tips: ['Entry to the basilica is free but security lines can be very long', 'Climb the dome for the best panorama of Rome — 551 steps', 'Dress code strictly enforced: covered shoulders and knees'],
  },
  {
    name: 'Vatican Museums',
    name_it: 'Musei Vaticani',
    slug: 'vatican-museums',
    category: 'museum',
    pack: 'essential',
    description: "One of the world's greatest art collections — over 70,000 works spanning ancient Egypt to modern religious art. The 7 km of galleries culminate in the Sistine Chapel ceiling, Michelangelo's supreme masterpiece painted between 1508-1512.",
    lat: 41.9065, lng: 12.4536, radius: 50,
    tips: ['Book the earliest morning slot or an evening opening for fewer crowds', 'The Pinecone Courtyard has a great café halfway through', 'The spiral staircase at the exit is a masterpiece itself'],
  },
  {
    name: 'Vatican Pinacoteca',
    name_it: 'Pinacoteca Vaticana',
    slug: 'vatican-pinacoteca',
    category: 'museum',
    pack: 'full',
    description: "The Vatican's extraordinary painting gallery — often overlooked by visitors rushing to the Sistine Chapel. Houses masterpieces by Raphael, Caravaggio, Leonardo da Vinci, and Giotto in a quiet, contemplative setting spread across 18 rooms.",
    lat: 41.9062, lng: 12.4539, radius: 20,
    tips: ['Often nearly empty — a peaceful escape from the crowded museums', "Don't miss Raphael's last painting, the Transfiguration", 'Included in standard Vatican Museums ticket'],
  },
  {
    name: 'Heart of Rome',
    name_it: 'Cuore di Roma',
    slug: 'heart',
    category: 'piazza',
    pack: 'essential',
    description: 'A walking journey through the historic center — from the Trevi Fountain and Spanish Steps to Piazza Navona and the Pantheon. Experience the living, breathing heart of the Eternal City where Baroque grandeur meets everyday Roman life.',
    lat: 41.8992, lng: 12.4794, radius: 100,
    tips: ['Best explored on foot — wear comfortable shoes', 'Start at Piazza del Popolo and work your way south', 'Gelato at Giolitti near the Pantheon is a must'],
  },
  {
    name: 'Trastevere',
    name_it: 'Trastevere',
    slug: 'trastevere',
    category: 'other',
    pack: 'full',
    description: "Rome's most charming neighborhood — a maze of ivy-draped alleyways, medieval churches, and vibrant piazzas on the west bank of the Tiber. By day, laundry flutters above cobblestone lanes; by night, it becomes Rome's favorite dining and nightlife district.",
    lat: 41.8875, lng: 12.4703, radius: 80,
    tips: ['Visit Santa Maria in Trastevere — one of Rome\'s oldest churches', 'Piazza Trilussa is the local evening gathering spot', 'Try theSupplì (fried rice balls) at any forno'],
  },
  {
    name: 'Jewish Ghetto',
    name_it: 'Ghetto Ebraico',
    slug: 'jewish-ghetto',
    category: 'other',
    pack: 'full',
    description: "One of the oldest Jewish communities in the world, established in 1555. This atmospheric quarter along the Tiber River is rich with history, kosher bakeries, and the haunting Stolpersteine — brass memorial stones embedded in the cobblestones. The Great Synagogue stands as its magnificent centerpiece.",
    lat: 41.8924, lng: 12.4779, radius: 40,
    tips: ['Try the carciofi alla giudia (fried artichokes) — a Roman-Jewish specialty', 'The Jewish Museum offers excellent guided tours', 'Visit the Portico d\'Ottavia — ancient Roman ruins within the quarter'],
  },
  {
    name: 'Ostia Antica',
    name_it: 'Ostia Antica',
    slug: 'ostia-antica',
    category: 'ancient',
    pack: 'full',
    description: "Rome's better-preserved answer to Pompeii — the ancient port city at the mouth of the Tiber. Wander through remarkably intact apartment buildings, taverns, baths, and a stunning amphitheater. Just 30 minutes from central Rome, it offers an immersive walk through daily Roman life without the crowds.",
    lat: 41.7558, lng: 12.2917, radius: 60,
    tips: ['Take the Roma-Lido train from Piramide station — about 30 minutes', 'Bring water and snacks — the site is large with limited facilities', 'The Thermopolium (ancient fast-food counter) still has its marble counter intact'],
    kidsMyth: 'Ancient sailors believed Neptune himself guarded this harbor city. They left tiny terracotta offerings at the temple before every voyage to ensure safe passage!',
  },
]

async function main() {
  // Step 1: Delete all existing sight documents
  console.log('Cleaning up old sights...')
  try {
    const existing = await client.fetch(`*[_type == "sight"]._id`)
    if (existing.length > 0) {
      const transaction = client.transaction()
      for (const id of existing) {
        transaction.delete(id)
      }
      await transaction.commit()
      console.log(`  Deleted ${existing.length} old sights`)
    } else {
      console.log('  No existing sights to delete')
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error(`  Delete failed: ${msg}`)
  }

  // Step 2: Create new sights with correct R2 audio URLs
  console.log(`\nSeeding ${sights.length} sights with R2 audio URLs...\n`)

  for (const sight of sights) {
    const doc: Record<string, unknown> = {
      _type: 'sight',
      _id: `sight-${sight.slug}`,
      name: sight.name,
      name_it: sight.name_it,
      slug: { _type: 'slug', current: sight.slug },
      category: sight.category,
      pack: sight.pack,
      description: sight.description,
      lat: sight.lat,
      lng: sight.lng,
      radius: sight.radius || 25,
      tips: sight.tips || [],
      kidsMyth: sight.kidsMyth || '',
    }

    for (const lang of LANGS) {
      doc[`audio_${lang}`] = makeAudio(lang, sight.slug)
    }

    try {
      await client.createOrReplace(doc)
      console.log(`  ✓ ${sight.name} (${sight.slug})`)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`  ✗ ${sight.name}: ${msg}`)
    }
  }

  console.log(`\nDone. ${sights.length} sights with ${LANGS.length} languages each.`)
  console.log(`Audio URLs: ${R2_PUBLIC}/{lang}/{slug}/deep.mp3`)
}

main()
