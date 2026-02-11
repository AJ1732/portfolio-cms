"use client";
import { motion, useAnimation, useInView } from "motion/react";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

interface Props {
  width?: string;
  delay?: number;
  children?: React.ReactNode;
  className?: string;
  bg?: string;
}

const RevealCross = ({
  children,
  className,
  delay = 0.5,
  width = "fit-content",
  bg,
}: Props) => {
  const ref = useRef(null);
  const isInVIew = useInView(ref, { once: true });
  const mainControls = useAnimation();
  const slideControls = useAnimation();

  // const DELAY = 0.5;

  useEffect(() => {
    if (isInVIew) {
      mainControls.start("visible");
      slideControls.start("visible");
    }
  }, [isInVIew, mainControls, slideControls]);

  return (
    <div
      ref={ref}
      style={{ position: "relative", width, overflow: "hidden" }}
      className={bg}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 75 },
          visible: { opacity: 1, y: 0 },
        }}
        initial="hidden"
        animate={mainControls}
        transition={{ duration: 0.5, delay }}
      >
        {children}
      </motion.div>

      {/* CROOSING DIV */}
      <motion.div
        variants={{
          hidden: { left: 0 },
          visible: { left: "100%" },
        }}
        initial="hidden"
        animate={slideControls}
        transition={{ duration: 0.5, ease: "easeIn", delay: delay + 0.25 }}
        className={cn("absolute inset-0 z-20 bg-neutral-950", className)}
      ></motion.div>
    </div>
  );
};

export default RevealCross;
