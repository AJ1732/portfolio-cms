# Snippet Import Guide

Complete guide for importing about snippets into Sanity.

## Quick Start

### Prerequisites

1. **Install dependencies** (if not already installed):
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
pnpm import:snippets
```

Or as a one-liner:
```bash
SANITY_WRITE_TOKEN=your_token pnpm import:snippets
```

---

## How It Works

The import script (`scripts/import-snippets.js`):

1. **Reads snippet data** from the DETAILS array
2. **Creates documents** with text content
3. **Sets initial orderRank** for proper ordering
4. **Handles duplicates** using idempotent operations (safe to re-run)

### What You Get

- ✅ 8 snippet documents created
- ✅ Proper ordering with orderRank
- ✅ Idempotent (safe to re-run)
- ✅ Drag-and-drop reordering in Studio

### Sample Output

```
🚀 Starting snippet import...

📊 Processing 8 snippets...

✅ Created/Updated: Snippet 1
✅ Created/Updated: Snippet 2
✅ Created/Updated: Snippet 3
...

============================================================
📊 Import Summary:
✅ Successful: 8
❌ Failed: 0
📦 Total: 8
============================================================

🎉 Import completed successfully!
💡 Note: You can reorder snippets in the Studio using drag-and-drop.
   The orderRank will be automatically updated by the orderable plugin.
```

---

## Document Structure

Each snippet document has:

```typescript
{
  _type: 'snippet',
  _id: 'snippet-1', // Based on original id
  text: 'Well... Apart from English, I\'m Proficient...',
  orderRank: '0|0000:', // Managed by orderable plugin
}
```

### Fields

| Field | Type | Description |
|-------|------|-------------|
| `text` | `text` | The snippet content (required) |
| `orderRank` | `string` | Hidden field for drag-and-drop ordering |

---

## Preventing Duplicates

The script uses **idempotent operations**:

- Uses `createOrReplace()` instead of `create()`
- Uses document IDs based on original `id` field (`snippet-1`, `snippet-2`, etc.)
- **Safe to run multiple times** - won't create duplicates

### Re-running the Import

If you need to update snippets:

```bash
# Just run again - it will update existing documents
SANITY_WRITE_TOKEN=your_token pnpm import:snippets
```

---

## Customization

### Adding New Snippets

Edit `scripts/import-snippets.js` and add to the `SNIPPETS` array:

```javascript
const SNIPPETS = [
  // ... existing snippets
  {
    id: '10',
    text: 'Your new snippet text here',
  },
]
```

### Modifying Existing Snippets

1. Update the text in the `SNIPPETS` array
2. Re-run the import script
3. Documents will be updated (not duplicated)

---

## Querying Snippets

After import, query snippets in order:

```groq
*[_type == "snippet"] | order(orderRank) {
  _id,
  text
}
```

### In Your Frontend

```typescript
const snippets = await client.fetch(`
  *[_type == "snippet"] | order(orderRank) {
    text
  }
`)
```

---

## Troubleshooting

### Error: SANITY_WRITE_TOKEN is required

**Solution:** Set the token environment variable:
```bash
export SANITY_WRITE_TOKEN=your_token_here
```

### Error: Invalid token

**Solution:** 
1. Check token has **Editor** or **Administrator** permissions
2. Verify token hasn't expired
3. Create a new token if needed

### Documents created but not visible

**Solution:**
- Check Studio structure includes snippets
- Verify schema is deployed: `npx sanity schema deploy`
- Refresh Studio browser

### Order not working

**Solution:**
- Ensure `@sanity/orderable-document-list` plugin is installed
- Check structure uses `orderableDocumentListDeskItem` for snippets
- Reorder in Studio - orderRank updates automatically

---

## Best Practices

1. **Version Control:** Keep the `SNIPPETS` array in the script as source of truth
2. **Idempotency:** Script is safe to re-run - use for updates
3. **Ordering:** Use Studio drag-and-drop for final ordering (orderRank auto-updates)
4. **Backup:** Export documents before major changes

---

## Related Documentation

- [Stack Import Guide](./stack-import-guide.md) - Similar pattern for stack icons
- [Sanity Client Docs](https://www.sanity.io/docs/js-client)
- [Orderable Document List Plugin](https://github.com/sanity-io/orderable-document-list)
