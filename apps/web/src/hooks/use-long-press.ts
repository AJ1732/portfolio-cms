import { useCallback, useRef } from "react";

interface UseLongPressOptions {
  onAction: () => void;
  delay?: number; // Initial delay before repeating starts (ms)
  interval?: number; // Interval between repeats (ms)
  disabled?: boolean;
}

export function useLongPress({
  onAction,
  delay = 300,
  interval = 50,
  disabled = false,
}: UseLongPressOptions) {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const onActionRef = useRef(onAction);
  onActionRef.current = onAction;

  const clear = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const onPointerDown = useCallback(() => {
    if (disabled) return;

    // Immediate action on first press
    onActionRef.current();

    // Start continuous action after delay
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        onActionRef.current();
      }, interval);
    }, delay);
  }, [delay, interval, disabled]);

  const onPointerUp = useCallback(() => {
    clear();
  }, [clear]);

  const onPointerLeave = useCallback(() => {
    clear();
  }, [clear]);

  return {
    onPointerDown,
    onPointerUp,
    onPointerLeave,
  };
}
