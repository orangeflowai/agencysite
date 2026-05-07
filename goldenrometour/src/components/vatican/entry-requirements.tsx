"use client"

import { Shirt, Camera, Shield } from "lucide-react"

const requirements = [
  {
    icon: Shirt,
    title: "Dress Code",
    description: "Shoulders and knees must be covered. A light scarf in your bag is recommended for the Basilica."
  },
  {
    icon: Camera,
    title: "Photography",
    description: "No flash inside the Museums. Strictly no photos or video in the Sistine Chapel."
  },
  {
    icon: Shield,
    title: "Security",
    description: "Airport-style security at all entrances. No large backpacks, knives, or glass bottles."
  }
]

export default function EntryRequirements() {
  return (
    <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-muted/50 border-y border-border">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-3 font-medium">
            Preparation Protocol
          </p>
          <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl text-foreground">
            Vatican Entry <span className="italic">Requirements</span>
          </h2>
        </div>

        {/* Requirements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {requirements.map((req, i) => (
            <div 
              key={i}
              className="p-6 bg-card rounded-xl border border-border text-center"
            >
              <div className="w-14 h-14 rounded-full bg-secondary mx-auto flex items-center justify-center mb-4">
                <req.icon className="w-6 h-6 text-foreground" />
              </div>
              <h3 className="font-semibold text-lg text-foreground mb-2">
                {req.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {req.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
