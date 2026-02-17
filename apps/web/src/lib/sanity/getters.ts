import type {
  CERTIFICATES_QUERY_RESULT,
  CONTACTS_QUERY_RESULT,
  GALLERY_QUERY_RESULT,
  PROJECTS_QUERY_RESULT,
  SNIPPETS_QUERY_RESULT,
  STACKS_QUERY_RESULT,
  WRITING_BY_SLUG_QUERY_RESULT,
  WRITINGS_QUERY_RESULT,
} from "@/types/studio";

import { createStaticQuery } from "./cached-fetch";
import { createLiveQuery } from "./live-fetch";
import {
  CERTIFICATES_QUERY,
  CONTACTS_QUERY,
  GALLERY_QUERY,
  PROJECTS_QUERY,
  SNIPPETS_QUERY,
  STACKS_QUERY,
  WRITING_BY_SLUG_QUERY,
  WRITINGS_QUERY,
} from "./queries";

// ============================================
// Static Cached Getters - Add new getters here
// ============================================

export const getStacks = createStaticQuery<STACKS_QUERY_RESULT>(
  STACKS_QUERY,
  {},
  { revalidate: 300 },
);
export const getCertificates = createStaticQuery<CERTIFICATES_QUERY_RESULT>(
  CERTIFICATES_QUERY,
  {},
  { revalidate: 300 },
);
export const getGallery = createStaticQuery<GALLERY_QUERY_RESULT>(
  GALLERY_QUERY,
  {},
  { revalidate: 300 },
);
export const getSnippets = createStaticQuery<SNIPPETS_QUERY_RESULT>(
  SNIPPETS_QUERY,
  {},
  { revalidate: 60 },
);
export const getContacts = createStaticQuery<CONTACTS_QUERY_RESULT>(
  CONTACTS_QUERY,
  {},
  { revalidate: 300 },
);
export const getProjects = createStaticQuery<PROJECTS_QUERY_RESULT>(
  PROJECTS_QUERY,
  {},
  { revalidate: 120 },
);
export const getWritings =
  createLiveQuery<WRITINGS_QUERY_RESULT>(WRITINGS_QUERY);
export const getWritingBySlug = createLiveQuery<WRITING_BY_SLUG_QUERY_RESULT>(
  WRITING_BY_SLUG_QUERY,
);
