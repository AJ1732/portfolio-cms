/**
 * Script to import snippet items into Sanity
 *
 * This script creates snippet documents from the DETAILS array.
 * The orderRank field will be managed by the @sanity/orderable-document-list plugin
 * when documents are first viewed/reordered in the Studio.
 *
 * Usage: SANITY_WRITE_TOKEN=your_token node scripts/import-snippets.js
 */

import { getSanityClient, printTokenInstructions } from './utils/client.js'

// Snippet definitions (from DETAILS array, excluding height)
const SNIPPETS = [
  {
    id: '1',
    text: "Well... Apart from English, I'm Proficient in languages such as HTML, CSS, JavaScript and TypeScript",
  },
  {
    id: '2',
    text: 'Familar with Backend technologies like NodeJS, ExpressJS, MongoDB, SQL / PostgreSQL, to make RESTful APIs',
  },
  {
    id: '3',
    text: 'I explore Data Structures like Stacks, Queues, List, Linked list and Hashmaps and Algorithms like Linear Search and Binary search in Development to enhance problem-solving skills. As well as the concept of Big O notation and space  complexity',
  },
  {
    id: '5',
    text: 'Women Techster Fellowship Class of 2024 Alumni, specilized in Software Development - Frontend Specialization',
  },
  {
    id: '6',
    text: "I'm an Alumni of AltSchool Africa - School of Engineering",
  },
  {
    id: '7',
    text: 'I am highly comfortable working within the terminal environment. I regularly use the terminal for tasks such as navigating the file system, managing files and directories, and executing various commands. I have a solid grasp of basic Linux command-line operations. Usually operations in file manipulation, searching, and text processing.',
  },
  {
    id: '8',
    text: "I've engaged in Version Control and Collaboration by using Git and GitHub. I've even done collabs where teamwork makes the dream code work... Did I make you cringe? Sorry, not sorry.",
  },
  {
    id: '9',
    text: 'Experience in designing and implementing CI/CD pipelines using GitHub Actions, automating build, test, and deployment workflows for faster, more reliable releases.',
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
 * Create a snippet document in Sanity
 */
async function createSnippetDocument(client, snippet, index) {
  const document = {
    _type: 'snippet',
    _id: `snippet-${snippet.id}`, // Use id-based document ID for idempotency
    text: snippet.text,
    orderRank: generateOrderRank(index, SNIPPETS.length), // Initial orderRank
  }

  try {
    // Use createOrReplace to make script idempotent (can run multiple times)
    const result = await client.createOrReplace(document)
    console.log(`✅ Created/Updated: Snippet ${snippet.id}`)
    return result
  } catch (error) {
    console.error(`❌ Failed to create snippet ${snippet.id}:`, error.message)
    return null
  }
}

/**
 * Main import function
 */
async function importSnippets() {
  console.log('🚀 Starting snippet import...\n')

  let client
  try {
    client = getSanityClient()
  } catch {
    printTokenInstructions()
    process.exit(1)
  }

  const results = []

  console.log(`📊 Processing ${SNIPPETS.length} snippets...\n`)

  for (let i = 0; i < SNIPPETS.length; i++) {
    const snippet = SNIPPETS[i]
    const result = await createSnippetDocument(client, snippet, i)
    results.push(result)

    // Small delay to avoid rate limiting
    if (i < SNIPPETS.length - 1) {
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
  console.log('💡 Note: You can reorder snippets in the Studio using drag-and-drop.')
  console.log('   The orderRank will be automatically updated by the orderable plugin.')
}

// Run the import
importSnippets().catch((error) => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})
