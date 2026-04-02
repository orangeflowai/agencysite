// FeatureBand — "Book With Confidence" section
// Styled like Cubania Travel Experience: circular icon bubbles + title + description
// Ticketsinrome brand: Emerald green + Orange

const FEATURES = [
  {
    icon: '⚡',
    color: 'bg-emerald-500',
    title: 'Instant Confirmation',
    text: 'Receive your mobile voucher within seconds of booking. No waiting, no uncertainty.',
  },
  {
    icon: '🔓',
    color: 'bg-orange-500',
    title: 'Free Cancellation',
    text: 'Cancel for free up to 24 hours before your experience. Full refund, guaranteed.',
  },
  {
    icon: '🏆',
    color: 'bg-emerald-500',
    title: 'Best Price Guarantee',
    text: "Find it cheaper elsewhere? We'll refund the difference — no questions asked.",
  },
  {
    icon: '🎯',
    color: 'bg-orange-500',
    title: 'Skip Every Queue',
    text: 'Our tickets guarantee priority entry. You walk past the line, straight inside.',
  },
];

export default function FeatureBand() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section heading — Cubania style */}
        <div className="text-center mb-14">
          <p className="text-xs font-black text-orange-500 uppercase tracking-[0.3em] mb-2">The</p>
          <h2 className="text-3xl md:text-4xl font-black text-gray-900 uppercase tracking-tight">
            Tickets in Rome Experience
          </h2>
        </div>

        {/* 4-column icon grid — Cubania circular style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex flex-col items-center text-center gap-5">
              {/* Circular icon bubble */}
              <div className={`w-24 h-24 rounded-full ${f.color} flex items-center justify-center text-4xl shadow-lg ring-4 ring-offset-2 ring-offset-white ${f.color === 'bg-emerald-500' ? 'ring-emerald-200' : 'ring-orange-200'}`}>
                {f.icon}
              </div>
              {/* Title */}
              <h3 className="text-sm font-black text-gray-900 uppercase tracking-wide leading-tight">
                {f.title}
              </h3>
              {/* Description */}
              <p className="text-sm text-gray-500 leading-relaxed font-normal max-w-[220px]">
                {f.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
