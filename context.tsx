"use client";

import * as React from "react";
import type { AuthUIConfig } from "./types";

const AuthUIConfigContext = React.createContext<AuthUIConfig | null>(null);

export function AuthUIProvider({
  config,
  children,
}: {
  config: AuthUIConfig;
  children: React.ReactNode;
}) {
  return (
    <AuthUIConfigContext.Provider value={config}>
      {children}
    </AuthUIConfigContext.Provider>
  );
}

export function useAuthUIConfig(): AuthUIConfig {
  const ctx = React.useContext(AuthUIConfigContext);
  if (!ctx) throw new Error("useAuthUIConfig must be used within AuthUIProvider");
  return ctx;
}
