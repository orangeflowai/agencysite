'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Calendar as CalendarIcon, Clock, ShieldCheck, ChevronRight, Info, Star } from 'lucide-react';
import { format } from 'date-fns';
import SmartCalendar from './ui/SmartCalendar';
import TrustBadges from './TrustBadges';
import { cn } from '@/lib/utils';

interface TrustCalendarProps {
  tours: any[];
}

export default function TrustCalendar({ tours }: TrustCalendarProps) {
  const [selectedTourId, setSelectedTourId] = useState<string>(tours[0]?._id || '');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [timeSlots, setTimeSlots] = useState<{ time: string; available_slots: number }[]>([]);
  const [loadingTime, setLoadingTime] = useState(false);

  const selectedTour = useMemo(() => 
    tours.find(t => t._id === selectedTourId) || tours[0]
  , [selectedTourId, tours]);

  // Fetch times when date changes
  useEffect(() => {
    if (!selectedDate || !selectedTour) {
      setTimeSlots([]);
      setSelectedTime('');
      return;
    }

    async function fetchTimes() {
      setLoadingTime(true);
      try {
        const dateStr = format(selectedDate!, 'yyyy-MM-dd');
        const res = await fetch(`/api/availability?slug=${selectedTour.slug.current}&date=${dateStr}`);
        const data = await res.json();
        setTimeSlots(data.slots || []);
      } catch (e) {
        console.error("Failed to fetch slots", e);
      } finally {
        setLoadingTime(false);
      }
    }

    fetchTimes();
  }, [selectedDate, selectedTour]);

  return (
    <section className="relative bg-white pb-24 -mt-20 z-30 rounded-t-[3rem] shadow-2xl">
      <div className="container mx-auto px-6">
        
        {/* 1. Trust Badges Header */}
        <div className="pt-12 mb-16">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black text-neutral-900 mb-4 font-serif">
              Why 50,000+ Travelers Trust Us
            </h2>
            <div className="h-1.5 w-24 bg-sky-500 mx-auto rounded-full" />
          </div>
          <TrustBadges />
        </div>

        {/* 2. Main Booking Experience */}
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Sidebar: Details & Selection */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-neutral-50 rounded-3xl p-8 border border-neutral-100 shadow-sm relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                  <MapPin size={80} />
                </div>
                
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-neutral-400 mb-6 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-500" />
                  Your Journey Starts Here
                </h3>

                <div className="space-y-8">
                  {/* Location Selector */}
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                      <MapPin size={14} className="text-sky-500" />
                      Pick Your Location
                    </label>
                    <select 
                      value={selectedTourId}
                      onChange={(e) => {
                        setSelectedTourId(e.target.value);
                        setSelectedDate(undefined);
                        setSelectedTime('');
                      }}
                      className="w-full bg-white border border-neutral-200 rounded-2xl px-5 py-4 text-sm font-bold text-neutral-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 transition-all appearance-none cursor-pointer"
                    >
                      {tours.map(tour => (
                        <option key={tour._id} value={tour._id}>
                          {tour.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date Display */}
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                      <CalendarIcon size={14} className="text-sky-500" />
                      Selected Date
                    </label>
                    <div className={cn(
                      "w-full rounded-2xl px-5 py-4 text-sm font-bold border transition-all h-[54px] flex items-center",
                      selectedDate ? "bg-sky-50 border-sky-200 text-sky-700" : "bg-white border-neutral-200 text-neutral-400"
                    )}>
                      {selectedDate ? format(selectedDate, 'EEEE, d MMMM yyyy') : 'Pick a date on the calendar'}
                    </div>
                  </div>

                  {/* Time Selection */}
                  <div className="space-y-3">
                    <label className="text-xs font-black uppercase tracking-widest text-neutral-500 flex items-center gap-2">
                      <Clock size={14} className="text-sky-500" />
                      Pick A Time
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {loadingTime ? (
                        <div className="col-span-2 py-4 text-center text-xs font-bold text-neutral-400 animate-pulse">
                          Checking availability...
                        </div>
                      ) : timeSlots.length > 0 ? (
                        timeSlots.map(slot => (
                          <button
                            key={slot.time}
                            onClick={() => setSelectedTime(slot.time)}
                            className={cn(
                              "py-3 px-2 rounded-xl text-xs font-black border transition-all",
                              selectedTime === slot.time 
                                ? "bg-sky-600 border-sky-600 text-white shadow-lg shadow-sky-100" 
                                : "bg-white border-neutral-200 text-neutral-900 hover:border-sky-300"
                            )}
                          >
                            {slot.time}
                          </button>
                        ))
                      ) : (
                        <div className="col-span-2 py-4 text-center text-xs font-bold text-neutral-400 border border-dashed border-neutral-200 rounded-2xl">
                          {selectedDate ? 'No times available' : 'Select a date first'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Final CTA Button */}
                <button 
                  disabled={!selectedDate || !selectedTime}
                  onClick={() => {
                    const bookingData = {
                      tour: selectedTour,
                      date: format(selectedDate!, 'yyyy-MM-dd'),
                      time: selectedTime,
                      guestCounts: { Adult: 1 } // Default
                    };
                    window.location.href = `/checkout?data=${encodeURIComponent(JSON.stringify(bookingData))}`;
                  }}
                  className={cn(
                    "w-full mt-10 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3",
                    (!selectedDate || !selectedTime)
                      ? "bg-neutral-100 text-neutral-400 cursor-not-allowed"
                      : "bg-neutral-950 text-white hover:bg-sky-600 shadow-xl"
                  )}
                >
                  Configure My Tour
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Trust Subtext */}
              <div className="flex items-center gap-4 px-6 opacity-60">
                <ShieldCheck size={24} className="text-emerald-500" />
                <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">
                  Secure 256-bit encrypted checkout. <br /> Tickets sent instantly.
                </p>
              </div>
            </div>

            {/* Main Calendar Area */}
            <div className="lg:col-span-8 bg-neutral-50/50 rounded-3xl p-4 md:p-8 border border-neutral-100 relative group overflow-hidden">
               {/* Background Decorative Element */}
               <div className="absolute -top-24 -right-24 w-64 h-64 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
               
               <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-neutral-900 font-serif">Availability Explorer</h3>
                    <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mt-1">
                      Showing live ticket availability for {selectedTour?.title}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-full border border-neutral-200 shadow-sm">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span className="text-[10px] font-black text-neutral-900 uppercase">Top Seller this month</span>
                  </div>
               </div>

               <div className="bg-white rounded-3xl shadow-xl shadow-neutral-200/50 overflow-hidden transform transition-all group-hover:scale-[1.01]">
                 <SmartCalendar 
                   slug={selectedTour?.slug.current}
                   selectedDate={selectedDate}
                   onSelect={setSelectedDate}
                   basePrice={selectedTour?.price}
                 />
               </div>

               <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-500">
                      <Info size={20} />
                    </div>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-tight leading-relaxed">
                      Pricing shown includes all booking fees and skip-the-line entrance.
                    </p>
                  </div>
                  <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500">
                      <ShieldCheck size={20} />
                    </div>
                    <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-tight leading-relaxed">
                      Instant confirmation. No need to print — mobile tickets accepted.
                    </p>
                  </div>
               </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
