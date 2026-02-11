import Link from "next/link";

import { ClipUpText, ScreenFitText } from "@/components/ui";
import { cn } from "@/lib/utils";

export default function WritingsPage() {
  return (
    <div className="content-grid relative min-h-svh py-14 *:col-start-1 *:row-start-1 lg:py-20">
      <ScreenFitText className="opacity-30">
        <ClipUpText>Writings</ClipUpText>
      </ScreenFitText>

      <section
        className="z-10 mx-auto mt-auto w-full pt-20"
        style={{ maxWidth: "max(50rem, 50vw)" }}
      >
        <ul className="space-y-6">
          <li>
            <h3 className="text-base-expand mb-2 text-neutral-500">Recents</h3>
            <ol className="ml-4 list-decimal space-y-6">
              {Array.from({ length: 1 }).map((_, index) => (
                <li key={index} className={cn("")}>
                  <Link
                    href={`writings/${index + 1}`}
                    className="text-xl-expand cursor-pointer"
                  >
                    <h3>
                      Using React Query and Sonner&apos;s
                      <code className="bg-neutral-50 text-neutral-900">
                        toast.promise()
                      </code>{" "}
                      for better UX.
                    </h3>
                    <p className="text-sm-expand text-neutral-500">
                      Combining React Query&apos;s mutation state with
                      Sonner&apos;s{" "}
                      <code className="bg-neutral-50 text-neutral-900">
                        toast.promise()
                      </code>
                      .
                    </p>
                  </Link>
                </li>
              ))}
            </ol>
          </li>

          <li>
            <h3 className="text-base-expand mb-2 text-neutral-200">
              ––––––––––––
            </h3>
            <ol start={2} className="ml-4 list-decimal space-y-6">
              {Array.from({ length: 1 }).map((_, index) => (
                <li key={index} className={cn("")}>
                  <Link
                    href={`writings/${index + 1}`}
                    className="text-xl-expand cursor-pointer"
                  >
                    <h3>CSS specificity cheatsheet</h3>
                    <p className="text-sm-expand text-neutral-500">
                      CSS specificity numbering system displayed in a table.
                    </p>
                  </Link>
                </li>
              ))}
              <li className={cn("")}>
                <Link
                  href={`writings/3`}
                  className="text-xl-expand cursor-pointer"
                >
                  <h3>Building a responsive sheet and dialog</h3>
                  <p className="text-sm-expand text-neutral-500">
                    Utilizing shadcn/ui and the composition pattern to build a
                    responsive sheet and dialog.
                  </p>
                </Link>
              </li>
            </ol>
          </li>
        </ul>
      </section>
    </div>
  );
}
