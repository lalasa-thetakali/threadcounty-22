import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  // In local/offline mode, password reset via email is not possible.
  return NextResponse.json({ success: true, message: "If this email exists, a reset link would be sent. (Running in offline mode — check your admin panel to reset passwords.)" });
}
