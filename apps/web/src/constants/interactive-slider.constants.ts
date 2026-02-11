export const SLIDER_DEFAULTS = {
  MIN: 0,
  MAX: 1,
  WIDTH: 100,
  HEIGHT: 24,
  TRACK_START_X: 5,
  TRACK_END_X: 95,
  CENTER_Y: 12,
  KNOB_RADIUS: 5,
  ANIMATION_DURATION: 0.2,
  ANIMATION_EASING: "0.33 1 0.68 1",
  KEYBOARD_STEP: 0.05,
} as const;

export const SLIDER_STYLES = {
  backgroundTrack: {
    opacity: 0.2,
    strokeWidth: 1,
  },
  activeTrack: {
    strokeWidth: 1.25,
  },
  knob: {
    cursor: "cursor-grab active:cursor-grabbing",
  },
} as const;
