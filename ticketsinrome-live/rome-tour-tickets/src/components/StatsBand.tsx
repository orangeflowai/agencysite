const STATS = [
  { num: '48k', suffix: '+', label: 'Happy Travellers This Year' },
  { num: '4.9', suffix: '★', label: 'Average Review Score' },
  { num: '120', suffix: '+', label: 'Curated Rome Experiences' },
  { num: '15',  suffix: 'yr', label: 'Years Operating in Rome' },
];

export default function StatsBand() {
  return (
    <div className="bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-white/6">
          {STATS.map((s) => (
            <div key={s.label} className="text-center py-12 px-6">
              <div className="text-4xl md:text-5xl font-black text-white leading-none mb-2">
                {s.num}
                <span className="text-emerald-400 text-2xl md:text-3xl">{s.suffix}</span>
              </div>
              <p className="text-white/40 text-xs uppercase tracking-widest font-semibold">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
