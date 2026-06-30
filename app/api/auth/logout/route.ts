import { NextRequest, NextResponse } from "next/server";
import { localLogout } from "@/lib/localDb";

export async function POST(req: NextRequest) {
  try {
    const token = req.cookies.get("tc_session")?.value;
    if (token) localLogout(token);
    const response = NextResponse.json({ success: true });
    response.cookies.set("tc_session", "", { maxAge: 0, path: "/" });
    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "An error occurred." }, { status: 500 });
  }
}
