# Ticket System Flow Diagram
**How the Deep Linking Ticket System Works**

---

## 📱 Complete User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                    CUSTOMER BOOKS A TOUR                        │
│                  (wondersofrome.com/tour/...)                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   FILLS BOOKING DETAILS                         │
│              (Date, Time, Guests, Contact Info)                 │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   COMPLETES STRIPE PAYMENT                      │
│                    (Secure Card Payment)                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              STRIPE WEBHOOK TRIGGERS (payment_intent.succeeded) │
│                                                                 │
│  1. Generate booking reference (e.g., ABC12345)                │
│  2. Send confirmation email with ticket link                   │
│  3. Save booking to Payload CMS                                │
│  4. Decrement inventory                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                  CUSTOMER RECEIVES EMAIL                        │
│                                                                 │
│  Subject: ✅ Booking Confirmed: Vatican Tour (Ref: ABC12345)   │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  ✓ You're all set!                                        │ │
│  │  Your booking is confirmed and paid.                      │ │
│  │                                                           │ │
│  │  Booking Reference: #ABC12345                            │ │
│  │  Tour: Vatican Museums Skip-the-Line                     │ │
│  │  Date: May 25, 2026                                      │ │
│  │  Time: 09:00 AM                                          │ │
│  │                                                           │ │
│  │  ┌─────────────────────────────────────────────────┐    │ │
│  │  │  📱 View Your Ticket Anytime                    │    │ │
│  │  │  Access your ticket on any device!              │    │ │
│  │  │                                                  │    │ │
│  │  │  [View My Ticket →]                             │    │ │
│  │  │  https://wondersofrome.com/ticket/ABC12345      │    │ │
│  │  └─────────────────────────────────────────────────┘    │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│              CUSTOMER CLICKS "VIEW MY TICKET"                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Is Mobile App  │
                    │   Installed?    │
                    └─────────────────┘
                       │           │
                  YES  │           │  NO
                       │           │
        ┌──────────────┘           └──────────────┐
        ▼                                         ▼
┌──────────────────┐                    ┌──────────────────┐
│  OPENS IN APP    │                    │  OPENS IN WEB    │
│  (Phase 2)       │                    │  BROWSER         │
│                  │                    │  (Phase 1)       │
│  Native ticket   │                    │                  │
│  view with       │                    │  Shows app       │
│  offline access  │                    │  download banner │
└──────────────────┘                    └──────────────────┘
                                                 │
                                                 ▼
                                    ┌──────────────────────┐
                                    │  TICKET PAGE LOADS   │
                                    │  /ticket/ABC12345    │
                                    │                      │
                                    │  1. Fetch from       │
                                    │     Payload CMS      │
                                    │  2. Generate QR code │
                                    │  3. Display ticket   │
                                    └──────────────────────┘
                                                 │
                                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    TICKET DISPLAY                               │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐ │
│  │  Wonders of Rome                    Booking ID: ABC12345  │ │
│  │                                                           │ │
│  │  Vatican Museums Skip-the-Line Tour                      │ │
│  │                                                           │ │
│  │  📅 Date: May 25, 2026      ⏰ Time: 09:00 AM           │ │
│  │  👥 Guests: 2 Adults        📍 Meeting Point: Via...    │ │
│  │                                                           │ │
│  │              ┌─────────────────┐                         │ │
│  │              │                 │                         │ │
│  │              │   QR CODE       │                         │ │
│  │              │   [████████]    │                         │ │
│  │              │                 │                         │ │
│  │              └─────────────────┘                         │ │
│  │         Scan this at meeting point                       │ │
│  │                                                           │ │
│  │  Lead Guest: John Doe                                    │ │
│  │  Email: john@example.com                                 │ │
│  │                                                           │ │
│  │  [Download Ticket]  [Add to Calendar]                    │ │
│  └───────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    ┌─────────────────┐
                    │  Customer Can:  │
                    └─────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌──────────────┐    ┌──────────────┐    ┌──────────────┐
│  Download    │    │  Add to      │    │  Share via   │
│  PDF Ticket  │    │  Calendar    │    │  WhatsApp    │
└──────────────┘    └──────────────┘    └──────────────┘
```

---

## 🔄 Technical Flow

### 1. Booking Creation
```
User → BookingWidget → CheckoutDrawer → Stripe Checkout
                                              ↓
                                    Payment Intent Created
                                              ↓
                                    Webhook Triggered
