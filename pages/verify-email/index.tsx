"use client";

import Link from "next/link";
import { useAuth } from "../../hooks/use-auth";
import { useSearchParams } from "next/navigation";
import { AuthCard } from "../../components/auth-card";
import { AuthPageLayout } from "../../components/auth-page-layout";
import { SuccessMessage } from "../../components/success-message";
import { ErrorMessage } from "../../components/error-message";
import { useAuthUIComponents } from "../../hooks/use-auth-ui-components";
import { useEffect, useState, Suspense } from "react";

type VerifyState = "idle" | "loading" | "success" | "expired" | "invalid";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const { Button } = useAuthUIComponents();
  const { verifyEmail, loading } = useAuth();
  const [state, setState] = useState<VerifyState>("idle");
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!token || checked) return;
    setChecked(true);
    setState("loading");
    verifyEmail(token).then((result) => {
      if (result.success) setState("success");
      else if (result.error.code === "EXPIRED" || result.error.code === "TOKEN_EXPIRED")
        setState("expired");
      else setState("invalid");
    });
  }, [token, checked, verifyEmail]);

  if (!token) {
    return (
      <AuthPageLayout>
        <AuthCard
          title="Verify email"
          subtitle="Invalid verification link"
          footer={
            <Link
              href="/login"
              className="text-base text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              Go to sign in
            </Link>
          }
        >
          <ErrorMessage>This verification link is invalid.</ErrorMessage>
        </AuthCard>
      </AuthPageLayout>
    );
  }

  if (state === "loading" || (state === "idle" && loading)) {
    return (
      <AuthPageLayout>
        <AuthCard title="Verify email" subtitle="Verifying your email...">
          <div className="flex justify-center py-4">
            <span
              role="status"
              aria-label="Verifying"
              className="inline-block size-8 animate-spin rounded-full border-2 border-current border-t-transparent"
            />
          </div>
        </AuthCard>
      </AuthPageLayout>
    );
  }

  if (state === "success") {
    return (
      <AuthPageLayout>
        <AuthCard
          title="Email verified"
          subtitle="Your account is ready"
          footer={
            <Button asChild className="w-full">
              <Link href="/login">Sign in</Link>
            </Button>
          }
        >
          <SuccessMessage>Your email has been verified. You can now sign in.</SuccessMessage>
        </AuthCard>
      </AuthPageLayout>
    );
  }

  if (state === "expired") {
    return (
      <AuthPageLayout>
        <AuthCard
          title="Link expired"
          subtitle="This verification link has expired"
          footer={
            <Link
              href="/login"
              className="text-base text-muted-foreground underline underline-offset-4 hover:text-foreground"
            >
              Go to sign in
            </Link>
          }
        >
          <ErrorMessage>
            This verification link has expired. Please sign in to request a new one.
          </ErrorMessage>
        </AuthCard>
      </AuthPageLayout>
    );
  }

  return (
    <AuthPageLayout>
      <AuthCard
        title="Verification failed"
        subtitle="We couldn't verify your email"
        footer={
          <Link
            href="/login"
            className="text-base text-muted-foreground underline underline-offset-4 hover:text-foreground"
          >
            Go to sign in
          </Link>
        }
      >
        <ErrorMessage>This verification link is invalid or has already been used.</ErrorMessage>
      </AuthCard>
    </AuthPageLayout>
  );
}

export function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <span className="inline-block size-8 animate-spin rounded-full border-2 border-current border-t-transparent" />
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
