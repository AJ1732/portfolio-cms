# Stack Import Guide

Complete guide for importing technology stack icons into Sanity with image asset upload.

## Table of Contents

- [Quick Start](#quick-start)
- [How It Works](#how-it-works)
- [Migration Overview](#migration-overview)
- [Running the Import](#running-the-import)
- [Document Structure](#document-structure)
- [Preventing Duplicates](#preventing-duplicates)
- [Customization](#customization)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)

---

## Quick Start

### Prerequisites

1. **Install dependencies:**
   ```bash
   pnpm add -D @sanity/client
   ```

2. **Create API token:**
   - Visit: https://sanity.io/manage/project/rlnho0c7/api/tokens
   - Create token with **Editor** or **Administrator** permissions
   - Copy the token (never commit to git!)

### Run Import

```bash
# Set your token
export SANITY_WRITE_TOKEN=your_token_here

# Run import
pnpm import:stacks
```

Or as a one-liner:
```bash
SANITY_WRITE_TOKEN=your_token pnpm import:stacks
```

---

## How It Works

The import script (`scripts/import-stacks.js`):

1. **Reads SVG files** from `portfolio-next/public/svgs/`
2. **Uploads to Sanity** as image assets (CDN-hosted)
3. **Creates documents** with proper asset references
4. **Handles duplicates** using idempotent operations
5. **Rate limits** uploads in batches to respect API limits

### What You Get

- ✅ 28 stack icons uploaded as Sanity image assets
- ✅ CDN-hosted SVGs with permanent URLs
- ✅ Proper asset references in documents
- ✅ Built-in Studio previews
- ✅ Idempotent (safe to re-run)

### Sample Output

```
🚀 Starting stack import with asset uploads...

📊 Processing batch 1/6

📦 Processing: HTML
  📤 Uploaded: html5.svg (image-09eeb42...)
✅ Created/Updated: HTML

📦 Processing: React
  ♻️  Asset exists: react.svg
✅ Created/Updated: React

...

============================================================
📊 Import Summary:
✅ Successful: 28
❌ Failed: 0
📦 Total: 28
============================================================

🎉 Import completed successfully!
```

---

## Migration Overview

### Why We Migrated

Originally, the stack schema used `@focus-reactive/sanity-plugin-inline-svg-input` which:
- ❌ Stored SVG content as text strings
- ❌ Sanitized SVGs with DOMPurify (stripped gradients, attributes)
- ❌ No CDN benefits
- ❌ Limited functionality

**Old approach:**
```typescript
{
  name: 'icon',
  type: 'inlineSvg',  // String storage
}
```

### Current Solution

We now use Sanity's native `image` type:
- ✅ SVGs stored as first-class assets in Sanity's CDN
- ✅ Pixel-perfect (no sanitization)
- ✅ Built-in Studio previews
- ✅ Better performance with CDN caching

**New approach:**
```typescript
{
  name: 'icon',
  type: 'image',
  options: {
    accept: 'image/svg+xml',
  },
}
```

### Asset Upload Process

The script uses Sanity's Asset API:

```javascript
// Upload SVG as buffer
const buffer = Buffer.from(svgContent, 'utf-8')

const asset = await client.assets.upload('image', buffer, {
  filename: 'react.svg',
  contentType: 'image/svg+xml',
})

// Returns asset with CDN URL
{
  _id: 'image-abc123...',
  url: 'https://cdn.sanity.io/images/...',
}
```

**Content-Based IDs:**
- Sanity generates asset IDs from file content hash
- Same SVG uploaded twice = same asset ID
- Prevents duplicate uploads automatically

---

## Running the Import

### Basic Usage

```bash
SANITY_WRITE_TOKEN=your_token node scripts/import-stacks.js
```

### With Environment File

Create `.env.local`:
```env
SANITY_WRITE_TOKEN=your_token_here
```

Then run:
```bash
pnpm import:stacks
```

### What Gets Imported

28 technology stacks:
- **Frontend**: HTML, CSS, JavaScript, TypeScript, React, Next.js, Vue
- **Styling**: Tailwind CSS, Sass
- **Build Tools**: Vite
- **Animation**: Motion, GSAP
- **State**: Redux, TanStack Query, TanStack Router, Pinia
- **UI Libraries**: shadcn/ui
- **CMS**: Sanity.io
- **Tools**: Figma, Vim, Git, GitHub, GitHub Actions
- **Backend**: Node.js, Express.js
- **Databases**: MongoDB, PostgreSQL
- **AI**: Mistral AI

---

## Document Structure

### Before Migration (Invalid)
```json
{
  "_type": "stack",
  "_id": "react",
  "icon": "<svg>...</svg>"  // String - causes validation error
}
```

### After Migration (Valid)
```json
{
  "_type": "stack",
  "_id": "react",
  "name": "React",
  "key": "react",
  "icon": {
    "_type": "image",
    "asset": {
      "_type": "reference",
      "_ref": "image-9db89c744f1ec3a9c317b5842da56fd9ff4ab589-256x228-svg"
    }
  }
}
```

### Field Descriptions

- `_type`: Always `"stack"`
- `_id`: Uses `key` for idempotency (enables safe re-runs)
- `name`: Display name (e.g., "Next.js")
- `key`: Unique identifier (e.g., "nextjs")
- `icon`: Image asset reference (SVG in Sanity CDN)

---

## Preventing Duplicates

### Built-in Protection

The import script uses `createOrReplace()`:

```javascript
const document = {
  _type: 'stack',
  _id: stack.key,  // Predictable ID
  name: stack.name,
  key: stack.key,
  icon: iconAsset,
}

await client.createOrReplace(document)
```

**How it works:**
- If document with `_id` exists → **Updates** it
- If not → **Creates** new document
- Result: No duplicates, safe to re-run

### Asset Idempotency

Assets are also idempotent:

```javascript
// First upload
const asset1 = await upload('react.svg')
// Returns: image-abc123...

// Second upload (same content)
const asset2 = await upload('react.svg')
// Returns: image-abc123... (same ID!)
```

Sanity generates asset IDs from content hash, so identical files get the same ID.

### Import Method Comparison

| Method | Prevents Duplicates? | How? | Updates Existing? |
|--------|---------------------|------|-------------------|
| `create()` | ❌ No | N/A | No - throws error if exists |
| `createOrReplace()` | ✅ Yes | By `_id` | Yes - replaces entirely |
| `createIfNotExists()` | ✅ Yes | By `_id` | No - skips if exists |

**Recommended:** Use `createOrReplace()` (what the script uses).

### Checking for Duplicates

Query existing documents:

```groq
// Find all stacks
*[_type == "stack"]

// Find duplicates by name
*[_type == "stack"] {
  name,
  "count": count(*[_type == "stack" && name == ^.name])
} [count > 1]

// Find orphaned drafts
*[_id in path("drafts.*") && _type == "stack"]
```

---

## Customization

### Adding More Stacks

Edit `scripts/import-stacks.js` and add to the `STACKS` array:

```javascript
const STACKS = [
  // Existing stacks...
  { name: 'Docker', key: 'docker', svgFile: 'docker.svg' },
  { name: 'Kubernetes', key: 'kubernetes', svgFile: 'kubernetes.svg' },
]
```

Then add the SVG files to `portfolio-next/public/svgs/` and re-run the import.

### Changing SVG Directory

Update the `SVG_DIR` constant:

```javascript
const SVG_DIR = '/path/to/your/svgs'
```

### Using Different Dataset

Change the dataset in the script:

```javascript
const client = createClient({
  projectId: 'rlnho0c7',
  dataset: 'staging', // Change here
  useCdn: false,
  apiVersion: '2025-01-07',
  token: process.env.SANITY_WRITE_TOKEN,
})
```

### Custom Fields

Add custom fields to the document:

```javascript
const document = {
  _type: 'stack',
  _id: stack.key,
  name: stack.name,
  key: stack.key,
  icon: iconAsset,
  // Add custom fields
  category: 'frontend',
  popularity: 5,
  featured: true,
}
```

---

## Troubleshooting

### "SANITY_WRITE_TOKEN environment variable is required"

**Solution:** Set the token before running:
```bash
export SANITY_WRITE_TOKEN=your_token_here
pnpm import:stacks
```

Or use inline:
```bash
SANITY_WRITE_TOKEN=your_token pnpm import:stacks
```

### "Failed to read [file].svg: ENOENT"

**Problem:** SVG file doesn't exist.

**Solution:**
1. Check file name (case-sensitive)
2. Verify file exists in `portfolio-next/public/svgs/`
3. Update `svgFile` in the `STACKS` array

### "Unauthorized" Error

**Problem:** API token lacks permissions.

**Solution:** Create new token with:
- **Editor** permissions (can create/edit documents), OR
- **Administrator** permissions (full access)

### Documents Not Showing in Studio

**Solutions:**
1. Refresh browser (Cmd/Ctrl + R)
2. Check correct dataset is selected
3. Verify documents exist:
   ```bash
   sanity documents query '*[_type == "stack"]'
   ```

### Asset Upload Fails

**Common issues:**
- Check internet connection
- Verify API token has asset upload permissions
- Ensure SVG files are valid XML
- Check file size (Sanity supports up to 100MB per asset)

**Debug upload:**
```javascript
// Check if asset exists
*[_type == "sanity.imageAsset" && originalFilename == "react.svg"]
```

### Validation Errors

**"The value of this property must be of type image"**

This means old string-based SVG data exists. Run the import script to fix:
```bash
SANITY_WRITE_TOKEN=your_token pnpm import:stacks
```

The script will upload assets and update all documents with proper references.

---

## Best Practices

### Security

- ✅ Use environment variables for tokens
- ✅ Add `.env` to `.gitignore`
- ✅ Create tokens with minimum required permissions
- ❌ Never commit tokens to git
- ❌ Never share tokens publicly

Example `.gitignore`:
```gitignore
.env
.env.local
.env.*.local
```

### Workflow

1. **First time:** Run import to upload assets and create documents
2. **Updates:** Re-run import after adding/updating SVGs
3. **Team members:** Each person needs their own API token
4. **Maintenance:** Keep SVG filenames consistent

### Code Organization

- Keep `STACKS` array alphabetically sorted
- Use kebab-case for `key` values
- Match SVG filenames to `key` when possible
- Document custom modifications

### Performance

The script includes:
- **Batch processing:** 5 items per batch
- **Rate limiting:** 200ms delay between batches
- **Error handling:** Graceful degradation for failed uploads
- **Progress indicators:** Real-time feedback

**Total import time:** ~1-2 seconds for 28 items

### Testing

Before production import:

1. **Test on development dataset:**
   ```javascript
   dataset: 'development',
   ```

2. **Verify in Studio:**
   - Check icon previews
   - Verify no validation errors
   - Test document queries

3. **Run on production:**
   ```javascript
   dataset: 'production',
   ```

---

## Advanced Topics

### Asset Management

**List all uploaded SVG assets:**
```groq
*[_type == "sanity.imageAsset" && mimeType == "image/svg+xml"] {
  _id,
  originalFilename,
  url,
  size,
  _createdAt
} | order(_createdAt desc)
```

**Delete unused assets:**
```javascript
// Query unused assets
const unusedAssets = await client.fetch(`
  *[_type == "sanity.imageAsset"
    && !defined(*[references(^._id)][0])
  ]
`)

// Delete them
for (const asset of unusedAssets) {
  await client.delete(asset._id)
}
```

### Batch Operations

For larger imports, use batching:

```javascript
const BATCH_SIZE = 10
const results = []

for (let i = 0; i < items.length; i += BATCH_SIZE) {
  const batch = items.slice(i, i + BATCH_SIZE)

  const batchResults = await Promise.allSettled(
    batch.map(item => processItem(item))
  )

  results.push(...batchResults)

  // Rate limit
  await new Promise(r => setTimeout(r, 200))
}
```

### Change Detection

Only update documents if content changed:

```javascript
// Fetch existing document
const existing = await client.fetch(
  `*[_id == $id][0]`,
  { id: stack.key }
)

// Compare content
const hasChanged = existing?.icon?.asset?._ref !== iconAsset.asset._ref

// Only update if changed
if (!existing || hasChanged) {
  await client.createOrReplace(document)
}
```

---

## References

- [Sanity Importing Data](https://www.sanity.io/docs/importing-data)
- [Sanity Asset API](https://www.sanity.io/docs/assets)
- [Sanity Image Type](https://www.sanity.io/docs/image-type)
- [Content Migration](https://www.sanity.io/docs/content-lake/content-migration-cheatsheet)

---

## Next Steps

After importing:

1. **Verify in Studio**
   - Open Sanity Studio
   - Check Stack documents
   - Verify icon previews

2. **Test Queries**
   ```groq
   *[_type == "stack"] | order(name asc) {
     _id,
     name,
     key,
     "iconUrl": icon.asset->url
   }
   ```

3. **Use in Frontend**
   ```javascript
   import { urlFor } from '@/sanity/lib/image'

   const iconUrl = urlFor(stack.icon).url()
   ```

4. **Deploy Schema** (if needed)
   ```bash
   npx sanity schema deploy
   ```
