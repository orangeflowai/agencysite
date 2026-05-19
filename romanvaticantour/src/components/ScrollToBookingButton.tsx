"use client";

interface ScrollToBookingButtonProps {
  price: number;
}

export default function ScrollToBookingButton({ price }: ScrollToBookingButtonProps) {
  const handleClick = () => {
    const widget = document.getElementById('booking-widget');
    if (widget) widget.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 p-4 bg-card/80 backdrop-blur-xl border-t border-[#b19681]/20 flex items-center justify-between shadow-[0_-10px_40px_rgba(0,0,0,0.1)]">
      <div>
        <p className="text-[10px] font-bold text-[#85766a]  tracking-widest">From</p>
        <p className="text-xl font-bold text-[#5c4b3e]">€{price}</p>
      </div>
      <button 
        onClick={handleClick}
        className="bg-primary text-white px-8 py-3 rounded-2xl font-bold text-xs  tracking-[0.2em] shadow-xl active:scale-95 transition-all"
      >
        Check Availability
      </button>
    </div>
  );
}
