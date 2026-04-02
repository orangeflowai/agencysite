// Scrolling trust ticker below the hero
const ITEMS = [
  '🎫 Skip-the-Line Tickets',
  '⚡ Instant Confirmation',
  '🔓 Free Cancellation',
  '⭐ 4.9 Star Reviews',
  '🌍 Multi-Language Tours',
  '📱 Mobile Vouchers',
  '💳 Secure Payment',
  '🏆 Best Price Guarantee',
];

export default function TrustTicker() {
  // Duplicate for seamless loop
  const all = [...ITEMS, ...ITEMS];

  return (
    <div className="bg-emerald-600 overflow-hidden py-3 select-none">
      <div className="flex animate-marquee whitespace-nowrap gap-0">
        {all.map((item, i) => (
          <span key={i} className="inline-flex items-center gap-3 px-6 text-white/90 text-xs font-bold uppercase tracking-widest">
            {item}
            <span className="text-white/30 text-base">·</span>
          </span>
        ))}
      </div>
    </div>
  );
}
