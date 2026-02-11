"use client";
import { HTMLProps, useEffect, useRef } from "react";

import { useTOC } from "@/provider/toc-context";

interface TrackedSectionProps {
  sectionId: number;
  tocTitle: string;
}

const TrackedSection: React.FC<
  TrackedSectionProps & HTMLProps<HTMLElement>
> = ({ sectionId, tocTitle, ...props }) => {
  const { registerSection } = useTOC();

  useEffect(() => {
    registerSection({ id: sectionId, title: tocTitle });
  }, []);

  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      ref={sectionRef}
      id={`section-${sectionId}`}
      style={{ scrollMargin: "40vh" }}
      {...props}
    />
  );
};

export default TrackedSection;
