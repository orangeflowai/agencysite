# Deep Linking Implementation Guide
## Website to Mobile App Ticket Integration

**Date:** May 19, 2026  
**Website:** wondersofrome.com  
**App:** Wonders of Rome Mobile App (iOS/Android)  
**Status:** Pre-Launch Strategy

---

## Overview

Implement deep linking so users can view their tickets in the mobile app after booking on the website. Since the app isn't launched yet, we'll use a **progressive enhancement** strategy:

1. **Phase 1 (Now):** Web-based ticket viewer with deep link preparation
2. **Phase 2 (App Launch):** Universal links that open app if installed, fallback to web

---

## Architecture

```
User Books Ticket on Website
    ↓
Booking Confirmation Email
    ↓
Contains Link: wondersofrome.com/ticket/ABC123
    ↓
┌─────────────────────────────────────┐
│  Is App Installed?                  │
├─────────────────────────────────────┤
│  YES → Open in App                  │
│  NO  → Open Web Ticket Viewer       │
└─────────────────────────────────────┘
```

---

## Phase 1: Web Ticket Viewer (Implement Now)

### Step 1: Create Ticket Viewer Page

Create a web page that displays the ticket and prepares for deep linking.

**File:** `wondersofrome/src/app/ticket/[id]/page.tsx`

```typescript
import { notFound } from 'next/navigation';
import { getTicketById } from '@/lib/ticketService';
import TicketDisplay from '@/components/TicketDisplay';
import AppDownloadPrompt from '@/components/AppDownloadPrompt';

export default async function TicketPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const ticket = await getTicketById(id);
  
  if (!ticket) notFound();
  
  return (
    <main className="min-h-screen bg-background">
      {/* App Download Prompt (shows if app not installed) */}
      <AppDownloadPrompt ticketId={id} />
      
      {/* Web Ticket Viewer */}
      <TicketDisplay ticket={ticket} />
      
      {/* Deep Link Meta Tags */}
      <DeepLinkMeta ticketId={id} />
    </main>
  );
}
```

---

## Step 2: Deep Link URL Structure

### URL Format
```
https://wondersofrome.com/ticket/{TICKET_ID}?source=email
```

### Query Parameters

- `source=email` - Track where user came from
- `ref=booking` - Reference type
- `utm_campaign=ticket_view` - Analytics tracking

### Example URLs
```
https://wondersofrome.com/ticket/WOR-2026-ABC123?source=email
https://wondersofrome.com/ticket/WOR-2026-ABC123?source=sms
https://wondersofrome.com/ticket/WOR-2026-ABC123?source=app_share
```

---

## Step 3: Universal Links Configuration

### For iOS (Apple App Site Association)

**File:** `wondersofrome/public/.well-known/apple-app-site-association`

```json
{
  "applinks": {
    "apps": [],
    "details": [
      {
        "appID": "TEAM_ID.com.wondersofrome.app",
        "paths": [
          "/ticket/*",
          "/booking/*",
          "/tour/*"
        ]
      }
    ]
  },
  "webcredentials": {
    "apps": ["TEAM_ID.com.wondersofrome.app"]
  }
}
```

### For Android (Digital Asset Links)

**File:** `wondersofrome/public/.well-known/assetlinks.json`

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.wondersofrome.app",
      "sha256_cert_fingerprints": [
        "YOUR_APP_SHA256_FINGERPRINT"
      ]
    }
  }
]
```

---

## Step 4: Smart Banner Implementation

Add smart app banners to prompt users to download the app.

**Component:** `wondersofrome/src/components/AppDownloadPrompt.tsx`

```typescript
'use client';

import { useState, useEffect } from 'react';
import { X, Download, Smartphone } from 'lucide-react';

interface AppDownloadPromptProps {
  ticketId: string;
}

