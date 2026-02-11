"use client";

import { VSAdd, VSMinus, VSVolumeHigh } from "@/assets/svgs";
import {
  getIconFillClasses,
  VOLUME_CONSTANTS,
} from "@/constants/video-player.constants";
import { useLongPress } from "@/hooks/use-long-press";
import { cn } from "@/lib/utils";

import { ControlButton } from "./control-button";
import { VolumeLine } from "./volume-line";

export function VolumeRange({
  muted,
  volume,
  onToggleMute,
  onVolumeChange,
  onVolumeSet,
}: VolumeRangeProps) {
  const decreaseProps = useLongPress({
    onAction: () => onVolumeChange(-VOLUME_CONSTANTS.INCREMENT),
    delay: VOLUME_CONSTANTS.LONG_PRESS_DELAY,
    interval: VOLUME_CONSTANTS.LONG_PRESS_INTERVAL,
    disabled: volume <= VOLUME_CONSTANTS.MIN,
  });

  const increaseProps = useLongPress({
    onAction: () => onVolumeChange(VOLUME_CONSTANTS.INCREMENT),
    delay: VOLUME_CONSTANTS.LONG_PRESS_DELAY,
    interval: VOLUME_CONSTANTS.LONG_PRESS_INTERVAL,
    disabled: volume >= VOLUME_CONSTANTS.MAX,
  });

  return (
    <div className="ml-auto flex items-center gap-2">
      <div>
        <ControlButton
          onClick={onToggleMute}
          icon={VSVolumeHigh}
          label={`Sound ${muted ? "off" : "on"}`}
          className={cn(getIconFillClasses("volume"), {
            "[&>path:not(:first-child)]:ease-out-cubic [&>path:not(:first-child)]:opacity-0 [&>path:not(:first-child)]:transition-[transform_opacity] [&>path:not(:first-child)]:duration-200":
              muted,
          })}
        />
      </div>

      <div
        className={cn(
          "flex items-center gap-2 max-md:hidden",
          "[&>button]:rounded [&>button]:select-none",
          "[&>button]:focus-visible:bg-orange-100 [&>button]:active:bg-orange-100",
        )}
      >
        <button
          {...decreaseProps}
          disabled={volume <= VOLUME_CONSTANTS.MIN}
          aria-label="Decrease volume (hold to continuously decrease)"
        >
          <VSMinus />
        </button>

        <VolumeLine volume={volume} onVolumeChange={onVolumeSet} />

        <button
          {...increaseProps}
          disabled={volume >= VOLUME_CONSTANTS.MAX}
          aria-label="Increase volume (hold to continuously increase)"
        >
          <VSAdd />
        </button>
      </div>
    </div>
  );
}
