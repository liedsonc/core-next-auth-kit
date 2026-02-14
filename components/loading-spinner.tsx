"use client";

import { cn } from "../utils";

export function LoadingSpinner({
  className,
  "aria-label": ariaLabel = "Loading",
}: {
  className?: string;
  "aria-label"?: string;
}) {
  return (
    <span
      role="status"
      aria-label={ariaLabel}
      className={cn("inline-block size-5 animate-spin rounded-full border-2 border-current border-t-transparent", className)}
    />
  );
}
