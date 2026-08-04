'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

function RedirectContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Redirect to the main success page with the session_id
    const target = sessionId
      ? `/success?session_id=${encodeURIComponent(sessionId)}`
      : '/success';
    router.replace(target);
  }, [sessionId, router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-2 border-border border-t-transparent mx-auto" />
        <p className="text-muted-foreground font-medium">Redirecting to your booking...</p>
      </div>
    </div>
  );
}

export default function BookingSuccessRedirect() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-border border-t-transparent" />
      </div>
    }>
      <RedirectContent />
    </Suspense>
  );
}
