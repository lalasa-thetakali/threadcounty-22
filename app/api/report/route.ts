import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/authHelper";
import { tableSelect, tableSelectOne, tableDelete } from "@/lib/localDb";
import fs from "fs";
import path from "path";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      const report = tableSelectOne("reports", { id });
      if (!report) return NextResponse.json({ error: "Report not found." }, { status: 404 });
      const profile = tableSelectOne("profiles", { id: user.id });
      if (report.user_id !== user.id && profile?.role !== "admin") {
        return NextResponse.json({ error: "Forbidden." }, { status: 403 });
      }
      return NextResponse.json({ report });
    } else {
      const reports = tableSelect("reports", { user_id: user.id })
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
      return NextResponse.json({ reports });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "An error occurred." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing report ID." }, { status: 400 });

    const report = tableSelectOne("reports", { id });
    if (!report) return NextResponse.json({ error: "Report not found." }, { status: 404 });

    const profile = tableSelectOne("profiles", { id: user.id });
    if (report.user_id !== user.id && profile?.role !== "admin") {
      return NextResponse.json({ error: "Forbidden." }, { status: 403 });
    }

    // Delete the local file if it exists
    const upload = tableSelectOne("uploads", { id: report.upload_id });
    if (upload?.file_url) {
      try {
        const localPath = path.join(process.cwd(), "public", upload.file_url.replace(/^\//, ""));
        if (fs.existsSync(localPath)) fs.unlinkSync(localPath);
      } catch (e) { /* silent */ }
    }

    tableDelete("uploads", { id: report.upload_id });
    tableDelete("reports", { id });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "An error occurred." }, { status: 500 });
  }
}
