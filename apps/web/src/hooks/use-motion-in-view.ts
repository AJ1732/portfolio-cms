"use client";

import type { UseInViewOptions } from "motion/react";
import { useInView } from "motion/react";
import { useRef } from "react";

interface UseMotionInViewOptions {
  /**
   * Only trigger animation once when element comes into view
   * @default true
   */
  once?: boolean;
  /**
   * Percentage of element that must be visible to trigger (0-1)
   * @default 0.3
   */
  amount?: number;
  /**
   * Margin around the viewport for early/late triggering
   * @default "0px"
   */
  margin?: UseInViewOptions["margin"];
}

/**
 * Hook to detect when an element is in the viewport using Motion's optimized useInView
 * Leverages Framer Motion's batched intersection observers for better performance
 *
 * @param options - Configuration options for viewport detection
 * @returns [ref, isInView] - Ref to attach to element and boolean indicating if element is in view
 *
 * @example
 * ```tsx
 * const [ref, isInView] = useMotionInView({ amount: 0.5 });
 *
 * <motion.div
 *   ref={ref}
 *   initial={{ opacity: 0, y: 20 }}
 *   animate={isInView ? { opacity: 1, y: 0 } : {}}
 * />
 * ```
 */
export function useMotionInView<T extends HTMLElement = HTMLDivElement>(
  options: UseMotionInViewOptions = {},
) {
  const { once = true, amount = 0.3, margin = "0px" } = options;

  const ref = useRef<T>(null);
  const isInView = useInView(ref, {
    once,
    amount,
    margin,
  });

  return [ref, isInView] as const;
}
