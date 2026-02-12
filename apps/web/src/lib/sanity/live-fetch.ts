import type { QueryParams } from "next-sanity";
import { cache } from "react";

import { sanityFetch } from "./live";

/**
 * Factory to create cached Sanity query functions.
 * Uses React's cache() for server-side request deduplication.
 *
 * Easily extensible for any data type:
 * @example
 *   export const getStacks = createLiveQuery<Stack[]>(STACKS_QUERY);
 */
export function createLiveQuery<T>(query: string, params?: QueryParams) {
  return cache(async (): Promise<T> => {
    const { data } = await sanityFetch({ query, params });
    return (data ?? []) as T;
  });
}
