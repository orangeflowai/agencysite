import { notFound } from 'next/navigation';
import { getBookingByRef } from '@/app/actions/bookingActions';
import TicketDisplay from '@/components/TicketDisplay';
import AppDownloadPrompt from '@/components/AppDownloadPrompt';
import { Metadata } from 'next';

interface TicketPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: TicketPageProps): Promise<Metadata> {
  const { id } = await params;

  return {
    title: `Your Ticket - ${id} | Wonders of Rome`,
    description: 'View your booking confirmation and ticket details',
    robots: 'noindex, nofollow',
  };
}

export default async function TicketPage({ params, searchParams }: TicketPageProps) {
  const { id } = await params;
  const search = await searchParams;
  const email = (search.email as string) || '';

  if (!email) {
    // No email provided — show a form to enter email for verification
    return (
      <main className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md mx-auto p-8 text-center">
          <h1 className="text-2xl font-bold text-primary mb-4">View Your Ticket</h1>
          <p className="text-muted-foreground mb-6">
            Enter the email address used for your booking to view your ticket.
          </p>
          <form action={`/ticket/${id}`} method="get" className="space-y-4">
            <input type="hidden" name="id" value={id} />
            <input
              type="email"
              name="email"
              placeholder="booking@email.com"
              required
              className="w-full px-4 py-3 rounded-xl border border-border bg-background"
            />
            <button
              type="submit"
              className="w-full px-6 py-3 bg-primary text-white font-semibold rounded-xl hover:bg-card transition-colors"
            >
              View Ticket
            </button>
          </form>
        </div>
      </main>
    );
  }

  // Fetch booking via server action (service-role, email-gated)
  const booking = await getBookingByRef(id, email);

  if (!booking) {
    notFound();
  }

  // Map to the shape TicketDisplay expects
  const ticket = {
    id: booking.id,
    bookingRef: booking.booking_ref,
    tourTitle: booking.tour_title,
    tourSlug: booking.tour_slug,
    customerName: `${booking.lead_first_name} ${booking.lead_last_name}`.trim(),
    customerEmail: booking.lead_email,
    date: booking.date,
    time: booking.time,
    guestCount: booking.guests,
    guestCounts: booking.guest_counts || {},
    totalPrice: booking.total_amount,
    status: booking.status,
    createdAt: booking.created_at,
    meetingPoint: booking.meeting_point,
  };

  return (
    <main className="min-h-screen bg-background">
      <AppDownloadPrompt ticketId={id} />
      <TicketDisplay ticket={ticket} />
      <DeepLinkMeta ticketId={id} source={search.source as string | undefined} />
    </main>
  );
}

// Component to add deep link meta tags
function DeepLinkMeta({ ticketId, source }: { ticketId: string; source?: string }) {
  const ticketUrl = `https://wondersofrome.com/ticket/${ticketId}${source ? `?source=${source}` : ''}`;
  
  return (
    <>
      {/* iOS Smart App Banner */}
      <meta name="apple-itunes-app" content="app-id=123456789, app-argument=wondersofrome://ticket/{ticketId}" />
      
      {/* Android Intent */}
      <meta name="google-play-app" content="app-id=com.wondersofrome.app" />
      
      {/* Open Graph for sharing */}
      <meta property="og:title" content="Your Wonders of Rome Ticket" />
      <meta property="og:description" content="View your booking confirmation and ticket details" />
      <meta property="og:url" content={ticketUrl} />
      <meta property="og:type" content="website" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content="Your Wonders of Rome Ticket" />
      <meta name="twitter:description" content="View your booking confirmation and ticket details" />
    </>
  );
}
