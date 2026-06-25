import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TourCard from '@/components/TourCard';
import { getTours } from '@/lib/dataAdapter';
import CategoryHero from '@/components/CategoryHero';

export const revalidate = 300;

export default async function PrivateToursPage() {
  const pageInfo = {
    title: 'Private Tours in Rome',
    subtitle: 'Exclusive experiences tailored just for you. Skip the crowds with your own personal guide.',
    images: [
      '/images/st-peters.jpg',
      '/images/vatican-sistine.jpg',
      '/images/colosseum-night.jpg',
    ],
  };

  const allTours = await getTours();

  // Show private tours + hidden gems (exclusive experiences)
  const filteredTours = allTours.filter(t =>
    t.title.toLowerCase().includes('private') ||
    t.category?.toLowerCase() === 'hidden-gems' ||
    t.title.toLowerCase().includes('vip') ||
    t.title.toLowerCase().includes('exclusive')
  );

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <CategoryHero
        images={pageInfo.images}
        title={pageInfo.title}
        subtitle={pageInfo.subtitle}
      />

      <div className="container mx-auto px-4 py-20">
        <div className="mb-12 text-center">
          <h2 className="text-2xl font-serif font-bold text-foreground">
            Exclusive Private Experiences
          </h2>
          <p className="text-muted-foreground mt-2">Customize your perfect day in Rome with a personal guide.</p>
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
            <h2 className="text-3xl font-bold text-foreground mb-4">Bespoke Experiences Available</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Contact us to arrange a custom private tour tailored to your interests, schedule, and group size.
            </p>
            <a
              href="/contact"
              className="inline-block mt-6 px-8 py-3 bg-primary text-white font-bold rounded-full hover:opacity-90 transition-opacity"
            >
              Contact Us
            </a>
          </div>
        )}
      </div>

      <Footer />
    </main>
  );
}