```

### 2. Webhook Processing
```
Stripe Webhook → /api/webhooks/stripe/route.ts
                        ↓
        ┌───────────────┼───────────────┐
        ▼               ▼               ▼
   Send Email    Save to Payload   Decrement Inventory
```

### 3. Email Delivery
```
Resend API → Customer Email
                ↓
    Contains ticket link:
    https://wondersofrome.com/ticket/{BOOKING_ID}?source=email
```

### 4. Ticket Viewing
```
User clicks link → /ticket/[id]/page.tsx
                        ↓
            getTicketById(id) → Payload CMS
                        ↓
            Fetch booking data
                        ↓
            Generate QR code
                        ↓
            Render TicketDisplay component
```

### 5. API Endpoints
```
GET /api/tickets/{id}?format=json
    → Returns JSON data for app

GET /api/tickets/{id}?format=pdf
    → Returns PDF download
```

---

## 📊 Data Flow

```
┌─────────────────┐
│  Stripe Payment │
│   Intent ID     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐      ┌──────────────┐
│  Payload CMS    │◄─────│  Webhook     │
│  Bookings       │      │  Handler     │
│  Collection     │      └──────────────┘
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Ticket Service │
│  getTicketById()│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Ticket Display │
│  Component      │
└─────────────────┘
```

---

## 🔐 Security Flow

```
Booking Reference Generation:
    nanoid(8) → ABC12345 (8 random characters)
    
Access Control:
    ✓ Public by booking reference (like airline tickets)
    ✓ High entropy (62^8 = 218 trillion combinations)
    ✓ No sequential IDs
    ✓ Rate limiting recommended
    
Privacy:
    ✓ noindex meta tag (not searchable)
    ✓ No payment info displayed
    ✓ Only booking details shown
```

---

## 📱 Mobile App Integration (Phase 2)

### iOS Deep Linking
```
Email Link → iOS detects wondersofrome.com
                ↓
    Checks apple-app-site-association
                ↓
    App installed? → YES → Opens in app
                   → NO  → Opens in Safari
```

### Android Deep Linking
```
Email Link → Android detects wondersofrome.com
                ↓
    Checks assetlinks.json
                ↓
    App installed? → YES → Opens in app
                   → NO  → Opens in Chrome
```

---

## 🎯 User Experience Scenarios

### Scenario 1: Desktop User
```
1. Books tour on laptop
2. Receives email
3. Clicks "View My Ticket"
4. Opens in browser
5. Can download PDF
6. Can add to calendar
7. Can print ticket
```

### Scenario 2: Mobile User (No App)
```
1. Books tour on phone
2. Receives email
3. Clicks "View My Ticket"
4. Opens in mobile browser
5. Sees app download banner
6. Views ticket online
7. Can download PDF
8. Can add to calendar
```

### Scenario 3: Mobile User (With App) - Phase 2
```
1. Books tour on phone
2. Receives email
3. Clicks "View My Ticket"
4. Opens directly in app
5. Ticket available offline
6. Can share via app
7. Receives push notifications
```

---

## 🔧 Configuration Files

### Universal Links (iOS)
```
File: public/.well-known/apple-app-site-association
Purpose: Tell iOS which URLs should open in app
Paths: /ticket/*, /booking/*, /tour/*
```

### Digital Asset Links (Android)
```
File: public/.well-known/assetlinks.json
Purpose: Tell Android which URLs should open in app
Package: com.wondersofrome.app
```

---

## 📈 Analytics Tracking

```
Ticket View Event:
    ticket_id: ABC12345
    source: email | sms | direct
    platform: mobile | desktop
    has_app: true | false

App Download Click:
    source: ticket_page
    platform: ios | android
    ticket_id: ABC12345
```

---

## 🚀 Deployment Flow

```
1. Code Changes
   ↓
2. Build (npm run build)
   ↓
3. Git Commit
   ↓
4. Git Push
   ↓
5. Deploy to Production
   ↓
6. Test with Real Booking
   ↓
7. Monitor Logs
   ↓
8. Track Analytics
```

---

## ✅ Success Criteria

**Phase 1 (Current):**
- ✅ Customers can view tickets online
- ✅ Email contains ticket link
- ✅ QR code generated
- ✅ PDF download works
- ✅ Calendar integration works
- ✅ Mobile responsive
- ✅ Build successful

**Phase 2 (Future):**
- [ ] App opens from email link
- [ ] Offline ticket viewing
- [ ] Push notifications
- [ ] In-app updates

---

**System Status:** ✅ Fully Operational  
**Ready for Production:** Yes  
**Next Phase:** Mobile App Development
