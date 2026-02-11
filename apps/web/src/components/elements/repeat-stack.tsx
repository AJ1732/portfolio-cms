"use client";

import { gsap } from "gsap";
import { useLayoutEffect, useMemo, useRef, useState } from "react";

import { useMotionInView } from "@/hooks/use-motion-in-view";
import { cn } from "@/lib/utils";

const BASE_STACKS = [
  "HTML",
  "CSS",
  "JavaScript",
  "TypeScript",
  "SASS/SCSS",
  "TailwindCSS",
  "React",
  "NextJS",
  "Zustand",
  "Redux & RTK",
  "TanStack Query",
  "Shadcn UI",
  "Docker",
  "AWS",
  "jQuery",
  "EJS",
  "Yup",
  "Zod",
  "Formik",
  "React-Hook-Form",
  "Git",
  "GitHub",
  "CI/CD pipeline",
  "Sanity.io",
  "DSA",
  "Vitest",
  "OOP",
  "NodeJS",
  "ExpressJS",
  "MongoDB",
  "PostgreSQL",
  "UI/UX Design",
  "Figma",
  "Vim",
] as const;

function useContainerSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const widthRef = useRef(0);
  const heightRef = useRef(0);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    if (!ref.current) return;

    const updateSize = () => {
      if (!ref.current) return;

      const { width, height } = ref.current.getBoundingClientRect();
      if (width !== widthRef.current || height !== heightRef.current) {
        widthRef.current = width;
        heightRef.current = height;
        setSize({ width, height });
      }
    };

    updateSize();

    const resizeObserver = new ResizeObserver(() => {
      requestAnimationFrame(updateSize);
    });

    resizeObserver.observe(ref.current);

    return () => resizeObserver.disconnect();
  }, []);

  return [ref, size] as const;
}

interface RepeatStackProps {
  className?: string;
  /** Externally controlled in-view state. When provided, skips internal IntersectionObserver. */
  isInView?: boolean;
}

const RepeatStack = ({
  className,
  isInView: externalIsInView,
}: RepeatStackProps) => {
  const [containerRef, { width, height }] = useContainerSize<HTMLDivElement>();
  const itemsRef = useRef<HTMLSpanElement[]>([]);
  const gsapContextRef = useRef<gsap.Context | null>(null);
  const [inViewRef, internalIsInView] = useMotionInView<HTMLDivElement>({
    once: false,
    amount: 0.15,
  });

  const isInView = externalIsInView ?? internalIsInView;

  const items = useMemo(() => {
    if (!width || !height) return [];

    const estimatedItemsNeeded = Math.ceil((width * height) / 4000);
    const repetitions = Math.max(
      3,
      Math.ceil(estimatedItemsNeeded / BASE_STACKS.length),
    );

    return Array.from({ length: repetitions }).flatMap(() => [...BASE_STACKS]);
  }, [width, height]);

  const isReady = width > 0 && height > 0 && items.length > 0;

  // Clear refs before each render to prevent stale DOM references
  itemsRef.current = [];

  useLayoutEffect(() => {
    const container = containerRef.current;
    const validItems = itemsRef.current.filter(Boolean);

    if (!isReady || !container || validItems.length === 0) return;

    // Revert previous GSAP context to clean up stale tweens
    gsapContextRef.current?.revert();

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    gsapContextRef.current = gsap.context(() => {
      if (prefersReducedMotion) {
        gsap.set(validItems, { opacity: isInView ? 1 : 0 });
        return;
      }

      if (isInView) {
        gsap.to(validItems, {
          opacity: 1,
          duration: 0.2,
          ease: "power2.out",
          stagger: {
            each: 0.01,
            from: "random",
          },
        });
      } else {
        gsap.to(validItems, {
          opacity: 0,
          duration: 0.3,
          ease: "power2.in",
          stagger: {
            each: 0.005,
            from: "random",
          },
        });
      }
    }, container);

    return () => {
      gsapContextRef.current?.revert();
    };
  }, [isReady, isInView, containerRef, items.length]);

  return (
    <div
      ref={(node) => {
        // Merge containerRef (from useContainerSize) and inViewRef (from useMotionInView)
        (containerRef as React.RefObject<HTMLDivElement | null>).current = node;
        (inViewRef as React.RefObject<HTMLDivElement | null>).current = node;
      }}
      className={cn(
        "h-dvh w-lg overflow-hidden bg-neutral-950 text-neutral-800",
        className,
      )}
      style={{ minHeight: "100%" }}
    >
      <ul className="-ml-4 flex w-[calc(100%+2rem)] flex-wrap justify-center">
        {items.map((text, index) => (
          <li
            key={`${text}-${index}`}
            ref={(element) => {
              if (element) itemsRef.current.push(element);
            }}
            className="ease-out-cubic px-3 py-1.5 whitespace-nowrap opacity-0 transition-colors duration-300 select-none hover:text-orange-500"
          >
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RepeatStack;
