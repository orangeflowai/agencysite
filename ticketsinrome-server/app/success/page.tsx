'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Check, Download, Mail, Calendar, Clock, Users, MapPin, Loader2, AlertTriangle } from 'lucide-react'
import { format } from 'date-fns'
import jsPDF from 'jspdf'
import Link from 'next/link'
import { Header } from '@/components/header'
import { FooterSection } from '@/components/sections/footer-section'

interface Booking {
  id: string
  tourTitle: string
  tourSlug: string
  date: string
  time: string
  guests: number
  totalAmount: number
  customerName: string
  customerEmail: string
  customerPhone: string
  meetingPoint?: string
  status: string
  createdAt: string
}

function SuccessPageContent() {
  const searchParams = useSearchParams()
  const paymentIntent = searchParams.get('payment_intent')
  
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pollCount, setPollCount] = useState(0)

  useEffect(() => {
    if (!paymentIntent) {
      setError('No payment intent found')
      setLoading(false)
      return
    }

    // Poll for booking (webhook might be delayed)
    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/bookings/${paymentIntent}`)
        if (res.ok) {
          const data = await res.json()
          setBooking(data)
          setLoading(false)
        } else if (pollCount < 12) {
          // Poll up to 12 times (30 seconds)
          setTimeout(() => {
            setPollCount(prev => prev + 1)
          }, 2500)
        } else {
          setError('Booking not found. Please check your email for confirmation.')
          setLoading(false)
        }
      } catch (err) {
        if (pollCount < 12) {
          setTimeout(() => {
            setPollCount(prev => prev + 1)
          }, 2500)
        } else {
          setError('Failed to load booking details')
          setLoading(false)
        }
      }
    }

    fetchBooking()
  }, [paymentIntent, pollCount])

  const downloadPDF = () => {
    if (!booking) return

    const doc = new jsPDF()
    
    // Header
    doc.setFontSize(24)
    doc.setTextColor(6, 64, 52) // Primary color
    doc.text('Tickets in Rome', 20, 20)
    
    // Booking Reference
    doc.setFontSize(12)
    doc.setTextColor(0, 0, 0)
    doc.text('BOOKING CONFIRMATION', 20, 35)
    
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Reference: ${booking.id.slice(-8).toUpperCase()}`, 20, 42)
    
    // Status Badge
    doc.setFillColor(34, 197, 94) // Green
    doc.roundedRect(150, 30, 40, 8, 2, 2, 'F')
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(9)
    doc.text('CONFIRMED', 157, 35)
    
    // Tour Details
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(14)
    doc.text('Tour Details', 20, 60)
    
    doc.setFontSize(10)
    doc.setTextColor(50, 50, 50)
    doc.text(booking.tourTitle, 20, 70)
    
    // Booking Info
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    doc.text('Date & Time:', 20, 85)
    doc.setFontSize(10)
    doc.setTextColor(50, 50, 50)
    doc.text(`${format(new Date(booking.date + 'T12:00:00'), 'EEEE, MMMM d, yyyy')} at ${booking.time}`, 20, 92)
    
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    doc.text('Guests:', 20, 105)
    doc.setFontSize(10)
    doc.setTextColor(50, 50, 50)
    doc.text(`${booking.guests} ${booking.guests === 1 ? 'person' : 'people'}`, 20, 112)
    
    doc.setFontSize(11)
    doc.setTextColor(0, 0, 0)
    doc.text('Total Paid:', 20, 125)
    doc.setFontSize(10)
    doc.setTextColor(50, 50, 50)
    doc.text(`€${booking.totalAmount.toFixed(2)}`, 20, 132)
    
    // Customer Info
    doc.setFontSize(14)
    doc.setTextColor(0, 0, 0)
    doc.text('Customer Information', 20, 150)
    
    doc.setFontSize(10)
    doc.setTextColor(50, 50, 50)
    doc.text(`Name: ${booking.customerName}`, 20, 160)
    doc.text(`Email: ${booking.customerEmail}`, 20, 167)
    doc.text(`Phone: ${booking.customerPhone}`, 20, 174)
    
    // Meeting Point
    if (booking.meetingPoint) {
      doc.setFontSize(14)
      doc.setTextColor(0, 0, 0)
      doc.text('Meeting Point', 20, 192)
      
      doc.setFontSize(9)
      doc.setTextColor(50, 50, 50)
      const splitMeeting = doc.splitTextToSize(booking.meetingPoint, 170)
      doc.text(splitMeeting, 20, 200)
    }
    
    // Important Reminders Box
    const boxY = booking.meetingPoint ? 220 : 200
    doc.setFillColor(255, 243, 205) // Light yellow
    doc.roundedRect(15, boxY, 180, 35, 3, 3, 'F')
    
    doc.setFontSize(11)
    doc.setTextColor(180, 83, 9) // Orange
    doc.text('Important Reminders', 20, boxY + 8)
    
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text('• Please arrive 15-20 minutes before your scheduled time', 20, boxY + 16)
    doc.text('• Bring a valid ID or passport', 20, boxY + 22)
    doc.text('• Dress code: Shoulders and knees must be covered', 20, boxY + 28)
    
    // Footer
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text('Tickets in Rome | info@ticketsinrome.com | +39 351 786 9798', 20, 280)
    doc.text(`Booked on ${format(new Date(booking.createdAt), 'MMM d, yyyy')}`, 20, 285)
    
    // Save
    doc.save(`TicketsInRome-Booking-${booking.id.slice(-8).toUpperCase()}.pdf`)
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh] pt-24">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading your booking details...</p>
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh] pt-24 px-4">
          <div className="max-w-md text-center">
            <div className="w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Booking Not Found</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Link href="/" className="inline-block px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity">
              Back to Home
            </Link>
          </div>
        </div>
      </main>
    )
  }

  if (!booking) return null

  return (
    <main className="min-h-screen bg-background">
      <Header />
      
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">Booking Confirmed!</h1>
            <p className="text-muted-foreground text-lg">
              Your booking reference is <strong className="text-foreground">{booking.id.slice(-8).toUpperCase()}</strong>
            </p>
          </div>

          {/* Booking Details Card */}
          <div className="bg-card rounded-2xl border border-border p-8 mb-6">
            <h2 className="text-xl font-bold mb-6">Booking Details</h2>
            
            <div className="space-y-6">
              {/* Tour */}
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Tour</h3>
                <p className="text-lg font-medium">{booking.tourTitle}</p>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-2">
                    <Calendar className="w-4 h-4" />
                    Date
                  </div>
                  <p className="font-medium">{format(new Date(booking.date + 'T12:00:00'), 'EEEE, MMMM d, yyyy')}</p>
                </div>
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-2">
                    <Clock className="w-4 h-4" />
                    Time
                  </div>
                  <p className="font-medium">{booking.time}</p>
                </div>
              </div>

              {/* Guests & Total */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-2">
                    <Users className="w-4 h-4" />
                    Guests
                  </div>
                  <p className="font-medium">{booking.guests} {booking.guests === 1 ? 'person' : 'people'}</p>
                </div>
                <div>
                  <div className="text-sm font-semibold text-muted-foreground mb-2">Total Paid</div>
                  <p className="text-2xl font-bold text-primary">€{booking.totalAmount.toFixed(2)}</p>
                </div>
              </div>

              {/* Meeting Point */}
              {booking.meetingPoint && (
                <div>
                  <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground mb-2">
                    <MapPin className="w-4 h-4" />
                    Meeting Point
                  </div>
                  <p className="text-sm">{booking.meetingPoint}</p>
                </div>
              )}
            </div>
          </div>

          {/* Download PDF Button */}
          <button
            onClick={downloadPDF}
            className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:opacity-90 transition-opacity flex items-center justify-center gap-2 mb-6"
          >
            <Download className="w-5 h-5" />
            Download PDF Ticket
          </button>

          {/* Important Reminders */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6 mb-6">
            <h3 className="font-bold text-amber-900 mb-3">Important Reminders</h3>
            <ul className="space-y-2 text-sm text-amber-800">
              <li className="flex items-start gap-2">
                <span className="font-bold mt-0.5">•</span>
                <span>Please arrive 15-20 minutes before your scheduled time</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold mt-0.5">•</span>
                <span>Bring a valid ID or passport</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold mt-0.5">•</span>
                <span>Dress code: Shoulders and knees must be covered (for Vatican tours)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold mt-0.5">•</span>
                <span>Check your email for your confirmation and digital ticket</span>
              </li>
            </ul>
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <Check className="w-5 h-5 text-green-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold">Instant Confirmation</p>
                <p className="text-xs text-muted-foreground">Booking confirmed</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <Mail className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold">Email Sent</p>
                <p className="text-xs text-muted-foreground">Check your inbox</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-muted rounded-lg">
              <Download className="w-5 h-5 text-purple-600 shrink-0" />
              <div>
                <p className="text-sm font-semibold">Mobile Ticket</p>
                <p className="text-xs text-muted-foreground">Download PDF</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/" className="flex-1 py-3 px-6 bg-secondary text-foreground font-semibold rounded-lg hover:bg-secondary/80 transition-colors text-center">
              Back to Home
            </Link>
            <Link href="/tours" className="flex-1 py-3 px-6 bg-primary text-white font-semibold rounded-lg hover:opacity-90 transition-opacity text-center">
              Browse More Tours
            </Link>
          </div>
        </div>
      </section>

      <FooterSection />
    </main>
  )
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-background">
        <Header />
        <div className="flex items-center justify-center min-h-[60vh] pt-24">
          <div className="text-center">
            <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      </main>
    }>
      <SuccessPageContent />
    </Suspense>
  )
}
