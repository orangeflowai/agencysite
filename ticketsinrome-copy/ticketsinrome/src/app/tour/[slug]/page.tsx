
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TourContent from '@/components/TourContent';
import { getTour } from '@/lib/sanityService';

interface PageProps {
    params: Promise<{ slug: string }>;
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
