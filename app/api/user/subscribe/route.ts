import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/authHelper";
import { tableSelectOne, tableUpdate } from "@/lib/localDb";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const { plan } = await req.json();
    const validPlans = ["free", "student", "professional", "enterprise"];
    if (!plan || !validPlans.includes(plan)) {
      return NextResponse.json({ error: "Invalid plan selected." }, { status: 400 });
    }

    tableUpdate("profiles", { id: user.id }, { plan });
    const profile = tableSelectOne("profiles", { id: user.id });
    return NextResponse.json({ success: true, profile });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "An error occurred." }, { status: 500 });
  }
}
