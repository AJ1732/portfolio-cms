import { defineQuery } from "next-sanity";

// GROQ fragment for image with metadata (LQIP, dimensions, etc.)
export const imageWithMetadataFragment = `{
  asset->{
    _ref,
    _type,
    url,
    metadata {
      lqip,
      palette {
        dominant {
          background,
          foreground
        }
      },
      dimensions {
        width,
        height,
        aspectRatio
      }
    }
  },
  alt,
  hotspot,
  crop
}`;

// GROQ fragment for file/video with URL
export const fileWithUrlFragment = `{
  asset->{
    url
  }
}`;

// ============================================
// GROQ Queries
// ============================================

export const STACKS_QUERY = defineQuery(`
  *[_type=="stack"]{
    name,
    key,
    icon ${imageWithMetadataFragment}
  }
`);

export const SNIPPETS_QUERY = defineQuery(`
  *[_type=="snippet"] | order(orderRank) {
    _id,
    text
  }
`);

export const CERTIFICATES_QUERY = defineQuery(`
  *[_type=="certificate"] | order(orderRank) {
    _id,
    title,
    "issuingOrg": issuingOrg -> name,
    link
  }
`);

export const GALLERY_QUERY = defineQuery(`
  *[_type=="gallery"] | order(orderRank) {
    title,
    images[] ${imageWithMetadataFragment}
  }
`);

export const PROJECTS_QUERY = defineQuery(`
  *[_type=="project"] | order(orderRank) {
    title,
    "slug": slug.current,
    description,
    favicon ${imageWithMetadataFragment},
    demo {
      src ${fileWithUrlFragment},
      thumbnail ${imageWithMetadataFragment}
    },
    links,
    "stacks": stacks[] -> { name, key }
  }
`);

export const CONTACTS_QUERY = defineQuery(`
  *[_type=="contactLink"] {
    key,
    name,
    link
  }
`);

export const WRITINGS_QUERY = defineQuery(`
  *[_type=="writings"] | order(_createdAt asc) {
    title,
    "slug": slug.current,
    description,
  }
`);
