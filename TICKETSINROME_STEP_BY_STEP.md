# TicketsInRome UI Migration - Step-by-Step Execution Guide

## Quick Start Commands

```bash
# Phase 1: Backup current version
cp -r /home/abiilesh/travelwebsite/ticketsinrome-copy/ticketsinrome \
      /home/abiilesh/travelwebsite/ticketsinrome-backup-$(date +%s)

# Phase 2: Copy new UI as base
cp -r /home/abiilesh/travelwebsite/ticketsinrome-copy/tickets_in_rome/* \
      /home/abiilesh/travelwebsite/ticketsinrome-copy/ticketsinrome/

# Phase 3: Install dependencies
cd /home/abiilesh/travelwebsite/ticketsinrome-copy/ticketsinrome
npm install

# Phase 4: Build and test
npm run build
npm run dev
```

---

## Detailed Step-by-Step

### STEP 1: Backup Current Version (5 mins)

```bash
# Create timestamped backup
BACKUP_DIR="/home/abiilesh/travelwebsite/ticketsinrome-backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"
cp -r /home/abiilesh/travelwebsite/ticketsinrome-copy/ticketsinrome/* "$BACKUP_DIR/"

echo "Backup created at: $BACKUP_DIR"
```

**What this does:**
- Preserves current working version
- Allows rollback if needed
- Keeps all backend integration intact

---

### STEP 2: Copy New UI Structure (10 mins)

```bash
# Navigate to ticketsinrome directory
cd /home/abiilesh/travelwebsite/ticketsinrome-copy/ticketsinrome

# Remove old app and components (keep src/lib, src/context, src/app/api)
rm -rf app/
rm -rf components/
rm -rf styles/
rm -rf public/images/

# Copy new UI files
cp -r /home/abiilesh/travelwebsite/ticketsinrome-copy/tickets_in_rome/app ./
cp -r /home/abiilesh/travelwebsite/ticketsinrome-copy/tickets_in_rome/components ./
cp -r /home/abiilesh/travelwebsite/ticketsinrome-copy/tickets_in_rome/styles ./
cp -r /home/abiilesh/travelwebsite/ticketsinrome-copy/tickets_in_rome/public ./
cp -r /home/abiilesh/travelwebsite/ticketsinrome-copy/tickets_in_rome/hooks ./
cp -r /home/abiilesh/travelwebsite/ticketsinrome-copy/tickets_in_rome/lib ./

# Verify structure
ls -la app/
ls -la components/
ls -la public/
```

**What this does:**
- Replaces UI with modern design
- Keeps backend integration (src/lib, src/context, src/app/api)
- Preserves database schema and migrations

---

### STEP 3: Merge Dependencies (15 mins)

**Current package.json has:**
- Sanity CMS integration
- Stripe payment processing
- Supabase database
- Framer Motion animations
- Resend email service

**New UI adds:**
- Radix UI components
- Tailwind CSS v4
- React Hook Form
- Zod validation
- Sonner toasts

**Action: Update package.json**

