'use server';

import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId } from '@/sanity/env';
import { revalidatePath } from 'next/cache';

const adminClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
});

export interface TourUpdateData {
    title: string;
    price: number;
    duration?: string;
    groupSize?: string;
    highlights?: string[];
    includes?: string[];
    excludes?: string[];
    importantInfo?: string[];
    imageId?: string; // New: Image Asset ID
}

export async function updateTour(
    tourId: string,
    data: TourUpdateData,
    slug: string
) {
    try {
        console.log(`Updating tour ${tourId} (or slug ${slug})`, data);

        let targetId = tourId;

        if (!targetId || (!targetId.startsWith('drn:') && !targetId.startsWith('drafts.'))) {
            const doc = await adminClient.fetch(`*[_type == "tour" && slug.current == $slug][0]._id`, { slug });
            if (doc) {
                targetId = doc;
            } else {
                throw new Error(`Tour with slug ${slug} not found in Sanity`);
            }
        }

        // Construct the patch object
        const patchData: Partial<TourUpdateData> & { mainImage?: { _type: string; asset: { _type: string; _ref: string } } } = {
            title: data.title,
            price: data.price,
            duration: data.duration,
            groupSize: data.groupSize,
            highlights: data.highlights,
            includes: data.includes,
            excludes: data.excludes,
            importantInfo: data.importantInfo
        };

        // If an image ID is provided, update the mainImage field
        if (data.imageId) {
            patchData.mainImage = {
                _type: 'image',
                asset: {
                    _type: 'reference',
                    _ref: data.imageId
                }
            };
        }

        await adminClient.patch(targetId).set(patchData).commit();

        revalidatePath('/admin/products');
        revalidatePath(`/tour/${slug}`);

        return { success: true };
    } catch (error) {
        console.error("Sanity Update Failed:", error);
        return { success: false, error: 'Failed to update tour' };
    }
}

// New Action: Upload Image
export async function uploadImageToSanity(formData: FormData) {
    try {
        const file = formData.get('file') as File;
        if (!file) throw new Error('No file provided');

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const asset = await adminClient.assets.upload('image', buffer, {
            filename: file.name,
            contentType: file.type
        });

        return { success: true, assetId: asset._id };
    } catch (error) {
        console.error("Image Upload Failed:", error);
        return { success: false, error: 'Failed to upload image' };
    }
}
