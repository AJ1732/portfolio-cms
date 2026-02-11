# Quick Start: Import Stacks

## Import Steps

```bash
# 1. Install dependencies
pnpm install

# 2. Get your API token from:
# https://sanity.io/manage/project/rlnho0c7/api/tokens

# 3. Run import (uploads SVGs as image assets)
SANITY_WRITE_TOKEN=your_token pnpm import:stacks
```

## What Gets Imported

28 stack items including:
- HTML, CSS, JavaScript, TypeScript
- React, Next.js, Vue
- Tailwind CSS, Sass
- Node.js, Express.js
- MongoDB, PostgreSQL
- Git, GitHub, GitHub Actions
- And more...

## After Import

1. Open Sanity Studio: `pnpm dev`
2. Navigate to "Stack" documents
3. Verify SVG icons display correctly

## Full Documentation

See `docs/stack-import-guide.md` for:
- Detailed instructions
- Troubleshooting
- Customization options
- Security best practices
