"use client";

import { InteractiveSlider } from "@/components/ui/interactive-slider";

interface PlayLineProps extends Omit<
  SVGIconProps,
  "onChange" | "width" | "height" | "min" | "max" | "disabled"
> {
  progress?: number; // 0 to 1
  onChange?: (value: number) => void;
  disabled?: boolean;
}

export function PlayLine({
  progress = 0,
  onChange,
  disabled = false,
  className,
  ...props
}: PlayLineProps) {
  return (
    <InteractiveSlider
      value={progress}
      onChange={onChange}
      label="Video progress"
      width={140}
      height={24}
      trackStartX={5}
      trackEndX={135}
      showKnob={!!onChange} // Only show knob if interactive
      disabled={disabled}
      className={className}
      {...props}
    />
  );
}
