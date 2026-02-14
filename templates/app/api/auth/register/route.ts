import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const { email, password } = body as { email?: string; password?: string };
  if (!email || !password) {
    return NextResponse.json(
      { error: "Missing email or password" },
      { status: 400 }
    );
  }
  return NextResponse.json(
    { error: "Implement this route: call your auth backend to create the user and optionally send verification email." },
    { status: 501 }
  );
}
