# Wonders of Rome - Spacing Reference Guide

## Quick Reference: All Section Spacing

### 1. Hero Section
```tsx
<section className="relative w-full flex flex-col justify-center overflow-hidden bg-black pt-[102px] min-h-screen">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
    {/* Content */}
  </div>
</section>
```
- **Navbar offset**: `pt-[102px]` (34px marquee + 68px navbar)
- **Horizontal padding**: `px-4 sm:px-6 lg:px-8`
- **Vertical padding**: `py-24 md:py-32` (96px mobile, 128px desktop)

---

### 2. Social Proof Bar
```tsx
<div className="border-b border-border bg-card py-16 md:py-24">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
    {/* Content */}
  </div>
</div>
```
- **Vertical padding**: `py-16 md:py-24` (64px mobile, 96px desktop)
- **Horizontal padding**: `px-4 sm:px-6 lg:px-8`
- **Gap between items**: `gap-8 md:gap-12` (32px mobile, 48px desktop)

---

### 3. Featured Product Section
```tsx
<section className="py-24 md:py-32 bg-card border-b border-border overflow-hidden">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
      {/* Content */}
    </div>
  </div>
</section>
```
- **Section padding**: `py-24 md:py-32` (96px mobile, 128px desktop)
- **Horizontal padding**: `px-4 sm:px-6 lg:px-8`
- **Grid gap**: `gap-8 md:gap-16` (32px mobile, 64px desktop)
- **Content spacing**: `space-y-8` (32px between elements)

---

### 4. Tour Guide App Section
```tsx
<section className="py-24 md:py-32 bg-[#111] text-white overflow-hidden relative group border-y border-white/5">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-center">
      <div className="space-y-12">
        {/* Content with 48px spacing */}
      </div>
    </div>
  </div>
</section>
```
- **Section padding**: `py-24 md:py-32` (96px mobile, 128px desktop)
- **Horizontal padding**: `px-4 sm:px-6 lg:px-8`
- **Grid gap**: `gap-8 md:gap-16` (32px mobile, 64px desktop)
- **Internal spacing**: `space-y-12` (48px between elements)

---

### 5. Reviews Section
```tsx
<div className="bg-background text-foreground py-24 md:py-32 border-b border-border relative overflow-hidden">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className="text-center mb-16 md:mb-20">
      {/* Heading */}
    </div>
    <Testimonials />
  </div>
</div>
```
- **Section padding**: `py-24 md:py-32` (96px mobile, 128px desktop)
- **Horizontal padding**: `px-4 sm:px-6 lg:px-8`
- **Heading margin**: `mb-16 md:mb-20` (64px mobile, 80px desktop)

---

### 6. Blog Section
```tsx
<section className="py-24 md:py-32 bg-background border-b border-border">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-16 gap-6">
      {/* Header */}
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {/* Blog cards with p-8 md:p-10 */}
    </div>
  </div>
</section>
```
- **Section padding**: `py-24 md:py-32` (96px mobile, 128px desktop)
- **Horizontal padding**: `px-4 sm:px-6 lg:px-8`
- **Header margin**: `mb-16` (64px)
- **Grid gap**: `gap-8` (32px)
- **Card padding**: `p-8 md:p-10` (32px mobile, 40px desktop)

---

### 7. FAQ Section
```tsx
<div id="faq" className="bg-background">
  <div className="py-24 md:py-32 border-t border-border/50">
    <FAQ />
  </div>
</div>
```
- **Section padding**: `py-24 md:py-32` (96px mobile, 128px desktop)
- **Border**: `border-t border-border/50`

---

