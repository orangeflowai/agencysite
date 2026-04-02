'use client';

export default function Marquee() {
    const text = "PRIVATE PAPAL AUDIENCE ACCESS  •  SISTINE CHAPEL AFTER-HOURS  •  SWISS GUARD ESCORTED TOURS  •  ";

    return (
        <div className="w-full h-12 bg-theme-secondary flex items-center overflow-hidden whitespace-nowrap z-[110] relative text-theme-primary font-nav text-[11px] uppercase tracking-[0.2em]">
            <div className="animate-marquee inline-block min-w-full">
                {text}
                {text}
                {text}
                {text}
            </div>
            <div className="animate-marquee inline-block min-w-full absolute top-1/2 -translate-y-1/2 left-full">
                {text}
                {text}
                {text}
                {text}
            </div>
        </div>
    );
}
