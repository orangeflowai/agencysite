import Link from 'next/link';

export default function UrgencyCTA() {
  return (
    <section className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-600 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight mb-3">
              Don&apos;t Stand in Line.<br />
              Spend Your Time{' '}
              <em className="not-italic text-emerald-200">In</em> Rome.
            </h2>
            <p className="text-white/70 text-base max-w-lg">
              The Colosseum and Vatican sell out weeks in advance. Secure your skip-the-line tickets now and guarantee your visit.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 justify-center lg:justify-end shrink-0">
            <Link
              href="/search"
              className="bg-white text-emerald-800 hover:bg-emerald-50 px-8 py-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all hover:-translate-y-0.5 shadow-lg"
            >
              Browse All Tours
            </Link>
            <Link
              href="/category/colosseum"
              className="bg-transparent border-2 border-white/50 hover:border-white text-white px-8 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all hover:-translate-y-0.5"
            >
              Last Minute Tickets
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
