import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "@/lib/authHelper";
import { tableSelect } from "@/lib/localDb";

export async function GET(req: NextRequest) {
  try {
    const admin = await checkAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

    const users = tableSelect("users");
    const profiles = tableSelect("profiles");
    const uploads = tableSelect("uploads");
    const reports = tableSelect("reports");

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 3600 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 3600 * 1000);

    const recentUsers = users.filter((u: any) => new Date(u.created_at) > thirtyDaysAgo).length;
    const recentUploads = uploads.filter((u: any) => new Date(u.created_at) > thirtyDaysAgo).length;
    const weeklyUploads = uploads.filter((u: any) => new Date(u.created_at) > sevenDaysAgo).length;

    const planCounts = profiles.reduce((acc: Record<string, number>, p: any) => {
      const plan = p.plan || "free";
      acc[plan] = (acc[plan] || 0) + 1;
      return acc;
    }, {});

    const fabricTypes = reports.reduce((acc: Record<string, number>, r: any) => {
      const t = r.fabric_type || "Unknown";
      acc[t] = (acc[t] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      overview: {
        totalUsers: users.length,
        totalUploads: uploads.length,
        totalReports: reports.length,
        recentUsers,
        recentUploads,
        weeklyUploads,
      },
      planDistribution: planCounts,
      fabricTypes,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "An error occurred." }, { status: 500 });
  }
}
