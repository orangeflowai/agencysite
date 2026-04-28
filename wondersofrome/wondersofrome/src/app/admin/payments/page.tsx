'use client';

import { useState, useEffect } from 'react';
import { 
    CreditCard, Wallet, Building2, Globe, Check, AlertTriangle,
    Info, Save, ToggleRight, ToggleLeft, Shield
} from 'lucide-react';

interface PaymentMethod {
    id: string;
    name: string;
    description: string;
    icon: any;
    enabled: boolean;
    popular?: boolean;
    region?: string;
}

const DEFAULT_METHODS: PaymentMethod[] = [
    {
        id: 'card',
        name: 'Credit & Debit Cards',
        description: 'Visa, Mastercard, American Express, Discover, JCB, UnionPay',
        icon: CreditCard,
        enabled: true,
        popular: true,
    },
    {
        id: 'link',
        name: 'Link by Stripe',
        description: 'Fast checkout with saved payment details. 1-click payments for returning customers.',
        icon: Wallet,
        enabled: true,
        popular: true,
    },
    {
        id: 'paypal',
        name: 'PayPal',
        description: 'Pay with your PayPal account. Available worldwide.',
        icon: Wallet,
        enabled: true,
        popular: true,
    },
    {
        id: 'ideal',
        name: 'iDEAL',
        description: 'Popular in Netherlands. Direct bank transfer.',
        icon: Building2,
        enabled: true,
        region: 'Netherlands',
    },
    {
        id: 'bancontact',
        name: 'Bancontact',
        description: 'Popular in Belgium. Direct bank transfer.',
        icon: Building2,
        enabled: true,
        region: 'Belgium',
    },
    {
        id: 'giropay',
        name: 'giropay',
        description: 'Popular in Germany. Direct bank transfer.',
        icon: Building2,
        enabled: true,
        region: 'Germany',
    },
    {
        id: 'eps',
        name: 'EPS',
        description: 'Popular in Austria. Direct bank transfer.',
        icon: Building2,
        enabled: true,
        region: 'Austria',
    },
    {
        id: 'p24',
        name: 'Przelewy24 (P24)',
        description: 'Popular in Poland. Bank transfer and local methods.',
        icon: Building2,
        enabled: false,
        region: 'Poland',
    },
    {
        id: 'sofort',
        name: 'SOFORT',
        description: 'Bank transfer across Europe. Available in 13 countries.',
        icon: Globe,
        enabled: false,
        region: 'Europe',
    },
    {
        id: 'sepa_debit',
        name: 'SEPA Direct Debit',
        description: 'Direct debit from EU bank accounts.',
        icon: Building2,
        enabled: false,
        region: 'EU',
    },
    {
        id: 'klarna',
        name: 'Klarna',
        description: 'Buy now, pay later. Pay in 30 days or installments.',
        icon: Wallet,
        enabled: false,
        popular: true,
    },
    {
        id: 'alipay',
        name: 'Alipay',
        description: 'Popular Chinese payment method.',
        icon: Globe,
        enabled: false,
        region: 'China',
    },
    {
        id: 'wechat_pay',
        name: 'WeChat Pay',
        description: 'Popular Chinese mobile payment.',
        icon: Globe,
        enabled: false,
        region: 'China',
    },
];

