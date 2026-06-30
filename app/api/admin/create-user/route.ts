import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "@/lib/authHelper";
import { localSignUp } from "@/lib/localDb";

export async function POST(req: NextRequest) {
  try {
    const admin = await checkAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

    const { email, password, full_name, role } = await req.json();
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const result = localSignUp(email, password, full_name || "");
    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // If role is admin, update the profile
    if (role === "admin" && result.user) {
      const { tableUpdate } = await import("@/lib/localDb");
      tableUpdate("profiles", { id: result.user.id }, { role: "admin" });
    }

    return NextResponse.json({ success: true, userId: result.user!.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "An error occurred." }, { status: 500 });
  }
}
