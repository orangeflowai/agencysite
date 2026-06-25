import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'FAQ | Golden Rome Tour',
  description: 'Frequently asked questions about Vatican Museum tours, Sistine Chapel visits, skip-the-line tickets, dress codes, and booking information.',
  openGraph: {
    title: 'Vatican Tours FAQ | Golden Rome Tour',
    description: 'Everything you need to know about visiting the Vatican Museums and Sistine Chapel — tickets, dress code, timing, and more.',
  },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
