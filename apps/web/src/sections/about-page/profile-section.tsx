"use client";

import Link from "next/link";

import { BlurImage, FactCard } from "@/components/elements";
import { PROFILES } from "@/constants/images";
import { getSanityUrlWithLQIP } from "@/lib/sanity/image";
import { ImageItem } from "@/types/images";

function ProfileImage({ src, caption, dimensions, lqip }: ImageItem) {
  // Generate LQIP on-the-fly if not provided
  const lqipUrl = lqip || getSanityUrlWithLQIP(src);

  return (
    <figure className="bg-neutral-900">
      <BlurImage
        src={src}
        alt={caption}
        width={dimensions?.width || 800}
        height={dimensions?.height || 600}
        lqip={lqipUrl}
        className="size-full object-cover"
      />
    </figure>
  );
}

export default function DetailsSection() {
  return (
    <section className="relative z-10 -mt-20 space-y-8 md:-mt-50 lg:-mt-70">
      <div className="md:text-xl-expand text-lg-expand lg:text-2xl-expand tracking-wide">
        <h1 className="inline">
          <strong className="text-2xl-expand md:text-4xl-expand lg:text-5xl-expand font-light">
            Osezele Ejemen Iboi
          </strong>{" "}
          is my name, Hello World 👋
          <br /> I'm an Experienced Engineer
        </h1>
        with a proven track record in crafting pixel-perfect user interfaces,
        and lover of animations and{" "}
        <Link
          href={"https://design.ejemeniboi.com/"}
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit text-orange-500 hover:underline"
        >
          designs
        </Link>
      </div>

      <FactCard text="I started coding with a Samsung S8+ in 2020" />

      <div className="grid grid-cols-3 gap-x-1">
        {PROFILES.map((item) => (
          <ProfileImage key={item.tag} {...item} />
        ))}
      </div>

      <FactCard
        text={
          <>
            I&apos;m also a licensed{" "}
            <Link
              href={"https://pharm.ejemeniboi.com/"}
              target="_blank"
              rel="noopener noreferrer"
              className="w-fit text-orange-500 hover:underline"
            >
              pharmacist
            </Link>
          </>
        }
      />
    </section>
  );
}
