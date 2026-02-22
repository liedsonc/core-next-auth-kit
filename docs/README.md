# Documentation

In-depth guides for @liedsonc/core-auth-kit.

## Environment Variables

Create a `.env.local` file (or `.env`) with the following variables:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000

NEXT_PUBLIC_AUTH_REDIRECT_AFTER_LOGIN=/
NEXT_PUBLIC_AUTH_REDIRECT_AFTER_REGISTER=/login
NEXT_PUBLIC_AUTH_REDIRECT_AFTER_RESET=/login

NEXT_PUBLIC_OAUTH_GOOGLE_ENABLED=false
NEXT_PUBLIC_OAUTH_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_OAUTH_GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google
OAUTH_GOOGLE_CLIENT_SECRET=your_google_client_secret

NEXT_PUBLIC_OAUTH_APPLE_ENABLED=false
NEXT_PUBLIC_OAUTH_APPLE_CLIENT_ID=your_apple_client_id
NEXT_PUBLIC_OAUTH_APPLE_REDIRECT_URI=http://localhost:3000/api/auth/apple
OAUTH_APPLE_CLIENT_SECRET=your_apple_client_secret

RESEND_API_KEY=re_your_resend_api_key
RESEND_FROM_EMAIL=noreply@yourdomain.com
RESEND_FROM_NAME=Your App Name
NEXT_PUBLIC_APP_NAME=Your App Name
```

### Environment Variable Reference

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_APP_URL` | Your application base URL | No | `http://localhost:3000` |
| `NEXT_PUBLIC_AUTH_REDIRECT_AFTER_LOGIN` | Redirect URL after successful login | No | `/` |
| `NEXT_PUBLIC_AUTH_REDIRECT_AFTER_REGISTER` | Redirect URL after registration | No | `/login` |
| `NEXT_PUBLIC_AUTH_REDIRECT_AFTER_RESET` | Redirect URL after password reset | No | `/login` |
| `NEXT_PUBLIC_OAUTH_GOOGLE_ENABLED` | Enable/disable Google OAuth | No | `false` |
| `NEXT_PUBLIC_OAUTH_GOOGLE_CLIENT_ID` | Google OAuth Client ID | Yes (if Google enabled) | - |
| `NEXT_PUBLIC_OAUTH_GOOGLE_REDIRECT_URI` | Google OAuth redirect URI | Yes (if Google enabled) | - |
| `OAUTH_GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret (server-only) | Yes (if Google enabled) | - |
| `NEXT_PUBLIC_OAUTH_APPLE_ENABLED` | Enable/disable Apple OAuth | No | `false` |
| `NEXT_PUBLIC_OAUTH_APPLE_CLIENT_ID` | Apple OAuth Client ID | Yes (if Apple enabled) | - |
| `NEXT_PUBLIC_OAUTH_APPLE_REDIRECT_URI` | Apple OAuth redirect URI | Yes (if Apple enabled) | - |
| `OAUTH_APPLE_CLIENT_SECRET` | Apple OAuth Client Secret (server-only) | Yes (if Apple enabled) | - |
| `RESEND_API_KEY` | Resend API key for sending emails | Yes (if using email features) | - |
| `RESEND_FROM_EMAIL` | Email address to send from (must be verified in Resend) | Yes (if using email features) | - |
| `RESEND_FROM_NAME` | Display name for email sender | No | - |
| `NEXT_PUBLIC_APP_NAME` | Your application name (used in emails) | No | `App` |

Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Secrets should NOT use this prefix.

## Quick Start (detailed)

### 1. Implement AuthClient

Create an `AuthClient` that connects to your backend (or replace the stub in `lib/auth-client.ts` if you used init):

```typescript
import type { AuthClient } from "@liedsonc/core-auth-kit";

