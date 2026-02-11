"use client";

import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
}

export default function Button({ children, className, ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={cn(
        "flex h-12 min-w-24 items-center justify-center gap-2 rounded-3xl bg-zinc-950 px-4 font-semibold text-white disabled:opacity-50",
        "transition-[transform_150ms_ease-out,background-color_150ms_ease,color_150ms_ease] hover:bg-neutral-700 active:scale-[0.98]",
        "focus-visible:ring-[3px] focus-visible:ring-orange-500/50 active:ring-orange-500/50",
        "motion-reduce:transition-none motion-reduce:active:scale-100",
        className,
      )}
    >
      {children}
    </button>
  );
}
