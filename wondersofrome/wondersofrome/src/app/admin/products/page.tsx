'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit, Eye, Globe, Clock, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
import { urlFor } from '@/sanity/lib/image';
import { updateTour } from '@/app/actions/tourActions';
import { useRouter } from 'next/navigation';

export default function AdminProductsPage() {
    const { selectedSiteId, isLoading: isSiteLoading } = useAdmin();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [tours, setTours] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Edit Modal State
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [editingTour, setEditingTour] = useState<any | null>(null);
    const [activeTab, setActiveTab] = useState('general');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [formData, setFormData] = useState<any>({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!selectedSiteId) return;

        const loadTours = async () => {
            setLoading(true);
            try {
                // Dynamically import to ensure client-side execution if needed, 
                // though usually we can just import at top if it's safe.
                // Using the updated getTours with siteId
                const { getTours } = await import('@/lib/sanityService');
                const data = await getTours(selectedSiteId);
                setTours(data);
            } catch (error) {
                console.error("Failed to load tours", error);
            } finally {
                setLoading(false);
            }
        };

        loadTours();
    }, [selectedSiteId]);

    const filteredTours = tours.filter(t =>
        t.title?.toLowerCase().includes(search.toLowerCase()) ||
        t.slug.current?.toLowerCase().includes(search.toLowerCase())
    );

    const handleEditClick = (tour: any) => {
        setEditingTour(tour);
        setFormData({
            title: tour.title,
            price: tour.price,
            duration: tour.duration,
            groupSize: tour.groupSize,
            highlights: tour.features ? tour.features.join('\n') : '',
            includes: tour.includes ? tour.includes.join('\n') : '',
            excludes: tour.excludes ? tour.excludes.join('\n') : '',
            importantInfo: tour.importantInfo ? tour.importantInfo.join('\n') : '',
            // New Fields
            category: tour.category || '',
            badge: tour.badge || '',
            rating: tour.rating || '',
            reviewCount: tour.reviewCount || '',
            tags: tour.tags ? tour.tags.join(', ') : '',
            guestTypes: tour.guestTypes || [],
            maxParticipants: tour.maxParticipants || 0,
            meetingPoint: tour.meetingPoint || '',
        });
        setActiveTab('general');
    };

    const router = useRouter();

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTour?._id) return;

        setSaving(true);
        try {
            const data = new FormData();
            data.append('_id', editingTour._id);
            data.append('slug', editingTour.slug.current); // For revalidation
            data.append('title', formData.title || '');
            data.append('price', (formData.price || 0).toString());
            data.append('duration', formData.duration || '');
            data.append('groupSize', formData.groupSize || '');

            data.append('category', formData.category || '');
            data.append('badge', formData.badge || '');
            data.append('rating', (formData.rating || 0).toString());
            data.append('reviewCount', (formData.reviewCount || 0).toString());
            data.append('tags', formData.tags || '');

            // Add Guest Types
            data.append('guestTypes', JSON.stringify(formData.guestTypes || []));
            // New: Max Participants and Meeting Point
            data.append('maxParticipants', (formData.maxParticipants || 0).toString());
            data.append('meetingPoint', formData.meetingPoint || '');

            data.append('highlights', formData.highlights || '');
            data.append('includes', formData.includes || '');
            data.append('excludes', formData.excludes || '');
            data.append('importantInfo', formData.importantInfo || '');

            const result = await updateTour(data);

            if (result.success) {
                alert("Tour updated successfully!");
                setEditingTour(null);
                setFormData({});
                router.refresh();
                const { getTours } = await import('@/lib/sanityService');
                const newData = await getTours(selectedSiteId);
                setTours(newData);
            } else {
                alert(`Error: ${result.error}`);
            }

        } catch (error) {
            console.error("Save Error:", error);
            alert("Failed to save changes.");
        } finally {
            setSaving(false);
        }
    };

    if (isSiteLoading) return <div className="p-8 text-center text-muted-foreground">Loading site context...</div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-foreground">Tours & Products</h1>
                    <p className="text-sm text-muted-foreground">Manage your tour inventory for {selectedSiteId}</p>
                </div>
                <Link
                    href="/studio/structure/tour"
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 bg-secondary hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
                >
                    <Plus size={16} />
                    New Tour (Sanity)
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-card p-4 rounded-xl border border-border shadow-sm flex items-center gap-4 mb-6">
                <Search className="text-muted-foreground" size={20} />
                <input
                    type="text"
                    placeholder="Search tours..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 outline-none text-sm font-medium text-foreground placeholder:text-muted-foreground"
                />
            </div>

            {/* Table */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-muted border-b border-border text-xs  text-muted-foreground font-semibold">
                            <tr>
                                <th className="px-6 py-4 w-16">Image</th>
                                <th className="px-6 py-4">Tour Name</th>
                                <th className="px-6 py-4">Price</th>
                                <th className="px-6 py-4">Duration</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">Loading tours...</td>
                                </tr>
                            ) : filteredTours.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">No tours found matching "{search}"</td>
                                </tr>
                            ) : (
                                filteredTours.map((tour) => (
                                    <tr key={tour._id} className="group hover:bg-muted/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden relative">
                                                {tour.mainImage && (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        src={urlFor(tour.mainImage).width(100).height(100).url()}
                                                        alt={tour.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-foreground">{tour.title}</div>
                                            <div className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                                                <Globe size={10} />
                                                /{tour.slug.current}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-primary">€{tour.price}</div>
                                        </td>
                                        <td className="px-6 py-4 text-muted-foreground">
                                            <span className="flex items-center gap-1"><Clock size={12} /> {tour.duration || '--'}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                Active
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Link
                                                    href={`/tour/${tour.slug.current}`}
                                                    target="_blank"
                                                    className="p-2 text-muted-foreground hover:text-primary hover:bg-secondary rounded-lg transition-colors"
                                                    title="View Live"
                                                >
                                                    <Eye size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleEditClick(tour)}
                                                    className="p-2 text-muted-foreground hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="Quick Edit"
                                                >
                                                    <Edit size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            {editingTour && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-[99999] p-4">
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh] border border-zinc-200 dark:border-zinc-700">
                        <div className="p-6 border-b border-zinc-200 dark:border-zinc-700 flex justify-between items-center bg-white dark:bg-zinc-900 sticky top-0 z-10">
                            <h3 className="font-bold text-lg text-zinc-900 dark:text-white">Edit Tour: {editingTour.title}</h3>
                            <button onClick={() => setEditingTour(null)} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                                <span className="sr-only">Close</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-zinc-200 dark:border-zinc-700 px-6 overflow-x-auto bg-white dark:bg-zinc-900">
                            <button
                                type="button"
                                onClick={() => setActiveTab('general')}
                                className={`py-3 px-4 text-sm font-bold border-b-2 transition-colors shrink-0 ${activeTab === 'general' ? 'border-emerald-500 text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                            >
                                General
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('pricing')}
                                className={`py-3 px-4 text-sm font-bold border-b-2 transition-colors shrink-0 ${activeTab === 'pricing' ? 'border-emerald-500 text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                            >
                                Pricing & Guests
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('content')}
                                className={`py-3 px-4 text-sm font-bold border-b-2 transition-colors shrink-0 ${activeTab === 'content' ? 'border-emerald-500 text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                            >
                                Content & Lists
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveTab('logistics')}
                                className={`py-3 px-4 text-sm font-bold border-b-2 transition-colors shrink-0 ${activeTab === 'logistics' ? 'border-emerald-500 text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'}`}
                            >
                                Logistics
                            </button>
                        </div>

                        <form id="edit-tour-form" onSubmit={handleSave} className="overflow-y-auto p-6 space-y-6 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-white">

                            {activeTab === 'general' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold text-muted-foreground  mb-1">Tour Title</label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full p-3 bg-muted border border-border rounded-xl outline-none focus:border-emerald-500 font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-muted-foreground  mb-1">Base Price (€)</label>
                                            <input
                                                type="number"
                                                value={formData.price}
                                                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                                className="w-full p-3 bg-muted border border-border rounded-xl outline-none focus:border-emerald-500 font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-muted-foreground  mb-1">Duration</label>
                                            <input
                                                type="text"
                                                value={formData.duration}
                                                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                                placeholder="e.g. 3 hours"
                                                className="w-full p-3 bg-muted border border-border rounded-xl outline-none focus:border-emerald-500 font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-muted-foreground  mb-1">Group Size</label>
                                            <input
                                                type="text"
                                                value={formData.groupSize}
                                                onChange={e => setFormData({ ...formData, groupSize: e.target.value })}
                                                placeholder="e.g. up to 12 people"
                                                className="w-full p-3 bg-muted border border-border rounded-xl outline-none focus:border-emerald-500 font-medium"
                                            />
                                        </div>
                                        {/* New Fields */}
                                        <div>
                                            <label className="block text-xs font-bold text-muted-foreground  mb-1">Category</label>
                                            <select
                                                value={formData.category}
                                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full p-3 bg-muted border border-border rounded-xl outline-none focus:border-emerald-500 font-medium"
                                            >
                                                <option value="">Select Category</option>
                                                <option value="colosseum">Colosseum Tours</option>
                                                <option value="vatican">Vatican Tours</option>
                                                <option value="city">Rome City Tours</option>
                                                <option value="hidden-gems">Hidden Gems</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-muted-foreground  mb-1">Badge</label>
                                            <select
                                                value={formData.badge}
                                                onChange={e => setFormData({ ...formData, badge: e.target.value })}
                                                className="w-full p-3 bg-muted border border-border rounded-xl outline-none focus:border-emerald-500 font-medium"
                                            >
                                                <option value="">No Badge</option>
                                                <option value="Bestseller">Bestseller</option>
                                                <option value="Likely to Sell Out">Likely to Sell Out</option>
                                                <option value="Skip the Line">Skip the Line</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-muted-foreground  mb-1">Rating</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                max="5"
                                                value={formData.rating}
                                                onChange={e => setFormData({ ...formData, rating: e.target.value })}
                                                className="w-full p-3 bg-muted border border-border rounded-xl outline-none focus:border-emerald-500 font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-muted-foreground  mb-1">Review Count</label>
                                            <input
                                                type="number"
                                                value={formData.reviewCount}
                                                onChange={e => setFormData({ ...formData, reviewCount: e.target.value })}
                                                className="w-full p-3 bg-muted border border-border rounded-xl outline-none focus:border-emerald-500 font-medium"
                                            />
                                        </div>
                                    </div>

                                    {/* Image Upload UI */}
                                    <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl text-sm text-blue-700 flex items-start gap-3">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                                        <div>
                                            <p className="font-semibold">Images are managed in Sanity Studio</p>
                                            <p className="text-xs mt-0.5 text-blue-600">To change the main image or gallery, open the tour in Sanity Studio using the link below.</p>
                                            <a
                                                href={`/studio/structure/tour;${editingTour._id}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-blue-700 hover:underline"
                                            >
                                                Open in Sanity Studio →
                                            </a>
                                        </div>
                                    </div>

                                    {/* Marketing Tags */}
                                    <div>
                                        <label className="block text-xs font-bold text-muted-foreground  mb-1">Marketing Tags (Comma Separated)</label>
                                        <input
                                            type="text"
                                            value={formData.tags}
                                            onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                            placeholder="e.g. Selling Fast, 10% OFF, Featured"
                                            className="w-full p-3 bg-muted border border-border rounded-xl outline-none focus:border-emerald-500 font-medium"
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'pricing' && (
                                <div className="space-y-6">
                                    <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl">
                                        <p className="text-xs text-amber-800 font-medium">Define price points for different participant types (Adults, Children, etc.). These will override the base price if set.</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-muted-foreground  mb-1">Max Participants (per booking)</label>
                                            <input
                                                type="number"
                                                value={formData.maxParticipants as number}
                                                onChange={e => setFormData({ ...formData, maxParticipants: Number(e.target.value) })}
                                                placeholder="e.g. 10"
                                                className="w-full p-3 bg-muted border border-border rounded-xl outline-none focus:border-emerald-500 font-medium"
                                            />
                                        </div>
                                        {(formData.guestTypes || []).map((gt: any, idx: number) => (
                                            <div key={idx} className="bg-muted p-4 rounded-xl border border-border relative group">
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const newTypes = [...(formData.guestTypes || [])];
                                                        newTypes.splice(idx, 1);
                                                        setFormData({ ...formData, guestTypes: newTypes });
                                                    }}
                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                                                >
                                                    <Trash2 size={12} />
                                                </button>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-bold text-muted-foreground  mb-1">Category Name</label>
                                                        <input
                                                            type="text"
                                                            value={gt.name}
                                                            placeholder="e.g. Adult"
                                                            onChange={e => {
                                                                const newTypes = [...(formData.guestTypes || [])];
                                                                newTypes[idx].name = e.target.value;
                                                                setFormData({ ...formData, guestTypes: newTypes });
                                                            }}
                                                            className="w-full p-2 bg-card border border-border rounded-lg outline-none focus:border-emerald-500 text-sm font-medium"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold text-muted-foreground  mb-1">Price (€)</label>
                                                        <input
                                                            type="number"
                                                            value={gt.price}
                                                            onChange={e => {
                                                                const newTypes = [...(formData.guestTypes || [])];
                                                                newTypes[idx].price = Number(e.target.value);
                                                                setFormData({ ...formData, guestTypes: newTypes });
                                                            }}
                                                            className="w-full p-2 bg-card border border-border rounded-lg outline-none focus:border-emerald-500 text-sm font-medium"
                                                        />
                                                    </div>
                                                    <div className="col-span-2">
                                                        <label className="block text-xs font-bold text-muted-foreground  mb-1">Description</label>
                                                        <input
                                                            type="text"
                                                            value={gt.description}
                                                            placeholder="e.g. Age 18-99"
                                                            onChange={e => {
                                                                const newTypes = [...(formData.guestTypes || [])];
                                                                newTypes[idx].description = e.target.value;
                                                                setFormData({ ...formData, guestTypes: newTypes });
                                                            }}
                                                            className="w-full p-2 bg-card border border-border rounded-lg outline-none focus:border-emerald-500 text-sm font-medium"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            type="button"
                                            onClick={() => {
                                                const newTypes = [...(formData.guestTypes || []), { name: '', price: formData.price || 0, description: '' }];
                                                setFormData({ ...formData, guestTypes: newTypes });
                                            }}
                                            className="w-full py-3 border-2 border-dashed border-border rounded-xl text-muted-foreground font-bold text-sm hover:border-emerald-200 hover:text-primary hover:bg-secondary transition-all flex items-center justify-center gap-2"
                                        >
                                            <Plus size={16} />
                                            Add Participant Category
                                        </button>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'content' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-muted-foreground  mb-1">Highlights (One per line)</label>
                                        <textarea
                                            value={formData.highlights}
                                            onChange={e => setFormData({ ...formData, highlights: e.target.value })}
                                            rows={5}
                                            className="w-full p-3 bg-muted border border-border rounded-xl outline-none focus:border-emerald-500 font-medium text-sm"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-muted-foreground  mb-1">What's Included (One per line)</label>
                                            <textarea
                                                value={formData.includes}
                                                onChange={e => setFormData({ ...formData, includes: e.target.value })}
                                                rows={5}
                                                className="w-full p-3 bg-muted border border-border rounded-xl outline-none focus:border-emerald-500 font-medium text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-muted-foreground  mb-1">What's Not Included</label>
                                            <textarea
                                                value={formData.excludes}
                                                onChange={e => setFormData({ ...formData, excludes: e.target.value })}
                                                rows={5}
                                                className="w-full p-3 bg-muted border border-border rounded-xl outline-none focus:border-emerald-500 font-medium text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'logistics' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-muted-foreground  mb-1">Meeting Point</label>
                                        <input
                                            type="text"
                                            value={formData.meetingPoint as string}
                                            onChange={e => setFormData({ ...formData, meetingPoint: e.target.value })}
                                            placeholder="e.g. Via di San Gregorio, 00184 Roma RM"
                                            className="w-full p-3 bg-muted border border-border rounded-xl outline-none focus:border-emerald-500 font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-muted-foreground  mb-1">Important Info / Know Before You Go</label>
                                        <textarea
                                            value={formData.importantInfo}
                                            onChange={e => setFormData({ ...formData, importantInfo: e.target.value })}
                                            rows={5}
                                            placeholder="Dress code, ID requirements, etc."
                                            className="w-full p-3 bg-muted border border-border rounded-xl outline-none focus:border-emerald-500 font-medium text-sm"
                                        />
                                    </div>
                                </div>
                            )}
                        </form>

                        <div className="p-6 border-t border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 shrink-0">
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingTour(null)}
                                    className="flex-1 py-3 font-bold text-zinc-600 dark:text-zinc-300 bg-white dark:bg-zinc-700 border border-zinc-200 dark:border-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-600 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    form="edit-tour-form" // Link button to the form
                                    disabled={saving}
                                    className="flex-1 py-3 font-bold text-white bg-primary hover:opacity-90 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
