"use client";

import Link from "next/link";
import { useAuth } from "../../hooks/use-auth";
import { useOAuth } from "../../hooks/use-oauth";
import { useAuthUIConfig } from "../../context";
import { AuthCard } from "../../components/auth-card";
import { AuthForm } from "../../components/auth-form";
import { FormField } from "../../components/form-field";
import { OAuthButtons } from "../../components/oauth-buttons";
import { PasswordInput } from "../../components/password-input";
import { SuccessMessage } from "../../components/success-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCallback, useState } from "react";

const genericError = "Something went wrong. Please try again.";
const duplicateError = "An account with this email already exists.";

export function RegisterPage() {
  const config = useAuthUIConfig();
  const { register, loading, error, clearError } = useAuth();
  const oauthProviders = config.oauthProviders ?? [];
  const { signIn, loadingProvider } = useOAuth(
    useCallback((provider) => {
      const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
      return Promise.resolve(`${baseUrl}/api/auth/${provider}`);
    }, [])
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
    confirm?: string;
  }>({});
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    setFieldErrors({});
    setShowVerificationMessage(false);
    const err: { email?: string; password?: string; confirm?: string } = {};
    if (!email.trim()) err.email = "Email is required.";
    if (!password) err.password = "Password is required.";
    if (password.length < 8) err.password = "Password must be at least 8 characters.";
    if (password !== confirmPassword) err.confirm = "Passwords do not match.";
    if (Object.keys(err).length) {
      setFieldErrors(err);
      return;
    }
    const result = await register(email.trim(), password);
    if (result.success) {
      setShowVerificationMessage(true);
    } else {
      const isDuplicate = result.error.code === "DUPLICATE_EMAIL" || result.error.code === "EMAIL_TAKEN";
      setFieldErrors({ email: isDuplicate ? duplicateError : genericError });
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <AuthCard
        title="Create an account"
        subtitle="Enter your details to get started"
        footer={
          <div className="flex w-full justify-center text-sm text-muted-foreground">
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Already have an account? Sign in
            </Link>
          </div>
        }
      >
        {showVerificationMessage ? (
          <SuccessMessage>
            Check your email to verify your account. You can sign in after verification.
          </SuccessMessage>
        ) : (
          <AuthForm onSubmit={handleSubmit} loading={loading} error={error ? genericError : undefined}>
            <OAuthButtons
              providers={oauthProviders}
              loadingProvider={loadingProvider}
              onSignIn={signIn}
            />
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
              </div>
            </div>
            <FormField label="Email" htmlFor="register-email" error={fieldErrors.email} required>
              <Input
                id="register-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                aria-invalid={!!fieldErrors.email}
              />
            </FormField>
            <FormField label="Password" htmlFor="register-password" error={fieldErrors.password} required>
              <PasswordInput
                id="register-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                showStrength
                aria-invalid={!!fieldErrors.password}
              />
            </FormField>
            <FormField
              label="Confirm password"
              htmlFor="register-confirm"
              error={fieldErrors.confirm}
              required
            >
              <PasswordInput
                id="register-confirm"
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
                "Create account"
              )}
            </Button>
          </AuthForm>
        )}
      </AuthCard>
    </div>
  );
}
