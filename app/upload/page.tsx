"use client";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud, X, CheckCircle } from "lucide-react";

const MAX_SIZE_MB = 10;

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [progressLabel, setProgressLabel] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const onFile = (f: File) => {
    setError("");
    if (!["image/jpeg", "image/png", "image/jpg"].includes(f.type)) {
      setError("Only JPG, JPEG, PNG files are allowed.");
      return;
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File must be under ${MAX_SIZE_MB}MB.`);
      return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files[0]) onFile(e.dataTransfer.files[0]);
  }, []);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setProgress(5);
    setProgressLabel("Validating upload…");
    setError("");

    try {
      // Step 1 — Validate limits & get path
      const checkRes = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileName: file.name, fileSize: file.size, fileType: file.type }),
      });
      const checkJson = await checkRes.json();
      if (!checkRes.ok) {
        setError(checkJson.error || "Upload validation failed.");
        setLoading(false);
        return;
      }
      const { path: filePath } = checkJson;
      setProgress(20);
      setProgressLabel("Saving image locally…");

      // Step 2 — Save file locally via mock-upload route
      const formData = new FormData();
      formData.append("file", file);
      formData.append("path", filePath);
      const saveRes = await fetch("/api/mock-upload", { method: "POST", body: formData });
      const saveJson = await saveRes.json();
      if (!saveRes.ok) {
        setError(saveJson.error || "Failed to save file.");
        setLoading(false);
        return;
      }
      const fileUrl = saveJson.url as string;
      setProgress(45);
      setProgressLabel("Recording upload…");

      // Step 3 — Save upload record to local DB
      const saveUploadRes = await fetch("/api/upload/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fileUrl, fileName: file.name, fileSize: file.size, filePath }),
      });
      const saveUploadJson = await saveUploadRes.json();
      if (!saveUploadRes.ok) {
        setError(saveUploadJson.error || "Failed to save upload record.");
        setLoading(false);
        return;
      }
      const { uploadId, userId } = saveUploadJson;
      setProgress(65);
      setProgressLabel("Running AI analysis…");

      // Step 4 — Trigger mock AI analysis
      const analyzeRes = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uploadId, imageUrl: fileUrl, userId }),
      });
      const analyzeJson = await analyzeRes.json();
      setProgress(100);
      setProgressLabel("Analysis complete!");
      setLoading(false);

      if (analyzeJson.reportId) {
        setTimeout(() => router.push(`/results/${analyzeJson.reportId}`), 600);
      } else {
        setError(analyzeJson.error || "Analysis failed.");
      }
    } catch (err: any) {
      setError(err?.message || String(err));
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-2">Upload Fabric Image</h1>
      <p className="text-gray-500 mb-8">Drag & drop or select a fabric image for AI analysis.</p>

      <div
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
        className="card border-2 border-dashed text-center py-16 cursor-pointer hover:border-primary transition-colors"
        onClick={() => !loading && document.getElementById("fileInput")?.click()}
      >
        {preview ? (
          <div className="relative inline-block">
            <img src={preview} className="max-h-64 rounded-lg mx-auto object-contain" alt="preview" />
            <button
              onClick={(e) => { e.stopPropagation(); setFile(null); setPreview(null); setProgress(0); setProgressLabel(""); }}
              className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow hover:bg-red-50"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <>
            <UploadCloud className="mx-auto text-primary mb-3" size={40} />
            <p className="font-medium">Drag & drop your fabric image here</p>
            <p className="text-sm text-gray-400">or click to browse — JPG, PNG, JPEG up to {MAX_SIZE_MB}MB</p>
          </>
        )}
        <input
          id="fileInput"
          type="file"
          accept="image/jpeg,image/png,image/jpg"
          className="hidden"
          onChange={(e) => e.target.files && onFile(e.target.files[0])}
        />
      </div>

      {error && <p className="text-red-500 text-sm mt-3 font-medium">{error}</p>}

      {loading && (
        <div className="mt-4 space-y-1">
          <p className="text-sm text-gray-500">{progressLabel}</p>
          <div className="w-full bg-gray-200 dark:bg-gray-800 rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-gray-400 text-right">{progress}%</p>
        </div>
      )}

      {progress === 100 && !loading && (
        <div className="flex items-center gap-2 text-green-600 mt-3">
          <CheckCircle size={18} />
          <span className="text-sm font-medium">Analysis complete! Redirecting…</span>
        </div>
      )}

      <button
        disabled={!file || loading}
        onClick={handleUpload}
        className="btn-primary w-full mt-6"
      >
        {loading ? "Analyzing…" : "Upload & Analyze"}
      </button>
    </div>
  );
}
