"use client";
import { useEffect, useState } from "react";

/**
 * Tracks whether the window width is greater than or equal to the breakpoint.
 * @param breakpoint Width in pixels (default 1024)
 */
export function useIsDesktop(breakpoint: number = 1024): boolean {
  const [isDesktop, setIsDesktop] = useState(() =>
    globalThis.window === undefined ? false : window.innerWidth >= breakpoint,
  );

  useEffect(() => {
    const onResize = () => setIsDesktop(window.innerWidth >= breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);

  return isDesktop;
}
