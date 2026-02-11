"use client";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";

interface Props {
  children: React.ReactNode;
  className?: string;
}

const ScreenFitText: React.FC<Props> = ({ children, className }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    resizeText();

    window.addEventListener("resize", resizeText);

    return () => {
      window.removeEventListener("resize", resizeText);
    };
  }, []);

  const resizeText = () => {
    const container = containerRef.current;
    const text = textRef.current;

    if (!container || !text) {
      return;
    }

    const containerWidth = container.offsetWidth;
    let min = 1;
    let max = 2500;

    while (min <= max) {
      const mid = Math.floor((min + max) / 2);
      text.style.fontSize = mid + "px";

      if (text.offsetWidth <= containerWidth) {
        min = mid + 1;
      } else {
        max = mid - 1;
      }
    }

    text.style.fontSize = max + "px";
    text.style.lineHeight = max / 1.1 + "px";
    container.style.height = text.offsetHeight + "px";
  };

  return (
    <p
      className={cn(
        "font-bebas-neue relative z-10 flex h-screen w-full items-end overflow-hidden text-neutral-500/20",
        className,
      )}
      ref={containerRef}
    >
      <span
        className="absolute bottom-0 left-0 mx-auto text-center font-bold whitespace-nowrap uppercase"
        ref={textRef}
      >
        {children}
      </span>
    </p>
  );
};

export default ScreenFitText;
