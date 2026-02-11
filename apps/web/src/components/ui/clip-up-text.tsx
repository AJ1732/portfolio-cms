"use client";
import { motion, useInView } from "motion/react";
import { useRef } from "react";

interface ClipUpTextProps {
  children: string;
}

const ClipUpText: React.FC<ClipUpTextProps> = ({ children }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { margin: "0px 0px -320px 0px", once: true });

  const characters = children.split("");

  return (
    <span ref={ref}>
      <span
        className="font-bebas-neue"
        style={{
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
          display: "inline-flex",
        }}
      >
        {characters.map((char, index) => (
          <motion.span
            key={index}
            initial={{ y: 115 }}
            animate={isInView ? { y: 0 } : { y: 615 }}
            transition={{
              delay: 0.2 + index * 0.05,
              duration: 0.5,
              type: "spring",
              damping: 20,
            }}
            style={{
              display: "inline-block",
            }}
          >
            {char === " " ? "\u00A0" : char}
          </motion.span>
        ))}
      </span>
    </span>
  );
};

export default ClipUpText;
