import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import TourCard from '@/components/TourCard';
import { getTours } from '@/lib/sanityService';
import CategoryHero from '@/components/CategoryHero';
import PrivateTourForm from '@/components/PrivateTourForm';
import GuideProfiles from '@/components/GuideProfiles';

export default async function PrivateToursPage() {
    const pageInfo = {
        title: 'Private Tours in Rome',
        subtitle: 'Exclusive experiences tailored just for you. Skip the crowds with your own personal guide.',
        images: [
            'https://ogrvhooygcoazracbvkb.supabase.co/storage/v1/object/public/images/7a7a1aaf8a210f4c317ff7fa391e6738.jpg',
            'https://ogrvhooygcoazracbvkb.supabase.co/storage/v1/object/public/images/bad62cca-199f-4e71-91f1-e478ba8a1b29.jpg',
            'https://ogrvhooygcoazracbvkb.supabase.co/storage/v1/object/public/images/e5b1479b445c00ff11bbad9415d42a31.jpg'
        ]
    };

    const allTours = await getTours();

    const privateTours = allTours.filter(t =>
        t.title.toLowerCase().includes('private') ||
        t.category?.toLowerCase() === 'private'
    );

    // Comparison table data
    const tiers = [
        {
            name: 'Standard Guided',
            price: 'From €28',
            groupSize: 'Up to 25 people',
            flexibility: 'Fixed itinerary',
            guideRatio: '1:25',
            entryTickets: true,
            cancellation: '72h free cancel',
            highlight: false,
        },
        {
            name: 'Skip-the-Line',
            price: 'From €48',
            groupSize: 'Up to 15 people',
            flexibility: 'Fixed itinerary',
            guideRatio: '1:15',
            entryTickets: true,
            cancellation: '72h free cancel',
            highlight: true,
        },
        {
            name: 'Private Tour',
            price: 'From €199',
            groupSize: 'Your group only',
            flexibility: 'Fully customisable',
            guideRatio: '1:1 to 1:12',
            entryTickets: true,
            cancellation: '72h free cancel',
            highlight: false,
        },
    ];

    const rows: Array<{ label: string; key: keyof typeof tiers[0] }> = [
        { label: 'Price', key: 'price' },
        { label: 'Group size', key: 'groupSize' },
        { label: 'Itinerary', key: 'flexibility' },
        { label: 'Guide ratio', key: 'guideRatio' },
        { label: 'Entry tickets', key: 'entryTickets' },
        { label: 'Cancellation', key: 'cancellation' },
    ];

    return (
        <main className="min-h-screen bg-card">
            <Navbar />

            <CategoryHero
                images={pageInfo.images}
                title={pageInfo.title}
                subtitle={pageInfo.subtitle}
            />

            {/* Private tour listings */}
            <div className="container mx-auto px-4 py-20">
                <div className="mb-12 text-center">
                    <h2 className="text-2xl font-bold text-foreground">Exclusive Private Experiences</h2>
                    <p className="text-muted-foreground mt-2">Customize your perfect day in Rome.</p>
                </div>

                {privateTours.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                        {privateTours.map(tour => (
                            <div key={tour._id} className="h-full">
                                <TourCard tour={tour} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-muted rounded-3xl border border-border">
                        <p className="text-muted-foreground font-medium">Use the enquiry form below to request a custom private tour.</p>
                    </div>
                )}
            </div>

            {/* Tour tier comparison table */}
            <section className="py-20 bg-muted/40 border-y border-border">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-[10px] font-bold tracking-[0.4em] text-primary uppercase">Side-by-Side</span>
                        <h2 className="mt-3 text-3xl md:text-4xl font-serif font-bold text-foreground">Compare Tour Types</h2>
                    </div>

                    {/* Desktop table */}
                    <div className="hidden md:block overflow-hidden rounded-2xl border border-border shadow-sm">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-card border-b border-border">
                                    <th className="px-6 py-4 text-left text-[10px] font-bold tracking-wider text-muted-foreground uppercase">Feature</th>
                                    {tiers.map(t => (
                                        <th key={t.name} className={`px-6 py-4 text-center font-bold text-foreground ${t.highlight ? 'bg-primary/5 border-x border-primary/20' : ''}`}>
                                            {t.highlight && <span className="block text-[9px] text-primary tracking-widest mb-1">MOST POPULAR</span>}
                                            {t.name}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border bg-card">
                                {rows.map(row => (
                                    <tr key={row.key} className="hover:bg-muted/30 transition-colors">
                                        <td className="px-6 py-4 text-xs font-bold text-muted-foreground uppercase tracking-wider">{row.label}</td>
                                        {tiers.map(tier => (
                                            <td key={tier.name} className={`px-6 py-4 text-center text-sm ${tier.highlight ? 'bg-primary/5 border-x border-primary/20' : ''}`}>
                                                {typeof tier[row.key] === 'boolean'
                                                    ? tier[row.key] ? <span className="text-emerald-600 font-bold">✓ Included</span> : <span className="text-muted-foreground">—</span>
                                                    : <span className="text-foreground">{String(tier[row.key])}</span>
                                                }
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile stacked cards */}
                    <div className="md:hidden space-y-4">
                        {tiers.map(tier => (
                            <div key={tier.name} className={`bg-card rounded-2xl border p-6 ${tier.highlight ? 'border-primary shadow-md' : 'border-border'}`}>
                                {tier.highlight && <span className="text-[9px] font-bold text-primary tracking-widest uppercase mb-2 block">Most Popular</span>}
                                <h3 className="font-bold text-lg text-foreground mb-4">{tier.name}</h3>
                                <div className="space-y-3">
                                    {rows.map(row => (
                                        <div key={row.key} className="flex justify-between text-sm">
                                            <span className="text-muted-foreground">{row.label}</span>
                                            <span className="font-medium text-foreground">
                                                {typeof tier[row.key] === 'boolean'
                                                    ? tier[row.key] ? '✓ Included' : '—'
                                                    : String(tier[row.key])
                                                }
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Guide profiles */}
            <GuideProfiles />

            {/* Private tour enquiry form */}
            <section className="py-24 bg-card border-t border-border" id="enquire">
                <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-[10px] font-bold tracking-[0.4em] text-primary uppercase">Custom Experience</span>
                        <h2 className="mt-3 text-3xl md:text-4xl font-serif font-bold text-foreground">Request a Private Tour</h2>
                        <p className="mt-3 text-muted-foreground">Tell us what you need — we'll put together a tailored proposal within 24 hours.</p>
                    </div>
                    <PrivateTourForm tourOptions={privateTours.map(t => t.title)} />
                </div>
            </section>

            <Footer />
        </main>
    );
}
