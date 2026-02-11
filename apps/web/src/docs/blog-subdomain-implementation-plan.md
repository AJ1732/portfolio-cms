# Blog Subdomain Routing Implementation Plan

## Overview

Implement subdomain routing to serve a blog at `blog.ejemeniboi.com` while keeping the portfolio at `ejemeniboi.com`, using a single Next.js 16.1.1 application with middleware-based routing and Sanity CMS integration.

## How URL Routing Works (Important!)

**User visits**: `blog.ejemeniboi.com/first-post-intro`

1. **Browser URL**: Shows `blog.ejemeniboi.com/first-post-intro` (clean, no `/blog/` prefix)
2. **Middleware**: Detects `blog.` subdomain
3. **Internal Rewrite**: Next.js internally routes to `src/app/blog/[slug]/page.tsx`
4. **File serves**: The blog post renders
5. **Browser URL**: Still shows `blog.ejemeniboi.com/first-post-intro` (unchanged)

**The browser URL never shows `/blog/` - that's only the internal file structure.**

## Architecture Approach

- **Single monolithic Next.js app** with middleware for subdomain detection
- **URL Rewriting**: Browser shows `blog.ejemeniboi.com/first-post-intro`, Next.js internally routes to `/blog/first-post-intro`
  - **Important**: The browser URL stays clean (no `/blog/` visible to users)
  - Middleware uses `NextResponse.rewrite()` for transparent internal routing
- **Separate Layouts**: Blog has its own root layout, independent from portfolio
- **Sanity CMS**: For blog content management (you already use Sanity CDN for images)
- **Deployment**: Netlify (not Vercel)

---

## Implementation Steps

### Step 1: Install Dependencies

```bash
npm install @sanity/client @sanity/image-url
npm install -D @sanity/types
```

### Step 2: Environment Variables

Add to `.env.local`:

```env
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01
SANITY_API_TOKEN=your_token_for_server_requests
```

**Also add these to Netlify dashboard** (Site Settings > Environment Variables) for deployment.

### Step 3: Create Middleware for Subdomain Routing

**File**: `middleware.ts` (at project root, same level as `package.json`)

**Purpose**: Detect subdomain and rewrite URLs to `/blog/*` routes internally.

**Key Logic**:

- Detect `blog.` subdomain from hostname
- Rewrite to `/blog` route group internally
- Support both production (`blog.ejemeniboi.com`) and local dev (`blog.localhost`)

**Implementation**:

