import Link from 'next/link';

const CATEGORIES = [
  { icon: '⛪', name: 'Vatican',       count: '28 tours', href: '/category/vatican',   color: 'hover:bg-sky-50   hover:border-sky-300' },
  { icon: '🏟', name: 'Colosseum',     count: '32 tours', href: '/category/colosseum', color: 'hover:bg-red-50    hover:border-red-300' },
  { icon: '🏛', name: 'City Tours',    count: '18 tours', href: '/category/city',      color: 'hover:bg-emerald-50 hover:border-emerald-300' },
  { icon: '🗺', name: 'Hidden Gems',   count: '12 tours', href: '/category/hidden-gems', color: 'hover:bg-amber-50 hover:border-amber-300' },
];

export default function CategoryPills() {
  return (
    <section className="bg-white py-10 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h2 className="text-lg font-black text-gray-900 uppercase tracking-wide">Browse by experience</h2>
          <Link href="/search" className="text-sm font-semibold text-sky-600 hover:text-sky-700 transition-colors">
            See all tours →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className={`flex items-center gap-3 p-4 rounded-2xl border-2 border-gray-100 bg-gray-50 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${cat.color}`}
            >
              <span className="text-2xl">{cat.icon}</span>
              <div className="min-w-0">
                <p className="font-black text-gray-900 text-sm truncate">{cat.name}</p>
                <p className="text-xs text-gray-400">{cat.count}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
