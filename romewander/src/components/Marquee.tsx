'use client';

const items = [
    '✦ PRIVATE PAPAL AUDIENCE ACCESS',
    '✦ SISTINE CHAPEL AFTER-HOURS',
    '✦ SWISS GUARD ESCORTED TOURS',
    '✦ SKIP-THE-LINE VATICAN MUSEUMS',
    '✦ EXCLUSIVE GARDENS OF VATICAN',
    '✦ PAPAL BLESSING EXPERIENCES',
];

export default function Marquee() {
    const text = items.join('   ');

    return (
        <div
            className="w-full h-10 flex items-center overflow-hidden relative select-none"
            style={{ backgroundColor: '#3D1A6E' }}
        >
            {/* Fade edges */}
            <div className="absolute inset-y-0 left-0 w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #3D1A6E, transparent)' }} />
            <div className="absolute inset-y-0 right-0 w-16 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #3D1A6E, transparent)' }} />

            {/* Two copies for seamless loop */}
            <div className="flex whitespace-nowrap animate-marquee">
                <span className="inline-block px-8 font-nav text-[10px] uppercase tracking-[0.25em]" style={{ color: '#C9A84C' }}>
                    {text}&nbsp;&nbsp;&nbsp;&nbsp;{text}
                </span>
                <span className="inline-block px-8 font-nav text-[10px] uppercase tracking-[0.25em]" style={{ color: '#C9A84C' }}>
                    {text}&nbsp;&nbsp;&nbsp;&nbsp;{text}
                </span>
            </div>
        </div>
    );
}
