# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **pnpm monorepo** for a portfolio website, containing two apps:

- **`apps/studio`** — Sanity Studio (CMS) for content management. Connects to Sanity project `rlnho0c7`, dataset `production`.
- **`apps/web`** — Next.js 16 (App Router) frontend that consumes content from the studio via Sanity client and `next-sanity`.

The studio generates TypeScript types for the web app via `sanity-typegen.json` (scans `apps/web/src/**/*` and outputs to `apps/web/src/types/studio.d.ts`).

## Monorepo Commands (root)

- `pnpm dev` — Start both studio and web dev servers in parallel
- `pnpm build` — Build both apps in parallel

## App-Specific Commands

### Studio (`apps/studio`)

- `pnpm dev` — Start Sanity Studio dev server
- `pnpm build` — Build for production
- `pnpm deploy` — Deploy to Sanity's hosting
- `pnpm typegen` — Extract schema + generate TypeScript types for web app
- `npx sanity schema deploy` — Deploy schema changes to Sanity cloud (required after schema modifications)
- `npx eslint . --fix` — Lint and fix

### Web (`apps/web`)

- `pnpm dev` — Start Next.js dev server with Turbopack
- `pnpm build` — Production build
- `pnpm check` — Run all quality checks (type-check + lint + format)
- `pnpm lint` — ESLint with zero warnings tolerance
- `pnpm format` — Prettier format all files

## Architecture

### Cross-App Type Generation

The studio's `sanity-typegen.json` configures type generation that bridges both apps:
1. Studio extracts its schema to `apps/studio/schema.json`
2. Types are generated from GROQ queries found in `apps/web/src/**/*`
3. Output goes to `apps/web/src/types/studio.d.ts`

Run `pnpm typegen` in the studio after schema changes to keep the web app's types in sync.

### Studio Schema System (`apps/studio/src/schemaTypes/`)

Schema types are organized by domain:
- `project/` — Project portfolio items (with demo, links, stacks sub-objects)
- `post/` — Blog posts
- `about/` — Certificate, gallery, snippet types
- `primitive/` — Reusable building blocks (stack, contact link, issuing org)

All types registered in `schemaTypes/index.ts` → picked up by `sanity.config.ts` via `schema: { types: schemaTypes }`.

Schema creation workflow:
1. Create file in `src/schemaTypes/` using `defineType()` from `'sanity'`
2. Export and add to the array in `src/schemaTypes/index.ts`
3. Run `npx sanity schema deploy` to deploy

### Studio Structure (`apps/studio/src/structure/`)

Custom desk structure organizes content into sections: Primitives, About Author, Works, Blog. Uses `@sanity/orderable-document-list` for drag-and-drop ordering on snippets, certificates, galleries, and projects.

### Web App Architecture (`apps/web/src/`)

- **`app/`** — Next.js App Router pages (home, about, works, contact)
- **`sections/`** — Page-specific section components (e.g., `home-page/`, `about-page/`)
- **`components/ui/`** — Reusable UI primitives with built-in GSAP/scroll animations
- **`components/elements/`** — Domain-specific components
- **`components/layout/`** — Navigation and footer
- **`provider/`** — Context providers composed as: Lenis (smooth scroll) → GSAP (animations) → App
- **`constants/`** — Static data (projects, skills, certificates, stacks, etc.)
- **`hooks/`** — Custom React hooks
- **`lib/`** — `cn()` utility, environment variable validation (`env.ts`)

Path alias: `@/` maps to `src/`.

### Animation Stack (Web)

- **GSAP 3.13** with ScrollTrigger and SplitText plugins, registered in `provider/gsap.tsx`
- **Lenis** for smooth scrolling (lerp: 0.05)
- Animation components: `animated-split-text`, `clip-up-text`, `velocity-text`, `tracked-section`

## Code Style

### Studio
- Prettier: no semicolons, single quotes, no bracket spacing, 100 char width

### Web
- ESLint enforces: no unused imports, descriptive variable names (no `e`, `i`, `el`), sorted imports
- Prettier with `prettier-plugin-tailwindcss` (auto-sorts Tailwind classes) and `prettier-plugin-organize-imports`
- Husky pre-commit hooks run ESLint + Prettier on staged files

## Important Constraints

- Package manager is **pnpm** — do not use npm or yarn
- Node >= 20, pnpm >= 10
- Schema changes in studio require `npx sanity schema deploy` to be available in the API
- After schema changes, run `pnpm typegen` in studio to regenerate web app types
- Web app environment variables (`NEXT_PUBLIC_SERVICE_ID`, `NEXT_PUBLIC_TEMPLATE_ID`, `NEXT_PUBLIC_PUBLIC_KEY`) are validated at build time — missing values will throw
- Both apps currently have independent `.git` directories — this monorepo is being consolidated from two separate repositories
