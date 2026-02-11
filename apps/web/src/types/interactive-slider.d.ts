interface InteractiveSliderProps extends Omit<
  SVGIconProps,
  "onChange" | "width" | "height" | "min" | "max" | "disabled"
> {
  value: number; // Current value (0 to 1)
  onChange?: (value: number) => void;
  min?: number;
  max?: number;
  label: string; // For ARIA
  disabled?: boolean;
  showKnob?: boolean; // Whether to show draggable knob
  width?: number | string; // SVG width (number in px, or string like "100%")
  height?: number; // SVG height
  viewBoxWidth?: number; // ViewBox width (for coordinate calculations)
  trackStartX?: number; // Where track starts
  trackEndX?: number; // Where track ends
  animationDuration?: number; // In seconds
  className?: string;
}

interface SliderDimensions {
  width: number;
  height: number;
  trackStartX: number;
  trackEndX: number;
  centerY: number;
}
