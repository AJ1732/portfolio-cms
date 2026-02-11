"use client";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";
import { useRef } from "react";

interface VelocityTextProps {
  children: React.ReactNode;
}

const VelocityText: React.FC<VelocityTextProps> = ({ children }) => {
  const targetRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: targetRef,
    offset: ["start start", "end start"],
  });

  const scrollVelocity = useVelocity(scrollYProgress);

  const skewXRaw = useTransform(
    scrollVelocity,
    [-0.5, 0.5],
    ["45deg", "-45deg"],
  );
  const skewX = useSpring(skewXRaw, { mass: 3, stiffness: 400, damping: 50 });

  const xRaw = useTransform(scrollYProgress, [0, 1], [0, -4000]);
  const x = useSpring(xRaw, { mass: 3, stiffness: 400, damping: 50 });

  return (
    <section
      ref={targetRef}
      className="h-[200vh] bg-neutral-50 text-neutral-950"
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.p
          style={{ skewX, x }}
          className="origin-bottom-left text-5xl leading-[0.85] font-black whitespace-nowrap uppercase md:text-7xl md:leading-[0.85]"
        >
          {children}
          {/* Nothing in this world can take the place of persistence. Talent will
          not; nothing is more common than unsuccessful men with talent. Genius
          will not; unrewarded genius is almost a proverb. Education will not;
          the world is full of educated derelicts. Persistence and determination
          alone are omnipotent. The slogan 'Press On!' has solved and always
          will solve the problems of the human race. */}
        </motion.p>
      </div>
    </section>
  );
};

export default VelocityText;
