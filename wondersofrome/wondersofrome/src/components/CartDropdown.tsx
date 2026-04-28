'use client';

import { useCart } from '@/context/CartContext';
import { ShoppingBag, X, Plus, Minus, Trash2, ArrowRight, Shield, Zap, Calendar, Clock } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function CartDropdown() {
  const { items, removeFromCart, updateItem, totalItems, totalPrice, isCartOpen, setIsCartOpen } = useCart();
  const router = useRouter();

  const adjustGuests = (itemId: string, guestType: string, delta: number) => {
    const item = items.find(i => i.id === itemId);
    if (!item?.guestCounts) return;
    const counts = { ...item.guestCounts };
    const total = Object.values(counts).reduce((s, c) => s + (c || 0), 0);
    const newVal = Math.max(0, (counts[guestType] || 0) + delta);
    if (newVal === 0 && total <= 1 && delta < 0) return;
    counts[guestType] = newVal;
    const oldTotal = Object.values(item.guestCounts).reduce((s, c) => s + (c || 0), 0);
    const newTotal = Object.values(counts).reduce((s, c) => s + (c || 0), 0);
    const unitPrice = item.price / Math.max(oldTotal, 1);
    updateItem(itemId, { guestCounts: counts, price: unitPrice * newTotal });
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    const item = items[items.length - 1];
    if (!item) { router.push('/checkout'); return; }
    const counts = item.guestCounts || {};
    const bookingData = {
      tour: { _id: item.tourId, title: item.tourTitle, slug: { current: item.tourSlug }, price: item.price / Math.max(Object.values(counts).reduce((a, b) => a + b, 0), 1) },
      date: item.date, time: item.time, guestCounts: counts, totalPrice: item.price,
    };
    router.push(`/checkout?data=${encodeURIComponent(JSON.stringify(bookingData))}`);
  };

  return (
    <div className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setIsCartOpen(!isCartOpen)}
        aria-label="Shopping cart"
        className="relative p-2 rounded-xl transition-all hover:bg-card/10 group"
      >
        <ShoppingBag className="w-5 h-5 transition-transform group-hover:scale-110" />
        {totalItems > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-gradient-to-br from-emerald-400 to-emerald-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center px-1 shadow-lg shadow-emerald-500/40 animate-pulse-gold">
            {totalItems}
          </span>
        )}
      </button>

      {/* Backdrop */}
      {isCartOpen && (
        <div className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px]" onClick={() => setIsCartOpen(false)} />
      )}

      {/* Dropdown panel */}
      {isCartOpen && (
        <div className="absolute right-0 top-full mt-3 w-[420px] z-50 rounded-2xl overflow-hidden shadow-[0_24px_64px_rgba(0,0,0,0.18)] border border-white/60 animate-fade-up">

          {/* Header — emerald gradient */}
          <div className="relative bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-500 px-5 py-4 flex items-center justify-between overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.15),transparent_60%)]" />
            <div className="relative flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-card/20 backdrop-blur-sm flex items-center justify-center">
                <ShoppingBag size={17} className="text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-sm leading-none">Your Cart</p>
                <p className="text-primary-foreground text-xs mt-0.5">{totalItems} {totalItems === 1 ? 'experience' : 'experiences'}</p>
              </div>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="relative w-8 h-8 rounded-lg bg-card/15 hover:bg-card/25 flex items-center justify-center text-white transition-colors"
            >
              <X size={15} />
            </button>
          </div>

          {/* Body */}
          <div className="bg-card">
            {items.length === 0 ? (
              /* Empty state */
              <div className="px-6 py-12 text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag size={28} className="text-slate-300" />
                </div>
                <p className="font-semibold text-slate-800 text-sm mb-1">Your cart is empty</p>
                <p className="text-slate-400 text-xs mb-5">Add a tour to get started</p>
                <Link
                  href="/search"
                  onClick={() => setIsCartOpen(false)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary transition-colors"
                >
                  Explore experiences <ArrowRight size={12} />
                </Link>
              </div>
            ) : (
              <>
                {/* Items list */}
                <div className="max-h-[340px] overflow-y-auto divide-y divide-slate-100">
                  {items.map((item) => (
                    <div key={item.id} className="px-5 py-4 hover:bg-slate-50/60 transition-colors group">
                      <div className="flex gap-3">
                        {/* Tour image */}
                        {item.image ? (
                          <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                            <Image src={item.image} alt={item.tourTitle} width={56} height={56} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 shrink-0 flex items-center justify-center">
                            <ShoppingBag size={20} className="text-emerald-400" />
                          </div>
                        )}

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <h4 className="font-semibold text-slate-800 text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
                              {item.tourTitle}
                            </h4>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="shrink-0 w-6 h-6 rounded-lg text-slate-300 hover:text-red-400 hover:bg-red-50 flex items-center justify-center transition-all"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>

                          {/* Date + time chips */}
                          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                              <Calendar size={9} /> {item.date}
                            </span>
                            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-primary bg-secondary px-2 py-0.5 rounded-full">
                              <Clock size={9} /> {item.time}
                            </span>
                          </div>

                          {/* Guest adjusters */}
                          <div className="mt-3 space-y-2">
                            {Object.entries(item.guestCounts).map(([type, count]) => {
                              if (count === 0 && Object.keys(item.guestCounts).length > 1) return null;
                              return (
                                <div key={type} className="flex items-center justify-between">
                                  <span className="text-[10px] font-semibold text-slate-400  tracking-wide">{type}</span>
                                  <div className="flex items-center gap-2">
                                    <button
                                      onClick={() => adjustGuests(item.id, type, -1)}
                                      disabled={count <= 0}
                                      className="w-6 h-6 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:border-emerald-300 hover:text-primary hover:bg-secondary transition-all disabled:opacity-30"
                                    >
                                      <Minus size={10} />
                                    </button>
                                    <span className="w-5 text-center text-xs font-bold text-slate-700">{count}</span>
                                    <button
                                      onClick={() => adjustGuests(item.id, type, 1)}
                                      className="w-6 h-6 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:border-emerald-300 hover:text-primary hover:bg-secondary transition-all"
                                    >
                                      <Plus size={10} />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Item price */}
                          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                            <span className="text-[10px] font-medium text-slate-400  tracking-wide">Subtotal</span>
                            <span className="text-sm font-bold text-slate-800">€{item.price.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer — blue gradient */}
                <div className="relative overflow-hidden">
                  {/* Blue gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600" />
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(255,255,255,0.12),transparent_60%)]" />

                  <div className="relative px-5 py-5">
                    {/* Total row */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-muted-foreground text-[10px] font-medium  tracking-wider mb-0.5">Total</p>
                        <p className="text-white font-bold text-2xl leading-none">€{totalPrice.toFixed(2)}</p>
                      </div>
                      {/* Trust badges */}
                      <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-1 text-muted-foreground text-[10px]">
                          <Shield size={10} /> Secure checkout
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground text-[10px]">
                          <Zap size={10} /> Instant confirmation
                        </div>
                      </div>
                    </div>

                    {/* CTA button */}
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-card hover:bg-blue-50 text-blue-700 font-bold py-3.5 rounded-xl transition-all active:scale-[0.98] text-sm flex items-center justify-center gap-2 shadow-lg shadow-blue-900/20 hover:shadow-xl"
                    >
                      Checkout Securely
                      <ArrowRight size={15} />
                    </button>

                    {/* Continue shopping */}
                    <Link
                      href="/search"
                      onClick={() => setIsCartOpen(false)}
                      className="block text-center text-muted-foreground hover:text-white text-xs mt-3 transition-colors"
                    >
                      + Add another experience
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
