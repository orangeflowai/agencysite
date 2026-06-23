"use client";

import { FadeImage } from "@/components/fade-image";
import { Clock, Users, Shield, Award, Headphones, CreditCard } from "lucide-react";

const features = [
  {
    id: 1,
    name: "Skip the Line Protocols",
    description: "Bypass 2-3 hour queues with official partner portal access",
    icon: Clock,
    image: "/images/rome-hero.jpg",
  },
  {
    id: 2,
    name: "Licensed Art Historians",
    description: "Accredited guides vetted by the Italian Ministry of Culture",
    icon: Award,
    image: "/images/vatican-sistine.jpg",
  },
  {
    id: 3,
    name: "Small Group Intimacy",
    description: "Maximum 15 guests for personalized attention",
    icon: Users,
    image: "/images/pantheon.jpg",
  },
  {
    id: 4,
    name: "100% Secure Booking",
    description: "Verified priority vouchers with instant confirmation",
    icon: Shield,
    image: "/images/st-peters.jpg",
  },
  {
    id: 5,
    name: "24/7 Support",
    description: "Dedicated customer service throughout your journey",
    icon: Headphones,
    image: "/images/trastevere.jpg",
  },
  {
    id: 6,
    name: "Flexible Payments",
    description: "Book now, pay later options available",
    icon: CreditCard,
    image: "/images/trevi-fountain.jpg",
  },
];

export function CollectionSection() {
  return (
    <section id="about" className="bg-background border-t border-secondary/10">
      {/* Section Title */}
      <div className="px-6 py-20 md:px-12 lg:px-20 text-center">
        <h2 className="text-3xl font-serif font-bold tracking-tight text-foreground md:text-5xl">
          The Golden Standard
        </h2>
        <p className="mt-6 text-muted-foreground max-w-2xl mx-auto text-lg">
          Excellence in every detail. Why thousands of travelers choose us for their Roman journey.
        </p>
      </div>

      {/* Features Grid */}
      <div className="pb-32 px-6 md:px-12 lg:px-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {features.map((feature) => (
            <div key={feature.id} className="flex flex-col items-center text-center group">
              <div className="w-16 h-16 rounded-2xl bg-primary/5 flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                <feature.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-serif font-bold text-foreground mb-3">
                {feature.name}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
