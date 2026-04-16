import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'aknmkkwd',
  dataset: 'production',
  token: 'skZuVqFxy5UDG0uol7abxfDksH7TV3W9cc6VYHvPOocXnOPUbJGKMnZNDcC1hQMr37lRJGz0ufQbWwNUtgy4UjMp3omPFOgTl4Fim28sBW32WaRR1Yd166DD10XcqQGueN302CBWs5L71QpkFfwIFJN2juWdgdr77kDUbE4S8FD2Xsk2p9E1',
  apiVersion: '2024-01-01',
  useCdn: false,
})

const SITE_ID = 'iOvifNJOn8K24O0839uibh'

const newTours = [
  { title: 'Vatican Museums Skip-the-Line + Audio Guide', slug: 'vatican-museums-skip-line-audio-guide', category: 'vatican', price: 39, duration: '3 hours', rating: 4.9, reviewCount: 847, badge: 'Best Seller', meetingPoint: 'Via dei Musei Vaticani, Vatican City', maxParticipants: 20 },
  { title: "St. Peter's Basilica Dome Climb & Crypt Tour", slug: 'st-peters-basilica-dome-crypt', category: 'vatican', price: 45, duration: '2.5 hours', rating: 4.8, reviewCount: 523, badge: 'Popular', meetingPoint: "St. Peter's Square, Vatican City", maxParticipants: 12 },
  { title: 'Vatican Gardens Private Walking Tour', slug: 'vatican-gardens-private-tour', category: 'vatican', price: 89, duration: '2 hours', rating: 5.0, reviewCount: 189, badge: 'Exclusive', meetingPoint: 'Vatican Museums Entrance, Viale Vaticano', maxParticipants: 8 },
  { title: 'Colosseum Arena Floor + Underground Tour', slug: 'colosseum-arena-floor-underground', category: 'colosseum', price: 65, duration: '3 hours', rating: 4.9, reviewCount: 1204, badge: 'Top Rated', meetingPoint: 'Colosseum Metro Station, Piazza del Colosseo', maxParticipants: 15 },
  { title: 'Rome in a Day: Vatican + Colosseum Combo', slug: 'rome-in-a-day-vatican-colosseum-combo', category: 'city', price: 119, duration: '8 hours', rating: 4.9, reviewCount: 678, badge: 'Best Value', meetingPoint: 'Piazza Risorgimento, near Vatican', maxParticipants: 12 },
  { title: 'Borghese Gallery Skip-the-Line Tour', slug: 'borghese-gallery-skip-line-tour', category: 'city', price: 55, duration: '2 hours', rating: 4.9, reviewCount: 412, badge: 'Must See', meetingPoint: 'Borghese Gallery Entrance, Piazzale Scipione Borghese 5', maxParticipants: 10 },
  { title: 'Trastevere & Jewish Ghetto Food Tour', slug: 'trastevere-jewish-ghetto-food-tour', category: 'city', price: 75, duration: '3.5 hours', rating: 4.8, reviewCount: 334, badge: 'Foodie Favourite', meetingPoint: "Campo de' Fiori, Rome", maxParticipants: 12 },
  { title: 'Pantheon & Piazzas Walking Tour', slug: 'pantheon-piazzas-walking-tour', category: 'city', price: 35, duration: '2.5 hours', rating: 4.7, reviewCount: 891, badge: 'Great Value', meetingPoint: 'Piazza della Rotonda (Pantheon), Rome', maxParticipants: 20 },
  { title: 'Castel Sant\'Angelo Skip-the-Line Tour', slug: 'castel-santangelo-skip-line-tour', category: 'city', price: 42, duration: '2 hours', rating: 4.8, reviewCount: 267, badge: 'Hidden Gem', meetingPoint: 'Lungotevere Castello 50, Rome', maxParticipants: 15 },
  { title: 'Ostia Antica Day Trip from Rome', slug: 'ostia-antica-day-trip', category: 'city', price: 58, duration: '5 hours', rating: 4.7, reviewCount: 198, badge: 'Off the Beaten Path', meetingPoint: 'Roma Termini Station, Platform 1', maxParticipants: 20 },
]

async function main() {
  console.log(`Seeding ${newTours.length} tours for romanvaticantour...`)
  for (const tour of newTours) {
    const existing = await client.fetch(`*[_type == "tour" && slug.current == $slug][0]._id`, { slug: tour.slug })
    if (existing) { console.log(`  ↩ Skip: ${tour.slug}`); continue }
    await client.create({
      _type: 'tour', title: tour.title,
      slug: { _type: 'slug', current: tour.slug },
      category: tour.category, price: tour.price, duration: tour.duration,
      rating: tour.rating, reviewCount: tour.reviewCount, badge: tour.badge,
      meetingPoint: tour.meetingPoint, maxParticipants: tour.maxParticipants,
      isActive: true, sites: [{ _type: 'reference', _ref: SITE_ID }],
    })
    console.log(`  ✓ ${tour.title}`)
  }
  console.log('Done!')
}
main().catch(console.error)
