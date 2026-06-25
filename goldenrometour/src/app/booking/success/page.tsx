'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ShieldCheck, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const ref = searchParams.get('ref') || 'N/A';

  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
        <ShieldCheck className="w-10 h-10 text-green-600" />
      </div>
      <h1 className="font-heading text-3xl font-bold text-foreground mb-4">Booking Confirmed!</h1>
      <p className="text-muted-foreground mb-2">Your booking reference: <span className="font-mono font-bold text-foreground">{ref}</span></p>
      <p className="text-muted-foreground mb-8">A confirmation email has been sent to your inbox.</p>
      <Link href="/" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
        Back to Home <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <section className="pt-32 pb-20 flex items-center justify-center min-h-[60vh]">
        <div className="max-w-md mx-auto px-4">
          <Suspense fallback={<div className="text-center text-muted-foreground">Loading...</div>}>
            <SuccessContent />
          </Suspense>
        </div>
      </section>
      <Footer />
    </main>
  );
}