```json
{
  "name": "rome-tour-tickets",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@hookform/resolvers": "^3.10.0",
    "@portabletext/react": "^6.0.2",
    "@radix-ui/react-accordion": "1.2.2",
    "@radix-ui/react-alert-dialog": "1.1.4",
    "@radix-ui/react-aspect-ratio": "1.1.1",
    "@radix-ui/react-avatar": "1.1.2",
    "@radix-ui/react-checkbox": "1.1.3",
    "@radix-ui/react-collapsible": "1.1.2",
    "@radix-ui/react-context-menu": "2.2.4",
    "@radix-ui/react-dialog": "1.1.4",
    "@radix-ui/react-dropdown-menu": "2.1.4",
    "@radix-ui/react-hover-card": "1.1.4",
    "@radix-ui/react-label": "2.1.1",
    "@radix-ui/react-menubar": "1.1.4",
    "@radix-ui/react-navigation-menu": "1.2.3",
    "@radix-ui/react-popover": "1.1.4",
    "@radix-ui/react-progress": "1.1.1",
    "@radix-ui/react-radio-group": "1.2.2",
    "@radix-ui/react-scroll-area": "1.2.2",
    "@radix-ui/react-select": "2.1.4",
    "@radix-ui/react-separator": "1.1.1",
    "@radix-ui/react-slider": "1.2.2",
    "@radix-ui/react-slot": "1.1.1",
    "@radix-ui/react-switch": "1.1.2",
    "@radix-ui/react-tabs": "1.1.2",
    "@radix-ui/react-toast": "1.2.4",
    "@radix-ui/react-toggle": "1.1.1",
    "@radix-ui/react-toggle-group": "1.1.1",
    "@radix-ui/react-tooltip": "1.1.6",
    "@sanity/color-input": "^4.0.1",
    "@sanity/image-url": "^2.0.3",
    "@sanity/vision": "^5.4.0",
    "@stripe/react-stripe-js": "^3.6.0",
    "@stripe/stripe-js": "^8.6.4",
    "@studio-freight/lenis": "^1.0.42",
    "@supabase/ssr": "^0.5.2",
    "@supabase/supabase-js": "^2.93.2",
    "@vercel/analytics": "1.3.1",
    "autoprefixer": "^10.4.20",
    "class-variance-authority": "^0.7.1",
    "clsx": "^2.1.1",
    "cmdk": "1.0.4",
    "date-fns": "4.1.0",
    "embla-carousel-react": "8.5.1",
    "framer-motion": "^12.34.3",
    "input-otp": "1.4.1",
    "jspdf": "^4.1.0",
    "lucide-react": "^0.562.0",
    "next": "16.1.3",
    "next-sanity": "^12.0.15",
    "next-themes": "^0.4.6",
    "qrcode": "^1.5.4",
    "react": "19.2.3",
    "react-day-picker": "^9.13.0",
    "react-dom": "19.2.3",
    "react-hook-form": "^7.60.0",
    "react-parallax-tilt": "^1.7.319",
    "react-payment-icons": "^1.2.6",
    "react-resizable-panels": "^2.1.7",
    "recharts": "2.15.4",
    "resend": "^6.7.0",
    "sanity": "^5.4.0",
    "sharp": "^0.34.5",
    "sonner": "^1.7.4",
    "stripe": "^20.2.0",
    "styled-components": "^6.3.8",
    "tailwind-merge": "^3.4.0",
    "tailwindcss-animate": "^1.0.7",
    "vaul": "^1.1.2",
    "zod": "3.25.76"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/jspdf": "^2.0.0",
    "@types/node": "^20",
    "@types/qrcode": "^1.5.6",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "babel-plugin-react-compiler": "1.0.0",
    "dotenv": "^17.2.3",
    "eslint": "^9",
    "eslint-config-next": "16.1.3",
    "tailwindcss": "^4",
    "tsx": "^4.21.0",
    "typescript": "^5"
  }
}
```

**Install dependencies:**
```bash
npm install
```

---

### STEP 4: Update Configuration Files (20 mins)

#### 4.1 Update tailwind.config.ts

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: "hsl(var(--card))",
        "card-foreground": "hsl(var(--card-foreground))",
        primary: "hsl(var(--primary))",
        "primary-foreground": "hsl(var(--primary-foreground))",
        secondary: "hsl(var(--secondary))",
        "secondary-foreground": "hsl(var(--secondary-foreground))",
        muted: "hsl(var(--muted))",
        "muted-foreground": "hsl(var(--muted-foreground))",
        accent: "hsl(var(--accent))",
        "accent-foreground": "hsl(var(--accent-foreground))",
        destructive: "hsl(var(--destructive))",
        "destructive-foreground": "hsl(var(--destructive-foreground))",
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      spacing: {
        1: "4px",
        2: "8px",
        3: "12px",
        4: "16px",
        6: "24px",
        8: "32px",
        10: "40px",
        12: "48px",
        16: "64px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

#### 4.2 Update next.config.ts

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.sanity.io",
      },
      {
        protocol: "https",
        hostname: "**.supabase.co",
      },
      {
        protocol: "https",
        hostname: "**.cloudflare.com",
      },
      {
        protocol: "https",
        hostname: "admin.wondersofrome.com",
      },
    ],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
```

#### 4.3 Update postcss.config.mjs

```javascript
/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};

export default config;
```

---

### STEP 5: Create Backend Integration Layer (30 mins)

**File: `src/lib/backendAdapter.ts`**

```typescript
import { PAYLOAD_API_URL, PAYLOAD_API_KEY } from "./constants";

export interface Tour {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  duration: string;
  category: string;
  mainImage?: {
    url: string;
    alt: string;
  };
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
  site?: string;
}

/**
 * Fetch all tours from Payload CMS
 */
