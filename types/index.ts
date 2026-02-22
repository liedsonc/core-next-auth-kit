import type { ComponentType, ReactNode } from "react";

export type OAuthProvider = "google" | "apple";

export interface AuthUIComponents {
  Button: ComponentType<any>;
  Input: ComponentType<any>;
  Label: ComponentType<any>;
  Card: ComponentType<any>;
  CardHeader: ComponentType<any>;
  CardTitle: ComponentType<any>;
  CardDescription: ComponentType<any>;
  CardContent: ComponentType<any>;
  CardFooter: ComponentType<any>;
}

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
  components?: AuthUIComponents;
  layout?: "centered" | "split";
  brandName?: string;
  testimonial?: { quote: string; author: string };
  termsUrl?: string;
  privacyUrl?: string;
  leftColumnClassName?: string;
  formOrder?: "oauthFirst" | "emailFirst";
}
