"use client";
import { useRouter } from "next/navigation";
import { PortableText } from "next-sanity";

import { cn } from "@/lib/utils";
import { cardComponents } from "@/sections/writings-page/components";
import type { WRITINGS_QUERY_RESULT } from "@/types/studio";

export function WritingListCard({
  writing,
}: {
  writing: WRITINGS_QUERY_RESULT[number];
}) {
  const router = useRouter();
  const handleClick = () => router.push(`/writings/${writing.slug}`);

  return (
    <li
      key={writing.slug}
      onClick={handleClick}
      className={cn(
        "group mx-auto cursor-pointer",
        "prose prose-a:custom-underline-round-dots prose-a:hover:text-orange-500 prose-p:my-0 prose-code:after:content-[''] prose-code:before:content-[''] prose-code:font-light",
      )}
      style={{ maxWidth: "max(50rem, 50vw)" }}
    >
      <div className="ease-out-cubic transition-transform duration-200 group-hover:translate-x-1">
        {writing.title && (
          <PortableText value={writing.title} components={cardComponents} />
        )}
      </div>
      {writing.description && (
        <PortableText value={writing.description} components={cardComponents} />
      )}
    </li>
  );
}
