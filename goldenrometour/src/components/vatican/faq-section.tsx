"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

const faqs = [
  {
    question: "What is the Vatican dress code?",
    answer: "Shoulders and knees must be covered. A light scarf in your bag is recommended for the Basilica. Sleeveless shirts, shorts above the knee, and miniskirts are not permitted."
  },
  {
    question: "Do I need to print my tickets?",
    answer: "No, digital tickets on your phone are accepted at all entry points. Simply show your confirmation email or QR code at the entrance."
  },
  {
    question: "What happens at security?",
    answer: "Airport-style security at all entrances. No large backpacks, knives, or glass bottles. Plan to arrive 15 minutes before your scheduled time."
  },
  {
    question: "Is the Vatican wheelchair accessible?",
    answer: "Yes, the Vatican Museums and St. Peter's Basilica are wheelchair accessible. Please inform us at booking so we can arrange appropriate assistance."
  },
  {
    question: "What is the late arrival policy?",
    answer: "Tours depart on time. If you arrive more than 15 minutes late, you may not be able to join. We recommend arriving 15 minutes early."
  },
  {
    question: "What is the cancellation policy?",
    answer: "Free cancellation up to 24 hours before your scheduled tour for a full refund. Cancellations within 24 hours are non-refundable."
  },
  {
    question: "Which payment methods are accepted?",
    answer: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and Apple Pay through our secure Stripe payment system."
  },
  {
    question: "How do private tours work?",
    answer: "Private tours are exclusively for your group. You choose the start time, pace, and focus areas. Our expert guide tailors the experience to your interests."
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
            Editorial Support
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl text-foreground mb-4">
            The Rome <span className="italic">Compendium</span>
          </h2>
          <p className="text-muted-foreground">
            Essential insights for your curated exploration of the Eternal City.
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
