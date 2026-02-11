"use client";

import { useEffect, useRef } from "react";

export function useDragToScroll<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const onMouseDown = (event: MouseEvent) => {
      isDown = true;
      element.classList.add("cursor-grabbing");
      startX = event.pageX - element.offsetLeft;
      scrollLeft = element.scrollLeft;
    };
    const onMouseLeave = () => {
      isDown = false;
      element.classList.remove("cursor-grabbing");
    };
    const onMouseUp = () => {
      isDown = false;
      element.classList.remove("cursor-grabbing");
    };
    const onMouseMove = (event: MouseEvent) => {
      if (!isDown) return;
      event.preventDefault(); // prevent text selection
      const x = event.pageX - element.offsetLeft;
      const walk = (x - startX) * 1; // scroll-fastness factor
      element.scrollLeft = scrollLeft - walk;
    };

    element.addEventListener("mousedown", onMouseDown);
    element.addEventListener("mouseleave", onMouseLeave);
    element.addEventListener("mouseup", onMouseUp);
    element.addEventListener("mousemove", onMouseMove);

    // also support touch events
    element.addEventListener("touchstart", (event: TouchEvent) => {
      isDown = true;
      startX = event.touches[0].pageX - element.offsetLeft;
      scrollLeft = element.scrollLeft;
    });
    element.addEventListener("touchend", () => (isDown = false));
    element.addEventListener("touchmove", (event: TouchEvent) => {
      if (!isDown) return;
      const x = event.touches[0].pageX - element.offsetLeft;
      const walk = (x - startX) * 1;
      element.scrollLeft = scrollLeft - walk;
    });

    return () => {
      element.removeEventListener("mousedown", onMouseDown);
      element.removeEventListener("mouseleave", onMouseLeave);
      element.removeEventListener("mouseup", onMouseUp);
      element.removeEventListener("mousemove", onMouseMove);
      // touch cleanup omitted for brevity
    };
  }, []);

  return ref;
}
