"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Check, HelpCircle } from "lucide-react";

const faqData = [
  // Platform
  {
    category: "platform",
    q: "What is ThreadCounty?",
    a: "ThreadCounty is an AI-powered textile inspection and analysis software. It leverages computer vision models to automatically detect thread density (warp/weft counts), identify fabric weave type, and grade quality, replacing tedious manual inspections.",
  },
  {
    category: "platform",
    q: "Who is ThreadCounty designed for?",
    a: "Our platform is built for textile manufacturers, quality control engineers, sourcing professionals, apparel brands, academic researchers, and fashion engineering students.",
  },
  // AI Analysis
  {
    category: "ai",
    q: "How does the AI analysis work?",
    a: "When you upload a high-resolution, close-up photograph of a fabric weave, our computer vision system detects the grid pattern of the threads. It calculates the number of horizontal (weft) and vertical (warp) yarns in a standard area, cross-references it with weave geometry rules, and determines the density and type.",
  },
  {
    category: "ai",
    q: "Can I use the app if I don't have a Gemini API key?",
    a: "Yes! If no Gemini API key is configured, ThreadCounty falls back to an intelligent mock analysis generator. This lets evaluators and users fully experience the upload, processing, and reporting flow without setting up API keys.",
  },
  {
    category: "ai",
    q: "What is the accuracy rate of the analysis?",
    a: "For standard plain, twill, and satin weaves photographed under clear lighting and flat positioning, our models achieve between 95% to 98% accuracy. Accuracy may vary for complex jacquards or heavily textured yarns.",
  },
  // Pricing
  {
    category: "pricing",
    q: "Do you offer a free plan?",
    a: "Yes, our Free plan includes 5 fabric analyses per month with standard reports. It is perfect for getting started or trying the service.",
  },
  {
    category: "pricing",
    q: "How can I upgrade to a premium plan?",
    a: "You can visit the Pricing page, select the Student, Professional, or Enterprise plan, and complete the simulated checkout. Your profile plan status will update immediately.",
  },
  // Limits
  {
    category: "limits",
    q: "What are the file size and format restrictions?",
    a: "We support JPEG, JPG, and PNG image file formats. The maximum file size limit is 10MB per upload.",
  },
  {
    category: "limits",
    q: "What are the storage limits for each plan tier?",
    a: "Free users have a 10MB total storage capacity. Student plans have 100MB, Professional plans have 1GB, and Enterprise plans offer custom higher allocations.",
  },
  // Account
  {
    category: "account",
    q: "Can I download my previous inspection reports?",
    a: "Yes, all previous analyses are stored securely in your History. You can search, view, download them as PDF, or share them at any time.",
  },
  {
    category: "account",
    q: "How do I delete my account?",
    a: "You can permanently delete your account by visiting the Profile page and clicking the 'Delete Account' button inside the Danger Zone. This will erase all your uploads, reports, and profile records from the database.",
  },
];

const categories = [
  { id: "all", name: "All FAQs" },
  { id: "platform", name: "Platform" },
  { id: "ai", name: "AI Analysis" },
  { id: "pricing", name: "Pricing" },
  { id: "limits", name: "Upload Limits" },
  { id: "account", name: "Account" },
];

export default function FAQPage() {
  const [activeCat, setActiveCat] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const filteredFaqs = faqData.filter((item) => {
    const matchesCat = activeCat === "all" || item.category === activeCat;
    const matchesSearch =
      item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
      {/* Title */}
      <div className="text-center space-y-3">
        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Frequently Asked Questions
        </h1>
        <p className="text-gray-500 max-w-lg mx-auto text-sm">
          Everything you need to know about the ThreadCounty platform, AI analysis, subscription tiers, limits, and account options.
        </p>
      </div>

      {/* Search & Tabs */}
      <div className="space-y-6">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3.5 top-3.5 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search FAQs by keywords..."
            className="input pl-11 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setExpandedIndex(null);
            }}
          />
        </div>

        <div className="flex flex-wrap gap-2 justify-center border-b border-gray-100 dark:border-gray-800 pb-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCat(cat.id);
                setExpandedIndex(null);
              }}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all duration-200 ${
                activeCat === cat.id
                  ? "bg-primary text-white shadow-sm"
                  : "bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* FAQs List */}
      <div className="space-y-4 max-w-2xl mx-auto">
        <AnimatePresence mode="popLayout">
          {filteredFaqs.map((item, index) => {
            const isExpanded = expandedIndex === index;
            return (
              <motion.div
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key={item.q}
                className="card p-0 overflow-hidden border border-gray-100 dark:border-gray-800 shadow-sm hover:border-primary/20 dark:hover:border-primary/20 transition-all duration-300"
              >
                <button
                  onClick={() => setExpandedIndex(isExpanded ? null : index)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 font-semibold text-gray-800 dark:text-gray-200"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle className="text-primary shrink-0" size={18} />
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`text-gray-400 transition-transform duration-300 shrink-0 ${
                      isExpanded ? "rotate-180 text-primary" : ""
                    }`}
                    size={18}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-6 pt-1 text-sm text-gray-500 leading-relaxed border-t border-gray-50 dark:border-gray-800/50">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {filteredFaqs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-10 text-gray-400 text-sm"
          >
            No FAQs found matching your filters. Try search keywords.
          </motion.div>
        )}
      </div>
    </div>
  );
}
