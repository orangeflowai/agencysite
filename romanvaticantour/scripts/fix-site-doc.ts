import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'etutpkdi',
  dataset: 'production',
  token: 'sk42a38sOo3f9idY6W9OVH6Eys0hP9rxG9SRHwpmaAxEa50jltNiql25q7NtzCDX7xNYOqeZxNQB7qIZZ87T1kYBboQFi7J9vz5LcbdSxUnEqd2p4aqCvkFDrZ7AY1pQxAcfLba1AwICGq51CtpsDNpckgG2AUCHUjJePhHqHpBJKJ6uiVD6',
  apiVersion: '2025-01-01',
  useCdn: false,
})

async function fixSite() {
  console.log('🔧 Fixing site document...')
  try {
    const site = await client.fetch('*[_type == "site"][0]')
    if (site) {
      console.log(`  Found site: ${site.title} (${site._id})`)
      await client.patch(site._id)
        .set({
          slug: { _type: 'slug', current: 'romanvaticantour' }
        })
        .commit()
      console.log('  ✅ Slug set to "romanvaticantour"')
      
      // Also link some tours if they are null
      const tours = await client.fetch('*[_type == "tour"]{_id}')
      if (tours.length > 0) {
        await client.patch(site._id)
          .set({
            tours: tours.map(t => ({ _type: 'reference', _ref: t._id, _key: t._id }))
          })
          .commit()
        console.log(`  ✅ Linked ${tours.length} tours to the site document`)
      }
    }
  } catch (err) {
    console.error('❌ Error fixing site:', err.message)
  }
}

fixSite()