export async function getTours(siteId: string = "ticketsinrome"): Promise<Tour[]> {
  try {
    const response = await fetch(
      `${PAYLOAD_API_URL}/api/tours?site=${siteId}&limit=100`,
      {
        headers: {
          Authorization: `Bearer ${PAYLOAD_API_KEY}`,
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch tours: ${response.statusText}`);
    }

    const data = await response.json();
    return data.docs || [];
  } catch (error) {
    console.error("Error fetching tours:", error);
    return [];
  }
}

/**
 * Fetch featured tours for homepage
 */
export async function getFeaturedTours(
  siteId: string = "ticketsinrome",
  limit: number = 6
): Promise<Tour[]> {
  try {
    const tours = await getTours(siteId);
    return tours.filter(t => t.featured).slice(0, limit);
  } catch (error) {
    console.error("Error fetching featured tours:", error);
    return [];
  }
}

/**
 * Fetch single tour by slug
 */
export async function getTourBySlug(slug: string): Promise<Tour | null> {
  try {
    const response = await fetch(
      `${PAYLOAD_API_URL}/api/tours?slug=${slug}`,
      {
        headers: {
          Authorization: `Bearer ${PAYLOAD_API_KEY}`,
        },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch tour: ${response.statusText}`);
    }

    const data = await response.json();
    return data.docs?.[0] || null;
  } catch (error) {
    console.error("Error fetching tour by slug:", error);
    return null;
  }
}

/**
 * Fetch tour by ID
 */
export async function getTourById(id: string): Promise<Tour | null> {
  try {
    const response = await fetch(
      `${PAYLOAD_API_URL}/api/tours/${id}`,
      {
        headers: {
          Authorization: `Bearer ${PAYLOAD_API_KEY}`,
        },
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch tour: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching tour by ID:", error);
    return null;
  }
}

/**
 * Search tours by keyword
 */
export async function searchTours(
  query: string,
  siteId: string = "ticketsinrome"
): Promise<Tour[]> {
  try {
    const tours = await getTours(siteId);
    const lowerQuery = query.toLowerCase();
    
    return tours.filter(
      tour =>
        tour.title.toLowerCase().includes(lowerQuery) ||
        tour.description?.toLowerCase().includes(lowerQuery) ||
        tour.category?.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error("Error searching tours:", error);
    return [];
  }
}
```

---

### STEP 6: Update Featured Products Section (20 mins)

**File: `components/sections/featured-products-section.tsx`**

```typescript
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FadeImage } from "@/components/fade-image";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Tour {
  id: string;
  title: string;
  slug: string;
  price: number;
  duration: string;
  category: string;
  mainImage?: {
    url: string;
    alt: string;
  };
  rating?: number;
  reviewCount?: number;
}

export function FeaturedProductsSection() {
  const [tours, setTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadTours() {
      try {
        setLoading(true);
        const response = await fetch("/api/tours?featured=true&limit=6");
        
        if (!response.ok) {
          throw new Error("Failed to load tours");
        }
        
        const data = await response.json();
        setTours(data);
        setError(null);
      } catch (err) {
        console.error("Error loading tours:", err);
        setError("Failed to load tours. Please try again later.");
        setTours([]);
      } finally {
        setLoading(false);
      }
    }

    loadTours();
  }, []);

  return (
    <section id="vatican" className="bg-background">
      {/* Section Title */}
      <div className="px-6 py-20 text-center md:px-12 md:py-28 lg:px-20 lg:py-32 lg:pb-20">
        <h2 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl lg:text-5xl">
          Curated Experiences.
          <br />
          Unforgettable Memories.
        </h2>
        <p className="mx-auto mt-6 max-w-md text-sm text-muted-foreground">
          Skip-the-Line Tours
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="px-6 py-4 mb-8 text-center text-red-600 bg-red-50 rounded-lg md:px-12 lg:px-20">
          {error}
        </div>
      )}

      {/* Tours Grid */}
      <div className="grid grid-cols-1 gap-4 px-6 pb-20 md:grid-cols-3 md:px-12 lg:px-20">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-[4/3] rounded-2xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))
        ) : tours.length > 0 ? (
          // Tours list
          tours.map((tour) => (
            <Link
              key={tour.id}
              href={`/tour/${tour.slug}`}
              className="group cursor-pointer"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden rounded-2xl">
                <FadeImage
                  src={tour.mainImage?.url || "/placeholder.jpg"}
                  alt={tour.mainImage?.alt || tour.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-foreground text-background px-3 py-1 text-xs font-medium rounded-full">
                    {tour.category || "Tour"}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="py-6">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 fill-foreground text-foreground" />
                  <span className="text-sm font-medium">
                    {tour.rating?.toFixed(1) || "4.8"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    ({tour.reviewCount || 0} reviews)
                  </span>
                </div>
                <h3 className="text-foreground text-xl font-semibold line-clamp-2">
                  {tour.title}
                </h3>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-sm text-muted-foreground">
                    {tour.duration || "3 hours"}
                  </span>
                  <span className="text-lg font-medium">
                    From €{tour.price || "0"}
                  </span>
                </div>
              </div>
            </Link>
          ))
        ) : (
          // Empty state
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground">No tours available at the moment.</p>
          </div>
        )}
      </div>
    </section>
  );
}
```

---

### STEP 7: Create API Route for Tours (15 mins)

**File: `src/app/api/tours/route.ts`**

```typescript
import { getTours, getFeaturedTours } from "@/lib/backendAdapter";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const featured = searchParams.get("featured") === "true";
    const limit = parseInt(searchParams.get("limit") || "6");
    const siteId = searchParams.get("site") || "ticketsinrome";

    let tours;
    if (featured) {
      tours = await getFeaturedTours(siteId, limit);
    } else {
      const allTours = await getTours(siteId);
      tours = allTours.slice(0, limit);
    }

    return Response.json(tours);
  } catch (error) {
    console.error("Error in /api/tours:", error);
    return Response.json(
      { error: "Failed to fetch tours" },
      { status: 500 }
    );
  }
}
```

---

### STEP 8: Build and Test (30 mins)

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Check for errors
npm run lint

# Start development server
npm run dev

# Visit http://localhost:3000 in browser
```

