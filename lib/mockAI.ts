/**
 * mockAI.ts
 * Simulates AI fabric analysis results locally when Gemini Vision is not reachable.
 */

const FABRIC_TYPES = [
  "Cotton Woven",
  "Polyester Blend",
  "Pure Silk",
  "Linen",
  "Wool",
  "Denim",
  "Satin",
  "Jersey Knit",
  "Velvet",
  "Tweed",
];

const SUGGESTIONS: Record<string, string[]> = {
  "Cotton Woven": [
    "Thread density is optimal for light-weight garments.",
    "Consider mercerization to improve sheen and strength.",
    "Ideal for summer wear and bed linens.",
  ],
  "Polyester Blend": [
    "High synthetic content — check for static build-up.",
    "Blending ratio looks good for durability.",
    "Consider moisture-wicking finishing for sportswear applications.",
  ],
  "Pure Silk": [
    "Exceptionally fine thread count detected.",
    "Handle with care — susceptible to UV degradation.",
    "Recommend dry-clean or hand-wash only labeling.",
  ],
  "Linen": [
    "Natural fiber with excellent breathability.",
    "Thread count suits summer and beach wear.",
    "May require pre-washing to reduce initial shrinkage.",
  ],
  "Wool": [
    "Dense weave detected — excellent thermal insulation.",
    "Felting risk is present at high temperatures.",
    "Suitable for outerwear and heavy-duty applications.",
  ],
  "Denim": [
    "Tight twill weave confirms denim construction.",
    "Indigo dye patterns visible in thread arrangement.",
    "Tensile strength is high — suitable for workwear.",
  ],
  "Satin": [
    "Floating thread technique identified — creates smooth sheen.",
    "Low friction surface ideal for lingerie and formalwear.",
    "Careful handling required during cutting and sewing.",
  ],
  "Jersey Knit": [
    "Knit structure provides excellent stretch and recovery.",
    "Suitable for casual and athletic wear.",
    "Consider adding spandex blend for improved elasticity.",
  ],
  "Velvet": [
    "Cut pile construction detected — characteristic of velvet.",
    "Rich texture suitable for luxury upholstery and formalwear.",
    "Pile direction affects appearance — mark fabric clearly.",
  ],
  "Tweed": [
    "Coarse irregular texture confirms tweed construction.",
    "Multi-colored yarn detected in warp and weft.",
    "Ideal for tailored outerwear and traditional garments.",
  ],
};

export function mockAnalyzeFabric() {
  const fabricType = FABRIC_TYPES[Math.floor(Math.random() * FABRIC_TYPES.length)];
  const warp = Math.floor(Math.random() * 80) + 60;   // 60–140
  const weft = Math.floor(Math.random() * 80) + 60;   // 60–140
  const density = warp + weft;                          // total thread density
  const confidence = parseFloat((0.72 + Math.random() * 0.26).toFixed(2));  // 72–98%

  const defaultSuggestions = [
    "Thread alignment is consistent across the sample.",
    "No significant defects detected in the weave pattern.",
    "Suitable for standard textile manufacturing processes.",
  ];

  const suggestions = SUGGESTIONS[fabricType] || defaultSuggestions;

  return {
    fabric_type: fabricType,
    warp_count: warp,
    weft_count: weft,
    thread_density: density,
    confidence,
    ai_suggestions: suggestions,
  };
}
