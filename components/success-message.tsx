"use client";

import { cn } from "../utils";

export function SuccessMessage({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  if (!children) return null;
  return (
    <p
      id={id}
      role="status"
      className={cn("text-sm text-green-600 dark:text-green-400", className)}
    >
      {children}
    </p>
  );
}
