import React from 'react';

interface PaymentLogosProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Inline SVG logos — no external URLs, never fail to load
const logos = [
  {
    name: 'Visa',
    svg: (
      <svg viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Visa">
        <text x="0" y="13" fontFamily="Arial" fontWeight="900" fontSize="14" fill="#1A1F71" letterSpacing="-0.5">VISA</text>
      </svg>
    ),
  },
  {
    name: 'Mastercard',
    svg: (
      <svg viewBox="0 0 38 24" xmlns="http://www.w3.org/2000/svg" aria-label="Mastercard">
        <circle cx="14" cy="12" r="10" fill="#EB001B" />
        <circle cx="24" cy="12" r="10" fill="#F79E1B" />
        <path d="M19 5.27A10 10 0 0 1 23.73 12 10 10 0 0 1 19 18.73 10 10 0 0 1 14.27 12 10 10 0 0 1 19 5.27z" fill="#FF5F00" />
      </svg>
    ),
  },
  {
    name: 'Amex',
    svg: (
      <svg viewBox="0 0 48 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="American Express">
        <rect width="48" height="16" rx="3" fill="#2E77BC" />
        <text x="4" y="12" fontFamily="Arial" fontWeight="900" fontSize="9" fill="white" letterSpacing="0.5">AMEX</text>
      </svg>
    ),
  },
  {
    name: 'PayPal',
    svg: (
      <svg viewBox="0 0 60 16" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="PayPal">
        <text x="0" y="13" fontFamily="Arial" fontWeight="900" fontSize="13" fill="#003087">Pay</text>
        <text x="22" y="13" fontFamily="Arial" fontWeight="900" fontSize="13" fill="#009CDE">Pal</text>
      </svg>
    ),
  },
  {
    name: 'Apple Pay',
    svg: (
      <svg viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Apple Pay">
        <rect width="60" height="24" rx="4" fill="#000" />
        <text x="8" y="17" fontFamily="Arial" fontWeight="600" fontSize="11" fill="white"> Pay</text>
      </svg>
    ),
  },
  {
    name: 'Google Pay',
    svg: (
      <svg viewBox="0 0 60 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Google Pay">
        <text x="2" y="17" fontFamily="Arial" fontWeight="500" fontSize="11" fill="#5F6368">G</text>
        <text x="12" y="17" fontFamily="Arial" fontWeight="500" fontSize="11" fill="#4285F4">o</text>
        <text x="20" y="17" fontFamily="Arial" fontWeight="500" fontSize="11" fill="#34A853">o</text>
        <text x="28" y="17" fontFamily="Arial" fontWeight="500" fontSize="11" fill="#FBBC05">g</text>
        <text x="36" y="17" fontFamily="Arial" fontWeight="500" fontSize="11" fill="#EA4335">le</text>
        <text x="46" y="17" fontFamily="Arial" fontWeight="700" fontSize="11" fill="#5F6368"> Pay</text>
      </svg>
    ),
  },
];

const sizeMap = { sm: 'h-6', md: 'h-8', lg: 'h-10' };

export default function PaymentLogos({ size = 'md', className = '' }: PaymentLogosProps) {
  const h = sizeMap[size];
  return (
    <div className={`flex items-center gap-2 flex-wrap ${className}`}>
      {logos.map((m) => (
        <div
          key={m.name}
          title={m.name}
          className={`${h} px-2 py-1 bg-card rounded border border-border flex items-center justify-center min-w-[44px]`}
        >
          <div className="w-full h-full flex items-center justify-center">
            {m.svg}
          </div>
        </div>
      ))}
    </div>
  );
}
