"use client";
import { motion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import { cn } from "@/lib/utils";

interface ScrollLineProps {
  className?: string;
  containerRef?: React.RefObject<HTMLElement>;
}

const ScrollLine: React.FC<ScrollLineProps> = ({ className }) => {
  const scrollContainerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start start", "end end"],
  });

  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div
      ref={scrollContainerRef}
      className={cn("absolute inset-y-0 z-10", className)}
    >
      <div className="sticky h-full w-px">
        <motion.div
          className="w-full origin-top bg-orange-500"
          style={{ height: progressHeight }}
          transition={{ ease: "linear", duration: 5 }}
        />
      </div>
    </div>
  );
};
export default ScrollLine;
