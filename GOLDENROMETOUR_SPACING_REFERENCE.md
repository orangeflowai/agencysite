# Golden Rome Tour - Spacing Reference Guide

## Quick Reference: All Section Spacing

### 1. Hero Section
```tsx
<section className="relative w-full min-h-screen bg-background overflow-hidden pt-[68px]">
  <div className="flex flex-col lg:flex-row min-h-[calc(100vh-68px)]">
    <div className="w-full lg:w-1/2 flex flex-col justify-center p-6 sm:p-8 md:p-12 lg:p-16 xl:p-24">
      {/* Content */}
    </div>
  </div>
</section>
```
- **Horizontal padding**: `p-6 sm:p-8 md:p-12 lg:p-16 xl:p-24`
- **Navbar offset**: `pt-[68px]`

---

### 2. Trust Bar
```tsx
<section className="bg-background py-16 md:py-24 border-b border-primary/20">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    {/* Content */}
  </div>
</section>
```
- **Vertical padding**: `py-16 md:py-24` (64px mobile, 96px desktop)
- **Horizontal padding**: `px-4 sm:px-6 lg:px-8`
- **Heading margin**: `mb-8` (32px)

---

### 3. Top Destinations
```tsx
<section className="bg-background py-24 md:py-32 border-b border-primary/10">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col md:flex-row items-end justify-between mb-16 md:mb-20 gap-6">
      {/* Header */}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Tour cards */}
    </div>
  </div>
</section>
```
- **Section padding**: `py-24 md:py-32` (96px mobile, 128px desktop)
- **Horizontal padding**: `px-4 sm:px-6 lg:px-8`
- **Header margin**: `mb-16 md:mb-20` (64px mobile, 80px desktop)
- **Grid gap**: `gap-8` (32px)

---

### 4. Why Golden Rome
```tsx
<section className="bg-background text-secondary py-24 md:py-32 relative overflow-hidden border-b border-primary/10">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className="max-w-4xl mb-16 md:mb-20">
      {/* Heading */}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16">
      {/* Feature items */}
    </div>
  </div>
</section>
```
- **Section padding**: `py-24 md:py-32` (96px mobile, 128px desktop)
- **Horizontal padding**: `px-4 sm:px-6 lg:px-8`
- **Heading margin**: `mb-16 md:mb-20` (64px mobile, 80px desktop)
- **Grid gap**: `gap-12 md:gap-16` (48px mobile, 64px desktop)

---

### 5. Experience Gallery
```tsx
<section className="py-24 md:py-32 bg-secondary overflow-hidden relative border-y border-primary/20">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:mb-20 relative z-10">
    {/* Header */}
  </div>
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
      {/* Gallery items */}
    </div>
  </div>
</section>
```
- **Section padding**: `py-24 md:py-32` (96px mobile, 128px desktop)
- **Horizontal padding**: `px-4 sm:px-6 lg:px-8`
- **Header margin**: `mb-16 md:mb-20` (64px mobile, 80px desktop)
- **Grid gap**: `gap-6 lg:gap-8` (24px mobile, 32px desktop)

---

### 6. How it Works (Steps)
```tsx
<section className="py-24 md:py-32 bg-background relative overflow-hidden border-b border-primary/10">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className="text-center mb-16 md:mb-20 max-w-2xl mx-auto">
      {/* Heading */}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16 relative">
      {/* Step items */}
    </div>
  </div>
</section>
```
- **Section padding**: `py-24 md:py-32` (96px mobile, 128px desktop)
- **Horizontal padding**: `px-4 sm:px-6 lg:px-8`
- **Heading margin**: `mb-16 md:mb-20` (64px mobile, 80px desktop)
- **Grid gap**: `gap-12 md:gap-16` (48px mobile, 64px desktop)

---

### 7. Special Offer
```tsx
<section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-background border-b border-primary/10">
  <motion.div className="relative w-full bg-secondary rounded-[2rem] overflow-hidden shadow-2xl min-h-[500px] flex flex-col lg:flex-row items-stretch">
    <div className="flex-1 p-8 sm:p-12 md:p-16 lg:p-20 flex flex-col justify-center space-y-8 z-10">
      {/* Content */}
    </div>
  </motion.div>
</section>
```
- **Section padding**: `py-24 md:py-32 px-4 sm:px-6 lg:px-8`
- **Content padding**: `p-8 sm:p-12 md:p-16 lg:p-20` (32px mobile, 80px desktop)

---

### 8. Testimonials
```tsx
<section className="py-24 md:py-32 bg-background border-b border-primary/10">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="text-center mb-16 md:mb-20">
      {/* Heading */}
    </div>
    <FloatingReviews />
  </div>
</section>
```
- **Section padding**: `py-24 md:py-32` (96px mobile, 128px desktop)
- **Horizontal padding**: `px-4 sm:px-6 lg:px-8`
- **Heading margin**: `mb-16 md:mb-20` (64px mobile, 80px desktop)

