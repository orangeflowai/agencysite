import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Loader2, Plus, Trash2, Clock, Euro, X, Save } from 'lucide-react';

export interface InventorySlot {
    id: string;
    tour_slug?: string;
    date: string; // Added for calendar filtering
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
    const [toggling, setToggling] = useState<string | null>(null);

    // Refresh slots on mount (in case passed stale data)
    useEffect(() => {
        setSlots(initialSlots);
    }, [initialSlots]);

    const handleAdd = async () => {
        if (!newTime) return;
        setAdding(true);
        try {
            const payload: any = {
                tour_slug: tourSlug,
                date: date,
                time: newTime,
                available_slots: newCount
            };
            if (newPrice !== '') payload.price_override = newPrice;

            const { data, error } = await supabase
                .from('inventory')
                .insert(payload)
                .select()
                .single();

            if (error) throw error;

            setSlots(prev => [...prev, {
                id: data.id,
                tour_slug: data.tour_slug,
                date: data.date,
                time: data.time,
                available_slots: data.available_slots,
                price_override: data.price_override
            }].sort((a, b) => a.time.localeCompare(b.time)));

            // Reset form
            setNewPrice('');
            // Optional: Increment time by 1 hour?
        } catch (e: any) {
            alert("Error: " + e.message);
        } finally {
            setAdding(false);
        }
    };

    const handleDeleteAll = async () => {
        if (!confirm('Are you sure you want to delete ALL slots for this day? This cannot be undone.')) return;
        try {
            const { error } = await supabase
                .from('inventory')
                .delete()
                .eq('tour_slug', tourSlug)
                .eq('date', date);

            if (error) throw error;
            setSlots([]);
        } catch (e: any) {
            alert("Error: " + e.message);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this slot?')) return;
        try {
            await supabase.from('inventory').delete().eq('id', id);
            setSlots(prev => prev.filter(s => s.id !== id));
        } catch (e) {
            console.error(e);
        }
    };

    const handleToggleStatus = async (id: string, currentSlots: number) => {
        const newStatus = currentSlots > 0 ? 0 : 20;
        setToggling(id);
        try {
            const { error } = await supabase
                .from('inventory')
                .update({ available_slots: newStatus })
                .eq('id', id);

            if (error) throw error;
            setSlots(prev => prev.map(s => s.id === id ? { ...s, available_slots: newStatus } : s));
        } catch (err) {
            console.error("Toggle failed", err);
        } finally {
            setToggling(null);
        }
    };

    const handleUpdatePrice = async (id: string, price: number | null) => {
        try {
            const { error } = await supabase
                .from('inventory')
                .update({ price_override: price })
                .eq('id', id);

            if (error) throw error;
            setSlots(prev => prev.map(s => s.id === id ? { ...s, price_override: price || undefined } : s));
        } catch (e) {
            console.error(e);
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="bg-emerald-900 p-6 text-white flex justify-between items-start shrink-0">
                    <div>
                        <h3 className="font-bold text-xl">{tourTitle}</h3>
                        <p className="text-emerald-200 text-sm mt-1">{new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDeleteAll}
                            title="Clear All Inventory for this Day"
                            className="bg-red-500/20 hover:bg-red-500/40 text-red-100 p-2 rounded-full transition-colors"
                        >
                            <Trash2 size={20} />
                        </button>
                        <button onClick={onClose} className="bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors">
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto flex-1">

                    {/* List */}
                    <div className="space-y-3 mb-8">
                        {slots.length === 0 && (
                            <div className="text-center py-8 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                <p className="text-gray-400 font-medium">No slots configured for this date.</p>
                                <p className="text-gray-400 text-sm">Add one below.</p>
                            </div>
                        )}

                        {slots.map(slot => (
                            <div key={slot.id} className={`flex items-center justify-between p-3 rounded-lg border transition-all ${slot.available_slots === 0 ? 'bg-red-50 border-red-100' : 'bg-white border-gray-100 hover:border-emerald-200 shadow-sm'}`}>
                                <div className="flex items-center gap-4">
                                    <div className={`p-2 rounded-full ${slot.available_slots === 0 ? 'bg-red-100 text-red-500' : 'bg-emerald-50 text-emerald-600'}`}>
                                        <Clock size={18} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-900 text-lg">{slot.time}</span>
                                            {slot.available_slots === 0 && (
                                                <span className="text-[10px] font-black text-red-600 uppercase tracking-wider bg-red-100 px-1.5 py-0.5 rounded">Sold Out</span>
                                            )}
                                        </div>
                                        <div className="text-sm text-gray-500 flex items-center gap-2">
                                            <span>{slot.available_slots} spots</span>
                                            {/* Price Indicator */}
                                            {slot.price_override && (
                                                <span className="text-amber-600 font-bold bg-amber-50 px-1.5 rounded text-xs">
                                                    €{slot.price_override}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {/* Quick Price Edit? Probably too complex for inline. Simplification: Just toggle and delete for now, maybe add logic later if needed. 
                                        Actually user WANTS variable pricing. So let's delete and re-add to change price? Or prompt?
                                        Simplest: Delete to change price. Or inline input.
                                    */}
                                    <button
                                        onClick={() => handleToggleStatus(slot.id, slot.available_slots)}
                                        disabled={toggling === slot.id}
                                        className={`text-xs font-bold px-3 py-2 rounded-lg transition-colors border ${slot.available_slots > 0
                                            ? 'bg-white border-red-200 text-red-600 hover:bg-red-50'
                                            : 'bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-700'
                                            }`}
                                    >
                                        {toggling === slot.id ? '...' : (slot.available_slots > 0 ? 'Close' : 'Open')}
                                    </button>

                                    <button onClick={() => handleDelete(slot.id)} className="text-gray-400 hover:text-red-600 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Add New Form */}
                    <div className="bg-gray-50 p-5 rounded-2xl border border-gray-100">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Add New Slot</h4>
                        <div className="flex items-end gap-3">
                            <div className="flex-1">
                                <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Time</label>
                                <input
                                    type="time"
                                    value={newTime}
                                    onChange={e => setNewTime(e.target.value)}
                                    className="w-full p-2.5 rounded-xl border border-gray-200 bg-white text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                            <div className="w-24">
                                <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Spots</label>
                                <input
                                    type="number"
                                    value={newCount}
                                    onChange={e => setNewCount(parseInt(e.target.value))}
                                    className="w-full p-2.5 rounded-xl border border-gray-200 bg-white text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                            <div className="w-24">
                                <label className="block text-xs font-bold text-gray-700 mb-1.5 ml-1">Price (€)</label>
                                <input
                                    type="number"
                                    placeholder="Def"
                                    value={newPrice}
                                    onChange={e => setNewPrice(e.target.value === '' ? '' : parseFloat(e.target.value))}
                                    className="w-full p-2.5 rounded-xl border border-gray-200 bg-white text-sm font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
                                />
                            </div>
                            <button
                                onClick={handleAdd}
                                disabled={adding}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white p-2.5 rounded-xl transition-transform active:scale-95 shadow-md shadow-emerald-200 h-[42px] w-[42px] flex items-center justify-center mb-[1px]"
                            >
                                {adding ? <Loader2 className="animate-spin w-5 h-5" /> : <Plus size={24} />}
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2 ml-1">* Leave Price empty to use standard tour price.</p>
                    </div>

                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
                    <button onClick={onClose} className="px-6 py-2.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 font-bold rounded-xl transition-colors shadow-sm">
                        Done
                    </button>
                </div>
            </div>
        </div>
    );
}
