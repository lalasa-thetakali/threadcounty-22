/**
 * localDb.ts
 * A lightweight JSON-file database that mirrors the Supabase schema.
 * Used when NEXT_PUBLIC_SUPABASE_URL is unreachable (offline / DNS blocked).
 */
import fs from "fs";
import path from "path";
import crypto from "crypto";

const DB_DIR = path.join(process.cwd(), ".localdb");

function ensureDir() {
  if (!fs.existsSync(DB_DIR)) fs.mkdirSync(DB_DIR, { recursive: true });
}

function readTable<T = any>(name: string): T[] {
  ensureDir();
  const file = path.join(DB_DIR, `${name}.json`);
  if (!fs.existsSync(file)) return [];
  try { return JSON.parse(fs.readFileSync(file, "utf-8")); } catch { return []; }
}

function writeTable<T = any>(name: string, data: T[]) {
  ensureDir();
  fs.writeFileSync(path.join(DB_DIR, `${name}.json`), JSON.stringify(data, null, 2));
}

export function genId() {
  return crypto.randomUUID();
}

function hashPassword(pw: string): string {
  return crypto.createHash("sha256").update(pw + "threadcounty_salt").digest("hex");
}

// ─── AUTH ────────────────────────────────────────────────────────────────────

export interface LocalUser {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  created_at: string;
}

export interface LocalSession {
  token: string;
  user_id: string;
  expires_at: string;
}

export function localSignUp(email: string, password: string, full_name: string) {
  const users = readTable<LocalUser>("users");
  if (users.find(u => u.email === email)) {
    return { error: "A user with this email already exists." };
  }
  const user: LocalUser = {
    id: genId(),
    email,
    password_hash: hashPassword(password),
    full_name,
    created_at: new Date().toISOString(),
  };
  users.push(user);
  writeTable("users", users);

  // Auto-create profile
  const profiles = readTable("profiles");
  profiles.push({
    id: user.id,
    full_name,
    avatar_url: null,
    role: "user",
    plan: "free",
    storage_used_mb: 0,
    created_at: user.created_at,
  });
  writeTable("profiles", profiles);

  const session = createSession(user.id);
  return { user, session, error: null };
}

export function localLogin(email: string, password: string) {
  const users = readTable<LocalUser>("users");
  const user = users.find(u => u.email === email);
  if (!user) return { error: "Invalid login credentials." };
  if (user.password_hash !== hashPassword(password)) return { error: "Invalid login credentials." };
  const session = createSession(user.id);
  return { user, session, error: null };
}

function createSession(user_id: string): LocalSession {
  const sessions = readTable<LocalSession>("sessions");
  const token = crypto.randomBytes(32).toString("hex");
  const expires = new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString();
  const session: LocalSession = { token, user_id, expires_at: expires };
  sessions.push(session);
  writeTable("sessions", sessions);
  return session;
}

export function localGetUserByToken(token: string | null | undefined): LocalUser | null {
  if (!token) return null;
  const sessions = readTable<LocalSession>("sessions");
  const session = sessions.find(s => s.token === token && new Date(s.expires_at) > new Date());
  if (!session) return null;
  const users = readTable<LocalUser>("users");
  return users.find(u => u.id === session.user_id) ?? null;
}

export function localLogout(token: string) {
  const sessions = readTable<LocalSession>("sessions").filter(s => s.token !== token);
  writeTable("sessions", sessions);
}

// ─── GENERIC TABLE CRUD ──────────────────────────────────────────────────────

export function tableInsert(name: string, row: Record<string, any>) {
  const rows = readTable(name);
  const newRow = { id: genId(), created_at: new Date().toISOString(), ...row };
  rows.push(newRow);
  writeTable(name, rows);
  return newRow;
}

export function tableSelect(name: string, filter?: Record<string, any>) {
  let rows = readTable(name);
  if (filter) {
    rows = rows.filter(r => Object.entries(filter).every(([k, v]) => r[k] === v));
  }
  return rows;
}

export function tableUpdate(name: string, filter: Record<string, any>, updates: Record<string, any>) {
  const rows = readTable(name);
  let updated = false;
  const newRows = rows.map(r => {
    if (Object.entries(filter).every(([k, v]) => r[k] === v)) {
      updated = true;
      return { ...r, ...updates };
    }
    return r;
  });
  writeTable(name, newRows);
  return updated;
}

export function tableDelete(name: string, filter: Record<string, any>) {
  const rows = readTable(name).filter(r => !Object.entries(filter).every(([k, v]) => r[k] === v));
  writeTable(name, rows);
}

export function tableSelectOne(name: string, filter: Record<string, any>) {
  return readTable(name).find(r => Object.entries(filter).every(([k, v]) => r[k] === v)) ?? null;
}
