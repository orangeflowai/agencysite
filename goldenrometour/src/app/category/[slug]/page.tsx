import { notFound } from 'next/navigation';
import VaticanHeader from '@/components/vatican/header';
import VaticanFooter from '@/components/vatican/footer';
import TourCards from '@/components/vatican/tour-cards';
import { getTours } from '@/lib/dataAdapter';
import CategoryHero from '@/components/CategoryHero';

export const revalidate = 3600;

// Append Supabase image transform params
function supabaseImg(url: string) {
    return `${url}?width=1280&quality=75&format=webp`;
}

const categoryMap: Record<string, { title: string; subtitle: string; images: string[] }> = {
    'vatican': {
        title: 'Vatican Museums Tours',
        subtitle: 'Skip the line to the Sistine Chapel, Gardens, and St. Peter’s Basilica.',
        images: [
            "/vatican-museums.jpg",
            "/vatican-sistine-chapel.jpg",
            "/st-peters-basilica.jpg"
        ]
    },
    'colosseum': {
        title: 'Colosseum & Ancient Rome Tours',
        subtitle: 'Walk in the footsteps of Gladiators. Arena Floor, Underground, and Forum.',
        images: [
            "/colosseum-rome.jpg",
            "/colosseum-rome.jpg",
            "/colosseum-rome.jpg"
        ]
    },
    'city': {
        title: 'City Tours',
        subtitle: 'Explore the Pantheon, Trevi Fountain, and Spanish Steps with a local expert.',
        images: [
            "/vatican-museums.jpg",
            "/vatican-museums.jpg",
            "/vatican-museums.jpg"
        ]
    },
    'hidden-gems': {
        title: 'Italy Hidden Gems',
        subtitle: 'Catacombs, Golf Cart tours, Day trips, Food tours & unique experiences.',
        images: [
            "/vatican-museums.jpg",
            "/vatican-museums.jpg",
            "/vatican-museums.jpg"
        ]
    }
};

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
    const { slug } = await params;
    
    // Vatican-only: redirect non-Vatican categories to Vatican
    if (process.env.NEXT_PUBLIC_SITE_ID === 'goldenrometour' && slug !== 'vatican') {
        notFound();
    }
    
    const categoryInfo = categoryMap[slug];

    if (!categoryInfo) {
        notFound();
    }

    const allTours = await getTours();
    const filteredTours = allTours.filter(t => t.category === slug);

    return (
        <main className="min-h-screen bg-background">
            <VaticanHeader />

            <CategoryHero
                images={categoryInfo.images}
                title={categoryInfo.title}
                subtitle={categoryInfo.subtitle}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="mb-12 text-center">
                    <p className="text-sm uppercase tracking-widest text-accent mb-3 font-semibold">Verified Experiences</p>
                    <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground">
                        Top Rated {categoryInfo.title}
                    </h2>
                    <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">Book official tickets and guided experiences with our accredited historians.</p>
                </div>

                {filteredTours.length > 0 ? (
                    <TourCards tours={filteredTours} />
                ) : (
                    <div className="text-center py-20 bg-card rounded-3xl border border-border">
                        <h2 className="text-2xl font-serif font-bold text-foreground mb-4">Archives Loading...</h2>
                        <p className="text-muted-foreground">We are currently updating our curated list for this category.</p>
                    </div>
                )}
            </div>

            <VaticanFooter />
        </main>
    );
}
