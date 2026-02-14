import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { email } = body as { email?: string };
  if (!email) {
    return NextResponse.json(
      { error: "Missing email" },
      { status: 400 }
    );
  }
  return NextResponse.json(
    { error: "Implement this route: create reset token, store it, and send reset email (e.g. via Resend)." },
    { status: 501 }
  );
}