export default function PaymentMethodsPage() {
    const [methods, setMethods] = useState<PaymentMethod[]>(DEFAULT_METHODS);
    const [saving, setSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    // Load saved preferences from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('payment_methods_config');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                // Merge with defaults to ensure all methods exist
                setMethods(prev => prev.map(m => ({
                    ...m,
                    enabled: parsed[m.id]?.enabled ?? m.enabled
                })));
            } catch (e) {
                console.error('Failed to load saved payment methods');
            }
        }
    }, []);

    const toggleMethod = (id: string) => {
        setMethods(prev => prev.map(m => 
            m.id === id ? { ...m, enabled: !m.enabled } : m
        ));
        setSaved(false);
    };

    const handleSave = async () => {
        setSaving(true);
        
        // Save to localStorage (in production, this would save to your backend)
        const config = methods.reduce((acc, m) => ({
            ...acc,
            [m.id]: { enabled: m.enabled }
        }), {});
        
        localStorage.setItem('payment_methods_config', JSON.stringify(config));
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setSaving(false);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const enabledCount = methods.filter(m => m.enabled).length;

    return (
        <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground">Payment Methods</h1>
                <p className="text-muted-foreground mt-1">
                    Configure which payment options are available to customers at checkout.
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-8">
                <div className="bg-card p-4 rounded-xl border border-border">
                    <p className="text-2xl font-bold text-primary">{enabledCount}</p>
                    <p className="text-sm text-muted-foreground">Enabled Methods</p>
                </div>
                <div className="bg-card p-4 rounded-xl border border-border">
                    <p className="text-2xl font-bold text-blue-600">
                        {methods.filter(m => m.enabled && m.popular).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Popular Methods</p>
                </div>
                <div className="bg-card p-4 rounded-xl border border-border">
                    <p className="text-2xl font-bold text-purple-600">
                        {methods.filter(m => m.enabled && m.region).length}
                    </p>
                    <p className="text-sm text-muted-foreground">Regional Methods</p>
                </div>
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5" />
                    <div>
                        <p className="text-sm text-blue-800 font-medium">Important Note</p>
                        <p className="text-sm text-blue-700 mt-1">
                            Payment methods must also be enabled in your 
                            <a href="https://dashboard.stripe.com/settings/payment_methods" target="_blank" className="underline font-medium"> Stripe Dashboard</a>.
                            Changes here only control visibility on your checkout page.
                        </p>
                    </div>
                </div>
            </div>

            {/* Payment Methods List */}
            <div className="bg-card rounded-xl border border-border overflow-hidden">
                <div className="p-4 border-b border-border bg-muted flex items-center justify-between">
                    <h2 className="font-semibold text-foreground">Available Payment Methods</h2>
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-lg hover:opacity-90 disabled:opacity-50 transition-colors"
                    >
                        {saving ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : saved ? (
                            <Check className="w-4 h-4" />
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {saved ? 'Saved!' : 'Save Changes'}
                    </button>
                </div>

                <div className="divide-y divide-gray-100">
                    {methods.map(method => {
                        const Icon = method.icon;
                        return (
                            <div 
                                key={method.id}
                                className={`p-4 flex items-center justify-between hover:bg-muted transition-colors ${
                                    method.enabled ? '' : 'opacity-60'
                                }`}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                        method.enabled ? 'bg-emerald-100 text-primary' : 'bg-gray-100 text-muted-foreground'
                                    }`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-semibold text-foreground">{method.name}</h3>
                                            {method.popular && (
                                                <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                                                    Popular
                                                </span>
                                            )}
                                            {method.region && (
                                                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full">
                                                    {method.region}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-0.5">{method.description}</p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => toggleMethod(method.id)}
                                    className={`p-2 rounded-lg transition-colors ${
                                        method.enabled 
                                            ? 'text-primary hover:bg-secondary' 
                                            : 'text-muted-foreground hover:bg-gray-100'
                                    }`}
                                >
                                    {method.enabled ? (
                                        <ToggleRight className="w-8 h-8" />
                                    ) : (
                                        <ToggleLeft className="w-8 h-8" />
                                    )}
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Recommended Setup */}
            <div className="mt-8 bg-card rounded-xl border border-border p-6">
                <h2 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" />
                    Recommended Payment Setup
                </h2>
                
                <div className="space-y-4 text-sm text-muted-foreground">
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-primary flex items-center justify-center text-xs font-bold">1</div>
                        <div>
                            <p className="font-medium text-foreground">Enable Cards + Link</p>
                            <p>These are essential for all customers. Link provides 1-click checkout for returning users.</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-primary flex items-center justify-center text-xs font-bold">2</div>
                        <div>
                            <p className="font-medium text-foreground">Add PayPal</p>
                            <p>Many tourists prefer PayPal for security. It can increase conversion by 5-10%.</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-primary flex items-center justify-center text-xs font-bold">3</div>
                        <div>
                            <p className="font-medium text-foreground">Enable Local Bank Methods</p>
                            <p>Add iDEAL (Netherlands), Bancontact (Belgium), and giropay (Germany) for European tourists.</p>
                        </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 text-primary flex items-center justify-center text-xs font-bold">4</div>
                        <div>
                            <p className="font-medium text-foreground">Consider Buy Now, Pay Later</p>
                            <p>Klarna or Afterpay can increase average order value for expensive private tours.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stripe Dashboard Link */}
            <div className="mt-6 flex justify-center">
                <a 
                    href="https://dashboard.stripe.com/settings/payment_methods" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-card border border-border text-foreground font-medium rounded-xl hover:bg-muted transition-colors"
                >
                    Open Stripe Dashboard
                    <span className="text-muted-foreground">→</span>
                </a>
            </div>
        </div>
    );
}
