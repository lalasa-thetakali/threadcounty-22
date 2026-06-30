"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { downloadFabricReport } from "@/lib/pdfReport";
import {
  Download, Share2, ArrowLeft, Loader2, Cpu, CheckCircle,
  ChevronRight, Layers, Sparkles, AlertTriangle, Palette,
  Scissors, Tag, Star, Zap, BookOpen, XCircle, Info
} from "lucide-react";

/* ── Radial progress ring ─────────────────────────────────────────────── */
function RadialProgress({ percent, size = 96, stroke = 8, color = "#4f46e5" }: {
  percent: number; size?: number; stroke?: number; color?: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="#e5e7eb" strokeWidth={stroke} fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        stroke={color} strokeWidth={stroke} fill="none"
        strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: "stroke-dashoffset 1.2s ease" }}
      />
    </svg>
  );
}

/* ── Grade badge ─────────────────────────────────────────────────────── */
function GradeBadge({ grade }: { grade?: string }) {
  const colors: Record<string, string> = {
    "A+": "bg-emerald-500 text-white",
    "A":  "bg-green-500 text-white",
    "B+": "bg-blue-500 text-white",
    "B":  "bg-sky-400 text-white",
    "C":  "bg-yellow-400 text-gray-900",
    "D":  "bg-red-500 text-white",
  };
  return (
    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-extrabold shadow-sm ${colors[grade ?? "B"] ?? "bg-gray-200 text-gray-700"}`}>
      <Star size={12} /> {grade ?? "N/A"}
    </span>
  );
}

/* ── Metric card ─────────────────────────────────────────────────────── */
function MetricCard({ label, value, sub, icon: Icon, accent }: {
  label: string; value: any; sub?: string; icon?: any; accent?: string;
}) {
  return (
    <div className="card text-center py-5 hover:border-primary/30 transition-colors group">
      {Icon && <Icon size={18} className={`mx-auto mb-2 ${accent ?? "text-primary"} opacity-70 group-hover:opacity-100 transition-opacity`} />}
      <div className="text-2xl font-extrabold text-gray-800 dark:text-gray-100">{value ?? "—"}</div>
      <div className="text-xs font-semibold text-gray-500 mt-1">{label}</div>
      {sub && <div className="text-[10px] text-gray-400 mt-0.5">{sub}</div>}
    </div>
  );
}

/* ── Info row ─────────────────────────────────────────────────────────── */
function InfoRow({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 dark:border-gray-800 last:border-0">
      <div className="p-1.5 bg-primary/8 rounded-lg shrink-0 mt-0.5">
        <Icon size={14} className="text-primary" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{label}</p>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-0.5">{value}</p>
      </div>
    </div>
  );
}

export default function ResultPage() {
  const params = useParams();
  const router = useRouter();
  const [report, setReport] = useState<any>(null);
  const [upload, setUpload] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [confidenceAnim, setConfidenceAnim] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/report?id=${params.id}`);
        const json = await res.json();
        if (!res.ok || !json.report) { setLoading(false); return; }
        const r = json.report;
        setReport(r);
        if (r.success) {
          setTimeout(() => setConfidenceAnim(Math.round((r.confidence || 0) * 100)), 400);
        }

        const actRes = await fetch("/api/user/activity");
        if (actRes.ok) {
          const { uploads } = await actRes.json();
          setUpload(uploads?.find((u: any) => u.id === r.upload_id) ?? null);
        }
      } catch (e) { console.error(e); }
      setLoading(false);
    })();
  }, [params.id]);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-3">
        <Loader2 className="animate-spin text-primary mx-auto" size={36} />
        <p className="text-sm text-gray-500 animate-pulse">Loading AI analysis…</p>
      </div>
    </div>
  );

  if (!report) return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 text-center px-4">
      <Cpu size={48} className="text-gray-300" />
      <h2 className="text-xl font-bold">Report not found</h2>
      <p className="text-gray-500 text-sm">This report may have been deleted or you don't have access.</p>
      <Link href="/history" className="btn-primary text-sm">View History</Link>
    </div>
  );

  // Handle image validation failures (Non-fabric / Low quality)
  if (report.success === false) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Link href="/history" className="flex items-center gap-1 hover:text-primary transition-colors">
            <ArrowLeft size={14} /> Back to History
          </Link>
          <ChevronRight size={12} />
          <span>Analysis Failed</span>
        </div>

        <div className="card border-l-4 border-l-red-500 space-y-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-50 dark:bg-red-950/30 text-red-500 rounded-2xl shrink-0">
              <AlertTriangle size={28} />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-gray-100">Analysis Could Not Be Performed</h1>
              <p className="text-sm text-gray-500 mt-1">
                Our AI Textile Analyst inspected the uploaded image and found issues preventing a complete analysis.
              </p>
            </div>
          </div>

          <div className="bg-red-50/50 dark:bg-red-950/10 border border-red-100 dark:border-red-900/30 rounded-xl p-4">
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">Reason for Failure:</p>
            <p className="text-sm text-red-600 dark:text-red-300 mt-1 leading-relaxed">
              {report.message}
            </p>
          </div>

          <div className="flex items-start gap-3 text-xs text-gray-500 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl">
            <Info size={16} className="shrink-0 text-primary mt-0.5" />
            <div>
              <p className="font-semibold text-gray-700 dark:text-gray-300">Tips for a successful analysis:</p>
              <ul className="list-disc pl-4 mt-1 space-y-1">
                <li>Ensure the image primarily contains textile fabric.</li>
                <li>Take a close-up macro shot so the weave/knit yarns are clearly visible.</li>
                <li>Ensure good, even lighting and avoid significant blur.</li>
              </ul>
            </div>
          </div>

          <div className="flex gap-4">
            <Link href="/upload" className="btn-primary text-sm">
              Try Another Image
            </Link>
            <Link href="/history" className="btn-outline text-sm">
              Go to History
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const confidence = Math.round((report.confidence || 0) * 100);
  const confColor = confidence >= 90 ? "#10b981" : confidence >= 75 ? "#f59e0b" : "#ef4444";
  const confLabel = confidence >= 90 ? "High Confidence" : confidence >= 75 ? "Moderate Confidence" : "Low Confidence";
  const confDesc = confidence >= 90
    ? "Results are highly reliable for quality control documentation."
    : confidence >= 75
    ? "Results are generally accurate — consider visual cross-validation."
    : "Manual cross-validation is strongly recommended.";

  const suggestions: string[] = Array.isArray(report.ai_suggestions) ? report.ai_suggestions : [report.ai_suggestions ?? ""];
  const defects: string[] = Array.isArray(report.defects_detected) ? report.defects_detected : [];
  const uses: string[] = Array.isArray(report.recommended_use) ? report.recommended_use : [];

  return (
    <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 flex-wrap">
        <Link href="/history" className="flex items-center gap-1 hover:text-primary transition-colors">
          <ArrowLeft size={14} /> Back to History
        </Link>
        <ChevronRight size={12} />
        <span>AI Analysis Report</span>
        <ChevronRight size={12} />
        <span className="text-gray-300">{report.id.slice(0, 12)}…</span>
      </div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-extrabold flex items-center gap-3">
              <Cpu size={28} className="text-primary" /> AI Fabric Analysis Report
            </h1>
            {report.analysis_method === "gemini" && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-violet-600 bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 px-2 py-0.5 rounded-full">
                <Zap size={9} /> Gemini Vision
              </span>
            )}
          </div>
          <p className="text-sm text-gray-400">
            Generated {new Date(report.created_at).toLocaleString()} · Report ID: {report.id.slice(0, 16)}
          </p>
        </div>
        <div className="flex gap-3 flex-wrap">
          <button onClick={() => downloadFabricReport(report)} className="btn-primary flex items-center gap-2 text-sm">
            <Download size={15} /> Download PDF
          </button>
        </div>
      </motion.div>

      {/* Two-column main grid */}
      <div className="grid lg:grid-cols-5 gap-8">
        {/* Left: Image + fabric info */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-2 space-y-4">
          <div className="card p-0 overflow-hidden">
            {upload?.file_url ? (
              <img src={upload.file_url} className="w-full aspect-square object-cover" alt="Fabric sample" />
            ) : (
              <div className="w-full aspect-square flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Cpu size={64} className="text-gray-200" />
              </div>
            )}
            <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800">
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">Uploaded Sample</p>
              <p className="text-sm font-semibold mt-0.5 truncate">{upload?.file_name ?? "Unknown file"}</p>
            </div>
          </div>

          <div className="card space-y-0">
            <h3 className="font-bold text-sm uppercase tracking-wide text-gray-400 mb-1 pb-3 border-b border-gray-50 dark:border-gray-800">
              Fabric Properties
            </h3>
            <InfoRow label="Fabric Structure" value={report.fabric_type ?? "Unknown"} icon={Layers} />
            <InfoRow label="Estimated Material" value={report.fiber_composition ?? "Not determined"} icon={Scissors} />
            <InfoRow label="Weave Pattern" value={report.pattern ?? "Unknown"} icon={BookOpen} />
            <InfoRow label="Image Quality" value={report.color ?? "Not determined"} icon={Tag} />
            <InfoRow label="Fabric Condition" value={report.texture ?? "Not determined"} icon={Palette} />
            <InfoRow label="Quality Grade" value={report.quality_grade ?? "N/A"} icon={Star} />
          </div>
        </motion.div>

        {/* Right: Analysis results */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="lg:col-span-3 space-y-5">
          <div className="card flex items-center gap-4">
            <div className="p-4 bg-primary/10 rounded-2xl shrink-0">
              <Layers size={28} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Identified Fabric Type</p>
              <p className="text-2xl font-extrabold text-primary leading-tight mt-0.5 truncate">{report.fabric_type} ({report.fiber_composition})</p>
              <p className="text-xs text-gray-500 mt-1">{report.pattern}</p>
            </div>
            <GradeBadge grade={report.quality_grade} />
          </div>

          {/* Confidence score */}
          <div className="card flex items-center gap-6">
            <div className="relative shrink-0">
              <RadialProgress percent={confidenceAnim} size={100} stroke={9} color={confColor} />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-extrabold leading-none" style={{ color: confColor }}>{confidence}%</span>
                <span className="text-[9px] text-gray-400 mt-0.5">confidence</span>
              </div>
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">AI Confidence</p>
              <p className="font-bold text-lg">{confLabel}</p>
              <p className="text-xs text-gray-500 mt-1 max-w-xs">{confDesc}</p>
            </div>
          </div>

          {/* Thread count metrics */}
          <div className="grid grid-cols-3 gap-3">
            <MetricCard
              label="Thread Density"
              value={report.thread_density ? `${report.thread_density} TPI` : "Unable to resolve"}
              sub="total threads"
              icon={Layers}
              accent="text-primary"
            />
            <MetricCard
              label="Warp Count"
              value={report.warp_count ? `${report.warp_count} TPI` : null}
              sub="vertical threads"
              icon={Cpu}
              accent="text-blue-500"
            />
            <MetricCard
              label="Weft Count"
              value={report.weft_count ? `${report.weft_count} TPI` : null}
              sub="horizontal threads"
              icon={Cpu}
              accent="text-cyan-500"
            />
          </div>

          {/* Defect Inspection */}
          <div className="card space-y-3">
            <h3 className="font-bold text-base flex items-center gap-2">
              {defects.length === 0
                ? <><CheckCircle size={16} className="text-emerald-500" /> No Defects Detected</>
                : <><AlertTriangle size={16} className="text-amber-500" /> Defects Detected</>
              }
            </h3>
            {defects.length === 0 ? (
              <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-100 dark:border-emerald-900 rounded-xl px-4 py-3">
                <CheckCircle size={16} />
                <span>Fabric sample passed visual inspection — no structural defects found.</span>
              </div>
            ) : (
              <ul className="space-y-2">
                {defects.map((d, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-amber-700 dark:text-amber-400">
                    <XCircle size={14} className="shrink-0 mt-0.5" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </motion.div>
      </div>

      {/* Visual Evidence / Explanations */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="card border-l-4 border-l-violet-500 space-y-4">
        <h3 className="font-bold text-lg flex items-center gap-2">
          <Sparkles size={18} className="text-violet-500" /> Visual Evidence & Explanations
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          {suggestions.map((s, i) => (
            <div key={i} className="flex items-start gap-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl px-4 py-3">
              <div className="w-6 h-6 rounded-full bg-violet-100 dark:bg-violet-950/50 flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-xs font-bold text-violet-600 dark:text-violet-400">{i + 1}</span>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{s}</p>
            </div>
          ))}
        </div>
        {report.summary && (
          <div className="bg-primary/5 dark:bg-primary/10 p-4 rounded-xl mt-3">
            <p className="text-xs font-bold text-primary uppercase tracking-wider">Analysis Summary</p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{report.summary}</p>
          </div>
        )}
      </motion.div>

      {/* Action buttons */}
      <div className="flex gap-3 flex-wrap">
        <button onClick={() => downloadFabricReport(report)} className="btn-primary flex items-center gap-2">
          <Download size={16} /> Download PDF Report
        </button>
        <Link href="/upload" className="btn-outline flex items-center gap-2">
          <Cpu size={16} /> New Analysis
        </Link>
      </div>
    </div>
  );
}
