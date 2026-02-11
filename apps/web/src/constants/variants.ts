export const labelVariants = {
  inactive: {
    top: "50%",
    translateY: "-50%",
    fontSize: "max(1rem, 1vw)",
    color: "#525252",
  },
  active: {
    top: "-50%",
    translateY: "0%",
    fontSize: "max(0.875rem, 0.85vw)",
    color: "#262626",
  },
};

export const textareaLabelVariants = {
  inactive: {
    top: "max(1rem, 1vw)",
    fontSize: "max(1rem, 1vw)",
    color: "#525252",
  },
  active: {
    top: "-11.5%",
    fontSize: "max(0.875rem, 0.85vw)",
    color: "#262626",
  },
};

export const textVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: { duration: 0.25, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    filter: "blur(5px)",
    transition: { duration: 0.2, ease: "easeIn" },
  },
} as const;
