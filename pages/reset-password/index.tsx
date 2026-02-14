"use client";

import Link from "next/link";
import { useAuth } from "../../hooks/use-auth";
import { useSearchParams } from "next/navigation";
import { AuthCard } from "../../components/auth-card";
import { AuthForm } from "../../components/auth-form";
import { FormField } from "../../components/form-field";
import { PasswordInput } from "../../components/password-input";
import { Button } from "../../components/ui/button";
import { useState, Suspense } from "react";

const genericError = "Something went wrong. Please request a new reset link.";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const { resetPassword, loading, error, clearError } = useAuth();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ password?: string; confirm?: string }>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    setFieldErrors({});
    const err: { password?: string; confirm?: string } = {};
    if (!token) err.password = "Invalid or missing reset link.";
    if (!password) err.password = "Password is required.";
    if (password.length < 8) err.password = "Password must be at least 8 characters.";
    if (password !== confirmPassword) err.confirm = "Passwords do not match.";
    if (Object.keys(err).length) {
      setFieldErrors(err);
      return;
    }
    const result = await resetPassword(token, password);
    if (!result.success) setFieldErrors({ password: genericError });
  };

  if (!token) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-4">
        <AuthCard
          title="Reset password"
          subtitle="Invalid or expired link"
          footer={
            <Link
              href="/forgot-password"
              className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              Request a new reset link
            </Link>
          }
        >
          <p className="text-sm text-muted-foreground">
            This reset link is invalid or has expired. Please request a new one.
          </p>
        </AuthCard>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <AuthCard
        title="Reset password"
        subtitle="Enter your new password"
        footer={
          <div className="flex w-full justify-center text-sm text-muted-foreground">
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Back to sign in
            </Link>
          </div>
        }
      >
        <AuthForm onSubmit={handleSubmit} loading={loading} error={error ? genericError : undefined}>
          <FormField label="New password" htmlFor="reset-password" error={fieldErrors.password} required>
            <PasswordInput
              id="reset-password"
              placeholder="••••••••"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              showStrength
              aria-invalid={!!fieldErrors.password}
            />
          </FormField>
          <FormField
            label="Confirm password"
            htmlFor="reset-confirm"
            error={fieldErrors.confirm}
            required
          >
            <PasswordInput
              id="reset-confirm"
              placeholder="••••••••"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
              aria-invalid={!!fieldErrors.confirm}
            />
          </FormField>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <span className="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              "Reset password"
            )}
          </Button>
        </AuthForm>
      </AuthCard>
    </div>
  );
}

export function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <span className="inline-block size-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}
