"use client";

import { useEffect, useState } from "react";

export function useLiveUtcTime() {
  const [utcTime, setUtcTime] = useState(new Date().toISOString());

  useEffect(() => {
    const interval = setInterval(() => {
      setUtcTime(new Date().toISOString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return utcTime;
}
