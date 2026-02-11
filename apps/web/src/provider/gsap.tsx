"use client";
import gsap from "gsap";
import { ScrollTrigger, SplitText } from "gsap/all";

gsap.registerPlugin(ScrollTrigger, SplitText);

export function GSAPProvider({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
