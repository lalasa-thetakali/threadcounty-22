"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Upload, Cpu, FileCheck, Users, Star, ArrowRight,
  CheckCircle, Shield, Zap, TrendingUp
} from "lucide-react";

const features = [
  { icon: Upload, title: "Drag & Drop Upload", desc: "Upload fabric images in JPG, PNG, or JPEG instantly with live preview and progress." },
  { icon: Cpu, title: "AI-Powered Analysis", desc: "Thread density, warp/weft count, and fabric type delivered in under 10 seconds." },
  { icon: FileCheck, title: "Downloadable Reports", desc: "Export professional branded PDF reports ready for QC documentation." },
  { icon: Users, title: "Built for Teams", desc: "Manufacturers, researchers, students and QC professionals in one platform." },
];

const steps = [
  { num: "01", title: "Upload Image", desc: "Drag & drop a close-up fabric photograph." },
  { num: "02", title: "AI Analyzes", desc: "Our computer vision model processes the weave structure." },
  { num: "03", title: "Review Report", desc: "Get instant thread density, fabric type, and quality score." },
  { num: "04", title: "Download & Share", desc: "Export branded PDF or share a direct link." },
];

const testimonials = [
  { name: "Anita Verma", role: "QC Manager, Surat Textiles", text: "ThreadCounty cut our manual inspection time by 70%. The accuracy is remarkable.", rating: 5 },
  { name: "Rahul Mehta", role: "Textile Engineering Student, IIT", text: "Perfect tool for my thesis on weave density analysis. The PDF reports are publication-ready.", rating: 5 },
  { name: "Sophia Lee", role: "Independent Researcher, UK", text: "I've tested 12 fabric QC tools. ThreadCounty delivers the cleanest structured data output.", rating: 5 },
];

const stats = [
  { value: "10K+", label: "Images Analyzed", icon: TrendingUp },
  { value: "500+", label: "Active Users", icon: Users },
  { value: "98%", label: "Accuracy Rate", icon: Shield },
  { value: "4.9★", label: "User Rating", icon: Star },
];

const benefits = [
  "No manual counting needed", "Works on any fabric type", "JPEG/PNG/JPG support",
  "Branded PDF reports", "Dark & light mode", "Secure Supabase storage",
];

