"use client"

import { Shield, Clock, Users, CreditCard, CheckCircle, Headphones } from "lucide-react"

const features = [
  {
    icon: Shield,
    title: "Rome Tour Experts",
    description: "Licensed & accredited guides with 10+ years leading Vatican and Colosseum tours. Fully ATAC and Italian Ministry certified."
  },
  {
    icon: CheckCircle,
    title: "Worry-Free Booking",
    description: "Free cancellation up to 24 hours before your tour. Instant confirmation email with your official booking voucher."
  },
  {
    icon: Headphones,
    title: "24 Hour Support",
    description: "Multilingual support team available 24hrs a day via WhatsApp, email, and phone throughout your Rome holiday."
  },
  {
    icon: Users,
    title: "Excellent Service",
    description: "Rated 5★ on Google and TripAdvisor by over 50,000 happy travellers. We are here to make your Rome trip unforgettable."
  }
]

export default function TrustFeatures() {
  return (
    <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-secondary/50 border-y border-border">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-3 font-medium">
            Authenticated by 50,000+ Verified Logs
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground">
            Why Choose <span className="italic">Golden Rome</span>
          </h2>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div 
              key={i}
              className="p-6 bg-card rounded-2xl border border-border hover:border-accent/30 transition-all group"
            >
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center mb-5 group-hover:bg-accent/10 transition-colors">
                <feature.icon className="w-6 h-6 text-foreground group-hover:text-accent transition-colors" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