export const myAuthClient: AuthClient = {
  async login(email, password) {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      return {
        success: false,
        error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" },
      };
    }
    return { success: true };
  },
  async register(email, password) {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (!response.ok) {
      const data = await response.json();
      return {
        success: false,
        error: { code: data.code || "REGISTRATION_FAILED", message: data.message },
      };
    }
    return { success: true };
  },
  async logout() {
    await fetch("/api/auth/logout", { method: "POST" });
  },
  async forgotPassword(email) {
    const response = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return response.ok ? { success: true } : {
      success: false,
      error: { code: "FAILED", message: "Failed to send reset email" },
    };
  },
  async resetPassword(token, newPassword) {
    const response = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword }),
    });
    if (!response.ok) {
      return {
        success: false,
        error: { code: "INVALID_TOKEN", message: "Invalid or expired token" },
      };
    }
    return { success: true };
  },
  async verifyEmail(token) {
    const response = await fetch("/api/auth/verify-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
    if (!response.ok) {
      const data = await response.json();
      return {
        success: false,
        error: { code: data.code || "INVALID", message: data.message },
      };
    }
    return { success: true };
  },
  async getSession() {
    const response = await fetch("/api/auth/session");
    if (!response.ok) return null;
    return response.json();
  },
};
```

### 2. Setup Provider with Environment Variables

Create a utility to load OAuth config and wrap auth routes with `AuthUIProvider` (see init-scaffolded `lib/auth-config.ts` for the pattern). Pass `authClient`, `oauthProviders`, and redirect URLs in the config.

### 3. Create Auth Pages

Use the pre-built page components: `LoginPage`, `RegisterPage`, `ForgotPasswordPage`, `ResetPasswordPage`, `VerifyEmailPage`. Import and render in your route files.

## Email Integration with Resend

The init command creates `lib/email-templates.ts` with default copy and a send helper. Use `getVerificationEmailContent`, `getPasswordResetEmailContent`, and `sendEmail` from your register and forgot-password API routes. Edit that file to customize subject and HTML. See [Environment Variables](#environment-variables) for Resend-related env vars.

## API Reference

**Pages:** LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage, VerifyEmailPage.

**Components:** AuthCard, AuthForm, FormField, PasswordInput, OAuthButtons, ErrorMessage, SuccessMessage, LoadingSpinner.

**Hooks:** useAuth() (login, register, logout, forgotPassword, resetPassword, verifyEmail, session, loadSession, loading, error, clearError), useOAuth(onRedirect).

**Types:** AuthClient, AuthUIConfig, AuthResult, AuthError, OAuthProvider, AuthSession. See package types for full definitions.

## Customization

- **Logo:** Set `logo` in AuthUIConfig.
- **OAuth:** Configure via environment variables; use getOAuthProvidersFromEnv() or pass oauthProviders in config.
- **Layout:** Use `layout: "split"` for two-column layout; set `brandName`, `testimonial`, `leftColumnClassName`, `termsUrl`, `privacyUrl`, `formOrder: "emailFirst"`.
- **Redirects:** Set `redirectAfterLogin`, `redirectAfterRegister`, `redirectAfterReset` in config or env.
- **Custom pages:** Import individual components (AuthCard, AuthForm, FormField, etc.) and build your own layout.

## Production Setup

Copy `.env.example` to `.env.local` and set production values. Configure Google and Apple OAuth in their consoles (redirect URIs, Client ID/Secret). Never commit `.env.local`. Build with `npm run build` and run with `npm start`.

## Styling

Tailwind CSS and shadcn/ui conventions. Customize via CSS variables. See [shadcn/ui theming](https://ui.shadcn.com/docs/theming).

## Security Considerations

Error messages do not reveal whether an email exists. Implement CSRF, rate limiting, and secure token handling in your backend. Do not expose secrets via `NEXT_PUBLIC_` env vars.

## Browser Support

Chrome, Firefox, Safari, Edge (latest).

## Project Structure

Package contains `components/`, `hooks/`, `pages/`, `types/`, `styles/`, and `index.ts`. Init scaffolds `app/(auth)/`, `lib/`, and `app/api/auth/` in your app.
