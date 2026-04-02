
'use server';

import { createClient } from "next-sanity";
import { revalidatePath } from "next/cache";
import { apiVersion, dataset, projectId } from "@/sanity/env";

const client = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false, // Write operations shouldn't use CDN
    token: process.env.SANITY_API_TOKEN, // REQUIRED for write access
});

function generateKey() {
    return crypto.randomUUID().split('-')[0]; // Simple short key
}

export async function updateTour(formData: FormData) {
    if (!process.env.SANITY_API_TOKEN) {
        return { success: false, error: "Missing SANITY_API_TOKEN" };
    }

    const _id = formData.get('_id') as string;
    if (!_id) {
        return { success: false, error: "Missing Tour ID" };
    }

    try {
        const patch: any = {
            title: formData.get('title'),
            price: Number(formData.get('price')),
            duration: formData.get('duration'),
            groupSize: formData.get('groupSize'),
            category: formData.get('category'), // New
            badge: formData.get('badge'), // New
            rating: Number(formData.get('rating')), // New
            reviewCount: Number(formData.get('reviewCount')), // New
            meetingPoint: formData.get('meetingPoint') || undefined,
            maxParticipants: Number(formData.get('maxParticipants')) || undefined,
            // sites: formData.getAll('sites') // Don't overwrite sites unless explicitly creating/managing them
        };

        // Handle Guest Types (Participants)
        const guestTypesJson = formData.get('guestTypes') as string;
        if (guestTypesJson) {
            try {
                patch.guestTypes = JSON.parse(guestTypesJson);
            } catch (e) {
                console.error("Failed to parse guestTypes JSON", e);
            }
        }

        // Handle Array Fields (Split by newline or comma)
        const highlights = formData.get('highlights') as string;
        if (highlights) patch.highlights = highlights.split('\n').filter(Boolean);

        const includes = formData.get('includes') as string;
        if (includes) patch.includes = includes.split('\n').filter(Boolean);

        const excludes = formData.get('excludes') as string;
        if (excludes) patch.excludes = excludes.split('\n').filter(Boolean);

        const importantInfo = formData.get('importantInfo') as string;
        if (importantInfo) patch.importantInfo = importantInfo.split('\n').filter(Boolean);

        // Tags (Comma separated)
        const tags = formData.get('tags') as string;
        if (tags) {
            patch.tags = tags.split(',').map(t => t.trim()).filter(Boolean);
        }

        // Handle Main Image Upload
        const imageFile = formData.get('image') as File;
        if (imageFile && imageFile.size > 0) {
            console.log("Uploading new main image...", imageFile.name);
            const asset = await client.assets.upload('image', imageFile, {
                filename: imageFile.name
            });

            patch.mainImage = {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: asset._id
                }
            };
        }

        // Handle Gallery Upload (Append to existing)
        const galleryFiles = formData.getAll('gallery') as File[];
        const galleryPatches: any[] = [];

        if (galleryFiles && galleryFiles.length > 0) {
            console.log(`Uploading ${galleryFiles.length} gallery images...`);

            for (const file of galleryFiles) {
                if (file.size > 0) {
                    const asset = await client.assets.upload('image', file, {
                        filename: file.name
                    });

                    galleryPatches.push({
                        _type: 'image',
                        _key: generateKey(), // Ensure unique key
                        asset: {
                            _type: 'reference',
                            _ref: asset._id
                        }
                    });
                }
            }
        }

        console.log("Patching tour:", _id, patch);

        // Transaction to update fields AND append to gallery
        const transaction = client.transaction()
            .patch(_id, p => p.set(patch));

        if (galleryPatches.length > 0) {
            transaction.patch(_id, p => p.setIfMissing({ gallery: [] }).append('gallery', galleryPatches));
        }

        await transaction.commit();

        revalidatePath('/admin/products');
        const slug = formData.get('slug') as string;
        if (slug) revalidatePath(`/tour/${slug}`);

        return { success: true };
    } catch (error) {
        console.error("Update Tour Error:", error);
        return { success: false, error: "Failed to update tour" };
    }
}