export default function AppDownloadPrompt({ ticketId }: AppDownloadPromptProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [platform, setPlatform] = useState<'ios' | 'android' | null>(null);

  useEffect(() => {
    // Detect platform
    const userAgent = navigator.userAgent.toLowerCase();
    const isIOS = /iphone|ipad|ipod/.test(userAgent);
    const isAndroid = /android/.test(userAgent);
    
    if (isIOS) setPlatform('ios');
    else if (isAndroid) setPlatform('android');
    
    // Check if app is installed (will be implemented when app launches)
    const appInstalled = checkIfAppInstalled();
    
    // Show prompt if app not installed
    if (!appInstalled && (isIOS || isAndroid)) {
      setIsVisible(true);
    }
  }, []);

  const handleDownload = () => {
    if (platform === 'ios') {
      window.location.href = 'https://apps.apple.com/app/wonders-of-rome/id123456789';
    } else if (platform === 'android') {
      window.location.href = 'https://play.google.com/store/apps/details?id=com.wondersofrome.app';
    }
  };

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-primary text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Smartphone className="w-6 h-6" />
          <div>
            <p className="font-bold text-sm">View Your Ticket in Our App</p>
            <p className="text-xs opacity-90">Better experience, offline access</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="bg-white text-primary px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download App
          </button>
          <button
            onClick={() => setIsVisible(false)}
            className="p-2 hover:bg-white/20 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function checkIfAppInstalled(): boolean {
  // This will be implemented when app launches
  // For now, always return false
  return false;
}
```

---

## Step 5: Email Template with Deep Link

Update booking confirmation email to include deep link.

**File:** `wondersofrome/src/lib/emailTemplates.ts`

```typescript
export function generateBookingConfirmationEmail(booking: Booking) {
  const ticketUrl = `https://wondersofrome.com/ticket/${booking.ticketId}?source=email&ref=booking`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #06858e; color: white; padding: 20px; text-align: center;">
        <h1>Booking Confirmed!</h1>
      </div>
      
      <div style="padding: 20px;">
        <p>Hi ${booking.customerName},</p>
        <p>Your booking for <strong>${booking.tourName}</strong> is confirmed!</p>
        
        <div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Booking ID:</strong> ${booking.ticketId}</p>
          <p><strong>Date:</strong> ${booking.date}</p>
          <p><strong>Time:</strong> ${booking.time}</p>
          <p><strong>Guests:</strong> ${booking.guestCount}</p>
        </div>
        
        <!-- Deep Link Button -->
        <div style="text-align: center; margin: 30px 0;">
          <a href="${ticketUrl}" 
             style="background: #06858e; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: bold;">
            View Your Ticket
          </a>
        </div>
        
        <p style="font-size: 12px; color: #666; text-align: center;">
          💡 Tip: Download our mobile app for offline access to your tickets!
        </p>
      </div>
    </body>
    </html>
  `;
}
```

---

## Step 6: Ticket Data API

Create API endpoint to fetch ticket data for the app.

**File:** `wondersofrome/src/app/api/ticket/[id]/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { getTicketById } from '@/lib/ticketService';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  
  try {
    const ticket = await getTicketById(id);
    
    if (!ticket) {
      return NextResponse.json(
        { error: 'Ticket not found' },
        { status: 404 }
      );
    }
    
    // Return ticket data in app-friendly format
    return NextResponse.json({
      ticketId: ticket.id,
      tourName: ticket.tourName,
      tourSlug: ticket.tourSlug,
      customerName: ticket.customerName,
      customerEmail: ticket.customerEmail,
      date: ticket.date,
      time: ticket.time,
      guestCount: ticket.guestCount,
      totalPrice: ticket.totalPrice,
      qrCode: ticket.qrCode,
      meetingPoint: ticket.meetingPoint,
      status: ticket.status,
      createdAt: ticket.createdAt,
    });
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

---

## Step 7: QR Code Generation

Generate QR codes for tickets that can be scanned in the app.

**Install dependency:**
```bash
npm install qrcode
npm install -D @types/qrcode
```

**File:** `wondersofrome/src/lib/qrCodeService.ts`

```typescript
import QRCode from 'qrcode';

export async function generateTicketQRCode(ticketId: string): Promise<string> {
  try {
    // Generate QR code with ticket URL
    const ticketUrl = `https://wondersofrome.com/ticket/${ticketId}`;
    const qrCodeDataUrl = await QRCode.toDataURL(ticketUrl, {
      width: 300,
      margin: 2,
      color: {
        dark: '#06858e',
        light: '#ffffff',
      },
    });
    
    return qrCodeDataUrl;
  } catch (error) {
    console.error('Error generating QR code:', error);
    throw error;
  }
}

export async function generateTicketQRCodeBuffer(ticketId: string): Promise<Buffer> {
  try {
    const ticketUrl = `https://wondersofrome.com/ticket/${ticketId}`;
    const buffer = await QRCode.toBuffer(ticketUrl, {
      width: 300,
      margin: 2,
    });
    
    return buffer;
  } catch (error) {
    console.error('Error generating QR code buffer:', error);
    throw error;
  }
}
```

---

## Step 8: Ticket Display Component

Create a beautiful ticket display for the web viewer.

**File:** `wondersofrome/src/components/TicketDisplay.tsx`

```typescript
'use client';

import Image from 'next/image';
import { Calendar, Clock, Users, MapPin, Download } from 'lucide-react';

interface TicketDisplayProps {
  ticket: {
    id: string;
    tourName: string;
    customerName: string;
    date: string;
    time: string;
    guestCount: number;
    qrCode: string;
    meetingPoint: string;
    status: string;
  };
}

export default function TicketDisplay({ ticket }: TicketDisplayProps) {
  const handleDownload = () => {
    // Download ticket as PDF or image
    window.print();
  };

  return (
    <div className="max-w-2xl mx-auto p-4 py-8">
      {/* Ticket Card */}
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-primary/20">
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-primary/80 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest opacity-90">E-Ticket</p>
              <h1 className="text-2xl font-bold mt-1">Wonders of Rome</h1>
            </div>
            <div className="text-right">
              <p className="text-xs opacity-90">Booking ID</p>
              <p className="font-mono font-bold">{ticket.id}</p>
            </div>
          </div>
        </div>

        {/* Tour Info */}
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-foreground mb-4">{ticket.tourName}</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="font-semibold">{ticket.date}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Time</p>
                <p className="font-semibold">{ticket.time}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Guests</p>
                <p className="font-semibold">{ticket.guestCount} {ticket.guestCount === 1 ? 'Guest' : 'Guests'}</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">Meeting Point</p>
                <p className="font-semibold text-sm">{ticket.meetingPoint}</p>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="p-6 bg-muted/30 text-center">
          <p className="text-sm text-muted-foreground mb-4">Scan this code at the meeting point</p>
          <div className="inline-block p-4 bg-white rounded-xl shadow-md">
            <Image 
              src={ticket.qrCode} 
              alt="Ticket QR Code" 
              width={200} 
              height={200}
              className="mx-auto"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Ticket for: <strong>{ticket.customerName}</strong>
          </p>
        </div>

        {/* Actions */}
        <div className="p-6 flex gap-3">
          <button
            onClick={handleDownload}
            className="flex-1 bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:opacity-90 transition"
          >
            <Download className="w-5 h-5" />
            Download Ticket
          </button>
        </div>
      </div>

      {/* Important Info */}
      <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
        <p className="text-sm text-yellow-800">
          <strong>Important:</strong> Please arrive 15 minutes before your scheduled time. 
          Bring a valid ID and this ticket (digital or printed).
        </p>
      </div>
    </div>
  );
}
```

---

## Phase 2: App Integration (When App Launches)

### Mobile App Deep Link Handling

#### iOS (Swift)
```swift
// AppDelegate.swift
func application(_ application: UIApplication,
                continue userActivity: NSUserActivity,
                restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
    
    guard userActivity.activityType == NSUserActivityTypeBrowsingWeb,
          let url = userActivity.webpageURL else {
        return false
    }
    
    // Handle ticket URL
    if url.path.hasPrefix("/ticket/") {
        let ticketId = url.lastPathComponent
        openTicket(ticketId: ticketId)
        return true
    }
    
    return false
}

func openTicket(ticketId: String) {
    // Navigate to ticket view in app
    let ticketVC = TicketViewController(ticketId: ticketId)
    navigationController?.pushViewController(ticketVC, animated: true)
}
```

#### Android (Kotlin)
```kotlin
// MainActivity.kt
override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    
    // Handle deep link
    intent?.data?.let { uri ->
        if (uri.path?.startsWith("/ticket/") == true) {
            val ticketId = uri.lastPathSegment
            openTicket(ticketId)
        }
    }
}

