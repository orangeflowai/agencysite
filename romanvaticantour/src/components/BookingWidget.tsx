'use client';

import { useState, useEffect, useMemo } from 'react';
import { Calendar, Users, CheckCircle, Loader2, Info, UsersIcon, Clock, AlertTriangle, Star, Minus, Plus, ChevronRight, ShoppingCart, MapPin, Zap } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import Image from 'next/image';
import SmartCalendar from './ui/SmartCalendar';
import { format } from 'date-fns';
import { useSite } from '@/components/SiteProvider';
import { useCart } from '@/context/CartContext';
import CheckoutDrawer from './CheckoutDrawer';
import { urlFor, getTourImage, extractPortableText } from '@/lib/dataAdapter';
import { getStripeKey } from '@/lib/stripeKeys';

interface GuestType {
  name: string;
  price: number;
  description?: string;
}

interface BookingWidgetProps {
  tour: {
    _id: string;
    title: string;
    price: number;
    slug: { current: string };
    mainImage?: any;
    guestTypes?: GuestType[];
    category?: string;
    meetingPoint?: string;
    maxParticipants?: number;
    duration?: string;
    rating?: number;
    reviewCount?: number;
    includes?: string[];
    description?: any;
  };
}

interface TimeSlot {
  time: string;
  available_slots: number;
}

