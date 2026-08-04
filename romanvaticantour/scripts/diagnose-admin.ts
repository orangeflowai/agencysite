/**
 * Diagnostic script: Check Supabase state for admin user and bookings.
 * Usage: npx tsx scripts/diagnose-admin.ts
 */
import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '..', '.env') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

async function main() {
  console.log('=== DIAGNOSTIC: Supabase State ===\n')

  // 1. Check admin user
  console.log('--- Admin User: hakim@gmail.com ---')
  const { data: users } = await supabaseAdmin.auth.admin.listUsers()
  const hakim = users?.users?.find(u => u.email === 'hakim@gmail.com')
  if (hakim) {
    console.log(`  Found: id=${hakim.id}`)
    console.log(`  app_metadata:`, JSON.stringify(hakim.app_metadata))
    console.log(`  user_metadata:`, JSON.stringify(hakim.user_metadata))
    const role = hakim.app_metadata?.role ?? hakim.user_metadata?.role
    console.log(`  Effective role: ${role || 'NONE'}`)
    if (role !== 'admin') {
      console.log('  ❌ NOT ADMIN — needs promotion')
    } else {
      console.log('  ✅ Is admin')
    }
  } else {
    console.log('  ❌ NOT FOUND in Supabase Auth')
  }

  // 2. Check bookings table structure
  console.log('\n--- Bookings Table ---')
  const { data: bookings, error: bookingsError } = await supabaseAdmin
    .from('bookings')
    .select('*', { count: 'exact' })
    .limit(5)

  if (bookingsError) {
    console.log(`  ❌ Query error: ${bookingsError.message}`)
    if (bookingsError.message.includes('site_id')) {
      console.log('  → site_id column missing — migration not run')
    }
  } else {
    console.log(`  Total bookings: ${bookings?.length ?? 0} (showing up to 5)`)
    if (bookings && bookings.length > 0) {
      const first = bookings[0]
      console.log(`  Columns:`, Object.keys(first).join(', '))
      console.log(`  Has site_id: ${('site_id' in first) ? 'YES' : 'NO'}`)
      if ('site_id' in first) {
        const siteIds = [...new Set(bookings.map(b => (b as any).site_id))]
        console.log(`  site_id values:`, siteIds)
      }
      bookings.forEach(b => {
        console.log(`  - ${(b as any).customer_name} | ${(b as any).tour_title} | ${(b as any).date} | status=${(b as any).status}`)
      })
    } else {
      console.log('  Table exists but empty')
    }
  }

  // 3. Check inventory table
  console.log('\n--- Inventory Table ---')
  const { data: inventory, error: invError } = await supabaseAdmin
    .from('inventory')
    .select('*', { count: 'exact' })
    .limit(3)

  if (invError) {
    console.log(`  ❌ Error: ${invError.message}`)
  } else {
    console.log(`  Total rows: ${inventory?.length ?? 0} (showing up to 3)`)
    if (inventory && inventory.length > 0) {
      console.log(`  Columns:`, Object.keys(inventory[0]).join(', '))
      inventory.forEach(i => {
        console.log(`  - ${(i as any).tour_slug} | ${(i as any).date} | ${(i as any).time} | slots=${(i as any).available_slots}`)
      })
    }
  }

  // 4. Check RLS policies
  console.log('\n--- RLS Policies on bookings ---')
  const { data: policies, error: polError } = await supabaseAdmin.rpc('get_policies', { table_name: 'bookings' }).maybeSingle()
  // RPC might not exist, try raw query
  const { data: rawPol, error: rawPolErr } = await supabaseAdmin
    .from('pg_policies')
    .select('*')
    .eq('tablename', 'bookings')

  if (rawPolErr) {
    console.log(`  Could not query pg_policies: ${rawPolErr.message}`)
  } else {
    console.log(`  Found ${rawPol?.length ?? 0} policies`)
    rawPol?.forEach((p: any) => {
      console.log(`  - ${p.policyname}: ${p.cmd} USING (${p.qual})`)
    })
  }

  console.log('\n=== DIAGNOSTIC COMPLETE ===')
}

main().catch(err => {
  console.error('Fatal:', err)
  process.exit(1)
})
