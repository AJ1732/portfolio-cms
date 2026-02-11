"use client";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { cn } from "@/lib/utils";
import { useTOC } from "@/provider/toc-context";

const TableOfContents = () => {
  const { sections } = useTOC();
  const [activeProject, setActiveProject] = useState("ShareBoard MVP");

  const onTitleClick = (id: number, title: string) => {
    setActiveProject(title);

    const targetElement = document.getElementById(`section-${id}`);
    const container = document.querySelector(".scrollable-container");

    if (targetElement && container) {
      const containerTop = container.getBoundingClientRect().top;
      const targetTop = targetElement.getBoundingClientRect().top;

      container.scrollTo({
        top: targetTop - containerTop + container.scrollTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {sections.map(({ id, title }) => {
        const isActive = title === activeProject;
        return (
          <motion.h3
            key={title}
            onClick={() => onTitleClick(id, title)}
            className={cn(
              "font-josefin flex cursor-pointer items-center justify-start gap-2 font-light text-zinc-500 hover:text-zinc-900 md:text-xl",
              isActive && "text-zinc-900",
            )}
          >
            <div className="relative">
              <AnimatePresence mode="wait">
                {isActive && (
                  <motion.div
                    key="active-indicator"
                    className="absolute -mt-2.5 h-4 w-1 rounded-full bg-orange-500"
                    initial={{ opacity: 0, scale: 0.8, x: -5 }}
                    animate={{ opacity: 1, scale: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.8, x: -5 }}
                    transition={{
                      duration: 0.3,
                      ease: [0.42, 0, 0.58, 1],
                    }}
                  />
                )}
              </AnimatePresence>
            </div>

            <motion.span
              initial={false}
              animate={{
                x: isActive ? 10 : 0,
              }}
              transition={{
                type: "spring",
                stiffness: 500,
                damping: 30,
              }}
            >
              {title}
            </motion.span>
          </motion.h3>
        );
      })}
    </div>
  );
};

export default TableOfContents;
