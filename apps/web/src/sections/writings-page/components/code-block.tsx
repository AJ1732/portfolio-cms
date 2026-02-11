import { codeToHtml } from "shiki";

import { cn } from "@/lib/utils";

interface CodeBlockProps {
  children: string;
  label: string;
  language?: string;
  className?: string;
}

export async function CodeBlock({
  children,
  label,
  language = "tsx",
  className,
}: CodeBlockProps) {
  const html = await codeToHtml(children.trim(), {
    lang: language,
    theme: "github-light",
  });

  return (
    <div
      aria-label={label}
      className={cn("shiki-wrapper", className)}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
