'use client';

import { useState, useEffect } from 'react';
import { Loader2, Plus, Trash2, Clock, X, Pencil, Check } from 'lucide-react';

export interface InventorySlot {
    id: string;
    tour_slug?: string;
    date: string;
    time: string;
    available_slots: number;
    price_override?: number;
}

interface ManageSlotsModalProps {
    tourTitle: string;
    tourSlug: string;
    date: string;
    initialSlots: InventorySlot[];
    onClose: () => void;
}

export default function ManageSlotsModal({ tourTitle, tourSlug, date, initialSlots, onClose }: ManageSlotsModalProps) {
    const [slots, setSlots] = useState<InventorySlot[]>(initialSlots);
    const [newTime, setNewTime] = useState('09:00');
    const [newCount, setNewCount] = useState(20);
    const [newPrice, setNewPrice] = useState<number | ''>('');
    const [adding, setAdding] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deletingAll, setDeletingAll] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editSpots, setEditSpots] = useState<number>(0);
    const [editPrice, setEditPrice] = useState<number | ''>('');
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setSlots(initialSlots);
    }, [initialSlots]);

    const handleAdd = async () => {
        if (!newTime) return;
        setAdding(true);
        setError(null);
        try {
            const res = await fetch('/api/admin/inventory', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    tour_slug: tourSlug,
                    date,
                    time: newTime,
                    available_slots: newCount,
                    price_override: newPrice !== '' ? newPrice : null,
                }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || 'Failed to add slot');

            setSlots(prev => [...prev, json.slot].sort((a, b) => a.time.localeCompare(b.time)));
            setNewPrice('');
        } catch (e: any) {
            setError(e.message);
        } finally {
            setAdding(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this time slot?')) return;
        setDeletingId(id);
        setError(null);
        try {
            const res = await fetch('/api/admin/inventory', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || 'Failed to delete slot');
            setSlots(prev => prev.filter(s => s.id !== id));
        } catch (e: any) {
            setError(e.message);
        } finally {
            setDeletingId(null);
        }
    };

    const handleDeleteAll = async () => {
        if (!confirm('Delete ALL slots for this day? This cannot be undone.')) return;
        setDeletingAll(true);
        setError(null);
        try {
            const res = await fetch('/api/admin/inventory', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tour_slug: tourSlug, date }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || 'Failed to delete all slots');
            setSlots([]);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setDeletingAll(false);
        }
    };

    const startEdit = (slot: InventorySlot) => {
        setEditingId(slot.id);
        setEditSpots(slot.available_slots);
        setEditPrice(slot.price_override ?? '');
    };

    const handleSaveEdit = async (id: string) => {
        setSaving(true);
        setError(null);
        try {
            const res = await fetch('/api/admin/inventory', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id,
                    available_slots: editSpots,
                    price_override: editPrice !== '' ? editPrice : null,
                }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || 'Failed to update slot');
            setSlots(prev => prev.map(s => s.id === id ? json.slot : s));
            setEditingId(null);
        } catch (e: any) {
            setError(e.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="bg-emerald-900 p-6 text-white flex justify-between items-start shrink-0">
                    <div>
                        <h3 className="font-bold text-xl">{tourTitle}</h3>
                        <p className="text-emerald-200 text-sm mt-1">
                            {new Date(date + 'T00:00:00').toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDeleteAll}
                            disabled={deletingAll || slots.length === 0}
                            title="Delete ALL slots for this day"
                            className="bg-red-500/20 hover:bg-red-500/40 disabled:opacity-40 text-red-100 p-2 rounded-full transition-colors"
                        >
                            {deletingAll ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
                        </button>
                        <button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Error Banner */}
                {error && (
                    <div className="bg-red-50 border-b border-red-200 px-6 py-3 text-sm text-red-700 font-medium flex items-center justify-between">
                        <span>⚠️ {error}</span>
                        <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 ml-4">✕</button>
                    </div>
                )}

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1">

                    {/* Slots List */}
                    <div className="space-y-3 mb-8">
                        {slots.length === 0 && (
                            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <p className="text-gray-400 font-medium">No slots for this date.</p>
                                <p className="text-gray-400 text-sm">Add one below.</p>
                            </div>
                        )}

                        {slots.map(slot => (
                            <div key={slot.id} className={`rounded-xl border transition-all ${slot.available_slots === 0 ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100 shadow-sm'}`}>

                                {editingId === slot.id ? (
                                    /* ── Edit Mode ── */
                                    <div className="p-3 flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-amber-50 text-amber-500">
                                            <Clock size={18} />
                                        </div>
                                        <span className="font-bold text-gray-900 text-lg w-16">{slot.time}</span>
                                        <div className="flex-1 flex items-center gap-2">
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 ">Spots</label>
                                                <input
                                                    type="number"
                                                    value={editSpots}
                                                    onChange={e => setEditSpots(parseInt(e.target.value) || 0)}
                                                    className="w-20 p-1.5 rounded-lg border border-gray-200 text-sm font-bold focus:ring-2 focus:ring-primary outline-none block"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-bold text-gray-400 ">Price €</label>
                                                <input
                                                    type="number"
                                                    placeholder="Default"
                                                    value={editPrice}
                                                    onChange={e => setEditPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                                    className="w-24 p-1.5 rounded-lg border border-gray-200 text-sm font-bold focus:ring-2 focus:ring-primary outline-none block"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleSaveEdit(slot.id)}
                                            disabled={saving}
                                            className="bg-emerald-600 hover:opacity-90 text-white p-2 rounded-lg transition-colors"
                                        >
                                            {saving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                        </button>
                                        <button onClick={() => setEditingId(null)} className="text-gray-400 hover:text-gray-600 p-2 rounded-lg">
                                            <X size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    /* ── View Mode ── */
                                    <div className="p-3 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full ${slot.available_slots === 0 ? 'bg-red-100 text-red-500' : 'bg-background text-primary'}`}>
                                                <Clock size={18} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-bold text-gray-900 text-lg">{slot.time}</span>
                                                    {slot.available_slots === 0 && (
                                                        <span className="text-[10px] font-bold text-red-600  bg-red-100 px-1.5 py-0.5 rounded">Sold Out</span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-gray-500 flex items-center gap-2">
                                                    <span>{slot.available_slots} spots</span>
                                                    {slot.price_override && (
                                                        <span className="text-amber-600 font-bold bg-amber-50 px-1.5 rounded text-xs">€{slot.price_override}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            {/* Edit button */}
                                            <button
                                                onClick={() => startEdit(slot)}
                                                className="text-gray-400 hover:text-primary p-2 hover:bg-background rounded-lg transition-colors"
                                                title="Edit spots / price"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            {/* Delete button */}
                                            <button
                                                onClick={() => handleDelete(slot.id)}
                                                disabled={deletingId === slot.id}
                                                className="text-gray-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                                                title="Delete this slot"
                                            >
                                                {deletingId === slot.id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Add New Slot */}
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                        <h4 className="text-xs font-bold text-gray-400  tracking-wider mb-4">Add New Time Slot</h4>
                        <div className="flex items-end gap-3">
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Time</label>
                                <input
                                    type="time"
                                    value={newTime}
                                    onChange={e => setNewTime(e.target.value)}
                                    className="w-full p-2.5 rounded-xl border border-gray-200 bg-white text-sm font-bold focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>
                            <div className="w-24">
                                <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Spots</label>
                                <input
                                    type="number"
                                    value={newCount}
                                    min={0}
                                    onChange={e => setNewCount(parseInt(e.target.value) || 0)}
                                    className="w-full p-2.5 rounded-xl border border-gray-200 bg-white text-sm font-bold focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>
                            <div className="w-24">
                                <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Price €</label>
                                <input
                                    type="number"
                                    placeholder="Default"
                                    value={newPrice}
                                    onChange={e => setNewPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                    className="w-full p-2.5 rounded-xl border border-gray-200 bg-white text-sm font-bold focus:ring-2 focus:ring-primary outline-none"
                                />
                            </div>
                            <button
                                onClick={handleAdd}
                                disabled={adding}
                                className="bg-emerald-600 hover:opacity-90 text-white p-2.5 rounded-xl transition-transform active:scale-95 shadow-md shadow-emerald-200 h-[42px] w-[42px] flex items-center justify-center"
                            >
                                {adding ? <Loader2 className="animate-spin w-5 h-5" /> : <Plus size={22} />}
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2 ml-1">Leave Price empty to use the tour's default price.</p>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center shrink-0">
                    <span className="text-xs text-gray-400">{slots.length} slot{slots.length !== 1 ? 's' : ''} configured</span>
                    <button onClick={onClose} className="px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 font-bold rounded-xl transition-colors shadow-sm">
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
