"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface AuthFormProps
  extends Omit<React.FormHTMLAttributes<HTMLFormElement>, "onSubmit"> {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void | Promise<void>;
  loading?: boolean;
  error?: string;
  children: React.ReactNode;
  className?: string;
}

export function AuthForm({
  onSubmit,
  loading = false,
  error,
  children,
  className,
  ...props
}: AuthFormProps) {
  const [submitting, setSubmitting] = React.useState(false);
  const isDisabled = loading || submitting;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isDisabled) return;
    setSubmitting(true);
    try {
      await onSubmit(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={cn("space-y-4", className)}
      aria-busy={isDisabled}
      {...props}
    >
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      {children}
    </form>
  );
}
