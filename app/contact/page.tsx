"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, Twitter, Linkedin, Github, Send, CheckCircle } from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Please fill out all fields.");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      setLoading(false);
      if (res.ok) {
        setSent(true);
        setForm({ name: "", email: "", message: "" });
      } else {
        const json = await res.json();
        setError(json?.error || "Failed to send message. Try again later.");
      }
    } catch (err) {
      setLoading(false);
      setError("Network error. Please try again.");
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Get in Touch
        </h1>
        <p className="text-gray-500 text-sm">
          Have questions about our thread density analysis? Interested in an Enterprise plan? Send us a message and our team will get right back to you.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-10 items-stretch">
        {/* Left Side: Contact Information & Mock Map */}
        <div className="space-y-8 flex flex-col justify-between">
          <div className="card space-y-6 flex-1">
            <h3 className="font-bold text-xl mb-4">Contact Information</h3>
            
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="p-2.5 bg-primary/10 rounded-lg text-primary shrink-0">
                  <Mail size={18} />
                </div>
                <div>
                  <div className="font-medium text-gray-800 dark:text-gray-200">Email Support</div>
                  <div>support@threadcounty.ai</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="p-2.5 bg-primary/10 rounded-lg text-primary shrink-0">
                  <Phone size={18} />
                </div>
                <div>
                  <div className="font-medium text-gray-800 dark:text-gray-200">Phone Support</div>
                  <div>+91 98765 43210</div>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="p-2.5 bg-primary/10 rounded-lg text-primary shrink-0">
                  <MapPin size={18} />
                </div>
                <div>
                  <div className="font-medium text-gray-800 dark:text-gray-200">Headquarters</div>
                  <div>Weave Plaza, Sector 62, Noida, UP, India</div>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-6">
              <h4 className="font-semibold text-sm mb-3">Connect With Us</h4>
              <div className="flex gap-3">
                <a href="#" className="p-2 bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-primary rounded-lg transition-colors">
                  <Twitter size={18} />
                </a>
                <a href="#" className="p-2 bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-primary rounded-lg transition-colors">
                  <Linkedin size={18} />
                </a>
                <a href="#" className="p-2 bg-gray-50 dark:bg-gray-800 text-gray-500 hover:text-primary rounded-lg transition-colors">
                  <Github size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Styled Mock Map Card */}
          <div className="card h-48 relative overflow-hidden bg-slate-100 dark:bg-slate-900 border border-gray-100 dark:border-gray-800 flex items-center justify-center p-0">
            {/* SVG Abstract Grid representing a Map */}
            <svg className="absolute inset-0 w-full h-full opacity-35 dark:opacity-20" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <defs>
                <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
                  <path d="M 30 0 L 0 0 0 30" fill="none" stroke="currentColor" strokeWidth="0.8" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <path d="M 0 60 Q 150 150 300 80 T 600 120" fill="none" stroke="currentColor" strokeWidth="3" />
              <path d="M 120 0 Q 200 200 180 400" fill="none" stroke="currentColor" strokeWidth="2" />
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10 flex flex-col items-center">
              <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-900 animate-bounce">
                <MapPin size={18} />
              </div>
              <span className="mt-2 text-xs font-semibold bg-white/90 dark:bg-gray-950/90 backdrop-blur-sm px-2.5 py-1 rounded-full shadow border border-gray-100 dark:border-gray-800">
                Noida, India
              </span>
            </div>
            <div className="absolute bottom-2 left-2 text-[10px] text-gray-400 bg-white/60 dark:bg-gray-950/60 px-1.5 py-0.5 rounded">
              Leaflet Map (Mock Mode)
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="card flex flex-col justify-center">
          <h3 className="font-bold text-xl mb-6">Send Us a Message</h3>
          {sent ? (
            <div className="text-center py-10 space-y-4">
              <CheckCircle className="mx-auto text-primary" size={56} />
              <h4 className="font-bold text-lg">Message Sent Successfully!</h4>
              <p className="text-sm text-gray-500 max-w-sm mx-auto">
                Thank you for reaching out to ThreadCounty. Our support staff has received your inquiry and will respond within 24 hours.
              </p>
              <button onClick={() => setSent(false)} className="btn-outline text-xs py-2 px-4 inline-block">
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">Your Name</label>
                <input
                  className="input bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                  placeholder="Vikram Sharma"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">Email Address</label>
                <input
                  className="input bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                  placeholder="vikram@textiles.com"
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-500">Message</label>
                <textarea
                  className="input bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800"
                  rows={5}
                  placeholder="How can we help your business inspect fabrics?"
                  required
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                />
              </div>

              {error && <p className="text-red-500 text-sm font-medium">{error}</p>}

              <button
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    <Send size={16} /> Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
