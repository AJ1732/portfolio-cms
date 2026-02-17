import Link from "next/link";

import { ArrowUpRight } from "@/assets/svgs";
import type {
  CERTIFICATES_QUERY_RESULT,
  SNIPPETS_QUERY_RESULT,
} from "@/types/studio";

type DetailsStoryProps = {
  snippets: SNIPPETS_QUERY_RESULT;
  certificates: CERTIFICATES_QUERY_RESULT;
};

export default function DetailsStory({
  snippets,
  certificates,
}: DetailsStoryProps) {
  return (
    <section className="full-width content-grid-flow relative mb-20">
      <div className="grid gap-8 xl:grid-cols-[1fr_35dvw]">
        <article className="mx-auto w-full columns-1 gap-6 leading-8 tracking-wide md:columns-2">
          {snippets.map(({ _id, text }) => (
            <p
              key={_id}
              className="text-lg-expand mb-12 break-inside-avoid leading-[150%]"
            >
              {text}
            </p>
          ))}
        </article>
        <section>
          <h3 className="section-heading tracking-wide uppercase xl:-mt-5">
            Certificates
          </h3>
          <dl className="relative flex h-fit max-w-full flex-wrap gap-6 gap-x-8 overflow-x-auto">
            {certificates.map((certificate) => {
              if (!certificate.link) return null;
              return (
                <div
                  key={certificate._id}
                  className="grid grid-cols-[1rem_1fr]"
                >
                  <div className="mt-2.5 size-1 rounded-full bg-neutral-700" />
                  <div className="transition-colors ease-out hover:text-orange-500">
                    <dt>
                      <Link
                        href={certificate.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base-expand inline w-fit items-center gap-2"
                      >
                        <span>{certificate.title}</span>
                        <ArrowUpRight className="mb-px ml-2 inline size-3" />
                      </Link>
                    </dt>
                    <dd className="text-xs-expand text-neutral-600">
                      {certificate.issuingOrg}
                    </dd>
                  </div>
                </div>
              );
            })}
          </dl>
        </section>
      </div>
    </section>
  );
}
