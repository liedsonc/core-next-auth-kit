"use client";

import { Eye, EyeOff } from "lucide-react";
import * as React from "react";
import { useAuthUIComponents } from "../hooks/use-auth-ui-components";
import { cn } from "../utils";

function getStrength(value: string): 0 | 1 | 2 | 3 {
  if (!value) return 0;
  let s = 0;
  if (value.length >= 8) s++;
  if (value.length >= 12) s++;
  if (/[A-Z]/.test(value) && /[a-z]/.test(value) && /\d/.test(value)) s++;
  return Math.min(s, 3) as 0 | 1 | 2 | 3;
}

export interface PasswordInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  showStrength?: boolean;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showStrength = false, ...props }, ref) => {
    const [show, setShow] = React.useState(false);
    const [value, setValue] = React.useState("");
    const id = React.useId();
    const strength = showStrength ? getStrength(value) : 0;
    const { Input, Button } = useAuthUIComponents();

    return (
      <div className="auth-ui-password-stack">
        <div className="auth-ui-password-wrap">
          <Input
            ref={ref}
            type={show ? "text" : "password"}
            autoComplete="current-password"
            aria-describedby={showStrength ? `${id}-strength` : undefined}
            className={cn("auth-ui-password-input", className)}
            {...props}
            value={props.value ?? value}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setValue(e.target.value);
              props.onChange?.(e);
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="auth-ui-password-toggle"
            aria-label={show ? "Hide password" : "Show password"}
            aria-pressed={show}
            onClick={() => setShow((p) => !p)}
            tabIndex={-1}
          >
            {show ? (
              <EyeOff className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Eye className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
        </div>
        {showStrength && value && (
          <div
            id={`${id}-strength`}
            role="progressbar"
            aria-valuenow={strength}
            aria-valuemin={0}
            aria-valuemax={3}
            aria-label="Password strength"
            className="flex gap-1"
          >
            {[1, 2, 3].map((i) => (
              <span
                key={i}
                className={cn(
                  "h-1 flex-1 rounded-full",
                  i <= strength
                    ? strength === 1
                      ? "bg-destructive"
                      : strength === 2
                        ? "bg-amber-500"
                        : "bg-green-500"
                    : "bg-muted"
                )}
              />
            ))}
          </div>
        )}
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
