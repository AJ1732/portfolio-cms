import { defineLive } from "next-sanity/live";

import { sanityClient } from "./client";
import { SANITY_ENV } from "./env";

/**
 * Live Content API setup for real-time updates
 *
 * IMPORTANT: You must render <SanityLive /> in your root layout
 * for real-time updates to work.
 *
 * Required env var: SANITY_API_READ_TOKEN (with Viewer permissions)
 */
export const { sanityFetch, SanityLive } = defineLive({
  client: sanityClient,
  serverToken: SANITY_ENV.READ_TOKEN,
  browserToken: SANITY_ENV.READ_TOKEN,
});
