

export const revalidate = 3600; // ISR: revalidate tour data every hour

import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TourCard from '@/components/TourCard';
import { getTours } from '@/lib/dataAdapter';
import CategoryHero from '@/components/CategoryHero';

// Append Supabase image transform params — serve at 1280px WebP instead of raw full-res
function supabaseImg(url: string) {
    return `${url}?width=1280&quality=75&format=webp`;
}

// Define the categories mapping for titles/slugs/images
const categoryMap: Record<string, { title: string; subtitle: string; images: string[] }> = {
    'vatican': {
        title: 'Vatican Museums Tours',
        subtitle: 'Skip the line to the Sistine Chapel, Gardens, and St. Peter’s Basilica.',
        images: [
            supabaseImg('https://ogrvhooygcoazracbvkb.supabase.co/storage/v1/object/public/images/05487657941d3eb0676bbf6ab64bbad7.jpg'),
            supabaseImg('https://ogrvhooygcoazracbvkb.supabase.co/storage/v1/object/public/images/5299212d395c8521d7c342332eaed823.jpg'),
            supabaseImg('https://ogrvhooygcoazracbvkb.supabase.co/storage/v1/object/public/images/05487657941d3eb0676bbf6ab64bbad7.jpg')
        ]
    },
    'colosseum': {
        title: 'Colosseum & Ancient Rome Tours',
        subtitle: 'Walk in the footsteps of Gladiators. Arena Floor, Underground, and Forum.',
        images: [
            supabaseImg('https://ogrvhooygcoazracbvkb.supabase.co/storage/v1/object/public/images/54d70ba36759f71567f18e252ff1959c.jpg'),
            supabaseImg('https://ogrvhooygcoazracbvkb.supabase.co/storage/v1/object/public/images/72be220be1e429973552a10c0b73b534.jpg'),
            supabaseImg('https://ogrvhooygcoazracbvkb.supabase.co/storage/v1/object/public/images/54d70ba36759f71567f18e252ff1959c.jpg')
        ]
    },
    'city': {
        title: 'City Tours',
        subtitle: 'Explore the Pantheon, Trevi Fountain, and Spanish Steps with a local expert.',
        images: [
            supabaseImg('https://ogrvhooygcoazracbvkb.supabase.co/storage/v1/object/public/images/7a7a1aaf8a210f4c317ff7fa391e6738.jpg'),
            supabaseImg('https://ogrvhooygcoazracbvkb.supabase.co/storage/v1/object/public/images/bad62cca-199f-4e71-91f1-e478ba8a1b29.jpg'),
            supabaseImg('https://ogrvhooygcoazracbvkb.supabase.co/storage/v1/object/public/images/7a7a1aaf8a210f4c317ff7fa391e6738.jpg')
        ]
    },
    'hidden-gems': {
        title: 'Italy Hidden Gems',
        subtitle: 'Catacombs, Golf Cart tours, Day trips, Food tours & unique experiences.',
        images: [
            supabaseImg('https://ogrvhooygcoazracbvkb.supabase.co/storage/v1/object/public/images/e5b1479b445c00ff11bbad9415d42a31.jpg'),
            supabaseImg('https://ogrvhooygcoazracbvkb.supabase.co/storage/v1/object/public/images/f86b196f-a022-4f5b-9684-63979caa26af.jpg'),
            supabaseImg('https://ogrvhooygcoazracbvkb.supabase.co/storage/v1/object/public/images/e5b1479b445c00ff11bbad9415d42a31.jpg')
        ]
    }
};

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
    const { slug } = await params;
    const categoryInfo = categoryMap[slug];

    if (!categoryInfo) {
        notFound();
    }

    const allTours = await getTours();

    const filteredTours = allTours.filter(t => t.category === slug);

    return (
        <main className="min-h-screen bg-[#FDFFF5]">
            <Navbar />

            {/* Immersive Hero Slider */}
            <CategoryHero
                images={categoryInfo.images}
                title={categoryInfo.title}
                subtitle={categoryInfo.subtitle}
            />

            {/* Content Section */}
            <div className="container mx-auto px-4 py-20">
                {/* Breadcrumb-ish Text */}
                <div className="mb-12 text-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Top Rated {categoryInfo.title}
                    </h2>
                    <p className="text-muted-foreground mt-2">Book official tickets and guided experiences.</p>
                </div>

                {filteredTours.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {filteredTours.map(tour => (
                            <div key={tour._id} className="h-full">
                                <TourCard tour={tour} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-card rounded-3xl shadow-sm border border-border">
                        <h2 className="text-3xl font-bold text-muted-foreground mb-4">Coming Soon</h2>
                        <p className="text-muted-foreground">We are currently curating the best tours for this category.</p>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
