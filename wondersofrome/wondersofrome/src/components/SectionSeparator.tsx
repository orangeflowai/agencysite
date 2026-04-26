
'use client';

interface SectionSeparatorProps {
    variant?: 'wave' | 'slope' | 'fade';
    position?: 'top' | 'bottom';
    color?: string; // Tailwind class like 'text-cream' or 'text-white'
}

export default function SectionSeparator({ variant = 'wave', position = 'bottom', color = 'text-cream' }: SectionSeparatorProps) {

    // 1. Organic Wave
    if (variant === 'wave') {
        return (
            <div className={`w-full overflow-hidden leading-none rotate-180 ${position === 'top' ? 'rotate-0' : ''}`}>
                <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className={`relative block w-full h-[60px] lg:h-[100px] ${color} fill-current`}>
                    <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"></path>
                </svg>
            </div>
        );
    }

    // 2. Sharp Slope
    if (variant === 'slope') {
        return (
            <div className={`w-full overflow-hidden leading-none transform ${position === 'top' ? 'rotate-180' : ''}`}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none" className={`relative block w-full h-[50px] lg:h-[80px] ${color} fill-current`}>
                    <path d="M1200 120L0 16.48 0 0 1200 0 1200 120z" transform={position === 'top' ? 'scale(-1, 1) translate(-1200, 0)' : ''}></path>
                </svg>
            </div>
        );
    }

    // 3. Gradient Fade (Simple)
    return (
        <div className={`w-full h-24 bg-gradient-to-b from-transparent to-cream/50 ${position === 'top' ? 'bg-gradient-to-t' : ''}`}></div>
    );
}
