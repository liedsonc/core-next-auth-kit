import type { AuthUIConfig, OAuthProvider } from "@liedsonc/core-auth-kit";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export interface OAuthProviderConfig {
  provider: OAuthProvider;
  enabled: boolean;
  clientId?: string;
  redirectUri?: string;
}

export function getOAuthProvidersFromEnv(): OAuthProviderConfig[] {
  const providers: OAuthProviderConfig[] = [];

  if (process.env.NEXT_PUBLIC_OAUTH_GOOGLE_ENABLED === "true") {
    providers.push({
      provider: "google",
      enabled: true,
      clientId: process.env.NEXT_PUBLIC_OAUTH_GOOGLE_CLIENT_ID,
      redirectUri: process.env.NEXT_PUBLIC_OAUTH_GOOGLE_REDIRECT_URI,
    });
  }

  if (process.env.NEXT_PUBLIC_OAUTH_APPLE_ENABLED === "true") {
    providers.push({
      provider: "apple",
      enabled: true,
      clientId: process.env.NEXT_PUBLIC_OAUTH_APPLE_CLIENT_ID,
      redirectUri: process.env.NEXT_PUBLIC_OAUTH_APPLE_REDIRECT_URI,
    });
  }

  return providers;
}

export function getAuthUIConfig(): AuthUIConfig {
  const base = {
    authClient,
    oauthProviders: getOAuthProvidersFromEnv(),
    redirectAfterLogin: process.env.NEXT_PUBLIC_AUTH_REDIRECT_AFTER_LOGIN || "/",
    redirectAfterRegister: process.env.NEXT_PUBLIC_AUTH_REDIRECT_AFTER_REGISTER || "/login",
    redirectAfterReset: process.env.NEXT_PUBLIC_AUTH_REDIRECT_AFTER_RESET || "/login",
  };
  return {
    ...base,
    components: {
      Button,
      Input,
      Label,
      Card,
      CardHeader,
      CardTitle,
      CardDescription,
      CardContent,
      CardFooter,
    },
  };
}
