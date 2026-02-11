/**
 * Script to import certificate items into Sanity
 *
 * This script creates certificate documents from the CERTIFICATES array.
 * Images are NOT uploaded - they must be added manually in the Studio.
 * The orderRank field will be managed by the @sanity/orderable-document-list plugin
 * when documents are first viewed/reordered in the Studio.
 *
 * Usage: SANITY_WRITE_TOKEN=your_token node scripts/import-certificates.js
 */

import { getSanityClient, printTokenInstructions } from './utils/client.js'

// Certificate definitions (from CERTIFICATES array, excluding images)
const CERTIFICATES = [
  {
    issuingOrg: 'AltSchool Africa',
    title: 'AltSchool Africa Graduation Diploma',
    alt: "Graduated from AltSchool Africa's School of Engineering, Frontend Engineering Track",
    link: 'https://cdn.sanity.io/media-libraries/mlu3DBU0QaKb/images/9a18ce25a90f9f9635956d5d827a94914133dc4f-799x617.png',
  },
  {
    issuingOrg: 'HNG',
    title: 'HNG 12 internship program Finalist Certificate',
    alt: 'HNG 12 Finaist in Frontend Engineering',
    link: 'https://cdn.sanity.io/media-libraries/mlu3DBU0QaKb/images/49db67b2cb094cbeb3dae4fb1f8021b30c77086d-800x559.png',
  },
  {
    issuingOrg: 'Tech4Dev',
    title: 'Women Techsters Fellowship Program, Class of 2024',
    alt: 'Tech4Dev - Women Techsters Fellowship Class of 2024 Program: Software Development (Frontend)',
    link: 'https://lavender-shandee-9.tiiny.site/',
  },
  {
    issuingOrg: 'DevCareer',
    title: 'DevCareer Tech Program: Frontend Engineering',
    alt: 'DevCareer - DevCareer Tech Program: Frontend Engineering Certificate',
    link: 'https://i.imghippo.com/files/xh6275rcU.png',
  },
  {
    issuingOrg: 'Coursera',
    title: 'Meta Front-End Developer Specialization: Advanced React',
    alt: 'Coursera - Meta Front-End Developer Specialization: Advanced React Certificate',
    link: 'https://www.coursera.org/account/accomplishments/certificate/4FWZFNU8GHWR',
  },
  {
    issuingOrg: 'Coursera',
    title: 'Meta Front-End Developer Specialization: React Basics',
    alt: 'Coursera - Meta Front-End Developer Specialization: React Basics Certificate',
    link: 'https://www.coursera.org/account/accomplishments/certificate/DW4CNFUD9AJG',
  },
  {
    issuingOrg: 'Coursera',
    title: 'Meta Front-End Developer Specialization: Programming with JavaScript',
    alt: 'Coursera - Meta Front-End Developer Specialization: Programming with JavaScript Certificate',
    link: 'https://www.coursera.org/account/accomplishments/certificate/WNSWLS292JFC',
  },
  {
    issuingOrg: 'Coursera',
    title: 'Meta Front-End Developer Specialization: HTML and CSS in depth',
    alt: 'Coursera - Meta Front-End Developer Specialization: HTML and CSS in depth Certificate',
    link: 'https://www.coursera.org/account/accomplishments/certificate/RUWZMZJUUBW7',
  },
  {
    issuingOrg: 'Udemy',
    title: 'The Complete 2023 Web Development Bootcamp',
    alt: 'Udemy - The Complete 2023 Web Development Bootcamp Certificate',
    link: 'https://www.udemy.com/certificate/UC-3a853897-2f20-4fc8-87c8-83d4f657e9ae/',
  },
  {
    issuingOrg: 'Stutern',
    title: 'Stutern Klusterthon Hackathon 2023',
    alt: 'Stutern - Stutern Klusterthon Hackathon 2023 Certificate',
    link: 'https://i.imghippo.com/files/dyw9480Hk.png',
  },
  {
    issuingOrg: 'freeCodeCamp',
    title: 'Responsive Web Design',
    alt: 'freeCodeCamp - Responsive Web Design',
    link: 'https://freecodecamp.org/certification/Ejemen/responsive-web-design',
  },
]

/**
 * Generate initial orderRank value for ordering
 * Uses a simple fractional indexing approach for initial ordering
 */
function generateOrderRank(index, total) {
  // Generate a string that sorts correctly: 0|0000, 0|0001, etc.
  const padded = String(index).padStart(4, '0')
  return `0|${padded}:`
}

/**
 * Generate a document ID from certificate data
 */
function generateDocumentId(certificate, index) {
  // Create a slug-like ID from issuing org and title
  const orgSlug = certificate.issuingOrg.toLowerCase().replace(/\s+/g, '-')
  const titleSlug = certificate.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 30)
  return `certificate-${orgSlug}-${titleSlug}`.substring(0, 100) // Sanity ID limit
}

/**
 * Create a certificate document in Sanity
 * Note: Image field is left empty - must be added manually in Studio
 */
async function createCertificateDocument(client, certificate, index) {
  const document = {
    _type: 'certificate',
    _id: generateDocumentId(certificate, index),
    issuingOrg: certificate.issuingOrg,
    title: certificate.title,
    link: certificate.link,
    // Image field is intentionally omitted - will be added manually
    // Alt text will be set when image is uploaded in Studio
    orderRank: generateOrderRank(index, CERTIFICATES.length),
  }

  try {
    // Use createOrReplace to make script idempotent (can run multiple times)
    const result = await client.createOrReplace(document)
    console.log(`✅ Created/Updated: ${certificate.title}`)
    return result
  } catch (error) {
    console.error(`❌ Failed to create ${certificate.title}:`, error.message)
    return null
  }
}

/**
 * Main import function
 */
async function importCertificates() {
  console.log('🚀 Starting certificate import...\n')
  console.log('⚠️  Note: Images will NOT be uploaded. Add them manually in Studio.\n')

  let client
  try {
    client = getSanityClient()
  } catch {
    printTokenInstructions()
    process.exit(1)
  }

  const results = []

  console.log(`📊 Processing ${CERTIFICATES.length} certificates...\n`)

  for (let i = 0; i < CERTIFICATES.length; i++) {
    const certificate = CERTIFICATES[i]
    const result = await createCertificateDocument(client, certificate, i)
    results.push(result)

    // Small delay to avoid rate limiting
    if (i < CERTIFICATES.length - 1) {
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
  console.log('\n📸 Next steps:')
  console.log('   1. Open Sanity Studio')
  console.log('   2. Go to Certificates section')
  console.log('   3. You may see validation warnings (expected - images are required)')
  console.log('   4. Upload images for each certificate manually')
  console.log('   5. Add alt text when uploading (see alt values in CERTIFICATES array above)')
  console.log('\n💡 Note: You can reorder certificates in the Studio using drag-and-drop.')
  console.log('   The orderRank will be automatically updated by the orderable plugin.')
}

// Run the import
importCertificates().catch((error) => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})
