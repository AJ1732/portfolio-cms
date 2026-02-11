import { cn } from "@/lib/utils";

interface ArticleSectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ArticleSection({
  id,
  title,
  children,
  className,
}: ArticleSectionProps) {
  return (
    <section
      aria-labelledby={id}
      className={cn(
        "space-y-4 leading-[200%]",
        "[&_h3]:text-xl-expand [&_h3]:mt-6 [&_h3]:mb-2 [&_h3]:font-semibold",
        className,
      )}
    >
      <h2 id={id} className="text-2xl-expand font-semibold">
        {title}
      </h2>
      {children}
    </section>
  );
}
