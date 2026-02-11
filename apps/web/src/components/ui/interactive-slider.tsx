"use client";

import { useCallback, useEffect, useRef } from "react";

import {
  SLIDER_DEFAULTS,
  SLIDER_STYLES,
} from "@/constants/interactive-slider.constants";
import { usePreviousValue } from "@/hooks/use-previous-value";
import { cn } from "@/lib/utils";

export function InteractiveSlider({
  value,
  onChange,
  min = SLIDER_DEFAULTS.MIN,
  max = SLIDER_DEFAULTS.MAX,
  label,
  disabled = false,
  showKnob = true,
  width = SLIDER_DEFAULTS.WIDTH,
  height = SLIDER_DEFAULTS.HEIGHT,
  viewBoxWidth,
  trackStartX = SLIDER_DEFAULTS.TRACK_START_X,
  trackEndX = SLIDER_DEFAULTS.TRACK_END_X,
  animationDuration = SLIDER_DEFAULTS.ANIMATION_DURATION,
  className,
  ...props
}: InteractiveSliderProps) {
  // Calculate viewBox width: use explicit prop, or width if it's a number, or default
  const calculatedViewBoxWidth =
    viewBoxWidth ?? (typeof width === "number" ? width : SLIDER_DEFAULTS.WIDTH);
  const svgRef = useRef<SVGSVGElement>(null);
  const knobRef = useRef<SVGCircleElement>(null);
  const isDragging = useRef(false);
  const dragOffset = useRef(0); // Store offset from knob center when drag starts
  const lineAnimateRef = useRef<SVGAnimateElement>(null);
  const circleAnimateRef = useRef<SVGAnimateElement>(null);

  // Normalize value to 0-1 range
  const normalizedValue = (value - min) / (max - min);

  // Calculate positions based on normalized value
  const centerY = height / 2;
  const valueX = trackStartX + (trackEndX - trackStartX) * normalizedValue;
  const previousValueX = usePreviousValue(valueX);

  // Trigger SMIL animations when value changes
  useEffect(() => {
    if (lineAnimateRef.current) {
      lineAnimateRef.current.beginElement();
    }
    if (circleAnimateRef.current && showKnob) {
      circleAnimateRef.current.beginElement();
    }
  }, [valueX, showKnob]);

  // Handle drag interaction
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || !onChange || disabled) return;

    const handlePointerMove = (event: PointerEvent) => {
      if (!isDragging.current) return;

      const rect = svg.getBoundingClientRect();
      const screenX = event.clientX - rect.left;

      // Convert screen pixels to viewBox coordinates
      const svgX = (screenX / rect.width) * calculatedViewBoxWidth;

      // Adjust for drag offset (where user grabbed the knob)
      const adjustedSvgX = svgX - dragOffset.current;

      const newNormalizedValue = Math.max(
        0,
        Math.min(1, (adjustedSvgX - trackStartX) / (trackEndX - trackStartX)),
      );
      const newValue = min + newNormalizedValue * (max - min);
      onChange(newValue);
    };

    const handlePointerUp = () => {
      isDragging.current = false;
      dragOffset.current = 0;
      document.body.style.cursor = "";
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, [
    onChange,
    min,
    max,
    trackStartX,
    trackEndX,
    disabled,
    calculatedViewBoxWidth,
  ]);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<SVGCircleElement>) => {
      if (disabled || !onChange) return;

      const svg = svgRef.current;
      const knob = knobRef.current;
      if (!svg || !knob) return;

      // Prevent default touch behavior (scrolling, zooming)
      event.preventDefault();

      // Capture pointer to ensure we continue receiving events even when moving outside element
      event.currentTarget.setPointerCapture(event.pointerId);

      // Add active state class for visual feedback
      knob.classList.add("is-active");

      // Calculate where user clicked relative to knob center
      const rect = svg.getBoundingClientRect();
      const screenX = event.clientX - rect.left;
      const clickedSvgX = (screenX / rect.width) * calculatedViewBoxWidth;

      // Store offset from knob center (valueX)
      dragOffset.current = clickedSvgX - valueX;

      isDragging.current = true;
      document.body.style.cursor = "grabbing";
    },
    [disabled, onChange, calculatedViewBoxWidth, valueX],
  );

  const handlePointerUp = useCallback(
    (event: React.PointerEvent<SVGCircleElement>) => {
      const knob = knobRef.current;
      if (knob) {
        // Remove active state class
        knob.classList.remove("is-active");
      }

      // Release pointer capture
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    },
    [],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent) => {
      if (!onChange || disabled) return;

      const step = ((max - min) * SLIDER_DEFAULTS.KEYBOARD_STEP) / (max - min);

      switch (event.key) {
        case "ArrowRight":
        case "ArrowUp":
          event.preventDefault();
          onChange(Math.min(max, value + step * (max - min)));
          break;
        case "ArrowLeft":
        case "ArrowDown":
          event.preventDefault();
          onChange(Math.max(min, value - step * (max - min)));
          break;
        case "Home":
          event.preventDefault();
          onChange(min);
          break;
        case "End":
          event.preventDefault();
          onChange(max);
          break;
      }
    },
    [onChange, disabled, value, min, max],
  );

  const isInteractive = !disabled && onChange;

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      viewBox={`0 0 ${calculatedViewBoxWidth} ${height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="slider"
      aria-label={label}
      aria-valuenow={Math.round(normalizedValue * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={`${Math.round(normalizedValue * 100)}%`}
      aria-disabled={disabled}
      tabIndex={isInteractive ? 0 : -1}
      onKeyDown={handleKeyDown}
      className={cn("rounded outline-0 focus-visible:bg-orange-100", className)}
      style={{ touchAction: "none" }}
      {...props}
    >
      {/* Background track */}
      <line
        x1={trackStartX}
        y1={centerY}
        x2={trackEndX}
        y2={centerY}
        opacity={SLIDER_STYLES.backgroundTrack.opacity}
        stroke="currentColor"
        strokeWidth={SLIDER_STYLES.backgroundTrack.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Active progress line with SMIL animation */}
      <line
        x1={trackStartX}
        y1={centerY}
        x2={trackStartX}
        y2={centerY}
        stroke="currentColor"
        strokeWidth={SLIDER_STYLES.activeTrack.strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <animate
          ref={lineAnimateRef}
          attributeName="x2"
          from={previousValueX}
          to={valueX}
          dur={`${animationDuration}s`}
          fill="freeze"
          begin="indefinite"
          calcMode="spline"
          keySplines={SLIDER_DEFAULTS.ANIMATION_EASING}
          keyTimes="0; 1"
        />
      </line>

      {/* Draggable knob with SMIL animation */}
      {showKnob && (
        <circle
          ref={knobRef}
          cx={trackStartX}
          cy={centerY}
          r={SLIDER_DEFAULTS.KNOB_RADIUS}
          fill="currentColor"
          className={cn(
            SLIDER_STYLES.knob.cursor,
            "transition-transform duration-150 ease-out",
            "[&.is-active]:scale-150",
          )}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          style={{
            pointerEvents: isInteractive ? "auto" : "none",
            transformOrigin: "center",
            transformBox: "fill-box",
          }}
        >
          <animate
            ref={circleAnimateRef}
            attributeName="cx"
            from={previousValueX}
            to={valueX}
            dur={`${animationDuration}s`}
            fill="freeze"
            begin="indefinite"
            calcMode="spline"
            keyTimes="0; 1"
            keySplines={SLIDER_DEFAULTS.ANIMATION_EASING}
          />
        </circle>
      )}
    </svg>
  );
}
