"use client";

import Lenis from "lenis";
import type React from "react";
import { type ReactNode, useEffect, useRef, useState } from "react";

interface LenisOptions {
  smoothWheel?: boolean;
  wheelMultiplier?: number;
  touchMultiplier?: number;
  duration?: number;
  easing?: (t: number) => number;
}

interface HorizontalScrollWithLenisProps<T> {
  data: T[];
  renderItem: (item: T, index: number) => ReactNode;
  className?: string;
  contentClassName?: string;
  itemClassName?: string;
  gap?: string;
  lenisOptions?: LenisOptions;
  ariaLabel?: string;
  hideScrollbar?: boolean;
  enableDragScroll?: boolean;
}

export default function HorizontalScrollWithLenis<T>({
  data,
  renderItem,
  className = "",
  contentClassName = "",
  itemClassName = "",
  gap = "gap-4",
  lenisOptions = {},
  ariaLabel = "horizontal scroll content",
  hideScrollbar = true,
  enableDragScroll = true,
}: HorizontalScrollWithLenisProps<T>) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, scrollLeft: 0 });

  const defaultLenisOptions: LenisOptions = {
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    ...lenisOptions,
  };

  // Drag to scroll functionality
  const handleMouseDown = (event: React.MouseEvent) => {
    if (!enableDragScroll || !scrollerRef.current) return;

    setIsDragging(true);
    setDragStart({
      x: event.pageX - scrollerRef.current.offsetLeft,
      scrollLeft: scrollerRef.current.scrollLeft,
    });

    // Temporarily disable Lenis smooth scrolling during drag
    if (lenisRef.current) {
      lenisRef.current.options.smoothWheel = false;
    }
  };

  const handleMouseMove = (event: React.MouseEvent) => {
    if (!isDragging || !scrollerRef.current) return;

    event.preventDefault();
    const x = event.pageX - scrollerRef.current.offsetLeft;
    const walk = (x - dragStart.x) * 2; // Scroll speed multiplier
    scrollerRef.current.scrollLeft = dragStart.scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);

    // Re-enable Lenis smooth scrolling after drag
    setTimeout(() => {
      if (lenisRef.current) {
        lenisRef.current.options.smoothWheel =
          defaultLenisOptions.smoothWheel ?? true;
      }
    }, 100);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleMouseUp();
    }
  };

  // Touch events for mobile drag scrolling
  const handleTouchStart = (event: React.TouchEvent) => {
    if (!enableDragScroll || !scrollerRef.current) return;

    const touch = event.touches[0];
    setIsDragging(true);
    setDragStart({
      x: touch.pageX - scrollerRef.current.offsetLeft,
      scrollLeft: scrollerRef.current.scrollLeft,
    });
  };

  const handleTouchMove = (event: React.TouchEvent) => {
    if (!isDragging || !scrollerRef.current) return;

    const touch = event.touches[0];
    const x = touch.pageX - scrollerRef.current.offsetLeft;
    const walk = (x - dragStart.x) * 1.5;
    scrollerRef.current.scrollLeft = dragStart.scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (!scrollerRef.current) return;

    // Create Lenis instance for horizontal scrolling
    lenisRef.current = new Lenis({
      wrapper: scrollerRef.current,
      content: scrollerRef.current.firstElementChild as HTMLElement,
      orientation: "horizontal",
      gestureOrientation: "horizontal",
      ...defaultLenisOptions,
    });

    // Handle wheel events for horizontal scrolling
    const handleWheel = (event: WheelEvent) => {
      if (!scrollerRef.current) return;

      // Allow both vertical and horizontal wheel scrolling
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        // Horizontal wheel - let Lenis handle it
        return;
      } else {
        // Vertical wheel - convert to horizontal scroll
        event.preventDefault();
        const delta = event.deltaY || event.deltaX;
        scrollerRef.current.scrollLeft += delta;
      }
    };

    const scroller = scrollerRef.current;
    scroller.addEventListener("wheel", handleWheel, { passive: false });

    // Animation loop
    function raf(time: number) {
      lenisRef.current?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenisRef.current?.destroy();
      scroller.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <div
      ref={scrollerRef}
      aria-label={ariaLabel}
      className={`relative h-fit max-w-full overflow-x-auto ${className} ${
        enableDragScroll ? "cursor-grab" : ""
      } ${isDragging ? "cursor-grabbing" : ""}`}
      style={{
        scrollbarWidth: hideScrollbar ? "none" : "auto",
        msOverflowStyle: hideScrollbar ? "none" : "auto",
        userSelect: isDragging ? "none" : "auto",
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <div className={`flex ${gap} ${contentClassName}`}>
        {data.map((item, index) => (
          <div
            key={index}
            className={`shrink-0 ${itemClassName}`}
            style={{ pointerEvents: isDragging ? "none" : "auto" }}
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
      {hideScrollbar && (
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      )}
    </div>
  );
}
