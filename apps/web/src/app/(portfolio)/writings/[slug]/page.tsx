import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";

import { ComponentDisplay } from "@/components/display";
import { getWritingBySlug, getWritings } from "@/lib/sanity/getters";
import { cn } from "@/lib/utils";
import {
  textComponents,
  WritingHeader,
} from "@/sections/writings-page/components";

const WRITINGS_OG_FALLBACK =
  "https://cdn.sanity.io/media-libraries/mlu3DBU0QaKb/images/containers/39o2KglYPExIP62Eduest1eUdWx/aj1732-writings.jpg";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const writing = await getWritingBySlug({ slug });
  if (!writing) return { title: "Not found" };

  const title = writing.metaTitle ?? writing.slug ?? "Writing";
  const description = writing.metaDescription ?? undefined;
  const ogImage = writing.metadataImage?.asset?.url ?? WRITINGS_OG_FALLBACK;
  const ogAlt = writing.metadataImage?.alt ?? title;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `/writings/${slug}`,
      type: "article",
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogAlt }],
      ...(writing.publishedAt && {
        publishedTime: writing.publishedAt,
      }),
      authors: ["Ejemen Iboi"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: `/writings/${slug}`,
    },
  };
}

export default async function WritingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch writing and list (both cached); list used for article number
  const [writing, writings] = await Promise.all([
    getWritingBySlug({ slug }),
    getWritings(),
  ]);
  if (!writing) notFound();

  const articleIndex = writings.findIndex((w) => w.slug === slug);
  const articleNumber =
    articleIndex !== -1 ? writings.length - articleIndex : writings.length;

  const Component =
    writing.componentID &&
    ComponentDisplay[writing.componentID as keyof typeof ComponentDisplay];

  return (
    <main
      className="content-grid text-base-expand place-content-start space-y-8 py-14 lg:py-20"
      style={
        { "--content-max-width": "max(50rem, 50vw)" } as React.CSSProperties
      }
    >
      <WritingHeader
        number={articleNumber}
        title={writing.title}
        description={writing.description}
      />

      {Component && <Component />}

      <section
        aria-label="Article content"
        className={cn("space-y-2 leading-[250%]")}
      >
        <PortableText value={writing.body ?? []} components={textComponents} />
      </section>
    </main>
  );
}
