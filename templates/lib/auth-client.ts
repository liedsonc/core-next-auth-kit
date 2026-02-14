import type { AuthClient } from "@liedsonc/core-auth-kit";

const notImplemented = () =>
  Promise.resolve({
    success: false as const,
    error: {
      code: "NOT_IMPLEMENTED",
      message: "Implement auth-client.ts with your backend (e.g. Supabase, custom API).",
    },
  });

export const authClient: AuthClient = {
  login: notImplemented,
  register: notImplemented,
  logout: () => Promise.resolve(),
  forgotPassword: notImplemented,
  resetPassword: notImplemented,
  verifyEmail: notImplemented,
  getSession: () => Promise.resolve(null),
};
