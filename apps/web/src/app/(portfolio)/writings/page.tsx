import type { Metadata } from "next";
import { PortableText } from "next-sanity";
import Link from "next/link";

import { ClipUpText, ScreenFitText } from "@/components/ui";
import { getWritings } from "@/lib/sanity/getters";
import { cn } from "@/lib/utils";
import { titleComponents } from "@/sections/writings-page/components";

export const metadata: Metadata = {
  title: "Writings",
  description:
    "Articles and thoughts on web development, React, TypeScript, software engineering and design.",
};

export default async function WritingsPage() {
  const writings = await getWritings();

  return (
    <main className="content-grid relative min-h-svh py-14 *:col-start-1 *:row-start-1 lg:py-20">
      <ScreenFitText className="opacity-30">
        <ClipUpText>Writings</ClipUpText>
      </ScreenFitText>

      <ol
        aria-labelledby="writings-heading"
        className="z-10 mt-auto w-full list-decimal space-y-6 pt-20 pl-4"
      >
        {writings.map((writing) => (
          <li
            key={writing.slug}
            className="mx-auto"
            style={{ maxWidth: "max(50rem, 50vw)" }}
          >
            <Link
              href={`/writings/${writing.slug}`}
              className={cn(
                "text-xl-expand cursor-pointer",
                "prose prose-p:my-0 prose-code:after:content-[''] prose-code:before:content-[''] prose-code:font-light",
              )}
            >
              <PortableText
                value={writing.title}
                components={titleComponents}
              />
              <span className="text-base-expand text-neutral-500">
                <PortableText
                  value={writing.description}
                  components={titleComponents}
                />
              </span>
            </Link>
          </li>
        ))}
      </ol>
    </main>
  );
}
