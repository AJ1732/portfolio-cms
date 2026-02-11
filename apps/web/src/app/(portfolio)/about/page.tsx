import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";

import { FactCard } from "@/components/elements";
import { ClipUpText, ScreenFitText } from "@/components/ui";
import { getCertificates, getGallery, getSnippets } from "@/lib/sanity/getters";
import {
  ConclusionSection,
  DetailsStory,
  GallerySection,
  ProfileSection,
} from "@/sections/about-page";

export const metadata: Metadata = {
  title:
    "About | Ejemen Iboi — Pixel Perfect Engineer · TypeScript · Pixel-Perfect UI · Design · React / Next.js",
  description:
    "About Ejemen Iboi — software engineer focused on pixel-perfect UIs, performance and accessibility.",
  openGraph: {
    title: "About — Ejemen Iboi",
    description:
      "Learn about Ejemen Iboi — software engineer skilled in TypeScript, React, Next.js, performance and UI design.",
    url: "https://ejemeniboi.com/about",
    images: [
      {
        url: "https://cdn.sanity.io/media-libraries/mlu3DBU0QaKb/images/ef11f328d022ba5f53dc3708443553500bae7c7f-4800x2520.png",
        width: 1200,
        height: 630,
        alt: "About Ejemen Iboi",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About — Ejemen Iboi",
    description:
      "About Ejemen Iboi — software engineer focused on pixel-perfect UIs and performance.",
    images: [
      "https://cdn.sanity.io/media-libraries/mlu3DBU0QaKb/images/ef11f328d022ba5f53dc3708443553500bae7c7f-4800x2520.png",
    ],
  },
  alternates: {
    canonical: "https://ejemeniboi.com/about",
  },
};

export default async function AboutPage() {
  const [snippets, certificates, gallery] = await Promise.all([
    getSnippets(),
    getCertificates(),
    getGallery(),
  ]);

  return (
    <div className="content-grid relative space-y-24 py-20">
      {/* JSON-LD structured data for Person */}
      <Script
        id="about-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            name: "Ejemen Iboi",
            url: "https://ejemeniboi.com",
            sameAs: [
              "https://github.com/AJ1732",
              "https://www.linkedin.com/in/osezeleiboi",
            ],
            jobTitle: "Software Engineer",
            description:
              "Software engineer focused on building pixel-perfect and performant user interfaces with Next.js, TypeScript, React and Vue.js",
          }),
        }}
      />

      <ScreenFitText className="opacity-30">
        <ClipUpText>ABOUT ME</ClipUpText>
      </ScreenFitText>

      <ProfileSection />
      <DetailsStory {...{ snippets, certificates }} />
      <FactCard
        text={
          <>
            I&apos;m trying to be more consitent on{" "}
            <Link
              href={"https://leetcode.com/u/AJ1732/"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit text-orange-500 hover:underline"
            >
              LeetCode
            </Link>
          </>
        }
      />
      <GallerySection gallery={gallery} />
      <ConclusionSection />
    </div>
  );
}
