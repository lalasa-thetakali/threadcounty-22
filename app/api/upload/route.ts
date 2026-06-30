import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/authHelper";
import { tableInsert, tableSelect, tableSelectOne, tableUpdate } from "@/lib/localDb";
import { mockAnalyzeFabric } from "@/lib/mockAI";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const { fileName, fileSize, fileType } = await req.json();
    if (!fileName || fileSize === undefined || !fileType) {
      return NextResponse.json({ error: "Missing fields." }, { status: 400 });
    }

    const MAX_SIZE_MB = 10;
    if (fileSize > MAX_SIZE_MB * 1024 * 1024) {
      return NextResponse.json({ error: `File size exceeds the ${MAX_SIZE_MB}MB limit.` }, { status: 400 });
    }

    if (!["image/jpeg", "image/png", "image/jpg"].includes(fileType)) {
      return NextResponse.json({ error: "Only JPEG, JPG, and PNG images are supported." }, { status: 400 });
    }

    const profile = tableSelectOne("profiles", { id: user.id });
    const plan = profile?.plan || "free";

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentUploads = tableSelect("uploads", { user_id: user.id })
      .filter((u: any) => new Date(u.created_at) > thirtyDaysAgo);

    const limit = plan === "free" ? 5 : plan === "student" ? 50 : Infinity;
    if (recentUploads.length >= limit) {
      return NextResponse.json({
        error: `Monthly upload limit reached. You have uploaded ${recentUploads.length}/${limit} images under the ${plan} plan. Please upgrade your plan.`,
        limitReached: true
      }, { status: 403 });
    }

    const path = `${user.id}/${Date.now()}_${fileName}`;
    return NextResponse.json({ path, allowed: true, plan, currentUploads: recentUploads.length, limit });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "An error occurred." }, { status: 500 });
  }
}
