# Deep Linking Implementation Complete ✅
## Website to Mobile App Ticket Integration

**Date:** May 19, 2026  
**Website:** wondersofrome.com  
**Status:** Phase 1 Complete - Ready for Production

---

## 🎯 What Was Implemented

A complete ticket viewing system that allows customers to view their booking tickets on any device, with deep linking support for future mobile app integration.

---

## 📦 Files Created

### 1. **Ticket Service** (`src/lib/ticketService.ts`)
- Fetches booking data from Payload CMS
- Generates QR codes for tickets
- Supports lookup by booking reference or Stripe payment intent ID
- Functions:
  - `getTicketById(id)` - Fetch single ticket
  - `getTicketsByEmail(email)` - Fetch all tickets for a customer

### 2. **Ticket Display Component** (`src/components/TicketDisplay.tsx`)
- Beautiful ticket UI with QR code
- Shows all booking details (tour, date, time, guests, meeting point)
- Download ticket as PDF
- Add to calendar functionality
- Print-friendly styling
- Mobile responsive

### 3. **App Download Prompt** (`src/components/AppDownloadPrompt.tsx`)
- Smart banner that shows on mobile devices
- Detects iOS/Android platform
- Dismissible banner
- Links to App Store/Play Store (URLs to be updated when app launches)

### 4. **Ticket Page** (`src/app/ticket/[id]/page.tsx`)
- Dynamic route: `/ticket/[id]`
- Fetches ticket data server-side
- Shows 404 if ticket not found
- Includes deep link meta tags for app integration
- SEO optimized (noindex for privacy)

### 5. **Updated Ticket API** (`src/app/api/tickets/[id]/route.ts`)
- Supports two formats:
  - `?format=json` - Returns JSON data (for app consumption)
  - `?format=pdf` - Returns PDF download
- Fetches real data from Payload CMS (no more mock data)

### 6. **Updated Email Template** (`src/lib/email-templates.ts`)
- Added "View My Ticket" button with deep link
- Links to: `https://wondersofrome.com/ticket/{BOOKING_ID}?source=email`
- Prominent green button in confirmation email

### 7. **Universal Links Configuration**
- **iOS**: `public/.well-known/apple-app-site-association`
- **Android**: `public/.well-known/assetlinks.json`
- Ready for app integration when app launches

---

## 🔗 URL Structure

### Ticket Viewing URL
```
https://wondersofrome.com/ticket/{BOOKING_ID}?source=email
```

**Examples:**
- `https://wondersofrome.com/ticket/ABC12345?source=email`
- `https://wondersofrome.com/ticket/pi_3abc123xyz?source=email`
- `https://wondersofrome.com/ticket/ABC12345?source=sms`

### API Endpoints

**Get Ticket as JSON:**
```
GET /api/tickets/{BOOKING_ID}?format=json
```

**Download Ticket as PDF:**
```
GET /api/tickets/{BOOKING_ID}?format=pdf
```

---

## 📧 Email Integration

The booking confirmation email now includes a prominent "View My Ticket" button:

```html
<a href="https://wondersofrome.com/ticket/{BOOKING_ID}?source=email">
  View My Ticket →
</a>
```