**Test checklist:**
- [ ] Homepage loads without errors
- [ ] Featured products section displays
- [ ] Images load correctly
- [ ] Responsive design works (mobile, tablet, desktop)
- [ ] No console errors
- [ ] API calls succeed
- [ ] Tours data displays from backend

---

### STEP 9: Verify Backend Integration (20 mins)

```bash
# Check environment variables
cat .env | grep PAYLOAD

# Test API endpoint
curl "http://localhost:3000/api/tours?featured=true&limit=6"

# Check browser console for errors
# Open DevTools → Console tab
# Look for any red errors

# Test tour loading
# Visit http://localhost:3000
# Scroll to featured products section
# Verify tours load and display correctly
```

---

### STEP 10: Deploy to Production (30 mins)

```bash
# Commit changes
git add .
git commit -m "feat: replace ticketsinrome UI with modern design

- Integrated new Radix UI components
- Updated to Tailwind CSS v4
- Connected featured products to Payload CMS
- Preserved all backend integration
- Maintained booking flow and admin dashboard"

# Push to main
git push origin main

# Monitor deployment
# Check Vercel dashboard for build status
# Test live site at https://ticketsinrome.com
```

---

## Troubleshooting

### Issue: Build fails with TypeScript errors

**Solution:**
```bash
# Clear cache and rebuild
rm -rf .next
npm run build
```

### Issue: Tours not loading from API

**Solution:**
```bash
# Check environment variables
echo $PAYLOAD_API_URL
echo $PAYLOAD_API_KEY

# Test API directly
curl -H "Authorization: Bearer $PAYLOAD_API_KEY" \
  "$PAYLOAD_API_URL/api/tours?site=ticketsinrome"
```

### Issue: Images not displaying

**Solution:**
```bash
# Check next.config.ts has correct image domains
# Verify image URLs are accessible
# Check browser Network tab for 404 errors
```

### Issue: Styling looks broken

**Solution:**
```bash
# Rebuild Tailwind CSS
npm run build

# Clear browser cache (Ctrl+Shift+Delete)
# Hard refresh (Ctrl+Shift+R)
```

---

## Success Indicators

✅ Homepage loads in < 3 seconds  
✅ Featured products display with images  
✅ Tours data comes from Payload CMS  
✅ Booking flow works (Book Now button)  
✅ No console errors  
✅ Responsive on mobile/tablet/desktop  
✅ Admin dashboard still accessible  
✅ Stripe payments process correctly  
✅ Email notifications send  
✅ All tests pass  

---

## Rollback Instructions

If something goes wrong:

```bash
# Restore from backup
rm -rf /home/abiilesh/travelwebsite/ticketsinrome-copy/ticketsinrome
cp -r /home/abiilesh/travelwebsite/ticketsinrome-backup-* \
      /home/abiilesh/travelwebsite/ticketsinrome-copy/ticketsinrome

# Or revert git commit
git revert HEAD
git push origin main
```

---

**Total Time: ~3-4 hours**  
**Difficulty: Medium**  
**Risk Level: Low (with backup)**
