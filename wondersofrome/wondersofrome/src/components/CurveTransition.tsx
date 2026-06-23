'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import type { Variants } from 'framer-motion';

export default function CurveTransition({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const resize = () => {
            setDimensions({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };
        resize();
        window.addEventListener("resize", resize);
        return () => window.removeEventListener("resize", resize);
    }, []);

    return (
        <div className="page curve">
            <div style={{ opacity: dimensions.width > 0 ? 0 : 1 }} className="fixed inset-0 z-[99999] bg-background pointer-events-none transition-opacity duration-300" />
            <SVG {...dimensions} />
            
                <div key={pathname}>
                    {children}
                </div>
            
        </div>
    );
}

const SVG = ({ height, width }: { width: number, height: number }) => {
    const initialPath = `
        M0 300 
        Q${width / 2} 0 ${width} 300 
        L${width} ${height + 300} 
        Q${width / 2} ${height + 600} 0 ${height + 300} 
        L0 0
    `;

    const targetPath = `
        M0 300 
        Q${width / 2} 0 ${width} 300 
        L${width} ${height} 
        Q${width / 2} ${height} 0 ${height} 
        L0 0
    `;

    const translate: Variants = {
        initial: { top: "-300px" },
        enter: { top: "-100vh", transition: { duration: 0.75, delay: 0.35, ease: [0.76, 0, 0.24, 1] as any }, transitionEnd: { top: "100vh" } },
        exit: { top: "-300px", transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] as any } }
    };

    const curveAnim = (i: string, t: string): Variants => ({
        initial: { d: i },
        enter: { d: t, transition: { duration: 0.75, delay: 0.35, ease: [0.76, 0, 0.24, 1] as any } },
        exit: { d: i, transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] as any } }
    });

    return (
        <svg 
            
            
            
            
            className="fixed h-[calc(100vh+600px)] w-full pointer-events-none left-0 top-[-300px] z-[100000] fill-primary"
        >
            <path 
                
                
                
                
            />
        </svg>
    );
};
