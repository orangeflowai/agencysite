'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import CheckoutDrawer from '@/components/CheckoutDrawer';
import { useCart } from '@/context/CartContext';

export default function CheckoutPage() {
  const router = useRouter();
  const { items } = useCart();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      router.replace('/search');
      return;
    }
    setReady(true);
  }, [items, router]);

  if (!ready) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        </div>
      </main>
    );
  }

  // Build booking data from first cart item (single-item checkout)
  const item = items[items.length - 1];
  const counts = item.guestCounts || {};
  const totalGuests = Object.values(counts).reduce((a: number, b: number) => a + b, 0);
  const bookingData = {
    tour: {
      _id: item.tourId,
      title: item.tourTitle,
      slug: { current: item.tourSlug },
      price: item.price / Math.max(totalGuests, 1),
    },
    date: item.date,
    time: item.time,
    guestCounts: counts,
    totalPrice: item.price,
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-20">
        <CheckoutDrawer bookingData={bookingData} onClose={() => router.push('/')} />
      </div>
      <Footer />
    </main>
  );
}
