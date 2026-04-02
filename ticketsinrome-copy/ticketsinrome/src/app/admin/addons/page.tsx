'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
    Plus, Edit2, Trash2, ToggleRight, ToggleLeft, 
    Package, Search, Star, MapPin, Briefcase, Sparkles,
    Utensils, Camera, Shield, User, Gift, Wifi, Wine,
    ChevronDown, ChevronUp, Save, X, AlertTriangle
} from 'lucide-react';
import { useAdmin } from '@/context/AdminContext';

interface AddOn {
    _id?: string;
    _type: 'addon';
    name: string;
    id: { current: string } | string;
    description: string;
    longDescription?: string;
    price: number;
    pricingType: 'perPerson' | 'perBooking' | 'perHour';
    minHours?: number;
    maxHours?: number;
    icon: string;
    category: string;
    popular: boolean;
    available: boolean;
    sortOrder: number;
    sites?: string[];
}

const ICONS = [
    { value: 'MapPin', label: '📍 Map/Pickup', icon: MapPin },
    { value: 'Briefcase', label: '💼 Luggage', icon: Briefcase },
    { value: 'Star', label: '⭐ VIP/Star', icon: Star },
    { value: 'Sparkles', label: '✨ Guide/Sparkles', icon: Sparkles },
    { value: 'Utensils', label: '🍽️ Food', icon: Utensils },
    { value: 'Camera', label: '📷 Photo', icon: Camera },
    { value: 'Shield', label: '🛡️ Insurance', icon: Shield },
    { value: 'User', label: '👤 Private', icon: User },
    { value: 'Gift', label: '🎁 Kids/Gift', icon: Gift },
    { value: 'Wifi', label: '📶 WiFi', icon: Wifi },
    { value: 'Wine', label: '🍷 Drink', icon: Wine },
];

const CATEGORIES = [
    { value: 'transport', label: '🚗 Transportation' },
    { value: 'services', label: '🛎️ Services' },
    { value: 'food', label: '🍝 Food & Drink' },
    { value: 'experience', label: '✨ Experience' },
    { value: 'insurance', label: '🛡️ Insurance' },
];

