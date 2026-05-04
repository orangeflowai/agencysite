# Golden Rome Tour - Typography Quick Reference

**Last Updated**: May 2, 2026  
**Status**: ✅ ALL COMPONENTS UPDATED

---

## Copy-Paste Typography Classes

### Headings

#### H1 - Page Title / Hero
```tsx
className="text-6xl md:text-7xl lg:text-8xl font-heading font-bold leading-tight tracking-tighter text-secondary uppercase"
```

#### H2 - Section Title
```tsx
className="text-4xl md:text-5xl font-heading font-bold leading-tight tracking-tighter text-secondary uppercase"
```

#### H3 - Subsection Title
```tsx
className="text-2xl md:text-3xl font-heading font-bold leading-tight tracking-tight text-secondary uppercase"
```

#### H4 - Feature Title
```tsx
className="text-lg md:text-xl font-heading font-bold leading-tight tracking-tight text-secondary uppercase"
```

---

### Body Text

#### Body - Large (Intro/Description)
```tsx
className="text-base md:text-lg font-body leading-relaxed text-secondary"
```

#### Body - Regular (Default)
```tsx
className="text-base font-body leading-relaxed text-secondary"
```

#### Body - Small (Secondary Info)
```tsx
className="text-sm font-body leading-relaxed text-secondary/60"
```

---

### Labels & Badges

#### Label - Primary
```tsx
className="text-[10px] font-heading font-bold uppercase tracking-tight text-primary"
```

#### Label - Secondary
```tsx
className="text-[10px] font-heading font-bold uppercase tracking-tight text-secondary"
```

#### Label - Muted
```tsx
className="text-[10px] font-heading font-bold uppercase tracking-tight text-secondary/60"
```

---

### Buttons & CTAs

#### Button - Primary
```tsx
className="px-10 py-5 font-heading font-bold tracking-tight text-xs uppercase"
```

#### Button - Secondary
```tsx
className="px-10 py-5 font-heading font-bold tracking-tight text-xs uppercase"
```

---

## Font Size Scale

| Class | Size | Usage |
|-------|------|-------|
| `text-xs` | 12px | Buttons, small labels |
| `text-sm` | 14px | Body small, captions |
| `text-base` | 16px | Body regular, default |
| `text-lg` | 18px | Body large, H4 |
| `text-xl` | 20px | H4 tablet+ |
| `text-2xl` | 24px | H3 mobile |
| `text-3xl` | 30px | H3 tablet+ |
| `text-4xl` | 36px | H2 mobile |
| `text-5xl` | 48px | H2 tablet+, H1 mobile |
| `text-6xl` | 60px | H1 mobile |
| `text-7xl` | 72px | H1 tablet |
| `text-8xl` | 96px | H1 desktop |
| `text-[10px]` | 10px | Labels only |

---

## Line Heights

| Class | Value | Usage |
|-------|-------|-------|
| `leading-tight` | 1.25 | Headings |
| `leading-relaxed` | 1.625 | Body text |
| `leading-none` | 1 | Avoid (use only for special cases) |

---

## Tracking (Letter Spacing)

| Class | Value | Usage |
|-------|-------|-------|
| `tracking-tight` | -0.025em | Labels, buttons, headings |
| `tracking-tighter` | -0.05em | Large headings (H1, H2) |
| (none) | 0 | Body text |

---

## Font Families

| Class | Usage |
|-------|-------|
| `font-heading` | Headings, labels, buttons |
| `font-body` | Body text, descriptions |
| `font-vibes` | Decorative text only (italic) |

---

## Color Patterns

### Text Colors
```
Primary headings:    text-secondary (dark)
Secondary headings:  text-secondary (dark)
Body text:           text-secondary (dark)
Muted text:          text-secondary/60 (60% opacity)
Labels:              text-primary (accent)
Links:               text-primary (accent)
```

### Background Colors
```
Sections:  bg-background (light)
Cards:     bg-background (light)
Highlights: bg-secondary (dark)
```

---

## Common Patterns

### Section Header
```tsx
<h2 className="text-4xl md:text-5xl font-heading font-bold leading-tight tracking-tighter text-secondary uppercase mb-16">
  Section Title
</h2>
```

### Feature Card
```tsx
<div>
  <p className="text-[10px] font-heading font-bold uppercase tracking-tight text-primary mb-4">Label</p>
  <h3 className="text-lg md:text-xl font-heading font-bold leading-tight tracking-tight text-secondary uppercase mb-4">
    Feature Title
  </h3>
  <p className="text-base font-body leading-relaxed text-secondary/60">
    Feature description goes here.
  </p>
</div>
```

### CTA Button
```tsx
<button className="px-10 py-5 font-heading font-bold tracking-tight text-xs uppercase bg-primary text-secondary hover:bg-white transition-all rounded-full">
  Call to Action
</button>
```

### Eyebrow + Heading
```tsx
<div>
  <p className="text-[10px] font-heading font-bold uppercase tracking-tight text-primary mb-4">✦ Eyebrow Text ✦</p>
  <h2 className="text-4xl md:text-5xl font-heading font-bold leading-tight tracking-tighter text-secondary uppercase">
    Main Heading
  </h2>
</div>
```

---

## Responsive Breakpoints

### Mobile (<640px)
```
H1: text-6xl (36px)
H2: text-4xl (24px)
H3: text-2xl (20px)
H4: text-lg (16px)
Body: text-base (16px)
```

### Tablet (640-1024px)
```
H1: text-7xl (48px)
H2: text-5xl (32px)
H3: text-3xl (24px)
H4: text-xl (18px)
Body: text-lg (18px)
```

### Desktop (>1024px)
```
H1: text-8xl (56px)
H2: text-5xl (32px)
H3: text-3xl (24px)
H4: text-xl (18px)
Body: text-lg (18px)
```

---

## DO's and DON'Ts

### ✅ DO
- Use `text-[10px]` for labels only
- Use `font-heading` for headings and labels
- Use `font-body` for body text
- Use `tracking-tight` for labels and buttons
- Use `tracking-tighter` for large headings (H1, H2)
- Use `leading-tight` for headings
- Use `leading-relaxed` for body text
- Use responsive classes: `text-base md:text-lg`
- Use CSS variables for colors: `text-primary`, `text-secondary`

### ❌ DON'T
- Don't use arbitrary sizes like `text-[13px]`, `text-[15px]`
- Don't mix `font-heading` and `font-body` in same section
- Don't use `tracking-tighter` for body text
- Don't use `leading-none` for body text
- Don't hardcode colors: `text-[#06858e]`
- Don't use `text-[9px]` or `text-[8px]` (use `text-[10px]` for labels)
- Don't use `text-[7px]` (too small, use `text-[10px]`)
- Don't mix tracking values in same component

---

## Updated Components

✅ SpecialOffer.tsx  
✅ TourCard.tsx  
✅ Navbar.tsx  
✅ TrustBadges.tsx  
✅ FloatingReviews.tsx  
✅ BookingCTA.tsx  
✅ HighlightSection.tsx  
✅ FeatureIcons.tsx  

---

**All components verified and building successfully!**

