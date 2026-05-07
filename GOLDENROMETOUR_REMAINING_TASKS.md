# 🎯 Golden Rome Tour - Remaining Tasks

## ✅ Completed
- [x] Fix duplicate keys error in navigation
- [x] Update navigation to Vatican-only links
- [x] Change logo to "Vatican Archives"
- [x] Remove "Ancient Rome" from navigation

## 🔄 In Progress

### 1. Category Routes (HIGH PRIORITY)
- [ ] Fix `/category/vatican` route
- [ ] Remove `/category/colosseum` route
- [ ] Remove `/category/city` route
- [ ] Remove `/category/hidden-gems` route

### 2. Tour Pages (HIGH PRIORITY)
- [ ] Fix St. Peter's tour links (currently broken)
- [ ] Verify all Vatican tour pages load

### 3. Content Pages
- [ ] Remove "About Us" page
- [ ] Update Contact page with goldenrometour info (not hardcoded)
- [ ] Fix contact form button text ("contact.btn.submit" → "Send Message")

### 4. Footer Updates
- [ ] Replace "Support" → "Vatican Support"
- [ ] Replace "Our Ethos" → "Our Vatican Mission"
- [ ] Replace "The Compendium" → "Vatican Guide"
- [ ] Replace "Roman Journal" → Remove (blog section)
- [ ] Replace "Terms of Protocol" → "Terms & Conditions"
- [ ] Replace "Privacy Mandate" → "Privacy Policy"
- [ ] Update footer logo to "Vatican Archives"
- [ ] Update contact info from site data (not hardcoded)

### 5. Homepage Updates
- [ ] Remove blog section
- [ ] Add "How to Book" section instead
- [ ] Remove TripAdvisor/Google/Viator badges (if present)
- [ ] Change "Colosseum Access" → "Vatican Access" (already done in hero)

### 6. FAQ Section
- [ ] Rewrite all FAQs with Vatican-specific content
- [ ] Remove generic Rome FAQs
- [ ] Add Vatican entry requirements
- [ ] Add Vatican dress code
- [ ] Add Vatican booking process

### 7. Animations & UX
- [ ] Add parallax to every section
- [ ] Add text animations everywhere
- [ ] Improve scroll animations
- [ ] Add fade-in animations for content

### 8. Technical Fixes
- [ ] Fix Stripe cookie warnings (third-party cookies)
- [ ] Fix Google Translate CORS warnings
- [ ] Optimize images
- [ ] Add loading states

---

## 📋 Detailed Task Breakdown

### Task 1: Fix Category Routes
**Files to update:**
- `src/app/category/[slug]/page.tsx`
- Remove non-Vatican category handling

### Task 2: Update Contact Page
**File:** `src/app/contact/page.tsx`
**Changes:**
- Use `site.contactEmail` instead of hardcoded
- Use `site.contactPhone` instead of hardcoded
- Fix button text translation key

### Task 3: Remove About Page
**Action:** Delete or redirect `/about` route

### Task 4: Update Footer
**File:** `src/components/vatican/footer.tsx`
**Changes:**
- Update all link labels
- Use site data for contact info
- Update logo text

### Task 5: Rewrite FAQs
**File:** `src/components/vatican/faq-section.tsx`
**New FAQs:**
1. What is included in Vatican Museums tour?
2. How do I skip the line at the Vatican?
3. What is the Vatican dress code?
4. Can I visit the Sistine Chapel?
5. How long does a Vatican tour take?
6. Are Vatican tours wheelchair accessible?
7. Can I take photos in the Vatican?
8. What time should I arrive?

### Task 6: Add "How to Book" Section
**New component:** `src/components/vatican/how-to-book.tsx`
**Content:**
1. Choose your Vatican experience
2. Select date and time
3. Complete secure booking
4. Receive instant confirmation

### Task 7: Add Animations
**Files to update:**
- All Vatican components
- Add framer-motion animations
- Add scroll-triggered animations
- Add parallax effects

---

## 🚀 Priority Order

### Phase 1 (Critical - Do First):
1. Fix category routes
2. Fix St. Peter's tour links
3. Update contact page
4. Fix button text

### Phase 2 (Important):
5. Update footer content
6. Rewrite FAQs
7. Remove blog section
8. Add "How to Book" section

### Phase 3 (Enhancement):
9. Add animations
10. Add parallax effects
11. Optimize performance

---

## 📝 Notes

- All changes should use environment variables or site data
- No hardcoded content
- All text should be Vatican-specific
- Remove all non-Vatican references
- Maintain design consistency

---

## ✅ Testing Checklist

After completing tasks:
- [ ] All Vatican tours load correctly
- [ ] Navigation works (no 404s)
- [ ] Contact form submits
- [ ] Footer links work
- [ ] FAQs are Vatican-specific
- [ ] No console errors
- [ ] Animations work smoothly
- [ ] Mobile responsive
- [ ] Images load correctly
- [ ] No hardcoded content

---

**Status:** 4/50 tasks completed (8%)
**Next:** Fix category routes and St. Peter's links
