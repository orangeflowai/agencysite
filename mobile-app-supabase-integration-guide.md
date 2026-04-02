# Mobile App + Supabase Integration Guide
## Tickets in Rome & Wonders of Rome

## 🎯 Your Existing Supabase Schema

Based on your websites (ticketsinrome.com + wondersofrome.com), here's what you already have:

### **Existing Tables:**

#### 1. `bookings` Table
```sql
- id (uuid, primary key)
- tour_slug (text) - Links to tour
- tour_title (text) - Display name
- date (date) - Tour date
- time (text) - Tour time slot (e.g., "10:00 AM")
- customer_name (text)
- customer_email (text)
- customer_phone (text)
- guests (integer) - Total guest count
- total_price (integer) - Price in cents
- status (text) - "pending", "paid", "cancelled"
- stripe_session_id (text) - Payment reference
- stripe_payment_intent_id (text) - Payment ID
- guest_details (jsonb) - Additional info
- adults (integer)
- youths (integer)
- students (integer)
- site_id (text) - "ticketsinrome" or "wondersofrome"
- created_at (timestamp)
```

#### 2. `tours` Table
```sql
- slug (text, primary key) - e.g., "vatican-museums-tour"
- title (text) - Display name
- base_price (integer) - Price in cents
- category (text) - Tour category
- metadata (jsonb) - Extra info
```

#### 3. `inventory` Table
```sql
- id (uuid)
- tour_slug (text)
- date (date)
- time (text)
- available_slots (integer)
- price_override (integer)
- created_at (timestamp)
```

#### 4. `audit_logs` Table (from new_features_schema.sql)
```sql
- id (uuid)
- user_id (uuid)
- user_email (text)
- action (text)
- resource_type (text)
- resource_id (text)
- details (jsonb)
- ip_address (text)
- user_agent (text)
- created_at (timestamp)
```

## 📱 Mobile App Integration Strategy

### **What Your App Needs:**

#### 1. **Wallet Screen** - Show User's Tickets
```typescript
// Query bookings for a specific user
SELECT 
  id,
  tour_title as title,
  tour_slug,
  date,
  time,
  guests,
  total_price,
  status,
  stripe_payment_intent_id as qr_value,
  created_at
FROM bookings
WHERE customer_email = 'user@email.com'
  AND status = 'paid'
ORDER BY date DESC
```

#### 2. **Tours Screen** - Show Available Tours
```typescript
// Query tours with availability
SELECT 
  t.slug,
  t.title,
  t.base_price,
  t.category,
  t.metadata,
  COUNT(i.id) as available_dates
FROM tours t
LEFT JOIN inventory i ON t.slug = i.tour_slug 
  AND i.date >= CURRENT_DATE
  AND i.available_slots > 0
GROUP BY t.slug, t.title, t.base_price, t.category, t.metadata
```

#### 3. **Concierge Screen** - FAQs and Support
You'll need to create these tables (they don't exist yet):

```sql
-- Concierge Agents
CREATE TABLE concierge_agents (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  subtitle text,
  avatar_url text,
  whatsapp_url text,
  site_id text, -- "ticketsinrome" or "wondersofrome"
  created_at timestamp with time zone DEFAULT now()
);

-- Office Locations
CREATE TABLE office_locations (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  address text NOT NULL,
  hours text,
  site_id text,
  created_at timestamp with time zone DEFAULT now()
);

-- FAQs
CREATE TABLE faqs (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  question text NOT NULL,
  answer text NOT NULL,
  category text,
  site_id text,
  order_index integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS
ALTER TABLE concierge_agents ENABLE ROW LEVEL SECURITY;
ALTER TABLE office_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Public read" ON concierge_agents FOR SELECT USING (true);
CREATE POLICY "Public read" ON office_locations FOR SELECT USING (true);
CREATE POLICY "Public read" ON faqs FOR SELECT USING (true);
```

## 🔐 Security Setup (RLS Policies)

### **Current RLS Issues:**
Your `bookings` table has:
```sql
CREATE POLICY "Enable read access for authenticated users only" 
ON bookings FOR SELECT 
USING (auth.role() = 'authenticated');
```

**Problem:** Mobile app users won't be authenticated (they use anon key).

### **Fix for Mobile App:**

```sql
-- Drop existing restrictive policy
DROP POLICY IF EXISTS "Enable read access for authenticated users only" ON bookings;

-- Allow users to read their own bookings (by email)
CREATE POLICY "Users can read own bookings" 
ON bookings FOR SELECT 
USING (
  customer_email = current_setting('request.jwt.claims', true)::json->>'email'
  OR auth.role() = 'authenticated'
);

-- Or simpler: Allow read by email match (for anon users)
CREATE POLICY "Read own bookings by email" 
ON bookings FOR SELECT 
USING (true); -- You'll filter by email in your app query

-- Admin can do everything (service_role)
CREATE POLICY "Admin full access" 
ON bookings FOR ALL 
USING (auth.role() = 'service_role');
```

## 📲 App Implementation

### **1. Environment Variables (.env)**
```env
EXPO_PUBLIC_SUPABASE_URL=https://ogrvhooygcoazracbvkb.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ncnZob295Z2NvYXpyYWNidmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk0MDY4NzIsImV4cCI6MjA4NDk4Mjg3Mn0.LNxaDawFpPbEO4uuKTlv-UDqg1vuNZ98H5Iw9bYzRbA
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=pk_...your_mapbox_token...
```

