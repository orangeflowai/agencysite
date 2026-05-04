# Golden Rome Tour - Typography System & Consistency Audit

## Current Issues Found

### Font Size Inconsistencies
- **Headings**: text-2xl, text-3xl, text-4xl, text-5xl, text-6xl, text-7xl, text-8xl, text-9xl (no pattern)
- **Body text**: text-xs, text-sm, text-base, text-lg, text-xl (mixed usage)
- **Labels**: text-[10px], text-[9px], text-[8px], text-[7px] (arbitrary values)
- **Buttons**: text-xs, text-[10px] (inconsistent)

### Font Weight Inconsistencies
- **Headings**: font-bold (700) used everywhere
- **Body**: font-body, font-heading, font-nav (multiple font families)
- **Labels**: font-bold (700) used for all labels

### Line Height Inconsistencies
- **Headings**: leading-none, leading-tight, leading-[0.9], leading-[0.85] (no pattern)
- **Body**: leading-relaxed, leading-relaxed (good, but not always applied)
- **Labels**: no line height specified

### Tracking (Letter Spacing) Inconsistencies
- **Headings**: tracking-tighter, tracking-tight, tracking-tightest (no pattern)
- **Labels**: tracking-tight, tracking-tighter, tracking-widest, tracking-[0.4em] (all over the place)
- **Body**: no tracking applied (correct)

---

## Proposed Typography System

### 1. **Heading Hierarchy**

#### H1 - Page Title / Hero
```tsx
className="text-6xl md:text-7xl lg:text-8xl font-heading font-bold leading-tight tracking-tighter text-secondary uppercase"
```
- **Mobile**: 36px (text-6xl)
- **Tablet**: 48px (text-7xl)
- **Desktop**: 56px (text-8xl)
- **Weight**: 700 (bold)
- **Line Height**: 1.25 (leading-tight)
- **Tracking**: -0.05em (tracking-tighter)
- **Case**: UPPERCASE

#### H2 - Section Title
```tsx
className="text-4xl md:text-5xl font-heading font-bold leading-tight tracking-tighter text-secondary uppercase"
```
- **Mobile**: 24px (text-4xl)
- **Tablet**: 32px (text-5xl)
- **Desktop**: 32px (text-5xl)
- **Weight**: 700 (bold)
- **Line Height**: 1.25 (leading-tight)
- **Tracking**: -0.05em (tracking-tighter)
- **Case**: UPPERCASE

#### H3 - Subsection Title
```tsx
className="text-2xl md:text-3xl font-heading font-bold leading-tight tracking-tight text-secondary uppercase"
```
- **Mobile**: 20px (text-2xl)
- **Tablet**: 24px (text-3xl)
- **Desktop**: 24px (text-3xl)
- **Weight**: 700 (bold)
- **Line Height**: 1.25 (leading-tight)
- **Tracking**: -0.025em (tracking-tight)
- **Case**: UPPERCASE

#### H4 - Feature Title
```tsx
className="text-lg md:text-xl font-heading font-bold leading-tight tracking-tight text-secondary uppercase"
```
- **Mobile**: 16px (text-lg)
- **Tablet**: 18px (text-xl)
- **Desktop**: 18px (text-xl)
- **Weight**: 700 (bold)
- **Line Height**: 1.25 (leading-tight)
- **Tracking**: -0.025em (tracking-tight)
- **Case**: UPPERCASE

---

### 2. **Body Text**

#### Body - Large (Intro/Description)
```tsx
className="text-base md:text-lg font-body leading-relaxed text-secondary"
```
- **Mobile**: 16px (text-base)
- **Tablet**: 18px (text-lg)
- **Desktop**: 18px (text-lg)
- **Weight**: 400 (normal)
- **Line Height**: 1.625 (leading-relaxed)
- **Tracking**: 0 (normal)

#### Body - Regular (Default)
```tsx
className="text-base font-body leading-relaxed text-secondary"
```
- **Size**: 16px (text-base)
- **Weight**: 400 (normal)
- **Line Height**: 1.625 (leading-relaxed)
- **Tracking**: 0 (normal)

#### Body - Small (Secondary Info)
```tsx
className="text-sm font-body leading-relaxed text-secondary/60"
```
- **Size**: 14px (text-sm)
- **Weight**: 400 (normal)
- **Line Height**: 1.625 (leading-relaxed)
- **Tracking**: 0 (normal)
- **Color**: Muted (secondary/60)

---

### 3. **Labels & Badges**

#### Label - Primary
```tsx
className="text-[10px] font-heading font-bold uppercase tracking-tight text-primary"
```
- **Size**: 10px (text-[10px])
- **Weight**: 700 (bold)
- **Line Height**: 1 (default)
- **Tracking**: -0.025em (tracking-tight)
- **Case**: UPPERCASE
- **Color**: Primary

#### Label - Secondary
```tsx
className="text-[10px] font-heading font-bold uppercase tracking-tight text-secondary"
```
- **Size**: 10px (text-[10px])
- **Weight**: 700 (bold)
- **Line Height**: 1 (default)
- **Tracking**: -0.025em (tracking-tight)
- **Case**: UPPERCASE
- **Color**: Secondary

#### Label - Muted
```tsx
className="text-[10px] font-heading font-bold uppercase tracking-tight text-secondary/60"
```
- **Size**: 10px (text-[10px])
- **Weight**: 700 (bold)
- **Line Height**: 1 (default)
- **Tracking**: -0.025em (tracking-tight)
- **Case**: UPPERCASE
- **Color**: Muted

