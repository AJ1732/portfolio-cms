import type { QueryParams } from "next-sanity";
import { cache } from "react";

import { sanityFetch } from "./live";

/**
 * Cached Sanity query. Returned getter accepts optional params when called.
 * - List: getWritings() → Promise<Writing[]>
 * - Single: getWritingBySlug({ slug }) → Promise<Writing | null>
 */
export function createLiveQuery<T>(query: string) {
  return cache(async (params?: QueryParams): Promise<T> => {
    const { data } = await sanityFetch({ query, params });
    const fallback = params != null ? null : [];
    return (data ?? fallback) as T;
  });
}
