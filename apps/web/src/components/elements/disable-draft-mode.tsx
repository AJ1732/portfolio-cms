"use client";

import { useDraftModeEnvironment } from "next-sanity/hooks";

export function DisableDraftMode() {
  const environment = useDraftModeEnvironment();

  // Only show outside of Presentation Tool (i.e., when browsing directly)
  if (environment !== "live" && environment !== "unknown") return null;

  return (
    <a
      href="/api/draft-mode/disable"
      className="fixed right-4 bottom-4 z-50 rounded-full bg-neutral-900 px-4 py-2 text-sm text-white shadow-lg transition-colors hover:bg-neutral-700"
    >
      Disable Draft Mode
    </a>
  );
}