export default function AddOnsAdminPage() {
    const { currentSite } = useAdmin();
    const [addOns, setAddOns] = useState<AddOn[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingAddOn, setEditingAddOn] = useState<AddOn | null>(null);
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState<Partial<AddOn>>({
        name: '',
        id: { current: '' },
        description: '',
        longDescription: '',
        price: 0,
        pricingType: 'perBooking',
        minHours: 1,
        maxHours: 8,
        icon: 'Sparkles',
        category: 'services',
        popular: false,
        available: true,
        sortOrder: 0,
    });

    const fetchAddOns = useCallback(async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/admin/addons?site=${currentSite?.slug?.current || 'rome-tour-tickets'}`);
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            setAddOns(data.addOns || []);
        } catch (error) {
            console.error('Error fetching add-ons:', error);
            alert('Failed to load add-ons');
        } finally {
            setLoading(false);
        }
    }, [currentSite?.slug?.current]);

    useEffect(() => {
        fetchAddOns();
    }, [currentSite, fetchAddOns]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const url = editingAddOn?._id 
                ? `/api/admin/addons/${editingAddOn._id}` 
                : '/api/admin/addons';
            const method = editingAddOn?._id ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    sites: [currentSite?._id],
                }),
            });

            if (!response.ok) throw new Error('Failed to save');

            await fetchAddOns();
            setShowForm(false);
            setEditingAddOn(null);
            resetForm();
        } catch (error) {
            console.error('Error saving add-on:', error);
            alert('Failed to save add-on');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/admin/addons/${id}`, {
                method: 'DELETE',
            });

            if (!response.ok) throw new Error('Failed to delete');

            await fetchAddOns();
            setDeleteConfirm(null);
        } catch (error) {
            console.error('Error deleting add-on:', error);
            alert('Failed to delete add-on');
        }
    };

    const toggleAvailability = async (addOn: AddOn) => {
        try {
            const response = await fetch(`/api/admin/addons/${addOn._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...addOn,
                    available: !addOn.available,
                }),
            });

            if (!response.ok) throw new Error('Failed to update');

            await fetchAddOns();
        } catch (error) {
            console.error('Error updating add-on:', error);
            alert('Failed to update add-on');
        }
    };

    const startEdit = (addOn: AddOn) => {
        setEditingAddOn(addOn);
        setFormData({
            name: addOn.name,
            id: addOn.id,
            description: addOn.description,
            longDescription: addOn.longDescription || '',
            price: addOn.price,
            pricingType: addOn.pricingType,
            minHours: addOn.minHours || 1,
            maxHours: addOn.maxHours || 8,
            icon: addOn.icon,
            category: addOn.category,
            popular: addOn.popular,
            available: addOn.available,
            sortOrder: addOn.sortOrder,
        });
        setShowForm(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const resetForm = () => {
        setFormData({
            name: '',
            id: { current: '' },
            description: '',
            longDescription: '',
            price: 0,
            pricingType: 'perBooking',
            minHours: 1,
            maxHours: 8,
            icon: 'Sparkles',
            category: 'services',
            popular: false,
            available: true,
            sortOrder: 0,
        });
    };

    const handleNew = () => {
        setEditingAddOn(null);
        resetForm();
        setShowForm(true);
    };

    const cancelForm = () => {
        setShowForm(false);
        setEditingAddOn(null);
        resetForm();
    };

    const generateSlug = (name: string) => {
        return name.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-|-$/g, '');
    };

    const filteredAddOns = addOns.filter(addon =>
        addon.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        addon.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const IconComponent = ({ iconName }: { iconName: string }) => {
        const iconDef = ICONS.find(i => i.value === iconName);
        const Icon = iconDef?.icon || Package;
        return <Icon className="w-5 h-5" />;
    };

    return (
        <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Add-ons & Extras</h1>
                    <p className="text-gray-500 mt-1">Manage upsell options for checkout</p>
                </div>
                <button
                    onClick={handleNew}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                >
                    <Plus className="w-5 h-5" />
                    Add New
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold text-gray-900">
                            {editingAddOn ? 'Edit Add-on' : 'Create New Add-on'}
                        </h2>
                        <button onClick={cancelForm} className="text-gray-400 hover:text-gray-600">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={e => {
                                        const name = e.target.value;
                                        setFormData(prev => ({
                                            ...prev,
                                            name,
                                            id: editingAddOn ? prev.id : { current: generateSlug(name) }
                                        }));
                                    }}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                    placeholder="e.g., Hotel Pickup Service"
                                />
                            </div>

                            {/* ID/Slug */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Unique ID (Slug) *
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={typeof formData.id === 'object' ? formData.id?.current : formData.id}
                                    onChange={e => setFormData(prev => ({ 
                                        ...prev, 
                                        id: { current: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') }
                                    }))}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none font-mono text-sm"
                                    placeholder="hotel-pickup"
                                />
                                <p className="text-xs text-gray-500 mt-1">Used in code. Lowercase, no spaces.</p>
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Price (€) *
                                </label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={e => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>

                            {/* Pricing Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Pricing Type
                                </label>
                                <select
                                    value={formData.pricingType}
                                    onChange={e => setFormData(prev => ({ ...prev, pricingType: e.target.value as 'perPerson' | 'perBooking' | 'perHour' }))}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                >
                                    <option value="perBooking">Per Booking (flat rate)</option>
                                    <option value="perPerson">Per Person (× adults)</option>
                                    <option value="perHour">Per Hour (× hours)</option>
                                </select>
                            </div>

                            {/* Hour Range - Only for perHour */}
                            {formData.pricingType === 'perHour' && (
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Min Hours
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="24"
                                            value={formData.minHours || 1}
                                            onChange={e => setFormData(prev => ({ ...prev, minHours: parseInt(e.target.value) || 1 }))}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Max Hours
                                        </label>
                                        <input
                                            type="number"
                                            min="1"
                                            max="24"
                                            value={formData.maxHours || 8}
                                            onChange={e => setFormData(prev => ({ ...prev, maxHours: parseInt(e.target.value) || 8 }))}
                                            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Category
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={e => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Icon */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Icon
                                </label>
                                <div className="grid grid-cols-6 gap-2">
                                    {ICONS.map(icon => (
                                        <button
                                            key={icon.value}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, icon: icon.value }))}
                                            className={`p-2 rounded-lg border-2 transition-all ${
                                                formData.icon === icon.value 
                                                    ? 'border-emerald-500 bg-emerald-50' 
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                            title={icon.label}
                                        >
                                            <icon.icon className={`w-5 h-5 mx-auto ${
                                                formData.icon === icon.value ? 'text-emerald-600' : 'text-gray-600'
                                            }`} />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Short Description */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Short Description *
                                </label>
                                <input
                                    type="text"
                                    required
                                    maxLength={150}
                                    value={formData.description}
                                    onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                    placeholder="Brief description shown on checkout"
                                />
                                <p className="text-xs text-gray-500 mt-1">{formData.description?.length || 0}/150 characters</p>
                            </div>

                            {/* Long Description */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Long Description
                                </label>
                                <textarea
                                    rows={3}
                                    value={formData.longDescription}
                                    onChange={e => setFormData(prev => ({ ...prev, longDescription: e.target.value }))}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                    placeholder="More detailed description (optional)"
                                />
                            </div>

                            {/* Sort Order */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Sort Order
                                </label>
                                <input
                                    type="number"
                                    value={formData.sortOrder}
                                    onChange={e => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) || 0 }))}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                                    placeholder="0 = first"
                                />
                                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
                            </div>

                            {/* Toggles */}
                            <div className="flex items-center gap-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.popular}
                                        onChange={e => setFormData(prev => ({ ...prev, popular: e.target.checked }))}
                                        className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                                    />
                                    <span className="text-sm text-gray-700">Mark as Popular</span>
                                </label>

                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.available}
                                        onChange={e => setFormData(prev => ({ ...prev, available: e.target.checked }))}
                                        className="w-5 h-5 text-emerald-600 rounded focus:ring-emerald-500"
                                    />
                                    <span className="text-sm text-gray-700">Available</span>
                                </label>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-3 pt-4 border-t">
                            <button
                                type="button"
                                onClick={cancelForm}
                                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={saving}
                                className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                            >
                                {saving ? (
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <Save className="w-5 h-5" />
                                )}
                                {editingAddOn ? 'Update' : 'Create'} Add-on
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                    type="text"
                    placeholder="Search add-ons..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
                />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <p className="text-2xl font-bold text-gray-900">{addOns.length}</p>
                    <p className="text-sm text-gray-500">Total Add-ons</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <p className="text-2xl font-bold text-emerald-600">{addOns.filter(a => a.available).length}</p>
                    <p className="text-sm text-gray-500">Available</p>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <p className="text-2xl font-bold text-amber-600">{addOns.filter(a => a.popular).length}</p>
                    <p className="text-sm text-gray-500">Popular</p>
                </div>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex items-center justify-center py-12">
                    <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                </div>
            ) : filteredAddOns.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
                    <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No add-ons found</p>
                    <button
                        onClick={handleNew}
                        className="mt-4 text-emerald-600 font-medium hover:underline"
                    >
                        Create your first add-on
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredAddOns.map(addon => (
                        <div
                            key={addon._id}
                            className={`bg-white rounded-xl border transition-all ${
                                addon.available ? 'border-gray-200' : 'border-gray-200 opacity-60'
                            }`}
                        >
                            {/* Main Row */}
                            <div className="p-4 flex items-center gap-4">
                                {/* Icon */}
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                                    addon.available ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'
                                }`}>
                                    <IconComponent iconName={addon.icon} />
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-semibold text-gray-900">{addon.name}</h3>
                                        {addon.popular && (
                                            <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                                                Popular
                                            </span>
                                        )}
                                        {!addon.available && (
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
                                                Hidden
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-gray-500 truncate">{addon.description}</p>
                                </div>

                                {/* Price */}
                                <div className="text-right shrink-0">
                                    <p className="font-bold text-gray-900">€{addon.price}</p>
                                    <p className="text-xs text-gray-500">
                                        {addon.pricingType === 'perPerson' ? 'per person' : 
                                         addon.pricingType === 'perHour' ? `per hour (${addon.minHours || 1}-${addon.maxHours || 8}h)` : 
                                         'per booking'}
                                    </p>
                                </div>

                                {/* Category */}
                                <div className="hidden md:block shrink-0">
                                    <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-lg">
                                        {CATEGORIES.find(c => c.value === addon.category)?.label || addon.category}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => toggleAvailability(addon)}
                                        className={`p-2 rounded-lg transition-colors ${
                                            addon.available 
                                                ? 'text-emerald-600 hover:bg-emerald-50' 
                                                : 'text-gray-400 hover:bg-gray-100'
                                        }`}
                                        title={addon.available ? 'Hide' : 'Show'}
                                    >
                                        {addon.available ? <ToggleRight className="w-6 h-6" /> : <ToggleLeft className="w-6 h-6" />}
                                    </button>
                                    <button
                                        onClick={() => startEdit(addon)}
                                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setDeleteConfirm(addon._id!)}
                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => setExpandedId(expandedId === addon._id ? null : addon._id!)}
                                        className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                                    >
                                        {expandedId === addon._id ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>

                            {/* Expanded Details */}
                            {expandedId === addon._id && (
                                <div className="px-4 pb-4 border-t border-gray-100 pt-4">
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                        <div>
                                            <span className="text-gray-500">ID:</span>
                                            <code className="ml-2 text-gray-900 font-mono">{typeof addon.id === 'object' ? addon.id?.current : addon.id}</code>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Sort Order:</span>
                                            <span className="ml-2 text-gray-900">{addon.sortOrder}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Icon:</span>
                                            <span className="ml-2 text-gray-900">{addon.icon}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Category:</span>
                                            <span className="ml-2 text-gray-900">{addon.category}</span>
                                        </div>
                                    </div>
                                    {addon.longDescription && (
                                        <div className="mt-3 pt-3 border-t border-gray-100">
                                            <span className="text-gray-500 text-sm">Long Description:</span>
                                            <p className="text-gray-700 text-sm mt-1">{addon.longDescription}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Delete Confirmation */}
                            {deleteConfirm === addon._id && (
                                <div className="px-4 pb-4">
                                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                                        <div className="flex items-start gap-3">
                                            <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                                            <div className="flex-1">
                                                <p className="text-sm text-red-800 font-medium">Are you sure?</p>
                                                <p className="text-sm text-red-600 mt-1">This will permanently delete &quot;{addon.name}&quot;. This action cannot be undone.</p>
                                                <div className="flex items-center gap-3 mt-3">
                                                    <button
                                                        onClick={() => handleDelete(addon._id!)}
                                                        className="px-4 py-2 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition-colors"
                                                    >
                                                        Yes, Delete
                                                    </button>
                                                    <button
                                                        onClick={() => setDeleteConfirm(null)}
                                                        className="px-4 py-2 text-gray-600 text-sm font-medium hover:bg-gray-100 rounded-lg transition-colors"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
