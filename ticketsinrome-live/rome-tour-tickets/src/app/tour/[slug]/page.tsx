
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TourContent from '@/components/TourContent';
import { getTour, getTours } from '@/lib/sanityService';

// Revalidate every hour — keeps pages fresh without full rebuilds
export const revalidate = 3600;

interface PageProps {
    params: Promise<{ slug: string }>;
}

// Pre-build all tour pages at deploy time
export async function generateStaticParams() {
    const tours = await getTours();
    return tours.map((tour) => ({ slug: tour.slug.current }));
}

export default async function TourPage({ params }: PageProps) {
    const { slug } = await params;
    const tour = await getTour(slug);

    if (!tour) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-cream selection:bg-olive selection:text-white">
            <Navbar />
            <TourContent tour={tour} />
            <Footer />
        </main>
    );
}
