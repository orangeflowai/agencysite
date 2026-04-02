'use client';

import { useCart } from '@/context/CartContext';
import { ShoppingBag, X, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';

function CartContent() {
    const {
        items,
        removeFromCart,
        totalItems,
        totalPrice,
        isCartOpen,
        setIsCartOpen
    } = useCart();
    const router = useRouter();

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
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
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
                    <div className="absolute right-0 top-full mt-2 w-80 md:w-96 bg-white rounded-xl shadow-2xl border border-gray-100 z-50 overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                            <h3 className="font-bold text-gray-900">Your Cart ({totalItems})</h3>
                            <button
                                onClick={() => setIsCartOpen(false)}
                                className="p-1 hover:bg-gray-100 rounded-lg"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {items.length === 0 ? (
                            <div className="p-8 text-center">
                                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-500 text-sm">Your cart is empty</p>
                                <Link
                                    href="/category/all"
                                    onClick={() => setIsCartOpen(false)}
                                    className="text-emerald-600 text-sm font-medium mt-2 inline-block"
                                >
                                    Browse tours
                                </Link>
                            </div>
                        ) : (
                            <>
                                <div className="max-h-80 overflow-y-auto">
                                    {items.map((item) => (
                                        <div key={item.id} className="p-4 border-b border-gray-100">
                                            <div className="flex gap-3">
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-semibold text-gray-900 text-sm truncate">
                                                        {item.tourTitle}
                                                    </h4>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {item.date} at {item.time}
                                                    </p>

                                                    {/* Guest List */}
                                                    <div className="mt-2 space-y-1">
                                                        {item.guestCounts && Object.entries(item.guestCounts).map(([type, count]) => (
                                                            (count as number) > 0 && (
                                                                <div key={type} className="flex items-center justify-between text-sm">
                                                                    <span className="text-gray-600 capitalize">{type}</span>
                                                                    <span className="text-gray-900 font-medium">{count}</span>
                                                                </div>
                                                            )
                                                        ))}
                                                    </div>

                                                    <p className="text-emerald-600 font-bold text-sm mt-2">
                                                        €{item.price.toFixed(2)}
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="p-4 bg-gray-50 border-t border-gray-100">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="font-semibold text-gray-900">Total</span>
                                        <span className="text-xl font-bold text-emerald-600">€{totalPrice.toFixed(2)}</span>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setIsCartOpen(false);
                                            const item = items[0];
                                            if (item && item.guestCounts) {
                                                const counts = item.guestCounts || {};
                                                const totalCount = Object.values(counts).reduce((s, c) => s + (c as number || 0), 0);
                                                const bookingData = {
                                                    tour: {
                                                        _id: item.tourId,
                                                        title: item.tourTitle,
                                                        slug: { current: item.tourSlug },
                                                        price: item.price / Math.max(totalCount, 1),
                                                    },
                                                    date: item.date,
                                                    time: item.time,
                                                    guestCounts: counts,
                                                    totalPrice: item.price,
                                                };
                                                const encoded = encodeURIComponent(JSON.stringify(bookingData));
                                                router.push(`/checkout?data=${encoded}`);
                                            }
                                        }}
                                        className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition-colors"
                                    >
                                        Proceed to Checkout
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

export default function CartDropdown() {
    return (
        <Suspense fallback={<ShoppingBag className="w-5 h-5 text-gray-400" />}>
            <CartContent />
        </Suspense>
    );
}
