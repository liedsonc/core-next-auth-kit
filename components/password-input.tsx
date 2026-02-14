"use client";

import * as React from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
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
  extends Omit<React.ComponentProps<typeof Input>, "type"> {
  showStrength?: boolean;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, showStrength = false, ...props }, ref) => {
    const [show, setShow] = React.useState(false);
    const [value, setValue] = React.useState("");
    const id = React.useId();
    const strength = showStrength ? getStrength(value) : 0;

    return (
      <div className="space-y-1.5">
        <div className="relative">
          <Input
            ref={ref}
            type={show ? "text" : "password"}
            autoComplete="current-password"
            aria-describedby={showStrength ? `${id}-strength` : undefined}
            className={cn("pr-10", className)}
            {...props}
            value={props.value ?? value}
            onChange={(e) => {
              setValue(e.target.value);
              props.onChange?.(e);
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
            aria-label={show ? "Hide password" : "Show password"}
            aria-pressed={show}
            onClick={() => setShow((p) => !p)}
            tabIndex={-1}
          >
            <span className="text-xs font-medium" aria-hidden="true">
              {show ? "Hide" : "Show"}
            </span>
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
