/**
 * geminiAnalyzer.ts
 * Real fabric analysis using Google Gemini Vision API (gemini-1.5-flash)
 * using the official Textile Fabric Analysis AI System Prompt.
 */
import { GoogleGenerativeAI, Part } from "@google/generative-ai";
import fs from "fs";
import path from "path";

export interface FabricAnalysisResult {
  success: boolean;
  fabric_detected: boolean;
  analysis_possible?: boolean;
  message?: string;
  image_quality?: string;
  fabric_type?: string;
  estimated_material?: string;
  weave_pattern?: string;
  thread_density?: {
    warp_tpi: number | null;
    weft_tpi: number | null;
    total_tpi: number | null;
  };
  condition?: string;
  defects?: string[];
  confidence?: number;
  visual_evidence?: string[];
  summary?: string;
  analysis_method: "gemini" | "mock";
}

const SYSTEM_PROMPT = `You are an expert AI Textile Analyst with extensive knowledge of textile engineering, fabric inspection, weave analysis, and computer vision.
Your primary goal is to provide accurate, evidence-based textile analysis while avoiding assumptions or fabricated results.

## WORKFLOW

### STEP 1: Detect Whether the Image Contains Fabric
First, determine whether the uploaded image primarily contains textile fabric.
Recognize as fabric: Woven fabric, Knitted fabric, Non-woven fabric, Cotton fabric, Denim, Silk, Polyester, Wool, Linen, Garments, Bedsheets, Curtains, Upholstery, Towels, Textile samples.
Do NOT recognize as fabric: People, Animals, Food, Buildings, Roads, Cars, Electronics, Furniture without visible fabric, Documents, Plants, Sky, Water, Random household objects.

If the uploaded image is NOT fabric, immediately return:
{
  "success": false,
  "fabric_detected": false,
  "message": "The uploaded image does not contain textile fabric. Textile analysis cannot be performed."
}
Stop immediately. Do not continue analysis.

---

### STEP 2: Validate Image Quality
If fabric is detected, evaluate: Resolution, Sharpness, Blur, Lighting, Fabric coverage, Visibility of weave or knit structure.
If the fabric occupies only a small portion of the image or the structure is unclear, return:
{
  "success": false,
  "fabric_detected": true,
  "analysis_possible": false,
  "message": "Fabric detected, but the image quality is insufficient for reliable textile analysis. Please upload a clearer close-up image."
}
Stop. Never guess.

---

### STEP 3: Analyze the Fabric
Only perform analysis if the image quality is sufficient.
Analyze:
1. Fabric Type: Woven, Knitted, Non-woven, Unknown
2. Material (Estimate Only): Cotton, Polyester, Silk, Wool, Linen, Rayon, Denim, Blended, Unknown (Never claim certainty unless visual evidence is strong)

---

### STEP 4: Detect Weave Pattern
Identify: Plain Weave, Twill, Satin, Basket Weave, Rib Weave, Knit Structure, Unknown.
Explain why the weave was chosen.

---

### STEP 5: Estimate Thread Density
Only estimate thread density if individual yarns are clearly visible. If threads cannot be resolved, set warp_tpi, weft_tpi, and total_tpi to null in the JSON. Never invent numbers.

---

### STEP 6: Detect Fabric Condition
Detect: Wrinkles, Folds, Creases, Stains, Holes, Tears, Loose yarns, Missing yarns, Surface damage, Fraying.
If none exist, set condition to "No visible defects detected."

---

### STEP 7: Confidence Score
95–100%: Extremely clear and the structure is fully visible.
80–94%: Good quality image with clear textile structure.
60–79%: Moderate quality image.
Below 60%: Poor image or uncertain analysis.

---

### STEP 8: Explain Every Decision
For every prediction include evidence (e.g. "Plain weave detected because perpendicular yarn intersections are visible").

---

### STEP 9: Never Hallucinate
Accuracy is more important than providing an answer.

---

### STEP 10: Return JSON
Return ONLY a valid JSON object matching this structure:
{
  "success": true,
  "fabric_detected": true,
  "analysis_possible": true,
  "image_quality": "High/Moderate/Low description",
  "fabric_type": "Woven/Knitted/Non-woven/Unknown",
  "estimated_material": "Cotton/Polyester/Silk/Wool/Linen/Rayon/Denim/Blended/Unknown",
  "weave_pattern": "Plain Weave/Twill/Satin/Basket Weave/Rib Weave/Knit Structure/Unknown",
  "thread_density": {
    "warp_tpi": null,
    "weft_tpi": null,
    "total_tpi": null
  },
  "condition": "Condition description",
  "defects": [],
  "confidence": 0.85,
  "visual_evidence": ["evidence 1", "evidence 2"],
  "summary": "Overall summary of the analysis"
}`;

