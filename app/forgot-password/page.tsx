"use client";
import { useState } from "react";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setLoading(false);
      if (res.ok) setSent(true);
      else {
        const json = await res.json();
        setError(json?.error || "Request failed.");
      }
    } catch (err: any) {
      setLoading(false);
      setError(err?.message || "Request failed.");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-20">
      <h1 className="text-3xl font-bold mb-6 text-center">Reset Password</h1>
      {sent ? (
        <div className="card text-center space-y-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            ✅ Reset request received for <strong>{email}</strong>.
          </p>
          <p className="text-xs text-gray-400">
            (Running in offline mode — contact your administrator to reset your password manually.)
          </p>
          <Link href="/login" className="btn-primary inline-block text-sm">Back to Login</Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="card space-y-4">
          <input className="input" placeholder="Your account email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button disabled={loading} className="btn-primary w-full">
            {loading ? "Sending…" : "Send Reset Link"}
          </button>
        </form>
      )}
    </div>
  );
}
