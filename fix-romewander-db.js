#!/usr/bin/env node
/**
 * Fix Rome Wander Tours - Direct Database Update
 * Sets Vatican tours to LIVE, archives non-Vatican tours
 */

const { Pool } = require('pg')

// Database connection from environment
const DATABASE_URI = process.env.DATABASE_URI

if (!DATABASE_URI) {
  console.error('❌ DATABASE_URI not found in environment')
  process.exit(1)
}

const pool = new Pool({
  connectionString: DATABASE_URI,
  ssl: { rejectUnauthorized: false }
})

async function main() {
  console.log('🔧 Rome Wander Tours - Database Fix')
  console.log('=' .repeat(60))
  console.log('')

  try {
    // Step 1: Check current status
    console.log('📊 Current status:')
    const currentStatus = await pool.query(`
      SELECT status, COUNT(*) as count 
      FROM tours 
      WHERE tenant = 'romewander' 
      GROUP BY status
    `)
    currentStatus.rows.forEach(row => {
      console.log(`   ${row.status}: ${row.count} tours`)
    })
    console.log('')

    // Step 2: Update Vatican tours to LIVE
    console.log('🔄 Setting Vatican tours to LIVE...')
    const vaticanUpdate = await pool.query(`
      UPDATE tours 
      SET 
        status = 'live', 
        active = true, 
        "updatedAt" = NOW()
      WHERE tenant = 'romewander' 
      AND (
        category = 'vatican' 
        OR title ILIKE '%vatican%'
        OR title ILIKE '%sistine%'
        OR title ILIKE '%st. peter%'
        OR title ILIKE '%st peter%'
      )
      RETURNING id, title
    `)
    console.log(`   ✅ Updated ${vaticanUpdate.rowCount} Vatican tours`)
    console.log('')

    // Step 3: Archive non-Vatican tours
    console.log('📦 Archiving non-Vatican tours...')
    const archiveUpdate = await pool.query(`
      UPDATE tours 
      SET 
        status = 'archived', 
        active = false, 
        "updatedAt" = NOW()
      WHERE tenant = 'romewander' 
      AND category != 'vatican'
      AND title NOT ILIKE '%vatican%'
      AND title NOT ILIKE '%sistine%'
      AND title NOT ILIKE '%st. peter%'
      AND title NOT ILIKE '%st peter%'
      RETURNING id, title
    `)
    console.log(`   ✅ Archived ${archiveUpdate.rowCount} non-Vatican tours`)
    console.log('')

    // Step 4: Show updated status
    console.log('✅ Updated status:')
    const newStatus = await pool.query(`
      SELECT status, COUNT(*) as count 
      FROM tours 
      WHERE tenant = 'romewander' 
      GROUP BY status
    `)
    newStatus.rows.forEach(row => {
      console.log(`   ${row.status}: ${row.count} tours`)
    })
    console.log('')

    // Step 5: List Vatican tours now live
    console.log('📋 Vatican tours now LIVE:')
    const liveTours = await pool.query(`
      SELECT title 
      FROM tours 
      WHERE tenant = 'romewander' 
      AND status = 'live' 
      ORDER BY title
      LIMIT 10
    `)
    liveTours.rows.forEach((row, i) => {
      console.log(`   ${i + 1}. ${row.title}`)
    })
    if (vaticanUpdate.rowCount > 10) {
      console.log(`   ... and ${vaticanUpdate.rowCount - 10} more`)
    }
    console.log('')

    console.log('✅ Database update complete!')
    console.log('')
    console.log('Next steps:')
    console.log('1. Visit https://admin.wondersofrome.com/admin/collections/tours')
    console.log('2. Verify Vatican tours are live')
    console.log('3. Redeploy Rome Wander on Vercel OR wait 1 hour for cache')
    console.log('4. Visit https://romewander.com')
    console.log('')

  } catch (error) {
    console.error('❌ Error:', error.message)
    process.exit(1)
  } finally {
    await pool.end()
  }
}

main()
