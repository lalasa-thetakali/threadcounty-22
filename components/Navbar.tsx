"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X, User, Shield, Upload, History, LayoutDashboard } from "lucide-react";

interface NavLink {
  href: string;
  label: string;
  icon?: any;
}

const publicLinks: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

const appLinks: NavLink[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/upload", label: "Upload", icon: Upload },
  { href: "/history", label: "History", icon: History },
  { href: "/pricing", label: "Plans" },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/dashboard");
      if (res.ok) {
        const json = await res.json();
        setUser(json.user);
        setProfile(json.user);
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch {
      setUser(null);
      setProfile(null);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    setUser(null);
    setProfile(null);
    setOpen(false);
    window.location.href = "/";
  };

  const navLinks = user ? appLinks : publicLinks;

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/85 dark:bg-gray-950/85 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href={user ? "/dashboard" : "/"} className="font-extrabold text-xl text-primary tracking-tight">
          Thread<span className="text-accent">County</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-1 items-center">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              {l.icon && <l.icon size={14} className="opacity-70" />}
              {l.label}
            </Link>
          ))}
          {user && profile?.role === "admin" && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 px-3 py-1.5 rounded-lg border border-orange-100 dark:border-orange-900/50 hover:opacity-80 transition ml-1"
            >
              <Shield size={12} /> Admin
            </Link>
          )}
        </nav>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {/* Theme Toggle */}
          {mounted && (
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              title="Toggle theme"
            >
              {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
            </button>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              {/* Avatar → profile */}
              <Link href="/profile" className="flex items-center gap-2 group">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt="avatar"
                    className="w-8 h-8 rounded-full object-cover border-2 border-primary/20 group-hover:border-primary/50 transition"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center border-2 border-primary/20 group-hover:border-primary/50 transition">
                    <User size={14} className="text-primary" />
                  </div>
                )}
                <span className="hidden sm:block text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-primary transition-colors">
                  {profile?.full_name?.split(" ")[0] || "Profile"}
                </span>
              </Link>
              <button
                onClick={handleSignOut}
                className="hidden sm:block text-xs font-medium text-gray-400 hover:text-red-500 transition-colors px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <Link href="/login" className="hidden sm:block text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary transition-colors">
                Login
              </Link>
              <Link href="/signup" className="btn-primary text-sm py-2 px-4">
                Sign Up
              </Link>
            </>
          )}

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            onClick={() => setOpen(!open)}
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden px-4 pb-4 border-t border-gray-100 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 flex flex-col gap-1 pt-3">
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary transition-colors py-2 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900"
            >
              {l.icon && <l.icon size={15} />}
              {l.label}
            </Link>
          ))}
          {user ? (
            <>
              {profile?.role === "admin" && (
                <Link href="/admin" onClick={() => setOpen(false)} className="flex items-center gap-2 text-sm font-semibold text-orange-500 py-2 px-2">
                  <Shield size={15} /> Admin Dashboard
                </Link>
              )}
              <Link href="/profile" onClick={() => setOpen(false)} className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary py-2 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900">
                <User size={15} /> My Profile
              </Link>
              <button
                onClick={handleSignOut}
                className="text-left text-sm font-medium text-red-400 hover:text-red-600 py-2 px-2"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" onClick={() => setOpen(false)} className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary py-2 px-2">Login</Link>
              <Link href="/signup" onClick={() => setOpen(false)} className="btn-primary text-sm text-center mt-1">Sign Up Free</Link>
            </>
          )}
        </div>
      )}
    </header>
  );
}
