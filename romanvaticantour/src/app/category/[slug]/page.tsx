export const revalidate = 3600;

import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import NavbarSpacer from '@/components/NavbarSpacer';
import Footer from '@/components/Footer';
import TourCard from '@/components/TourCard';
import { getTours } from '@/lib/dataAdapter';
import CategoryHero from '@/components/CategoryHero';

const FALLBACK_IMAGES: Record<string, string[]> = {
    'vatican': [
        '/images/vatican-sistine.jpg',
        '/images/st-peters.jpg',
    ],
    'colosseum': [
        '/images/colosseum-night.jpg',
        '/images/roman-forum.jpg',
    ],
    'city': [
        '/images/trevi-fountain.jpg',
        '/images/pantheon.jpg',
    ],
    'hidden-gems': [
        '/images/trastevere.jpg',
        '/images/rome-hero.jpg',
    ],
};

const categoryMap: Record<string, { title: string; subtitle: string }> = {
    'vatican': {
        title: 'Vatican Museums Tours',
        subtitle: 'Skip the line to the Sistine Chapel, Gardens, and St. Peter\'s Basilica.',
    },
    'colosseum': {
        title: 'Colosseum & Ancient Rome Tours',
        subtitle: 'Walk in the footsteps of Gladiators. Arena Floor, Underground, and Forum.',
    },
    'city': {
        title: 'Rome City Tours',
        subtitle: 'Explore the Pantheon, Trevi Fountain, and Spanish Steps with a local expert.',
    },
    'hidden-gems': {
        title: 'Italy Hidden Gems',
        subtitle: 'Catacombs, Golf Cart tours, Day trips, Food tours & unique experiences.',
    },
};

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
    const { slug } = await params;
    const categoryInfo = categoryMap[slug];

    if (!categoryInfo) notFound();

    const allTours = await getTours();
    const filteredTours = allTours.filter(t => t.category === slug);
    const images = FALLBACK_IMAGES[slug] || FALLBACK_IMAGES['vatican'];

    return (
        <main className="min-h-screen bg-background">
            <Navbar />

            <CategoryHero
                images={images}
                title={categoryInfo.title}
                subtitle={categoryInfo.subtitle}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="mb-10">
                    <h2 className="text-2xl font-bold text-foreground">
                        {filteredTours.length > 0 ? `${filteredTours.length} Tours Available` : 'Tours'}
                    </h2>
                    <p className="text-muted-foreground mt-1 text-sm">Book official tickets and guided experiences.</p>
                </div>

                {filteredTours.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredTours.map(tour => (
                            <TourCard key={tour._id} tour={tour} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-24 bg-card rounded-2xl border border-border">
                        <p className="text-4xl mb-4">🏛️</p>
                        <h3 className="text-xl font-bold text-foreground mb-2">Coming Soon</h3>
                        <p className="text-muted-foreground text-sm">We are curating the best tours for this category.</p>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
