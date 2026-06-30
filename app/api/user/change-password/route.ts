import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/authHelper";
import { tableSelectOne } from "@/lib/localDb";
import crypto from "crypto";
import fs from "fs";
import path from "path";

// We need to access the users table directly to update the password hash
function readTable(name: string) {
  const DB_DIR = path.join(process.cwd(), ".localdb");
  const file = path.join(DB_DIR, `${name}.json`);
  if (!fs.existsSync(file)) return [];
  try { return JSON.parse(fs.readFileSync(file, "utf-8")); } catch { return []; }
}
function writeTable(name: string, data: any[]) {
  const DB_DIR = path.join(process.cwd(), ".localdb");
  fs.writeFileSync(path.join(DB_DIR, `${name}.json`), JSON.stringify(data, null, 2));
}
function hashPassword(pw: string): string {
  return crypto.createHash("sha256").update(pw + "threadcounty_salt").digest("hex");
}

export async function POST(req: NextRequest) {
  try {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

    const { password } = await req.json();
    if (!password || password.length < 6) {
      return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
    }

    const users = readTable("users");
    const updated = users.map((u: any) => {
      if (u.id === user.id) return { ...u, password_hash: hashPassword(password) };
      return u;
    });
    writeTable("users", updated);

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "An error occurred." }, { status: 500 });
  }
}