---

### 4. **Buttons & CTAs**

#### Button - Primary
```tsx
className="px-10 py-5 font-heading font-bold tracking-tight text-xs uppercase"
```
- **Size**: 12px (text-xs)
- **Weight**: 700 (bold)
- **Tracking**: -0.025em (tracking-tight)
- **Case**: UPPERCASE

#### Button - Secondary
```tsx
className="px-10 py-5 font-heading font-bold tracking-tight text-xs uppercase"
```
- **Size**: 12px (text-xs)
- **Weight**: 700 (bold)
- **Tracking**: -0.025em (tracking-tight)
- **Case**: UPPERCASE

---

### 5. **Special Elements**

#### Eyebrow / Overline
```tsx
className="text-[10px] font-heading font-bold uppercase tracking-tight text-primary mb-4"
```
- **Size**: 10px (text-[10px])
- **Weight**: 700 (bold)
- **Tracking**: -0.025em (tracking-tight)
- **Case**: UPPERCASE
- **Color**: Primary

#### Caption / Small Text
```tsx
className="text-xs font-body leading-relaxed text-secondary/60"
```
- **Size**: 12px (text-xs)
- **Weight**: 400 (normal)
- **Line Height**: 1.625 (leading-relaxed)
- **Tracking**: 0 (normal)
- **Color**: Muted

---

## Font Families

### Current Usage
- **font-heading**: Used for headings, labels, buttons
- **font-body**: Used for body text, descriptions
- **font-nav**: Used in navbar (should be consolidated)
- **font-vibes**: Used for decorative text (italic)

### Recommendation
- **Headings**: font-heading (serif, bold)
- **Body**: font-body (sans-serif, regular)
- **Decorative**: font-vibes (script, italic) - use sparingly

---

## Responsive Typography Scale

### Mobile (<640px)
```
H1: text-6xl (36px)
H2: text-4xl (24px)
H3: text-2xl (20px)
H4: text-lg (16px)
Body: text-base (16px)
Small: text-sm (14px)
Label: text-[10px] (10px)
```

### Tablet (640-1024px)
```
H1: text-7xl (48px)
H2: text-5xl (32px)
H3: text-3xl (24px)
H4: text-xl (18px)
Body: text-lg (18px)
Small: text-sm (14px)
Label: text-[10px] (10px)
```

### Desktop (>1024px)
```
H1: text-8xl (56px)
H2: text-5xl (32px)
H3: text-3xl (24px)
H4: text-xl (18px)
Body: text-lg (18px)
Small: text-sm (14px)
Label: text-[10px] (10px)
```

---

## Implementation Checklist

### Page.tsx
- [ ] H1 (Hero): text-6xl md:text-7xl lg:text-8xl
- [ ] H2 (Section): text-4xl md:text-5xl
- [ ] H3 (Subsection): text-2xl md:text-3xl
- [ ] Body: text-base md:text-lg
- [ ] Labels: text-[10px]
- [ ] All headings: font-heading font-bold leading-tight tracking-tighter
- [ ] All body: font-body leading-relaxed

### Hero.tsx
- [ ] Title: text-6xl md:text-8xl xl:text-9xl
- [ ] Subtitle: text-xl md:text-2xl
- [ ] Labels: text-[10px]

### Steps.tsx
- [ ] Title: text-4xl md:text-6xl
- [ ] Step title: text-2xl
- [ ] Step desc: text-base

### RomeGallery.tsx
- [ ] Title: text-6xl md:text-8xl
- [ ] Label: text-[10px]

### SpecialOffer.tsx
- [ ] Title: text-7xl md:text-9xl
- [ ] Body: text-xl
- [ ] Label: text-[10px]

### TourCard.tsx
- [ ] Title: text-lg
- [ ] Label: text-[10px]
- [ ] Price: text-2xl

### Blog Section
- [ ] Title: text-4xl md:text-5xl
- [ ] Card title: text-lg
- [ ] Card desc: text-sm

---

## Color Consistency

### Text Colors
- **Primary Headings**: text-secondary (dark)
- **Secondary Headings**: text-secondary (dark)
- **Body Text**: text-secondary (dark)
- **Muted Text**: text-secondary/60 (60% opacity)
- **Labels**: text-primary (accent color)
- **Links**: text-primary (accent color)

### Background Colors
- **Sections**: bg-background (light)
- **Cards**: bg-background (light)
- **Highlights**: bg-secondary (dark)

---

## Validation Checklist

Before deployment, verify:

- [ ] All H1 use: text-6xl md:text-7xl lg:text-8xl
- [ ] All H2 use: text-4xl md:text-5xl
- [ ] All H3 use: text-2xl md:text-3xl
- [ ] All H4 use: text-lg md:text-xl
- [ ] All body use: text-base md:text-lg
- [ ] All labels use: text-[10px]
- [ ] All headings use: font-heading font-bold leading-tight tracking-tighter
- [ ] All body use: font-body leading-relaxed
- [ ] No arbitrary font sizes (e.g., text-[13px])
- [ ] No mixed font families in same section
- [ ] Consistent line heights throughout
- [ ] Consistent tracking throughout
- [ ] All text properly colored

---

**Last Updated**: May 2, 2026
**Status**: AUDIT COMPLETE - READY FOR IMPLEMENTATION
