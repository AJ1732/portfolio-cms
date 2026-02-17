import Link from "next/link";
import { PortableText } from "next-sanity";

import { VSChevronLeft } from "@/assets/svgs";
import type { WRITING_BY_SLUG_QUERY_RESULT } from "@/types/studio";

import { headerComponents, textComponents } from "./portable";

interface WritingHeaderProps extends Pick<
  NonNullable<WRITING_BY_SLUG_QUERY_RESULT>,
  "title" | "description"
> {
  number: number;
}

export function WritingHeader({
  number,
  title,
  description,
}: WritingHeaderProps) {
  return (
    <header className="text-balance">
      <nav aria-label="Back to writings">
        <Link
          href="/writings"
          className="group mt-0.5 mb-6 -ml-1 flex items-center gap-2"
        >
          <span
            aria-hidden="true"
            className="grid size-7 place-items-center rounded-full bg-neutral-50 group-hover:bg-neutral-100"
          >
            <VSChevronLeft className="size-4.5" />
          </span>
          <span className="text-sm-expand uppercase">Back</span>
        </Link>
      </nav>

      <hgroup className="mb-4 space-y-4">
        <span
          aria-hidden="true"
          className="text-base-expand block text-neutral-500"
        >
          #{number}
        </span>
        {title && <PortableText value={title} components={textComponents} />}
      </hgroup>

      {description && description.length > 0 && (
        <PortableText value={description} components={headerComponents} />
      )}
    </header>
  );
}
