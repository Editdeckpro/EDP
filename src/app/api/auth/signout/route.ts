import { NextResponse } from "next/server";

/**
 * Auth is handled entirely on the backend. Use POST backend /auth/logout with credentials to sign out.
 */
export async function POST() {
  return NextResponse.json(
    { error: "moved", message: "Use backend POST /auth/logout with credentials" },
    { status: 410 }
  );
}
