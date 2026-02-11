"use client";

import { useCallback, useState } from "react";
import type { OAuthProvider } from "../types";

export function useOAuth(onRedirect: (provider: OAuthProvider) => string | Promise<string>) {
  const [loadingProvider, setLoadingProvider] = useState<OAuthProvider | null>(null);

  const signIn = useCallback(
    async (provider: OAuthProvider) => {
      setLoadingProvider(provider);
      try {
        const url = await onRedirect(provider);
        if (typeof window !== "undefined" && url) {
          window.location.href = url;
        }
      } finally {
        setLoadingProvider(null);
      }
    },
    [onRedirect]
  );

  return { signIn, loadingProvider };
}
