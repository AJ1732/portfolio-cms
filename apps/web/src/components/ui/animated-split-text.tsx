"use client";

import gsap from "gsap";
import SplitText from "gsap/SplitText";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

gsap.registerPlugin(SplitText);

type Props = {
  children: string;
  className?: string;
};

export default function AnimatedSplitText({ children, className }: Props) {
  const textRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;

    const split = new SplitText(textRef.current, { type: "chars" });
    const tl = gsap.timeline();

    tl.from(split.chars, {
      duration: 0.1,
      opacity: 0,
      stagger: 0.125,
      ease: "power1.in",
    }).to(split.chars, {
      duration: 0.25,
      opacity: 1,
      stagger: 0.125,
      ease: "power4.inOut",
      delay: 3,
    });

    return () => {
      split.revert();
    };
  }, []);

  return (
    <div className="overflow-hidden">
      <span ref={textRef} className={cn("leading-[100%]", className)}>
        {children}
      </span>
    </div>
  );
}
