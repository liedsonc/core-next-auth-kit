"use client";

import { AuthUIProvider } from "@liedsonc/core-auth-kit";
import { getAuthUIConfig } from "@/lib/auth-config";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const config = getAuthUIConfig();
  return (
    <AuthUIProvider config={config}>
      {children}
    </AuthUIProvider>
  );
}

