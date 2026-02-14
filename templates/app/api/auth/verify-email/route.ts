import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { token } = body as { token?: string };
  if (!token) {
    return NextResponse.json(
      { error: "Missing token" },
      { status: 400 }
    );
  }
  return NextResponse.json(
    { error: "Implement this route: validate verification token and mark email verified in your backend." },
    { status: 501 }
  );
}
