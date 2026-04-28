import Link from 'next/link';

const CATEGORIES = [
  { icon: '⛪', name: 'Vatican',     href: '/category/vatican',    desc: 'Sistine Chapel & Museums' },
  { icon: '🏟', name: 'Colosseum',   href: '/category/colosseum',  desc: 'Arena & Roman Forum' },
  { icon: '🏛', name: 'City Tours',  href: '/category/city',       desc: 'Pantheon & Trevi Fountain' },
  { icon: '🗺', name: 'Hidden Gems', href: '/category/hidden-gems',desc: 'Off the beaten path' },
];

export default function CategoryPills() {
  return (
    <section className="bg-card border-y border-border py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <p className="eyebrow">Browse by experience</p>
          <Link href="/search" className="font-mono text-xs text-accent hover:text-[var(--accent)] transition-colors  tracking-[0.08em]">
            See all tours →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className="group flex items-center gap-3 p-4 rounded-xl border border-border bg-background hover:border-[var(--accent)]/40 hover:bg-card hover:shadow-[0_4px_16px_rgba(15,23,42,0.06)] transition-all duration-200"
            >
              <span className="text-2xl">{cat.icon}</span>
              <div className="min-w-0">
                <p className="font-heading font-semibold text-primary text-sm group-hover:text-accent transition-colors truncate">
                  {cat.name}
                </p>
                <p className="font-mono text-[0.625rem] text-muted-foreground  tracking-[0.06em] truncate">
                  {cat.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
