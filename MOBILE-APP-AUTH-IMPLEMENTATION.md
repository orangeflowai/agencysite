# 🔐 Secure Mobile App Authentication Guide

## 🎯 Current vs Secure Approach

### ❌ Current (Insecure):
```typescript
// User enters email → App queries all bookings with that email
// Problem: Anyone can try different emails and see bookings
const tickets = await supabase
  .from('bookings')
  .select('*')
  .eq('customer_email', userEmail);  // ❌ Not secure!
```

### ✅ Secure (With Auth):
```typescript
// User signs in with magic link → Only sees their own bookings
// RLS ensures they can ONLY access their user_id
const { data: { user } } = await supabase.auth.getUser();
const tickets = await supabase
  .from('bookings')
  .select('*')
  .eq('user_id', user.id);  // ✅ Secure!
```

## 🚀 Implementation Steps

### Step 1: Run Secure Auth SQL Script
```bash
# In Supabase Dashboard → SQL Editor
# Run: supabase-secure-auth-setup.sql
```

This will:
- ✅ Add `user_id` column to bookings
- ✅ Update RLS policies to be secure
- ✅ Create trigger to auto-link bookings
- ✅ Link existing bookings to users

### Step 2: Update Mobile App Code

#### A. Install Supabase Auth (if not already)
```bash
cd D:\bot\wondersofrome_app
npm install @supabase/supabase-js
```

#### B. Create Auth Screen (`src/screens/AuthScreen.tsx`)
```typescript
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../lib/supabase';

export default function AuthScreen({ onAuthSuccess }: { onAuthSuccess: () => void }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleMagicLink = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase().trim(),
        options: {
          emailRedirectTo: 'wondersofrome://auth/callback',
        },
      });

      if (error) throw error;

      Alert.alert(
        'Check your email!',
        `We sent a magic link to ${email}. Click the link to sign in.`,
        [{ text: 'OK', onPress: onAuthSuccess }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Sign In
      </Text>
      <Text style={{ marginBottom: 10, color: '#666' }}>
        Enter your email to receive a magic link
      </Text>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#ddd',
          padding: 15,
          borderRadius: 8,
          marginBottom: 15,
        }}
        placeholder="your@email.com"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />
      <TouchableOpacity
        style={{
          backgroundColor: '#047857',
          padding: 15,
          borderRadius: 8,
          alignItems: 'center',
        }}
        onPress={handleMagicLink}
        disabled={loading}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>
          {loading ? 'Sending...' : 'Send Magic Link'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
```

#### C. Update Wallet Screen (`src/screens/WalletScreen.tsx`)
```typescript
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import AuthScreen from './AuthScreen';

export default function WalletScreen() {
  const [user, setUser] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is signed in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserTickets();
    }
  }, [user]);

  const fetchUserTickets = async () => {
    try {
      const { data, error } = await supabase
        .from('user_tickets')  // Uses secure view with RLS
        .select('*')
        .order('date', { ascending: false });

      if (error) throw error;
      setTickets(data || []);
    } catch (error) {
      console.error('Error fetching tickets:', error);
    }
  };

  // Show auth screen if not signed in
  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <AuthScreen onAuthSuccess={() => {}} />;
  }

  // Show tickets (existing code)
  return (
    <View>
      {/* Your existing ticket display code */}
      {tickets.map(ticket => (
        <TicketCard key={ticket.id} ticket={ticket} />
      ))}
    </View>
  );
}
```

#### D. Update Supabase Client (`src/lib/supabase.ts`)
```typescript
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

### Step 3: Update Webhook to Set user_id

In your webhook code (`src/app/api/webhooks/stripe/route.ts`):

```typescript
// After getting customer_email from Stripe metadata
const customer_email = metadata.leadEmail || paymentIntent.receipt_email;

// Check if user exists
const { data: existingUser } = await supabaseAdmin
  .auth.admin.listUsers();

const user = existingUser.users.find(u => u.email === customer_email);

// Create booking with user_id if user exists
const { data: booking, error: bookingError } = await supabaseAdmin
  .from('bookings')
  .insert({
    // ... other fields
    customer_email: customer_email,
    user_id: user?.id || null,  // ✅ Link to user if exists
  });
```

## 🔄 Migration Flow

### For Existing Users:
1. User buys ticket on website → Booking created with `customer_email` only
2. User opens app → Signs in with magic link
3. Trigger automatically links all their bookings to `user_id`
4. User sees all their tickets securely

### For New Users:
1. User buys ticket on website → Booking created with `customer_email`
2. User opens app → Signs in with magic link (creates account)
3. Trigger links booking to new `user_id`
4. User sees ticket immediately

## 📊 Testing

### Test Secure Auth:
```sql
-- In Supabase SQL Editor

-- 1. Check if user_id column exists
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'bookings' 
  AND column_name = 'user_id';

-- 2. Check RLS policies
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'bookings';

-- 3. Check linked bookings
SELECT 
  COUNT(*) FILTER (WHERE user_id IS NOT NULL) as linked,
  COUNT(*) FILTER (WHERE user_id IS NULL) as unlinked
FROM bookings;
```

### Test in App:
1. Open app → Should show auth screen
2. Enter email → Receive magic link
3. Click link → Sign in
4. See tickets → Only your bookings

## 🎯 Summary

### What You Need to Do:

**Option A: Keep Current (Quick but Insecure)**
- ✅ Just add `.env` file
- ✅ Restart app
- ⚠️ Anyone can query bookings by email

**Option B: Implement Secure Auth (Recommended)**
- ✅ Run `supabase-secure-auth-setup.sql`
- ✅ Update app code with auth screens
- ✅ Update webhook to set `user_id`
- ✅ Production-ready security

### My Recommendation:
Start with **Option A** to test quickly, then implement **Option B** before launching to users.

Would you like me to help implement the secure auth version?