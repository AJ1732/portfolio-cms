# Plan: Implement Visual Editing for Drafts

## Context

The portfolio monorepo has a Sanity Studio (`apps/studio`) and a Next.js web app (`apps/web`). Currently, the web app uses `defineLive` from `next-sanity` for real-time updates on the writings page, but there is **no draft mode or visual editing** set up. Content authors cannot preview draft content or use click-to-edit overlays from the Studio's Presentation tool.

The goal is to implement the full Visual Editing pipeline so that:
1. The Studio gets the **Presentation tool** with an iframe preview
2. The Next.js app supports **Draft Mode** with draft content visible
3. **Click-to-edit overlays** work via Stega encoding
4. A **Disable Draft Mode** button is available outside the Presentation tool

## Changes Overview

### 1. Web App: Add Stega encoding to the Sanity client
**File:** `apps/web/src/lib/sanity/client.ts`

Add `stega: { studioUrl: 'https://aj1732-portfolio.sanity.studio' }` to the client config. This enables Content Source Maps (invisible characters in strings) that power click-to-edit overlays.

### 2. Web App: Create draft mode enable API route
**File:** `apps/web/src/app/api/draft-mode/enable/route.ts` (new)

Uses `defineEnableDraftMode` from `next-sanity/draft-mode` with the Sanity client + read token. This is the handshake endpoint the Presentation tool calls to securely activate Draft Mode.

### 3. Web App: Create draft mode disable API route
**File:** `apps/web/src/app/api/draft-mode/disable/route.ts` (new)

Simple route that disables draft mode and redirects to home.

### 4. Web App: Create DisableDraftMode component
**File:** `apps/web/src/components/elements/disable-draft-mode.tsx` (new)

Client component using `useDraftModeEnvironment` from `next-sanity/hooks`. Only shows when outside the Presentation tool iframe.

### 5. Web App: Update root layout with VisualEditing + SanityLive
**File:** `apps/web/src/app/layout.tsx`

- Move `<SanityLive />` from `writings/layout.tsx` to the root layout (should be global per `next-sanity` rules)
- Add `<VisualEditing />` and `<DisableDraftMode />` conditionally when `draftMode().isEnabled`

### 6. Web App: Remove SanityLive from writings layout
**File:** `apps/web/src/app/writings/layout.tsx`

Remove `<SanityLive />` since it's now in the root layout. Delete the file if it becomes empty.

### 7. Studio: Add Presentation tool plugin with resolve
**File:** `apps/studio/sanity.config.ts`

Add `presentationTool` from `sanity/presentation` to the plugins array with `previewUrl` pointing to the Next.js app and the draft mode enable route. Include document location resolver.

### 8. Studio: Create document location resolver
**File:** `apps/studio/src/presentation/resolve.ts` (new)

Define locations for `writings` and `project` document types so the Presentation tool shows where each document appears on the front end.

## Files to Modify

| File | Action |
|------|--------|
| `apps/web/src/lib/sanity/client.ts` | Edit — add stega config |
| `apps/web/src/app/api/draft-mode/enable/route.ts` | Create |
| `apps/web/src/app/api/draft-mode/disable/route.ts` | Create |
| `apps/web/src/components/elements/disable-draft-mode.tsx` | Create |
| `apps/web/src/app/layout.tsx` | Edit — add SanityLive, VisualEditing, DisableDraftMode |
| `apps/web/src/app/writings/layout.tsx` | Edit/Delete — remove SanityLive |
| `apps/studio/sanity.config.ts` | Edit — add presentationTool with resolve |
| `apps/studio/src/presentation/resolve.ts` | Create |

## Existing Code to Reuse

- `sanityClient` from `apps/web/src/lib/sanity/client.ts` — existing client instance
- `SANITY_ENV.READ_TOKEN` from `apps/web/src/lib/sanity/env.ts` — existing token handling
- `SanityLive` from `apps/web/src/lib/sanity/live.ts` — already configured with `serverToken` and `browserToken`

## Verification

1. Start both dev servers: `pnpm dev` (studio on :3334, web on :3000)
2. Open Studio at `http://localhost:3334` — confirm "Presentation" appears in the top toolbar
3. Click Presentation — the iframe should load the Next.js app and activate Draft Mode
4. Edit a `writings` document title — the change should appear live in the iframe
5. Click on text in the iframe — it should highlight the corresponding field in the Studio
6. Open `http://localhost:3000` directly — confirm "Disable Draft Mode" button appears if draft mode was previously enabled
7. Click "Disable Draft Mode" — should redirect to `/` with published content only

## Troubleshooting

### "Unable to connect to visual editing" in the Presentation tool

**Problem:** When opening the Presentation tab in the Studio, the iframe loads the Next.js app but the console shows:

```
Unable to connect to visual editing. Make sure you've setup '@sanity/visual-editing' correctly
```

The `<VisualEditing />` component never connects to the Studio, so click-to-edit overlays don't work.

**Root cause:** In this monorepo, the Studio (`localhost:3334`) and the Next.js app (`localhost:3000`) run on different ports. Even though both are on `localhost`, different ports are treated as **different origins** by the browser. Two things break:

1. **Presentation tool iframe URL** — The `presentationTool` config only had a relative path for `previewUrl`, so it didn't know which origin to load in the iframe.
2. **Next.js cross-origin blocking** — Next.js 16 blocks cross-origin requests in dev mode by default. The Studio on `:3334` tries to communicate with the Next.js app on `:3000` via the iframe, but Next.js rejects these requests because the origin isn't whitelisted.

**Solution — two changes:**

1. Add `origin` to the Presentation tool config in `apps/studio/sanity.config.ts`:

```ts
presentationTool({
  resolve,
  previewUrl: {
    origin: 'http://localhost:3000',  // <-- explicit Next.js origin
    previewMode: {
      enable: '/api/draft-mode/enable',
    },
  },
}),
```

2. Add `allowedDevOrigins` to `apps/web/next.config.mjs`:

```js
const nextConfig = {
  allowedDevOrigins: ["http://localhost:3334"],  // <-- allow Studio origin
  // ...
};
```

After both changes, restart both dev servers with `pnpm dev` from the monorepo root.

### Deployed Studio loads `localhost:3000` instead of production URL

**Problem:** The Presentation tool works locally, but on the deployed Studio (`aj1732-portfolio.sanity.studio`) it still tries to load `localhost:3000` in the iframe instead of the production site.

**Root cause:** The `origin` in the `presentationTool` config was hardcoded to `http://localhost:3000`. This value is baked into the Studio build, so the deployed Studio uses it too.

**Solution:** Make the origin environment-aware by checking the hostname at runtime:

```ts
presentationTool({
  resolve,
  previewUrl: {
    origin:
      typeof window !== 'undefined' && window.location.hostname === 'localhost'
        ? 'http://localhost:3000'
        : 'https://ejemeniboi.com',
    previewMode: {
      enable: '/api/draft-mode/enable',
    },
  },
}),
```

This uses `localhost:3000` during local development and `https://ejemeniboi.com` on the deployed Studio. After changing, redeploy the Studio with `pnpm deploy` from `apps/studio`.

**Important:** The production site must also have the visual editing changes deployed (the `/api/draft-mode/enable` route, `<VisualEditing />` in the layout, and the `stega` client config) for the deployed Presentation tool to connect.
