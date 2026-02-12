import { createStaticQuery } from "./cached-fetch";
import { createLiveQuery } from "./live-fetch";
import {
  CERTIFICATES_QUERY,
  CONTACTS_QUERY,
  GALLERY_QUERY,
  PROJECTS_QUERY,
  SNIPPETS_QUERY,
  STACKS_QUERY,
  WRITINGS_QUERY,
} from "./queries";

// ============================================
// Static Cached Getters - Add new getters here
// ============================================

export const getStacks = createStaticQuery<Stack[]>(
  STACKS_QUERY,
  {},
  { revalidate: 300 },
);
export const getCertificates = createStaticQuery<Certificate[]>(
  CERTIFICATES_QUERY,
  {},
  { revalidate: 300 },
);
export const getGallery = createStaticQuery<Gallery[]>(
  GALLERY_QUERY,
  {},
  { revalidate: 300 },
);
export const getSnippets = createStaticQuery<Snippet[]>(
  SNIPPETS_QUERY,
  {},
  { revalidate: 60 },
);
export const getContacts = createStaticQuery<Contact[]>(
  CONTACTS_QUERY,
  {},
  { revalidate: 300 },
);
export const getProjects = createStaticQuery<Project[]>(
  PROJECTS_QUERY,
  {},
  { revalidate: 120 },
);
export const getWritings = createLiveQuery<Writing[]>(WRITINGS_QUERY);
