"use client";

import { useEffect, useState } from "react";

export function CurrentTimeUTC() {
  const [mounted, setMounted] = useState(false);
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    setMounted(true);
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!mounted || now === null) {
    return (
      <time
        data-testid="currentTimeUTC"
        aria-label="Current time in UTC"
        dateTime=""
        className="text-base-expand mt-auto flex items-center gap-3 text-neutral-800"
      >
        <div
          aria-hidden
          className="size-2 animate-pulse rounded-full bg-orange-500 duration-75"
        />
        <span aria-hidden>--:--:-- GMT</span>
      </time>
    );
  }

  return (
    <time
      data-testid="currentTimeUTC"
      aria-label="Current time in UTC"
      dateTime={now.toISOString()}
      className="text-base-expand mt-auto flex items-center gap-3 text-neutral-800"
    >
      <div
        aria-hidden
        className="size-2 animate-pulse rounded-full bg-orange-500 duration-75"
      />
      {now.toUTCString()}
    </time>
  );
}
