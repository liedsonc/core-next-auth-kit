import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    { error: "Implement this route: clear the session (e.g. delete cookie or revoke token)." },
    { status: 501 }
  );
}
