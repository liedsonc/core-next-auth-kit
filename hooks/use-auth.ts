"use client";

import { useCallback, useState } from "react";
import { useAuthUIConfig } from "../context";
import type { AuthError, AuthSession } from "../types";

type AuthResult = { success: true } | { success: false; error: AuthError };

export function useAuth() {
  const { authClient, redirectAfterLogin, redirectAfterRegister, redirectAfterReset } =
    useAuthUIConfig();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<AuthError | null>(null);
  const [session, setSession] = useState<AuthSession | null>(null);

  const login = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      setLoading(true);
      setError(null);
      try {
        const result = await authClient.login(email, password);
        if (result.success) {
          if (redirectAfterLogin && typeof window !== "undefined") {
            window.location.href = redirectAfterLogin;
          }
          return result;
        }
        setError(result.error);
        return result;
      } finally {
        setLoading(false);
      }
    },
    [authClient, redirectAfterLogin]
  );

  const register = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      setLoading(true);
      setError(null);
      try {
        const result = await authClient.register(email, password);
        if (result.success && redirectAfterRegister && typeof window !== "undefined") {
          window.location.href = redirectAfterRegister;
        }
        if (!result.success) setError(result.error);
        return result;
      } finally {
        setLoading(false);
      }
    },
    [authClient, redirectAfterRegister]
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await authClient.logout();
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, [authClient]);

  const forgotPassword = useCallback(
    async (email: string): Promise<AuthResult> => {
      setLoading(true);
      setError(null);
      try {
        const result = await authClient.forgotPassword(email);
        if (!result.success) setError(result.error);
        return result;
      } finally {
        setLoading(false);
      }
    },
    [authClient]
  );

  const resetPassword = useCallback(
    async (token: string, newPassword: string): Promise<AuthResult> => {
      setLoading(true);
      setError(null);
      try {
        const result = await authClient.resetPassword(token, newPassword);
        if (result.success && redirectAfterReset && typeof window !== "undefined") {
          window.location.href = redirectAfterReset;
        }
        if (!result.success) setError(result.error);
        return result;
      } finally {
        setLoading(false);
      }
    },
    [authClient, redirectAfterReset]
  );

  const verifyEmail = useCallback(
    async (token: string): Promise<AuthResult> => {
      setLoading(true);
      setError(null);
      try {
        return await authClient.verifyEmail(token);
      } finally {
        setLoading(false);
      }
    },
    [authClient]
  );

  const loadSession = useCallback(async () => {
    if (!authClient.getSession) return null;
    const s = await authClient.getSession();
    setSession(s);
    return s;
  }, [authClient]);

  return {
    login,
    register,
    logout,
    forgotPassword,
    resetPassword,
    verifyEmail,
    session,
    loadSession,
    loading,
    error,
    clearError: () => setError(null),
  };
}
