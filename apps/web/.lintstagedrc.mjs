const config = {
  // Run ESLint on TypeScript and JavaScript files
  "**/*.{ts,tsx,js,jsx,mjs,cjs}": [
    "eslint --fix --max-warnings=0",
    "prettier --write",
  ],
  // Run Prettier on other file types
  "**/*.{json,md,mdx,css,html,yml,yaml}": ["prettier --write"],
};

export default config;
