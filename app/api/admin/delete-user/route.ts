import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/authHelper";
import { tableSelectOne, tableDelete } from "@/lib/localDb";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    // Only let admins delete OTHER users; a regular user can delete their own account
    const { userId } = await req.json();
    const targetId = userId || user.id;

    const profile = tableSelectOne("profiles", { id: user.id });
    if (targetId !== user.id && profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    tableDelete("users", { id: targetId });
    tableDelete("profiles", { id: targetId });
    tableDelete("uploads", { user_id: targetId });
    tableDelete("reports", { user_id: targetId });
    tableDelete("notifications", { user_id: targetId });
    tableDelete("sessions", { user_id: targetId });

    const response = NextResponse.json({ success: true });
    if (targetId === user.id) {
      response.cookies.set("tc_session", "", { maxAge: 0, path: "/" });
    }
    return response;
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "An error occurred." }, { status: 500 });
  }
}
