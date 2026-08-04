'use client';

import { Header } from '@/components/header';
import { FooterSection } from '@/components/sections/footer-section';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';

export default function ConfirmationPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <Card className="p-12 text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle className="w-16 h-16 text-green-500" />
            </div>

            <h1 className="text-4xl font-bold mb-4">Booking Confirmed!</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Thank you for your booking. A confirmation email has been sent to your email address.
            </p>

            <div className="bg-muted p-6 rounded-lg mb-8 text-left">
              <h3 className="font-semibold mb-4">What's Next?</h3>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">1.</span>
                  <span>Check your email for the booking confirmation and tour details</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">2.</span>
                  <span>Arrive 15 minutes early at the meeting point</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">3.</span>
                  <span>Bring a valid ID and any required documents</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold">4.</span>
                  <span>Contact us if you have any questions</span>
                </li>
              </ul>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/tours">
                <Button variant="outline" size="lg">
                  Browse More Tours
                </Button>
              </Link>
              <Link href="/">
                <Button size="lg">
                  Return to Home
                </Button>
              </Link>
            </div>

            <div className="mt-8 pt-8 border-t">
              <p className="text-sm text-muted-foreground">
                Need help? Contact us at{' '}
                <a href="mailto:info@wondersofrome.com" className="text-primary hover:underline">
                  info@wondersofrome.com
                </a>
                {' '}or call{' '}
                <a href="tel:+393514199425" className="text-primary hover:underline">
                  +39 351 419 9425
                </a>
              </p>
            </div>
          </Card>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
