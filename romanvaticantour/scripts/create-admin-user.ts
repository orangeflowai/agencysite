/**
 * Create or promote an admin user in Supabase Auth.
 *
 * Usage:
 *   npx tsx scripts/create-admin-user.ts <email> <password>
 *
 * The script uses SUPABASE_SERVICE_ROLE_KEY to set app_metadata.role = 'admin',
 * which is the only metadata field trusted by apiAuth.ts and middleware.
 *
 * app_metadata can ONLY be set with the service role key — users cannot
 * self-escalate via signup. user_metadata is explicitly not trusted for the
 * admin role check (see src/lib/apiAuth.ts).
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import { resolve } from 'path'

dotenv.config({ path: resolve(__dirname, '..', '.env') })

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function main() {
  const args = process.argv.slice(2)
  if (args.length < 2) {
    console.error('Usage: npx tsx scripts/create-admin-user.ts <email> <password>')
    process.exit(1)
  }

  const [email, password] = args

  console.log(`\nCreating admin user: ${email}\n`)

  // Check if user already exists
  const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()

  const existing = existingUsers?.users?.find(
    (u) => u.email?.toLowerCase() === email.toLowerCase()
  )

  if (existing) {
    console.log(`User ${email} already exists (id: ${existing.id})`)
    console.log(`Current app_metadata:`, JSON.stringify(existing.app_metadata))
    console.log(`Current user_metadata:`, JSON.stringify(existing.user_metadata))

    // Update app_metadata to include admin role
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
      existing.id,
      {
        app_metadata: { ...existing.app_metadata, role: 'admin' },
        password, // reset password to provided value
      }
    )

    if (updateError) {
      console.error('Failed to update user:', updateError.message)
      process.exit(1)
    }

    console.log(`\nPromoted ${email} to admin. New app_metadata: { role: "admin" }`)
    console.log('Password has been reset to the provided value.\n')
    return
  }

  // Create new admin user
  const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    app_metadata: { role: 'admin' },
    user_metadata: { role: 'admin' }, // mirror for display purposes only — auth checks use app_metadata
  })

  if (createError) {
    console.error('Failed to create user:', createError.message)
    process.exit(1)
  }

  console.log(`Created admin user: ${newUser.user?.email}`)
  console.log(`User ID: ${newUser.user?.id}`)
  console.log(`app_metadata: { role: "admin" }`)
  console.log(`\nAdmin user ready. Login at /admin/login\n`)
}

main().catch((err) => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
