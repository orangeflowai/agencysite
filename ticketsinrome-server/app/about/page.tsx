import { Header } from '@/components/header';
import { FooterSection } from '@/components/sections/footer-section';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Tickets in Rome</h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Your trusted partner for unforgettable experiences in the Eternal City
            </p>
          </div>

          <div className="prose prose-lg max-w-none space-y-8">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Who We Are</h2>
              <p className="text-muted-foreground leading-relaxed">
                Tickets in Rome is a premier tour operator specializing in skip-the-line access and 
                expertly guided tours of Rome's most iconic landmarks. With years of experience and 
                thousands of satisfied customers, we're dedicated to making your Roman holiday truly 
                memorable.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">What We Offer</h2>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">✓</span>
                  <span>Skip-the-line access to Vatican Museums, Sistine Chapel, and St. Peter's Basilica</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">✓</span>
                  <span>Priority entry to the Colosseum, Roman Forum, and Palatine Hill</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">✓</span>
                  <span>Expert local guides with deep knowledge of Roman history and culture</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">✓</span>
                  <span>Small group tours for a more personalized experience</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">✓</span>
                  <span>Flexible booking and cancellation policies</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary font-bold mt-1">✓</span>
                  <span>24/7 customer support</span>
                </li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Why Choose Us</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We understand that your time in Rome is precious. That's why we've designed our tours 
                to maximize your experience while minimizing wait times. Our skip-the-line access means 
                you'll spend more time exploring and less time standing in queues.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Our guides are not just knowledgeable—they're passionate storytellers who bring Rome's 
                history to life. Whether you're interested in ancient history, Renaissance art, or 
                modern Roman culture, we have the perfect tour for you.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
              <p className="text-muted-foreground leading-relaxed">
                We're committed to providing exceptional service, authentic experiences, and memories 
                that will last a lifetime. Every tour is carefully crafted to ensure you get the most 
                out of your visit to Rome.
              </p>
            </div>

            <div className="pt-8 border-t border-border">
              <h2 className="text-2xl font-semibold mb-4">Ready to Explore Rome?</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Browse our selection of tours and book your unforgettable Roman experience today.
              </p>
              <Link href="/tours">
                <Button size="lg">View All Tours</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  );
}
