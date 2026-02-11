"use client";

import { CONTROL_BUTTON_CLASSES } from "@/constants/video-player.constants";
import { cn } from "@/lib/utils";

export function ControlButton({
  onClick,
  icon: Icon,
  label,
  className,
  containerClassName,
}: ControlButtonProps) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={cn(containerClassName, CONTROL_BUTTON_CLASSES.base)}
    >
      <Icon
        className={cn(
          className,
          CONTROL_BUTTON_CLASSES.icon.base,
          CONTROL_BUTTON_CLASSES.icon.hover,
          CONTROL_BUTTON_CLASSES.icon.active,
          CONTROL_BUTTON_CLASSES.icon.focusVisible,
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          CONTROL_BUTTON_CLASSES.background.base,
          CONTROL_BUTTON_CLASSES.background.hover,
          CONTROL_BUTTON_CLASSES.background.active,
          CONTROL_BUTTON_CLASSES.background.focusVisible,
        )}
      />
    </button>
  );
}
