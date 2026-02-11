"use client";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { textareaLabelVariants, textVariants } from "@/constants/variants";
import { cn } from "@/lib/utils";

export default function TextareaField({
  label,
  placeholderLabel,
  className,
  error,
  ...props
}: FieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div>
      <label className={cn("relative flex w-full items-center", className)}>
        <motion.span
          variants={textareaLabelVariants}
          initial="inactive"
          animate={isFocused ? "active" : "inactive"}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={cn(
            "pointer-events-none absolute left-4 pr-4 leading-[150%] text-neutral-600",
            // { "mt-5": isFocused },
          )}
        >
          <AnimatePresence mode="popLayout">
            <motion.span
              key={isFocused ? "active" : "inactive"}
              variants={textVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              className="inline-block"
            >
              {isFocused ? label : placeholderLabel}
            </motion.span>
          </AnimatePresence>
        </motion.span>
        <textarea
          rows={8}
          {...props}
          onFocus={() => setIsFocused(true)}
          onBlur={(event) => {
            if (event.target.value.trim() === "") setIsFocused(false);
          }}
          className={cn(
            "no-scrollbar min-h-12 w-full min-w-80 rounded-3xl border bg-neutral-50 px-4 py-3 transition-colors duration-300 ease-in-out outline-none",
            "hover:border-orange-500 hover:bg-orange-50",
            "focus-visible:border-orange-500 focus-visible:bg-orange-50 focus-visible:ring-[3px] focus-visible:ring-orange-100/50",
            { "border-red-500 ring-[3px] ring-red-100/50": error },
          )}
        />
      </label>
      {error && (
        <p className="text-xs-expand mt-1 px-4 text-red-600">{error}</p>
      )}
    </div>
  );
}
