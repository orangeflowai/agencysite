'use client';

import Image from 'next/image';
import Link from 'next/link';

// High-quality Vatican & Rome images
const images = [
  {
    src: 'https://images.pexels.com/photos/532263/pexels-photo-532263.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1',
    alt: 'St. Peter\'s Basilica Arch',
    label: "St. Peter's Basilica",
    type: 'arch',
  },
  {
    src: 'https://images.pexels.com/photos/1701595/pexels-photo-1701595.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=1',
    alt: 'Vatican Museums Circle',
    label: 'Vatican Museums',
    type: 'circle',
  },
  {
    src: 'https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1',
    alt: 'Sistine Chapel Arch',
    label: 'Sistine Chapel',
    type: 'arch',
  },
  {
    src: 'https://images.pexels.com/photos/2422461/pexels-photo-2422461.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&dpr=1',
    alt: 'Colosseum Circle',
    label: 'The Colosseum',
    type: 'circle',
  },
  {
    src: 'https://images.pexels.com/photos/356966/pexels-photo-356966.jpeg?auto=compress&cs=tinysrgb&w=800&h=1200&dpr=1',
    alt: 'Trevi Fountain Arch',
    label: 'Trevi Fountain',
    type: 'arch',
  },
];

export default function RomeGallery() {
  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-6 md:px-16">
        
        {/* Header */}
        <div className="text-center mb-20">
          <p
            }
            }
            viewport={{ once: true }}
            className="font-inter text-[12px] tracking-[0.4em] uppercase font-bold mb-5 text-foreground"
          >
            ✦ THE SOUL OF ROME ✦
          </p>
          <h2
            }
            }
            viewport={{ once: true }}
            className="font-inter font-bold text-foreground tracking-tight leading-tight mb-6"
            style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}
          >
            Experience the{' '}
            <span className="italic font-medium text-foreground">
              Sacred & Eternal
            </span>
          </h2>
          <p className="font-inter text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            A curated visual journey through the most iconic monuments of the Vatican and Rome, 
            presented with the elegance and clarity they deserve.
          </p>
        </div>

        {/* Apple-style Organic Collage */}
        <div className="relative h-[800px] md:h-[896px] w-full max-w-6xl mx-auto">
          
          {/* 1. Large Arch Left */}
          <div
            }
            }
            viewport={{ once: true }}
            }
            className="absolute left-0 top-0 w-[45%] h-[60%] overflow-hidden group shadow-2xl"
            style={{ borderRadius: '240px 240px 24px 24px' }}
          >
            <Image src={images[0].src} alt={images[0].alt} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
            <div className="absolute bottom-10 left-10 text-white drop-shadow-lg">
              <p className="font-inter text-[8px] uppercase tracking-widest mb-1 opacity-80">Architecture</p>
              <h3 className="font-inter font-bold text-2xl">{images[0].label}</h3>
            </div>
          </div>

          {/* 2. Circle Center-Top */}
          <div
            }
            }
            viewport={{ once: true }}
            }
            className="absolute left-[38%] top-[10%] w-[25%] aspect-square overflow-hidden group shadow-xl z-10"
            style={{ borderRadius: '50%' }}
          >
            <Image src={images[1].src} alt={images[1].alt} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/15 transition-colors" />
          </div>

          {/* 3. Tall Arch Right */}
          <div
            }
            }
            viewport={{ once: true }}
            }
            className="absolute right-0 top-[15%] w-[40%] h-[70%] overflow-hidden group shadow-2xl"
            style={{ borderRadius: '200px 200px 24px 24px' }}
          >
            <Image src={images[2].src} alt={images[2].alt} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
            <div className="absolute bottom-10 right-10 text-right text-white drop-shadow-lg">
              <p className="font-inter text-[8px] uppercase tracking-widest mb-1 opacity-80">Heritage</p>
              <h3 className="font-inter font-bold text-2xl">{images[2].label}</h3>
            </div>
          </div>

          {/* 4. Large Circle Bottom-Left */}
          <div
            }
            }
            viewport={{ once: true }}
            }
            className="absolute left-[15%] bottom-[5%] w-[30%] aspect-square overflow-hidden group shadow-xl"
            style={{ borderRadius: '50%' }}
          >
            <Image src={images[3].src} alt={images[3].alt} fill className="object-cover group-hover:scale-110 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/15 transition-colors" />
          </div>

          {/* 5. Medium Arch Center-Bottom */}
          <div
            }
            }
            viewport={{ once: true }}
            }
            className="absolute left-[45%] bottom-0 w-[35%] h-[45%] overflow-hidden group shadow-2xl z-10"
            style={{ borderRadius: '150px 150px 24px 24px' }}
          >
            <Image src={images[4].src} alt={images[4].alt} fill className="object-cover group-hover:scale-105 transition-transform duration-1000" />
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
            <div className="absolute bottom-10 left-10 text-white drop-shadow-lg">
              <p className="font-inter text-[8px] uppercase tracking-widest mb-1 opacity-80">Moments</p>
              <h3 className="font-inter font-bold text-xl">{images[4].label}</h3>
            </div>
          </div>

        </div>

        {/* CTA */}
        <div
          }
          }
          viewport={{ once: true }}
          className="text-center mt-24"
        >
          <Link
            href="/category/vatican"
            className="inline-flex items-center gap-3 font-inter font-bold uppercase tracking-[0.2em] text-xs py-5 px-14 transition-all hover:gap-5"
            style={{ border: '1px solid #C9A84C', color: '#C9A84C', borderRadius: '4px' }}
          >
            Explore All Destinations
            <span className="text-lg">→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
