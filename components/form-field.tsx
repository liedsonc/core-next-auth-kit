"use client";

import { useAuthUIComponents } from "../hooks/use-auth-ui-components";
import { cn } from "../utils";

export function FormField({
  label,
  htmlFor,
  error,
  children,
  required,
  className,
}: {
  label: string;
  htmlFor: string;
  error?: string;
  children: React.ReactNode;
  required?: boolean;
  className?: string;
}) {
  const { Label } = useAuthUIComponents();
  return (
    <div className={cn("auth-ui-form-field", className)}>
      <Label htmlFor={htmlFor}>
        {label}
        {required && (
          <span className="text-destructive ml-0.5" aria-hidden="true">
            *
          </span>
        )}
      </Label>
      {children}
      {error && (
        <p id={`${htmlFor}-error`} role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
