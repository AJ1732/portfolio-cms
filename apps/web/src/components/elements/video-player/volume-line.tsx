"use client";

import { InteractiveSlider } from "@/components/ui/interactive-slider";

interface VolumeLineProps extends Omit<
  SVGIconProps,
  | "onVolumeChange"
  | "width"
  | "height"
  | "onChange"
  | "min"
  | "max"
  | "disabled"
> {
  volume: number; // 0 to 1
  onVolumeChange?: (volume: number) => void;
}

export function VolumeLine({
  volume = 1,
  onVolumeChange,
  className,
  ...props
}: VolumeLineProps) {
  return (
    <InteractiveSlider
      value={volume}
      label="Volume"
      width={72}
      height={24}
      trackStartX={5}
      trackEndX={67}
      showKnob={true}
      onChange={onVolumeChange}
      className={className}
      {...props}
    />
  );
}
