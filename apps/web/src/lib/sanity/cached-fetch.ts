import type { QueryParams } from "next-sanity";
import { unstable_cache } from "next/cache";
import { cache } from "react";

import { sanityClient } from "./client";

/**
 * Factory to create statically cached Sanity query functions.
 * Uses unstable_cache for cross-request caching and React.cache() for request dedup.
 * Bypasses defineLive so pages are served from cache instead of real-time subscriptions.
 */
export function createStaticQuery<T>(
  query: string,
  params: QueryParams = {},
  options: { revalidate?: number; tags?: string[] } = {},
) {
  const { revalidate = 60, tags = ["sanity"] } = options;

  return cache(
    unstable_cache(
      async (): Promise<T> => {
        const data = await sanityClient.fetch<T>(query, params);
        return data ?? ([] as T);
      },
      [`sanity:${query}:${JSON.stringify(params)}`],
      { revalidate, tags },
    ),
  );
}
