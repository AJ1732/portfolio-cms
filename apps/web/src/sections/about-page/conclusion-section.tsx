"use client";

import Link from "next/link";

import { ArrowUpRight } from "@/assets/svgs";
import { CopyButton, FactCard } from "@/components/elements";
import { useContacts } from "@/provider/sanity-data";

export default function ConclusionSection() {
  const { contacts } = useContacts();

  return (
    <section aria-labelledby="conclusion-heading">
      <FactCard text="I'm a big fan and learner of motion and design. I must have mentioned that..." />

      <p
        id="conclusion-heading"
        className="text-lg-expand lg:text-2xl-expand mt-8"
      >
        Thank you for taking the time to learn a bit about me. If you&apos;d
        like to chat about a project, explore ways we can work together, or just
        geek out over the latest frontend trends, let&apos;s connect! You can
        reach me via the contact links below.
      </p>
      <nav aria-label="Contact links">
        <ul
          role="list"
          className="mt-4 flex justify-center gap-2 space-y-8 uppercase sm:justify-evenly lg:p-8"
        >
          {contacts.map(({ key, name, link }) => {
            if (key === "email") {
              return (
                <li key={key} role="listitem">
                  <CopyButton label={name} text={link} />
                </li>
              );
            }
            return (
              <li key={key} role="listitem">
                <Link
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit ${name} profile (opens in new tab)`}
                  className="md:text-xl-expand lg:text-2xl-expand flex items-center gap-2 text-base hover:text-orange-500"
                >
                  {name} <ArrowUpRight aria-hidden="true" />
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </section>
  );
}
