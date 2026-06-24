import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import BookingWizard from '@/components/BookingWizard';
import { getTour, getTourImage, extractPortableText } from '@/lib/dataAdapter';

export const revalidate = 300;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const tour = await getTour(slug);
  if (!tour) return { title: 'Tour Not Found' };
  return {
    title: `Book ${tour.title} | Roman Vatican Tour`,
    description: `Reserve your spot for ${tour.title}. Skip-the-line access, expert guides, free cancellation.`,
  };
}

export default async function BookPage({ params }: PageProps) {
  const { slug } = await params;
  const tour = await getTour(slug);

  if (!tour) notFound();

  const imageUrl = getTourImage(tour._id, tour.mainImage?.asset?.url);
  const description = extractPortableText(tour.description);
  const features = tour.features || (tour as any).highlights || [];
  const includes = tour.includes || [];
  const meetingPoint = tour.meetingPoint || '';

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <BookingWizard
        tour={tour}
        imageUrl={imageUrl}
        description={description}
        features={features}
        includes={includes}
        meetingPoint={meetingPoint}
      />
      <Footer />
    </main>
  );
}
