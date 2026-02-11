"use client";

import type { ReactNode } from "react";

import { CopyIcon } from "@/assets/svgs";
import { copyToClipboard } from "@/hooks/use-clipboard";

export default function CopyButton({
  label,
  text,
  variant = "full",
}: {
  label: ReactNode;
  text: string;
  variant?: "full" | "short";
}) {
  return (
    <button
      onClick={() => copyToClipboard(text)}
      className="md:text-xl-expand lg:text-2xl-expand text-base-expand flex items-center gap-2 uppercase hover:text-orange-500"
    >
      {label} {variant === "full" && <CopyIcon className="size-4" />}
    </button>
  );
}
