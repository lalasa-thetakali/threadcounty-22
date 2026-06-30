"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Legend
} from "recharts";
import {
  Users, Upload, FileText, Shield, Trash2, ChevronDown,
  Loader2, RefreshCw, Image as ImageIcon
} from "lucide-react";

const PLAN_COLORS: Record<string, string> = {
  free: "#94a3b8",
  student: "#60a5fa",
  professional: "#4f46e5",
  enterprise: "#7c3aed",
};

const PIE_COLORS = ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];

export default function AdminDashboard() {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [uploads, setUploads] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"users" | "uploads" | "reports" | "analytics">("users");
  const [updatingUser, setUpdatingUser] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const loadAll = async () => {
    setLoading(true);
    try {
      const [usersRes, uploadsRes, analyticsRes] = await Promise.all([
        fetch("/api/admin/users"),
        fetch("/api/admin/uploads"),
        fetch("/api/admin/analytics"),
      ]);

      if (usersRes.status === 401 || usersRes.status === 403) {
        setAllowed(false);
        setLoading(false);
        return;
      }
      setAllowed(true);

      const usersJson = await usersRes.json();
      const uploadsJson = uploadsRes.ok ? await uploadsRes.json() : { uploads: [] };
      const analyticsJson = analyticsRes.ok ? await analyticsRes.json() : null;

      // Fetch all reports via the report API
      const reportsRes = await fetch("/api/report");
      const reportsJson = reportsRes.ok ? await reportsRes.json() : { reports: [] };

      setUsers(usersJson.users || []);
      setUploads(uploadsJson.uploads || []);
      setReports(reportsJson.reports || []);

      // Transform analytics for charts
      if (analyticsJson) {
        const fabricTypesArr = Object.entries(analyticsJson.fabricTypes || {}).map(([name, count]) => ({ name, count }));
        const plansArr = Object.entries(analyticsJson.planDistribution || {}).map(([name, count]) => ({ name, count }));
        setAnalytics({ ...analyticsJson, fabricTypes: fabricTypesArr, plans: plansArr });
      }
    } catch (e) {
      console.error("Admin load error:", e);
      setAllowed(false);
    }
    setLoading(false);
  };

  useEffect(() => { loadAll(); }, []);

  const updateUserField = async (userId: string, field: "plan" | "role", value: string) => {
    setUpdatingUser(userId);
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userId, [field]: value }),
    });
    setUpdatingUser(null);
    if (res.ok) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, [field]: value } : u));
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm("Permanently delete this user and all their data?")) return;
    await fetch(`/api/admin/users?id=${userId}`, { method: "DELETE" });
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const deleteReport = async (reportId: string) => {
    if (!confirm("Are you sure you want to delete this report? This will permanently delete the uploaded fabric image.")) return;
    try {
      const res = await fetch(`/api/report?id=${reportId}`, { method: "DELETE" });
      if (res.ok) {
        setReports(prev => prev.filter(r => r.id !== reportId));
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete report.");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to connect to delete endpoint.");
    }
  };

  if (allowed === null || loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin text-primary" size={32} />
    </div>
  );

  if (allowed === false) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4">
      <Shield size={48} className="text-red-400" />
      <h1 className="text-2xl font-bold text-red-500">Access Denied</h1>
      <p className="text-gray-500 text-sm">This area is restricted to administrators only.</p>
      <Link href="/dashboard" className="btn-primary text-sm">Back to Dashboard</Link>
    </div>
  );

  const statCards = [
    { icon: Users, label: "Total Users", value: users.length, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
    { icon: Upload, label: "Total Uploads", value: uploads.length, color: "text-green-500", bg: "bg-green-50 dark:bg-green-950/30" },
    { icon: FileText, label: "Total Reports", value: reports.length, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/30" },
    { icon: Shield, label: "Admin Users", value: users.filter(u => u.role === "admin").length, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/30" },
  ];

  const tabs = [
    { id: "users", label: `Users (${users.length})` },
    { id: "uploads", label: `Uploads (${uploads.length})` },
    { id: "reports", label: `Reports (${reports.length})` },
    { id: "analytics", label: "Analytics" },
  ] as const;

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-3">
            <Shield size={28} className="text-primary" /> Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">Manage users, uploads, reports, and platform analytics.</p>
        </div>
        <button onClick={loadAll} className="btn-outline flex items-center gap-2 text-sm py-2">
          <RefreshCw size={14} /> Refresh Data
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="card flex items-center gap-4">
            <div className={`p-3 rounded-xl ${s.bg}`}><s.icon size={20} className={s.color} /></div>
            <div><div className="text-2xl font-extrabold">{s.value}</div><div className="text-xs text-gray-500">{s.label}</div></div>
          </motion.div>
        ))}
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-1 w-fit flex-wrap">
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-all ${activeTab === tab.id ? "bg-white dark:bg-gray-800 text-primary shadow-sm border border-gray-100 dark:border-gray-700" : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ─── Users Tab ─── */}
      {activeTab === "users" && (
        <div className="card overflow-x-auto">
          <h2 className="font-bold text-lg mb-4">User Management</h2>
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b border-gray-50 dark:border-gray-800">
                <th className="pb-3 pr-4">User</th>
                <th className="pb-3 pr-4">Plan</th>
                <th className="pb-3 pr-4">Role</th>
                <th className="pb-3 pr-4">Joined</th>
                <th className="pb-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      {u.avatar_url ? (
                        <img src={u.avatar_url} alt="" className="w-8 h-8 rounded-full object-cover" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <Users size={12} className="text-primary" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{u.full_name || "—"}</p>
                        <p className="text-xs text-gray-400">{u.id?.slice(0, 8)}…</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="relative">
                      <select
                        className="text-xs border border-gray-200 dark:border-gray-700 bg-transparent rounded-lg px-2 py-1 pr-6 appearance-none cursor-pointer focus:ring-1 focus:ring-primary"
                        value={u.plan}
                        disabled={updatingUser === u.id}
                        onChange={(e) => updateUserField(u.id, "plan", e.target.value)}
                      >
                        {["free", "student", "professional", "enterprise"].map(p => (
                          <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
                        ))}
                      </select>
                      <ChevronDown size={10} className="absolute right-1.5 top-2 text-gray-400 pointer-events-none" />
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <div className="relative">
                      <select
                        className="text-xs border border-gray-200 dark:border-gray-700 bg-transparent rounded-lg px-2 py-1 pr-6 appearance-none cursor-pointer focus:ring-1 focus:ring-primary"
                        value={u.role}
                        disabled={updatingUser === u.id}
                        onChange={(e) => updateUserField(u.id, "role", e.target.value)}
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                      <ChevronDown size={10} className="absolute right-1.5 top-2 text-gray-400 pointer-events-none" />
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-xs text-gray-500">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="py-3">
                    {updatingUser === u.id ? (
                      <Loader2 size={14} className="animate-spin text-primary" />
                    ) : (
                      <button onClick={() => deleteUser(u.id)} title="Delete user"
                        className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors">
                        <Trash2 size={14} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <p className="text-center text-gray-400 text-sm py-8">No users found.</p>}
        </div>
      )}

      {/* ─── Uploads Tab ─── */}
      {activeTab === "uploads" && (
        <div className="space-y-4">
          <h2 className="font-bold text-lg">Uploaded Fabric Images</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {uploads.map((u) => (
              <div key={u.id} className="card p-3 space-y-2 hover:border-primary/20 transition-all group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800">
                  {u.file_url ? (
                    <img src={u.file_url} alt={u.file_name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon size={24} className="text-gray-300" />
                    </div>
                  )}
                </div>
                <p className="text-xs font-medium truncate">{u.file_name}</p>
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${u.status === "completed" ? "bg-green-50 text-green-600 dark:bg-green-950/30 dark:text-green-400" : "bg-yellow-50 text-yellow-600 dark:bg-yellow-950/30 dark:text-yellow-400"}`}>
                    {u.status}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {u.file_size ? `${(u.file_size / 1024).toFixed(0)} KB` : "—"}
                  </span>
                </div>
                <p className="text-[10px] text-gray-400">{u.profiles?.full_name || "Unknown"}</p>
              </div>
            ))}
            {uploads.length === 0 && (
              <div className="col-span-full text-center text-gray-400 text-sm py-12">No uploads found.</div>
            )}
          </div>
        </div>
      )}

      {/* ─── Reports Tab ─── */}
      {activeTab === "reports" && (
        <div className="card overflow-x-auto">
          <h2 className="font-bold text-lg mb-4">All AI Reports</h2>
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b border-gray-50 dark:border-gray-800">
                <th className="pb-3 pr-4">Fabric Type</th>
                <th className="pb-3 pr-4">Thread Density</th>
                <th className="pb-3 pr-4">Confidence</th>
                <th className="pb-3 pr-4">Date</th>
                <th className="pb-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
              {reports.slice(0, 30).map((r) => (
                <tr key={r.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                  <td className="py-3 pr-4 font-medium">{r.fabric_type || "—"}</td>
                  <td className="py-3 pr-4 text-gray-500">{r.thread_density ?? "—"}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-100 dark:bg-gray-800 rounded-full h-1.5">
                        <div className="h-1.5 bg-primary rounded-full" style={{ width: `${((r.confidence || 0) * 100).toFixed(0)}%` }} />
                      </div>
                      <span className="text-xs text-gray-500">{((r.confidence || 0) * 100).toFixed(0)}%</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-xs text-gray-500">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="py-3">
                    <button onClick={() => deleteReport(r.id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reports.length === 0 && <p className="text-center text-gray-400 text-sm py-8">No reports yet.</p>}
        </div>
      )}

      {/* ─── Analytics Tab ─── */}
      {activeTab === "analytics" && analytics && (
        <div className="space-y-6">
          {/* Fabric Type Bar Chart */}
          <div className="card">
            <h3 className="font-bold text-lg mb-4">Fabric Type Distribution</h3>
            {analytics.fabricTypes?.length > 0 ? (
              <ResponsiveContainer width="100%" height={240}>
                <BarChart data={analytics.fabricTypes} margin={{ top: 0, right: 20, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" fontSize={11} tick={{ fill: "#9ca3af" }} />
                  <YAxis allowDecimals={false} fontSize={11} tick={{ fill: "#9ca3af" }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }} />
                  <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} name="Count" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center text-gray-400 text-sm py-8">No report data yet.</p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Plan Distribution Pie */}
            <div className="card">
              <h3 className="font-bold text-lg mb-4">Subscription Plan Distribution</h3>
              {analytics.plans?.some((p: any) => p.count > 0) ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={analytics.plans.filter((p: any) => p.count > 0)} cx="50%" cy="50%" outerRadius={80} dataKey="count" nameKey="name" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={11}>
                      {analytics.plans.map((_: any, idx: number) => (
                        <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                    <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-400 text-sm py-8">No subscription data yet.</p>
              )}
            </div>

            {/* Daily Uploads Line Chart */}
            <div className="card">
              <h3 className="font-bold text-lg mb-4">Daily Uploads (Last 7 Days)</h3>
              {analytics.dailyUploads ? (
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={analytics.dailyUploads} margin={{ top: 0, right: 20, bottom: 0, left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="date" fontSize={11} tick={{ fill: "#9ca3af" }} />
                    <YAxis allowDecimals={false} fontSize={11} tick={{ fill: "#9ca3af" }} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #e5e7eb" }} />
                    <Line type="monotone" dataKey="count" stroke="#4f46e5" strokeWidth={2.5} dot={{ r: 4, fill: "#4f46e5" }} name="Uploads" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-400 text-sm py-8">No upload data yet.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
