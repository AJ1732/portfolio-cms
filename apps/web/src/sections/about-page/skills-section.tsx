"use client";

import { SanityImage } from "@/components/elements/sanity-image";
import { useStacks } from "@/provider/sanity-data";

export default function SkillsSection() {
  const { stacks } = useStacks();

  return (
    <div className="breakout mb-20 grid gap-8 lg:grid-cols-2">
      <header className="max-lg:text-center">
        <h2 className="section-heading">STACK & TOOLS</h2>
        <p className="text-base-expand text-neutral-700">
          These are the technologies I rely on most, though I&apos;m constantly
          expanding my toolkit.
        </p>
      </header>

      <div className="flex flex-wrap justify-center gap-6">
        {stacks.map(({ name, icon }) => (
          <figure key={name} className="flex flex-col items-center">
            <div className="relative flex size-16 items-center justify-center overflow-hidden rounded-full bg-[radial-gradient(circle_at_center,#fed7aacc_10%,transparent_90%)]">
              {icon && (
                <SanityImage
                  image={icon}
                  width={40}
                  height={40}
                  className="size-6 md:size-7 lg:size-8 [&>img]:object-contain"
                />
              )}
            </div>
            <figcaption className="font-bebas-neue text-sm-expand mt-2 text-center tracking-wide text-neutral-600">
              {name}
            </figcaption>
          </figure>
        ))}
      </div>
    </div>
  );
}
