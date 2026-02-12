import { createImageUrlBuilder } from "@sanity/image-url";
import { createClient } from "next-sanity";

import { SANITY_ENV } from "./env";

export const sanityClient = createClient({
  projectId: SANITY_ENV.PROJECT_ID,
  dataset: SANITY_ENV.DATASET,
  apiVersion: SANITY_ENV.API_VERSION,
  useCdn: true,
  stega: {
    studioUrl: "https://aj1732-portfolio.sanity.studio",
  },
});

const builder = createImageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}
