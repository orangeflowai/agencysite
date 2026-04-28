'use client';

import React from 'react';
import Link from 'next/link';
import TourCard from './TourCard';
import { ArrowRight } from 'lucide-react';

interface ProductRowProps {
  title: string;
  subtitle?: string;
  tours: any[];
  link?: string;
  dark?: boolean;
}

const CATEGORY_IMAGES: Record<string, string> = {
    'Vatican Collection': 'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos/pexels-nastiz-12604242.jpg',
    'Ancient Power': 'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos/pexels-alex-250137-757239.jpg',
    'City Logic': 'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos/pexels-matteobasilephoto-11200578.jpg',
    'Secret Architectures': 'https://pub-772bbb33a07f4026aa9652a0cfef4c2e.r2.dev/rome%20photos/pexels-filiamariss-30785778.jpg'
};

const ProductRow: React.FC<ProductRowProps> = ({ title, subtitle, tours, link }) => {
  if (!tours || tours.length === 0) return null;

  const heroImage = CATEGORY_IMAGES[title] || CATEGORY_IMAGES['Vatican Collection'];

  return (
    <section className="py-24">
      <div className="container mx-auto px-6 mb-16">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6">
          <div className="max-w-2xl">
            <p className="text-primary font-bold  tracking-[0.4em] text-[10px] mb-4">Site_Sector_Archive</p>
            <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter   leading-none mb-6">
              {title}
            </h2>
            {subtitle && (
              <p className="text-muted-foreground text-sm font-mono font-bold  tracking-widest opacity-60">
                {subtitle}
              </p>
            )}
          </div>
          {link && (
            <Link href={link} className="group flex items-center gap-3 font-bold  tracking-[0.2em] text-[10px] text-foreground hover:text-primary transition-colors">
              <span>View Directory</span>
              <div className="w-10 h-10 rounded-full border border-border flex items-center justify-center group-hover:border-primary group-hover:bg-primary group-hover:text-white transition-all">
                <ArrowRight size={16} />
              </div>
            </Link>
          )}
        </div>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Hero Side Card (Bromo Style) */}
          <div className="hidden lg:block lg:col-span-5 relative group rounded-[var(--radius)] overflow-hidden border border-border shadow-2xl min-h-[600px]">
            <img 
              src={heroImage} 
              alt={title} 
              className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-80" />
            
            <div className="absolute inset-0 flex flex-col justify-end p-12 space-y-6">
                <h3 className="text-5xl font-serif font-bold text-white  leading-none  tracking-tighter">
                   Discover the<br/>{title.split(' ')[0]} Gaze
                </h3>
                <Link href={link || '/search'} className="inline-flex items-center gap-4 text-white text-xs font-bold  tracking-[0.3em] group-hover:gap-6 transition-all">
                    <span>Initiate Archive</span>
                    <ArrowRight size={18} className="text-primary" />
                </Link>
            </div>
          </div>

          {/* Tour Grid */}
          <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {tours.slice(0, 4).map((tour) => (
              <TourCard key={tour._id || tour.id} tour={tour} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProductRow;
