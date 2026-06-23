"use client"

import Image from "next/image"
import { CheckCircle, Users, Shield } from "lucide-react"
import { useEffect, useRef } from "react"

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible')
          }
        })
      },
      { threshold: 0.15 }
    )

    const elements = sectionRef.current?.querySelectorAll('.reveal-on-scroll')
    elements?.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="about" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden">
      <style>{`
        .reveal-on-scroll {
          opacity: 0;
          transform: translateY(32px);
          transition: opacity 0.7s ease-out, transform 0.7s ease-out;
        }
        .reveal-on-scroll.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .reveal-delay-1 { transition-delay: 0.1s; }
        .reveal-delay-2 { transition-delay: 0.2s; }
        .reveal-delay-3 { transition-delay: 0.3s; }
        .reveal-delay-4 { transition-delay: 0.4s; }
        .reveal-delay-5 { transition-delay: 0.5s; }
      `}</style>
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Content */}
          <div className="reveal-on-scroll">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-accent mb-4">
              Authorized Vatican Guide
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-foreground mb-8 leading-[1.1]">
              Navigating the Holy See is <span className="italic">a privilege.</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
              The Vatican Museums contain over 9 miles of corridors and 20,000 works on display. Without a curated route, the experience can be overwhelming. Golden Rome Tour provides specialized access, led by accredited art historians who decode the secrets of the Sistine Chapel and the Raphael Rooms.
            </p>

            <div className="space-y-6">
              {[
                {
                  icon: CheckCircle,
                  title: "Authorized Skip-the-Line",
                  description: "Official partner status ensures priority bypass entry.",
                  delay: "reveal-delay-2"
                },
                {
                  icon: Users,
                  title: "Art Historian Guides",
                  description: "PhD-level guides with specialized Vatican accreditation.",
                  delay: "reveal-delay-3"
                },
                {
                  icon: Shield,
                  title: "Private & Semi-Private",
                  description: "Curated group sizes for an intimate, unhurried experience.",
                  delay: "reveal-delay-4"
                }
              ].map((item, i) => (
                <div
                  key={i}
                  className={`flex gap-5 group reveal-on-scroll ${item.delay}`}
                >
                  <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center flex-shrink-0 group-hover:bg-accent/10 transition-colors">
                    <item.icon className="w-5 h-5 text-foreground group-hover:text-accent transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground uppercase tracking-widest text-xs mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="relative reveal-on-scroll reveal-delay-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="h-48 md:h-64 rounded-2xl overflow-hidden relative">
                  <Image
                    src="https://images.pexels.com/photos/3874600/pexels-photo-3874600.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Vatican Museums"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="h-32 md:h-40 rounded-2xl overflow-hidden relative">
                  <Image
                    src="https://images.pexels.com/photos/532263/pexels-photo-532263.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Colosseum Rome"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="h-32 md:h-40 rounded-2xl overflow-hidden relative">
                  <Image
                    src="https://images.pexels.com/photos/2422461/pexels-photo-2422461.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="St Peter's Basilica"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
                <div className="h-48 md:h-64 rounded-2xl overflow-hidden relative">
                  <Image
                    src="https://images.pexels.com/photos/2064827/pexels-photo-2064827.jpeg?auto=compress&cs=tinysrgb&w=800"
                    alt="Sistine Chapel"
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Floating Badge */}
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-card rounded-full border border-border shadow-lg whitespace-nowrap">
              <p className="text-sm font-medium text-foreground">
                <span className="text-accent">50K+</span> Happy Travelers
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
