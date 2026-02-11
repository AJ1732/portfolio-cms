export const VOLUME_CONSTANTS = {
  INCREMENT: 0.05,
  LONG_PRESS_DELAY: 300,
  LONG_PRESS_INTERVAL: 50,
  MIN: 0,
  MAX: 1,
} as const;

export const CONTROL_BUTTON_CLASSES = {
  base: "flex w-8 items-center group transition-[width] ease-out-cubic duration-300 hover:w-10",
  icon: {
    base: "transition-transform z-1 ease-out-cubic duration-300",
    hover: "group-hover:translate-x-2.25",
    active: "md:group-active:translate-x-2.25",
    focusVisible: "group-focus-visible:translate-x-2.25",
  },
  background: {
    base: "aspect-square pointer-events-none rounded-2xl bg-neutral-100 shrink-0 w-10 opacity-0 transition-[transform_opacity] duration-200",
    hover:
      "group-hover:bg-orange-100 group-hover:-translate-x-5.5 group-hover:opacity-100",
    active:
      "group-active:bg-orange-100 group-active:-translate-x-8.5 md:group-active:-translate-x-5.5 group-active:opacity-100",
    focusVisible:
      "group-focus-visible:bg-orange-100 group-focus-visible:-translate-x-5.5 group-focus-visible:opacity-100",
  },
} as const;

const ICON_FILL_CLASSES = {
  play: {
    base: "shrink-0 [&>path]:fill-neutral-100",
    hover: "[&>path]:group-hover:fill-orange-200",
    active: "[&>path]:group-active:fill-orange-200",
    focusVisible: "[&>path]:group-focus-visible:fill-orange-200",
  },
  volume: {
    base: "shrink-0 [&>path:first-child]:fill-neutral-100",
    hover: "[&>path:first-child]:group-hover:fill-orange-200",
    active: "[&>path:first-child]:group-active:fill-orange-200",
    focusVisible: "[&>path:first-child]:group-focus-visible:fill-orange-200",
  },
} as const;

export function getIconFillClasses(variant: keyof typeof ICON_FILL_CLASSES) {
  const classes = ICON_FILL_CLASSES[variant];
  return [classes.base, classes.hover, classes.active, classes.focusVisible];
}