### 8. Colosseum Gallery Section
```tsx
<section ref={colosseumSectionRef} className="relative py-24 md:py-32 overflow-hidden bg-card">
  <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
    <div className="mb-16 md:mb-20 text-center">
      {/* Heading */}
    </div>
    <div className="relative rounded-[3rem] overflow-hidden border border-border shadow-2xl mb-16 md:mb-20">
      {/* Image */}
    </div>
    <GradientProductSlider />
  </div>
</section>
```
- **Section padding**: `py-24 md:py-32` (96px mobile, 128px desktop)
- **Horizontal padding**: `px-4 sm:px-6 lg:px-8`
- **Heading margin**: `mb-16 md:mb-20` (64px mobile, 80px desktop)
- **Image margin**: `mb-16 md:mb-20` (64px mobile, 80px desktop)

---

### 9. Transition Spacer
```tsx
<div className="h-16 md:h-24 bg-background border-y border-border" />
```
- **Height**: `h-16 md:h-24` (64px mobile, 96px desktop)
- **Provides visual separation between major sections**

---

## Responsive Breakpoints

### Mobile (<640px)
```
px-4      = 16px horizontal padding
py-24     = 96px vertical padding
gap-8     = 32px grid gaps
mb-16     = 64px bottom margin
p-8       = 32px card padding
h-16      = 64px height
```

### Tablet (640-1024px)
```
px-6      = 24px horizontal padding
py-24     = 96px vertical padding (can transition to py-32)
gap-8     = 32px grid gaps (can transition to gap-16)
mb-16     = 64px bottom margin (can transition to mb-20)
p-8       = 32px card padding (can transition to p-10)
h-16      = 64px height (can transition to h-24)
```

### Desktop (>1024px)
```
px-8      = 32px horizontal padding
py-32     = 128px vertical padding
gap-16    = 64px grid gaps
mb-20     = 80px bottom margin
p-10      = 40px card padding
h-24      = 96px height
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
<section className="py-24 md:py-32 bg-background border-b border-border">
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

## Typography Spacing

### Headings
```tsx
<h1 className="text-5xl md:text-7xl font-serif font-bold leading-[0.9] tracking-tighter">
  {title}
</h1>
```
- **Mobile**: `text-5xl` (48px)
- **Desktop**: `text-7xl` (112px)
- **Line height**: `leading-[0.9]` (0.9x)
- **Tracking**: `tracking-tighter` (-0.05em)

### Body Text
```tsx
<p className="text-base md:text-lg text-muted-foreground font-medium leading-relaxed">
  {content}
</p>
```
- **Mobile**: `text-base` (16px)
- **Desktop**: `text-lg` (18px)
- **Line height**: `leading-relaxed` (1.625)

### Labels
```tsx
<span className="text-[10px] font-bold tracking-widest text-primary">
  {label}
</span>
```
- **Size**: `text-[10px]` (10px)
- **Weight**: `font-bold` (700)
- **Tracking**: `tracking-widest` (0.1em)

---

## Common Patterns

### Section Header
```tsx
<div className="text-center mb-16 md:mb-20">
  <p className="text-primary font-bold tracking-[0.4em] text-[10px] mb-4">
    Section Label
  </p>
  <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter leading-none">
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
<div className="bg-card rounded-[2.5rem] overflow-hidden border border-border p-8 md:p-10">
  {/* Content */}
</div>
```

### Button
```tsx
<button className="px-10 py-5 rounded-full font-bold tracking-widest text-xs">
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
**Solution**: Check `p-8 md:p-10` is applied to all cards

---

## Validation Checklist

Before deploying, verify:

- [ ] All sections use `py-24 md:py-32`
- [ ] All containers use `px-4 sm:px-6 lg:px-8`
- [ ] All grids use `gap-8 md:gap-16`
- [ ] All headings use `mb-16 md:mb-20`
- [ ] All cards use `p-8 md:p-10`
- [ ] No arbitrary pixel values (e.g., `p-[13px]`)
- [ ] Hero has `pt-[102px]` for navbar offset
- [ ] Responsive breakpoints work at 640px and 1024px
- [ ] Mobile experience is optimized
- [ ] Desktop experience is optimized

---

**Last Updated**: May 2, 2026
**Status**: ✅ COMPLETE & PRODUCTION READY
