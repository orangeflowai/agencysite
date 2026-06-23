
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface CategoryHeroProps {
    images: string[];
    title: string;
    subtitle: string;
}

export default function CategoryHero({ images, title, subtitle }: CategoryHeroProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-advance slider
    useEffect(() => {
        if (!images || images.length <= 1) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 5000);
        return () => clearInterval(timer);
    }, [images]);

    // Fallback if no images
    const currentImage = images && images.length > 0 ? images[currentIndex] : '';

    return (
        <div className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center overflow-hidden">
            {/* Background Slider */}
            
                {currentImage && (
                    <div
                        key={currentIndex}
                        }
                        }
                        }
                        }
                        className="absolute inset-0 z-0"
                    >
                        <Image
                            src={currentImage}
                            alt={title}
                            fill
                            priority={true}
                            className="object-cover"
                            sizes="100vw"
                            quality={85}
                        />
                    </div>
                )}
            

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/40 z-1"></div>

            {/* Hero Content */}
            <div className="relative z-10 container mx-auto px-4 mt-16">
                <h1
                    }
                    }
                    }
                    className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tight drop-shadow-2xl"
                >
                    {title}
                </h1>
                <div
                    }
                    }
                    }
                    className="w-24 h-1 bg-sky-500 mx-auto mb-6"
                ></div>
                <p
                    }
                    }
                    }
                    className="text-xl md:text-2xl text-white font-medium max-w-3xl mx-auto drop-shadow-md"
                >
                    {subtitle}
                </p>
            </div>
        </div>
    );
}
