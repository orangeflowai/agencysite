"use client";

import Image from "next/image";
import { FadeImage } from "@/components/fade-image";

const stats = [
  { label: "Tours Completed", value: "50K+" },
  { label: "Happy Travelers", value: "98%" },
  { label: "Expert Guides", value: "45+" },
  { label: "Years Experience", value: "12" },
];

const articles = [
  {
    title: "Best Time to Visit Rome: A Month-by-Month Guide",
    category: "Travel Tips",
    image: "https://images.pexels.com/photos/1174136/pexels-photo-1174136.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    title: "Vatican Museums: Everything You Need to Know",
    category: "Vatican Series",
    image: "https://images.pexels.com/photos/3874600/pexels-photo-3874600.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
  {
    title: "Top 5 Must-See Attractions in Rome",
    category: "City Guide",
    image: "https://images.pexels.com/photos/1797158/pexels-photo-1797158.jpeg?auto=compress&cs=tinysrgb&w=800",
  },
];

export function EditorialSection() {
  return (
    <section className="bg-background">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 border-t border-border md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="border-b border-r border-border p-8 text-center last:border-r-0 md:border-b-0"
          >
            <p className="mb-2 text-xs uppercase tracking-widest text-muted-foreground">
              {stat.label}
            </p>
            <p className="font-medium text-foreground text-4xl">
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* Editorial Section */}
      <div className="px-6 py-20 md:px-12 lg:px-20">
        <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl mb-12">
          The Roman Journal
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((article, idx) => (
            <div key={idx} className="group cursor-pointer">
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-4">
                <FadeImage
                  src={article.image}
                  alt={article.title}
                  fill
                  className="object-cover group-hover:scale-105"
                />
              </div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-2">
                {article.category}
              </p>
              <h3 className="text-lg font-medium text-foreground group-hover:underline">
                {article.title}
              </h3>
            </div>
          ))}
        </div>
      </div>

      {/* Full-width Image */}
      <div className="relative aspect-[16/9] w-full md:aspect-[21/9]">
        <Image
          src="https://images.pexels.com/photos/532263/pexels-photo-532263.jpeg?auto=compress&cs=tinysrgb&w=1200"
          alt="Colosseum at night"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-foreground/30 flex items-center justify-center">
          <div className="text-center text-white">
            <h3 className="text-4xl md:text-6xl font-medium mb-4">Ready to Explore?</h3>
            <p className="text-lg text-white/80 mb-8">Book your unforgettable Roman adventure today</p>
            <a
              href="#tours"
              className="inline-block bg-white text-foreground px-8 py-4 rounded-full font-medium hover:bg-white/90 transition-colors"
            >
              View All Tours
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
