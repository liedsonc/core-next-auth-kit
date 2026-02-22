"use client";

import Link from "next/link";
import { useAuthUIConfig } from "../context";

export function TermsDisclaimer() {
  const config = useAuthUIConfig();
  const { termsUrl, privacyUrl } = config;
  if (!termsUrl && !privacyUrl) return null;
  return (
    <p className="text-sm text-muted-foreground">
      By clicking continue, you agree to our{" "}
      {termsUrl ? (
        <Link href={termsUrl} className="underline underline-offset-4 hover:text-foreground">
          Terms of Service
        </Link>
      ) : (
        "Terms of Service"
      )}{" "}
      and{" "}
      {privacyUrl ? (
        <Link href={privacyUrl} className="underline underline-offset-4 hover:text-foreground">
          Privacy Policy
        </Link>
      ) : (
        "Privacy Policy"
      )}
      .
    </p>
  );
}
