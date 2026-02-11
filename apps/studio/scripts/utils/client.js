/**
 * Shared Sanity client configuration for import scripts
 *
 * This module provides a configured Sanity client instance
 * that all import scripts can use to avoid code duplication.
 */

import { createClient } from '@sanity/client'

/**
 * Creates and returns a configured Sanity client
 * Requires SANITY_WRITE_TOKEN environment variable
 */
export function getSanityClient() {
  if (!process.env.SANITY_WRITE_TOKEN) {
    throw new Error('SANITY_WRITE_TOKEN environment variable is required')
  }

  return createClient({
    projectId: 'rlnho0c7',
    dataset: 'production',
    useCdn: false,
    apiVersion: '2025-01-07',
    token: process.env.SANITY_WRITE_TOKEN,
  })
}

/**
 * Helper function to display token setup instructions
 */
export function printTokenInstructions() {
  console.error('❌ Error: SANITY_WRITE_TOKEN environment variable is required')
  console.log('\nTo create a token:')
  console.log('1. Visit https://sanity.io/manage/project/rlnho0c7/api/tokens')
  console.log('2. Create a new token with "Editor" or "Administrator" permissions')
  console.log('3. Run: SANITY_WRITE_TOKEN=your_token_here node scripts/your-script.js\n')
}
