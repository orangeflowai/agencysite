import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'gycprksj',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: 'skBy2n8wkubUQPIkFzEV4lTm16KzdJCT1c7bwzudOCsXrYRkzWzhI8RppFqgbxG7uoEw0nQDML9kud1VViPMHubFQtPXkEoCOoq5028hPv3s0snnKa40Gx4KTLnlorromo2xFKGYl8WnEIraFc9otONH7Tj9WHnSACCNwTTfVLRQaohsaT5e',
  useCdn: false,
})

// Only these 2 slugs should remain
const KEEP_SLUGS = [
  'vatican-museums-and-sistine-chapel-guided-tour',
  'vatican-museums-sistine-chapel-skip-the-line',
]

async function run() {
  const all: Array<{ _id: string; slug: string; title: string }> = await client.fetch(
    '*[_type == "tour"]{_id, "slug": slug.current, title}'
  )

  console.log('All tours in Sanity:', all.map(t => `${t.slug} (${t._id})`))

  const toDelete = all.filter(t => !KEEP_SLUGS.includes(t.slug))
  const toKeep = all.filter(t => KEEP_SLUGS.includes(t.slug))

  console.log('\nKeeping:', toKeep.map(t => t.title))
  console.log('Deleting:', toDelete.map(t => t.title))

  for (const t of toDelete) {
    await client.delete(t._id)
    console.log(`✅ Deleted: ${t.title}`)
  }

  console.log('\n✅ Done. Only the 2 Vatican tours remain.')
}

run().catch(console.error)
