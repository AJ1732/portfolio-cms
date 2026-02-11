/**
 * Script to import stack items into Sanity with asset upload
 *
 * This script reads SVG files from the portfolio-next project, uploads them
 * as Sanity image assets, and creates stack documents with proper asset references.
 *
 * Usage: SANITY_WRITE_TOKEN=your_token node scripts/import-stacks.js
 */

import { getSanityClient, printTokenInstructions } from './utils/client.js'
import { readFileSync } from 'fs'
import { resolve } from 'path'

// Path to SVG directory in your Next.js project
const SVG_DIR = '/Users/mac/Documents/coding/portfolio/portfolio-next/public/svgs'

// Stack definitions with SVG file mappings
const STACKS = [
  { name: 'HTML', key: 'html', svgFile: 'html5.svg' },
  { name: 'CSS', key: 'css', svgFile: 'css.svg' },
  { name: 'JavaScript', key: 'javascript', svgFile: 'javascript.svg' },
  { name: 'TypeScript', key: 'typescript', svgFile: 'typescript.svg' },
  { name: 'React', key: 'react', svgFile: 'react.svg' },
  { name: 'Next.js', key: 'nextjs', svgFile: 'nextjs_icon_dark.svg' },
  { name: 'Vue', key: 'vue', svgFile: 'vue.svg' },
  { name: 'Tailwind CSS', key: 'tailwindcss', svgFile: 'tailwindcss.svg' },
  { name: 'Sass', key: 'sass', svgFile: 'sass.svg' },
  { name: 'Vite', key: 'vite', svgFile: 'vitejs.svg' },
  { name: 'Figma', key: 'figma', svgFile: 'figma.svg' },
  { name: 'Motion', key: 'motion', svgFile: 'motion_dark.svg' },
  { name: 'GSAP', key: 'gsap', svgFile: 'gsap.svg' },
  { name: 'Redux', key: 'redux', svgFile: 'redux.svg' },
  { name: 'TanStack Query', key: 'tanstack-query', svgFile: 'reactquery.svg' },
  { name: 'TanStack Router', key: 'tanstack-router', svgFile: 'tanstack.svg' },
  { name: 'Pinia', key: 'pinia', svgFile: 'pinia.svg' },
  { name: 'shadcn/ui', key: 'shadcn-ui', svgFile: 'shadcn_ui_light.svg' },
  { name: 'Sanity.io', key: 'sanity', svgFile: 'sanity.svg' },
  { name: 'Vim', key: 'vim', svgFile: 'vim.svg' },
  { name: 'Git', key: 'git', svgFile: 'git.svg' },
  { name: 'GitHub', key: 'github', svgFile: 'Github_light.svg' },
  { name: 'Node.js', key: 'nodejs', svgFile: 'nodejs.svg' },
  { name: 'Express.js', key: 'expressjs', svgFile: 'express_js_light.svg' },
  { name: 'MongoDB', key: 'mongodb', svgFile: 'mongodb.svg' },
  { name: 'PostgreSQL', key: 'postgresql', svgFile: 'postgresql.svg' },
  { name: 'GitHub Actions', key: 'github-actions', svgFile: 'github_actions.svg' },
  { name: 'Mistral AI', key: 'mistral-ai', svgFile: 'mistral-ai-logo.svg' },
]

/**
 * Read SVG file content
 */
function readSvg(filename) {
  const svgPath = resolve(SVG_DIR, filename)
  try {
    return readFileSync(svgPath, 'utf-8')
  } catch (error) {
    console.error(`❌ Failed to read ${filename}:`, error.message)
    return null
  }
}

/**
 * Upload SVG as Sanity image asset
 */
async function uploadSvgAsset(client, svgContent, filename) {
  const buffer = Buffer.from(svgContent, 'utf-8')

  try {
    const asset = await client.assets.upload('image', buffer, {
      filename: filename,
      contentType: 'image/svg+xml',
    })

    console.log(`  📤 Uploaded: ${filename} (${asset._id})`)

    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id
      }
    }
  } catch (error) {
    // Handle duplicate assets (Sanity uses content-based IDs)
    if (error.statusCode === 409 || error.message?.includes('already exists')) {
      console.log(`  ♻️  Asset exists: ${filename}`)

      // Find existing asset by filename
      const query = `*[_type == "sanity.imageAsset" && originalFilename == $filename][0]`
      const existing = await client.fetch(query, { filename })

      if (existing) {
        return {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: existing._id
          }
        }
      }
    }
    throw error
  }
}

/**
 * Create a stack document in Sanity
 */
async function createStackDocument(client, stack) {
  const svgContent = readSvg(stack.svgFile)

  if (!svgContent) {
    console.log(`⏭️  Skipping ${stack.name} - SVG file not found`)
    return null
  }

  console.log(`\n📦 Processing: ${stack.name}`)

  // Upload SVG as image asset
  const iconAsset = await uploadSvgAsset(client, svgContent, stack.svgFile)

  const document = {
    _type: 'stack',
    _id: stack.key, // Use key as ID for idempotency
    name: stack.name,
    key: stack.key,
    icon: iconAsset, // Asset reference instead of string
  }

  try {
    // Use createOrReplace to make script idempotent (can run multiple times)
    const result = await client.createOrReplace(document)
    console.log(`✅ Created/Updated: ${stack.name}`)
    return result
  } catch (error) {
    console.error(`❌ Failed to create ${stack.name}:`, error.message)
    return null
  }
}

/**
 * Main import function
 */
async function importStacks() {
  console.log('🚀 Starting stack import with asset uploads...\n')

  let client
  try {
    client = getSanityClient()
  } catch {
    printTokenInstructions()
    process.exit(1)
  }

  const BATCH_SIZE = 5
  const DELAY_MS = 200
  const results = []

  for (let i = 0; i < STACKS.length; i += BATCH_SIZE) {
    const batch = STACKS.slice(i, i + BATCH_SIZE)

    console.log(`\n📊 Processing batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(STACKS.length / BATCH_SIZE)}`)

    const batchResults = await Promise.allSettled(
      batch.map(stack => createStackDocument(client, stack))
    )

    results.push(...batchResults)

    // Rate limiting between batches
    if (i + BATCH_SIZE < STACKS.length) {
      console.log(`⏱️  Rate limiting... (${DELAY_MS}ms)`)
      await new Promise(resolve => setTimeout(resolve, DELAY_MS))
    }
  }

  const successful = results.filter(r => r.status === 'fulfilled').length
  const failed = results.filter(r => r.status === 'rejected').length

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

  console.log('\n🎉 Import completed successfully! Check your Sanity Studio.')
}

// Run the import
importStacks().catch(error => {
  console.error('❌ Fatal error:', error)
  process.exit(1)
})
