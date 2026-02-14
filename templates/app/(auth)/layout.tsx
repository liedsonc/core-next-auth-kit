"use client";

import { AuthUIProvider } from "@liedsonc/core-auth-kit";
import { getAuthUIConfig } from "@/lib/auth-config";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthUIProvider config={getAuthUIConfig()}>
      {children}
    </AuthUIProvider>
  );
}
