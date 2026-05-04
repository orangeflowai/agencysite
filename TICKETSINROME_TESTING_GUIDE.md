# TicketsInRome UI Migration - Testing Guide

**Date**: May 4, 2026  
**Status**: Ready for Testing  
**Dev Server**: http://localhost:3000

---

## Quick Start

### 1. Start Dev Server
```bash
cd /home/abiilesh/travelwebsite/ticketsinrome-copy/ticketsinrome
npm run dev
# Server will start on http://localhost:3000
```

### 2. Access Homepage
```
http://localhost:3000
```

### 3. Test API Endpoint
```bash
# Get featured tours
curl "http://localhost:3000/api/tours?featured=true&limit=6"

# Get all tours
curl "http://localhost:3000/api/tours?limit=10"

# Get tours for specific site
curl "http://localhost:3000/api/tours?site=ticketsinrome&limit=6"
```

---

## Testing Checklist

### Phase 1: Homepage Verification

#### Visual Elements
- [ ] Header displays correctly
- [ ] Navigation menu visible
- [ ] Logo/branding present
- [ ] Hero section displays
- [ ] All sections render without overlapping
- [ ] Footer displays correctly
- [ ] Responsive design works on mobile/tablet/desktop

#### Content
- [ ] All text is readable
- [ ] Images load correctly
- [ ] No broken links
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Page loads in < 5 seconds

#### Sections to Verify
1. [ ] Header/Navigation
2. [ ] Hero Section
3. [ ] Philosophy Section
4. [ ] Featured Products Section
5. [ ] Technology Section
6. [ ] Gallery Section
7. [ ] Collection Section
8. [ ] Testimonials Section
9. [ ] Editorial Section
10. [ ] Footer Section

---

### Phase 2: API Integration Testing

#### Tours API Endpoint
```bash
# Test 1: Featured tours
curl -s "http://localhost:3000/api/tours?featured=true&limit=6" | jq .

# Expected: JSON array of tours (may be empty if no featured tours)
# Status: 200 OK
```

#### Response Validation
- [ ] API returns valid JSON
- [ ] Response includes tour objects
- [ ] Each tour has: id, title, price, mainImage
- [ ] Response time < 200ms
- [ ] No error messages

#### Error Handling
- [ ] Invalid parameters handled gracefully
- [ ] Missing API key handled
- [ ] Network timeout handled
- [ ] 500 errors return proper error message

---

### Phase 3: Booking Flow Testing

#### Booking Widget
- [ ] "Book Now" button visible
- [ ] Clicking button opens booking modal
- [ ] Modal displays correctly
- [ ] Modal can be closed

#### Checkout Flow
- [ ] Contact form displays
- [ ] Form validation works
- [ ] Stripe payment element loads
- [ ] Payment processing works
- [ ] Success confirmation displays
- [ ] Email confirmation sent

#### Cart Functionality
- [ ] Add to cart works
- [ ] Cart dropdown displays
- [ ] Remove from cart works
- [ ] Cart total calculates correctly

---

### Phase 4: Admin Dashboard Testing

#### Admin Access
- [ ] Admin link visible in header
- [ ] Admin login page loads
- [ ] Login with credentials works
- [ ] Dashboard displays

#### Admin Features
- [ ] Tours management page loads
- [ ] Can view all tours
- [ ] Can create new tour
- [ ] Can edit existing tour
- [ ] Can delete tour
- [ ] Can manage bookings
- [ ] Can view analytics

---

### Phase 5: Payment Processing Testing

#### Stripe Integration
- [ ] Stripe key configured correctly
- [ ] Payment element loads
- [ ] Test card accepted: 4242 4242 4242 4242
- [ ] Invalid card rejected
- [ ] Payment webhook received
- [ ] Order created in database

#### Payment Confirmation
- [ ] Success page displays
- [ ] Confirmation email sent
- [ ] Order appears in admin dashboard
- [ ] Booking appears in user account

---

### Phase 6: Email Notifications Testing

#### Email Service
- [ ] Resend API configured
- [ ] Booking confirmation email sent
- [ ] Email contains correct details
- [ ] Email formatting looks good
- [ ] Links in email work

#### Email Templates
- [ ] Booking confirmation template
- [ ] Payment receipt template
- [ ] Cancellation template
- [ ] Admin notification template

---

### Phase 7: Responsive Design Testing

#### Mobile (< 640px)
- [ ] Header responsive
- [ ] Navigation menu works
- [ ] Hero section displays
- [ ] Cards stack vertically
- [ ] Images scale properly
- [ ] Text readable
- [ ] Buttons clickable

#### Tablet (640px - 1024px)
- [ ] Layout adjusts for tablet
- [ ] Cards display in 2 columns
- [ ] Navigation works
- [ ] Images display correctly

#### Desktop (> 1024px)
- [ ] Full layout displays
- [ ] Cards display in 3 columns
- [ ] Hover effects work
- [ ] Animations smooth

---

### Phase 8: Performance Testing

#### Load Time
- [ ] Homepage loads in < 3 seconds
- [ ] API responds in < 200ms
- [ ] Images load quickly
- [ ] No layout shift

#### Browser DevTools
- [ ] Lighthouse score > 80
- [ ] No console errors
- [ ] No console warnings
- [ ] Network requests optimized

#### Lighthouse Audit
```bash
# Run Lighthouse audit
# Open DevTools → Lighthouse → Generate report
```

---

### Phase 9: Cross-Browser Testing

#### Chrome
- [ ] Homepage loads
- [ ] All features work
- [ ] No console errors

#### Firefox
- [ ] Homepage loads
- [ ] All features work
- [ ] No console errors

#### Safari
- [ ] Homepage loads
- [ ] All features work
- [ ] No console errors

