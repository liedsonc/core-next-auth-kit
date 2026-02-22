"use client";

import Link from "next/link";
import { useState } from "react";
import {
  useAuth,
  AuthCard,
  AuthForm,
  FormField,
  SuccessMessage,
  useAuthUIComponents,
} from "@liedsonc/core-auth-kit";

const successMessage =
  "If an account exists for this email, you will receive a link to reset your password.";

export default function ForgotPassword() {
  const { Button, Input } = useAuthUIComponents();
  const { forgotPassword, loading, error, clearError } = useAuth();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [fieldError, setFieldError] = useState<string | undefined>();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    setFieldError(undefined);
    if (!email.trim()) {
      setFieldError("Email is required.");
      return;
    }
    await forgotPassword(email.trim());
    setSubmitted(true);
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <AuthCard
        title="Forgot password"
        subtitle="Enter your email and we'll send you a reset link"
        footer={
          <div className="flex w-full justify-center text-sm text-muted-foreground">
            <Link href="/login" className="underline underline-offset-4 hover:text-foreground">
              Back to sign in
            </Link>
          </div>
        }
      >
        {submitted ? (
          <SuccessMessage>{successMessage}</SuccessMessage>
        ) : (
          <AuthForm
            onSubmit={handleSubmit}
            loading={loading}
            error={error ? "Something went wrong. Please try again later." : undefined}
          >
            <FormField label="Email" htmlFor="forgot-email" error={fieldError} required>
              <Input
                id="forgot-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                disabled={loading}
                aria-invalid={!!fieldError}
              />
            </FormField>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <span className="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                "Send reset link"
              )}
            </Button>
          </AuthForm>
        )}
      </AuthCard>
    </div>
  );
}
