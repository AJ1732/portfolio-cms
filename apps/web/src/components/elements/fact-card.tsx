import { cn } from "@/lib/utils";

export default function FactCard({
  text,
  className,
}: {
  text: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "md:text-xl-expand text-lg-expand lg:text-2xl-expand border-l-2 border-orange-500 pl-4",
        className,
      )}
    >
      Do you know? {text}
    </div>
  );
}
