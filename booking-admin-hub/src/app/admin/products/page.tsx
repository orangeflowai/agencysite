'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit, Eye, Globe, Clock, X, Loader2, Package, AlertCircle, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
import { urlFor } from '@/sanity/lib/image';
import { updateTour } from '@/app/actions/tourActions';
import { useRouter } from 'next/navigation';
import { Tour } from '@/lib/sanityService';

interface SiteProduct {
    id: string;
    site_id: string;
    sanity_id?: string;
    slug: string;
    title: string;
    description?: string;
    price: number;
    original_price?: number;
    duration?: string;
    category?: string;
    meeting_point?: string;
    max_participants?: number;
    badge?: string;
    rating?: number;
    review_count?: number;
    images?: string[];
    tags?: string[];
    is_active: boolean;
    created_at: string;
}

const CATEGORIES = ['Colosseum Tours', 'Vatican Tours', 'Rome City Tours', 'Hidden Gems', 'Private Tours', 'Food & Wine', 'Day Trips'];

function Toast({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) {
    useEffect(() => { const t = setTimeout(onClose, 4000); return () => clearTimeout(t); }, [onClose]);
    return (
        <div className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl text-white text-sm font-medium transition-all ${type === 'success' ? 'bg-emerald-600' : 'bg-red-600'}`}>
            {type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            {message}
        </div>
    );
}

function NewProductModal({ siteId, onClose, onCreated }: { siteId: string; onClose: () => void; onCreated: (p: SiteProduct) => void }) {
    const [form, setForm] = useState({
        title: '', slug: '', description: '', price: '', original_price: '',
        duration: '', category: '', meeting_point: '', max_participants: '20',
        badge: '', rating: '4.8', review_count: '0', tags: '',
        includes: '', excludes: '', important_info: '',
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleTitleChange = (title: string) => {
        setForm(f => ({
            ...f,
            title,
            slug: f.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSaving(true);

        try {
            const res = await fetch('/api/v1/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    site_id: siteId,
                    title: form.title,
                    slug: form.slug,
                    description: form.description,
                    price: parseFloat(form.price),
                    original_price: form.original_price ? parseFloat(form.original_price) : undefined,
                    duration: form.duration,
                    category: form.category,
                    meeting_point: form.meeting_point,
                    max_participants: parseInt(form.max_participants),
                    badge: form.badge,
                    rating: parseFloat(form.rating),
                    review_count: parseInt(form.review_count),
                    tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
                    includes: form.includes.split('\n').map(t => t.trim()).filter(Boolean),
                    excludes: form.excludes.split('\n').map(t => t.trim()).filter(Boolean),
                    important_info: form.important_info.split('\n').map(t => t.trim()).filter(Boolean),
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Failed to create product');
            onCreated(data.product);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
                {/* Header */}
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-emerald-600 to-emerald-700">
                    <div>
                        <h3 className="font-bold text-xl text-white">New Product</h3>
                        <p className="text-emerald-100 text-sm mt-0.5">Creates in Supabase + Sanity CMS</p>
                    </div>
                    <button onClick={onClose} className="p-2 text-emerald-200 hover:text-white hover:bg-emerald-800/40 rounded-lg transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-5 flex-1">
                    {error && (
                        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-xl text-red-700 text-sm">
                            <AlertCircle size={16} className="shrink-0" />
                            {error}
                        </div>
                    )}

                    {/* Row 1 */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Tour / Product Title *</label>
                        <input required type="text" value={form.title}
                            onChange={e => handleTitleChange(e.target.value)}
                            placeholder="e.g. Vatican Museums & Sistine Chapel Skip-The-Line"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 font-medium transition-all"
                        />
                    </div>

                    {/* Slug */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">URL Slug *</label>
                        <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-500/10 transition-all">
                            <span className="text-gray-400 text-sm">/tour/</span>
                            <input required type="text" value={form.slug}
                                onChange={e => setForm(f => ({ ...f, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }))}
                                placeholder="vatican-museums-sistine-chapel"
                                className="flex-1 bg-transparent outline-none font-mono text-sm text-gray-800"
                            />
                        </div>
                    </div>

                    {/* Price Row */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Price (€) *</label>
                            <input required type="number" step="0.01" min="0" value={form.price}
                                onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                                placeholder="49.00"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 font-medium transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Original Price (€)</label>
                            <input type="number" step="0.01" min="0" value={form.original_price}
                                onChange={e => setForm(f => ({ ...f, original_price: e.target.value }))}
                                placeholder="59.00 (shows strikethrough)"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 font-medium transition-all"
                            />
                        </div>
                    </div>

                    {/* Duration + Category */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Duration</label>
                            <input type="text" value={form.duration}
                                onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}
                                placeholder="e.g. 3 hours"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Category</label>
                            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all">
                                <option value="">Select category</option>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Meeting Point */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Meeting Point</label>
                        <input type="text" value={form.meeting_point}
                            onChange={e => setForm(f => ({ ...f, meeting_point: e.target.value }))}
                            placeholder="e.g. Piazza del Risorgimento, Vatican entrance gate"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                        />
                    </div>

                    {/* Max Pax + Badge */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Max Participants</label>
                            <input type="number" min="1" value={form.max_participants}
                                onChange={e => setForm(f => ({ ...f, max_participants: e.target.value }))}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Badge (optional)</label>
                            <input type="text" value={form.badge}
                                onChange={e => setForm(f => ({ ...f, badge: e.target.value }))}
                                placeholder="e.g. Bestseller, New, 10% OFF"
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                            />
                        </div>
                    </div>

                    {/* Includes / Excludes */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">What&apos;s Included (one per line)</label>
                            <textarea rows={4} value={form.includes}
                                onChange={e => setForm(f => ({ ...f, includes: e.target.value }))}
                                placeholder={"Skip-the-line access\nExpert guide\nSistine Chapel"}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 text-sm resize-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Not Included (one per line)</label>
                            <textarea rows={4} value={form.excludes}
                                onChange={e => setForm(f => ({ ...f, excludes: e.target.value }))}
                                placeholder={"Hotel pickup\nGratuities\nFood & drinks"}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 text-sm resize-none transition-all"
                            />
                        </div>
                    </div>

                    {/* Marketing Tags */}
                    <div>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1.5">Marketing Tags (comma-separated)</label>
                        <input type="text" value={form.tags}
                            onChange={e => setForm(f => ({ ...f, tags: e.target.value }))}
                            placeholder="Selling Fast, Featured, 10% OFF"
                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-all"
                        />
                    </div>
                </form>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3 shrink-0">
                    <button type="button" onClick={onClose}
                        className="flex-1 py-3 font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors">
                        Cancel
                    </button>
                    <button type="submit" form="new-product-form" disabled={saving} onClick={handleSubmit}
                        className="flex-1 py-3 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2">
                        {saving ? <><Loader2 size={16} className="animate-spin" /> Creating...</> : <><Plus size={16} /> Create Product</>}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AdminProductsPage() {
    const { selectedSiteId, isLoading: isSiteLoading } = useAdmin();
    const [tours, setTours] = useState<Tour[]>([]);
    const [siteProducts, setSiteProducts] = useState<SiteProduct[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showNewModal, setShowNewModal] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    const [activeSource, setActiveSource] = useState<'sanity' | 'supabase'>('sanity');

    // Edit Modal State (for Sanity tours)
    const [editingTour, setEditingTour] = useState<Tour | null>(null);
    const [activeTab, setActiveTab] = useState('general');
    const [formData, setFormData] = useState<Record<string, string | number>>({});
    const [saving, setSaving] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const router = useRouter();

    useEffect(() => {
        if (!selectedSiteId) return;
        loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedSiteId]);

    const loadData = async () => {
        setLoading(true);
        try {
            // Load Sanity tours
            const { getTours } = await import('@/lib/sanityService');
            const sanityData = await getTours(selectedSiteId);
            setTours(sanityData);

            // Load Supabase site_products
            const res = await fetch(`/api/v1/products?site_id=${selectedSiteId}`);
            if (res.ok) {
                const data = await res.json();
                setSiteProducts(data.products || []);
            }
        } catch (error) {
            console.error('Failed to load products', error);
        } finally {
            setLoading(false);
        }
    };

    const handleProductCreated = (product: SiteProduct) => {
        setSiteProducts(prev => [product, ...prev]);
        setShowNewModal(false);
        setToast({ message: `"${product.title}" created successfully in Supabase + Sanity!`, type: 'success' });
        setActiveSource('supabase');
    };

    const filteredTours = tours.filter(t =>
        t.title?.toLowerCase().includes(search.toLowerCase()) ||
        t.slug.current?.toLowerCase().includes(search.toLowerCase())
    );

    const filteredSiteProducts = siteProducts.filter(p =>
        p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.slug?.toLowerCase().includes(search.toLowerCase())
    );

    const handleEditClick = (tour: Tour) => {
        setEditingTour(tour);
        setFormData({
            title: tour.title, price: tour.price, duration: tour.duration || '',
            groupSize: tour.groupSize || '',
            highlights: tour.features ? tour.features.join('\n') : '',
            includes: tour.includes ? tour.includes.join('\n') : '',
            excludes: tour.excludes ? tour.excludes.join('\n') : '',
            importantInfo: tour.importantInfo ? tour.importantInfo.join('\n') : '',
            category: tour.category || '', badge: tour.badge || '',
            rating: tour.rating || 0, reviewCount: tour.reviewCount || 0,
            tags: tour.tags ? tour.tags.join(', ') : '',
            meetingPoint: (tour as any).meetingPoint || '',
            maxParticipants: (tour as any).maxParticipants || 0,
        });
        setActiveTab('general');
        setImageFile(null);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTour?._id) return;
        setSaving(true);
        try {
            const data = new FormData();
            data.append('_id', editingTour._id);
            data.append('slug', editingTour.slug.current);
            data.append('title', String(formData.title || ''));
            data.append('price', String(formData.price || 0));
            data.append('duration', String(formData.duration || ''));
            data.append('groupSize', String(formData.groupSize || ''));
            data.append('category', String(formData.category || ''));
            data.append('badge', String(formData.badge || ''));
            data.append('rating', String(formData.rating || 0));
            data.append('reviewCount', String(formData.reviewCount || 0));
            data.append('tags', String(formData.tags || ''));
            data.append('highlights', String(formData.highlights || ''));
            data.append('includes', String(formData.includes || ''));
            data.append('excludes', String(formData.excludes || ''));
            data.append('importantInfo', String(formData.importantInfo || ''));
            data.append('meetingPoint', String(formData.meetingPoint || ''));
            data.append('maxParticipants', String(formData.maxParticipants || 0));
            if (imageFile) data.append('image', imageFile);

            const result = await updateTour(data);
            if (result.success) {
                setToast({ message: 'Tour updated successfully!', type: 'success' });
                setEditingTour(null);
                router.refresh();
                const { getTours } = await import('@/lib/sanityService');
                const newData = await getTours(selectedSiteId);
                setTours(newData);
            } else {
                setToast({ message: `Error: ${result.error}`, type: 'error' });
            }
        } catch {
            setToast({ message: 'Failed to save changes', type: 'error' });
        } finally {
            setSaving(false);
        }
    };

    if (isSiteLoading) return <div className="p-8 text-center text-gray-500 flex items-center gap-2 justify-center"><Loader2 className="animate-spin" size={20} /> Loading site context...</div>;

    return (
        <div>
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
            {showNewModal && <NewProductModal siteId={selectedSiteId} onClose={() => setShowNewModal(false)} onCreated={handleProductCreated} />}

            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tours & Products</h1>
                    <p className="text-sm text-gray-500 mt-0.5">Managing inventory for <span className="font-semibold text-emerald-600">{selectedSiteId}</span></p>
                </div>
                <div className="flex items-center gap-3">
                    <Link href="/studio/structure/tour" target="_blank"
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 bg-white hover:bg-gray-50 rounded-xl transition-colors border border-gray-200">
                        <Globe size={16} />
                        Sanity Studio
                    </Link>
                    <button onClick={() => setShowNewModal(true)}
                        className="flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-lg shadow-emerald-200 active:scale-[0.98]">
                        <Plus size={16} />
                        New Product
                    </button>
                </div>
            </div>

            {/* Source Tabs + Search */}
            <div className="flex items-center gap-4 mb-6">
                <div className="flex gap-1 p-1 bg-gray-100 rounded-xl">
                    <button onClick={() => setActiveSource('sanity')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeSource === 'sanity' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                        Sanity CMS ({filteredTours.length})
                    </button>
                    <button onClick={() => setActiveSource('supabase')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeSource === 'supabase' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>
                        Admin Created ({filteredSiteProducts.length})
                    </button>
                </div>
                <div className="flex-1 flex items-center gap-3 bg-white px-4 py-2.5 rounded-xl border border-gray-200 shadow-sm">
                    <Search className="text-gray-400" size={18} />
                    <input type="text" placeholder="Search products..." value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="flex-1 outline-none text-sm font-medium text-gray-700 placeholder:text-gray-400 bg-transparent"
                    />
                </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
                            <tr>
                                <th className="px-6 py-4 w-16">Image</th>
                                <th className="px-6 py-4">Tour Name</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Duration</th>
                                <th className="px-6 py-4">Source</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr><td colSpan={7} className="px-6 py-12 text-center">
                                    <Loader2 className="animate-spin mx-auto text-emerald-500" size={24} />
                                </td></tr>
                            ) : activeSource === 'sanity' ? (
                                filteredTours.length === 0 ? (
                                    <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                                        <Package size={40} className="mx-auto mb-3 opacity-30" />
                                        No Sanity tours found
                                    </td></tr>
                                ) : filteredTours.map((tour) => (
                                    <tr key={tour._id} className="group hover:bg-gray-50/70 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden">
                                                {tour.mainImage && <img src={urlFor(tour.mainImage).width(100).height(100).url()} alt={tour.title} className="w-full h-full object-cover" />}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{tour.title}</div>
                                            <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><Globe size={10} />/{tour.slug.current}</div>
                                        </td>
                                        <td className="px-6 py-4"><div className="font-bold text-emerald-600">€{tour.price}</div></td>
                                        <td className="px-6 py-4 text-gray-500"><span className="flex items-center gap-1"><Clock size={12} />{tour.duration || '--'}</span></td>
                                        <td className="px-6 py-4"><span className="px-2 py-1 text-xs font-bold bg-blue-50 text-blue-600 rounded-full">Sanity</span></td>
                                        <td className="px-6 py-4"><span className="px-2 py-1 text-xs font-bold bg-green-50 text-green-700 rounded-full">Active</span></td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/tour/${tour.slug.current}`} target="_blank" className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors" title="View Live"><Eye size={16} /></Link>
                                                <button onClick={() => handleEditClick(tour)} className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Edit"><Edit size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                filteredSiteProducts.length === 0 ? (
                                    <tr><td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                                        <Package size={40} className="mx-auto mb-3 opacity-30" />
                                        <p className="font-medium">No admin-created products yet</p>
                                        <button onClick={() => setShowNewModal(true)} className="mt-3 px-4 py-2 bg-emerald-600 text-white text-sm font-bold rounded-lg hover:bg-emerald-700 transition-colors">Create First Product</button>
                                    </td></tr>
                                ) : filteredSiteProducts.map((product) => (
                                    <tr key={product.id} className="group hover:bg-gray-50/70 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-400">
                                                <Package size={20} />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{product.title}</div>
                                            <div className="text-xs text-gray-400 flex items-center gap-1 mt-0.5"><Globe size={10} />/{product.slug}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-emerald-600">€{product.price}</div>
                                            {product.original_price && <div className="text-xs text-gray-400 line-through">€{product.original_price}</div>}
                                        </td>
                                        <td className="px-6 py-4 text-gray-500"><span className="flex items-center gap-1"><Clock size={12} />{product.duration || '--'}</span></td>
                                        <td className="px-6 py-4"><span className="px-2 py-1 text-xs font-bold bg-purple-50 text-purple-600 rounded-full">Admin</span></td>
                                        <td className="px-6 py-4"><span className={`px-2 py-1 text-xs font-bold rounded-full ${product.is_active ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{product.is_active ? 'Active' : 'Inactive'}</span></td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link href={`/tour/${product.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"><Eye size={16} /></Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Sanity Edit Modal */}
            {editingTour && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
                            <h3 className="font-bold text-lg text-gray-900">Edit: {editingTour.title}</h3>
                            <button onClick={() => setEditingTour(null)} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"><X size={20} /></button>
                        </div>
                        <div className="flex border-b border-gray-100 px-6">
                            {['general', 'content', 'logistics'].map(tab => (
                                <button key={tab} onClick={() => setActiveTab(tab)}
                                    className={`py-3 px-4 text-sm font-bold border-b-2 capitalize transition-colors ${activeTab === tab ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}>
                                    {tab === 'content' ? 'Content & Lists' : tab.charAt(0).toUpperCase() + tab.slice(1)}
                                </button>
                            ))}
                        </div>
                        <form id="edit-tour-form" onSubmit={handleSave} className="overflow-y-auto p-6 space-y-4 flex-1">
                            {activeTab === 'general' && (
                                <div className="space-y-4">
                                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tour Title</label>
                                        <input type="text" value={formData.title as string} onChange={e => setFormData({ ...formData, title: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 font-medium" /></div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Price (€)</label>
                                            <input type="number" value={formData.price as number} onChange={e => setFormData({ ...formData, price: Number(e.target.value) })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 font-medium" /></div>
                                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Duration</label>
                                            <input type="text" value={formData.duration as string} onChange={e => setFormData({ ...formData, duration: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 font-medium" /></div>
                                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Group Size</label>
                                            <input type="text" value={formData.groupSize as string} onChange={e => setFormData({ ...formData, groupSize: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 font-medium" /></div>
                                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                                            <select value={formData.category as string} onChange={e => setFormData({ ...formData, category: e.target.value })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 font-medium">
                                                <option value="">Select Category</option>
                                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                            </select></div>
                                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Max Participants</label>
                                            <input type="number" value={Number(formData.maxParticipants || 0)} onChange={e => setFormData({ ...formData, maxParticipants: Number(e.target.value) })} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 font-medium" /></div>
                                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Badge</label>
                                            <input type="text" value={formData.badge as string} onChange={e => setFormData({ ...formData, badge: e.target.value })} placeholder="e.g. Bestseller" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 font-medium" /></div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Main Image</label>
                                        <div className="flex items-center gap-4">
                                            {editingTour.mainImage && <div className="w-20 h-20 rounded-xl bg-gray-200 overflow-hidden shrink-0"><img src={urlFor(editingTour.mainImage).width(200).url()} alt="Current" className="w-full h-full object-cover" /></div>}
                                            <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                                className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 text-sm text-gray-500" />
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'content' && (
                                <div className="space-y-4">
                                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Highlights (one per line)</label>
                                        <textarea value={formData.highlights as string} onChange={e => setFormData({ ...formData, highlights: e.target.value })} rows={5} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 text-sm resize-none" /></div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">What&apos;s Included</label>
                                            <textarea value={formData.includes as string} onChange={e => setFormData({ ...formData, includes: e.target.value })} rows={5} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 text-sm resize-none" /></div>
                                        <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Not Included</label>
                                            <textarea value={formData.excludes as string} onChange={e => setFormData({ ...formData, excludes: e.target.value })} rows={5} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 text-sm resize-none" /></div>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'logistics' && (
                                <div className="space-y-4">
                                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Meeting Point</label>
                                        <input type="text" value={String(formData.meetingPoint || '')} onChange={e => setFormData({ ...formData, meetingPoint: e.target.value })} placeholder="e.g. Via di San Gregorio, 00184 Roma RM" className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 font-medium" /></div>
                                    <div><label className="block text-xs font-bold text-gray-500 uppercase mb-1">Important Info / Know Before You Go</label>
                                        <textarea value={formData.importantInfo as string} onChange={e => setFormData({ ...formData, importantInfo: e.target.value })} rows={5} placeholder="Dress code, ID requirements, etc." className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 text-sm resize-none" /></div>
                                </div>
                            )}
                        </form>
                        <div className="p-6 border-t border-gray-100 bg-gray-50 flex gap-3 shrink-0">
                            <button type="button" onClick={() => setEditingTour(null)} className="flex-1 py-3 font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors">Cancel</button>
                            <button type="submit" form="edit-tour-form" disabled={saving} className="flex-1 py-3 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2">
                                {saving ? <><Loader2 size={16} className="animate-spin" />Saving...</> : 'Save Changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
