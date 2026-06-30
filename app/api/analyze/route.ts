import { NextRequest, NextResponse } from "next/server";
import { tableInsert, tableSelectOne, tableUpdate } from "@/lib/localDb";
import { analyzeWithGemini } from "@/lib/geminiAnalyzer";

export async function POST(req: NextRequest) {
  try {
    const { uploadId, imageUrl, userId } = await req.json();
    if (!uploadId || !imageUrl || !userId) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    const upload = tableSelectOne("uploads", { id: uploadId });
    if (!upload) {
      return NextResponse.json({ error: "Upload record not found." }, { status: 404 });
    }

    // Run AI analysis
    const result = await analyzeWithGemini(imageUrl);

    if (!result.success) {
      // Image was not fabric or was too low quality
      const report = tableInsert("reports", {
        upload_id: uploadId,
        user_id: userId,
        success: false,
        fabric_detected: result.fabric_detected,
        analysis_possible: result.analysis_possible ?? false,
        message: result.message || "Analysis could not be completed.",
        analysis_method: result.analysis_method,
      });

      tableUpdate("uploads", { id: uploadId }, { status: "failed" });

      tableInsert("notifications", {
        user_id: userId,
        title: "Analysis Failed ❌",
        body: result.message || "Analysis could not be completed due to image quality or content.",
        read: false,
      });

      return NextResponse.json({ reportId: report.id });
    }

    // Successful fabric analysis
    const totalTpi = result.thread_density?.total_tpi || null;
    const warpTpi = result.thread_density?.warp_tpi || null;
    const weftTpi = result.thread_density?.weft_tpi || null;

    const report = tableInsert("reports", {
      upload_id: uploadId,
      user_id: userId,
      success: true,
      fabric_detected: true,
      analysis_possible: true,
      
      // Thread count metrics
      thread_density: totalTpi,
      warp_count: warpTpi,
      weft_count: weftTpi,

      // Fabric properties
      fabric_type: result.fabric_type,
      fiber_composition: result.estimated_material,
      pattern: result.weave_pattern,
      color: result.image_quality || "Determined from image",
      texture: result.condition || "No visible defects detected",
      
      // Validation & quality
      confidence: result.confidence,
      quality_grade: result.condition?.toLowerCase().includes("no visible defects") ? "A" : "B",
      
      // Suggestions & lists
      recommended_use: result.visual_evidence || [],
      defects_detected: result.defects || [],
      ai_suggestions: result.visual_evidence || [],
      summary: result.summary || "",
      analysis_method: result.analysis_method,
    });

    tableUpdate("uploads", { id: uploadId }, { status: "completed" });

    tableInsert("notifications", {
      user_id: userId,
      title: `Analysis Complete — ${result.estimated_material} ${result.weave_pattern} 🎯`,
      body: `Density: ${totalTpi ? `${totalTpi} threads/cm²` : "Unable to resolve"} · Confidence: ${(result.confidence! * 100).toFixed(0)}%`,
      read: false,
    });

    return NextResponse.json({ reportId: report.id });
  } catch (err: any) {
    console.error("[analyze] Error:", err);
    return NextResponse.json({ error: err.message || "Analysis failed." }, { status: 500 });
  }
}
