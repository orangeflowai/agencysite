import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";
import ProductRow from "@/components/ProductRow";
import { getTours } from "@/lib/dataAdapter";
import { tours as fallbackTours } from "@/lib/toursData";

export const revalidate = 3600;

export default async function Home() {
  const toursData = await getTours();
  let tours = toursData;

  if (!tours || tours.length === 0) {
    tours = fallbackTours.map((t: any) => ({
      ...t, _id: t.id, slug: { current: t.slug }, mainImage: t.imageUrl,
    })) as any;
  }

  // Filter out city tours and keep only Vatican and Colosseum for a simpler experience
  const vaticanTours    = tours.filter((t: any) => t.category === 'vatican');
  const colosseumTours  = tours.filter((t: any) => t.category === 'colosseum');

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section - Keep it simple and focused */}
      <Hero />

      {/* Vatican Section */}
      <div className="py-24">
        <ProductRow 
          title="Vatican Experiences" 
          subtitle="Exclusive access to the Museums, Sistine Chapel and Gardens." 
          tours={vaticanTours} 
          link="/category/vatican" 
          dark={false} 
        />
      </div>

      {/* Colosseum Section */}
      <div className="py-24 bg-gray-50">
        <ProductRow 
          title="Ancient Rome" 
          subtitle="Walk the Arena Floor and explore the Colosseum Underground." 
          tours={colosseumTours} 
          link="/category/colosseum" 
          dark={false} 
        />
      </div>

      <Footer />
    </main>
  );
}
