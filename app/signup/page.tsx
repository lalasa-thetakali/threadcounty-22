"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignUp() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const json = await res.json();
      setLoading(false);
      if (!res.ok) {
        setError(json?.error || "Failed to create account.");
      } else {
        // In local mode accounts are auto-confirmed — go straight to dashboard
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
      <h1 className="text-3xl font-bold mb-2 text-center">Create your account</h1>
      <p className="text-center text-sm text-gray-500 mb-8">Start analysing fabrics with AI — it's free.</p>
      <form onSubmit={handleSubmit} className="card space-y-4">
        <input className="input" placeholder="Full Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="input" placeholder="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input" placeholder="Password (min 6 chars)" type="password" required minLength={6} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
        <button disabled={loading} className="btn-primary w-full">{loading ? "Creating account…" : "Sign Up"}</button>
      </form>
      <p className="text-center text-sm text-gray-500 mt-4">Already have an account? <Link href="/login" className="text-primary font-medium">Login</Link></p>
    </div>
  );
}