export async function analyzeWithGemini(fileUrl: string): Promise<FabricAnalysisResult> {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    console.log("[Gemini] No API key — using mock analysis.");
    return fallbackMock(fileUrl);
  }

  try {
    let imageData: Buffer;
    let mimeType = "image/jpeg";

    if (fileUrl.startsWith("http://") || fileUrl.startsWith("https://")) {
      const res = await fetch(fileUrl);
      if (!res.ok) throw new Error(`Failed to fetch image: ${res.statusText}`);
      imageData = Buffer.from(await res.arrayBuffer());
      const contentType = res.headers.get("content-type");
      if (contentType) mimeType = contentType;
    } else {
      const localPath = path.join(process.cwd(), "public", fileUrl.replace(/^\//, ""));
      if (!fs.existsSync(localPath)) {
        console.warn("[Gemini] File not found on disk:", localPath);
        return fallbackMock(fileUrl);
      }
      imageData = fs.readFileSync(localPath);
      const ext = path.extname(localPath).toLowerCase().replace(".", "");
      mimeType = ext === "png" ? "image/png" : "image/jpeg";
    }

    const base64Image = imageData.toString("base64");
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const imagePart: Part = {
      inlineData: {
        data: base64Image,
        mimeType,
      },
    };

    const result = await model.generateContent([SYSTEM_PROMPT, imagePart]);
    const text = result.response.text();

    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || text.match(/```\s*([\s\S]*?)\s*```/) || [null, text];
    const rawJson = (jsonMatch[1] || text).trim();
    const parsed = JSON.parse(rawJson);

    return {
      ...parsed,
      analysis_method: "gemini",
    };
  } catch (err: any) {
    console.error("[Gemini] Analysis failed:", err.message);
    return fallbackMock(fileUrl);
  }
}

// ─── Smart mock fallback matching the new JSON structure ───────────────────

const MOCK_DATA = [
  {
    detected: true,
    possible: true,
    quality: "High Resolution Macro",
    type: "Woven",
    material: "Denim",
    pattern: "Twill",
    warp: 98, weft: 74,
    condition: "Good condition with minor creases",
    defects: [],
    confidence: 0.94,
    evidence: ["Characteristic 3x1 twill diagonal ribbing visible", "Indigo dyed warp yarn with white weft yarn visible"],
    summary: "High quality twill denim fabric with clear diagonal warp-faced structure."
  },
  {
    detected: true,
    possible: true,
    quality: "Clear close-up",
    type: "Woven",
    material: "Cotton",
    pattern: "Plain Weave",
    warp: 84, weft: 80,
    condition: "No visible defects detected",
    defects: [],
    confidence: 0.88,
    evidence: ["Perpendicular 1x1 interlacing pattern resolved clearly", "Matte fiber texture indicative of natural cotton"],
    summary: "Standard plain weave cotton fabric suitable for apparel manufacturing."
  },
  {
    detected: true,
    possible: true,
    quality: "High brightness macro",
    type: "Woven",
    material: "Silk",
    pattern: "Satin",
    warp: 180, weft: 150,
    condition: "Smooth surface, no defects",
    defects: [],
    confidence: 0.95,
    evidence: ["Long warp floats creating highly lustrous surface", "Fine yarn diameter and high density"],
    summary: "Mulberry silk satin fabric with excellent drape and surface luster."
  },
  {
    detected: true,
    possible: true,
    quality: "Moderate resolution",
    type: "Knitted",
    material: "Blended",
    pattern: "Knit Structure",
    warp: null, weft: null,
    condition: "Slight pilling on surface",
    defects: ["Surface pilling"],
    confidence: 0.78,
    evidence: ["Interlocking loop structure characteristic of single jersey knit", "Highly elastic behavior observed"],
    summary: "Cotton-polyester blend jersey knit fabric with minor surface pilling."
  }
];

function fallbackMock(fileUrl?: string): FabricAnalysisResult {
  const filename = (fileUrl || "").toLowerCase();
  
  // Non-fabric detection check
  if (filename.includes("dog") || filename.includes("cat") || filename.includes("car") || filename.includes("person")) {
    return {
      success: false,
      fabric_detected: false,
      message: "The uploaded image does not contain textile fabric. Textile analysis cannot be performed.",
      analysis_method: "mock"
    };
  }

  // Blurry quality check
  if (filename.includes("blurry") || filename.includes("dark")) {
    return {
      success: false,
      fabric_detected: true,
      analysis_possible: false,
      message: "Fabric detected, but the image quality is insufficient for reliable textile analysis. Please upload a clearer close-up image.",
      analysis_method: "mock"
    };
  }

  // Match based on filename keywords
  let match = MOCK_DATA[1]; // default cotton
  if (filename.includes("denim") || filename.includes("jeans")) {
    match = MOCK_DATA[0];
  } else if (filename.includes("silk") || filename.includes("satin")) {
    match = MOCK_DATA[2];
  } else if (filename.includes("knit") || filename.includes("jersey") || filename.includes("sweater")) {
    match = MOCK_DATA[3];
  } else {
    match = MOCK_DATA[Math.floor(Math.random() * MOCK_DATA.length)];
  }

  return {
    success: match.detected && match.possible,
    fabric_detected: match.detected,
    analysis_possible: match.possible,
    image_quality: match.quality,
    fabric_type: match.type,
    estimated_material: match.material,
    weave_pattern: match.pattern,
    thread_density: {
      warp_tpi: match.warp,
      weft_tpi: match.weft,
      total_tpi: match.warp && match.weft ? match.warp + match.weft : null
    },
    condition: match.condition,
    defects: match.defects,
    confidence: match.confidence,
    visual_evidence: match.evidence,
    summary: match.summary,
    analysis_method: "mock"
  };
}