export default function BookingWidget({ tour }: BookingWidgetProps) {
  const site = useSite();
  const { addToCart } = useCart();
  const siteId = site?.slug?.current || process.env.NEXT_PUBLIC_SITE_ID || 'romanvaticantour';

  const stripePromise = useMemo(() => {
    const key = getStripeKey(siteId);
    if (!key) return null;
    return loadStripe(key);
  }, [siteId]);

  const currentGuestTypes = useMemo(() => {
    if (tour.guestTypes?.length) return tour.guestTypes;
    return [
      { name: 'Adult', price: tour.price, description: 'Age 18+' },
      { name: 'Student', price: Math.round(tour.price * 0.85), description: 'ID Required' },
      { name: 'Youth', price: Math.round(tour.price * 0.7), description: 'Under 18' },
      { name: 'Child', price: Math.round(tour.price * 0.5), description: 'Under 8' },
    ];
  }, [tour]);

  const [counts, setCounts] = useState<Record<string, number>>({});
  useEffect(() => {
    const initial: Record<string, number> = {};
    currentGuestTypes.forEach((gt, i) => { initial[gt.name] = i === 0 ? 1 : 0; });
    setCounts(initial);
  }, [currentGuestTypes]);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [checkingOut, setCheckingOut] = useState(false);
  const [validationError, setValidationError] = useState('');
  const [showDrawer, setShowDrawer] = useState(false);
  const [drawerData, setDrawerData] = useState<any>(null);

  const totalGuests = Object.values(counts).reduce((a, b) => a + b, 0);
  const totalPrice = currentGuestTypes.reduce((s, gt) => s + (counts[gt.name] || 0) * gt.price, 0);
  const activeSlot = timeSlots.find(s => s.time === selectedTime);
  const maxSelectable = Math.min(activeSlot?.available_slots ?? Infinity, tour.maxParticipants ?? 50);

  const tourImage = getTourImage(tour._id, tour.mainImage?.asset?.url);

  useEffect(() => {
    if (!selectedDate) { setTimeSlots([]); return; }
    setLoadingSlots(true); setTimeSlots([]); setSelectedTime('');
    fetch(`/api/availability?slug=${tour.slug.current}&date=${selectedDate}`)
      .then(r => r.json())
      .then(d => setTimeSlots(d.slots || []))
      .catch(() => {})
      .finally(() => setLoadingSlots(false));
  }, [selectedDate, tour.slug.current]);

  const visibleSlots = useMemo(() => {
    if (!selectedDate) return [];
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    if (selectedDate !== todayStr) return timeSlots;
    const now = new Date();
    return timeSlots.filter(slot => {
      const [h, m] = (slot.time || '').split(':').map(Number);
      if (isNaN(h)) return true;
      const slotDate = new Date(); slotDate.setHours(h, m || 0, 0, 0);
      return slotDate >= now;
    });
  }, [timeSlots, selectedDate]);

  const dateLabel = selectedDate ? format(new Date(selectedDate + 'T12:00:00'), 'EEEE, d MMMM yyyy') : '';

  const handleAddToCart = () => {
    if (!selectedDate) { setValidationError('Please select a date'); return; }
    if (!selectedTime) { setValidationError('Please select a time slot'); return; }
    const avail = activeSlot?.available_slots || 0;
    if (avail < totalGuests) { setValidationError(`Only ${avail} spots left`); return; }
    setValidationError('');
    addToCart({
      id: `${tour._id}-${selectedDate}-${selectedTime}-${Date.now()}`,
      tourId: tour._id, tourTitle: tour.title, tourSlug: tour.slug.current,
      date: selectedDate, time: selectedTime, guestCounts: counts,
      price: totalPrice,
      image: tourImage,
    });
  };

  const processCheckout = () => {
    if (!selectedDate) { setValidationError('Please select a date'); return; }
    if (!selectedTime) { setValidationError('Please select a time slot'); return; }
    const avail = activeSlot?.available_slots || 0;
    if (avail < totalGuests) { setValidationError(`Only ${avail} spots left`); return; }
    setValidationError('');
    setDrawerData({
      tour: {
        _id: tour._id, title: tour.title, slug: tour.slug,
        price: tour.price, guestTypes: tour.guestTypes,
        mainImage: tour.mainImage, category: tour.category,
        meetingPoint: tour.meetingPoint,
      },
      date: selectedDate, time: selectedTime,
      guestCounts: counts, totalPrice,
    });
    setShowDrawer(true);
  };

  return (
    <>
    <div className="space-y-6">
      {/* ── Main Booking Card ── */}
      <div className="bg-card rounded-2xl shadow-xl border border-border/20 overflow-hidden">

        {/* Header: Tour Summary */}
        <div className="p-6 border-b border-border/10 bg-muted/20">
          <div className="flex gap-4">
            <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
              <Image src={tourImage} alt={tour.title} fill className="object-cover" />
            </div>
            <div className="min-w-0">
              <h3 className="font-serif font-bold text-foreground text-base leading-snug line-clamp-2">{tour.title}</h3>
              <div className="flex items-center gap-3 mt-1.5">
                {tour.rating && <span className="flex items-center gap-1 text-xs font-bold"><Star className="w-3 h-3 fill-accent text-accent" /> {tour.rating}</span>}
                {tour.duration && <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock className="w-3 h-3" /> {tour.duration}</span>}
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[10px] text-muted-foreground font-bold tracking-widest">FROM</p>
              <p className="text-2xl font-serif font-bold text-foreground">€{tour.price}</p>
              <p className="text-[10px] text-muted-foreground">per person</p>
            </div>
          </div>
        </div>

        {/* Body: Calendar + Time + Guests */}
        <div className="p-6 space-y-6">
          {/* Step 1: Date */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">1</span>
              <span className="text-sm font-bold text-foreground">Select Date</span>
              {selectedDate && <span className="text-xs text-primary font-bold ml-auto">{dateLabel}</span>}
            </div>
            <SmartCalendar
              slug={tour.slug.current}
              selectedDate={selectedDate ? new Date(selectedDate) : undefined}
              onSelect={(d) => setSelectedDate(d ? format(d, 'yyyy-MM-dd') : '')}
              basePrice={tour.price}
            />
          </div>

          {/* Step 2: Time */}
          {selectedDate && (
            <div className="animate-in fade-in duration-300">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">2</span>
                <span className="text-sm font-bold text-foreground">Select Time</span>
              </div>
              {loadingSlots ? (
                <div className="flex items-center justify-center py-8 bg-muted/20 rounded-xl">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              ) : visibleSlots.length > 0 ? (
                <div className="space-y-2">
                  {visibleSlots.map(slot => (
                    <button
                      key={slot.time}
                      onClick={() => setSelectedTime(slot.time)}
                      disabled={slot.available_slots === 0}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all text-left
                        ${selectedTime === slot.time
                          ? 'border-primary bg-primary/5 shadow-md'
                          : 'border-border/20 hover:border-primary/30 bg-card'
                        }
                        ${slot.available_slots === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0
                          ${selectedTime === slot.time ? 'border-primary' : 'border-border/30'}`}>
                          {selectedTime === slot.time && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                        </div>
                        <div>
                          <span className="text-base font-bold text-foreground block">{slot.time}</span>
                          <span className="text-xs text-muted-foreground">{tour.duration || '~2.5 hours'}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-serif font-bold text-foreground">€{tour.price}</span>
                        {slot.available_slots < 8 && slot.available_slots > 0 && (
                          <span className="text-[10px] font-bold text-accent block">{slot.available_slots} spots left</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-destructive/5 rounded-xl border-2 border-dashed border-destructive/10">
                  <AlertTriangle className="w-8 h-8 text-destructive/40 mx-auto mb-2" />
                  <p className="text-sm text-destructive font-bold">No available time slots for this date</p>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Guests */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">3</span>
              <span className="text-sm font-bold text-foreground">Select Guests</span>
              <span className="ml-auto text-xs font-bold text-muted-foreground bg-muted px-3 py-1 rounded-full">{totalGuests} total</span>
            </div>
            <div className="space-y-3">
              {currentGuestTypes.map(gt => (
                <div key={gt.name} className="flex items-center justify-between p-3 bg-muted/10 rounded-xl border border-border/10">
                  <div>
                    <span className="text-sm font-bold text-foreground block">{gt.name}</span>
                    {gt.description && <span className="text-[10px] text-muted-foreground">{gt.description}</span>}
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-bold text-primary">€{gt.price}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCounts(p => ({ ...p, [gt.name]: Math.max(gt.name === 'Adult' ? 1 : 0, (p[gt.name] || 0) - 1) }))}
                        disabled={(counts[gt.name] || 0) <= (gt.name === 'Adult' ? 1 : 0)}
                        className="w-8 h-8 rounded-lg border border-border/30 flex items-center justify-center hover:bg-muted disabled:opacity-20 transition-all active:scale-90"
                      >−</button>
                      <span className="w-5 text-center font-bold">{counts[gt.name] || 0}</span>
                      <button
                        onClick={() => {
                          const nextTotal = Object.values(counts).reduce((s, c) => s + c, 0) + 1;
                          if (nextTotal > maxSelectable) return;
                          setCounts(p => ({ ...p, [gt.name]: Math.min(20, (p[gt.name] || 0) + 1) }));
                        }}
                        disabled={Object.values(counts).reduce((s, c) => s + c, 0) >= maxSelectable}
                        className="w-8 h-8 rounded-lg border border-primary/30 flex items-center justify-center hover:bg-primary hover:text-white text-primary disabled:opacity-20 transition-all active:scale-90"
                      >+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer: Price + CTA */}
        <div className="p-6 border-t border-border/10 bg-muted/5">
          {validationError && (
            <div className="mb-4 p-3 bg-destructive/5 border border-destructive/20 rounded-xl text-xs font-bold text-destructive flex items-center gap-2">
              <AlertTriangle size={14} /> {validationError}
            </div>
          )}

          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] text-muted-foreground font-bold tracking-widest">TOTAL PRICE</p>
              <p className="text-3xl font-serif font-bold text-foreground">€{totalPrice}</p>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              <p>{totalGuests} guest{totalGuests !== 1 ? 's' : ''}</p>
              {selectedDate && <p>{dateLabel}</p>}
              {selectedTime && <p>{selectedTime}</p>}
            </div>
          </div>

          <button
            onClick={processCheckout}
            disabled={!selectedDate || !selectedTime || totalGuests === 0}
            className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-primary/20 disabled:opacity-40 disabled:cursor-not-allowed text-sm"
          >
            {checkingOut ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Book Now — €{totalPrice}
            <ChevronRight size={18} />
          </button>

          <button
            onClick={handleAddToCart}
            disabled={!selectedDate || !selectedTime || totalGuests === 0}
            className="w-full mt-3 py-3 rounded-xl font-bold text-xs tracking-widest transition-all text-muted-foreground hover:text-primary disabled:opacity-30 flex items-center justify-center gap-2"
          >
            <ShoppingCart size={14} /> Add to Cart
          </button>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: Zap, label: 'Skip the Line', sub: 'Priority Access' },
          { icon: CheckCircle, label: 'Free Cancellation', sub: 'Up to 24h before' },
          { icon: Star, label: 'Expert Guides', sub: 'Licensed & Certified' },
          { icon: MapPin, label: 'Instant Confirmation', sub: 'Book with Confidence' },
        ].map(b => (
          <div key={b.label} className="bg-card rounded-xl border border-border/10 p-3 text-center">
            <b.icon size={15} className="text-primary mx-auto mb-1" />
            <p className="text-[10px] font-bold text-foreground">{b.label}</p>
            <p className="text-[8px] text-muted-foreground mt-0.5">{b.sub}</p>
          </div>
        ))}
      </div>
    </div>

    {showDrawer && <CheckoutDrawer bookingData={drawerData} onClose={() => setShowDrawer(false)} />}
    </>
  );
}
