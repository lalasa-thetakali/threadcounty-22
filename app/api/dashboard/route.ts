import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/authHelper";
import { tableSelect, tableSelectOne } from "@/lib/localDb";

export async function GET(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const profile = tableSelectOne("profiles", { id: user.id }) || {};
    const uploads = tableSelect("uploads", { user_id: user.id })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const reports = tableSelect("reports", { user_id: user.id })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5);
    const notifications = tableSelect("notifications", { user_id: user.id })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 15);

    const totalSize = uploads.reduce((s: number, u: any) => s + (u.file_size || 0), 0);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        full_name: profile.full_name || "",
        avatar_url: profile.avatar_url || "",
        role: profile.role || "user",
        plan: profile.plan || "free",
        created_at: profile.created_at,
      },
      stats: {
        totalUploads: uploads.length,
        storageUsedMb: totalSize / (1024 * 1024),
        recentReportsCount: reports.length,
        unreadNotificationsCount: notifications.filter((n: any) => !n.read).length,
      },
      reports,
      notifications,
      uploads: uploads.slice(0, 8),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "An error occurred." }, { status: 500 });
  }
}
