
import { client } from "@/sanity/lib/client";
import { NextResponse } from "next/server";
import newTours from "@/lib/newToursData.json";

export async function GET() {
    try {
        const existingTours = await client.fetch(`*[_type == "tour"]{title}`);
        const existingTitles = new Set(existingTours.map((t: any) => t.title));
        const created = [];

        for (const tour of newTours) {
            if (!existingTitles.has(tour.title)) {
                console.log(`Creating tour: ${tour.title}`);

                // Generate a slug from title
                const slug = tour.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

                const doc = {
                    _type: 'tour',
                    title: tour.title,
                    slug: { _type: 'slug', current: slug },
                    location: tour.location,
                    price: tour.price,
                    description: [
                        {
                            _type: 'block',
                            style: 'normal',
                            children: [{ _type: 'span', text: tour.description }]
                        }
                    ],
                    duration: tour.duration,
                    groupSize: tour.groupSize,
                    highlights: tour.highlights,
                    includes: tour.includes,
                    excludes: tour.excludes,
                    meetingPoint: tour.meetingPoint,
                    category: tour.category,
                    // Add dummy image or null if not available easily
                    mainImage: undefined
                };

                await client.create(doc);
                created.push(tour.title);
            }
        }

        return NextResponse.json({
            message: "Seeding complete",
            createdCount: created.length,
            createdTours: created
        });

    } catch (error) {
        console.error("Seeding failed:", error);
        return NextResponse.json({ error: "Seeding failed" }, { status: 500 });
    }
}
