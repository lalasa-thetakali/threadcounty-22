import { NextRequest, NextResponse } from "next/server";
import { localLogin } from "@/lib/localDb";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const result = localLogin(email, password);
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const response = NextResponse.json({ success: true, user: { id: result.user!.id, email: result.user!.email } });
    response.cookies.set("tc_session", result.session!.token, {
      httpOnly: true,
      path: "/",
      maxAge: 7 * 24 * 3600,
      sameSite: "lax",
    });
    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "An error occurred." }, { status: 500 });
  }
}
