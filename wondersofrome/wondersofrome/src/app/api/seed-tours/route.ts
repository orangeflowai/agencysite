import { NextResponse } from 'next/server';
import { createClient } from 'next-sanity';
import { apiVersion, dataset, projectId, useCdn } from '@/sanity/env';
import { tours } from '@/lib/toursData';

const writeClient = createClient({
    projectId,
    dataset,
    apiVersion,
    useCdn: false,
    token: process.env.SANITY_API_TOKEN,
})

// Helper to upload image from URL
async function uploadImageToSanity(imageUrl: string) {
    try {
        const response = await fetch(imageUrl);
        if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
        const buffer = await response.arrayBuffer();
        const asset = await writeClient.assets.upload('image', Buffer.from(buffer), {
            filename: imageUrl.split('/').pop() || 'image.jpg',
        });
        return asset._id;
    } catch (error) {
        console.error('Image upload failed:', error);
        return null;
    }
}

export async function GET() {
    try {
        if (!process.env.SANITY_API_TOKEN) {
            return NextResponse.json(
                { success: false, error: 'Missing SANITY_API_TOKEN env var' },
                { status: 500 }
            );
        }

        console.log('Starting seed process...');

        // Optional: Delete existing tours to ensure clean state (careful in prod!)
        // await writeClient.delete({query: '*[_type == "tour"]'});

        const results = [];

        for (const tour of tours) {
            console.log(`Processing: ${tour.title}`);

            let imageId = null;
            if (tour.imageUrl) {
                imageId = await uploadImageToSanity(tour.imageUrl);
            }

            const tourDoc = {
                _type: 'tour',
                _id: tour.id, // Ensure consistent IDs for updates
                title: tour.title,
                slug: { _type: 'slug', current: tour.slug },
                category: tour.category, // Categories already standardized in toursData.ts
                tourType: tour.tourType,
                price: tour.price,
                duration: tour.duration,
                description: tour.description,
                location: 'Rome, Italy',
                features: tour.highlights,
                includes: tour.includes,
                badge: tour.badge || null,
                rating: tour.rating,
                reviewCount: tour.reviews,
                mainImage: imageId ? {
                    _type: 'image',
                    asset: {
                        _type: 'reference',
                        _ref: imageId,
                    }
                } : undefined,
            };

            const result = await writeClient.createOrReplace(tourDoc);
            results.push(result);
        }

        return NextResponse.json({
            success: true,
            message: `Seeded ${results.length} tours successfully`,
            data: results
        });

    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json(
            { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
            { status: 500 }
        );
    }
}
