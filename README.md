# @liedsonc/core-auth-kit

Authentication UI for Next.js: login, register, forgot password, reset password, and email verification. Built with shadcn-style components and Tailwind. One command to scaffold pages and wire OAuth and email (Resend). Customize via config and your own backend.

**For detailed documentation** (environment variables, API reference, AuthClient and email examples, customization, production) see [docs/README.md](docs/README.md).

## Features

- Complete auth flows: Login, Register, Forgot Password, Reset Password, Email Verification
- shadcn-style UI, themeable and accessible
- Backend agnostic: implement `AuthClient` for your API or provider
- OAuth (Google, Apple) via environment variables
- Optional email templates (Resend) for verification and password reset
- Customizable: logo, layout, redirects, form order, or use components individually

## Installation

From your Next.js app root:

```bash
npx @liedsonc/core-auth-kit init
```

Or install only: `npm install @liedsonc/core-auth-kit`. Peer deps: `next` ^15, `react` ^19, `react-dom` ^19. The package brings its own UI deps (Radix, CVA, clsx, tailwind-merge). No Resend npm package required; the scaffolded email helper uses Resend’s HTTP API.

**Styles:** Add the package to Tailwind `content` and import in your root layout:

```ts
content: ["./app/**/*.{js,ts,jsx,tsx,mdx}", "./node_modules/@liedsonc/core-auth-kit/**/*.{js,ts,jsx,tsx}"]
```

```tsx
import "@liedsonc/core-auth-kit/styles";
```

## Plug and Play

```bash
npx @liedsonc/core-auth-kit init
```

Installs the package if needed, optionally sets up shadcn (button, input, card, label), and scaffolds auth pages and API route stubs. Use `--no-shadcn` to use the package’s built-in components only. Use `--force` to overwrite existing files.

**Next steps:**

1. Implement `lib/auth-client.ts` with your backend (or API routes).
2. Copy `.env.example` to `.env.local` and set variables. See [docs](docs/README.md#environment-variables) for the full list.
3. Implement API routes under `app/api/auth/` if your client calls them; use `lib/email-templates.ts` in register and forgot-password for emails.
4. Ensure Tailwind content includes the package and you import `@liedsonc/core-auth-kit/styles` in the root layout.

Auth routes: `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`.

### Scaffolded files

| Path | Purpose |
|------|---------|
| `app/(auth)/layout.tsx` | AuthUIProvider and config |
| `app/(auth)/login/page.tsx` etc. | Full page source; edit copy/layout as needed |
| `lib/auth-config.ts` | AuthUIConfig (authClient, OAuth, redirects) |
| `lib/auth-client.ts` | **Replace with your backend** |
| `lib/email-templates.ts` | Verification/reset email copy and `sendEmail`; edit to customize |
| `.env.example` | Copy to `.env.local` |
| `app/api/auth/*/route.ts` | Stubs; implement and call your backend |

## Environment Variables

Copy `.env.example` to `.env.local`. Main options: app URL, redirects after login/register/reset, OAuth Google/Apple (enabled, client ID, redirect URI, client secret), Resend (API key, from email/name), app name. See [docs](docs/README.md#environment-variables) for the full reference.

## Quick Start

After init, replace the stub in `lib/auth-client.ts` with your backend. If you use `/api/auth/*`, implement those route handlers. See the [documentation](docs/README.md#quick-start-detailed) for a full AuthClient example and provider setup.

## Email

Init adds `lib/email-templates.ts` with default verification and password-reset copy and a `sendEmail` helper. Use it from your register and forgot-password API routes; edit the file to change subject and HTML. See [docs](docs/README.md#email-integration-with-resend) for Resend setup and code.

## API Reference

**Pages:** LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage, VerifyEmailPage.

**Components:** AuthCard, AuthForm, FormField, PasswordInput, OAuthButtons, ErrorMessage, SuccessMessage, LoadingSpinner.

**Hooks:** useAuth(), useOAuth(onRedirect).

For full types and signatures see the [documentation](docs/README.md#api-reference).

## Customization

- Logo, OAuth (env), layout (centered vs split), redirects, form order (email first or OAuth first), terms/privacy URLs.
- Use individual components to build custom pages.

See [docs](docs/README.md#customization) for code examples.

## More

**Production:** Set env for production, configure OAuth in provider consoles, build and deploy. See [docs](docs/README.md#production-setup).

**Styling:** Tailwind and shadcn conventions; customize via CSS variables. See [docs](docs/README.md#styling).

**Security:** No user enumeration in errors; implement CSRF, rate limiting, and secure tokens in your backend. See [docs](docs/README.md#security-considerations).

**Browser support:** Chrome, Firefox, Safari, Edge (latest).

## Contributing

Contributions are welcome. Please read our contributing guidelines first.

## License

MIT

## Support

Open an issue on GitHub for issues or questions.
