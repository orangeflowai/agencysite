import { Shield, Users, Clock } from 'lucide-react';

const items = [
  {
    icon: Shield,
    title: 'Official Vatican Partner',
    description: 'Authorized skip-the-line access. Guaranteed entry, no hidden fees.',
  },
  {
    icon: Users,
    title: 'Expert Art Historians',
    description: 'Licensed guides who bring the Renaissance to life with stories and context.',
  },
  {
    icon: Clock,
    title: 'Free Cancellation',
    description: 'Cancel up to 24 hours before your tour for a full refund. No questions asked.',
  },
];

export default function TrustBar() {
  return (
    <section className="py-16 md:py-20 bg-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
          {items.map(({ icon: Icon, title, description }) => (
            <div key={title} className="text-center">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 text-primary mb-5">
                <Icon className="w-7 h-7" />
              </div>
              <h3 className="font-heading text-xl font-bold text-foreground mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
