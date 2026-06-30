"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  User, Camera, Lock, Trash2, Upload, FileText, CreditCard,
  CheckCircle, AlertTriangle, Clock, Loader2
} from "lucide-react";

const PLAN_LIMITS: Record<string, number> = {
  free: 10,
  student: 100,
  professional: 1024,
  enterprise: 10240,
};

function ActivityIcon({ type }: { type: string }) {
  const cls = "shrink-0 mt-0.5";
  if (type === "upload") return <Upload size={14} className={`text-blue-500 ${cls}`} />;
  if (type === "report") return <FileText size={14} className={`text-green-500 ${cls}`} />;
  if (type === "subscription") return <CreditCard size={14} className={`text-purple-500 ${cls}`} />;
  return <CheckCircle size={14} className={`text-primary ${cls}`} />;
}

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [name, setName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState<"success" | "error">("success");
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [uploads, setUploads] = useState<any[]>([]);
  const [activityLoading, setActivityLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      // Load profile
      const profileRes = await fetch("/api/user/profile");
      if (profileRes.status === 401) { router.push("/login"); return; }
      if (profileRes.ok) {
        const json = await profileRes.json();
        setUser({ id: json.profile.id, email: json.profile.email });
        setProfile(json.profile);
        setName(json.profile.full_name || "");
      }
      // Load activity
      try {
        const actRes = await fetch("/api/user/activity");
        if (actRes.ok) {
          const json = await actRes.json();
          setUploads(json.uploads || []);
        }
      } catch (e) { /* silent */ }
      setActivityLoading(false);
    })();
  }, [router]);

  const showMsg = (text: string, type: "success" | "error" = "success") => {
    setMsg(text); setMsgType(type);
    setTimeout(() => setMsg(""), 4000);
  };

  const updateProfile = async () => {
    setSavingProfile(true);
    const res = await fetch("/api/user/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: name }),
    });
    setSavingProfile(false);
    if (res.ok) {
      showMsg("Profile updated successfully.");
      setProfile((p: any) => ({ ...p, full_name: name }));
    } else {
      const json = await res.json();
      showMsg(json.error || "Failed to update profile.", "error");
    }
  };

  const changePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      showMsg("Password must be at least 6 characters.", "error"); return;
    }
    setSavingPassword(true);
    const res = await fetch("/api/user/change-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password: newPassword }),
    });
    setSavingPassword(false);
    if (res.ok) { showMsg("Password updated successfully."); setNewPassword(""); }
    else { const json = await res.json(); showMsg(json.error || "Failed to change password.", "error"); }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      showMsg("Only JPG/PNG images allowed.", "error"); return;
    }
    if (file.size > 2 * 1024 * 1024) { showMsg("Avatar must be under 2MB.", "error"); return; }
    setAvatarLoading(true);
    const formData = new FormData();
    formData.append("avatar", file);
    const res = await fetch("/api/user/avatar", { method: "POST", body: formData });
    if (res.ok) {
      const json = await res.json();
      setProfile((p: any) => ({ ...p, avatar_url: json.avatar_url }));
      showMsg("Profile picture updated!");
    } else {
      const json = await res.json();
      showMsg(json.error || "Failed to upload avatar.", "error");
    }
    setAvatarLoading(false);
  };

  const deleteAccount = async () => {
    if (!confirm("This will permanently delete your account and all your data. This cannot be undone. Are you sure?")) return;
    await fetch("/api/admin/delete-user", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
    window.location.href = "/";
  };

  if (!user) return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="animate-spin text-primary" size={32} />
    </div>
  );

  const storageLimitMb = PLAN_LIMITS[profile?.plan || "free"];
  const storageUsedMb = uploads.reduce((a: number, u: any) => a + (u.file_size || 0), 0) / (1024 * 1024);
  const storagePercent = Math.min(100, (storageUsedMb / storageLimitMb) * 100);

  // Build activity list from uploads
  const activities = uploads.map((u: any) => ({
    id: u.id,
    type: "upload",
    title: u.file_name || "Fabric uploaded",
    description: `Status: ${u.status} · ${(u.file_size / 1024).toFixed(0)} KB`,
    date: u.created_at,
  }));

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-extrabold mb-1">Profile Settings</h1>
        <p className="text-sm text-gray-500">Manage your account, avatar, password and activity.</p>
      </motion.div>

      {/* Message banner */}
      {msg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
          className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium ${msgType === "success" ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-900" : "bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-900"}`}
        >
          {msgType === "success" ? <CheckCircle size={16} /> : <AlertTriangle size={16} />}
          {msg}
        </motion.div>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {/* Left: Avatar + Storage */}
        <div className="space-y-6">
          {/* Avatar Card */}
          <div className="card text-center space-y-4">
            <div className="relative inline-block mx-auto">
              {profile?.avatar_url ? (
                <img src={profile.avatar_url} alt="avatar" className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg mx-auto" />
              ) : (
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto border-4 border-white dark:border-gray-800 shadow-lg">
                  <User size={32} className="text-primary" />
                </div>
              )}
              <button
                onClick={() => fileRef.current?.click()}
                disabled={avatarLoading}
                className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-md hover:opacity-90 transition border-2 border-white dark:border-gray-900"
              >
                {avatarLoading ? <Loader2 size={12} className="animate-spin" /> : <Camera size={12} />}
              </button>
              <input ref={fileRef} type="file" accept="image/jpeg,image/png" className="hidden" onChange={handleAvatarChange} />
            </div>
            <div>
              <p className="font-bold text-lg">{profile?.full_name || "Unnamed User"}</p>
              <p className="text-xs text-gray-400">{user.email}</p>
              <span className="inline-block mt-2 px-2.5 py-0.5 text-xs font-semibold bg-primary/10 text-primary rounded-full capitalize">
                {profile?.plan || "free"} plan
              </span>
            </div>
            <p className="text-[10px] text-gray-400">Click the camera icon to upload a new profile photo (JPG/PNG, max 2MB)</p>
          </div>

          {/* Storage Usage */}
          <div className="card space-y-3">
            <h3 className="font-semibold text-sm flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary" />
              Storage Usage
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-gray-500">
                <span>{storageUsedMb.toFixed(1)} MB used</span>
                <span>{storageLimitMb >= 1024 ? `${storageLimitMb / 1024} GB` : `${storageLimitMb} MB`} limit</span>
              </div>
              <div className="w-full bg-gray-100 dark:bg-gray-800 rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${storagePercent > 80 ? "bg-red-500" : storagePercent > 50 ? "bg-yellow-500" : "bg-primary"}`}
                  style={{ width: `${storagePercent}%` }}
                />
              </div>
              <p className="text-[10px] text-gray-400">{storagePercent.toFixed(0)}% of your {profile?.plan || "free"} plan storage used.</p>
            </div>
          </div>
        </div>

        {/* Right: Settings Forms */}
        <div className="md:col-span-2 space-y-6">
          {/* Update Profile */}
          <div className="card space-y-4">
            <h2 className="font-bold flex items-center gap-2 text-lg">
              <User size={18} className="text-primary" /> Update Profile
            </h2>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">Full Name</label>
                <input className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">Email Address</label>
                <input className="input opacity-60 cursor-not-allowed" value={user.email} disabled />
                <p className="text-[10px] text-gray-400">Email cannot be changed here. Contact support.</p>
              </div>
              <button onClick={updateProfile} disabled={savingProfile} className="btn-primary flex items-center gap-2">
                {savingProfile ? <Loader2 size={14} className="animate-spin" /> : null}
                Save Changes
              </button>
            </div>
          </div>

          {/* Change Password */}
          <div className="card space-y-4">
            <h2 className="font-bold flex items-center gap-2 text-lg">
              <Lock size={18} className="text-primary" /> Change Password
            </h2>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">New Password (min. 6 characters)</label>
                <input className="input" type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
              </div>
              <button onClick={changePassword} disabled={savingPassword} className="btn-primary flex items-center gap-2">
                {savingPassword ? <Loader2 size={14} className="animate-spin" /> : null}
                Update Password
              </button>
            </div>
          </div>

          {/* Activity Timeline */}
          <div className="card space-y-4">
            <h2 className="font-bold flex items-center gap-2 text-lg">
              <Clock size={18} className="text-primary" /> Upload Activity
            </h2>
            {activityLoading ? (
              <div className="flex items-center gap-2 text-sm text-gray-400 py-4">
                <Loader2 size={16} className="animate-spin" /> Loading activity...
              </div>
            ) : activities.length === 0 ? (
              <p className="text-sm text-gray-400 py-4 text-center">No activity yet. Start by uploading a fabric image!</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
                {activities.slice(0, 20).map((act: any) => (
                  <div key={act.id} className="flex items-start gap-3 text-sm border-b border-gray-50 dark:border-gray-800 pb-3 last:border-0">
                    <ActivityIcon type={act.type} />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 dark:text-gray-200 truncate">{act.title}</p>
                      <p className="text-xs text-gray-500 truncate">{act.description}</p>
                    </div>
                    <span className="text-[10px] text-gray-400 shrink-0 whitespace-nowrap">
                      {new Date(act.date).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Danger Zone */}
          <div className="card border border-red-100 dark:border-red-900/30 space-y-3">
            <h2 className="font-bold flex items-center gap-2 text-red-500">
              <AlertTriangle size={18} /> Danger Zone
            </h2>
            <p className="text-xs text-gray-500">Permanently delete your account, all fabric uploads, AI reports, and profile data. This action cannot be undone.</p>
            <button onClick={deleteAccount} className="flex items-center gap-2 border border-red-500 text-red-500 px-5 py-2.5 rounded-lg font-medium hover:bg-red-50 dark:hover:bg-red-950/20 transition text-sm">
              <Trash2 size={14} /> Delete My Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
