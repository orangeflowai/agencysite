'use client'

export default function MobileStickyBar({ price }: { price: number }) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/80 backdrop-blur-xl border-t border-gray-100 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
      <div>
        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">From</p>
        <p className="text-xl font-black text-gray-950">€{price}</p>
      </div>
      <button
        onClick={() => {
          const widget = document.getElementById('booking-widget');
          if (widget) widget.scrollIntoView({ behavior: 'smooth' });
        }}
        className="bg-[#d4af37] text-[#0f172a] px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all"
      >
        Check Availability
      </button>
    </div>
  )
}
