import { NextRequest, NextResponse } from "next/server";
import { checkAdmin } from "@/lib/authHelper";
import { tableSelect, tableSelectOne, tableUpdate, tableDelete } from "@/lib/localDb";

export async function GET(req: NextRequest) {
  try {
    const admin = await checkAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const roleFilter = searchParams.get("role");

    let users = tableSelect("profiles");
    if (roleFilter) users = users.filter((u: any) => u.role === roleFilter);

    users.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    const total = users.length;
    const paginated = users.slice((page - 1) * limit, page * limit);

    return NextResponse.json({ users: paginated, total, page, limit });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "An error occurred." }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const admin = await checkAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

    const { id, role, plan } = await req.json();
    if (!id) return NextResponse.json({ error: "Missing user ID." }, { status: 400 });

    const updates: Record<string, any> = {};
    if (role !== undefined) updates.role = role;
    if (plan !== undefined) updates.plan = plan;

    tableUpdate("profiles", { id }, updates);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "An error occurred." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const admin = await checkAdmin();
    if (!admin) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing user ID." }, { status: 400 });

    tableDelete("users", { id });
    tableDelete("profiles", { id });
    tableDelete("uploads", { user_id: id });
    tableDelete("reports", { user_id: id });
    tableDelete("notifications", { user_id: id });
    tableDelete("sessions", { user_id: id });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "An error occurred." }, { status: 500 });
  }
}
