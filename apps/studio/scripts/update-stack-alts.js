#!/usr/bin/env node

/**
 * Update Stack Alt Text Script
 *
 * Updates all stack documents to add auto-generated alt text
 * based on the stack name: "[Name] logo"
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=your_token node scripts/update-stack-alts.js
 */

import { createClient } from '@sanity/client'

const client = createClient({
  projectId: 'rlnho0c7',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2025-01-07',
  token: process.env.SANITY_WRITE_TOKEN,
})

async function updateStackAlts() {
  console.log('🚀 Starting alt text update for stack documents...\n')

  try {
    // Fetch all stack documents
    const stacks = await client.fetch(`
      *[_type == "stack"] {
        _id,
        name,
        "currentAlt": icon.alt
      }
    `)

    console.log(`📊 Found ${stacks.length} stack documents\n`)

    let updated = 0
    let skipped = 0
    let failed = 0

    // Update each stack
    for (const stack of stacks) {
      const altText = `${stack.name} logo`

      // Skip if alt text already matches
      if (stack.currentAlt === altText) {
        console.log(`⏭️  ${stack.name}: Alt already correct`)
        skipped++
        continue
      }

      try {
        await client
          .patch(stack._id)
          .set({ 'icon.alt': altText })
          .commit()

        console.log(`✅ ${stack.name}: Updated to "${altText}"`)
        updated++
      } catch (error) {
        console.error(`❌ ${stack.name}: Failed to update`)
        console.error(`   Error: ${error.message}`)
        failed++
      }
    }

    console.log('\n' + '='.repeat(60))
    console.log('📊 Update Summary:')
    console.log(`✅ Updated: ${updated}`)
    console.log(`⏭️  Skipped: ${skipped}`)
    console.log(`❌ Failed: ${failed}`)
    console.log(`📦 Total: ${stacks.length}`)
    console.log('='.repeat(60))

    if (failed === 0) {
      console.log('\n🎉 Alt text update completed successfully!')
    } else {
      console.log('\n⚠️  Some updates failed. Check errors above.')
      process.exit(1)
    }
  } catch (error) {
    console.error('❌ Fatal error:', error.message)
    process.exit(1)
  }
}

// Validate environment
if (!process.env.SANITY_WRITE_TOKEN) {
  console.error('❌ SANITY_WRITE_TOKEN environment variable is required')
  console.error('\nUsage:')
  console.error('  SANITY_WRITE_TOKEN=your_token node scripts/update-stack-alts.js')
  process.exit(1)
}

// Run update
updateStackAlts()
