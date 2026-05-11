

export const revalidate = 3600; // ISR: revalidate tour data every hour

import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TourCard from '@/components/TourCard';
import { getTours } from '@/lib/dataAdapter';
import { tours as fallbackTours } from "@/lib/toursData";
import CategoryHero from '@/components/CategoryHero';

// Append Supabase image transform params
function supabaseImg(url: string) {
    return `${url}?width=1280&quality=75&format=webp`;
}

const categoryMap: Record<string, { title: string; subtitle: string; images: string[] }> = {
    'vatican': {
        title: 'Vatican Museums Tours',
        subtitle: 'Skip the line to the Sistine Chapel, Gardens, and St. Peter’s Basilica.',
        images: [
            'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos/pexels-photo-532263.jpeg',
            'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos/pexels-photo-1701595.jpeg',
            'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos/pexels-photo-2064827.jpeg'
        ]
    },
    'city': {
        title: 'Rome City Tours',
        subtitle: 'Explore the Pantheon, Trevi Fountain, and Spanish Steps with a local expert.',
        images: [
            'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos/pexels-photo-356966.jpeg',
            'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos/pexels-photo-1797161.jpeg',
            'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos/pexels-photo-356966.jpeg'
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

    const toursData = await getTours();
    let tours = toursData;

    // Use fallback if Sanity returns nothing (e.g. env issues on local)
    if (!tours || tours.length === 0) {
        tours = fallbackTours.map((t: any) => ({
            ...t, _id: t.id, slug: { current: t.slug }, mainImage: t.imageUrl,
        })) as any;
    }

    const filteredTours = tours.filter((t: any) => t.category === slug);

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
            <div className="container mx-auto px-6 md:px-12 py-24">
                <div className="text-center mb-16">
                    <p className="font-inter text-[10px] tracking-[0.4em] uppercase font-bold mb-4 text-[#C9A84C]">✦ CURATED EXPERIENCES ✦</p>
                    <h2 className="font-inter font-bold text-4xl text-[#1A1210] tracking-tight">
                        Our {categoryInfo.title}
                    </h2>
                </div>

                {filteredTours.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 md:gap-12">
                        {filteredTours.map(tour => (
                            <div key={tour._id} className="h-full">
                                <TourCard tour={tour} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 bg-white rounded-[3rem] border border-gray-100 shadow-sm">
                        <h2 className="font-inter text-3xl font-bold text-gray-300 mb-4">Coming Soon</h2>
                        <p className="text-gray-400 font-medium tracking-wide uppercase text-[10px]">We are curating more experiences</p>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
