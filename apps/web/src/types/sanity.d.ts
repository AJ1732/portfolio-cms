import type { STACKS_QUERY_RESULT } from "./studio";

/**
 * Derived from the GROQ imageWithMetadataFragment projection.
 * Uses STACKS_QUERY_RESULT as the source since all queries
 * share the same image fragment.
 */
declare global {
  type SanityImageWithMetadata = NonNullable<
    STACKS_QUERY_RESULT[number]["icon"]
  >;
}

export {};
