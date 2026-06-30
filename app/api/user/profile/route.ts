import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/authHelper";
import { tableSelect, tableSelectOne, tableUpdate, tableInsert } from "@/lib/localDb";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    const profile = tableSelectOne("profiles", { id: user.id });
    return NextResponse.json({ profile: { ...profile, email: user.email } });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "An error occurred." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    const { full_name } = await req.json();
    if (full_name === undefined) {
      return NextResponse.json({ error: "Missing full_name." }, { status: 400 });
    }
    tableUpdate("profiles", { id: user.id }, { full_name });
    const profile = tableSelectOne("profiles", { id: user.id });
    return NextResponse.json({ success: true, profile });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "An error occurred." }, { status: 500 });
  }
}
