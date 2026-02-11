const SANITY_PROJECT_ID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const SANITY_DATASET = process.env.NEXT_PUBLIC_SANITY_DATASET;
const SANITY_API_VERSION = process.env.NEXT_PUBLIC_SANITY_API_VERSION;
const SANITY_READ_TOKEN = process.env.SANITY_API_READ_TOKEN;
const SANITY_WRITE_TOKEN = process.env.SANITY_API_WRITE_TOKEN;

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
  // Token for Live Content API (optional - only needed for real-time updates)
  READ_TOKEN: SANITY_READ_TOKEN,
  WRITE_TOKEN: SANITY_WRITE_TOKEN,
};
