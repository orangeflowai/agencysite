
import { createClient } from 'next-sanity';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
    projectId: 'aknmkkwd',
    dataset: 'production',
    apiVersion: '2024-01-01',
    useCdn: false,
    token: 'skI5Tz6PrgVNk3kzDfrHPDw4uBzE9v73a5ituAqJQeth2itCP9JXNHV9HX37i1gTV2JFWN09bEtmFAYJMwQnyphVJasCU7l3YsHmmlNXp8nFVVKPSDnVoSiTQlxqxA8pQAi8qHGclRVWQxZwErWmB6aDFnFoRQnjDU5DdNhQYXzjs3JNiRib',
});

async function checkSpecificTour() {
    const slugToCheck = 'vip-vatican-gardens-guided';
    const siteId = process.env.NEXT_PUBLIC_SITE_ID;

    console.log(`Checking slug: ${slugToCheck}`);
    console.log(`Current Site ID in env: ${siteId}`);

    // 1. Check if it exists at all
    const tour = await client.fetch(`*[_type == "tour" && slug.current == $slug][0]{ title, slug, "sites": sites[]->slug.current }`, { slug: slugToCheck });

    if (!tour) {
        console.log("❌ Tour NOT found with this exact slug in Sanity.");
        // List close matches?
        const allSlugs = await client.fetch(`*[_type == "tour"].slug.current`);
        console.log("Did you mean one of these?");
        console.log(allSlugs.filter((s: string) => s.includes('vatican')).slice(0, 5));
    } else {
        console.log("✅ Tour FOUND in Sanity.");
        console.log("Tour sites:", tour.sites);

        if (tour.sites && tour.sites.includes(siteId)) {
            console.log("✅ Tour is correctly linked to the current site.");
        } else {
            console.log(`❌ Tour is NOT linked to current site '${siteId}'. It is linked to: ${JSON.stringify(tour.sites)}`);
        }
    }
}

checkSpecificTour();
