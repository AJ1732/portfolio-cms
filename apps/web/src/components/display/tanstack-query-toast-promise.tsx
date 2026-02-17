"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button, Checkbox } from "@/components/ui";
import { cn } from "@/lib/utils";

const MOCK_DELAY_MS = 2200;

/** Fades in when content changes (opacity only, no width). Use with key so it remounts. */
function FadeInLabel({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center gap-2 transition-opacity duration-150 ease-out",
        "motion-reduce:transition-none",
        visible ? "opacity-100" : "opacity-0",
      )}
    >
      {children}
    </span>
  );
}

export function TanstackQueryToastPromise() {
  const [isPending, setIsPending] = useState(false);
  const [useToastPromise, setUseToastPromise] = useState(true);

  async function handleSubmit(simulateError: boolean) {
    setIsPending(true);

    const shouldFail = simulateError || Math.random() < 0.5;
    const randomErrorMessages = [
      "Email already in use.",
      "Network request failed.",
      "Something went wrong. Please try again.",
    ];
    const errorMessage = simulateError
      ? "Email already in use."
      : (randomErrorMessages[
          Math.floor(Math.random() * randomErrorMessages.length)
        ] ?? "Please try again.");

    const promise = new Promise<void>((resolve, reject) => {
      setTimeout(() => {
        if (shouldFail) {
          reject(new Error(errorMessage));
        } else {
          resolve();
        }
      }, MOCK_DELAY_MS);
    });

    if (useToastPromise) {
      toast.promise(promise, {
        loading: "Creating your account...",
        success: () => ({
          message: "Registration successful!",
          description: "Redirecting to store...",
        }),
        error: (error: Error) => ({
          message: "Registration failed",
          description: error?.message ?? "Please try again.",
        }),
      });
    }

    try {
      await promise;
      if (!useToastPromise) {
        toast.success("Registration successful!", {
          description: "Redirecting to store...",
        });
      }
    } catch (error) {
      if (!useToastPromise) {
        toast.error("Registration failed", {
          description:
            error instanceof Error ? error.message : "Please try again.",
        });
      }
    } finally {
      setIsPending(false);
    }
  }

  return (
    <section id="tanstack-query-toast-promise" className="full-width space-y-3">
      <div
        aria-label="Component display"
        className={cn(
          "flex min-h-80 flex-col items-center justify-center gap-6 bg-neutral-50 px-6 py-10 ring",
        )}
      >
        <Button
          disabled={isPending}
          aria-busy={isPending}
          onClick={() => void handleSubmit(false)}
          className="min-w-48"
        >
          <FadeInLabel key={isPending ? "loading" : "idle"}>
            {isPending ? (
              <>
                <span
                  className="size-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                  aria-hidden
                />
                Creating account...
              </>
            ) : (
              "Sign Up"
            )}
          </FadeInLabel>
        </Button>

        <Checkbox
          checked={useToastPromise}
          onCheckedChange={(value) => setUseToastPromise(value === true)}
          aria-label="Use toast.promise (loading then success/error)"
          className="mx-auto w-fit"
        >
          Use <code>toast.promise()</code> (loading → success/error)
        </Checkbox>
      </div>
      <p
        className={cn(
          "px-5 text-center text-sm text-neutral-500",
          "[&>code]:bg-neutral-100 [&>code]:text-neutral-700",
        )}
      >
        Toggle the checkbox to compare <code>toast.promise()</code> vs{" "}
        <code>toast.success()</code> / <code>toast.error()</code> after the
        request.
      </p>
    </section>
  );
}
