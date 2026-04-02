'use client';

import { useCart } from '@/context/CartContext';
import { ShoppingBag, X, Plus, Minus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartDropdown() {
    const {
        items,
        removeFromCart,
        updateItem,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen
    } = useCart();
    const router = useRouter();

    const adjustGuests = (itemId: string, guestType: string, delta: number) => {
        const item = items.find(i => i.id === itemId);
        if (!item || !item.guestCounts) return;

        const currentCounts = { ...item.guestCounts };
        const newValue = Math.max(0, (currentCounts[guestType] || 0) + delta);

        const totalGuests = Object.values(currentCounts).reduce((s, c) => s + (c || 0), 0);
        if (newValue === 0 && totalGuests <= 1 && delta < 0) {
            return;
        }

        currentCounts[guestType] = newValue;

        const oldTotal = Object.values(item.guestCounts).reduce((s, c) => s + (c || 0), 0);
        const newTotal = Object.values(currentCounts).reduce((s, c) => s + (c || 0), 0);
        const estimatedUnitPrice = item.price / Math.max(oldTotal, 1);
        const newPrice = estimatedUnitPrice * newTotal;

        updateItem(itemId, {
            guestCounts: currentCounts,
            price: newPrice
        });
    };

    return (
        <div className="relative">
            {/* Cart Button */}
            <button
                onClick={() => setIsCartOpen(!isCartOpen)}
                className="relative p-2 rounded-full hover:bg-white/10 transition-colors"
                aria-label="Shopping cart"
            >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-sky-500 text-white text-[10px] font-black rounded-full flex items-center justify-center shadow-lg transform scale-110">
                        {totalItems}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isCartOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsCartOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-4 w-96 bg-white rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-gray-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                            <h3 className="font-black text-gray-950 uppercase tracking-widest text-xs">Your Booking Cart ({totalItems})</h3>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 hover:text-gray-900"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {items.length === 0 ? (
                            <div className="p-12 text-center">
                                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-gray-300">
                                    <ShoppingBag size={32} />
                                </div>
                                <p className="text-gray-900 font-bold uppercase tracking-tight text-sm">Your cart is empty</p>
                                <Link
                                    href="/search"
                                    onClick={() => setIsCartOpen(false)}
                                    className="text-sky-600 text-xs font-black mt-3 inline-block uppercase tracking-widest hover:text-sky-700 transition-colors"
                                >
                                    Explore Experiences
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="max-h-[400px] overflow-y-auto p-2 space-y-2">
                                    {items.map((item) => (
                                        <div key={item.id} className="p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100 group">
                                            <div className="flex gap-4">
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-black text-gray-950 text-sm truncate uppercase tracking-tight group-hover:text-sky-600 transition-colors">
                                                        {item.tourTitle}
                                                    </h4>
                                                    <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                                            {item.date}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-sky-600 uppercase tracking-widest bg-sky-50 px-1.5 py-0.5 rounded">
                                                            {item.time}
                                                        </span>
                                                    </div>

                                                    {/* Guest Adjustments */}
                                                    <div className="mt-4 space-y-3">
                                                        {Object.entries(item.guestCounts).map(([type, count]) => {
                                                            if (count === 0 && Object.keys(item.guestCounts).length > 1) return null;
                                                            return (
                                                                <div key={type} className="flex items-center justify-between text-xs">
                                                                    <span className="text-gray-500 font-bold uppercase tracking-widest text-[9px]">{type}</span>
                                                                    <div className="flex items-center gap-3">
                                                                        <button
                                                                            onClick={() => adjustGuests(item.id, type, -1)}
                                                                            disabled={count <= 0}
                                                                            className="w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center hover:bg-gray-100 text-gray-400 hover:text-gray-900 transition-all disabled:opacity-30"
                                                                        >
                                                                            <Minus size={12} />
                                                                        </button>
                                                                        <span className="w-4 text-center font-black text-gray-900">{count}</span>
                                                                        <button
                                                                            onClick={() => adjustGuests(item.id, type, 1)}
                                                                            className="w-7 h-7 rounded-lg border border-gray-100 flex items-center justify-center hover:bg-sky-50 text-gray-400 hover:text-sky-600 transition-all"
                                                                        >
                                                                            <Plus size={12} />
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>

                                                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                                        <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Item Total</span>
                                                        <span className="text-sm font-black text-gray-900">
                                                            €{item.price.toFixed(2)}
                                                        </span>
                                                    </div>
                                                </div>

                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-2 text-gray-300 hover:text-red-500 transition-colors self-start"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-6 bg-gray-950">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-0.5">Total Amount</span>
                                            <span className="text-2xl font-black text-white">€{totalPrice.toFixed(2)}</span>
                                        </div>
                                        <div className="flex -space-x-2">
                                            <div className="w-8 h-5 bg-gray-800 rounded flex items-center justify-center text-[7px] text-white font-bold border border-gray-700">VISA</div>
                                            <div className="w-8 h-5 bg-gray-800 rounded flex items-center justify-center text-[7px] text-white font-bold border border-gray-700">MC</div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setIsCartOpen(false);
                                            // Redirect to checkout with the items
                                            // If we have multiple items, the current checkout expects 'data' for one.
                                            // Let's improve this by calculating the total from all items if possible, 
                                            // or just taking the most recently added one but with better validation.
                                            const item = items[items.length - 1]; // Take the latest added
                                            if (item) {
                                                const counts = item.guestCounts || {};
                                                const bookingData = {
                                                    tour: {
                                                        _id: item.tourId,
                                                        title: item.tourTitle,
                                                        slug: { current: item.tourSlug },
                                                        // Fallback price if guest pricing not found, but item.price is the total for that item
                                                        price: item.price / Math.max(Object.values(counts).reduce((a, b) => a + b, 0), 1),
                                                    },
                                                    date: item.date,
                                                    time: item.time,
                                                    guestCounts: counts,
                                                    totalPrice: item.price,
                                                };
                                                const encoded = encodeURIComponent(JSON.stringify(bookingData));
                                                router.push(`/checkout?data=${encoded}`);
                                            } else {
                                                router.push('/checkout');
                                            }
                                        }}
                                        className="w-full bg-sky-600 hover:bg-sky-500 text-white font-black py-4 rounded-xl transition-all active:scale-[0.98] uppercase tracking-[0.2em] text-xs shadow-xl shadow-sky-900/20"
                                    >
                                        Checkout Securely
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
