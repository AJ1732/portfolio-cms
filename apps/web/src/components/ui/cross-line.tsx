"use client";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

import { cn } from "@/lib/utils";

interface CrossLineProps {
  className?: string;
  dimension?: "height" | "width";
  duration?: number;
  delay?: number;
}

const CrossLine: React.FC<CrossLineProps> = ({
  className,
  dimension = "width",
  duration = 3,
  delay = 0,
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const variants = {
    hidden: {
      scaleX: dimension === "width" ? 0 : 1,
      scaleY: dimension === "height" ? 0 : 1,
    },
    visible: {
      scaleX: 1,
      scaleY: 1,
    },
  };

  return (
    <div
      ref={ref}
      className={cn(
        "absolute",
        dimension === "width"
          ? "inset-x-0 h-px w-full"
          : "inset-y-0 h-full w-px",
        className,
      )}
    >
      <motion.div
        className={cn(
          "bg-orange-500",
          dimension === "width" ? "h-full w-full" : "h-full w-full",
          dimension === "width" ? "origin-left" : "origin-top",
        )}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
        variants={variants}
        transition={{ ease: "linear", duration, delay }}
      />
    </div>
  );
};

export default CrossLine;
