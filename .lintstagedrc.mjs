const config = {
  "apps/web/**/*.{ts,tsx,js,jsx,mjs,cjs}": [
    "pnpm --filter portfolio-next exec eslint --fix --max-warnings=0",
    "pnpm --filter portfolio-next exec prettier --write",
  ],
  "apps/web/**/*.{json,md,mdx,css,html,yml,yaml}": [
    "pnpm --filter portfolio-next exec prettier --write",
  ],
  "apps/studio/**/*.{ts,tsx,js,jsx,mjs,cjs}": [
    "pnpm --filter=./apps/studio exec eslint --fix",
    "pnpm --filter=./apps/studio exec prettier --write",
  ],
  "apps/writings/**/*.{ts,tsx}": () =>
    "pnpm --filter writings exec tsc --noEmit",
};

export default config;
