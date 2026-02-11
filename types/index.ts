import type { ReactNode } from "react";

export type OAuthProvider = "google" | "apple";

export interface AuthError {
  code: string;
  message: string;
}

export interface AuthSession {
  user: { id: string; email?: string };
  expiresAt?: number;
}

export interface AuthClient {
  login: (email: string, password: string) => Promise<{ success: true } | { success: false; error: AuthError }>;
  register: (email: string, password: string) => Promise<{ success: true } | { success: false; error: AuthError }>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: true } | { success: false; error: AuthError }>;
  resetPassword: (token: string, newPassword: string) => Promise<{ success: true } | { success: false; error: AuthError }>;
  verifyEmail: (token: string) => Promise<{ success: true } | { success: false; error: AuthError }>;
  getSession?: () => Promise<AuthSession | null>;
}

export type AuthFormState = "idle" | "loading" | "success" | "error";

export interface AuthUIConfig {
  authClient: AuthClient;
  oauthProviders?: { provider: OAuthProvider; enabled: boolean }[];
  logo?: ReactNode;
  redirectAfterLogin?: string;
  redirectAfterRegister?: string;
  redirectAfterReset?: string;
}
