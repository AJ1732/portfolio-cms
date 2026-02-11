# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

**Package Manager**: This project uses **pnpm** (not npm or yarn)

### Core Commands

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build production bundle
- `pnpm start` - Start production server

### Code Quality Commands

- `pnpm type` - Run TypeScript type checking (no emit)
- `pnpm lint` - Run ESLint with max warnings set to 0
- `pnpm lint:fix` - Auto-fix ESLint errors where possible
- `pnpm format` - Format all files with Prettier
- `pnpm format:check` - Check if files are formatted correctly
- `pnpm check` - Run all checks (type + lint + format:check)

### Code Quality Tools

#### ESLint Configuration

The project uses a comprehensive ESLint setup (eslint.config.mjs) with:

- **@next/eslint-plugin-next**: Next.js specific rules
- **@typescript-eslint**: TypeScript linting
- **eslint-plugin-react-hooks**: React hooks rules
- **eslint-plugin-simple-import-sort**: Auto-sorts imports/exports
- **eslint-plugin-unicorn**: Additional code quality rules (enforces descriptive variable names, prevents common pitfalls)
- **eslint-plugin-unused-imports**: Removes unused imports

Key rules enforced:

- No unused variables or imports
- Descriptive variable names (no single-letter abbreviations like `e`, `i`, `el`)
- Sorted imports and exports
- Exhaustive deps for React hooks is disabled (intentional)

#### Prettier Configuration

Uses Prettier with plugins that auto-run:

- `prettier-plugin-organize-imports` - Auto-organizes imports
- `prettier-plugin-tailwindcss` - Auto-sorts Tailwind classes

#### Pre-commit Hooks (Husky + lint-staged)

The project has Git pre-commit hooks configured that automatically:

- Run ESLint with auto-fix on staged TypeScript/JavaScript files
- Run Prettier on all staged files
- Block commits if there are linting errors

Configuration:

- **Husky**: Manages Git hooks (.husky/pre-commit)
- **lint-staged**: Runs linters on staged files (.lintstagedrc.mjs)

## Project Architecture

### Tech Stack

- **Framework**: Next.js 16 (App Router)
- **React**: 19.2.3
- **Styling**: Tailwind CSS 4.1.5
- **Animations**: GSAP 3.13 with SplitText and ScrollTrigger plugins
- **Smooth Scroll**: Lenis 1.3.1
- **Forms**: React Hook Form + Zod validation
- **Email**: EmailJS browser integration
- **TypeScript**: Strict mode enabled

### Directory Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with providers, metadata, SEO
│   ├── page.tsx           # Home page
│   ├── about/page.tsx     # About page
│   ├── works/page.tsx     # Projects/portfolio page
│   └── contact/page.tsx   # Contact page
├── sections/              # Page-specific section components
│   ├── home-page/
│   ├── about-page/
│   ├── works-page/
│   └── contact-page/
├── components/
│   ├── ui/               # Reusable UI components with animations
│   ├── elements/         # Domain-specific components
│   └── layout/           # Navigation and Footer
├── provider/             # React Context providers
│   ├── gsap.tsx         # GSAP plugin registration
│   ├── react-lenis.tsx  # Smooth scroll configuration
│   └── toc-context.tsx  # Table of contents tracking
├── hooks/               # Custom React hooks
├── lib/
│   ├── utils.ts        # cn() utility for className merging
│   └── env.ts          # Environment variable validation
├── utils/              # General utilities
├── constants/          # Static data (projects, skills, archives, etc.)
├── assets/             # Fonts and SVG components
└── types/              # TypeScript type definitions
```

### Key Patterns

#### Path Aliases

The project uses `@/` as an alias for `src/`:

```typescript
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui";
```

#### Animation Architecture

1. **GSAP Registration**: GSAP plugins (ScrollTrigger, SplitText) are registered in `src/provider/gsap.tsx`
2. **Smooth Scrolling**: Lenis provider wraps the app with lerp: 0.05 configuration
3. **Animation Components**: Reusable animation components in `src/components/ui/` like:
   - `animated-split-text.tsx` - Character-by-character text reveals
   - `clip-up-text.tsx` - Clip-path text animations
   - `velocity-text.tsx` - Scroll-velocity based animations
   - `tracked-section.tsx` - Intersection observer tracking

#### Provider Stack

Providers are composed in `src/provider/index.tsx`:

```
LenisProvider (smooth scroll)
  → GSAPProvider (animation plugins)
    → App content
```

#### Form Handling

Forms use React Hook Form with Zod schema validation:

- Schema defined with Zod
- `zodResolver` connects schema to react-hook-form
- Custom `InputField` and `TextareaField` components
- Toast notifications via Sonner

#### Environment Variables

Environment variables are validated at build time in `src/lib/env.ts`:

- `NEXT_PUBLIC_SERVICE_ID` - EmailJS service ID
- `NEXT_PUBLIC_TEMPLATE_ID` - EmailJS template ID
- `NEXT_PUBLIC_PUBLIC_KEY` - EmailJS public key

Missing variables will throw errors during build.

#### Styling Utilities

- Use `cn()` from `@/lib/utils` to merge Tailwind classes with clsx
- Custom fonts: Bebas Neue and Neue Einstellung (configured in assets/font)
- Tailwind variables defined in `bebasNeue.variable` and `neueEinstellung.variable`

### Image Configuration

Next.js Image component allows remote patterns from:

- `udemy-certificate.s3.amazonaws.com` - Certificate images
- `cdn.sanity.io` - CMS images

### SEO & Metadata

Root layout includes:

- OpenGraph metadata
- Twitter card metadata
- Structured data (JSON-LD) for Person schema
- Custom favicon configurations

### Component Organization

- **sections/**: Large page sections composed of smaller components
- **components/ui/**: Reusable UI primitives with built-in animations
- **components/elements/**: Domain-specific reusable components
- **components/layout/**: Navigation, Footer shared across pages

### Data Management

Static data is organized in `src/constants/`:

- `projects.ts` - Portfolio projects
- `skills.ts` - Tech stack/skillset
- `certificates.ts` - Certifications
- `archives.ts` - Archived work
- `stacks.ts` - Technology stacks
- `contact-links.ts` - Social/contact links
- `navlinks.ts` - Navigation menu items
