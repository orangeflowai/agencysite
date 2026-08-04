'use client';

import { useState, useEffect } from 'react';
import {
    Loader2, Plus, Trash2, Clock, X, Pencil, Check,
    ToggleRight, Zap, ChevronDown, ChevronUp, Pause, Play
} from 'lucide-react';

export interface InventorySlot {
    id: string;
    tour_slug?: string;
    date: string;
    time: string;
    available_slots: number;
    price_override?: number;
    is_paused?: boolean;
}

interface ManageSlotsModalProps {
    tourTitle: string;
    tourSlug: string;
    date: string;
    initialSlots: InventorySlot[];
    onClose: () => void;
}

// All 30-min intervals from 08:00 → 17:30
const TIME_GRID: string[] = [];
for (let h = 8; h <= 17; h++) {
    TIME_GRID.push(`${String(h).padStart(2, '0')}:00`);
    if (h < 17 || true) TIME_GRID.push(`${String(h).padStart(2, '0')}:30`);
}
// Remove 17:30 but keep 17:00 and 17:30 (08:00–17:30 inclusive)
// TIME_GRID already has 08:00..17:30 from the loop above — filter to stop at 17:30
const DISPLAY_TIMES = TIME_GRID.filter(t => t <= '17:30');

export default function ManageSlotsModal({
    tourTitle, tourSlug, date, initialSlots, onClose
}: ManageSlotsModalProps) {
    const [slots, setSlots] = useState<InventorySlot[]>(initialSlots);
    const [error, setError] = useState<string | null>(null);

    // ── Manual add form ──
    const [newTime, setNewTime] = useState('09:00');
    const [newCount, setNewCount] = useState(20);
    const [newPrice, setNewPrice] = useState<number | ''>('');
    const [adding, setAdding] = useState(false);

    // ── Edit inline ──
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editSpots, setEditSpots] = useState<number>(0);
    const [editPrice, setEditPrice] = useState<number | ''>('');
    const [saving, setSaving] = useState(false);

    // ── Delete ──
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [deletingAll, setDeletingAll] = useState(false);

    // ── Quick-switch panel ──
    const [showQuickPanel, setShowQuickPanel] = useState(true);
    const [quickSpots, setQuickSpots] = useState(20);
    const [quickPrice, setQuickPrice] = useState<number | ''>('');
    const [bulkLoading, setBulkLoading] = useState<string | null>(null); // time being toggled

    useEffect(() => { setSlots(initialSlots); }, [initialSlots]);

    const configuredTimes = new Set(slots.map(s => s.time));

    // ── Helpers ──
    const upsertSlotLocal = (slot: InventorySlot) => {
        setSlots(prev => {
            const exists = prev.find(s => s.id === slot.id);
            if (exists) return prev.map(s => s.id === slot.id ? slot : s);
            return [...prev, slot].sort((a, b) => a.time.localeCompare(b.time));
        });
    };

    // ── Quick toggle a time ON/OFF ──
    const handleQuickToggle = async (time: string) => {
        setBulkLoading(time);
        setError(null);
        try {
            const existingSlot = slots.find(s => s.time === time);

            if (existingSlot) {
                // Turn OFF — delete
                const res = await fetch('/api/admin/inventory', {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: existingSlot.id }),
                });
                const json = await res.json();
                if (!res.ok) throw new Error(json.error || 'Delete failed');
                setSlots(prev => prev.filter(s => s.time !== time));
            } else {
                // Turn ON — create
                const res = await fetch('/api/admin/inventory', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        tour_slug: tourSlug,
                        date,
                        time,
                        available_slots: quickSpots,
                        price_override: quickPrice !== '' ? quickPrice : null,
                    }),
                });
                const json = await res.json();
                if (!res.ok) throw new Error(json.error || 'Add failed');
                upsertSlotLocal(json.slot);
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setBulkLoading(null);
        }
    };

    // ── Enable all / Disable all ──
    const handleEnableAll = async () => {
        setBulkLoading('__all__');
        setError(null);
        const timesToAdd = DISPLAY_TIMES.filter(t => !configuredTimes.has(t));
        try {
            for (const time of timesToAdd) {
                const res = await fetch('/api/admin/inventory', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        tour_slug: tourSlug,
                        date,
                        time,
                        available_slots: quickSpots,
                        price_override: quickPrice !== '' ? quickPrice : null,
                    }),
                });
                const json = await res.json();
                if (!res.ok) throw new Error(json.error || 'Add failed');
                upsertSlotLocal(json.slot);
            }
        } catch (e: any) {
            setError(e.message);
        } finally {
            setBulkLoading(null);
        }
    };

    // ── Manual add ──
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
            upsertSlotLocal(json.slot);
            setNewPrice('');
        } catch (e: any) {
            setError(e.message);
        } finally {
            setAdding(false);
        }
    };

    // ── Delete one ──
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

    // ── Delete all ──
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

    // ── Edit ──
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

    // ── Pause / Resume ──
    const [pausingId, setPausingId] = useState<string | null>(null);

    const handleTogglePause = async (slot: InventorySlot) => {
        setPausingId(slot.id);
        setError(null);
        try {
            const res = await fetch('/api/admin/inventory', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: slot.id, is_paused: !slot.is_paused }),
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json.error || 'Failed to update slot');
            setSlots(prev => prev.map(s => s.id === slot.id ? json.slot : s));
        } catch (e: any) {
            setError(e.message);
        } finally {
            setPausingId(null);
        }
    };

    const isAllLoading = bulkLoading === '__all__';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-card rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden flex flex-col max-h-[92vh]">

                {/* ── Header ── */}
                <div className="bg-emerald-900 px-6 py-5 text-white flex justify-between items-start shrink-0">
                    <div>
                        <h3 className="font-bold text-xl leading-tight">{tourTitle}</h3>
                        <p className="text-emerald-200 text-sm mt-1">
                            {new Date(date + 'T00:00:00').toLocaleDateString(undefined, {
                                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDeleteAll}
                            disabled={deletingAll || slots.length === 0}
                            title="Delete ALL slots for this day"
                            className="bg-red-500/20 hover:bg-red-500/40 disabled:opacity-40 text-red-100 p-2 rounded-full transition-colors"
                        >
                            {deletingAll ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
                        </button>
                        <button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* ── Error Banner ── */}
                {error && (
                    <div className="bg-red-50 border-b border-red-200 px-6 py-3 text-sm text-red-700 font-medium flex items-center justify-between shrink-0">
                        <span>⚠️ {error}</span>
                        <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600 ml-4">✕</button>
                    </div>
                )}

                {/* ── Scrollable body ── */}
                <div className="overflow-y-auto flex-1 p-6 space-y-6">

                    {/* ══ QUICK SWITCH PANEL ══ */}
                    <div className="bg-muted rounded-2xl border border-border overflow-hidden">
                        <button
                            onClick={() => setShowQuickPanel(v => !v)}
                            className="w-full flex items-center justify-between px-5 py-3 hover:bg-border/30 transition-colors"
                        >
                            <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                                <Zap size={15} className="text-amber-500" />
                                Quick Time Switches
                                <span className="text-xs font-normal text-muted-foreground">
                                    (08:00 – 17:30)
                                </span>
                            </div>
                            {showQuickPanel ? <ChevronUp size={16} className="text-muted-foreground" /> : <ChevronDown size={16} className="text-muted-foreground" />}
                        </button>

                        {showQuickPanel && (
                            <div className="px-5 pb-5 space-y-4 border-t border-border">
                                {/* Default spots + price for new toggles */}
                                <div className="flex items-end gap-3 pt-4">
                                    <div>
                                        <label className="block text-xs font-bold text-foreground mb-1">Default Spots</label>
                                        <input
                                            type="number"
                                            min={1}
                                            value={quickSpots}
                                            onChange={e => setQuickSpots(parseInt(e.target.value) || 1)}
                                            className="w-24 p-2 rounded-lg border border-border bg-card text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-foreground mb-1">Price € (optional)</label>
                                        <input
                                            type="number"
                                            placeholder="Default"
                                            value={quickPrice}
                                            onChange={e => setQuickPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                            className="w-28 p-2 rounded-lg border border-border bg-card text-sm font-bold outline-none focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                    <button
                                        onClick={handleEnableAll}
                                        disabled={isAllLoading || DISPLAY_TIMES.every(t => configuredTimes.has(t))}
                                        className="ml-auto text-xs font-bold px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-white rounded-lg transition-colors flex items-center gap-1.5"
                                    >
                                        {isAllLoading ? <Loader2 size={13} className="animate-spin" /> : <ToggleRight size={14} />}
                                        Enable All
                                    </button>
                                </div>

                                {/* Time grid */}
                                <div className="grid grid-cols-5 gap-2">
                                    {DISPLAY_TIMES.map(time => {
                                        const isOn = configuredTimes.has(time);
                                        const slot = slots.find(s => s.time === time);
                                        const isPaused = slot?.is_paused ?? false;
                                        const isLoading = bulkLoading === time;

                                        return (
                                            <button
                                                key={time}
                                                onClick={() => handleQuickToggle(time)}
                                                disabled={isLoading || isAllLoading}
                                                title={
                                                    isPaused
                                                        ? `${time} — Paused (click to remove)`
                                                        : isOn
                                                            ? `${slot?.available_slots} spots${slot?.price_override ? ` · €${slot.price_override}` : ''} — click to remove`
                                                            : `Click to add ${quickSpots} spots at ${time}`
                                                }
                                                className={`relative flex flex-col items-center justify-center rounded-xl py-2 px-1 text-xs font-bold transition-all border-2 select-none
                                                    ${isPaused
                                                        ? 'bg-amber-50 border-amber-300 text-amber-600'
                                                        : isOn
                                                            ? slot?.available_slots === 0
                                                                ? 'bg-red-100 border-red-300 text-red-600'
                                                                : 'bg-emerald-50 border-emerald-400 text-emerald-700'
                                                            : 'bg-card border-border text-muted-foreground hover:border-emerald-300 hover:bg-emerald-50/50'
                                                    }
                                                    ${isLoading ? 'opacity-60' : ''}
                                                    disabled:cursor-wait
                                                `}
                                            >
                                                {isLoading
                                                    ? <Loader2 size={13} className="animate-spin" />
                                                    : (
                                                        <>
                                                            <span>{time}</span>
                                                            {isPaused && (
                                                                <span className="text-[9px] mt-0.5 font-normal text-amber-600">Paused</span>
                                                            )}
                                                            {!isPaused && isOn && (
                                                                <span className={`text-[9px] mt-0.5 font-normal ${slot?.available_slots === 0 ? 'text-red-500' : 'text-emerald-600'}`}>
                                                                    {slot?.available_slots === 0 ? 'Sold out' : `${slot?.available_slots} spots`}
                                                                </span>
                                                            )}
                                                        </>
                                                    )
                                                }
                                            </button>
                                        );
                                    })}
                                </div>
                                <p className="text-[10px] text-muted-foreground">
                                    Green = active · Amber = paused (hidden from customers) · Click to toggle on/off · Edit below
                                </p>
                            </div>
                        )}
                    </div>

                    {/* ══ CONFIGURED SLOTS LIST ══ */}
                    <div className="space-y-2">
                        <h4 className="text-xs font-bold text-muted-foreground tracking-wider">
                            Configured Slots ({slots.length})
                        </h4>

                        {slots.length === 0 && (
                            <div className="text-center py-8 bg-muted rounded-xl border border-dashed border-border">
                                <p className="text-muted-foreground font-medium">No slots for this date.</p>
                                <p className="text-muted-foreground text-sm">Use the switches above or add one manually.</p>
                            </div>
                        )}

                        {slots.map(slot => (
                            <div
                                key={slot.id}
                                className={`rounded-xl border transition-all ${
                                    slot.is_paused
                                        ? 'bg-amber-50/60 border-amber-200'
                                        : slot.available_slots === 0
                                            ? 'bg-red-50 border-red-100'
                                            : 'bg-card border-border shadow-sm'
                                }`}
                            >
                                {editingId === slot.id ? (
                                    /* Edit mode */
                                    <div className="p-3 flex items-center gap-3">
                                        <div className="p-2 rounded-full bg-amber-50 text-amber-500 shrink-0">
                                            <Clock size={16} />
                                        </div>
                                        <span className="font-bold text-foreground w-14 shrink-0">{slot.time}</span>
                                        <div className="flex-1 flex items-center gap-2">
                                            <div>
                                                <label className="text-[9px] font-bold text-muted-foreground block">Spots</label>
                                                <input
                                                    type="number"
                                                    value={editSpots}
                                                    onChange={e => setEditSpots(parseInt(e.target.value) || 0)}
                                                    className="w-20 p-1.5 rounded-lg border border-border text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none block"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-[9px] font-bold text-muted-foreground block">Price €</label>
                                                <input
                                                    type="number"
                                                    placeholder="Default"
                                                    value={editPrice}
                                                    onChange={e => setEditPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                                    className="w-24 p-1.5 rounded-lg border border-border text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none block"
                                                />
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleSaveEdit(slot.id)}
                                            disabled={saving}
                                            className="bg-primary hover:opacity-90 text-primary-foreground p-2 rounded-lg transition-colors"
                                        >
                                            {saving ? <Loader2 size={15} className="animate-spin" /> : <Check size={15} />}
                                        </button>
                                        <button onClick={() => setEditingId(null)} className="text-muted-foreground hover:text-foreground p-2 rounded-lg">
                                            <X size={15} />
                                        </button>
                                    </div>
                                ) : (
                                    /* View mode */
                                    <div className="p-3 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-full shrink-0 ${
                                                slot.is_paused
                                                    ? 'bg-amber-100 text-amber-500'
                                                    : slot.available_slots === 0
                                                        ? 'bg-red-100 text-red-500'
                                                        : 'bg-secondary text-primary'
                                            }`}>
                                                <Clock size={16} />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`font-bold ${slot.is_paused ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                                                        {slot.time}
                                                    </span>
                                                    {slot.is_paused && (
                                                        <span className="text-[9px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">Paused</span>
                                                    )}
                                                    {!slot.is_paused && slot.available_slots === 0 && (
                                                        <span className="text-[9px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded">Sold Out</span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-muted-foreground flex items-center gap-2">
                                                    <span>{slot.available_slots} spots</span>
                                                    {slot.price_override && (
                                                        <span className="text-amber-600 font-bold bg-amber-50 px-1.5 rounded text-xs">€{slot.price_override}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {/* Pause / Resume */}
                                            <button
                                                onClick={() => handleTogglePause(slot)}
                                                disabled={pausingId === slot.id}
                                                className={`p-2 rounded-lg transition-colors ${
                                                    slot.is_paused
                                                        ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                                                        : 'text-muted-foreground hover:text-amber-600 hover:bg-amber-50'
                                                } disabled:opacity-40`}
                                                title={slot.is_paused ? 'Resume this slot (customers can book again)' : 'Pause this slot (hides from customers, keeps data)'}
                                            >
                                                {pausingId === slot.id
                                                    ? <Loader2 size={15} className="animate-spin" />
                                                    : slot.is_paused
                                                        ? <Play size={15} />
                                                        : <Pause size={15} />
                                                }
                                            </button>
                                            <button
                                                onClick={() => startEdit(slot)}
                                                className="text-muted-foreground hover:text-primary p-2 hover:bg-secondary rounded-lg transition-colors"
                                                title="Edit spots / price"
                                            >
                                                <Pencil size={15} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(slot.id)}
                                                disabled={deletingId === slot.id}
                                                className="text-muted-foreground hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-40"
                                                title="Delete this slot"
                                            >
                                                {deletingId === slot.id ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* ══ MANUAL ADD ══ */}
                    <div className="bg-muted p-5 rounded-2xl border border-border">
                        <h4 className="text-xs font-bold text-muted-foreground tracking-wider mb-4">Add Custom Time Slot</h4>
                        <div className="flex items-end gap-3">
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-foreground mb-1.5 ml-1">Time</label>
                                <input
                                    type="time"
                                    value={newTime}
                                    onChange={e => setNewTime(e.target.value)}
                                    className="w-full p-2.5 rounded-xl border border-border bg-card text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                            <div className="w-24">
                                <label className="block text-xs font-bold text-foreground mb-1.5 ml-1">Spots</label>
                                <input
                                    type="number"
                                    value={newCount}
                                    min={0}
                                    onChange={e => setNewCount(parseInt(e.target.value) || 0)}
                                    className="w-full p-2.5 rounded-xl border border-border bg-card text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                            <div className="w-24">
                                <label className="block text-xs font-bold text-foreground mb-1.5 ml-1">Price €</label>
                                <input
                                    type="number"
                                    placeholder="Default"
                                    value={newPrice}
                                    onChange={e => setNewPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                    className="w-full p-2.5 rounded-xl border border-border bg-card text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                            <button
                                onClick={handleAdd}
                                disabled={adding}
                                className="bg-primary hover:opacity-90 text-primary-foreground p-2.5 rounded-xl transition-transform active:scale-95 h-[42px] w-[42px] flex items-center justify-center shrink-0"
                            >
                                {adding ? <Loader2 className="animate-spin w-5 h-5" /> : <Plus size={20} />}
                            </button>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-2 ml-1">
                            Leave Price empty to use the tour's default price. Use this for non-standard times outside 08:00–17:30.
                        </p>
                    </div>
                </div>

                {/* ── Footer ── */}
                <div className="px-6 py-4 bg-muted border-t border-border flex justify-between items-center shrink-0">
                    <span className="text-xs text-muted-foreground">
                        {slots.length} slot{slots.length !== 1 ? 's' : ''} configured
                        {slots.length > 0 && (
                            <>
                                <span className="ml-2 text-emerald-600 font-medium">
                                    · {slots.filter(s => !s.is_paused).reduce((a, s) => a + s.available_slots, 0)} spots available
                                </span>
                                {slots.some(s => s.is_paused) && (
                                    <span className="ml-2 text-amber-600 font-medium">
                                        · {slots.filter(s => s.is_paused).length} paused
                                    </span>
                                )}
                            </>
                        )}
                    </span>
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 bg-card border border-border hover:bg-border/40 text-foreground font-bold rounded-xl transition-colors shadow-sm"
                    >
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
