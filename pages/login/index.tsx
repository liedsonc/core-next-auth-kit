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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCallback, useState } from "react";

const genericError = "Invalid email or password. Please try again.";

export function LoginPage() {
  const config = useAuthUIConfig();
  const { login, loading, error, clearError } = useAuth();
  const oauthProviders = config.oauthProviders ?? [];
  const { signIn, loadingProvider } = useOAuth(
    useCallback(
      (provider) => {
        const baseUrl = typeof window !== "undefined" ? window.location.origin : "";
        return Promise.resolve(`${baseUrl}/api/auth/${provider}`);
      },
      []
    )
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    clearError();
    setFieldErrors({});
    const err: { email?: string; password?: string } = {};
    if (!email.trim()) err.email = "Email is required.";
    if (!password) err.password = "Password is required.";
    if (Object.keys(err).length) {
      setFieldErrors(err);
      return;
    }
    const result = await login(email.trim(), password);
    if (!result.success) setFieldErrors({ password: genericError });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4">
      <AuthCard
        title="Sign in"
        subtitle="Enter your credentials to continue"
        footer={
          <div className="flex w-full flex-col items-center gap-2 text-center text-sm text-muted-foreground">
            <Link
              href="/register"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Create an account
            </Link>
            <Link
              href="/forgot-password"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Forgot password?
            </Link>
          </div>
        }
      >
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
          <FormField label="Email" htmlFor="login-email" error={fieldErrors.email} required>
            <Input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              aria-invalid={!!fieldErrors.email}
            />
          </FormField>
          <FormField label="Password" htmlFor="login-password" error={fieldErrors.password} required>
            <PasswordInput
              id="login-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              aria-invalid={!!fieldErrors.password}
            />
          </FormField>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <span className="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
            ) : (
              "Sign in"
            )}
          </Button>
        </AuthForm>
      </AuthCard>
    </div>
  );
}
