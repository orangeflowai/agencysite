"use client"

import { CheckCircle, Clock, Users, Shield } from "lucide-react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useRef } from "react"

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })
  
  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100])
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50])

  return (
    <section ref={sectionRef} id="about" className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-accent mb-4">
              Authorized Vatican Guide
            </p>
            <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl text-foreground mb-8 leading-[1.1]">
              Navigating the Holy See is <span className="italic">a privilege.</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-10">
              The Vatican Museums contain over 9 miles of corridors and 20,000 works on display. Without a curated route, the experience can be overwhelming. Vatican Archives provides specialized access protocols, led by accredited art historians who decode the secrets of the Sistine Chapel and the Raphael Rooms.
            </p>

            <div className="space-y-6">
              {[
                {
                  icon: CheckCircle,
                  title: "Authorized Skip-the-Line",
                  description: "Official partner status ensures priority bypass entry."
                },
                {
                  icon: Users,
                  title: "Art Historian Curators",
                  description: "PhD-level guides with specialized Vatican accreditation."
                },
                {
                  icon: Shield,
                  title: "Private & Semi-Private",
                  description: "Curated group sizes for an intimate, unhurried dialogue."
                }
              ].map((item, i) => (
                <motion.div 
                  key={i} 
                  className="flex gap-5 group"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center flex-shrink-0 group-hover:bg-accent/10 transition-colors">
                    <item.icon className="w-5 h-5 text-foreground group-hover:text-accent transition-colors" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground uppercase tracking-widest text-xs mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Images with Parallax */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <motion.div 
                  className="h-48 md:h-64 rounded-2xl overflow-hidden"
                  style={{ y: y1 }}
                >
                  <img 
                    src="/vatican-museums.jpg" 
                    alt="Vatican Museums"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <motion.div 
                  className="h-32 md:h-40 rounded-2xl overflow-hidden"
                  style={{ y: y2 }}
                >
                  <img 
                    src="/colosseum-rome.jpg" 
                    alt="Colosseum"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
              <div className="space-y-4 pt-8">
                <motion.div 
                  className="h-32 md:h-40 rounded-2xl overflow-hidden"
                  style={{ y: y2 }}
                >
                  <img 
                    src="/st-peters-basilica.jpg" 
                    alt="St Peter's Basilica"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                <motion.div 
                  className="h-48 md:h-64 rounded-2xl overflow-hidden"
                  style={{ y: y1 }}
                >
                  <img 
                    src="/vatican-sistine-chapel.jpg" 
                    alt="Sistine Chapel"
                    className="w-full h-full object-cover"
                  />
                </motion.div>
              </div>
            </div>

            {/* Floating Badge */}
            <motion.div 
              className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-card rounded-full border border-border shadow-lg"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <p className="text-sm font-medium text-foreground">
                <span className="text-accent">50K+</span> Happy Travelers
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
