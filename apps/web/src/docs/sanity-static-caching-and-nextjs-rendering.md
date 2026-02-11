# Sanity Static Caching & Next.js Rendering

This doc explains `createStaticQuery` in `src/lib/sanity/cached-fetch.ts`, how it uses Next.js and React caching, and how it fits into Next.js rendering strategies (SSG, ISR, Data Cache).

See also: [sanity-caching-migration.md](./sanity-caching-migration.md) for the dual-mode architecture (static portfolio vs live writings).

---

## What `createStaticQuery` Does

**File:** `src/lib/sanity/cached-fetch.ts`

`createStaticQuery` is a **factory** that turns a Sanity GROQ query (and params) into a **cached fetch function** with two layers of caching:

1. **React `cache()`** — Deduplicates within a **single** server request (e.g. layout + page both calling `getContacts()` → one Sanity call).
2. **Next.js `unstable_cache()`** — Caches the result **across requests and over time** (Data Cache). Subsequent requests can be served from cache until revalidation.

It uses `sanityClient.fetch()` directly (no `defineLive`), so there are no real-time subscriptions and responses can be cached by Next.js.

---

## The Two Caching Layers

### Layer 1: `cache()` (React)

- **Scope:** One server render (one request).
- **Purpose:** Request deduplication. If multiple components in the same RSC tree call the same getter, only one execution runs; others receive the same cached promise/result.
- **API:** `cache` from `"react"` ([React docs](https://react.dev/reference/react/cache)).

### Layer 2: `unstable_cache()` (Next.js)

- **Scope:** Across requests and over time (persisted in the Next.js Data Cache).
- **Purpose:** Avoid re-fetching from Sanity on every navigation or visitor. Same query + params → same cache key → cached result returned until revalidation.
- **Cache key:** `[`sanity:${query}:${JSON.stringify(params)}`]` so each distinct query/params pair has its own entry.
- **Options:**
  - **`revalidate`** (default `60`) — Time in seconds after which the cache is considered stale; next request will re-run the fetch (ISR).
  - **`tags`** (default `["sanity"]`) — Tags for on-demand revalidation via `revalidateTag()` (e.g. from a webhook when content is published).
- **API:** `unstable_cache` from `"next/cache"` ([Next.js docs](https://nextjs.org/docs/app/api-reference/functions/unstable_cache)).

### Order in Code

The implementation wraps like this:

```ts
return cache(unstable_cache(async () => { ... }, key, { revalidate, tags }));
```

So: the **cached fetcher** (the result of `unstable_cache`) is the function that React deduplicates. When that fetcher is called, Next.js serves from Data Cache when possible; otherwise it runs the inner async function and stores the result.

---

## How This Relates to Next.js Rendering

### Data Cache

- `unstable_cache` reads and writes the **Data Cache** (fetch/cache layer in the App Router).
- Cached data is stored on disk (in `.next/cache`) and reused across builds and requests until revalidation.

### Static Site Generation (SSG)

- With **no** `revalidate` (or a very long one), data is fetched at build time and reused indefinitely → **fully static**.
- In this project we always pass `revalidate` (60–300s), so we’re not “pure” SSG; we use **ISR** instead.

### Incremental Static Regeneration (ISR)

- **`revalidate`** makes the route/data **stale after N seconds**. The first request after the window still gets the cached response (fast), then in the background Next.js can re-run the fetch and update the cache for the next request.
- Our getters use different revalidation times (e.g. 60s for snippets, 300s for stacks). So Sanity data is **statically cached with time-based ISR**.

### On-Demand Revalidation (Tags)

- **`tags`** allow invalidating cache entries without waiting for `revalidate`. Example: a Sanity webhook calls an API route that runs `revalidateTag("sanity")` (or a more specific tag). The next request will miss the cache and re-fetch from Sanity.
- So we get **cache when possible**, **instant refresh when we trigger it**.

### Full Route Cache

- In the App Router, the **Full Route Cache** can cache the entire RSC payload for a route. For that to happen, the route must use **cached** data fetches (and no dynamic APIs like `cookies()`/`headers()` in a way that opts out).
- Because our Sanity getters are wrapped in `unstable_cache`, their results are cached. So portfolio pages that only use these getters can be **statically generated and cached** at build (or on first request) and then revalidated on the schedule we set.

---

## Summary Table

| Concept              | Role in this setup                                                               |
| -------------------- | -------------------------------------------------------------------------------- |
| **React `cache()`**  | Deduplicates Sanity fetches within a single server request.                      |
| **`unstable_cache`** | Persists Sanity results in the Data Cache across requests; enables ISR + tags.   |
| **revalidate**       | Time-based ISR: after N seconds, next request can trigger a fresh Sanity fetch.  |
| **tags**             | On-demand revalidation via `revalidateTag()` (e.g. webhook on publish).          |
| **SSG**              | Possible if we used no/short revalidate; we use ISR instead for fresher content. |
| **ISR**              | What we use: static cache + revalidate window + optional tag invalidation.       |
| **Full Route Cache** | Can cache full page payloads because our data sources are cached.                |

---

## Usage in the Codebase

- **Definition:** `src/lib/sanity/cached-fetch.ts` — `createStaticQuery()`.
- **Consumption:** `src/lib/sanity/getters.ts` — each getter is created with `createStaticQuery(query, params, { revalidate, tags })`.
- **Used by:** Layout and portfolio pages (e.g. `layout.tsx`, `about/page.tsx`, `works/page.tsx`) that import from `getters.ts`. No live subscriptions on these routes; they benefit from Data Cache + ISR.

Writing/slug pages that need real-time preview use the **live** path (`createCachedQuery` + `defineLive` + `SanityLive`) and are documented in [sanity-caching-migration.md](./sanity-caching-migration.md).
