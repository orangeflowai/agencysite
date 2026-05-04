
import { notFound } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TourContent from '@/components/TourContent';
import { getTour, urlFor } from '@/lib/dataAdapter';
import { Metadata } from 'next';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const tour = await getTour(slug);
    if (!tour) return { title: 'Tour Not Found' };

    const siteName = process.env.NEXT_PUBLIC_SITE_NAME || 'Tickets in Rome';
    const title = `${tour.title} | ${siteName}`;
    const description = typeof tour.description === 'string' ? tour.description.slice(0, 160) : `Book your ${tour.title} experience in Rome.`;
    const imageUrl = tour.mainImage ? urlFor(tour.mainImage).width(1200).height(630).url() : '';

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: tour.title }] : [],
        },
    };
}

export default async function TourPage({ params }: PageProps) {
    const { slug } = await params;
    const tour = await getTour(slug);

    if (!tour) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-background selection:bg-primary selection:text-white">
            <Navbar />
            <TourContent tour={tour} />
            <Footer />
        </main>
    );
}