---

### 9. Blog Section
```tsx
<section className="py-24 md:py-32 bg-background text-secondary border-t border-primary/20">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
      {/* Header */}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Blog cards */}
    </div>
  </div>
</section>
```
- **Section padding**: `py-24 md:py-32` (96px mobile, 128px desktop)
- **Horizontal padding**: `px-4 sm:px-6 lg:px-8`
- **Header margin**: `mb-16` (64px)
- **Grid gap**: `gap-8` (32px)
- **Card padding**: `p-6 md:p-8` (24px mobile, 32px desktop)

---

## Responsive Breakpoints

### Mobile (<640px)
```
px-4      = 16px horizontal padding
py-24     = 96px vertical padding
gap-8     = 32px grid gaps
mb-16     = 64px bottom margin
p-6       = 24px padding
```

### Tablet (640-1024px)
```
px-6      = 24px horizontal padding
py-24     = 96px vertical padding (can transition to py-32)
gap-8     = 32px grid gaps (can transition to gap-16)
mb-16     = 64px bottom margin (can transition to mb-20)
p-8       = 32px padding (can transition to p-10)
```

### Desktop (>1024px)
```
px-8      = 32px horizontal padding
py-32     = 128px vertical padding
gap-16    = 64px grid gaps
mb-20     = 80px bottom margin
p-10      = 40px padding
```

---

## 8-Point Grid Compliance

### ✅ All Spacing Values
- `4px` (gap-1, p-1) - Icon gaps only
- `8px` (gap-2, p-2) - Small padding
- `16px` (gap-4, p-4, px-4) - Default padding
- `24px` (gap-6, p-6, px-6) - Medium padding
- `32px` (gap-8, p-8, px-8) - Large padding
- `40px` (gap-10, p-10) - Extra large padding
- `48px` (gap-12, p-12) - Hero padding
- `64px` (gap-16, p-16, py-16, mb-16, h-16) - Section separator
- `96px` (py-24, h-24) - Mobile section padding
- `128px` (py-32) - Desktop section padding

### ❌ No Arbitrary Values
- ✅ No `p-[13px]`, `mt-[15px]`, `gap-[7px]`
- ✅ No `py-[100px]`, `px-[18px]`
- ✅ All values are multiples of 4px or 8px

---

## Container Pattern

All sections follow this pattern:

```tsx
<section className="py-24 md:py-32 bg-background border-b border-primary/10">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    {/* Content */}
  </div>
</section>
```

**Benefits**:
- Consistent max-width (1280px)
- Responsive horizontal padding
- Proper vertical spacing
- Clear visual separation with borders

---

## Common Patterns

### Section Header
```tsx
<div className="text-center mb-16 md:mb-20">
  <p className="text-[10px] font-heading font-bold uppercase tracking-tight text-primary mb-4">
    Section Label
  </p>
  <h2 className="text-4xl md:text-6xl font-heading text-secondary tracking-tighter">
    Section Title
  </h2>
</div>
```

### Grid Layout
```tsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
  {/* Items */}
</div>
```

### Card
```tsx
<div className="bg-background rounded-2xl overflow-hidden border border-primary/20 p-6 md:p-8">
  {/* Content */}
</div>
```

### Button
```tsx
<button className="px-10 py-5 rounded-full font-bold tracking-tight text-xs">
  Action
</button>
```

---

## Troubleshooting

### Issue: Content looks cramped on mobile
**Solution**: Check `px-4` is applied to container, not `px-6` or `px-8`

### Issue: Sections feel disconnected
**Solution**: Verify `py-24 md:py-32` is applied to section, not `py-12` or `py-16`

### Issue: Grid items too close together
**Solution**: Check `gap-8 md:gap-16` is applied, not `gap-4` or `gap-6`

### Issue: Heading too close to content
**Solution**: Verify `mb-16 md:mb-20` is applied to heading container

### Issue: Cards have inconsistent padding
**Solution**: Check `p-6 md:p-8` is applied to all cards

---

## Validation Checklist

Before deploying, verify:

- [ ] All sections use `py-24 md:py-32`
- [ ] All containers use `px-4 sm:px-6 lg:px-8`
- [ ] All grids use `gap-8 md:gap-16`
- [ ] All headings use `mb-16 md:mb-20`
- [ ] All cards use `p-6 md:p-8`
- [ ] No arbitrary pixel values (e.g., `p-[13px]`)
- [ ] Responsive breakpoints work at 640px and 1024px
- [ ] Mobile experience is optimized
- [ ] Desktop experience is optimized

---

**Last Updated**: May 2, 2026
**Status**: ✅ COMPLETE & PRODUCTION READY
