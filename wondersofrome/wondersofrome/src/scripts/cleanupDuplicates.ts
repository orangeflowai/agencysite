
import { createClient } from 'next-sanity'
import * as dotenv from 'dotenv'
import path from 'path'

dotenv.config({ path: path.resolve(process.cwd(), '.env') })

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
    apiVersion: '2024-01-01',
})

async function cleanup() {
    const tours = await client.fetch(`*[_type == "tour"]{_id, _type, title, "slug": slug.current, mainImage, gallery, "isNew": _id match "tour-*"}`);

    // Group by slug
    const groups: Record<string, any[]> = {};
    tours.forEach((t: any) => {
        const s = t.slug;
        if (!groups[s]) groups[s] = [];
        groups[s].push(t);
    });

    const transaction = client.transaction();
    let deletedCount = 0;
    let updatedCount = 0;

    for (const slug in groups) {
        const group = groups[slug];
        if (group.length <= 1) continue;

        console.log(`Processing duplicates for ${slug} (${group.length} docs)`);

        // Find "Master" (The New one with ID 'tour-...')
        let master = group.find(t => t._id.startsWith('tour-'));
        // If no 'tour-' ID, just pick the one with most keys? or the last one?
        // Let's look for one with 'isNew' true.
        if (!master) {
            // Fallback: Pick the one that looks "richest"? Or just first.
            master = group[0];
        }

        const others = group.filter(t => t._id !== master._id);

        let masterNeedsUpdate = false;
        const updates: any = {};

        // For each other doc, check if we can salvage images
        for (const other of others) {
            // If master has no mainImage, but other does, steal it
            if (!master.mainImage && other.mainImage) {
                updates.mainImage = other.mainImage;
                master.mainImage = other.mainImage; // Update local to prevent overwrite by next
                masterNeedsUpdate = true;
                console.log(`  -> Recovered Main Image from ${other._id}`);
            }

            // If master has no gallery, but other does, steal it
            if ((!master.gallery || master.gallery.length === 0) && (other.gallery && other.gallery.length > 0)) {
                updates.gallery = other.gallery;
                master.gallery = other.gallery;
                masterNeedsUpdate = true;
                console.log(`  -> Recovered Gallery from ${other._id}`);
            }

            // Delete the other
            transaction.delete(other._id);
            deletedCount++;
        }

        if (masterNeedsUpdate) {
            transaction.patch(master._id, p => p.set(updates));
            updatedCount++;
        }
    }

    if (deletedCount > 0 || updatedCount > 0) {
        console.log(`Committing changes: Deleting ${deletedCount} duplicates, Updating ${updatedCount} masters.`);
        await transaction.commit();
        console.log("Cleanup complete.");
    } else {
        console.log("No duplicates found to cleanup.");
    }
}

cleanup();
