// FeatureBand — "Book With Confidence" section
// WondersOfRome brand: Deep Navy + Gold (#d4af37)
// Circular icon bubble style (Cubania-inspired)

const FEATURES = [
  {
    icon: '⚡',
    color: 'bg-[#d4af37]',
    ring: 'ring-yellow-200',
    title: 'Instant Confirmation',
    text: 'Your mobile voucher arrives the moment you book. No queues, no uncertainty.',
  },
  {
    icon: '🔓',
    color: 'bg-[#0f172a]',
    ring: 'ring-slate-300',
    title: 'Free Cancellation',
    text: 'Cancel penalty-free up to 24 hours before. Full refund, no questions asked.',
  },
  {
    icon: '🏆',
    color: 'bg-[#d4af37]',
    ring: 'ring-yellow-200',
    title: 'Best Price Guarantee',
    text: "Find it for less elsewhere? We'll match it and refund the difference.",
  },
  {
    icon: '🎯',
    color: 'bg-[#0f172a]',
    ring: 'ring-slate-300',
    title: 'Priority Entry',
    text: 'Walk straight past the line at every major site. Dedicated skip-the-queue access.',
  },
];

export default function FeatureBand() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section heading */}
        <div className="text-center mb-14">
          <p className="text-xs font-black text-[#d4af37] uppercase tracking-[0.3em] mb-2">The</p>
          <h2 className="text-3xl md:text-4xl font-black text-[#0f172a] uppercase tracking-tight">
            Wonders of Rome Experience
          </h2>
        </div>

        {/* 4-column icon grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex flex-col items-center text-center gap-5">
              {/* Circular icon bubble */}
              <div className={`w-24 h-24 rounded-full ${f.color} flex items-center justify-center text-4xl shadow-lg ring-4 ring-offset-2 ring-offset-white ${f.ring}`}>
                {f.icon}
              </div>
              <h3 className="text-sm font-black text-[#0f172a] uppercase tracking-wide leading-tight">
                {f.title}
              </h3>
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
