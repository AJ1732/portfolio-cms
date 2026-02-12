import { defineEnableDraftMode } from "next-sanity/draft-mode";

import { sanityClient } from "@/lib/sanity/client";
import { SANITY_ENV } from "@/lib/sanity/env";

export const { GET } = defineEnableDraftMode({
  client: sanityClient.withConfig({ token: SANITY_ENV.READ_TOKEN }),
});
