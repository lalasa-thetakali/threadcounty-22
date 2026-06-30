import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/authHelper";
import { tableSelect } from "@/lib/localDb";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const uploads = tableSelect("uploads", { user_id: user.id })
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    const notifications = tableSelect("notifications", { user_id: user.id })
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 10);

    return NextResponse.json({ uploads, notifications });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "An error occurred." }, { status: 500 });
  }
}
