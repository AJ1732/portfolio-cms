"use client";
import { motion } from "motion/react";

interface FlipDivProps {
  text: string;
  under: string | React.ReactNode;
}

const DURATION = 0.25;
const STAGGER = 0.025;

const FlipDiv: React.FC<FlipDivProps> = ({ text, under }) => {
  return (
    <div className="font-pjs h-fit min-w-16 cursor-default break-inside-avoid rounded-sm bg-neutral-400/5 text-center text-neutral-600 hover:bg-orange-500 hover:text-white">
      <motion.div
        initial="initial"
        whileHover="hovered"
        className="relative block overflow-hidden px-10 py-6 text-xl tracking-wider whitespace-nowrap uppercase"
        style={{ lineHeight: 0.85 }}
      >
        <div>
          <motion.span
            className="inline-block pt-1"
            variants={{
              initial: { y: "-10%" },
              hovered: { y: "-500%" },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER,
            }}
          >
            {text}
          </motion.span>
        </div>

        <div className="absolute inset-0">
          <motion.span
            className="flex items-center justify-center text-3xl"
            variants={{
              initial: { y: "500%" },
              hovered: { y: "70%" },
            }}
            transition={{
              duration: DURATION,
              ease: "easeInOut",
              delay: STAGGER,
            }}
          >
            {under ? under : <span className="pt-0.5 text-xl">{text}</span>}
          </motion.span>
        </div>
      </motion.div>
    </div>
  );
};
export default FlipDiv;