This button appears in the email after the "What to Remember" section, with:
- Green background (#10b981)
- Clear call-to-action text
- Tracking parameter `?source=email`

---

## 📱 Mobile App Integration (Phase 2 - When App Launches)

### Current Behavior (No App Installed)
1. User clicks ticket link in email
2. Opens in mobile browser
3. Shows app download banner at top
4. Displays full ticket in web view
5. Can download PDF or add to calendar

### Future Behavior (App Installed)
1. User clicks ticket link in email
2. **Opens directly in mobile app** (via universal links)
3. Shows ticket in native app interface
4. No web page shown

### What Needs to Be Done When App Launches

#### iOS App Configuration
1. Update `TEAM_ID` in `apple-app-site-association` file
2. Add associated domains in Xcode:
   ```
   applinks:wondersofrome.com
   ```
3. Handle deep links in AppDelegate:
   ```swift
   func application(_ application: UIApplication,
                   continue userActivity: NSUserActivity,
                   restorationHandler: @escaping ([UIUserActivityRestoring]?) -> Void) -> Bool {
       guard let url = userActivity.webpageURL else { return false }
       if url.path.hasPrefix("/ticket/") {
           let ticketId = url.lastPathComponent
           openTicket(ticketId: ticketId)
           return true
       }
       return false
   }
   ```

#### Android App Configuration
1. Update SHA256 fingerprint in `assetlinks.json`
2. Add intent filter in AndroidManifest.xml:
   ```xml
   <intent-filter android:autoVerify="true">
       <action android:name="android.intent.action.VIEW" />
       <category android:name="android.intent.category.DEFAULT" />
       <category android:name="android.intent.category.BROWSABLE" />
       <data android:scheme="https"
             android:host="wondersofrome.com"
             android:pathPrefix="/ticket/" />
   </intent-filter>
   ```
3. Handle deep links in MainActivity:
   ```kotlin
   override fun onCreate(savedInstanceState: Bundle?) {
       super.onCreate(savedInstanceState)
       intent?.data?.let { uri ->
           if (uri.path?.startsWith("/ticket/") == true) {
               val ticketId = uri.lastPathSegment
               openTicket(ticketId)
           }
       }
   }
   ```

#### App Store/Play Store URLs
Update in `src/components/AppDownloadPrompt.tsx`:
```typescript
// Replace these URLs when app is published
const iosAppUrl = 'https://apps.apple.com/app/wonders-of-rome/id123456789';
const androidAppUrl = 'https://play.google.com/store/apps/details?id=com.wondersofrome.app';
```

---

## 🧪 Testing

### Test Ticket Viewing

1. **Create a test booking:**
   - Go to wondersofrome.com
   - Book any tour
   - Complete payment
   - Note the booking reference from confirmation email

2. **View ticket in browser:**
   ```
   https://wondersofrome.com/ticket/{BOOKING_REF}
   ```

3. **Test API endpoints:**
   ```bash
   # Get ticket as JSON
   curl https://wondersofrome.com/api/tickets/{BOOKING_REF}?format=json
   
   # Download ticket as PDF
   curl https://wondersofrome.com/api/tickets/{BOOKING_REF}?format=pdf -o ticket.pdf
   ```

4. **Test on mobile:**
   - Open ticket link on iPhone/Android
   - Should see app download banner
   - Should see full ticket details
   - Should be able to download PDF
   - Should be able to add to calendar

### Test Email Link

1. Check confirmation email after booking
2. Click "View My Ticket" button
3. Should open ticket page with `?source=email` parameter
4. Verify all ticket details are correct

---

## 🔒 Security Considerations

### Ticket Access
- Tickets are accessible by booking reference (like airline tickets)
- No authentication required (by design - customers need easy access)
- Booking references are 8-character random strings (high entropy)
- Pages are marked `noindex` to prevent search engine indexing

### Rate Limiting
- Consider adding rate limiting to `/api/tickets/[id]` endpoint
- Prevent brute force attempts to guess booking references
- Recommended: 10 requests per minute per IP

### Data Privacy
- Ticket pages include `robots: 'noindex, nofollow'` meta tag
- No sensitive payment information displayed
- Only shows: tour details, date, time, guest count, meeting point

---

## 📊 Analytics Tracking

Add tracking to monitor ticket views:

```typescript
// In ticket page
gtag('event', 'ticket_view', {
  ticket_id: ticketId,
  source: searchParams.get('source'), // email, sms, direct
  platform: isMobile ? 'mobile' : 'desktop',
});

// Track app download clicks
gtag('event', 'app_download_click', {
  source: 'ticket_page',
  platform: platform, // ios or android
});
```

---

## 🚀 Deployment Checklist

- [x] Ticket service created
- [x] Ticket display component created
- [x] App download prompt created
- [x] Ticket page route created
- [x] API endpoint updated
- [x] Email template updated with ticket link
- [x] Universal links configuration files created
- [x] Build successful (no errors)
- [ ] Deploy to production
- [ ] Test with real booking
- [ ] Verify email contains ticket link
- [ ] Test ticket viewing on mobile
- [ ] Monitor error logs for any issues

---

## 🎨 Design Features

### Ticket Display
- **Header**: Gradient background with Wonders of Rome branding
- **Booking Reference**: Large, prominent display
- **Tour Details**: Grid layout with icons (calendar, clock, users, location)
- **QR Code**: Centered, large, scannable at meeting point
- **Guest Info**: Shows lead guest name and email
- **Actions**: Download PDF, Add to Calendar buttons
- **Important Info**: Yellow alert box with key reminders
- **Support**: Contact information with phone and WhatsApp links

### Mobile Optimizations
- Responsive grid (1 column on mobile, 2 on desktop)
- Touch-friendly buttons (min 44px height)
- App download banner (dismissible)
- Print-friendly CSS (hides buttons when printing)

---

## 🔄 Future Enhancements

### Phase 2 (When App Launches)
- [ ] Update App Store/Play Store URLs
- [ ] Configure universal links in mobile apps
- [ ] Test deep linking from email to app
- [ ] Add app installation detection
- [ ] Implement offline ticket viewing in app

### Phase 3 (Advanced Features)
- [ ] SMS ticket links (via Twilio)
- [ ] WhatsApp ticket sharing
- [ ] Wallet integration (Apple Wallet, Google Pay)
- [ ] Push notifications (24h before tour)
- [ ] Real-time tour updates
- [ ] In-app chat with guide
- [ ] Post-tour review prompts

---

## 📝 Environment Variables

Required environment variables (already configured):

```env
# Payload CMS
PAYLOAD_API_URL=https://admin.wondersofrome.com
PAYLOAD_API_EMAIL=superadmin@romeagency.com
PAYLOAD_API_PASSWORD=SuperAdmin2025!

# Site Configuration
NEXT_PUBLIC_SITE_ID=wondersofrome
NEXT_PUBLIC_SITE_URL=https://wondersofrome.com

# Support Contact
NEXT_PUBLIC_SUPPORT_PHONE=+39 351 419 9425
NEXT_PUBLIC_WHATSAPP_NUMBER=+393514199425

# Email Service
RESEND_API_KEY=re_...
EMAIL_FROM=info@wondersofrome.com
ADMIN_EMAIL=admin@wondersofrome.com
```

---

## 🐛 Troubleshooting

### Ticket Not Found
**Problem**: 404 error when accessing ticket URL  
**Solution**: 
- Verify booking exists in Payload CMS
- Check booking reference is correct
- Ensure Payload API credentials are valid

### QR Code Not Generating
**Problem**: Ticket displays without QR code  
**Solution**:
- Check `qrcode` package is installed
- Verify QR code generation in `ticketService.ts`
- Check browser console for errors

### Email Link Not Working
**Problem**: Ticket link in email doesn't work  
**Solution**:
- Verify `NEXT_PUBLIC_SITE_URL` is set correctly
- Check email template includes `ticketUrl` variable
- Test link manually in browser

### App Download Banner Not Showing
**Problem**: Banner doesn't appear on mobile  
**Solution**:
- Check user agent detection in `AppDownloadPrompt.tsx`
- Verify component is imported in ticket page
- Test on actual mobile device (not desktop browser)

---

## 📞 Support

For issues or questions:
- **Technical**: Check Payload CMS logs at `https://admin.wondersofrome.com/admin`
- **Email**: admin@wondersofrome.com
- **Phone**: +39 351 419 9425

---

## ✅ Success Metrics

Track these metrics to measure success:

1. **Ticket View Rate**: % of bookings where ticket is viewed
2. **Email Click-Through Rate**: % of customers who click "View My Ticket"
3. **App Download Rate**: % of mobile users who click app download
4. **PDF Download Rate**: % of users who download PDF
5. **Calendar Add Rate**: % of users who add to calendar

**Target Goals:**
- Ticket view rate: >60%
- Email CTR: >40%
- App download rate: >15% (when app launches)

---

## 🎉 Summary

**Phase 1 is complete and ready for production!**

✅ Customers can now view their tickets online  
✅ Email confirmation includes ticket link  
✅ Mobile-friendly ticket display  
✅ QR code generation for easy check-in  
✅ PDF download and calendar integration  
✅ App download prompts for future app users  
✅ Universal links configured for seamless app integration  

**Next Steps:**
1. Deploy to production
2. Test with real bookings
3. Monitor analytics
4. Prepare for mobile app launch (Phase 2)

---

**Implementation Date:** May 19, 2026  
**Build Status:** ✅ Successful  
**Ready for Production:** Yes
