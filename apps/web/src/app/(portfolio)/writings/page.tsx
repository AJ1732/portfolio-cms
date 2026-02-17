import type { Metadata } from "next";
import Script from "next/script";

import { ClipUpText, ScreenFitText } from "@/components/ui";
import { getWritings } from "@/lib/sanity/getters";
import { WritingListCard } from "@/sections/writings-page/components";

export const metadata: Metadata = {
  title:
    "Writings | Ejemen Iboi — Pixel Perfect Engineer · TypeScript · Pixel-Perfect UI · Design · React / Next.js",
  description:
    "Articles and thoughts on web development, React, TypeScript, software engineering and design.",
  openGraph: {
    title: "Writings — Ejemen Iboi",
    description:
      "Articles and thoughts on web development, React, TypeScript, software engineering and design.",
    url: "https://ejemeniboi.com/writings",
    images: [
      {
        url: "https://cdn.sanity.io/media-libraries/mlu3DBU0QaKb/images/containers/39o2KglYPExIP62Eduest1eUdWx/aj1732-writings.jpg",
        width: 1200,
        height: 630,
        alt: "Writings by Ejemen Iboi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Writings — Ejemen Iboi",
    description:
      "Articles and thoughts on web development, React, TypeScript, software engineering and design.",
    images: [
      "https://cdn.sanity.io/media-libraries/mlu3DBU0QaKb/images/containers/39o2KglYPExIP62Eduest1eUdWx/aj1732-writings.jpg",
    ],
  },
  alternates: {
    canonical: "/writings",
  },
};

export default async function WritingsPage() {
  const writings = await getWritings();

  return (
    <main className="content-grid relative min-h-svh py-14 *:col-start-1 *:row-start-1 lg:py-20">
      {/* JSON-LD for Blog listing */}
      <Script
        id="writings-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            name: "Writings — Ejemen Iboi",
            url: "https://ejemeniboi.com/writings",
            description:
              "Articles and thoughts on web development, React, TypeScript, software engineering and design.",
            author: {
              "@type": "Person",
              name: "Ejemen Iboi",
              url: "https://ejemeniboi.com",
            },
          }),
        }}
      />

      <ScreenFitText className="opacity-30">
        <ClipUpText>Writings</ClipUpText>
      </ScreenFitText>

      <ol
        reversed
        aria-labelledby="writings-heading"
        className="z-10 mt-auto w-full list-decimal space-y-6 pt-20 pl-4"
      >
        {writings.map((writing) => (
          <WritingListCard key={writing.slug} writing={writing} />
        ))}
      </ol>
    </main>
  );
}
