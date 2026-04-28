import Link from 'next/link';
import Image from 'next/image';

const itineraries = [
  {
    title: 'A Morning in the Vatican Before the Crowds',
    tag: 'Early Access',
    href: '/category/vatican',
    img: 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&q=75&w=500',
    size: 'tall',   // featured card
  },
  {
    title: 'Underground Rome — Gladiators & Emperors',
    tag: 'History',
    href: '/category/colosseum',
    img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&q=75&w=500',
    size: 'short',
  },
  {
    title: 'Hidden Piazzas & Secret Fountains Walk',
    tag: 'Walking Tour',
    href: '/category/city',
    img: 'https://images.unsplash.com/photo-1529260830199-42c24126f198?auto=format&fit=crop&q=75&w=500',
    size: 'short',
  },
  {
    title: 'Day Trip to the Countryside — Castles & Lakes',
    tag: 'Day Trip',
    href: '/category/hidden-gems',
    img: 'https://images.unsplash.com/photo-1568797629192-789acf8e4df3?auto=format&fit=crop&q=75&w=500',
    size: 'short',
  },
];

export default function FeaturedItineraries() {
  return (
    <section className="py-24 bg-card overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header — like the reference image */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <h2 className="font-serif text-4xl md:text-6xl font-bold text-foreground leading-none tracking-tight">
              featured itineraries
            </h2>
            <p className="text-muted-foreground text-sm mt-2 ">places that stay with you</p>
          </div>
          <Link
            href="/search"
            className="text-sm font-semibold text-sky-600 hover:text-primary underline underline-offset-4 whitespace-nowrap self-end sm:self-auto"
          >
            view all →
          </Link>
        </div>

        {/* Cards — staggered heights like the reference */}
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-4 sm:overflow-visible">
          {itineraries.map((item, i) => (
            <Link
              key={item.title}
              href={item.href}
              className={`
                group relative flex-shrink-0 snap-start rounded-2xl overflow-hidden bg-gray-100 cursor-pointer
                w-[72vw] sm:w-auto
                ${i === 0 ? 'sm:row-span-2 h-[52vw] sm:h-auto sm:aspect-[3/4]' : 'h-[40vw] sm:h-auto sm:aspect-[3/4]'}
              `}
              style={{ transform: 'translateZ(0)' }}
            >
              <Image
                src={item.img}
                alt={item.title}
                fill
                loading="lazy"
                sizes="(max-width: 640px) 72vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105 will-change-transform"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <span className="inline-block text-[10px] font-bold  tracking-widest text-white/70 mb-1">
                  {item.tag}
                </span>
                <p className="text-white text-xs font-bold  tracking-wide leading-tight">
                  {item.title}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Arrow nav hint on mobile */}
        <div className="flex items-center justify-end gap-3 mt-4 sm:hidden">
          <span className="text-muted-foreground text-sm">← →</span>
        </div>
      </div>
    </section>
  );
}
