import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/authHelper";
import { tableUpdate } from "@/lib/localDb";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("avatar") as File | null;
    if (!file) return NextResponse.json({ error: "No avatar file provided." }, { status: 400 });

    const ext = file.name.split(".").pop() || "jpg";
    const fileName = `avatar_${user.id}.${ext}`;
    const publicDir = path.join(process.cwd(), "public", "avatars");
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
    const filePath = path.join(publicDir, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    const avatarUrl = `/avatars/${fileName}`;
    tableUpdate("profiles", { id: user.id }, { avatar_url: avatarUrl });

    return NextResponse.json({ success: true, avatar_url: avatarUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "An error occurred." }, { status: 500 });
  }
}
