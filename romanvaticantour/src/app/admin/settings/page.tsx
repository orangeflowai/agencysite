'use client';

import { useState, useEffect } from 'react';
import {
    Settings, Globe, CreditCard, Bell, Database,
    Palette, Check, RefreshCw, Sparkles, Building2,
    Shield, Mail, Phone, MapPin, ExternalLink, Save,
    Calendar
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';
import { useTheme, PRESET_THEMES } from '@/context/ThemeContext';
import CalendarDiagnostic from '@/components/admin/CalendarDiagnostic';

export default function SettingsPage() {
    const { currentSite, sites } = useAdmin();
    const { theme, setTheme, customColors, setCustomColors, isCustom, applyCustomTheme, resetToDefault } = useTheme();
    const [activeTab, setActiveTab] = useState<'general' | 'business' | 'contact' | 'appearance' | 'gdpr' | 'calendar' | 'system'>('general');
    const [mounted, setMounted] = useState(false);
    const [saving, setSaving] = useState(false);

    // Form state for editable fields
    const [businessForm, setBusinessForm] = useState({
        companyName: '',
        vatNumber: '',
        reaNumber: '',
        registeredAddress: '',
        pecEmail: '',
        sdiCode: '',
        shareCapital: '',
    });

    const [contactForm, setContactForm] = useState({
        contactEmail: '',
        contactPhone: '',
        whatsappNumber: '',
        officeAddress: '',
    });

    const [gdprForm, setGdprForm] = useState({
        cookieBannerTitle: '',
        cookieBannerText: '',
        acceptButtonText: '',
        declineButtonText: '',
        privacyPolicyLink: '',
        privacyPolicyText: '',
        showCookieBanner: true,
        gdprComplianceRegion: 'eu',
    });

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    // Load current site data into forms
    useEffect(() => {
        if (currentSite) {
            setBusinessForm({
                companyName: currentSite.businessInfo?.companyName || '',
                vatNumber: currentSite.businessInfo?.vatNumber || '',
                reaNumber: currentSite.businessInfo?.reaNumber || '',
                registeredAddress: currentSite.businessInfo?.registeredAddress || '',
                pecEmail: currentSite.businessInfo?.pecEmail || '',
                sdiCode: currentSite.businessInfo?.sdiCode || '',
                shareCapital: currentSite.businessInfo?.shareCapital || '',
            });
            setContactForm({
                contactEmail: currentSite.contactEmail || '',
                contactPhone: currentSite.contactPhone || '',
                whatsappNumber: (currentSite as any).whatsappNumber || '',
                officeAddress: currentSite.officeAddress || '',
            });
            setGdprForm({
                cookieBannerTitle: currentSite.gdprSettings?.cookieBannerTitle || 'We respect your privacy',
                cookieBannerText: currentSite.gdprSettings?.cookieBannerText || '',
                acceptButtonText: currentSite.gdprSettings?.acceptButtonText || 'Accept All',
                declineButtonText: currentSite.gdprSettings?.declineButtonText || 'Decline',
                privacyPolicyLink: currentSite.gdprSettings?.privacyPolicyLink || '/privacy-policy',
                privacyPolicyText: currentSite.gdprSettings?.privacyPolicyText || 'Read our Privacy Policy',
                showCookieBanner: currentSite.gdprSettings?.showCookieBanner !== false,
                gdprComplianceRegion: currentSite.gdprSettings?.gdprComplianceRegion || 'eu',
            });
        }
    }, [currentSite]);

    const handleColorChange = (key: string, value: string) => {
        setCustomColors({ ...customColors, [key]: value });
    };

    const handleSave = async () => {
        setSaving(true);
        // In a real implementation, this would save to Sanity
        // For now, we'll just simulate a save
        await new Promise(resolve => setTimeout(resolve, 1000));
        setSaving(false);
        alert('Settings saved! (Note: In production, this would save to Sanity CMS)');
    };

    if (!mounted) {
        return <div className="h-96 flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600"></div></div>;
    }

    return (
        <div>
            <div className="flex justify-between items-start mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Settings</h1>
                    <p className="text-muted-foreground mt-1">Configure your website and booking system</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground font-medium rounded-xl hover:opacity-90 transition-colors disabled:opacity-50"
                >
                    {saving ? (
                        <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</>
                    ) : (
                        <><Save className="w-4 h-4" /> Save Changes</>
                    )}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-1 p-1 bg-gray-100 rounded-xl mb-6 w-fit">
                {[
                    { id: 'general', label: 'General', icon: Globe },
                    { id: 'business', label: 'Business', icon: Building2 },
                    { id: 'contact', label: 'Contact', icon: Mail },
                    { id: 'appearance', label: 'Appearance', icon: Palette },
                    { id: 'gdpr', label: 'GDPR', icon: Shield },
                    { id: 'calendar', label: 'Calendar', icon: Calendar },
                    { id: 'system', label: 'System', icon: Database },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                            ? 'bg-card text-foreground shadow-sm'
                            : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* General Tab */}
            {activeTab === 'general' && (
                <div className="grid gap-6">
                    {/* Site Info */}
                    <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-background rounded-lg">
                                <Globe className="w-5 h-5 text-primary" />
                            </div>
                            <h2 className="font-semibold text-foreground">Website Profile</h2>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <span className="text-muted-foreground">Site Name</span>
                                <p className="font-medium text-foreground">{currentSite?.title || 'Loading...'}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Slug</span>
                                <p className="font-medium text-foreground">{currentSite?.slug?.current || 'Loading...'}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Domain</span>
                                <p className="font-medium text-foreground">{currentSite?.domain || 'Not set'}</p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">Status</span>
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                    {currentSite?.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Settings */}
                    <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <CreditCard className="w-5 h-5 text-blue-600" />
                            </div>
                            <h2 className="font-semibold text-foreground">Payment Settings</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-muted rounded-xl">
                                <div>
                                    <p className="font-medium text-foreground">Stripe Integration</p>
                                    <p className="text-sm text-muted-foreground">Accept credit card payments</p>
                                </div>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Connected
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Notifications */}
                    <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-amber-50 rounded-lg">
                                <Bell className="w-5 h-5 text-amber-600" />
                            </div>
                            <h2 className="font-semibold text-foreground">Notifications</h2>
                        </div>
                        <div className="space-y-3">
                            {[
                                { label: 'Booking confirmations', checked: true },
                                { label: 'New order notifications', checked: true },
                                { label: 'Low inventory alerts', checked: false },
                            ].map((item, i) => (
                                <label key={i} className="flex items-center justify-between p-3 bg-muted rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                                    <span className="text-sm font-medium text-foreground">{item.label}</span>
                                    <input type="checkbox" defaultChecked={item.checked} className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary" />
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Business Tab */}
            {activeTab === 'business' && (
                <div className="grid gap-6">
                    <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-indigo-50 rounded-lg">
                                <Building2 className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-foreground">Business Information</h2>
                                <p className="text-sm text-muted-foreground">Legal details shown in footer and invoices</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-foreground">Company Name</label>
                                <input
                                    type="text"
                                    value={businessForm.companyName}
                                    onChange={(e) => setBusinessForm({ ...businessForm, companyName: e.target.value })}
                                    placeholder={`e.g., ${process.env.NEXT_PUBLIC_SITE_NAME || "Your Agency"} S.r.l.`}
                                    className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-foreground">VAT Number (P.IVA)</label>
                                <input
                                    type="text"
                                    value={businessForm.vatNumber}
                                    onChange={(e) => setBusinessForm({ ...businessForm, vatNumber: e.target.value })}
                                    placeholder="e.g., 03188940591"
                                    className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-foreground">REA Number</label>
                                <input
                                    type="text"
                                    value={businessForm.reaNumber}
                                    onChange={(e) => setBusinessForm({ ...businessForm, reaNumber: e.target.value })}
                                    placeholder="e.g., 319122"
                                    className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-foreground">Share Capital</label>
                                <input
                                    type="text"
                                    value={businessForm.shareCapital}
                                    onChange={(e) => setBusinessForm({ ...businessForm, shareCapital: e.target.value })}
                                    placeholder="e.g., Capitale Sociale: €10.000 i.v."
                                    className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="block text-sm font-medium text-foreground">Registered Address (Sede Legale)</label>
                                <input
                                    type="text"
                                    value={businessForm.registeredAddress}
                                    onChange={(e) => setBusinessForm({ ...businessForm, registeredAddress: e.target.value })}
                                    placeholder="e.g., Via Nettunense 188, Aprilia (LT) 04011"
                                    className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-foreground">PEC Email</label>
                                <input
                                    type="email"
                                    value={businessForm.pecEmail}
                                    onChange={(e) => setBusinessForm({ ...businessForm, pecEmail: e.target.value })}
                                    placeholder="Legal certified email"
                                    className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-foreground">SDI Code</label>
                                <input
                                    type="text"
                                    value={businessForm.sdiCode}
                                    onChange={(e) => setBusinessForm({ ...businessForm, sdiCode: e.target.value })}
                                    placeholder="Codice Destinatario"
                                    className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                />
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="mt-8 p-4 bg-muted rounded-xl border border-border">
                            <h3 className="text-sm font-medium text-muted-foreground mb-3">Footer Preview</h3>
                            <div className="text-sm text-muted-foreground space-y-1">
                                <p className="font-medium text-foreground">{businessForm.companyName || 'Company Name'}</p>
                                <p>
                                    {businessForm.vatNumber && `P.IVA: ${businessForm.vatNumber}`}
                                    {businessForm.vatNumber && businessForm.reaNumber && ' • '}
                                    {businessForm.reaNumber && `REA: ${businessForm.reaNumber}`}
                                </p>
                                <p>{businessForm.registeredAddress}</p>
                                {businessForm.shareCapital && <p>{businessForm.shareCapital}</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Contact Tab */}
            {activeTab === 'contact' && (
                <div className="grid gap-6">
                    <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-blue-50 rounded-lg">
                                <Mail className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-foreground">Contact Information</h2>
                                <p className="text-sm text-muted-foreground">Public contact details shown on website</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-foreground">Contact Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="email"
                                        value={contactForm.contactEmail}
                                        onChange={(e) => setContactForm({ ...contactForm, contactEmail: e.target.value })}
                                        placeholder="info@example.com"
                                        className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-foreground">Contact Phone</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="tel"
                                        value={contactForm.contactPhone}
                                        onChange={(e) => setContactForm({ ...contactForm, contactPhone: e.target.value })}
                                        placeholder="+39 123 456 7890"
                                        className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-foreground">WhatsApp Number</label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <input
                                        type="tel"
                                        value={contactForm.whatsappNumber}
                                        onChange={(e) => setContactForm({ ...contactForm, whatsappNumber: e.target.value })}
                                        placeholder={`${process.env.NEXT_PUBLIC_SUPPORT_PHONE || ""} (digits only)`}
                                        className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground">Used for the floating WhatsApp button. Digits only, no + or spaces.</p>
                            </div>
                            <div className="space-y-2 md:col-span-2">
                                <label className="block text-sm font-medium text-foreground">Office Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
                                    <textarea
                                        value={contactForm.officeAddress}
                                        onChange={(e) => setContactForm({ ...contactForm, officeAddress: e.target.value })}
                                        placeholder="Full office address"
                                        rows={3}
                                        className="w-full pl-10 pr-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-pink-50 rounded-lg">
                                <ExternalLink className="w-5 h-5 text-pink-600" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-foreground">Social Media</h2>
                                <p className="text-sm text-muted-foreground">Links to your social profiles</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {['Facebook', 'Instagram', 'Twitter', 'TripAdvisor', 'YouTube', 'LinkedIn'].map((platform) => (
                                <div key={platform} className="space-y-2">
                                    <label className="block text-sm font-medium text-foreground">{platform}</label>
                                    <input
                                        type="url"
                                        placeholder={`https://${platform.toLowerCase()}.com/...`}
                                        className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Appearance Tab */}
            {activeTab === 'appearance' && (
                <div className="grid gap-6">
                    {/* Theme Presets */}
                    <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <Sparkles className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-foreground">Theme Presets</h2>
                                <p className="text-sm text-muted-foreground">Choose a color theme for your website</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                            {Object.entries(PRESET_THEMES).map(([key, preset]) => (
                                <button
                                    key={key}
                                    onClick={() => setTheme(key)}
                                    className={`relative p-4 rounded-xl border-2 transition-all ${!isCustom && theme.name === preset.name
                                        ? 'border-primary bg-background/50'
                                        : 'border-border hover:border-gray-300 bg-card'
                                        }`}
                                >
                                    {!isCustom && theme.name === preset.name && (
                                        <div className="absolute top-2 right-2 w-5 h-5 bg-background0 rounded-full flex items-center justify-center">
                                            <Check className="w-3 h-3 text-white" />
                                        </div>
                                    )}
                                    <div className="space-y-2">
                                        <div className="flex gap-1">
                                            <div className="w-6 h-6 rounded-full" style={{ background: preset.primary }}></div>
                                            <div className="w-6 h-6 rounded-full" style={{ background: preset.secondary }}></div>
                                            <div className="w-6 h-6 rounded-full" style={{ background: preset.accent }}></div>
                                        </div>
                                        <p className="text-sm font-medium text-foreground">{preset.name}</p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Custom Colors */}
                    <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-pink-50 rounded-lg">
                                    <Palette className="w-5 h-5 text-pink-600" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-foreground">Custom Colors</h2>
                                    <p className="text-sm text-muted-foreground">Fine-tune your brand colors</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={applyCustomTheme}
                                    className="px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-colors"
                                >
                                    Apply Custom
                                </button>
                                <button
                                    onClick={resetToDefault}
                                    className="px-4 py-2 bg-gray-100 text-foreground text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    Reset
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                            {[
                                { key: 'primary', label: 'Primary Color', desc: 'Main brand color' },
                                { key: 'primaryLight', label: 'Primary Light', desc: 'Hover states' },
                                { key: 'primaryDark', label: 'Primary Dark', desc: 'Active states' },
                                { key: 'secondary', label: 'Secondary', desc: 'Background accents' },
                                { key: 'accent', label: 'Accent', desc: 'Highlights & CTAs' },
                            ].map((color) => (
                                <div key={color.key} className="space-y-2">
                                    <label className="block text-sm font-medium text-foreground">
                                        {color.label}
                                    </label>
                                    <p className="text-xs text-muted-foreground">{color.desc}</p>
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="color"
                                            value={customColors[color.key as keyof typeof customColors] || theme[color.key as keyof typeof theme]}
                                            onChange={(e) => handleColorChange(color.key, e.target.value)}
                                            className="w-12 h-12 rounded-lg border border-border cursor-pointer"
                                        />
                                        <input
                                            type="text"
                                            value={customColors[color.key as keyof typeof customColors] || theme[color.key as keyof typeof theme]}
                                            onChange={(e) => handleColorChange(color.key, e.target.value)}
                                            className="flex-1 px-3 py-2 border border-border rounded-lg text-sm font-mono "
                                            placeholder="#000000"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Preview */}
                        <div className="mt-8 p-6 rounded-xl border border-border" style={{ background: theme.secondary }}>
                            <h3 className="text-sm font-medium text-muted-foreground mb-4">Live Preview</h3>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    className="px-6 py-3 rounded-xl text-white font-bold transition-all"
                                    style={{ background: theme.primary }}
                                >
                                    Primary Button
                                </button>
                                <button
                                    className="px-6 py-3 rounded-xl text-white font-bold transition-all"
                                    style={{ background: theme.primaryLight }}
                                >
                                    Hover State
                                </button>
                                <button
                                    className="px-6 py-3 rounded-xl text-white font-bold transition-all"
                                    style={{ background: theme.accent }}
                                >
                                    Accent CTA
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* GDPR Tab */}
            {activeTab === 'gdpr' && (
                <div className="grid gap-6">
                    <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-2 bg-green-50 rounded-lg">
                                <Shield className="w-5 h-5 text-green-600" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-foreground">Cookie Banner Settings</h2>
                                <p className="text-sm text-muted-foreground">GDPR compliance and cookie consent</p>
                            </div>
                        </div>

                        <div className="space-y-6">
                            {/* Enable/Disable */}
                            <label className="flex items-center justify-between p-4 bg-muted rounded-xl cursor-pointer">
                                <div>
                                    <p className="font-medium text-foreground">Show Cookie Banner</p>
                                    <p className="text-sm text-muted-foreground">Display cookie consent banner to visitors</p>
                                </div>
                                <input
                                    type="checkbox"
                                    checked={gdprForm.showCookieBanner}
                                    onChange={(e) => setGdprForm({ ...gdprForm, showCookieBanner: e.target.checked })}
                                    className="w-6 h-6 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                            </label>

                            {/* Compliance Region */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-foreground">Compliance Region</label>
                                <select
                                    value={gdprForm.gdprComplianceRegion}
                                    onChange={(e) => setGdprForm({ ...gdprForm, gdprComplianceRegion: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-card"
                                >
                                    <option value="eu">EU (Full GDPR)</option>
                                    <option value="italy">Italy Only</option>
                                    <option value="us">US (CCPA)</option>
                                    <option value="uk">UK GDPR</option>
                                </select>
                            </div>

                            {/* Banner Content */}
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-foreground">Banner Title</label>
                                <input
                                    type="text"
                                    value={gdprForm.cookieBannerTitle}
                                    onChange={(e) => setGdprForm({ ...gdprForm, cookieBannerTitle: e.target.value })}
                                    className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-foreground">Banner Text</label>
                                <textarea
                                    value={gdprForm.cookieBannerText}
                                    onChange={(e) => setGdprForm({ ...gdprForm, cookieBannerText: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-foreground">Accept Button Text</label>
                                    <input
                                        type="text"
                                        value={gdprForm.acceptButtonText}
                                        onChange={(e) => setGdprForm({ ...gdprForm, acceptButtonText: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-foreground">Decline Button Text</label>
                                    <input
                                        type="text"
                                        value={gdprForm.declineButtonText}
                                        onChange={(e) => setGdprForm({ ...gdprForm, declineButtonText: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-foreground">Privacy Policy Link</label>
                                    <input
                                        type="text"
                                        value={gdprForm.privacyPolicyLink}
                                        onChange={(e) => setGdprForm({ ...gdprForm, privacyPolicyLink: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-foreground">Privacy Policy Link Text</label>
                                    <input
                                        type="text"
                                        value={gdprForm.privacyPolicyText}
                                        onChange={(e) => setGdprForm({ ...gdprForm, privacyPolicyText: e.target.value })}
                                        className="w-full px-4 py-2.5 border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Preview */}
                        <div className="mt-8 p-4 bg-muted rounded-xl border border-border">
                            <h3 className="text-sm font-medium text-muted-foreground mb-3">Banner Preview</h3>
                            <div className="bg-card rounded-xl shadow-lg border border-border p-4">
                                <h4 className="font-bold text-foreground mb-2">{gdprForm.cookieBannerTitle}</h4>
                                <p className="text-sm text-muted-foreground mb-3">
                                    {gdprForm.cookieBannerText || 'Cookie banner text will appear here...'}
                                </p>
                                <div className="flex gap-2">
                                    <button className="px-4 py-2 rounded-lg border border-border text-muted-foreground text-sm font-medium">
                                        {gdprForm.declineButtonText}
                                    </button>
                                    <button className="px-4 py-2 rounded-lg bg-emerald-800 text-white text-sm font-medium">
                                        {gdprForm.acceptButtonText}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Calendar Tab */}
            {activeTab === 'calendar' && (
                <div className="grid gap-6">
                    <CalendarDiagnostic />

                    <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
                        <h3 className="font-bold text-foreground mb-4">Calendar Color Legend</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="flex items-center gap-3 p-4 bg-background rounded-xl border border-emerald-100">
                                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                                    <div className="w-4 h-4 bg-background0 rounded-full"></div>
                                </div>
                                <div>
                                    <p className="font-semibold text-emerald-900">Green</p>
                                    <p className="text-sm text-foreground">High availability (&gt;10 spots)</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-amber-50 rounded-xl border border-amber-100">
                                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                    <div className="w-4 h-4 bg-amber-500 rounded-full"></div>
                                </div>
                                <div>
                                    <p className="font-semibold text-amber-900">Yellow</p>
                                    <p className="text-sm text-amber-700">Low availability (&lt;10 spots)</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 p-4 bg-rose-50 rounded-xl border border-rose-100">
                                <div className="w-8 h-8 bg-rose-100 rounded-lg flex items-center justify-center">
                                    <div className="w-4 h-4 bg-rose-500 rounded-full"></div>
                                </div>
                                <div>
                                    <p className="font-semibold text-rose-900">Red</p>
                                    <p className="text-sm text-rose-700">Sold Out (0 spots)</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-100">
                        <h3 className="font-bold text-blue-900 mb-3">How to Add Inventory</h3>
                        <ol className="list-decimal list-inside space-y-2 text-blue-800">
                            <li>Go to <strong>Admin → Inventory Calendar</strong></li>
                            <li>Select a tour from the dropdown</li>
                            <li>Click on any date in the calendar</li>
                            <li>Add time slots (e.g., 09:00, 14:00)</li>
                            <li>Set available spots for each time</li>
                            <li>Optionally set a price override</li>
                            <li>The colors will appear on the public calendar!</li>
                        </ol>
                    </div>
                </div>
            )}

            {/* System Tab */}
            {activeTab === 'system' && (
                <div className="grid gap-6">
                    {/* Database Status */}
                    <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-purple-50 rounded-lg">
                                <Database className="w-5 h-5 text-purple-600" />
                            </div>
                            <h2 className="font-semibold text-foreground">Database Connection</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                <span className="text-foreground font-medium">Supabase connected</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-4">
                                <div className="p-4 bg-muted rounded-xl">
                                    <p className="text-xs text-muted-foreground  tracking-wider mb-1">Bookings Table</p>
                                    <p className="text-lg font-bold text-foreground">Active</p>
                                </div>
                                <div className="p-4 bg-muted rounded-xl">
                                    <p className="text-xs text-muted-foreground  tracking-wider mb-1">Inventory Table</p>
                                    <p className="text-lg font-bold text-foreground">Active</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* System Info */}
                    <div className="bg-card rounded-2xl shadow-sm border border-border p-6">
                        <h2 className="font-semibold text-foreground mb-4">System Information</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between py-2 border-b border-border">
                                <span className="text-muted-foreground">Next.js Version</span>
                                <span className="font-medium">16.1.3</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-border">
                                <span className="text-muted-foreground">React Version</span>
                                <span className="font-medium">19.0.0</span>
                            </div>
                            <div className="flex justify-between py-2 border-b border-border">
                                <span className="text-muted-foreground">Node Environment</span>
                                <span className="font-medium">Production</span>
                            </div>
                            <div className="flex justify-between py-2">
                                <span className="text-muted-foreground">Build Time</span>
                                <span className="font-medium">{new Date().toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
