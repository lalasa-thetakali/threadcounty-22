import { NextRequest, NextResponse } from "next/server";
import { tableInsert } from "@/lib/localDb";

export async function POST(req: NextRequest) {
  try {
    const { name, email, message } = await req.json();
    if (!name || !email || !message) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    // Save to local DB
    tableInsert("contact_messages", { name, email, message });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to submit message." }, { status: 500 });
  }
}
