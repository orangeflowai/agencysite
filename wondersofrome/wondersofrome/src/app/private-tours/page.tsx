
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TourCard from '@/components/TourCard';
import { getTours } from '@/lib/sanityService';
import CategoryHero from '@/components/CategoryHero';

export default async function PrivateToursPage() {
    const pageInfo = {
        title: 'Private Tours in Rome',
        subtitle: 'Exclusive experiences tailored just for you. Skip the crowds with your own personal guide.',
        images: [
            'https://ogrvhooygcoazracbvkb.supabase.co/storage/v1/object/public/images/7a7a1aaf8a210f4c317ff7fa391e6738.jpg',
            'https://ogrvhooygcoazracbvkb.supabase.co/storage/v1/object/public/images/bad62cca-199f-4e71-91f1-e478ba8a1b29.jpg',
            'https://ogrvhooygcoazracbvkb.supabase.co/storage/v1/object/public/images/e5b1479b445c00ff11bbad9415d42a31.jpg'
        ]
    };

    const allTours = await getTours();

    // Filter for private tours
    // We check if the title includes "Private" or if category is 'private'
    const filteredTours = allTours.filter(t =>
        t.title.toLowerCase().includes('private') ||
        t.category?.toLowerCase() === 'private'
    );

    return (
        <main className="min-h-screen bg-[#FDFFF5]">
            <Navbar />

            <CategoryHero
                images={pageInfo.images}
                title={pageInfo.title}
                subtitle={pageInfo.subtitle}
            />

            <div className="container mx-auto px-4 py-20">
                <div className="mb-12 text-center">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Exclusive Private Experiences
                    </h2>
                    <p className="text-muted-foreground mt-2">Customize your perfect day in Rome.</p>
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
                        <h2 className="text-3xl font-bold text-muted-foreground mb-4">No Private Tours Found</h2>
                        <p className="text-muted-foreground">Please check back later or contact us to arrange a custom tour.</p>
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
