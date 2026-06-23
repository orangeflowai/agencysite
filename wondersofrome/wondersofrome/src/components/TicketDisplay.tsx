'use client';

import Image from 'next/image';
import { Calendar, Clock, Users, MapPin, Download, CheckCircle, Phone, Mail } from 'lucide-react';
import { format } from 'date-fns';

interface TicketDisplayProps {
  ticket: {
    id: string;
    bookingRef: string;
    tourTitle: string;
    customerName: string;
    customerEmail: string;
    date: string;
    time: string;
    guestCount: number;
    guestCounts: Record<string, number>;
    totalPrice: number;
    qrCode?: string;
    meetingPoint?: string;
    status: string;
  };
}

export default function TicketDisplay({ ticket }: TicketDisplayProps) {
  const handleDownload = () => {
    // Trigger print dialog for PDF download
    window.print();
  };

  const handleAddToCalendar = () => {
    // Create ICS file for calendar
    const eventDate = new Date(`${ticket.date}T${ticket.time}`);
    const endDate = new Date(eventDate.getTime() + 3 * 60 * 60 * 1000); // +3 hours
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'BEGIN:VEVENT',
      `DTSTART:${format(eventDate, "yyyyMMdd'T'HHmmss")}`,
      `DTEND:${format(endDate, "yyyyMMdd'T'HHmmss")}`,
      `SUMMARY:${ticket.tourTitle}`,
      `DESCRIPTION:Booking Ref: ${ticket.bookingRef}\\nGuests: ${ticket.guestCount}`,
      `LOCATION:${ticket.meetingPoint || 'Rome, Italy'}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\n');
    
    const blob = new Blob([icsContent], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ticket-${ticket.bookingRef}.ics`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Format guest breakdown
  const guestBreakdown = Object.entries(ticket.guestCounts || {})
    .filter(([_, count]) => count > 0)
    .map(([type, count]) => `${count} ${type}${count > 1 ? 's' : ''}`)
    .join(', ') || `${ticket.guestCount} Guest${ticket.guestCount > 1 ? 's' : ''}`;

  return (
    <div className="max-w-2xl mx-auto p-4 py-8">
      {/* Status Badge */}
      {ticket.status === 'confirmed' && (
        <div className="mb-6 flex items-center justify-center gap-2 text-green-600">
          <CheckCircle className="w-6 h-6" />
          <span className="text-lg font-bold">Booking Confirmed</span>
        </div>
      )}

      {/* Ticket Card */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-2 border-primary/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest opacity-90 font-bold">E-Ticket</p>
              <h1 className="text-3xl font-bold mt-1">Wonders of Rome</h1>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-90">Booking ID</p>
              <p className="font-mono font-bold text-xl">{ticket.bookingRef}</p>
            </div>
          </div>
        </div>

        {/* Tour Info */}
        <div className="p-8 border-b border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6">{ticket.tourTitle}</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Date</p>
                <p className="font-bold text-lg">{format(new Date(ticket.date), 'MMMM dd, yyyy')}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Clock className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Time</p>
                <p className="font-bold text-lg">{ticket.time}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Users className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Guests</p>
                <p className="font-bold text-lg">{guestBreakdown}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="w-6 h-6 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Meeting Point</p>
                <p className="font-semibold text-sm leading-tight">{ticket.meetingPoint || 'See confirmation email'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code */}
        {ticket.qrCode && (
          <div className="p-8 bg-muted/30 text-center border-b border-border">
            <p className="text-sm text-muted-foreground mb-4 font-bold uppercase tracking-wider">Scan this code at the meeting point</p>
            <div className="inline-block p-6 bg-white rounded-2xl shadow-lg">
              <Image 
                src={ticket.qrCode} 
                alt="Ticket QR Code" 
                width={240} 
                height={240}
                className="mx-auto"
              />
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              Ticket for: <strong>{ticket.customerName}</strong>
            </p>
          </div>
        )}

        {/* Customer Info */}
        <div className="p-8 bg-muted/10 border-b border-border">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">Lead Guest</h3>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold text-lg">{ticket.customerName.charAt(0)}</span>
              </div>
              <div>
                <p className="font-bold">{ticket.customerName}</p>
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {ticket.customerEmail}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="p-8 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 bg-primary text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:opacity-90  shadow-lg"
          >
            <Download className="w-5 h-5" />
            Download Ticket
          </button>
          <button
            onClick={handleAddToCalendar}
            className="flex-1 bg-secondary text-foreground py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-muted  border-2 border-border"
          >
            <Calendar className="w-5 h-5" />
            Add to Calendar
          </button>
        </div>
      </div>

      {/* Important Info */}
      <div className="mt-8 p-6 bg-yellow-50 border-2 border-yellow-200 rounded-2xl">
        <h3 className="font-bold text-yellow-900 mb-3 flex items-center gap-2">
          <span className="text-xl">⚠️</span>
          Important Information
        </h3>
        <ul className="space-y-2 text-sm text-yellow-800">
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 mt-0.5">•</span>
            <span>Please arrive <strong>15 minutes before</strong> your scheduled time</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 mt-0.5">•</span>
            <span>Bring a <strong>valid ID or passport</strong> for all guests</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 mt-0.5">•</span>
            <span>Dress code: <strong>Shoulders and knees must be covered</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 mt-0.5">•</span>
            <span>Wear <strong>comfortable walking shoes</strong></span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-yellow-600 mt-0.5">•</span>
            <span>Free cancellation up to <strong>24 hours</strong> before the tour</span>
          </li>
        </ul>
      </div>

      {/* Contact Support */}
      <div className="mt-6 p-6 bg-card border border-border rounded-2xl text-center">
        <p className="text-sm text-muted-foreground mb-3 font-bold uppercase tracking-wider">Need Help?</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a 
            href={`tel:${process.env.NEXT_PUBLIC_SUPPORT_PHONE || '+393514199425'}`}
            className="flex items-center gap-2 text-primary hover:underline font-bold"
          >
            <Phone className="w-4 h-4" />
            {process.env.NEXT_PUBLIC_SUPPORT_PHONE || '+39 351 419 9425'}
          </a>
          <span className="hidden sm:inline text-muted-foreground">|</span>
          <a 
            href={`https://wa.me/${(process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '+393514199425').replace(/\D/g, '')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-green-600 hover:underline font-bold"
          >
            <span className="text-xl">💬</span>
            WhatsApp Support
          </a>
        </div>
      </div>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .max-w-2xl, .max-w-2xl * {
            visibility: visible;
          }
          .max-w-2xl {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          button {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
}
