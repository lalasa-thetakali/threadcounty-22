import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const filePathParam = formData.get("path") as string; // e.g. "user_id/123_filename.png" or "user_id/avatar_123.jpg"

    if (!file || !filePathParam) {
      return NextResponse.json({ error: "Missing file or path." }, { status: 400 });
    }

    // Determine the destination directory (uploads or avatars)
    const isAvatar = filePathParam.includes("avatar_");
    const destFolder = isAvatar ? "avatars" : "uploads";
    
    // We want to save inside public/uploads or public/avatars
    const publicDir = path.join(process.cwd(), "public");
    const targetFolder = path.join(publicDir, destFolder);
    
    // Ensure the folder exists
    if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir);
    if (!fs.existsSync(targetFolder)) fs.mkdirSync(targetFolder);

    // We can preserve the subfolders (e.g. user_id)
    const folderParts = filePathParam.split("/");
    let fileName = filePathParam;
    if (folderParts.length > 1) {
      const subFolder = path.join(targetFolder, folderParts[0]);
      if (!fs.existsSync(subFolder)) fs.mkdirSync(subFolder);
      fileName = path.join(folderParts[0], folderParts[1]);
    }

    const fullPath = path.join(targetFolder, fileName);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(fullPath, buffer);

    return NextResponse.json({ success: true, url: `/${destFolder}/${filePathParam}` });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
