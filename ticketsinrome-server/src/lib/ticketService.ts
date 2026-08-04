/**
 * ticketService.ts — Fetch ticket/booking data from Payload CMS
 */

const PAYLOAD_URL = process.env.PAYLOAD_API_URL || process.env.NEXT_PUBLIC_PAYLOAD_URL || 'https://admin.wondersofrome.com';

export interface Ticket {
  id: string;
  bookingRef: string;
  tourTitle: string;
  tourSlug: string;
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
  createdAt: string;
  stripePaymentIntentId?: string;
  addOns?: Array<{ name: string; price: number }>;
}

async function getPayloadToken(): Promise<string> {
  try {
    const res = await fetch(`${PAYLOAD_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: process.env.PAYLOAD_API_EMAIL || 'superadmin@romeagency.com',
        password: process.env.PAYLOAD_API_PASSWORD || 'SuperAdmin2025!',
      }),
      cache: 'no-store',
    });
    
    if (!res.ok) throw new Error('Auth failed');
    const data = await res.json();
    return data.token;
  } catch (error) {
    console.error('[ticketService] Auth failed:', error);
    throw error;
  }
}

/**
 * Fetch ticket by booking reference or Stripe payment intent ID
 */
export async function getTicketById(id: string): Promise<Ticket | null> {
  try {
    const token = await getPayloadToken();
    
    // Try to find by bookingRef first
    let res = await fetch(
      `${PAYLOAD_URL}/api/bookings?where[bookingRef][equals]=${encodeURIComponent(id)}&limit=1&depth=1`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      }
    );
    
    let data = await res.json();
    let booking = data?.docs?.[0];
    
    // If not found, try by stripePaymentIntentId
    if (!booking) {
      res = await fetch(
        `${PAYLOAD_URL}/api/bookings?where[stripePaymentIntentId][equals]=${encodeURIComponent(id)}&limit=1&depth=1`,
        {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        }
      );
      
      data = await res.json();
      booking = data?.docs?.[0];
    }
    
    if (!booking) return null;
    
    // Map Payload booking to Ticket interface
    const customerName = booking.leadFirstName && booking.leadLastName
      ? `${booking.leadFirstName} ${booking.leadLastName}`
      : booking.leadFirstName || 'Guest';
    
    // Generate QR code data URL
    const qrData = JSON.stringify({
      ref: booking.bookingRef,
      tour: booking.tourTitle,
      date: booking.date,
      guests: booking.guests,
    });
    
    // Import QRCode dynamically
    const QRCode = await import('qrcode');
    let qrCodeUrl = '';
    try {
      qrCodeUrl = await QRCode.toDataURL(qrData, {
        width: 300,
        margin: 2,
        color: {
          dark: '#06858e',
          light: '#ffffff',
        },
      });
    } catch (error) {
      console.error('[ticketService] QR code generation failed:', error);
    }
    
    // Get meeting point from tour data if available
    let meetingPoint = 'Via Tunisi 43, 00192 Roma RM, Italy';
    if (booking.tour && typeof booking.tour === 'object') {
      meetingPoint = booking.tour.meetingPoint || booking.tour.meeting_point || meetingPoint;
    }
    
    return {
      id: booking.id,
      bookingRef: booking.bookingRef,
      tourTitle: booking.tourTitle,
      tourSlug: booking.tourSlug || '',
      customerName,
      customerEmail: booking.leadEmail || '',
      date: booking.date,
      time: booking.time,
      guestCount: booking.guests || 0,
      guestCounts: booking.guestCounts || {},
      totalPrice: booking.totalAmount || 0,
      qrCode: qrCodeUrl,
      meetingPoint,
      status: booking.status || 'confirmed',
      createdAt: booking.createdAt,
      stripePaymentIntentId: booking.stripePaymentIntentId,
      addOns: booking.addOns || [],
    };
  } catch (error) {
    console.error('[ticketService] Error fetching ticket:', error);
    return null;
  }
}

/**
 * Get all tickets for a customer by email
 */
export async function getTicketsByEmail(email: string): Promise<Ticket[]> {
  try {
    const token = await getPayloadToken();
    
    const res = await fetch(
      `${PAYLOAD_URL}/api/bookings?where[leadEmail][equals]=${encodeURIComponent(email)}&limit=50&sort=-createdAt&depth=1`,
      {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      }
    );
    
    const data = await res.json();
    const bookings = data?.docs || [];
    
    // Map all bookings to tickets
    const tickets: Ticket[] = [];
    for (const booking of bookings) {
      const customerName = booking.leadFirstName && booking.leadLastName
        ? `${booking.leadFirstName} ${booking.leadLastName}`
        : booking.leadFirstName || 'Guest';
      
      let meetingPoint = 'Via Tunisi 43, 00192 Roma RM, Italy';
      if (booking.tour && typeof booking.tour === 'object') {
        meetingPoint = booking.tour.meetingPoint || booking.tour.meeting_point || meetingPoint;
      }
      
      tickets.push({
        id: booking.id,
        bookingRef: booking.bookingRef,
        tourTitle: booking.tourTitle,
        tourSlug: booking.tourSlug || '',
        customerName,
        customerEmail: booking.leadEmail || '',
        date: booking.date,
        time: booking.time,
        guestCount: booking.guests || 0,
        guestCounts: booking.guestCounts || {},
        totalPrice: booking.totalAmount || 0,
        meetingPoint,
        status: booking.status || 'confirmed',
        createdAt: booking.createdAt,
        stripePaymentIntentId: booking.stripePaymentIntentId,
        addOns: booking.addOns || [],
      });
    }
    
    return tickets;
  } catch (error) {
    console.error('[ticketService] Error fetching tickets by email:', error);
    return [];
  }
}
