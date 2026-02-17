import type { Metadata } from "next";
import Script from "next/script";

import { ClipUpText, ScreenFitText } from "@/components/ui";
import { getProjects } from "@/lib/sanity/getters";
import { cn } from "@/lib/utils";
import { ProjectCard } from "@/sections/works-page/components";

export const metadata: Metadata = {
  title:
    "Works | Ejemen Iboi — Pixel Perfect Engineer · Frontend · TypeScript · Pixel-Perfect UI · Design · React / Next.js",
  description:
    "Selected works and case studies by Ejemen Iboi — pixel-perfect projects using Next.js, TypeScript, React and modern toolchains.",
  openGraph: {
    title: "Works — Ejemen Iboi",
    description:
      "Explore projects and case studies built by Ejemen Iboi, Software Engineer · Frontend, focused on performance and accessible UI.",
    url: "https://ejemeniboi.com/works",
    images: [
      {
        url: "https://cdn.sanity.io/media-libraries/mlu3DBU0QaKb/images/containers/39o2JmzRtVfbko0cbBrlbza6ONu/aj1732-works.jpg",
        width: 1200,
        height: 630,
        alt: "Ejemen Iboi Works",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Works — Ejemen Iboi",
    description:
      "Projects and case studies by Ejemen Iboi, Software Engineer · Frontend",
    images: [
      "https://cdn.sanity.io/media-libraries/mlu3DBU0QaKb/images/containers/39o2JmzRtVfbko0cbBrlbza6ONu/aj1732-works.jpg",
    ],
  },
  alternates: {
    canonical: "https://ejemeniboi.com/works",
  },
};

export default async function WorksPage() {
  const projects = await getProjects();

  return (
    <div className="content-grid relative min-h-dvh space-y-10 py-20">
      {/* JSON-LD for Portfolio / WebSite */}
      <Script
        id="works-jsonld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWorkSeries",
            name: "Ejemen Iboi - Works",
            url: "https://ejemeniboi.com/works",
            description:
              "A collection of projects and case studies by Ejemen Iboi, Software Engineer · Frontend",
          }),
        }}
      />
      <ScreenFitText className="opacity-30">
        <ClipUpText>PROJECTS</ClipUpText>
      </ScreenFitText>

      <section className={cn("full-width grid h-fit gap-px")}>
        {projects.map((project) => (
          <ProjectCard key={project.slug} {...project} />
        ))}
      </section>
    </div>
  );
}
