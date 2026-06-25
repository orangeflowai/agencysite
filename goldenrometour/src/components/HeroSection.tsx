import Link from 'next/link';
import { ArrowRight, Star } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="/vatican-museums.jpg"
          alt="Vatican Museums"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-20 pb-32 text-center">
        <p className="font-accent-text text-accent text-2xl md:text-3xl mb-4 animate-fade-in">
          Experience the Divine
        </p>
        <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight tracking-tight max-w-4xl mx-auto animate-fade-in-up">
          The Vatican Museums, <br />
          <span className="text-accent">Through the Eyes of Experts</span>
        </h1>
        <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-12 animate-fade-in-up animation-delay-200 leading-relaxed">
          Skip the lines. Explore the world&apos;s greatest collection of Renaissance masterpieces
          with accredited art historians. Two ways to experience the Holy See — guided or at your own pace.
        </p>

        {/* Quick Product Links */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-300">
          <Link
            href="/tour/vatican-museums-and-sistine-chapel-guided-tour"
            className="group inline-flex items-center gap-3 bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all shadow-lg hover:shadow-xl"
          >
            Guided Tour — €65
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/tour/vatican-museums-sistine-chapel-skip-the-line"
            className="group inline-flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white border border-white/30 px-8 py-4 rounded-lg font-semibold text-lg transition-all backdrop-blur-sm"
          >
            Skip-the-Line Ticket — €45
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Rating badge */}
        <div className="mt-10 flex items-center justify-center gap-2 text-white/60 text-sm animate-fade-in animation-delay-500">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-accent text-accent" />
            ))}
          </div>
          <span className="font-semibold text-white/80">4.9</span>
          <span>·</span>
          <span>2,850+ reviews</span>
          <span>·</span>
          <span>Official Vatican Partner</span>
        </div>
      </div>
    </section>
  );
}
