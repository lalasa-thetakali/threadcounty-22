// Real AI analysis using Google Gemini Vision API.
// Falls back to mock if GEMINI_API_KEY is not set.
import { mockAnalyzeFabric } from "./mockAI";

export async function analyzeFabricImage(imageUrl: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return mockAnalyzeFabric();

  try {
    const imgRes = await fetch(imageUrl);
    const buffer = await imgRes.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");

    const prompt = `You are a textile inspection AI. Analyze this fabric image and return ONLY valid JSON with keys:
thread_density (number), warp_count (number), weft_count (number), fabric_type (string), confidence (number 0-1), ai_suggestions (string, 2-3 sentences). No markdown, no extra text.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt },
                { inline_data: { mime_type: "image/jpeg", data: base64 } },
              ],
            },
          ],
        }),
      }
    );
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean);
  } catch (err) {
    console.error("Gemini analysis failed, using mock:", err);
    return mockAnalyzeFabric();
  }
}
