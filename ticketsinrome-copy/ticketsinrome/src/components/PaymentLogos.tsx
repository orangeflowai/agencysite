import React from 'react';

interface PaymentLogosProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function PaymentLogos({ size = 'md', className = '' }: PaymentLogosProps) {
    const sizes = {
        sm: 'h-6',
        md: 'h-8',
        lg: 'h-10'
    };

    const heightClass = sizes[size];

    const paymentMethods = [
        {
            name: 'Visa',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg',
            fallback: 'https://www.svgrepo.com/show/266090/visa.svg'
        },
        {
            name: 'Mastercard',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg',
            fallback: 'https://www.svgrepo.com/show/266093/mastercard.svg'
        },
        {
            name: 'American Express',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/3/30/American_Express_logo_%282018%29.svg',
            fallback: 'https://www.svgrepo.com/show/266074/american-express.svg'
        },
        {
            name: 'PayPal',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg',
            fallback: 'https://www.svgrepo.com/show/349464/paypal.svg'
        },
        {
            name: 'Apple Pay',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Apple_Pay_logo.svg',
            fallback: 'https://www.svgrepo.com/show/303139/apple-pay-logo.svg'
        },
        {
            name: 'Google Pay',
            logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f2/Google_Pay_Logo.svg',
            fallback: 'https://www.svgrepo.com/show/355074/google-pay.svg'
        }
    ];

    return (
        <div className={`flex items-center gap-3 flex-wrap ${className}`}>
            {paymentMethods.map((method) => (
                <div
                    key={method.name}
                    className="px-3 py-2 bg-white rounded border border-gray-200 flex items-center justify-center min-w-[50px]"
                >
                    <img
                        src={method.logo}
                        alt={method.name}
                        className={`${heightClass} w-auto object-contain`}
                        onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            // Try fallback URL first
                            if (target.src !== method.fallback) {
                                target.src = method.fallback;
                            } else {
                                // If fallback also fails, show text
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent && !parent.querySelector('.fallback-text')) {
                                    const span = document.createElement('span');
                                    span.className = 'fallback-text text-xs font-bold text-gray-700';
                                    span.textContent = method.name;
                                    parent.appendChild(span);
                                }
                            }
                        }}
                    />
                </div>
            ))}
        </div>
    );
}
