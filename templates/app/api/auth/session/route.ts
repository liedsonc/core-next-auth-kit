import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    { error: "Implement this route: return current session (e.g. from cookie or token)." },
    { status: 501 }
  );
}
