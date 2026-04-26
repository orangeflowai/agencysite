'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Home, Calendar, Users, Clock, Mail, Download, MapPin, Printer } from 'lucide-react';
import { Suspense, useEffect, useState, useRef, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface BookingDetails {
  id: string;
  tour_title: string;
  date: string;
  time: string;
  guests: number;
  adults: number;
  students: number;
  youths: number;
  total_price: number;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  status: string;
  stripe_payment_intent_id?: string;
  guest_details?: any;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const paymentIntentId = searchParams.get('payment_intent');
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const pollCount = useRef(0);

  useEffect(() => {
    const id = sessionId || paymentIntentId;
    if (id) fetchBookingDetails(id);
    else setLoading(false);
  }, [sessionId, paymentIntentId]);

  async function fetchBookingDetails(id: string) {
    try {
      let query = supabase.from('bookings').select('*');
      if (sessionId) query = query.eq('stripe_session_id', id);
      else query = query.eq('stripe_payment_intent_id', id);
      const { data, error } = await query.single();
      if (error && error.code === 'PGRST116' && pollCount.current < 12) {
        pollCount.current++;
        setTimeout(() => fetchBookingDetails(id), 2500);
        return;
      }
      if (!error) setBooking(data);
    } catch {}
    finally { setLoading(false); }
  }

  const bookingRef = booking?.id?.slice(-8).toUpperCase()
    || paymentIntentId?.slice(-8).toUpperCase()
    || sessionId?.slice(-8).toUpperCase()
    || 'PENDING';

  const downloadPDF = useCallback(async () => {
    if (!booking) return;
    setPdfLoading(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const W = 210, margin = 20;

      // Header bar
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, W, 45, 'F');

      // Brand
      doc.setTextColor(212, 175, 55);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      doc.text('WONDERS OF ROME', margin, 20);
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'normal');
      doc.text('Official Booking Confirmation', margin, 28);
      doc.text('wondersofrome.com  |  info@wondersofrome.com', margin, 35);

      // Booking ref badge
      doc.setFillColor(212, 175, 55);
      doc.roundedRect(W - 70, 10, 50, 25, 3, 3, 'F');
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('BOOKING REF', W - 65, 20);
      doc.setFontSize(14);
      doc.text(`#${bookingRef}`, W - 65, 30);

      // Status badge
      doc.setFillColor(16, 185, 129);
      doc.roundedRect(margin, 52, 40, 10, 2, 2, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(8);
      doc.setFont('helvetica', 'bold');
      doc.text('✓ CONFIRMED', margin + 5, 59);

      // Tour title
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      const titleLines = doc.splitTextToSize(booking.tour_title, W - margin * 2);
      doc.text(titleLines, margin, 75);

      let y = 75 + titleLines.length * 8 + 8;

      // Divider
      doc.setDrawColor(232, 230, 225);
      doc.line(margin, y, W - margin, y);
      y += 8;

      // Details grid
      const details = [
        ['📅 Date', new Date(booking.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })],
        ['🕐 Time', booking.time],
        ['👥 Guests', `${booking.guests} person${booking.guests !== 1 ? 's' : ''}`],
        ['💶 Total Paid', `€${booking.total_price.toFixed(2)}`],
        ['👤 Name', booking.customer_name],
        ['📧 Email', booking.customer_email],
        ...(booking.customer_phone ? [['📱 Phone', booking.customer_phone]] : []),
      ];

      doc.setFontSize(10);
      details.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 116, 139);
        doc.text(label, margin, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        doc.text(String(value), margin + 55, y);
        y += 8;
      });

      y += 4;
      doc.setDrawColor(232, 230, 225);
      doc.line(margin, y, W - margin, y);
      y += 10;

      // Important info box
      doc.setFillColor(254, 252, 232);
      doc.roundedRect(margin, y, W - margin * 2, 38, 3, 3, 'F');
      doc.setDrawColor(212, 175, 55);
      doc.roundedRect(margin, y, W - margin * 2, 38, 3, 3, 'S');
      doc.setTextColor(120, 80, 0);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text('⚠ IMPORTANT REMINDERS', margin + 4, y + 8);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      const reminders = [
        '• Please arrive 20 minutes before your scheduled time',
        '• Bring a valid ID or passport for entry',
        '• Dress code: Shoulders and knees must be covered (Vatican)',
        '• This PDF is your ticket — show it at the meeting point',
      ];
      reminders.forEach((r, i) => { doc.text(r, margin + 4, y + 16 + i * 6); });

      y += 48;

      // Footer
      doc.setFillColor(248, 250, 252);
      doc.rect(0, 270, W, 27, 'F');
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      doc.text('Wonders of Rome  |  wondersofrome.com  |  info@wondersofrome.com  |  +39 351 419 9425', W / 2, 278, { align: 'center' });
      doc.text('This document serves as your official booking confirmation. Please keep it for your records.', W / 2, 284, { align: 'center' });
      doc.text(`Generated: ${new Date().toLocaleString()}`, W / 2, 290, { align: 'center' });

      doc.save(`WondersOfRome-Booking-${bookingRef}.pdf`);
    } catch (e) {
      console.error('PDF generation failed:', e);
    } finally {
      setPdfLoading(false);
    }
  }, [booking, bookingRef]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-[#d4af37] border-t-transparent mx-auto" />
          <p className="text-[#64748b] font-medium">Confirming your booking...</p>
          <p className="text-[#94a3b8] text-sm">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafaf8] py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Success Header */}
        <div className="bg-white rounded-2xl border border-[#e8e6e1] overflow-hidden shadow-[0_8px_32px_rgba(15,23,42,0.08)]">
          <div className="bg-[#0f172a] p-8 text-center">
            <div className="w-20 h-20 bg-[#d4af37]/15 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-[#d4af37]" />
            </div>
            <h1 className="font-bold text-2xl text-white mb-1">Booking Confirmed!</h1>
            <p className="text-white/50 text-sm">A confirmation email has been sent to you</p>
          </div>

          <div className="p-8 space-y-5">
            {/* Booking ref */}
            <div className="text-center p-4 bg-[#fafaf8] rounded-xl border border-[#e8e6e1]">
              <span className="text-xs text-[#94a3b8] uppercase tracking-widest font-mono">Booking Reference</span>
              <p className="font-mono font-bold text-3xl text-[#0f172a] mt-1">#{bookingRef}</p>
            </div>

            {booking ? (
              <>
                {/* Tour details */}
                <div className="bg-[#fafaf8] rounded-xl p-5 border border-[#e8e6e1] space-y-3">
                  <h3 className="font-semibold text-[#0f172a] flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-[#d4af37]" /> Tour Details
                  </h3>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-[#64748b]">Tour</span>
                      <span className="font-medium text-[#0f172a] text-right max-w-[60%]">{booking.tour_title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748b]">Date</span>
                      <span className="font-medium text-[#0f172a]">
                        {new Date(booking.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748b]">Time</span>
                      <span className="font-medium text-[#0f172a]">{booking.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748b]">Guests</span>
                      <span className="font-medium text-[#0f172a]">{booking.guests}</span>
                    </div>
                    <div className="flex justify-between border-t border-[#e8e6e1] pt-2 mt-2">
                      <span className="font-semibold text-[#0f172a]">Total Paid</span>
                      <span className="font-bold text-[#d4af37] text-lg">€{booking.total_price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="bg-[#fafaf8] rounded-xl p-5 border border-[#e8e6e1] space-y-2">
                  <h3 className="font-semibold text-[#0f172a] flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-[#d4af37]" /> Contact
                  </h3>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-[#64748b]">Name</span>
                      <span className="font-medium text-[#0f172a]">{booking.customer_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#64748b]">Email</span>
                      <span className="font-medium text-[#0f172a]">{booking.customer_email}</span>
                    </div>
                  </div>
                </div>

                {/* Reminders */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <h4 className="font-semibold text-amber-900 flex items-center gap-2 text-sm mb-2">
                    <Clock className="w-4 h-4" /> Important Reminders
                  </h4>
                  <ul className="text-xs text-amber-800 space-y-1">
                    <li>• Arrive 20 minutes before your scheduled time</li>
                    <li>• Bring a valid ID or passport</li>
                    <li>• Dress code: Shoulders and knees covered (Vatican)</li>
                    <li>• Confirmation email sent to {booking.customer_email}</li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <p className="text-[#64748b]">Your booking is confirmed. Check your email for details.</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                href="/"
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#0f172a] text-white font-semibold text-sm rounded-xl hover:bg-[#1e293b] transition-colors"
              >
                <Home size={16} /> Back to Home
              </Link>
              {booking && (
                <button
                  onClick={downloadPDF}
                  disabled={pdfLoading}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-[#d4af37] text-[#0f172a] font-bold text-sm rounded-xl hover:bg-[#c9a227] transition-colors disabled:opacity-60"
                >
                  {pdfLoading ? (
                    <div className="w-4 h-4 border-2 border-[#0f172a] border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Download size={16} />
                  )}
                  Download PDF Ticket
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Trust row */}
        <div className="flex justify-center gap-8 text-xs text-[#94a3b8] font-mono">
          <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-[#d4af37]" /> Instant Confirmation</span>
          <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-[#d4af37]" /> Email Sent</span>
          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-[#d4af37]" /> Mobile Ticket</span>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="min-h-screen bg-[#fafaf8] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-[#d4af37] border-t-transparent" />
        </div>
      }>
        <SuccessContent />
      </Suspense>
      <Footer />
    </>
  );
}
