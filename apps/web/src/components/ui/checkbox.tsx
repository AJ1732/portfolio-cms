"use client";

import {
  type ComponentPropsWithoutRef,
  forwardRef,
  useEffect,
  useId,
  useRef,
} from "react";

import { cn } from "@/lib/utils";

export type CheckedState = boolean | "indeterminate";

interface CheckboxProps extends Omit<
  ComponentPropsWithoutRef<"input">,
  "checked" | "defaultChecked" | "onChange" | "type"
> {
  checked?: CheckedState;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: CheckedState) => void;
  /** Optional visible label; use aria-label if no children */
  "aria-label"?: string;
  "aria-labelledby"?: string;
}

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden
  >
    <path d="M2 6l3 3 5-6" />
  </svg>
);

const IndeterminateIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 12 12"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    className={className}
    aria-hidden
  >
    <path d="M2 6h8" />
  </svg>
);

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  {
    checked,
    defaultChecked,
    onCheckedChange,
    disabled,
    name,
    value,
    id: idProperty,
    className,
    children,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledby,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const id = idProperty ?? generatedId;
  const inputRef = useRef<HTMLInputElement | null>(null);
  const isControlled = checked !== undefined;

  const setInputRef = (node: HTMLInputElement | null) => {
    inputRef.current = node;
    if (typeof ref === "function") ref(node);
    else if (ref) ref.current = node;
  };

  useEffect(() => {
    const input = inputRef.current;
    if (!input || !isControlled) return;
    input.indeterminate = checked === "indeterminate";
    if (checked !== "indeterminate") input.checked = checked === true;
  }, [isControlled, checked]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (onCheckedChange) {
      const next = event.target.indeterminate
        ? "indeterminate"
        : event.target.checked;
      onCheckedChange(next);
    }
  };

  const isChecked = isControlled ? checked === true : undefined;
  const isIndeterminate = isControlled && checked === "indeterminate";

  return (
    <label
      htmlFor={id}
      className={cn(
        "flex cursor-pointer touch-manipulation items-start gap-3",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      <span
        className={cn(
          "relative flex size-5 shrink-0 items-center justify-center rounded-md border border-neutral-300 bg-white",
          "transition-[background-color_150ms_ease,border-color_150ms_ease,box-shadow_150ms_ease-out]",
          "focus-within:ring-2 focus-within:ring-orange-500/50 focus-within:ring-offset-2 focus-within:outline-none",
          "peer-checked:border-orange-500 peer-checked:bg-orange-500 peer-checked:text-white",
          "motion-reduce:transition-none",
          (isChecked || isIndeterminate) &&
            "border-orange-500 bg-orange-500 text-white",
        )}
      >
        <input
          ref={setInputRef}
          type="checkbox"
          id={id}
          name={name}
          value={value}
          checked={isControlled ? isChecked : undefined}
          defaultChecked={defaultChecked}
          disabled={disabled}
          onChange={handleChange}
          aria-label={ariaLabel}
          aria-labelledby={ariaLabelledby}
          aria-checked={
            isIndeterminate ? "mixed" : isControlled ? isChecked : undefined
          }
          className="peer absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
          {...rest}
        />
        <span
          className={cn(
            "pointer-events-none flex items-center justify-center text-white",
            "transition-[opacity_150ms_ease-out,transform_150ms_ease-out]",
            "motion-reduce:transition-none",
            "scale-95 opacity-0 peer-checked:scale-100 peer-checked:opacity-100",
            (isChecked || isIndeterminate) && "scale-100 opacity-100",
          )}
          data-state={
            isIndeterminate
              ? "indeterminate"
              : isChecked
                ? "checked"
                : "unchecked"
          }
        >
          {isIndeterminate ? (
            <IndeterminateIcon className="size-3" />
          ) : (
            <CheckIcon className="size-3" />
          )}
        </span>
      </span>
      {children != null && (
        <span className="min-w-0 flex-1 text-left text-sm font-medium text-neutral-900">
          {children}
        </span>
      )}
    </label>
  );
});

export default Checkbox;
