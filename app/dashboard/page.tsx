"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Upload, FileText, HardDrive, Bell, Plus, History,
  User, MessageSquare, ChevronRight, X, Loader2,
  CheckCircle, Cpu
} from "lucide-react";

const PLAN_LIMITS: Record<string, number> = {
  free: 10,
  student: 100,
  professional: 1024,
  enterprise: 10240,
};

export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [uploads, setUploads] = useState<any[]>([]);
  const [reports, setReports] = useState<any[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotif, setShowNotif] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/dashboard");
        if (res.status === 401) { router.push("/login"); return; }
        if (res.ok) {
          const json = await res.json();
          setUser(json.user);
          setProfile(json.user);
          setUploads(json.uploads || []);
          setReports(json.reports || []);
          setNotifications(json.notifications || []);
        }
      } catch (e) {
        console.error("Dashboard API error:", e);
        router.push("/login");
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const markAllRead = async () => {
    // Optimistically mark all read in local state
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin text-primary" size={32} />
    </div>
  );

  const storageLimitMb = PLAN_LIMITS[profile?.plan || "free"];
  const storageUsedMb = uploads.reduce((a, u) => a + (u.file_size || 0), 0) / (1024 * 1024);
  const storagePercent = Math.min(100, (storageUsedMb / storageLimitMb) * 100);
  const unreadCount = notifications.filter(n => !n.read).length;
  const displayName = profile?.full_name || user?.email?.split("@")[0] || "User";

  const stats = [
    { icon: Upload, label: "Total Uploads", value: uploads.length, color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-950/30" },
    { icon: FileText, label: "AI Reports", value: reports.length, color: "text-green-500", bg: "bg-green-50 dark:bg-green-950/30" },
    { icon: HardDrive, label: "Storage Used", value: `${storageUsedMb.toFixed(1)} MB`, color: "text-orange-500", bg: "bg-orange-50 dark:bg-orange-950/30" },
    { icon: Bell, label: "Notifications", value: notifications.length, color: "text-purple-500", bg: "bg-purple-50 dark:bg-purple-950/30" },
  ];

  const quickActions = [
    { href: "/upload", icon: Plus, label: "New Upload", desc: "Analyze a fabric image", primary: true },
    { href: "/history", icon: History, label: "View History", desc: "Browse past analyses", primary: false },
    { href: "/profile", icon: User, label: "Edit Profile", desc: "Update your details", primary: false },
    { href: "/contact", icon: MessageSquare, label: "Contact Support", desc: "Get help from our team", primary: false },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-10">

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-1">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="avatar" className="w-12 h-12 rounded-full object-cover border-2 border-primary/20" />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-primary/20">
                <User size={22} className="text-primary" />
              </div>
            )}
            <div>
              <h1 className="text-2xl font-extrabold">Welcome back, {displayName}! 👋</h1>
              <p className="text-sm text-gray-500 capitalize">{profile?.plan || "free"} plan · {profile?.role || "user"}</p>
            </div>
          </div>
        </motion.div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotif(!showNotif)}
            className="relative p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-primary/30 transition shadow-sm"
          >
            <Bell size={18} className={unreadCount > 0 ? "text-primary" : "text-gray-400"} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotif && (
            <motion.div
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute right-0 top-14 w-80 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-xl z-50 overflow-hidden"
            >
              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-50 dark:border-gray-800">
                <span className="font-bold text-sm">Notifications</span>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button onClick={markAllRead} className="text-xs text-primary hover:underline">Mark all read</button>
                  )}
                  <button onClick={() => setShowNotif(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={14} />
                  </button>
                </div>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-gray-50 dark:divide-gray-800">
                {notifications.length === 0 ? (
                  <p className="text-center text-sm text-gray-400 py-8">No notifications yet.</p>
                ) : notifications.map((n) => (
                  <div key={n.id} className={`px-4 py-3 text-sm ${!n.read ? "bg-primary/5 dark:bg-primary/10" : ""}`}>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">{n.title}</p>
                    {n.body && <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{n.body}</p>}
                    <p className="text-[10px] text-gray-400 mt-1">{new Date(n.created_at).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }}
            className="card flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl ${s.bg}`}>
              <s.icon size={20} className={s.color} />
            </div>
            <div>
              <div className="text-2xl font-extrabold">{s.value}</div>
              <div className="text-xs text-gray-500">{s.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Storage Progress */}
      <div className="card space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <HardDrive size={16} className="text-primary" /> Storage Usage
          </h3>
          <Link href="/pricing" className="text-xs text-primary hover:underline font-medium">Upgrade Plan →</Link>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-gray-500">
            <span>{storageUsedMb.toFixed(1)} MB used</span>
            <span>{storageLimitMb >= 1024 ? `${storageLimitMb / 1024} GB` : `${storageLimitMb} MB`} total</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-3 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${storagePercent}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className={`h-3 rounded-full ${storagePercent > 80 ? "bg-red-500" : storagePercent > 50 ? "bg-yellow-500" : "bg-gradient-to-r from-primary to-accent"}`}
            />
          </div>
          <p className="text-[11px] text-gray-400">{storagePercent.toFixed(0)}% of your {profile?.plan || "free"} plan storage used.</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, i) => (
            <motion.div key={action.href} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }} whileHover={{ y: -3 }}>
              <Link
                href={action.href}
                className={`card block text-center p-5 hover:border-primary/30 dark:hover:border-primary/30 transition-all duration-200 group ${action.primary ? "bg-gradient-to-br from-primary to-accent text-white border-transparent shadow-md" : ""}`}
              >
                <action.icon size={24} className={`mx-auto mb-2 ${action.primary ? "text-white" : "text-primary"}`} />
                <p className={`font-semibold text-sm ${action.primary ? "text-white" : ""}`}>{action.label}</p>
                <p className={`text-xs mt-0.5 ${action.primary ? "text-white/80" : "text-gray-400"}`}>{action.desc}</p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Recent Activity</h2>
          <Link href="/history" className="text-sm text-primary hover:underline font-medium flex items-center gap-1">
            View All <ChevronRight size={14} />
          </Link>
        </div>
        <div className="space-y-3">
          {uploads.slice(0, 8).map((u) => (
            <motion.div
              key={u.id}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              className="card flex justify-between items-center py-4 hover:border-primary/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/30 rounded-lg">
                  <Cpu size={16} className="text-blue-500" />
                </div>
                <div>
                  <div className="font-medium text-sm">{u.file_name}</div>
                  <div className="text-xs text-gray-400">{new Date(u.created_at).toLocaleString()}</div>
                </div>
              </div>
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                u.status === "completed"
                  ? "bg-green-50 dark:bg-green-950/30 text-green-600 dark:text-green-400"
                  : u.status === "failed"
                  ? "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400"
                  : "bg-yellow-50 dark:bg-yellow-950/30 text-yellow-600 dark:text-yellow-400"
              }`}>
                {u.status}
              </span>
            </motion.div>
          ))}
          {uploads.length === 0 && (
            <div className="card text-center py-12 text-gray-400 space-y-3">
              <Upload size={32} className="mx-auto opacity-40" />
              <p className="text-sm">No uploads yet. Upload your first fabric image to get started!</p>
              <Link href="/upload" className="btn-primary inline-block text-sm">Start Upload</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