private fun openTicket(ticketId: String?) {
    ticketId?.let {
        val intent = Intent(this, TicketActivity::class.java)
        intent.putExtra("TICKET_ID", it)
        startActivity(intent)
    }
}
```

---

## Implementation Checklist

### Immediate (Phase 1 - Before App Launch)

- [ ] Create `/ticket/[id]` page for web ticket viewer
- [ ] Generate QR codes for all bookings
- [ ] Update booking confirmation email with ticket link
- [ ] Add app download prompt banner
- [ ] Create `.well-known` files for universal links
- [ ] Test ticket viewing on mobile browsers
- [ ] Add "Download App" CTAs throughout site

### When App Launches (Phase 2)

- [ ] Submit app to App Store / Play Store
- [ ] Configure universal links in app
- [ ] Test deep linking from email to app
- [ ] Update smart banner to detect app installation
- [ ] Add app-to-app sharing functionality
- [ ] Implement offline ticket viewing in app
- [ ] Add push notifications for booking updates

---

## Testing Strategy

### Test Scenarios

1. **Email Link (No App Installed)**
   - Click link in email → Opens web ticket viewer
   - Shows app download prompt
   - Can view full ticket details

2. **Email Link (App Installed)**
   - Click link in email → Opens directly in app
   - Shows ticket in native app interface
   - No web page shown

3. **SMS Link**
   - Same behavior as email link
   - Track with `?source=sms` parameter

4. **QR Code Scan**
   - Scan QR code → Opens ticket page
   - Works with or without app

5. **Direct URL**
   - Type URL in browser → Opens ticket
   - Prompts to download app if not installed

---

## Analytics Tracking

Track deep link performance:

```typescript
// Track in Google Analytics
gtag('event', 'ticket_view', {
  ticket_id: ticketId,
  source: searchParams.get('source'),
  has_app: checkIfAppInstalled(),
  platform: getPlatform(),
});

// Track app downloads from ticket page
gtag('event', 'app_download_click', {
  source: 'ticket_page',
  ticket_id: ticketId,
});
```

---

## Security Considerations

1. **Ticket ID Format**
   - Use UUIDs or secure random strings
   - Don't use sequential IDs
   - Example: `WOR-2026-a7f3c9d2-4b1e-8f6a-9c2d-1e5b7a3f9c8d`

2. **Access Control**
   - Tickets are public by ID (like airline tickets)
   - Add email verification for sensitive actions
   - Rate limit API endpoints

3. **QR Code Security**
   - QR codes contain only ticket URL
   - Validate ticket on scan
   - Track scan location/time

---

## Next Steps

1. **Implement web ticket viewer** (1-2 days)
2. **Update email templates** (1 day)
3. **Add QR code generation** (1 day)
4. **Test on mobile devices** (1 day)
5. **Prepare for app launch** (ongoing)

---

**Status:** Ready to implement Phase 1  
**Timeline:** 3-5 days for complete Phase 1 implementation  
**App Launch:** Phase 2 activates automatically when app goes live
