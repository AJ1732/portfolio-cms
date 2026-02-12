import Link from "next/link";

import { VSChevronLeft } from "@/assets/svgs";

interface WritingHeaderProps {
  number: number;
  title: React.ReactNode;
  description: React.ReactNode;
  publishedAt: {
    display: string;
    datetime: string;
  };
}

export function WritingHeader({
  number,
  title,
  description,
  publishedAt,
}: WritingHeaderProps) {
  return (
    <header>
      <nav aria-label="Back to home">
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

      <h1 className="mb-4">
        <span className="block">#{number}</span>
        <span className="text-5xl-expand mt-2 leading-[120%] tracking-[0.01em] text-pretty">
          {title}
        </span>
      </h1>

      <p className="text-base-expand text-neutral-700">{description}</p>

      <dl className="text-sm-expand mt-1.5 flex items-center gap-1">
        <dt className="sr-only">Published date</dt>
        <dd>
          <time dateTime={publishedAt.datetime} className="text-orange-500">
            {publishedAt.display}
          </time>
        </dd>
      </dl>
    </header>
  );
}
