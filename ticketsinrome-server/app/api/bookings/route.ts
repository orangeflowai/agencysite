import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface BookingRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  date: string;
  participants: number;
  specialRequests?: string;
  tourSlug: string;
  totalPrice: number;
}

export async function POST(request: NextRequest) {
  try {
    const body: BookingRequest = await request.json();

    // Validate required fields
    if (!body.firstName || !body.lastName || !body.email || !body.phone || !body.date) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
        },
        { status: 400 }
      );
    }

    // In production, save to database and send confirmation email
    // await saveBookingToDatabase(body);
    // await sendConfirmationEmail(body);

    console.log('New booking received:', body);

    // Mock response
    const bookingId = `BK-${Date.now()}`;

    return NextResponse.json(
      {
        success: true,
        bookingId,
        message: 'Booking created successfully',
        booking: {
          id: bookingId,
          ...body,
          status: 'pending',
          createdAt: new Date().toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create booking',
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // In production, fetch bookings from database with authentication
    // const bookings = await fetchBookingsFromDatabase();

    return NextResponse.json(
      {
        success: true,
        bookings: [],
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch bookings',
      },
      { status: 500 }
    );
  }
}
