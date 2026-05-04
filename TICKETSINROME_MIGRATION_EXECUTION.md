# TicketsInRome UI Migration - Execution Log

**Start Date**: May 4, 2026  
**Status**: IN PROGRESS  
**Target**: Replace UI with modern design + sync backend

---

## Phase 1: Backup & Preparation

### Step 1.1: Create Backup
```bash
BACKUP_DIR="/home/abiilesh/travelwebsite/ticketsinrome-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r /home/abiilesh/travelwebsite/ticketsinrome-copy/ticketsinrome/* "$BACKUP_DIR/"
echo "✅ Backup created at: $BACKUP_DIR"
```

**Status**: ⏳ PENDING

### Step 1.2: Verify Current Structure
```bash
# Check current ticketsinrome structure
ls -la /home/abiilesh/travelwebsite/ticketsinrome-copy/ticketsinrome/
```

**Status**: ⏳ PENDING

---

## Phase 2: Copy New UI Structure

### Step 2.1: Remove Old UI Files
```bash
cd /home/abiilesh/travelwebsite/ticketsinrome-copy/ticketsinrome

# Remove old UI (keep src/lib, src/context, src/app/api)
rm -rf app/
rm -rf components/
rm -rf styles/
rm -rf public/images/
rm -rf hooks/
```

**Status**: ⏳ PENDING

### Step 2.2: Copy New UI Files
```bash
# Copy new UI structure
cp -r /home/abiilesh/travelwebsite/ticketsinrome-copy/tickets_in_rome/app ./
cp -r /home/abiilesh/travelwebsite/ticketsinrome-copy/tickets_in_rome/components ./
cp -r /home/abiilesh/travelwebsite/ticketsinrome-copy/tickets_in_rome/styles ./
cp -r /home/abiilesh/travelwebsite/ticketsinrome-copy/tickets_in_rome/public ./
cp -r /home/abiilesh/travelwebsite/ticketsinrome-copy/tickets_in_rome/hooks ./
cp -r /home/abiilesh/travelwebsite/ticketsinrome-copy/tickets_in_rome/lib ./
```

**Status**: ⏳ PENDING

---

## Phase 3: Merge Dependencies

### Step 3.1: Update package.json
- Merge new UI dependencies with existing backend dependencies
- Keep all Payload, Sanity, Supabase, Stripe packages
- Add Radix UI, Tailwind v4, React Hook Form, Zod

**Status**: ⏳ PENDING

### Step 3.2: Install Dependencies
```bash
npm install
```

**Status**: ⏳ PENDING

---

## Phase 4: Update Configuration

### Step 4.1: Update tailwind.config.ts
- Upgrade to Tailwind CSS v4 syntax
- Keep existing color variables
- Add 8pt grid spacing

**Status**: ⏳ PENDING

### Step 4.2: Update next.config.ts
- Keep existing image domains
- Ensure Payload, Sanity, Supabase URLs are allowed

**Status**: ⏳ PENDING

### Step 4.3: Update postcss.config.mjs
- Update for Tailwind v4

**Status**: ⏳ PENDING

---

## Phase 5: Backend Integration

### Step 5.1: Create Backend Adapter
- File: `src/lib/backendAdapter.ts`
- Functions: getTours(), getFeaturedTours(), getTourBySlug()

**Status**: ⏳ PENDING

### Step 5.2: Create API Route
- File: `src/app/api/tours/route.ts`
- Endpoint: GET /api/tours?featured=true&limit=6

**Status**: ⏳ PENDING

### Step 5.3: Update Featured Products Section
- Connect to backend API
- Display tours from Payload CMS
- Show images, prices, ratings

**Status**: ⏳ PENDING

---

## Phase 6: Integrate Booking Flow

### Step 6.1: Copy Booking Components
- BookingWidget.tsx
- CheckoutDrawer.tsx
- CartDropdown.tsx

**Status**: ⏳ PENDING

### Step 6.2: Update Header
- Add navigation links
- Add cart dropdown
- Add admin link

**Status**: ⏳ PENDING

### Step 6.3: Update Footer
- Add contact info
- Add social links
- Add legal pages

**Status**: ⏳ PENDING

---

## Phase 7: Testing

### Step 7.1: Build Project
```bash
npm run build
```

**Status**: ⏳ PENDING

### Step 7.2: Run Development Server
```bash
npm run dev
```

**Status**: ⏳ PENDING

### Step 7.3: Test Homepage
- [ ] All sections render
- [ ] Featured products load
- [ ] Images display
- [ ] Responsive design works
- [ ] No console errors

**Status**: ⏳ PENDING

### Step 7.4: Test Booking Flow
- [ ] "Book Now" buttons work
- [ ] CheckoutDrawer opens
- [ ] Contact form displays
- [ ] Stripe payment loads
- [ ] Payment processes

**Status**: ⏳ PENDING

### Step 7.5: Test Backend Integration
- [ ] Tours load from Payload CMS
- [ ] API endpoint works
- [ ] Data displays correctly
- [ ] Images load from CDN

**Status**: ⏳ PENDING

---

## Phase 8: Deployment

### Step 8.1: Commit Changes
```bash
git add .
git commit -m "feat: replace ticketsinrome UI with modern design"
```

**Status**: ⏳ PENDING

### Step 8.2: Push to Main
```bash
git push origin main
```

**Status**: ⏳ PENDING

### Step 8.3: Monitor Deployment
- Check Vercel build logs
- Test live site
- Monitor error logs

**Status**: ⏳ PENDING

---

## Summary

**Total Phases**: 8  
**Estimated Duration**: 4-6 hours  
**Current Status**: Ready to begin  
**Risk Level**: Low (with backup)  

**Next Action**: Begin Phase 1 - Backup & Preparation

