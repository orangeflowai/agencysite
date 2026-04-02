'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Search, Edit, Eye, Globe, Clock } from 'lucide-react';
import Link from 'next/link';
import { useAdmin } from '@/context/AdminContext';
import { urlFor } from '@/sanity/lib/image';
import { updateTour } from '@/app/actions/tourActions';
import { useRouter } from 'next/navigation';
import { Tour } from '@/lib/sanityService';

export default function AdminProductsPage() {
    const { selectedSiteId, isLoading: isSiteLoading } = useAdmin();
    const [tours, setTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    // Edit Modal State
    const [editingTour, setEditingTour] = useState<Tour | null>(null);
    const [activeTab, setActiveTab] = useState('general');
    const [formData, setFormData] = useState<Record<string, string | number>>({});
    const [saving, setSaving] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);

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

    const handleEditClick = (tour: Tour) => {
        setEditingTour(tour);
        setFormData({
            title: tour.title,
            price: tour.price,
            duration: tour.duration || '',
            groupSize: tour.groupSize || '',
            highlights: tour.features ? tour.features.join('\n') : '',
            includes: tour.includes ? tour.includes.join('\n') : '',
            excludes: tour.excludes ? tour.excludes.join('\n') : '',
            importantInfo: tour.importantInfo ? tour.importantInfo.join('\n') : '',
            // New Fields
            category: tour.category || '',
            badge: tour.badge || '',
            rating: tour.rating || 0,
            reviewCount: tour.reviewCount || 0,
            tags: tour.tags ? tour.tags.join(', ') : '',
        });
        setActiveTab('general');
        setImageFile(null);
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
            // New: Meeting Point and Max Participants
            data.append('meetingPoint', String(formData.meetingPoint || ''));
            data.append('maxParticipants', String(formData.maxParticipants || 0));

            if (imageFile) {
                data.append('image', imageFile);
            }

            const result = await updateTour(data);

            if (result.success) {
                alert("Tour updated successfully!");
                setEditingTour(null);
                setFormData({});
                setImageFile(null);
                // Refresh local data

                // Optimized: Update local state instead of full reload if possible? 
                // For now, full reload or just re-fetch is safer to see Server Side changes.
                // We will trigger a re-fetch by flipping a toggle or calling router.refresh()
                router.refresh();

                // Also trigger our local loadTours check
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

    if (isSiteLoading) return <div className="p-8 text-center text-gray-500">Loading site context...</div>;

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Tours & Products</h1>
                    <p className="text-sm text-gray-500">Manage your tour inventory for {selectedSiteId}</p>
                </div>
                <Link
                    href="/studio/structure/tour"
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
                >
                    <Plus size={16} />
                    New Tour (Sanity)
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 mb-6">
                <Search className="text-gray-400" size={20} />
                <input
                    type="text"
                    placeholder="Search tours..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="flex-1 outline-none text-sm font-medium text-gray-700 placeholder:text-gray-400"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold">
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
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">Loading tours...</td>
                                </tr>
                            ) : filteredTours.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No tours found matching &quot;{search}&quot;</td>
                                </tr>
                            ) : (
                                filteredTours.map((tour) => (
                                    <tr key={tour._id} className="group hover:bg-gray-50/50 transition-colors">
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
                                            <div className="font-bold text-gray-900">{tour.title}</div>
                                            <div className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                                                <Globe size={10} />
                                                /{tour.slug.current}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-emerald-600">€{tour.price}</div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-600">
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
                                                    className="p-2 text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                                                    title="View Live"
                                                >
                                                    <Eye size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleEditClick(tour)}
                                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white sticky top-0 z-10">
                            <h3 className="font-bold text-lg">Edit Tour: {editingTour.title}</h3>
                            <button onClick={() => setEditingTour(null)} className="text-gray-400 hover:text-gray-600">
                                <span className="sr-only">Close</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex border-b border-gray-100 px-6">
                            <button
                                onClick={() => setActiveTab('general')}
                                className={`py-3 px-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'general' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            >
                                General
                            </button>
                            <button
                                onClick={() => setActiveTab('content')}
                                className={`py-3 px-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'content' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            >
                                Content & Lists
                            </button>
                            <button
                                onClick={() => setActiveTab('logistics')}
                                className={`py-3 px-4 text-sm font-bold border-b-2 transition-colors ${activeTab === 'logistics' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                            >
                                Logistics
                            </button>
                        </div>

                        <form id="edit-tour-form" onSubmit={handleSave} className="overflow-y-auto p-6 space-y-6">

                            {activeTab === 'general' && (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="col-span-2">
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Tour Title</label>
                                            <input
                                                type="text"
                                                value={formData.title}
                                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Base Price (€)</label>
                                            <input
                                                type="number"
                                                value={formData.price}
                                                onChange={e => setFormData({ ...formData, price: Number(e.target.value) })}
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Duration</label>
                                            <input
                                                type="text"
                                                value={formData.duration}
                                                onChange={e => setFormData({ ...formData, duration: e.target.value })}
                                                placeholder="e.g. 3 hours"
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Group Size</label>
                                            <input
                                                type="text"
                                                value={formData.groupSize}
                                                onChange={e => setFormData({ ...formData, groupSize: e.target.value })}
                                                placeholder="e.g. up to 12 people"
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 font-medium"
                                            />
                                        </div>
                                        {/* New Fields */}
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Category</label>
                                            <select
                                                value={formData.category}
                                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 font-medium"
                                            >
                                                <option value="">Select Category</option>
                                                <option value="Colosseum Tours">Colosseum Tours</option>
                                                <option value="Vatican Tours">Vatican Tours</option>
                                                <option value="Rome City Tours">Rome City Tours</option>
                                                <option value="Hidden Gems">Hidden Gems</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Max Participants (per booking)</label>
                                            <input
                                                type="number"
                                                value={Number(formData.maxParticipants || 0)}
                                                onChange={e => setFormData({ ...formData, maxParticipants: Number(e.target.value) })}
                                                placeholder="e.g. 10"
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Badge</label>
                                            <input
                                                type="text"
                                                value={formData.badge}
                                                onChange={e => setFormData({ ...formData, badge: e.target.value })}
                                                placeholder="e.g. Bestseller"
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rating</label>
                                            <input
                                                type="number"
                                                step="0.1"
                                                max="5"
                                                value={formData.rating}
                                                onChange={e => setFormData({ ...formData, rating: e.target.value })}
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 font-medium"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Review Count</label>
                                            <input
                                                type="number"
                                                value={formData.reviewCount}
                                                onChange={e => setFormData({ ...formData, reviewCount: e.target.value })}
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 font-medium"
                                            />
                                        </div>
                                    </div>

                                    {/* Image Upload UI */}
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Main Image</label>
                                        <div className="flex items-center gap-4">
                                            {/* Preview current image if available */}
                                            {editingTour.mainImage && (
                                                <div className="w-20 h-20 rounded-lg bg-gray-200 overflow-hidden shrink-0">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={urlFor(editingTour.mainImage).width(200).url()}
                                                        alt="Current"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}

                                            <div className="flex-1">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                                    className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 text-sm text-gray-500"
                                                />
                                            </div>
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2">Upload a new image to replace the current one.</p>
                                    </div>

                                    {/* Gallery UI */}
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Image Gallery</label>

                                        {/* Existing Gallery Grid */}
                                        {editingTour.gallery && editingTour.gallery.length > 0 && (
                                            <div className="grid grid-cols-4 gap-2 mb-4">
                                                {editingTour.gallery.map((img: { asset?: { _ref: string } }, idx: number) => (
                                                    <div key={idx} className="aspect-square rounded-lg bg-gray-200 overflow-hidden relative group">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={urlFor(img).width(200).url()}
                                                            alt={`Gallery ${idx}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex-1">
                                            <input
                                                type="file"
                                                multiple
                                                accept="image/*"
                                                // We need to handle this in state properly if we want preview, 
                                                // but for direct upload to Server Action we can just capture the files in the form submit via name="gallery"
                                                // However checking e.target.files is better for React Control
                                                name="gallery"
                                                className="file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 text-sm text-gray-500 w-full"
                                            />
                                        </div>
                                        <p className="text-xs text-gray-400 mt-2">Select multiple images to append to the gallery.</p>
                                    </div>

                                    {/* Marketing Tags */}
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Marketing Tags (Comma Separated)</label>
                                        <input
                                            type="text"
                                            value={formData.tags}
                                            onChange={e => setFormData({ ...formData, tags: e.target.value })}
                                            placeholder="e.g. Selling Fast, 10% OFF, Featured"
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 font-medium"
                                        />
                                    </div>
                                </div>
                            )}

                            {activeTab === 'content' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Highlights (One per line)</label>
                                        <textarea
                                            value={formData.highlights}
                                            onChange={e => setFormData({ ...formData, highlights: e.target.value })}
                                            rows={5}
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 font-medium text-sm"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">What&apos;s Included (One per line)</label>
                                            <textarea
                                                value={formData.includes}
                                                onChange={e => setFormData({ ...formData, includes: e.target.value })}
                                                rows={5}
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 font-medium text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 uppercase mb-1">What&apos;s Not Included</label>
                                            <textarea
                                                value={formData.excludes}
                                                onChange={e => setFormData({ ...formData, excludes: e.target.value })}
                                                rows={5}
                                                className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 font-medium text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'logistics' && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Meeting Point</label>
                                        <input
                                            type="text"
                                            value={String(formData.meetingPoint || '')}
                                            onChange={e => setFormData({ ...formData, meetingPoint: e.target.value })}
                                            placeholder="e.g. Via di San Gregorio, 00184 Roma RM"
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Important Info / Know Before You Go</label>
                                        <textarea
                                            value={formData.importantInfo}
                                            onChange={e => setFormData({ ...formData, importantInfo: e.target.value })}
                                            rows={5}
                                            placeholder="Dress code, ID requirements, etc."
                                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-emerald-500 font-medium text-sm"
                                        />
                                    </div>
                                </div>
                            )}
                        </form>

                        <div className="p-6 border-t border-gray-100 bg-gray-50">
                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => setEditingTour(null)}
                                    className="flex-1 py-3 font-bold text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-xl transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    form="edit-tour-form" // Link button to the form
                                    disabled={saving}
                                    className="flex-1 py-3 font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-lg shadow-emerald-200 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
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