const faqs = [
  { q: "Is mock or real AI used?", a: "ThreadCounty uses the Google Gemini Vision API for real analysis. If no API key is configured, a highly realistic mock fallback is used — both produce identical report formats." },
  { q: "What image formats are supported?", a: "JPG, JPEG, and PNG files up to 10MB. For best results, use macro photos with at least 500×500 pixel resolution." },
  { q: "Can I download my reports?", a: "Yes. Every analysis generates a downloadable branded PDF from the Results page and the History page." },
  { q: "Do I need to create an account?", a: "You need an account to upload fabric images, view reports, and access history. Sign up is free and takes 30 seconds." },
];

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    fetch("/api/dashboard").then((res) => {
      if (res.ok) {
        router.replace("/dashboard");
      }
    });
  }, [router]);

  return (
    <div className="overflow-hidden">
      {/* ─── Hero ─── */}
      <section className="relative max-w-7xl mx-auto px-4 pt-20 pb-28 grid md:grid-cols-2 gap-12 items-center">
        {/* BG glow */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 right-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold mb-6 border border-primary/10">
            <Zap size={12} /> AI-Powered Textile Intelligence
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight mb-5 tracking-tight">
            Analyze Fabric Weaves with{" "}
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">AI Precision</span>
          </h1>
          <p className="text-gray-500 text-lg mb-8 leading-relaxed max-w-lg">
            Upload a fabric photograph and receive instant thread density counts, weave type identification, quality scores, and downloadable inspection reports — powered by computer vision.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link href="/signup" className="btn-primary flex items-center gap-2 text-base px-6 py-3 shadow-lg shadow-primary/20">
              Get Started Free <ArrowRight size={16} />
            </Link>
            <Link href="/upload" className="btn-outline flex items-center gap-2 text-base px-6 py-3">
              Try Upload Now
            </Link>
          </div>
          <div className="flex items-center gap-3 mt-8">
            {benefits.slice(0, 3).map((b) => (
              <span key={b} className="flex items-center gap-1.5 text-xs text-gray-500">
                <CheckCircle size={12} className="text-green-500 shrink-0" /> {b}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.15 }}
          className="card aspect-[4/3] flex flex-col items-center justify-center gap-4 bg-gradient-to-br from-primary/5 via-white to-accent/5 dark:from-primary/10 dark:via-gray-900 dark:to-accent/10 border-2 border-dashed border-primary/15 relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-5">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs><pattern id="fabric-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern></defs>
              <rect width="100%" height="100%" fill="url(#fabric-grid)" />
            </svg>
          </div>
          <div className="relative z-10 text-center space-y-3 px-8">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary to-accent rounded-2xl flex items-center justify-center shadow-xl">
              <Cpu className="text-white" size={36} />
            </div>
            <p className="font-bold text-lg">AI Analysis Ready</p>
            <div className="grid grid-cols-2 gap-2 text-left">
              {["Thread Density: 180", "Warp Count: 92", "Weft Count: 88", "Confidence: 97%"].map((l) => (
                <div key={l} className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm text-xs font-mono px-2.5 py-1.5 rounded-lg border border-gray-100 dark:border-gray-800">
                  {l}
                </div>
              ))}
            </div>
            <span className="inline-block text-xs px-3 py-1 bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 rounded-full font-semibold border border-green-100 dark:border-green-900">
              ✓ Cotton Plain Weave Detected
            </span>
          </div>
        </motion.div>
      </section>

      {/* ─── Stats ─── */}
      <section className="bg-primary py-12">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="text-3xl font-extrabold text-white">{s.value}</div>
              <div className="text-sm text-white/70 mt-1">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Features ─── */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">Why ThreadCounty?</h2>
          <p className="text-gray-500 max-w-md mx-auto text-sm">Built for precision, speed, and ease-of-use across the textile industry.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-6">
          {features.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              whileHover={{ y: -4 }}
              className="card group hover:border-primary/20 hover:shadow-md transition-all duration-300">
              <div className="p-3 bg-primary/10 group-hover:bg-primary group-hover:text-white rounded-xl w-fit mb-4 transition-all duration-300">
                <f.icon className="text-primary group-hover:text-white transition-colors" size={22} />
              </div>
              <h3 className="font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Benefits ─── */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-16">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl font-extrabold">Everything You Need</h2>
          <div className="flex flex-wrap gap-3 justify-center">
            {benefits.map((b) => (
              <span key={b} className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-900 rounded-full text-sm border border-gray-100 dark:border-gray-800 shadow-sm font-medium">
                <CheckCircle size={14} className="text-green-500" /> {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ─── How It Works ─── */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl md:text-4xl font-extrabold mb-3">How It Works</h2>
          <p className="text-gray-500 text-sm">From photo to report in under 30 seconds.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8 relative">
          <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
          {steps.map((s, i) => (
            <motion.div key={s.num} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12 }}
              className="text-center relative">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-primary to-accent text-white flex items-center justify-center font-extrabold text-xl mb-4 shadow-lg shadow-primary/20">
                {s.num}
              </div>
              <h3 className="font-bold mb-2">{s.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Testimonials ─── */}
      <section className="bg-gray-50 dark:bg-gray-900/50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-extrabold text-center mb-14">Trusted by Industry Professionals</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4 }}
                className="card hover:border-primary/20 hover:shadow-md transition-all duration-300">
                <div className="flex gap-0.5 text-yellow-400 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => <Star key={j} size={14} fill="currentColor" />)}
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-5 leading-relaxed italic">"{t.text}"</p>
                <div className="flex items-center gap-3 border-t border-gray-50 dark:border-gray-800 pt-4">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-primary font-bold text-sm">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-sm">{t.name}</div>
                    <div className="text-xs text-gray-400">{t.role}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="max-w-3xl mx-auto px-4 py-20">
        <h2 className="text-3xl font-extrabold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="card group cursor-pointer border hover:border-primary/20 transition-colors">
              <summary className="font-semibold text-sm list-none flex justify-between items-center gap-4">
                {f.q}
                <span className="text-gray-400 group-open:rotate-180 transition-transform shrink-0">▼</span>
              </summary>
              <p className="text-sm text-gray-500 mt-3 pt-3 border-t border-gray-50 dark:border-gray-800 leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-gradient-to-r from-primary to-accent py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs><pattern id="cta-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1"/>
            </pattern></defs>
            <rect width="100%" height="100%" fill="url(#cta-grid)" />
          </svg>
        </div>
        <div className="relative z-10 max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">Ready to Analyze Your Fabric?</h2>
          <p className="text-white/80 mb-8 text-sm">Join 500+ textile professionals already using ThreadCounty for precision quality control.</p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link href="/signup" className="bg-white text-primary px-8 py-3 rounded-xl font-bold hover:shadow-lg transition shadow-md">
              Start Free Today
            </Link>
            <Link href="/pricing" className="border border-white/40 text-white px-8 py-3 rounded-xl font-bold hover:bg-white/10 transition">
              View Pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
