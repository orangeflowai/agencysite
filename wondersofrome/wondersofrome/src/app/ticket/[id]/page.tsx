import { notFound } from 'next/navigation';
import { getTicketById } from '@/lib/ticketService';
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
    robots: 'noindex, nofollow', // Don't index ticket pages
  };
}

export default async function TicketPage({ params, searchParams }: TicketPageProps) {
  const { id } = await params;
  const search = await searchParams;
  const source = search.source as string | undefined;
  
  // Fetch ticket data from Payload CMS
  const ticket = await getTicketById(id);
  
  if (!ticket) {
    notFound();
  }
  
  return (
    <main className="min-h-screen bg-background">
      {/* App Download Prompt (shows on mobile if app not installed) */}
      <AppDownloadPrompt ticketId={id} />
      
      {/* Web Ticket Viewer */}
      <TicketDisplay ticket={ticket} />
      
      {/* Deep Link Meta Tags for App */}
      <DeepLinkMeta ticketId={id} source={source} />
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