```typescript
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const hostname = request.headers.get("host") || "";
  const subdomain = getSubdomain(hostname);

  if (subdomain === "blog") {
    url.pathname = `/blog${url.pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

function getSubdomain(hostname: string): string | null {
  const host = hostname.split(":")[0];
  const parts = host.split(".");

  // Local: blog.localhost
  if (host.includes("localhost")) {
    return parts[0] === "blog" ? "blog" : null;
  }

  // Production: blog.ejemeniboi.com
  if (parts.length >= 3) {
    return parts[0];
  }

  return null;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

### Step 4: Create Blog Route Structure

**Directory**: `src/app/blog/`

```
src/app/blog/
├── layout.tsx          # Blog-specific root layout
├── page.tsx            # Blog listing page
├── [slug]/
│   └── page.tsx        # Individual blog post page
└── not-found.tsx       # Blog 404 (optional)
```

**Blog Layout** (`src/app/blog/layout.tsx`):

- Independent root layout (separate from portfolio)
- Include `<html>` and `<body>` tags
- Different navigation/footer for blog
- Add subdomain validation to prevent access from main domain

```typescript
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headersList = await headers();
  const host = headersList.get('host') || '';

  // Redirect if accessed without blog subdomain
  if (!host.startsWith('blog.')) {
    redirect('/');
  }

  return (
    <html lang="en">
      <body>
        {/* Blog navigation */}
        <nav>{/* Blog-specific nav */}</nav>
        <main>{children}</main>
        {/* Blog footer */}
        <footer>{/* Blog-specific footer */}</footer>
      </body>
    </html>
  );
}
```

**Blog Listing Page** (`src/app/blog/page.tsx`):

- Fetch and display list of blog posts from Sanity
- Use Server Component for data fetching

**Blog Post Page** (`src/app/blog/[slug]/page.tsx`):

- Fetch individual post by slug
- Implement `generateStaticParams()` for static generation
- Use ISR (Incremental Static Regeneration) with revalidation

### Step 5: Protect Portfolio Routes from Blog Subdomain

**Modify**: `src/app/layout.tsx` (existing root layout)

Add subdomain check to prevent blog subdomain from accessing portfolio:

```typescript
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const headersList = await headers();
  const host = headersList.get('host') || '';

  // Redirect blog subdomain to blog home
  if (host.startsWith('blog.')) {
    redirect('/blog');
  }

  // ... existing layout code
  return (
    <html lang="en" className={`${bebasNeue.variable} ${neueEinstellung.variable}`}>
      {/* ... rest of existing layout */}
    </html>
  );
}
```

**Note**: This needs to be async function to use `headers()`.

### Step 6: Sanity Client Configuration

**File**: `src/lib/sanity/client.ts`

Following your existing pattern from `src/lib/env.ts`:

```typescript
import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { SanityImageSource } from "@sanity/image-url/lib/types/types";

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION!,
  useCdn: true,
  token: process.env.SANITY_API_TOKEN,
});

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: SanityImageSource) {
  return builder.image(source);
}
```

**File**: `src/lib/sanity/env.ts`

Environment validation following your existing pattern:

```typescript
const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET;
const SANITY_API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION;

if (!SANITY_PROJECT_ID) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable");
}
if (!SANITY_DATASET) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_DATASET environment variable");
}
if (!SANITY_API_VERSION) {
  throw new Error(
    "Missing NEXT_PUBLIC_SANITY_API_VERSION environment variable",
  );
}

export const SANITY_ENV = {
  PROJECT_ID: SANITY_PROJECT_ID,
  DATASET: SANITY_DATASET,
  API_VERSION: SANITY_API_VERSION,
};
```

### Step 7: TypeScript Types for Blog

**File**: `src/types/blog.ts`

Following your existing pattern from `src/types/`:

```typescript
export interface BlogPost {
  _id: string;
  _createdAt: string;
  title: string;
  slug: {
    current: string;
  };
  author?: {
    name: string;
    image?: string;
  };
  mainImage?: {
    asset: {
      _ref: string;
      _type: "reference";
    };
    alt?: string;
  };
  categories?: Array<{
    title: string;
    slug: { current: string };
  }>;
  publishedAt: string;
  excerpt?: string;
  body: any[]; // Portable Text blocks
}

export interface BlogListParams {
  limit?: number;
  offset?: number;
  category?: string;
}
```

### Step 8: Sanity Data Fetching

**File**: `src/lib/sanity/queries.ts`

```typescript
import { sanityClient } from "./client";
import { BlogPost, BlogListParams } from "@/types/blog";

export async function getBlogPosts(
  params: BlogListParams = {},
): Promise<BlogPost[]> {
  const { limit = 10, offset = 0, category } = params;

  const categoryFilter = category
    ? `&& "${category}" in categories[]->slug.current`
    : "";

  const query = `*[_type == "blogPost" ${categoryFilter}] | order(publishedAt desc) [${offset}...${offset + limit}] {
    _id,
    _createdAt,
    title,
    slug,
    author->{name, image},
    mainImage,
    categories[]->{title, slug},
    publishedAt,
    excerpt
  }`;

  return await sanityClient.fetch(query);
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  const query = `*[_type == "blogPost" && slug.current == $slug][0] {
    _id,
    _createdAt,
    title,
    slug,
    author->{name, image},
    mainImage,
    categories[]->{title, slug},
    publishedAt,
    excerpt,
    body
  }`;

  return await sanityClient.fetch(query, { slug });
}
```

### Step 9: Local Development Setup

**Configure `/etc/hosts` for subdomain testing**:

```bash
sudo nano /etc/hosts
```

Add:

```
127.0.0.1 localhost
127.0.0.1 blog.localhost
```

**Access locally**:

- Portfolio: `http://localhost:3000`
- Blog: `http://blog.localhost:3000`

**Start dev server**:

```bash
npm run dev
```

### Step 10: Update Existing Netlify Deployment

**Since your project is already deployed on Netlify:**

**1. Add Blog Subdomain**:

- Go to Site Settings > Domain Management > Custom Domains
- Click "Add custom domain"
- Add `blog.ejemeniboi.com`
- Netlify will provide DNS configuration (or auto-configure if using Netlify DNS)

**2. Configure DNS** (if not using Netlify DNS):

```
Type    Name    Value                                    TTL
CNAME   blog    [your-existing-site].netlify.app         Auto
```

**Note**: Your main domain (`ejemeniboi.com`) DNS should already be configured. You only need to add the `blog` CNAME record.

**3. Add Sanity Environment Variables**:

- Navigate to Site Settings > Environment Variables
- Add these new variables (you'll get these from your separate Sanity project):
  - `NEXT_PUBLIC_SANITY_PROJECT_ID` - From Sanity project settings
  - `NEXT_PUBLIC_SANITY_DATASET` - Usually "production"
  - `NEXT_PUBLIC_SANITY_API_VERSION` - e.g., "2024-01-01"
  - `SANITY_API_TOKEN` - From Sanity project API tokens (optional, only if you need authenticated requests)

**4. Deploy**:

```bash
git add .
git commit -m "feat: add blog subdomain routing with Sanity CMS integration"
git push
```

Netlify will auto-deploy. SSL for `blog.ejemeniboi.com` is automatically provisioned.

---

## Critical Files to Create/Modify

### Files to Create:

1. `middleware.ts` - Subdomain detection and routing
2. `src/app/blog/layout.tsx` - Blog root layout
3. `src/app/blog/page.tsx` - Blog listing page
4. `src/app/blog/[slug]/page.tsx` - Blog post detail page
5. `src/lib/sanity/client.ts` - Sanity client configuration
6. `src/lib/sanity/env.ts` - Sanity environment validation
7. `src/lib/sanity/queries.ts` - Data fetching functions
8. `src/types/blog.ts` - TypeScript types

### Files to Modify:

1. `src/app/layout.tsx` - Add subdomain redirect (make async, add headers check)
2. `.env.local` - Add Sanity environment variables

### Optional Files:

1. `netlify.toml` - Only if you don't already have build configuration set in Netlify dashboard

### Configuration:

- **next.config.mjs**: No changes needed (Sanity CDN already configured)
- **Netlify**: Add environment variables and custom domain
- **DNS**: Add CNAME record for blog subdomain

---

## Testing Checklist

### Local Testing:

- [ ] `http://localhost:3000` shows portfolio
- [ ] `http://blog.localhost:3000` shows blog
- [ ] Portfolio routes not accessible from blog subdomain
- [ ] Blog routes not accessible from main domain
- [ ] Sanity data fetching works
- [ ] Images load from Sanity CDN

### Production Testing:

- [ ] `ejemeniboi.com` serves portfolio
- [ ] `blog.ejemeniboi.com` serves blog
- [ ] SSL certificates active on both domains
- [ ] DNS propagation complete
- [ ] Environment variables loaded correctly

---

## Sanity CMS Setup (Separate Project)

**Your Sanity Studio is in a separate project.** You only need to connect to it:

### What You Need from Your Sanity Project:

1. **Project ID**: Found in Sanity project settings
2. **Dataset name**: Usually "production"
3. **API Version**: e.g., "2024-01-01"
4. **API Token** (optional): Only needed for:
   - Authenticated requests
   - Preview/draft content
   - Write operations

### Sanity CORS Configuration (in your Sanity dashboard):

Add these origins to allow your Next.js app to fetch data:

- `https://ejemeniboi.com`
- `https://blog.ejemeniboi.com`
- `http://localhost:3000`
- `http://blog.localhost:3000`

### Recommended Blog Post Schema (in your Sanity Studio):

Your Sanity project should have a `blogPost` document type with:

- `title` (string)
- `slug` (slug, generated from title)
- `author` (reference to author)
- `mainImage` (image)
- `categories` (array of references)
- `publishedAt` (datetime)
- `excerpt` (text)
- `body` (block content/portable text)

**Note**: You manage all content in your separate Sanity Studio. This Next.js app only fetches and displays it.

---

## Key Design Decisions

### Why Middleware?

- Clean URL rewriting without query parameters
- Single source of truth for subdomain logic
- Works seamlessly with Next.js App Router

### Why Separate Layouts?

- Blog needs different branding/navigation than portfolio
- Prevents style conflicts
- Each can have independent metadata and structured data

### Why Sanity CMS?

- You already use Sanity CDN for images
- Headless CMS with great developer experience
- Easy content management without database setup
- Next.js integration is well-documented

### Why Single Monolithic App?

- Simpler deployment (one Netlify project)
- Shared dependencies and build pipeline
- Can share UI components if needed later
- Easier to maintain

---

## Troubleshooting

### Middleware not running

- Ensure `middleware.ts` is at project root
- Clear `.next` folder: `rm -rf .next && npm run dev`
- Check matcher config excludes aren't too broad

### blog.localhost not resolving

- Verify `/etc/hosts` entry
- Clear browser cache
- Try incognito mode

### Infinite redirect loop

- Check redirect logic doesn't conflict between middleware and layouts
- Use specific pathname checks to prevent loops

### Images not loading from Sanity

- Verify `cdn.sanity.io` in `next.config.mjs` remotePatterns (already there)
- Check CORS settings in Sanity dashboard
- Ensure image URLs use `urlFor()` helper

### Environment variables undefined

- Prefix client-side vars with `NEXT_PUBLIC_`
- Restart dev server after adding variables
- Check variable names match exactly (case-sensitive)
- In Netlify, add variables in Site Settings > Environment Variables
- Trigger a new deploy after adding environment variables

---

## Next Steps After Implementation

Once routing is working, you can add:

- Blog post content rendering (Portable Text)
- Search and filtering
- Tags/categories pages
- RSS feed
- Comments system
- Reading time
- Table of contents
- SEO optimization per post

---

## Success Criteria

Implementation complete when:

1. ✅ `ejemeniboi.com` serves portfolio (all existing pages work)
2. ✅ `blog.ejemeniboi.com` serves blog subdomain
3. ✅ Middleware correctly routes blog subdomain to `/blog/*` routes
4. ✅ Portfolio routes protected from blog subdomain access
5. ✅ Blog routes protected from main domain access
6. ✅ Sanity CMS connected and can fetch data
7. ✅ Local development works with `blog.localhost:3000`
8. ✅ Production deployment on Netlify with both domains
9. ✅ SSL certificates active
10. ✅ No breaking changes to existing portfolio functionality