#### Edge
- [ ] Homepage loads
- [ ] All features work
- [ ] No console errors

---

### Phase 10: Accessibility Testing

#### WCAG Compliance
- [ ] All images have alt text
- [ ] Color contrast sufficient
- [ ] Keyboard navigation works
- [ ] Screen reader compatible
- [ ] Form labels present
- [ ] Error messages clear

#### Accessibility Tools
```bash
# Use axe DevTools browser extension
# Use WAVE browser extension
# Use Lighthouse accessibility audit
```

---

## Manual Testing Scenarios

### Scenario 1: Browse Tours
1. Open http://localhost:3000
2. Scroll through homepage
3. View featured products section
4. Click on tour card
5. Verify tour details page loads

### Scenario 2: Book a Tour
1. Click "Book Now" button
2. Select tour
3. Enter contact details
4. Proceed to payment
5. Enter test card: 4242 4242 4242 4242
6. Complete payment
7. Verify confirmation page
8. Check email for confirmation

### Scenario 3: Admin Management
1. Click admin link
2. Login with credentials
3. View tours list
4. Create new tour
5. Edit tour details
6. View bookings
7. Process booking

### Scenario 4: Search Tours
1. Use search functionality
2. Enter search term
3. Verify results display
4. Click on result
5. Verify tour details

### Scenario 5: Mobile Experience
1. Open on mobile device
2. Verify responsive layout
3. Test navigation menu
4. Test booking flow
5. Test payment on mobile

---

## Automated Testing

### Unit Tests
```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Integration Tests
```bash
# Run integration tests
npm run test:integration

# Run specific test file
npm run test -- tours.test.ts
```

### E2E Tests
```bash
# Run end-to-end tests
npm run test:e2e

# Run specific E2E test
npm run test:e2e -- booking.spec.ts
```

---

## Bug Reporting Template

### Bug Report
```
Title: [Brief description of bug]

Environment:
- Browser: [Chrome/Firefox/Safari/Edge]
- OS: [Windows/Mac/Linux]
- Device: [Desktop/Tablet/Mobile]
- URL: [http://localhost:3000/...]

Steps to Reproduce:
1. [First step]
2. [Second step]
3. [Third step]

Expected Result:
[What should happen]

Actual Result:
[What actually happened]

Screenshots:
[Attach screenshot if applicable]

Console Errors:
[Paste any console errors]

Additional Notes:
[Any other relevant information]
```

---

## Performance Benchmarks

### Target Metrics
| Metric | Target | Current |
|--------|--------|---------|
| Homepage Load | < 3s | TBD |
| API Response | < 200ms | ~100-200ms |
| Lighthouse Score | > 80 | TBD |
| Core Web Vitals | Good | TBD |
| Time to Interactive | < 5s | TBD |

### Monitoring
```bash
# Monitor performance in DevTools
# Open DevTools → Performance tab
# Record page load
# Analyze results
```

---

## Deployment Verification

### Pre-Deployment
- [ ] All tests passing
- [ ] No console errors
- [ ] No TypeScript errors
- [ ] Build successful
- [ ] Performance acceptable

### Post-Deployment
- [ ] Homepage loads on production
- [ ] API endpoints working
- [ ] Booking flow working
- [ ] Payment processing working
- [ ] Email notifications working
- [ ] Admin dashboard accessible

---

## Rollback Procedure

If critical issues found:

```bash
# Stop current deployment
# Restore from backup
BACKUP_DIR=$(ls -td /home/abiilesh/travelwebsite/ticketsinrome-backup-* | head -1)
rm -rf /home/abiilesh/travelwebsite/ticketsinrome-copy/ticketsinrome
cp -r "$BACKUP_DIR" /home/abiilesh/travelwebsite/ticketsinrome-copy/ticketsinrome

# Or revert git commit
git revert HEAD
git push origin main
```

---

## Support & Troubleshooting

### Common Issues

#### Issue: Dev server won't start
```bash
# Clear cache and reinstall
rm -rf .next node_modules
npm install
npm run dev
```

#### Issue: API returns 404
```bash
# Check if API route exists
ls -la app/api/tours/route.ts

# Check environment variables
echo $PAYLOAD_API_URL
echo $PAYLOAD_API_KEY
```

#### Issue: Styles not loading
```bash
# Rebuild Tailwind CSS
npm run build

# Clear browser cache
# Hard refresh: Ctrl+Shift+R (Windows/Linux) or Cmd+Shift+R (Mac)
```

#### Issue: Images not loading
```bash
# Check image paths
# Verify images exist in public/ directory
# Check next.config.ts for image domains
```

---

## Testing Timeline

### Day 1: Basic Verification
- [ ] Homepage loads
- [ ] API endpoints working
- [ ] No console errors
- [ ] Responsive design works

### Day 2: Feature Testing
- [ ] Booking flow works
- [ ] Payment processing works
- [ ] Admin dashboard works
- [ ] Email notifications work

### Day 3: Performance & Accessibility
- [ ] Performance metrics acceptable
- [ ] Accessibility compliant
- [ ] Cross-browser compatible
- [ ] Mobile experience good

### Day 4: Final QA
- [ ] All tests passing
- [ ] No critical bugs
- [ ] Documentation complete
- [ ] Ready for deployment

---

## Sign-Off

### Testing Completed By
- Name: _______________
- Date: _______________
- Status: _______________

### Approved By
- Name: _______________
- Date: _______________
- Status: _______________

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com/docs)
- [Payload CMS Documentation](https://payloadcms.com/docs)
- [Stripe Documentation](https://stripe.com/docs)

---

**Testing Guide Created**: May 4, 2026  
**Last Updated**: May 4, 2026  
**Status**: Ready for Testing ✅
