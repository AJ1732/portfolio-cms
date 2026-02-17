"use client";
import Link from "next/link";

import { ArrowUpRight } from "@/assets/svgs";
import { SanityImage } from "@/components/elements/sanity-image";
import { useMotionInView } from "@/hooks/use-motion-in-view";
import { buildSanityImageUrl } from "@/lib/sanity/image";
import { cn } from "@/lib/utils";
import type { PROJECTS_QUERY_RESULT } from "@/types/studio";

export default function ProjectCard({
  title,
  description,
  favicon,
  demo,
  stacks,
  links,
}: PROJECTS_QUERY_RESULT[number]) {
  // Only play video if in viewport
  const [videoRef, inView] = useMotionInView<HTMLVideoElement>({
    once: true,
    margin: "200px",
  });

  // Extract URLs from Sanity objects
  const videoSource = demo?.src?.asset?.url || "";
  const thumbnailUrl = demo?.thumbnail
    ? buildSanityImageUrl(demo.thumbnail, { width: 800, quality: 80 })
    : "";

  return (
    <article
      key={title}
      aria-labelledby={`project-${title}`}
      className="bg-neutral-100"
    >
      <div
        className={cn(
          "group text-sm-expand relative mx-auto grid w-full md:grid-cols-[1fr_2fr_auto]",
          "*:transition-all *:duration-500",
        )}
        style={{ maxWidth: `max(70rem, 70vw)` }}
      >
        {/* TITLE AND FAVICON */}
        <header className="flex flex-col justify-end gap-2 px-4 pt-6 pb-2 md:gap-4 md:py-6">
          {favicon && (
            <SanityImage
              image={favicon}
              width={200}
              height={200}
              className="aspect-square size-14 overflow-hidden rounded-2xl object-cover"
            />
          )}
          <h3 id={`project-${title}`} className="xl:text-lg-expand uppercase">
            <Link
              href={links?.demo ?? "#"}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${title} (opens in new tab)`}
              className="hover:text-orange-500 focus-visible:outline-orange-500"
            >
              {title}
              <ArrowUpRight
                aria-hidden="true"
                className="-mb-px ml-2 inline size-3 align-baseline"
              />
            </Link>
          </h3>
        </header>

        {/* DESCRIPTION */}
        <div className="relative flex flex-col gap-4 px-4 pb-4 lg:py-6">
          <p className="text-sm-expand mt-auto h-fit max-w-4xl leading-[175%] text-neutral-600">
            {description}
          </p>

          <dl className="text-xs-expand flex flex-wrap gap-y-2 uppercase">
            {stacks?.map((stack, index) => (
              <dt key={stack.key}>
                {stack.name}
                {index !== (stacks?.length ?? 0) - 1 && (
                  <span className="mx-2 text-neutral-400">•</span>
                )}
              </dt>
            ))}
          </dl>
        </div>

        {/* PROJECT DEMO VIDEO */}
        <div
          className={cn(
            "grid aspect-video w-full place-content-end overflow-hidden sm:max-w-80",
          )}
        >
          <video
            ref={videoRef}
            autoPlay={inView}
            loop={inView}
            muted
            playsInline
            preload={inView ? "auto" : "none"}
            poster={thumbnailUrl}
            aria-label={`${title} project demo video`}
            className="h-auto w-full object-cover transition-all duration-300 ease-in-out"
          >
            {inView && videoSource && (
              <source src={videoSource} type="video/mp4" />
            )}
            Your browser does not support the video tag. View the project by
            clicking the title above.
          </video>
        </div>
      </div>
    </article>
  );
}
