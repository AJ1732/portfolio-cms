/**
 * Script to import contact link items into Sanity
 *
 * This script creates contact link documents from the CONTACTS array.
 *
 * Usage: SANITY_WRITE_TOKEN=your_token node scripts/import-contact-links.js
 */

import { getSanityClient, printTokenInstructions } from './utils/client.js'

// Contact link definitions (from CONTACTS array)
const CONTACTS = [
  {
    label: 'linkedin',
    link: 'https://www.linkedin.com/in/osezeleiboi/',
  },
  {
    label: 'github',
    link: 'https://github.com/AJ1732',
  },
  {
    label: 'twitter',
    link: 'https://twitter.com/ejemeniboi',
  },
  {
    label: 'email',
    link: 'ejemeniboi@gmail.com',
  },
]

/**
 * Generate a document ID from contact key
 */
function generateDocumentId(key) {
  return `contact-${key.toLowerCase()}`
}

/**
 * Generate display name from key (uppercase first letter of each word)
 */
function generateName(key) {
  return key
    .split(/(?=[A-Z])|[-_\s]/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('')
}

/**
 * Create a contact link document in Sanity
 */
async function createContactLinkDocument(client, contact) {
  const key = contact.label.toLowerCase()
  const name = generateName(contact.label)

  const document = {
    _type: 'contactLink',
    _id: generateDocumentId(key),
    key: key,
    name: name,
    link: contact.link,
  }

  try {
    // Use createOrReplace to make script idempotent (can run multiple times)
    const result = await client.createOrReplace(document)
    console.log(`✅ Created/Updated: ${name} (key: ${key})`)
    return result
  } catch (error) {
    console.error(`❌ Failed to create ${name}:`, error.message)
    return null
  }
}

/**
 * Main import function
 */
async function importContactLinks() {
  console.log('🚀 Starting contact links import...\n')

  let client
  try {
    client = getSanityClient()
  } catch {
    printTokenInstructions()
    process.exit(1)
  }

  const results = []

  console.log(`📊 Processing ${CONTACTS.length} contact links...\n`)

  for (let i = 0; i < CONTACTS.length; i++) {
    const contact = CONTACTS[i]
    const result = await createContactLinkDocument(client, contact)
    results.push(result)

    // Small delay to avoid rate limiting
    if (i < CONTACTS.length - 1) {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }

  const successful = results.filter((r) => r !== null).length
  const failed = results.filter((r) => r === null).length

  console.log('\n' + '='.repeat(60))
  console.log('📊 Import Summary:')
  console.log(`✅ Successful: ${successful}`)
  console.log(`❌ Failed: ${failed}`)
  console.log(`📦 Total: ${results.length}`)
  console.log('='.repeat(60))

  if (failed > 0) {
    console.log('\n⚠️  Some imports failed. Check the logs above for details.')
    process.exit(1)
  }

  console.log('\n🎉 Import completed successfully!')
  console.log('💡 Contact links are now available in your Sanity Studio.')
}

// Run the import
importContactLinks().catch((error) => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})
