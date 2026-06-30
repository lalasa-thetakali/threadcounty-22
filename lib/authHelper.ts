import { cookies } from "next/headers";
import { localGetUserByToken, tableSelectOne } from "@/lib/localDb";

/** Returns the local session user (from cookie) or null. */
export async function getSessionUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("tc_session")?.value;
    const user = localGetUserByToken(token);
    if (!user) return null;
    return { id: user.id, email: user.email };
  } catch (e) {
    console.error("Auth helper error:", e);
    return null;
  }
}

/** Returns the session user only if they have role='admin', else null. */
export async function checkAdmin() {
  try {
    const user = await getSessionUser();
    if (!user) return null;
    const profile = tableSelectOne("profiles", { id: user.id });
    if (profile?.role !== "admin") return null;
    return user;
  } catch (e) {
    console.error("Admin check helper error:", e);
    return null;
  }
}
