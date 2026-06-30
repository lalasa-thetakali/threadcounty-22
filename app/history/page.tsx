"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Trash2, Download, Loader2, History, UploadCloud } from "lucide-react";
import { downloadFabricReport } from "@/lib/pdfReport";

export default function HistoryPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [query, setQuery] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const load = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/report");
      if (res.status === 401) { router.push("/login"); return; }
      const json = await res.json();
      setReports(json.reports || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm("Are you sure you want to delete this report? This will permanently delete the uploaded fabric image.")) return;
    try {
      const res = await fetch(`/api/report?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setReports((r) => r.filter((x) => x.id !== id));
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete report.");
      }
    } catch (e) {
      console.error(e);
      alert("Failed to connect to delete endpoint.");
    }
  };

  const downloadPDF = (r: any) => downloadFabricReport(r);

  const filtered = reports.filter((r) =>
    r.fabric_type?.toLowerCase().includes(query.toLowerCase()) &&
    (filterType === "all" || r.fabric_type === filterType)
  );
  const types = Array.from(new Set(reports.map((r) => r.fabric_type)));

  return (
    <div className="max-w-5xl mx-auto px-4 py-16">
      <div className="flex items-center gap-3 mb-2">
        <History size={28} className="text-primary" />
        <h1 className="text-3xl font-bold">Upload History</h1>
      </div>
      <p className="text-gray-500 mb-8 text-sm">All your past fabric analyses in one place.</p>

      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 text-gray-400" size={16} />
          <input className="input pl-9" placeholder="Search by fabric type..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <select className="input w-48" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
          <option value="all">All Types</option>
          {types.map((t) => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-primary" size={28} />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 space-y-3">
          <UploadCloud size={48} className="text-gray-300 mx-auto" />
          <p className="text-gray-500 font-medium">No analysis reports found.</p>
          <Link href="/upload" className="btn-primary inline-flex items-center gap-2 text-sm">
            <UploadCloud size={16} /> Upload Your First Fabric
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div key={r.id} className="card flex justify-between items-center hover:border-primary/30 transition-colors">
              <div>
                <Link href={`/results/${r.id}`} className="font-semibold hover:text-primary transition-colors">
                  {r.fabric_type}
                </Link>
                <div className="text-xs text-gray-400 mt-0.5">
                  {new Date(r.created_at).toLocaleString()} · Confidence: {(r.confidence * 100).toFixed(0)}% · Density: {r.thread_density} t/cm²
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => downloadPDF(r)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg"
                  title="Download PDF"
                >
                  <Download size={16} />
                </button>
                <button
                  onClick={() => remove(r.id)}
                  className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg text-red-500"
                  title="Delete report"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
