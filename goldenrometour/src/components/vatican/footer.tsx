"use client"

import Link from "next/link"
import { Mail, Phone, MapPin, Instagram, Facebook, MessageCircle } from "lucide-react"
import { useSite } from "@/components/SiteProvider"
import Image from "next/image"
import { urlFor } from "@/lib/dataAdapter"

export default function VaticanFooter() {
  const site = useSite()

  const categories = [
    { label: "Vatican Museums", href: "/category/vatican" },
    { label: "Sistine Chapel Private", href: "/tour/vatican-museums-skip-line-audio-guide-grt" },
    { label: "St. Peter's Dome", href: "/tour/st-peters-basilica-dome-climb-grt" },
    { label: "Vatican Gardens", href: "/tour/vatican-gardens-private-tour-grt" },
    { label: "Raphael Rooms", href: "/tour/vatican-museums-skip-line-audio-guide-grt" },
  ]

  const contactEmail = site?.contactEmail || process.env.EMAIL_FROM || "archives@goldenrometours.com"
  const contactPhone = site?.contactPhone || process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+39 123 456 789"
  const address = site?.officeAddress || "Viale Vaticano, 00165 Roma RM, Italy"

  return (
    <footer className="bg-primary text-primary-foreground">
      {/* CTA Section */}
      <div className="py-20 md:py-32 px-4 sm:px-6 lg:px-8 border-b border-primary-foreground/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl mb-6 leading-tight">
            Vatican Protocol: <span className="italic">Authorized Entry.</span>
          </h2>
          <p className="text-primary-foreground/70 mb-10 max-w-xl mx-auto text-lg leading-relaxed">
            Join the verified log of 50,000+ travelers who have explored the Holy See through our exclusive historian-led archives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/#tours" 
              className="px-10 py-5 bg-background text-foreground font-bold uppercase tracking-widest text-[10px] rounded-full hover:opacity-90 transition-opacity shadow-xl"
            >
              Secure Access
            </Link>
            <Link 
              href="/contact" 
              className="px-10 py-5 border border-primary-foreground/30 text-primary-foreground font-bold uppercase tracking-widest text-[10px] rounded-full hover:bg-primary-foreground/10 transition-colors"
            >
              Private Folio
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="py-16 md:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Brand */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-6">
                {site?.logo ? (
                  <Image 
                    src={urlFor(site.logo).url()} 
                    alt={site.title} 
                    width={150} 
                    height={50} 
                    className="h-10 w-auto brightness-0 invert"
                  />
                ) : (
                  <Image 
                    src="/logo.png" 
                    alt="Golden Rome" 
                    width={150} 
                    height={50} 
                    className="h-10 w-auto brightness-0 invert"
                  />
                )}
              </Link>
              <p className="text-primary-foreground/60 text-sm leading-relaxed mb-8">
                Official Vatican Archives offering premium skip-the-line access to the Vatican Museums and Sistine Chapel. Curated by accredited art historians.
              </p>
              <div className="flex gap-4">
                <a href={site?.socialLinks?.instagram || "#"} className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href={site?.socialLinks?.facebook || "#"} className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href={site?.whatsappNumber || "#"} className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-primary-foreground/20 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Tours */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-6 opacity-40">Tours</h3>
              <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                {categories.map((cat) => (
                  <li key={cat.href}>
                    <Link href={cat.href} className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                      {cat.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-6 opacity-40">Vatican Support</h3>
              <ul className="space-y-4 text-xs font-bold uppercase tracking-widest">
                <li><Link href="/contact" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">Contact Us</Link></li>
                <li><Link href="/faq" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">Vatican Guide</Link></li>
                <li><Link href="/terms-and-conditions" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">Terms & Conditions</Link></li>
                <li><Link href="/privacy-policy" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-xs font-bold uppercase tracking-widest mb-6 opacity-40">Dispatch</h3>
              <ul className="space-y-5 text-xs font-bold uppercase tracking-widest">
                <li className="flex items-center gap-3">
                  <Mail className="w-4 h-4 text-accent" />
                  <a href={`mailto:${contactEmail}`} className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                    {contactEmail}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-accent" />
                  <a href={`tel:${contactPhone.replace(/\s/g, '')}`} className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">
                    {contactPhone}
                  </a>
                </li>
                <li className="flex items-start gap-3 leading-relaxed">
                  <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />
                  <span className="text-primary-foreground/60">{address}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="mt-20 pt-10 border-t border-primary-foreground/10 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-[10px] font-bold uppercase tracking-widest text-primary-foreground/30">
              © 2024 Vatican Archives. All Rights Reserved.
            </p>
            <div className="flex gap-8 text-[10px] font-bold uppercase tracking-widest text-primary-foreground/30">
              <Link href="/cancellation-policy" className="hover:text-primary-foreground transition-colors">Cancellation Protocol</Link>
              <Link href="/disclaimer" className="hover:text-primary-foreground transition-colors">Legal Disclosure</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