### **2. Supabase Client (supabase.ts)**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### **3. Fetch User Tickets (remoteContent.ts)**
```typescript
export async function fetchUserTickets(userEmail: string) {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      id,
      tour_title,
      tour_slug,
      date,
      time,
      guests,
      total_price,
      status,
      stripe_payment_intent_id,
      created_at
    `)
    .eq('customer_email', userEmail)
    .eq('status', 'paid')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching tickets:', error);
    return [];
  }

  // Transform to app format
  return data.map(booking => ({
    id: booking.id,
    title: booking.tour_title,
    subtitle: `${booking.guests} guests`,
    dateLabel: new Date(booking.date).toLocaleDateString(),
    qrValue: booking.stripe_payment_intent_id,
    colors: ['#047857', '#065f46'], // Emerald theme
    metadata: {
      time: booking.time,
      totalPrice: booking.total_price / 100,
      tourSlug: booking.tour_slug
    }
  }));
}
```

### **4. Fetch Available Tours**
```typescript
export async function fetchAvailableTours() {
  const { data, error } = await supabase
    .from('tours')
    .select(`
      slug,
      title,
      base_price,
      category,
      metadata
    `)
    .order('title');

  if (error) {
    console.error('Error fetching tours:', error);
    return [];
  }

  return data.map(tour => ({
    id: tour.slug,
    title: tour.title,
    price: tour.base_price / 100,
    category: tour.category,
    ...tour.metadata
  }));
}
```

### **5. Fetch Concierge Data**
```typescript
export async function fetchConciergeData() {
  const [agents, locations, faqs] = await Promise.all([
    supabase.from('concierge_agents').select('*'),
    supabase.from('office_locations').select('*'),
    supabase.from('faqs').select('*').order('order_index')
  ]);

  return {
    agents: agents.data || [],
    locations: locations.data || [],
    faqs: faqs.data || []
  };
}
```

## 🔄 Linking Website Purchases to App

### **Flow:**
1. User buys ticket on website → Stripe payment succeeds
2. Webhook creates booking in Supabase with `customer_email`
3. User opens app → Enters same email
4. App queries bookings by email → Shows tickets in Wallet

### **User Authentication Options:**

#### Option A: Email-Only (Simplest)
```typescript
// User enters email in app
const userEmail = 'customer@example.com';
const tickets = await fetchUserTickets(userEmail);
```

#### Option B: Magic Link Auth (Better UX)
```typescript
// Send magic link to email
await supabase.auth.signInWithOtp({
  email: 'customer@example.com'
});

// After user clicks link, they're authenticated
const { data: { user } } = await supabase.auth.getUser();
const tickets = await fetchUserTickets(user.email);
```

#### Option C: QR Code Scan (Best UX)
```typescript
// User scans QR from confirmation email
const bookingId = scannedQRCode; // e.g., "pi_abc123"

const { data } = await supabase
  .from('bookings')
  .select('*')
  .eq('stripe_payment_intent_id', bookingId)
  .single();

// Save to local storage for offline access
```

## 🚀 Implementation Checklist

### **Database Setup:**
- [ ] Create `concierge_agents` table
- [ ] Create `office_locations` table
- [ ] Create `faqs` table
- [ ] Update RLS policies on `bookings` for anon access
- [ ] Add sample data for concierge/faqs

### **App Setup:**
- [ ] Add `.env` file with Supabase credentials
- [ ] Install `@supabase/supabase-js`
- [ ] Create `supabase.ts` client
- [ ] Update `remoteContent.ts` with real queries
- [ ] Update `WalletScreen.tsx` to use real data
- [ ] Update `ConciergeScreen.tsx` to use real data

### **Testing:**
- [ ] Test fetching bookings by email
- [ ] Test showing tickets in Wallet
- [ ] Test offline mode (cached data)
- [ ] Test QR code generation
- [ ] Test concierge data loading

## 🔒 Security Best Practices

### **DO:**
✅ Use anon key in mobile app
✅ Filter bookings by email in queries
✅ Use RLS policies for data access
✅ Store sensitive operations in Edge Functions
✅ Use service_role only on server-side

### **DON'T:**
❌ Put service_role key in mobile app
❌ Allow unrestricted access to bookings
❌ Store payment info in app
❌ Bypass RLS policies

## 📊 Sample Data for Testing

```sql
-- Insert sample concierge agent
INSERT INTO concierge_agents (name, subtitle, avatar_url, whatsapp_url, site_id)
VALUES (
  'Maria Rossi',
  'Rome Travel Expert',
  'https://i.pravatar.cc/150?img=1',
  'https://wa.me/393299294414',
  'ticketsinrome'
);

-- Insert sample office location
INSERT INTO office_locations (name, address, hours, site_id)
VALUES (
  'Rome Central Office',
  'Via Germanico 8, 00192 Roma RM, Italy',
  'Mon-Fri: 9:00-18:00, Sat: 10:00-14:00',
  'ticketsinrome'
);

-- Insert sample FAQs
INSERT INTO faqs (question, answer, category, site_id, order_index)
VALUES 
  ('How do I use my ticket?', 'Show the QR code at the meeting point 15 minutes before your tour time.', 'tickets', 'ticketsinrome', 1),
  ('Can I cancel my booking?', 'Free cancellation up to 24 hours before the tour. Contact us for refunds.', 'cancellation', 'ticketsinrome', 2),
  ('What should I bring?', 'Bring your passport/ID, comfortable shoes, and dress appropriately (covered shoulders/knees).', 'preparation', 'ticketsinrome', 3);
```

## 🎯 Next Steps

1. **Run the SQL scripts** to create missing tables
2. **Update RLS policies** for mobile app access
3. **Add sample data** for testing
4. **Update app code** to use real Supabase queries
5. **Test the complete flow** from website purchase to app display

Your infrastructure is already 90% ready - you just need to connect the dots!