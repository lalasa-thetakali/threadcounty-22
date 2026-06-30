import jsPDF from "jspdf";

export function downloadFabricReport(report: any) {
  if (!report) return;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageW = 210;
  const margin = 14;
  const contentW = pageW - margin * 2;

  // ── Header band ───────────────────────────────────────────────────────────
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, pageW, 42, "F");

  // accent stripe
  doc.setFillColor(6, 182, 212);
  doc.rect(0, 38, pageW, 4, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("ThreadCounty", margin, 17);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("AI-Powered Fabric Analysis Report", margin, 26);

  const dateStr = report.created_at ? new Date(report.created_at).toLocaleString() : new Date().toLocaleString();
  doc.setFontSize(8);
  doc.setTextColor(200, 200, 255);
  doc.text(`Generated: ${dateStr}`, margin, 34);

  if (report.analysis_method === "gemini") {
    doc.setFillColor(139, 92, 246);
    doc.roundedRect(pageW - 60, 8, 44, 10, 2, 2, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.text("⚡ GEMINI VISION AI", pageW - 58, 14.5);
  }

  // ── Section helper ────────────────────────────────────────────────────────
  let y = 54;

  function sectionHeader(title: string) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(79, 70, 229);
    doc.text(title.toUpperCase(), margin, y);
    doc.setDrawColor(79, 70, 229, 0.3);
    doc.setLineWidth(0.3);
    doc.line(margin + doc.getTextWidth(title.toUpperCase()) + 3, y - 0.5, margin + contentW, y - 0.5);
    y += 7;
  }

  function row(label: string, value: string, highlight = false) {
    if (y > 265) { doc.addPage(); y = 20; }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 110);
    doc.text(label, margin, y);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(highlight ? 79 : 25, highlight ? 70 : 25, highlight ? 229 : 25);
    doc.text(String(value ?? "—"), margin + 52, y);

    doc.setDrawColor(235, 235, 240);
    doc.setLineWidth(0.2);
    doc.line(margin, y + 3.5, margin + contentW, y + 3.5);
    y += 11;
  }

  // ── Identification ────────────────────────────────────────────────────────
  sectionHeader("Fabric Identification");
  row("Fabric Type", report.fabric_type ?? "Unknown", true);
  row("Fiber Composition", report.fiber_composition ?? "Not determined");
  row("Weave Pattern", report.pattern ?? "Unknown");
  row("Color", report.color ?? "Not determined");
  row("Texture", report.texture ?? "Not determined");
  y += 4;

  // ── Thread Metrics ────────────────────────────────────────────────────────
  sectionHeader("Thread Density Metrics");
  row("Thread Density", `${report.thread_density ?? 0} threads / cm²`, true);
  row("Warp Count", `${report.warp_count ?? 0} threads (vertical)`);
  row("Weft Count", `${report.weft_count ?? 0} threads (horizontal)`);
  y += 4;

  // ── Quality Assessment ────────────────────────────────────────────────────
  sectionHeader("Quality Assessment");
  const grade = report.quality_grade ?? "N/A";
  const confidence = `${((report.confidence ?? 0) * 100).toFixed(1)}%`;
  row("Quality Grade", grade, true);
  row("AI Confidence", confidence, true);
  row("Report ID", report.id?.slice(0, 24) ?? "—");
  y += 4;

  // ── Recommended Applications ──────────────────────────────────────────────
  const uses: string[] = Array.isArray(report.recommended_use) ? report.recommended_use : [];
  if (uses.length > 0) {
    sectionHeader("Recommended Applications");
    uses.forEach((u, i) => {
      if (y > 265) { doc.addPage(); y = 20; }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(40, 40, 40);
      doc.text(`• ${u}`, margin + 3, y);
      y += 8;
    });
    y += 4;
  }

  // ── Defects ───────────────────────────────────────────────────────────────
  const defects: string[] = Array.isArray(report.defects_detected) ? report.defects_detected : [];
  sectionHeader("Quality Control — Defect Inspection");
  if (defects.length === 0) {
    if (y > 265) { doc.addPage(); y = 20; }
    doc.setFillColor(236, 253, 245);
    doc.roundedRect(margin, y - 4, contentW, 10, 2, 2, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.setTextColor(5, 150, 105);
    doc.text("✓  PASS — No structural defects detected in fabric sample.", margin + 3, y + 2.5);
    y += 14;
  } else {
    defects.forEach(d => {
      if (y > 265) { doc.addPage(); y = 20; }
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9.5);
      doc.setTextColor(180, 60, 20);
      doc.text(`⚠  ${d}`, margin + 3, y);
      y += 9;
    });
    y += 4;
  }

  // ── AI Recommendations ────────────────────────────────────────────────────
  const suggestions: string[] = Array.isArray(report.ai_suggestions)
    ? report.ai_suggestions
    : [String(report.ai_suggestions ?? "No suggestions available.")];

  if (y > 220) { doc.addPage(); y = 20; }
  sectionHeader("AI Engineering Recommendations");
  suggestions.forEach((s, i) => {
    if (y > 265) { doc.addPage(); y = 20; }
    const lines = doc.splitTextToSize(`${i + 1}. ${s}`, contentW - 6);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(40, 40, 50);
    doc.text(lines, margin + 3, y);
    y += lines.length * 5.5 + 3;
  });

  // ── Footer ────────────────────────────────────────────────────────────────
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFillColor(248, 248, 252);
    doc.rect(0, 282, pageW, 15, "F");
    doc.setFontSize(7.5);
    doc.setTextColor(160, 160, 170);
    doc.setFont("helvetica", "normal");
    doc.text(
      `ThreadCounty AI · Report ID: ${report.id?.slice(0, 20) ?? ""}  ·  Page ${i} of ${pageCount}`,
      margin, 290
    );
    doc.text("threadcounty.ai", pageW - margin, 290, { align: "right" });
  }

  doc.save(`threadcounty-report-${report.id?.slice(0, 8) ?? "report"}.pdf`);
}
