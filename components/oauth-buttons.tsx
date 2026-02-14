"use client";

import { Button } from "./ui/button";
import { useOAuth } from "../hooks/use-oauth";
import { cn } from "../utils";
import type { OAuthProvider } from "../types";

const providerLabels: Record<OAuthProvider, string> = {
  google: "Continue with Google",
  apple: "Continue with Apple",
};

export function OAuthButtons({
  providers,
  loadingProvider,
  onSignIn,
  className,
}: {
  providers: { provider: OAuthProvider; enabled: boolean }[];
  loadingProvider: OAuthProvider | null;
  onSignIn: (provider: OAuthProvider) => void | Promise<void>;
  className?: string;
}) {
  const enabled = providers.filter((p) => p.enabled);

  if (enabled.length === 0) return null;

  return (
    <div className={cn("space-y-2", className)}>
      {enabled.map(({ provider }) => (
        <Button
          key={provider}
          type="button"
          variant="outline"
          className="w-full"
          disabled={!!loadingProvider}
          onClick={() => onSignIn(provider)}
          aria-busy={loadingProvider === provider}
        >
          {loadingProvider === provider ? (
            <span className="inline-block size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          ) : (
            providerLabels[provider]
          )}
        </Button>
      ))}
    </div>
  );
}
