import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "@/lib/authHelper";
import { tableSelect } from "@/lib/localDb";

export async function GET(req: NextRequest) {
  try {
    const admin = await checkAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

    const uploads = tableSelect("uploads")
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json({ uploads, total: uploads.length });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "An error occurred." }, { status: 500 });
  }
}
