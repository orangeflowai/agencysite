"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "What is the Vatican dress code?",
    answer: "Shoulders and knees must be covered for entry to the Vatican Museums and St. Peter's Basilica. No sleeveless shirts, shorts above the knee, miniskirts, or revealing clothing. We recommend bringing a light scarf or shawl."
  },
  {
    question: "Do I need to print my Vatican tickets?",
    answer: "No, digital tickets on your phone are accepted. Simply show your confirmation email or QR code at the entrance. We recommend downloading your tickets before arrival in case of connectivity issues."
  },
  {
    question: "How early should I arrive for my Vatican tour?",
    answer: "Please arrive 15 minutes before your scheduled tour time. This allows time for security screening and meeting your guide. Late arrivals may not be able to join the tour."
  },
  {
    question: "Is the Vatican wheelchair accessible?",
    answer: "Yes, the Vatican Museums and St. Peter's Basilica are wheelchair accessible with ramps and elevators. Please inform us at booking so we can arrange appropriate assistance and ensure a smooth experience."
  },
  {
    question: "Can I take photos in the Sistine Chapel?",
    answer: "Photography is strictly prohibited in the Sistine Chapel. Guards actively enforce this rule. You may take photos in most other areas of the Vatican Museums, but flash photography is not allowed."
  },
  {
    question: "What is included in the Vatican tour price?",
    answer: "Your tour includes skip-the-line entrance tickets, expert art historian guide, headsets for groups over 6 people, and access to all included areas. Some tours also include St. Peter's Basilica and Dome access."
  },
  {
    question: "What is the Vatican cancellation policy?",
    answer: "Free cancellation up to 24 hours before your scheduled tour for a full refund. Cancellations within 24 hours are non-refundable. Weather-related closures are fully refundable."
  },
  {
    question: "How long does a Vatican tour take?",
    answer: "Standard Vatican Museums tours last 2.5-3 hours. Tours including St. Peter's Basilica and Dome climb can take 4-5 hours. Private tours can be customized to your preferred duration."
  },
  {
    question: "Are Vatican tours available in other languages?",
    answer: "Yes, we offer tours in English, Italian, Spanish, French, and German. Private tours can be arranged in additional languages upon request. Please specify your language preference at booking."
  },
  {
    question: "What happens at Vatican security?",
    answer: "Airport-style security screening at all Vatican entrances. No large backpacks, knives, glass bottles, or sharp objects. Small bags and cameras are permitted. Security lines move quickly with skip-the-line access."
  },
  {
    question: "Can children visit the Vatican Museums?",
    answer: "Yes, children of all ages are welcome. Children under 6 enter free but must be registered. We offer family-friendly tours with engaging storytelling. Strollers are allowed but can be challenging in crowded areas."
  },
  {
    question: "Which payment methods are accepted?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, and Google Pay through our secure Stripe payment system. Payment is required at time of booking."
  },
  {
    question: "What's the difference between group and private Vatican tours?",
    answer: "Group tours have maximum 15 people and follow a set itinerary. Private tours are exclusively for your party, with flexible timing, personalized pace, and customized focus areas based on your interests."
  },
  {
    question: "Is food allowed inside the Vatican Museums?",
    answer: "No food or drinks (except water in sealed bottles) are allowed inside the Vatican Museums. There is a cafeteria inside for breaks. We recommend eating before or after your tour."
  }
]

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-secondary/30">
      <div className="max-w-3xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-widest text-muted-foreground mb-3 font-medium">
            Vatican Support
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground mb-4">
            Vatican <span className="italic">Guide</span>
          </h2>
          <p className="text-muted-foreground">
            Essential information for your Vatican Museums and Sistine Chapel visit.
          </p>
        </div>

        {/* FAQ List */}
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div 
              key={i}
              className="bg-card rounded-xl border border-border overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between p-5 text-left"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
              >
                <span className="font-medium text-foreground pr-4">
                  {faq.question}
                </span>
                <ChevronDown 
                  className={`w-5 h-5 text-muted-foreground transition-transform flex-shrink-0 ${
                    openIndex === i ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === i && (
                <div className="px-5 pb-5 pt-0">
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
