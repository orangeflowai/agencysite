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
    <section id="about" className="bg-background">
      {/* Section Title */}
      <div className="px-6 py-20 md:px-12 lg:px-20 md:py-10">
        <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">
          The Golden Standard
        </h2>
        <p className="mt-4 text-muted-foreground max-w-xl">
          Why thousands of travelers trust us for their Roman adventure.
        </p>
      </div>

      {/* Features Grid */}
      <div className="pb-24">
        {/* Mobile: Horizontal Carousel */}
        <div className="flex gap-6 overflow-x-auto px-6 pb-4 md:hidden snap-x snap-mandatory scrollbar-hide">
          {features.map((feature) => (
            <div key={feature.id} className="group flex-shrink-0 w-[75vw] snap-center">
              {/* Image */}
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-secondary">
                <FadeImage
                  src={feature.image}
                  alt={feature.name}
                  fill
                  className="object-cover group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <feature.icon className="w-8 h-8 text-white mb-3" />
                  <h3 className="text-lg font-medium text-white">
                    {feature.name}
                  </h3>
                  <p className="mt-2 text-sm text-white/80">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: Grid */}
        <div className="hidden md:grid md:grid-cols-3 gap-8 md:px-12 lg:px-20">
          {features.map((feature) => (
            <div key={feature.id} className="group">
              {/* Image */}
              <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-secondary">
                <FadeImage
                  src={feature.image}
                  alt={feature.name}
                  fill
                  className="object-cover group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <feature.icon className="w-8 h-8 text-white mb-3" />
                  <h3 className="text-lg font-medium text-white">
                    {feature.name}
                  </h3>
                  <p className="mt-2 text-sm text-white/80">
                    {feature.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
