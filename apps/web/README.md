This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Netlify

This app is set up for Netlify from the **monorepo root** (this repo). Use the config in `apps/web/netlify.toml`.

1. **Connect the repo**  
   In [Netlify](https://app.netlify.com): Add new site → Import an existing project → choose your Git provider and this repo.

2. **Build settings**
   - **Base directory:** leave empty (build from repo root).
   - **Package directory:** `apps/web` (so Netlify uses `apps/web/netlify.toml` and the Next.js app).
   - Build command and publish directory are read from `netlify.toml`; the Essential Next.js plugin will handle the output.

3. **Environment variables**  
   In **Site settings → Environment variables**, add:

   **Sanity (required)**
   - `NEXT_PUBLIC_SANITY_PROJECT_ID`
   - `NEXT_PUBLIC_SANITY_DATASET`
   - `NEXT_PUBLIC_SANITY_API_VERSION`

   **Contact form / EmailJS (required)**
   - `NEXT_PUBLIC_SERVICE_ID`
   - `NEXT_PUBLIC_TEMPLATE_ID`
   - `NEXT_PUBLIC_PUBLIC_KEY`

   **Optional (Sanity)**
   - `SANITY_API_READ_TOKEN`
   - `SANITY_API_WRITE_TOKEN`

4. **Deploy**  
   Trigger a deploy; the build runs `pnpm install` and `pnpm --filter portfolio-next build` from the repo root. Builds are skipped when only `apps/studio` or unrelated files change (see `ignore` in `netlify.toml`).

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
