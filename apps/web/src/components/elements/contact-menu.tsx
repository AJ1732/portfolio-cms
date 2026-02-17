"use client";

import Link from "next/link";

import { ArrowUpRight } from "@/assets/svgs";
import { cn } from "@/lib/utils";
import { useContacts } from "@/provider/sanity-data";

import { CopyButton } from "./index";

export default function ContactMenu({ className }: { className?: string }) {
  const { contacts } = useContacts();

  return (
    <menu
      className={cn(
        "md:text-xl-expand lg:text-2xl-expand text-base-expand uppercase",
        "[&_li]:hover:text-orange-500",
        className,
      )}
    >
      {contacts.map(({ key, name, link }) => {
        if (!name || !link) return null;
        if (key === "email") {
          return (
            <li key={key}>
              <CopyButton label={name} text={link} />
            </li>
          );
        }
        return (
          <li key={key}>
            <Link
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              {name} <ArrowUpRight />
            </Link>
          </li>
        );
      })}
    </menu>
  );
}
