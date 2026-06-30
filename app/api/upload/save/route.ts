import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/authHelper";
import { tableInsert } from "@/lib/localDb";

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const { fileUrl, fileName, fileSize, filePath } = await req.json();
    if (!fileUrl || !fileName || fileSize === undefined) {
      return NextResponse.json({ error: "Missing file info." }, { status: 400 });
    }

    const uploadRow = tableInsert("uploads", {
      user_id: user.id,
      file_url: fileUrl,
      file_name: fileName,
      file_size: fileSize,
      file_path: filePath || "",
      status: "processing",
    });

    return NextResponse.json({ uploadId: uploadRow.id, userId: user.id });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "An error occurred." }, { status: 500 });
  }
}
