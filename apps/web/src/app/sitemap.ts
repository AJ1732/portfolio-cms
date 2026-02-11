import type { MetadataRoute } from "next";

const BASE_URL = "https://ejemeniboi.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: new Date().toISOString() },
    { url: `${BASE_URL}/about`, lastModified: new Date().toISOString() },
    { url: `${BASE_URL}/works`, lastModified: new Date().toISOString() },
  ];

  // dynamic pages example: fetch project slugs from your API / CMS
  // replace this with your real data source (Sanity, markdown, etc.)
  // let dynamicUrls: MetadataRoute.Sitemap = [];
  // try {
  //   const res = await fetch(`${BASE_URL}/api/works`); // or fetch from your CMS endpoint
  //   if (res.ok) {
  //     const works = await res.json();
  //     dynamicUrls = works.map((w: any) => ({
  //       url: `${BASE_URL}/works/${w.slug}`,
  //       lastModified: w.updatedAt ?? new Date().toISOString(),
  //     }));
  //   }
  // } catch (err) {
  //   console.warn("Could not fetch works for sitemap:", err);
  // }

  return [
    ...staticUrls,
    // ...dynamicUrls
  ];
}
