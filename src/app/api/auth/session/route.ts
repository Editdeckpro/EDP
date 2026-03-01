import { NextResponse } from "next/server";

/**
 * Auth is handled entirely on the backend (cookie-based).
 * Use GET backend /api/user with credentials for session; POST backend /auth/login or /auth/session for sign-in.
 */
export async function GET() {
  return NextResponse.json(
    { error: "moved", message: "Use backend GET /api/user with credentials for session" },
    { status: 410 }
  );
}

export async function POST() {
  return NextResponse.json(
    { error: "moved", message: "Use backend POST /auth/login or POST /auth/session with credentials" },
    { status: 410 }
  );
}
