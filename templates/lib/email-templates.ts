const RESEND_API = "https://api.resend.com/emails";

function getFrom(): string {
  const name = process.env.RESEND_FROM_NAME || "App";
  const email =
    process.env.RESEND_FROM_EMAIL && !process.env.RESEND_FROM_EMAIL.includes("yourdomain")
      ? process.env.RESEND_FROM_EMAIL
      : "onboarding@resend.dev";
  return `${name} <${email}>`;
}

export function getVerificationEmailContent(params: {
  verificationUrl: string;
  appName?: string;
}): { subject: string; html: string } {
  const appName = params.appName || process.env.NEXT_PUBLIC_APP_NAME || "App";
  return {
    subject: "Verify your email",
    html: `<p>Welcome to ${appName}. Please verify your email by clicking the link below.</p><p><a href="${params.verificationUrl}">Verify your email</a></p><p>If you did not create an account, you can ignore this email.</p>`,
  };
}

export function getPasswordResetEmailContent(params: {
  resetUrl: string;
  appName?: string;
}): { subject: string; html: string } {
  const appName = params.appName || process.env.NEXT_PUBLIC_APP_NAME || "App";
  return {
    subject: "Reset your password",
    html: `<p>You requested a password reset for your ${appName} account. Click the link below to set a new password.</p><p><a href="${params.resetUrl}">Reset password</a></p><p>If you did not request this, you can ignore this email.</p>`,
  };
}

export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}): Promise<{ success: true } | { success: false; error: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { success: false, error: "RESEND_API_KEY is not set" };
  }
  const res = await fetch(RESEND_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: params.from ?? getFrom(),
      to: [params.to],
      subject: params.subject,
      html: params.html,
    }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { success: false, error: (data as { message?: string }).message ?? "Failed to send email" };
  }
  return { success: true };
}
