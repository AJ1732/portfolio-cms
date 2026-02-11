# Sanity Data Fetching: Static Caching Migration

## Context

All Sanity data fetching used `sanityFetch` from `defineLive` (`next-sanity/live`), which bypasses Next.js response caching to enable real-time updates. This means every page navigation re-fetches all data from Sanity — unnecessary for portfolio content (projects, certificates, stacks, contacts, gallery, snippets) that changes infrequently.

### Problem

```
User navigates to /works → Server Component renders → sanityFetch (from defineLive) → fresh Sanity API call
User navigates to /about → Server Component renders → sanityFetch (from defineLive) → fresh Sanity API call
User navigates back to /works → Server Component renders → sanityFetch (from defineLive) → fresh Sanity API call again
```

`React.cache()` only deduplicates within the **same** server request. Each navigation is a new request, so the cache is empty every time.

### Goal

- **Portfolio pages** (home, about, works, contact): Use statically cached fetching with time-based revalidation. Visitors don't need real-time updates.
- **Writing slug pages**: Retain `defineLive`/`sanityFetch`/`SanityLive` for the editing workflow (live preview while editing in Sanity Studio).

---

## Architecture

### Before (Single Mode)

```
All Pages → createCachedQuery (React.cache) → sanityFetch (defineLive) → Always fresh
                                                                          No response caching
Root Layout renders <SanityLive /> globally
```

### After (Dual Mode)

```
Portfolio Pages → createStaticQuery → sanityClient.fetch() → unstable_cache (60-300s revalidation)
                                                              + React.cache (request dedup)
                                                              No <SanityLive /> loaded

Writing Pages → createCachedQuery → sanityFetch (defineLive) → Always fresh, live updates
                                                                <SanityLive /> in writings layout
```

---

## Files Changed

| File                               | Action                              | Purpose                                                       |
| ---------------------------------- | ----------------------------------- | ------------------------------------------------------------- |
| `src/lib/sanity/cached-fetch.ts`   | Created                             | Static caching factory using `unstable_cache` + `React.cache` |
| `src/lib/sanity/getters.ts`        | Rewritten                           | Switched from `createCachedQuery` to `createStaticQuery`      |
| `src/lib/sanity/cached-queries.ts` | Renamed to `cached-queries-live.ts` | Reserved for future writing pages                             |
| `src/app/layout.tsx`               | Edited                              | Removed `<SanityLive />` and its import                       |
| `src/app/writings/layout.tsx`      | Created                             | Scoped `<SanityLive />` to writings routes only               |

---

## Implementation Details

### Two-Layer Caching Strategy

**`src/lib/sanity/cached-fetch.ts`** — The `createStaticQuery` factory:

```typescript
import type { QueryParams } from "next-sanity";
import { unstable_cache } from "next/cache";
import { cache } from "react";
import { sanityClient } from "./client";

export function createStaticQuery<T>(
  query: string,
  params: QueryParams = {},
  options: { revalidate?: number; tags?: string[] } = {},
) {
  const { revalidate = 60, tags = ["sanity"] } = options;

  return unstable_cache(
    cache(async (): Promise<T> => {
      const data = await sanityClient.fetch<T>(query, params);
      return data ?? ([] as T);
    }),
    [`sanity:${query}:${JSON.stringify(params)}`],
    { revalidate, tags },
  );
}
```

**Layer 1 — `React.cache()`**: Deduplicates calls within a single server render (e.g. if `getContacts()` is called in both layout and a page, only one fetch happens).

**Layer 2 — `unstable_cache()`**: Caches results across requests persistently. After the first fetch, subsequent navigations serve from cache until the revalidation window expires.

### Revalidation Periods

| Getter            | Revalidation | Rationale                      |
| ----------------- | ------------ | ------------------------------ |
| `getStacks`       | 300s (5 min) | Tech stacks rarely change      |
| `getCertificates` | 300s (5 min) | Certificates rarely change     |
| `getGallery`      | 300s (5 min) | Gallery images rarely change   |
| `getContacts`     | 300s (5 min) | Contact links rarely change    |
| `getProjects`     | 120s (2 min) | Projects occasionally updated  |
| `getSnippets`     | 60s (1 min)  | Most dynamic portfolio content |

### Key Design Decision: Same Import Path

The rewritten `getters.ts` keeps the same export names and file path. All consumers (`layout.tsx`, `about/page.tsx`, `works/page.tsx`) required **zero import changes**.

### SanityLive Scoping

**Before**: `<SanityLive />` rendered in root layout — loaded live subscription JS and opened WebSocket connections on every page for every visitor.

**After**: `<SanityLive />` rendered only in `src/app/writings/layout.tsx` — only loaded when visiting `/writings/*` routes.

---

## React 19 API Evaluation

| Approach                              | Verdict                                                                        |
| ------------------------------------- | ------------------------------------------------------------------------------ |
| `React.cache()` alone                 | Insufficient — only deduplicates within single request, not across navigations |
| `unstable_cache()` alone              | Works but misses intra-request deduplication                                   |
| `unstable_cache()` + `React.cache()`  | Optimal — covers both cross-request caching and intra-request dedup            |
| `defineLive` with conditional disable | Rejected — still loads live JS bundle on portfolio pages                       |
| Separate Sanity clients               | Rejected — unnecessary duplication, `sanityClient` already has `useCdn: true`  |

---

## Future: On-Demand Revalidation

For instant updates without waiting for the revalidation window, a Sanity webhook can call `revalidateTag()`:

```typescript
// src/app/api/revalidate/route.ts (future enhancement)
import { revalidateTag } from "next/cache";

export async function POST(request: NextRequest) {
  const { _type } = await request.json();

  const tagMap: Record<string, string> = {
    stack: "sanity-stacks",
    project: "sanity-projects",
    // etc.
  };

  revalidateTag(tagMap[_type] ?? "sanity");
  return NextResponse.json({ revalidated: true });
}
```

Configure in Sanity Studio → Webhooks → trigger on document publish.

---

## Future: Writing Pages Integration

When writing pages are connected to Sanity, they should use `createCachedQuery` from `cached-queries-live.ts` (which wraps `sanityFetch` from `defineLive`) for real-time updates:

```typescript
// src/lib/sanity/getters/writings.ts (future)
import { createCachedQuery } from "../cached-queries-live";
import { WRITING_QUERY, WRITINGS_LIST_QUERY } from "../queries";

export const getWritings = createCachedQuery<Writing[]>(WRITINGS_LIST_QUERY);
export const getWriting = (slug: string) =>
  createCachedQuery<Writing>(WRITING_QUERY, { slug });
```

The `<SanityLive />` in `src/app/writings/layout.tsx` is already in place for this.

---

## Verification

- [x] `pnpm type` — no TypeScript errors
- [x] `pnpm lint` — no lint errors
- [x] `pnpm build` — successful build
- [ ] Portfolio pages load data correctly
- [ ] No live WebSocket connections on portfolio pages (check Network tab)
- [ ] Writing pages still render
- [ ] Content updates appear after revalidation period
