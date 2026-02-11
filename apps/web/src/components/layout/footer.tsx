"use client";

import dynamic from "next/dynamic";

import { useMotionInView } from "@/hooks/use-motion-in-view";

const RepeatStack = dynamic(() => import("@/components/elements/repeat-stack"));

const Footer = () => {
  const [footerRef, isInView] = useMotionInView<HTMLElement>({
    once: false,
    amount: 0.15,
  });

  return (
    <footer
      ref={footerRef}
      className="relative h-160 w-full bg-neutral-100 md:h-[max(20rem,40dvh)]"
      style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
    >
      <section className="fixed bottom-0 h-160 w-full px-3 md:h-[max(20rem,40dvh)]">
        <RepeatStack
          isInView={isInView}
          className="size-full bg-transparent text-neutral-200"
        />
      </section>
    </footer>
  );
};
export default Footer;
