"use client";

import { FadeImage } from "@/components/fade-image";
import { Clock, Users, Shield, Award, Headphones, CreditCard } from "lucide-react";

const features = [
  {
    id: 1,
    name: "Skip the Line Protocols",
    description: "Bypass 2-3 hour queues with official partner portal access",
    icon: Clock,
    image: "https://images.unsplash.com/photo-1529260830199-42c24126f198?w=800&q=80",
  },
  {
    id: 2,
    name: "Licensed Art Historians",
    description: "Accredited guides vetted by the Italian Ministry of Culture",
    icon: Award,
    image: "https://images.unsplash.com/photo-1541185933-710f50b90c28?w=800&q=80",
  },
  {
    id: 3,
    name: "Small Group Intimacy",
    description: "Maximum 15 guests for personalized attention",
    icon: Users,
    image: "https://images.unsplash.com/photo-1555992336-03a23c7b20ee?w=800&q=80",
  },
  {
    id: 4,
    name: "100% Secure Booking",
    description: "Verified priority vouchers with instant confirmation",
    icon: Shield,
    image: "https://images.unsplash.com/photo-1596117015567-0aeaf697a728?w=800&q=80",
  },
  {
    id: 5,
    name: "24/7 Support",
    description: "Dedicated customer service throughout your journey",
    icon: Headphones,
    image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80",
  },
  {
    id: 6,
    name: "Flexible Payments",
    description: "Book now, pay later options available",
    icon: CreditCard,
    image: "https://images.unsplash.com/photo-1555992820-dee20445e674?w=800&q=80",
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
