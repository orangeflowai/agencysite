'use client';

import { TestimonialsColumn } from "@/components/ui/testimonials-columns-1";

const testimonials = [
  {
    text: "Absolutely incredible experience. The skip-the-line access to the Vatican Museums saved us hours. Our guide was an art historian and explained every fresco in detail.",
    image: "https://i.pravatar.cc/150?u=Michael",
    name: "Michael Thompson",
    role: "Verified Traveler",
  },
  {
    text: "Booking was seamless and the instant confirmation gave us peace of mind. The Colosseum underground tour was surreal — a once-in-a-lifetime moment.",
    image: "https://i.pravatar.cc/150?u=Sophie",
    name: "Sophie Beaumont",
    role: "Art Enthusiast",
  },
  {
    text: "We did the early morning Vatican tour and had the Sistine Chapel almost to ourselves. The guide was phenomenal — knowledgeable and passionate.",
    image: "https://i.pravatar.cc/150?u=David",
    name: "David & Lisa R.",
    role: "Frequent Visitor",
  },
  {
    text: "The hidden gems walking tour showed us a side of Rome we never would have found on our own. Small group and expert guide.",
    image: "https://i.pravatar.cc/150?u=Yuki",
    name: "Yuki Tanaka",
    role: "Explorer",
  },
  {
    text: "Organized our family of 6 flawlessly. The kids loved the Colosseum and the guide kept them engaged the whole time. PDF tickets arrived instantly.",
    image: "https://i.pravatar.cc/150?u=Carlos",
    name: "Carlos Mendez",
    role: "Family Traveler",
  },
  {
    text: "The Borghese Gallery tour was exceptional. Limited group size meant we could actually see the sculptures up close. Extraordinary knowledge.",
    image: "https://i.pravatar.cc/150?u=Emma",
    name: "Emma Wilson",
    role: "History Buff",
  },
  {
    text: "The best tour we've taken in Europe. The attention to detail and the skip-the-line access made our Rome trip perfect.",
    image: "https://i.pravatar.cc/150?u=James",
    name: "James Harrington",
    role: "Luxury Traveler",
  },
  {
    text: "Professional, punctual, and extremely knowledgeable. Wonders of Rome is the only way to see the Vatican.",
    image: "https://i.pravatar.cc/150?u=Isabella",
    name: "Isabella Rossi",
    role: "Art Critic",
  },
  {
    text: "Standing on the Arena floor of the Colosseum is something I'll never forget. Thank you for the perfect organization.",
    image: "https://i.pravatar.cc/150?u=Liam",
    name: "Liam O'Connor",
    role: "Viking Traveler",
  },
];

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export default function Testimonials() {
  return (
    <div className="flex gap-4 md:gap-6 [mask-image:linear-gradient(to_bottom,transparent,black_15%,black_85%,transparent)] max-h-[704px] overflow-hidden w-full">
      {/* Col 1 — always visible */}
      <TestimonialsColumn testimonials={firstColumn} duration={25} />
      {/* Col 2 — tablet+ */}
      <div className="hidden md:flex flex-1 min-w-0 overflow-hidden">
        <TestimonialsColumn testimonials={secondColumn} duration={35} className="w-full" />
      </div>
      {/* Col 3 — desktop only */}
      <div className="hidden lg:flex flex-1 min-w-0 overflow-hidden">
        <TestimonialsColumn testimonials={thirdColumn} duration={30} className="w-full" />
      </div>
    </div>
  );
}
