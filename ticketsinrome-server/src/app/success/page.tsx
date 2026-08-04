'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useSearchParams } from 'next/navigation';
import { CheckCircle, Home, Calendar, Users, Clock, Mail, Download, MapPin, Ticket, ChevronRight } from 'lucide-react';
import { Suspense, useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

interface Participant {
  index: number;
  label: string;
  name: string;
  dob?: string;
}

interface BookingDetails {
  id: string;
  tour_title: string;
  date: string;
  time: string;
  guests: number;
  adults?: number;
  students?: number;
  youths?: number;
  total_amount?: number;    // webhook writes this (euros)
  total_price?: number;      // legacy column (may be cents or euros)
  customer_name?: string;
  customer_email?: string;
  customer_phone?: string;
  lead_first_name?: string;
  lead_last_name?: string;
  lead_email?: string;
  lead_phone?: string;
  lead_dob?: string;
  status: string;
  stripe_payment_intent_id?: string;
  stripe_session_id?: string;
  meeting_point?: string;
  guest_counts?: Record<string, number>;
  participant_details?: string | Participant[];
  booking_ref?: string;
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const paymentIntentId = searchParams.get('payment_intent');
  const [booking, setBooking] = useState<BookingDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [pdfLoading, setPdfLoading] = useState(false);
  const pollCountRef = { current: 0 };

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
      if (error && error.code === 'PGRST116' && pollCountRef.current < 12) {
        pollCountRef.current++;
        setTimeout(() => fetchBookingDetails(id), 2500);
        return;
      }
      if (!error && data) setBooking(data);
    } catch {}
    finally { setLoading(false); }
  }

  // Normalize price: handle both column names and cent/euro ambiguity
  const displayPrice = (() => {
    if (!booking) return 0;
    const raw = booking.total_amount ?? booking.total_price ?? 0;
    // If value is > 10000, it's likely in cents (old format)
    return raw > 10000 ? raw / 100 : raw;
  })();

  const bookingRef = booking?.booking_ref
    || booking?.id?.slice(-8).toUpperCase()
    || paymentIntentId?.slice(-8).toUpperCase()
    || sessionId?.slice(-8).toUpperCase()
    || 'PENDING';

  const customerName = booking
    ? `${booking.lead_first_name || booking.customer_name?.split(' ')[0] || ''} ${booking.lead_last_name || ''}`.trim()
      || booking.customer_name || 'Guest'
    : 'Guest';

  const customerEmail = booking?.lead_email || booking?.customer_email || '';
  const customerPhone = booking?.lead_phone || booking?.customer_phone || '';

  // Parse participants
  const participants: Participant[] = (() => {
    if (!booking?.participant_details) return [];
    if (typeof booking.participant_details === 'string') {
      try { return JSON.parse(booking.participant_details); } catch { return []; }
    }
    if (Array.isArray(booking.participant_details)) return booking.participant_details;
    return [];
  })();

  const meetingPoint = booking?.meeting_point || 'Via Tunisi 43, 00192 Roma RM, Italy';
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(meetingPoint + ' Rome')}`;

  const stripePaymentIntentId = booking?.stripe_payment_intent_id || paymentIntentId || '';

  const downloadPDF = useCallback(async () => {
    if (!booking) return;
    setPdfLoading(true);
    try {
      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
      const W = 210, margin = 20, contentW = W - margin * 2;

      // ── Header bar ──
      doc.setFillColor(15, 23, 42);
      doc.rect(0, 0, W, 45, 'F');
      doc.setTextColor(212, 175, 55);
      doc.setFontSize(22);
      doc.setFont('helvetica', 'bold');
      const brandName = (process.env.NEXT_PUBLIC_SITE_NAME || 'Wonders of Rome').toUpperCase();
      const brandDomain = process.env.NEXT_PUBLIC_SITE_URL?.replace('https://', '') || 'wondersofrome.com';
      const brandEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL || 'info@wondersofrome.com';
      doc.text(brandName, margin, 20);
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'normal');
      doc.text('Official Booking Confirmation', margin, 28);
      doc.text(`${brandDomain}  |  ${brandEmail}`, margin, 35);

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
      const titleLines = doc.splitTextToSize(booking.tour_title, contentW);
      doc.text(titleLines, margin, 75);
      let y = 75 + titleLines.length * 8 + 8;

      // Divider
      doc.setDrawColor(232, 230, 225);
      doc.line(margin, y, W - margin, y);
      y += 8;

      // ── Details grid ──
      const dateStr = new Date(booking.date + 'T12:00:00').toLocaleDateString('en-US', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
      const guestBreakdown = booking.guest_counts
        ? Object.entries(booking.guest_counts)
            .filter(([, c]) => (c as number) > 0)
            .map(([type, count]) => `${count}x ${type}`)
            .join(', ')
        : `${booking.guests} guest${booking.guests !== 1 ? 's' : ''}`;

      const details: [string, string][] = [
        ['Tour', booking.tour_title],
        ['Date', dateStr],
        ['Time', booking.time],
        ['Guests', guestBreakdown],
        ['Total Paid', `€${displayPrice.toFixed(2)}`],
        ['Name', customerName],
        ['Email', customerEmail],
      ];
      if (customerPhone) details.push(['Phone', customerPhone]);

      doc.setFontSize(10);
      details.forEach(([label, value]) => {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 116, 139);
        doc.text(label, margin, y);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        // Truncate long values
        const val = String(value).length > 55 ? String(value).slice(0, 52) + '...' : String(value);
        doc.text(val, margin + 45, y);
        y += 8;
      });

      y += 4;
      doc.setDrawColor(232, 230, 225);
      doc.line(margin, y, W - margin, y);
      y += 8;

      // ── Participants section ──
      if (participants.length > 0) {
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text('Registered Participants', margin, y);
        y += 8;

        // Table header
        doc.setFillColor(245, 245, 245);
        doc.rect(margin, y, contentW, 7, 'F');
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(100, 116, 139);
        doc.text('Guest Type', margin + 2, y + 5);
        doc.text('Full Name', margin + 55, y + 5);
        doc.text('Date of Birth', margin + 130, y + 5);
        y += 8;

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(15, 23, 42);
        participants.forEach((p) => {
          doc.setFontSize(8);
          doc.text(p.label, margin + 2, y + 5);
          doc.text(p.name || '—', margin + 55, y + 5);
          doc.text(p.dob || '—', margin + 130, y + 5);
          y += 6;
        });

        y += 6;
        doc.setDrawColor(232, 230, 225);
        doc.line(margin, y, W - margin, y);
        y += 8;
      }

      // ── Meeting point ──
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Meeting Point', margin, y);
      y += 7;
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(55, 65, 81);
      const mpLines = doc.splitTextToSize(meetingPoint, contentW);
      doc.text(mpLines, margin, y);
      y += mpLines.length * 5 + 4;

      // Meeting point instructions
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(`Look for staff with a white flag saying "${brandName}"`, margin, y);
      y += 4;
      doc.text('Arrive at least 15 minutes early', margin, y);
      y += 8;

      // ── Reminders box ──
      doc.setFillColor(254, 252, 232);
      doc.roundedRect(margin, y, contentW, 38, 3, 3, 'F');
      doc.setDrawColor(212, 175, 55);
      doc.roundedRect(margin, y, contentW, 38, 3, 3, 'S');
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

      // ── Footer ──
      doc.setFillColor(248, 250, 252);
      doc.rect(0, 270, W, 27, 'F');
      doc.setTextColor(148, 163, 184);
      doc.setFontSize(7);
      doc.setFont('helvetica', 'normal');
      const supportPhone = process.env.NEXT_PUBLIC_SUPPORT_PHONE || '+39 351 419 9425';
      doc.text(`${process.env.NEXT_PUBLIC_SITE_NAME || 'Wonders of Rome'}  |  ${brandDomain}  |  ${brandEmail}  |  ${supportPhone}`, W / 2, 278, { align: 'center' });
      doc.text('This document serves as your official booking confirmation. Please keep it for your records.', W / 2, 284, { align: 'center' });
      doc.text(`Generated: ${new Date().toLocaleString()}`, W / 2, 290, { align: 'center' });

      doc.save(`WondersOfRome-Booking-${bookingRef}.pdf`);
    } catch (e) {
      console.error('PDF generation failed:', e);
    } finally {
      setPdfLoading(false);
    }
  }, [booking, bookingRef, displayPrice, customerName, customerEmail, customerPhone, meetingPoint, participants]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-border border-t-transparent mx-auto" />
          <p className="text-muted-foreground font-medium">Confirming your booking...</p>
          <p className="text-muted-foreground text-sm">This may take a few seconds</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Success Header */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-[0_8px_32px_rgba(15,23,42,0.08)]">
          <div className="bg-primary p-8 text-center">
            <div className="w-20 h-20 bg-accent/15 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-accent" />
            </div>
            <h1 className="font-bold text-2xl text-white mb-1">Booking Confirmed!</h1>
            <p className="text-white/50 text-sm">A confirmation email has been sent to {customerEmail || 'you'}</p>
          </div>

          <div className="p-8 space-y-5">
            {/* Booking ref */}
            <div className="text-center p-4 bg-background rounded-xl border border-border">
              <span className="text-xs text-muted-foreground tracking-widest font-mono">Booking Reference</span>
              <p className="font-mono font-bold text-3xl text-primary mt-1">#{bookingRef}</p>
            </div>

            {booking ? (
              <>
                {/* Tour details */}
                <div className="bg-background rounded-xl p-5 border border-border space-y-3">
                  <h3 className="font-semibold text-primary flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4 text-accent" /> Tour Details
                  </h3>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tour</span>
                      <span className="font-medium text-primary text-right max-w-[60%]">{booking.tour_title}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Date</span>
                      <span className="font-medium text-primary">
                        {new Date(booking.date + 'T12:00:00').toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Time</span>
                      <span className="font-medium text-primary">{booking.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Guests</span>
                      <span className="font-medium text-primary">{booking.guests}</span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2 mt-2">
                      <span className="font-semibold text-primary">Total Paid</span>
                      <span className="font-bold text-accent text-lg">&euro;{displayPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Meeting Point */}
                {meetingPoint && (
                  <div className="bg-background rounded-xl p-5 border border-border space-y-3">
                    <h3 className="font-semibold text-primary flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-accent" /> Meeting Point
                    </h3>
                    <p className="text-sm font-medium text-primary">{meetingPoint}</p>
                    <p className="text-xs text-muted-foreground">Look for staff with a white flag saying &quot;{process.env.NEXT_PUBLIC_SITE_NAME?.toUpperCase() || 'WONDERS OF ROME'}&quot;. Arrive 15 minutes early.</p>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:underline"
                    >
                      Open in Google Maps <ChevronRight className="w-4 h-4" />
                    </a>
                  </div>
                )}

                {/* Participants */}
                {participants.length > 0 && (
                  <div className="bg-background rounded-xl p-5 border border-border space-y-3">
                    <h3 className="font-semibold text-primary flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-accent" /> Registered Participants
                    </h3>
                    <div className="overflow-hidden rounded-lg border border-border">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="bg-muted">
                            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Guest</th>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">Name</th>
                            <th className="px-3 py-2 text-left text-xs font-semibold text-muted-foreground">DOB</th>
                          </tr>
                        </thead>
                        <tbody>
                          {participants.map((p, i) => (
                            <tr key={i} className="border-t border-border">
                              <td className="px-3 py-2 text-muted-foreground">{p.label}</td>
                              <td className="px-3 py-2 font-medium text-primary">{p.name || '—'}</td>
                              <td className="px-3 py-2 text-muted-foreground">{p.dob || '—'}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Contact */}
                <div className="bg-background rounded-xl p-5 border border-border space-y-2">
                  <h3 className="font-semibold text-primary flex items-center gap-2 text-sm">
                    <Mail className="w-4 h-4 text-accent" /> Contact
                  </h3>
                  <div className="text-sm space-y-1">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Name</span>
                      <span className="font-medium text-primary">{customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Email</span>
                      <span className="font-medium text-primary">{customerEmail}</span>
                    </div>
                    {customerPhone && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Phone</span>
                        <span className="font-medium text-primary">{customerPhone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Reminders */}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <h4 className="font-semibold text-amber-900 flex items-center gap-2 text-sm mb-2">
                    <Clock className="w-4 h-4" /> Important Reminders
                  </h4>
                  <ul className="text-xs text-amber-800 space-y-1">
                    <li>&bull; Arrive 20 minutes before your scheduled time</li>
                    <li>&bull; Bring a valid ID or passport</li>
                    <li>&bull; Dress code: Shoulders and knees covered (Vatican)</li>
                    <li>&bull; Confirmation email sent to {customerEmail}</li>
                  </ul>
                </div>
              </>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">Your booking is confirmed. Check your email for details.</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col gap-3 pt-2">
              {stripePaymentIntentId && (
                <Link
                  href={`/ticket/${stripePaymentIntentId}`}
                  className="flex items-center justify-center gap-2 px-6 py-3.5 bg-accent text-primary font-bold text-sm rounded-xl hover:brightness-110 transition-all"
                >
                  <Ticket size={16} /> View Mobile Ticket
                </Link>
              )}
              {booking && (
                <button
                  onClick={downloadPDF}
                  disabled={pdfLoading}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-primary text-primary font-semibold text-sm rounded-xl hover:bg-primary hover:text-white transition-all disabled:opacity-60"
                >
                  {pdfLoading ? (
                    <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Download size={16} />
                  )}
                  Download PDF Ticket
                </button>
              )}
              <Link
                href="/"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-semibold text-sm rounded-xl hover:brightness-110 transition-colors"
              >
                <Home size={16} /> Back to Home
              </Link>
            </div>
          </div>
        </div>

        {/* Trust row */}
        <div className="flex justify-center gap-8 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5"><CheckCircle className="w-3.5 h-3.5 text-accent" /> Instant Confirmation</span>
          <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-accent" /> Email Sent</span>
          <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-accent" /> Mobile Ticket</span>
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
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-2 border-border border-t-transparent" />
        </div>
      }>
        <SuccessContent />
      </Suspense>
      <Footer />
    </>
  );
}
