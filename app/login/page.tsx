"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password })
      });
      const json = await res.json();
      setLoading(false);
      if (!res.ok) {
        setError(json?.error || "Failed to log in.");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || String(err));
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold mb-6 text-center">Welcome back</h1>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <input className="input" placeholder="Email" type="email" required value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})}/>
        <input className="input" placeholder="Password" type="password" required value={form.password} onChange={(e)=>setForm({...form,password:e.target.value})}/>
        <div className="flex justify-between text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={remember} onChange={(e)=>setRemember(e.target.checked)}/> Remember me</label>
          <Link href="/forgot-password" className="text-primary">Forgot password?</Link>
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <button disabled={loading} className="btn-primary w-full">{loading ? "Logging in..." : "Login"}</button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-4">No account? <Link href="/signup" className="text-primary">Sign up</Link></p>
    </div>
  );
}
