import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'etutpkdi',
  dataset: 'production',
  token: 'sk42a38sOo3f9idY6W9OVH6Eys0hP9rxG9SRHwpmaAxEa50jltNiql25q7NtzCDX7xNYOqeZxNQB7qIZZ87T1kYBboQFi7J9vz5LcbdSxUnEqd2p4aqCvkFDrZ7AY1pQxAcfLba1AwICGq51CtpsDNpckgG2AUCHUjJePhHqHpBJKJ6uiVD6',
  apiVersion: '2025-01-01',
  useCdn: false,
})

async function linkToursToSite() {
  console.log('🔗 Linking tours back to site document...')
  try {
    const site = await client.fetch('*[_type == "site" && slug.current == "romanvaticantour"][0]')
    if (!site) {
        console.error('❌ Site not found')
        return
    }
    
    const tours = await client.fetch('*[_type == "tour"]')
    console.log(`🔍 Found ${tours.length} tours to update.`)

    for (const tour of tours) {
      console.log(`  Linking: "${tour.title}"`)
      await client.patch(tour._id)
        .set({ 
          sites: [{ _type: 'reference', _ref: site._id, _key: site._id }]
        })
        .commit()
    }

    console.log('🎉 All tours linked to site!')
  } catch (err) {
    console.error('❌ Error linking tours:', err.message)
  }
}

linkToursToSite()
