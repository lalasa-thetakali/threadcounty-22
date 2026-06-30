"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ShieldCheck, CreditCard, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const plans = [
  { id: "free", name: "Free", price: "₹0", period: "", desc: "Perfect for testing fabric analysis capabilities.", features: ["5 fabric uploads/month", "Basic AI density analysis", "Email support", "10MB cloud storage"] },
  { id: "student", name: "Student", price: "₹199", period: "/month", desc: "Designed for researchers & engineering students.", features: ["50 fabric uploads/month", "Full AI analysis results", "Downloadable PDF reports", "Priority email support", "100MB cloud storage"] },
  { id: "professional", name: "Professional", price: "₹999", period: "/month", desc: "Best for QC professionals and small manufacturers.", features: ["Unlimited fabric uploads", "Advanced AI quality recommendations", "Downloadable PDF reports", "Team collaboration", "1GB cloud storage", "Priority support"] },
  { id: "enterprise", name: "Enterprise", price: "₹4,999", period: "/month", desc: "Customized for large-scale textile operations.", features: ["Unlimited fabric uploads", "Custom AI models integration", "Downloadable PDF reports", "Dedicated cloud instance", "10GB cloud storage", "SLA support & training"] },
];

export default function Pricing() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [checkoutPlan, setCheckoutPlan] = useState<any>(null);
  const [cardDetails, setCardDetails] = useState({ name: "", number: "", expiry: "", cvc: "" });
  const [paying, setPaying] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const loadUser = async () => {
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const json = await res.json();
        setUser({ id: json.profile?.id, email: json.profile?.email });
        setProfile(json.profile);
      }
    } catch (e) { /* not logged in */ }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const handleSubscribeClick = (plan: any) => {
    if (!user) {
      alert("Please login or create an account to subscribe.");
      router.push("/login");
      return;
    }
    if (profile?.plan === plan.id) {
      alert(`You are already subscribed to the ${plan.name} plan.`);
      return;
    }
    setCheckoutPlan(plan);
    setCheckoutSuccess(false);
    setError("");
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvc) {
      setError("Please fill in card details.");
      return;
    }
    setPaying(true);
    setError("");

    try {
      const res = await fetch("/api/user/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: checkoutPlan.id })
      });
      setPaying(false);
      if (res.ok) {
        setCheckoutSuccess(true);
        loadUser(); // reload profile plan
        setTimeout(() => {
          setCheckoutPlan(null);
          router.push("/dashboard");
        }, 2000);
      } else {
        const json = await res.json();
        setError(json?.error || "Transaction failed.");
      }
    } catch (err) {
      setPaying(false);
      setError("Checkout connection failed. Try again.");
    }
  };

  const activePlan = profile?.plan || "free";

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 space-y-16">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          Simple, Transparent Pricing
        </h1>
        <p className="text-gray-500 text-sm">
          Select a subscription tier that matches your inspection volume and research criteria. Upgrades are activated instantly.
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid md:grid-cols-4 gap-6 items-stretch">
        {plans.map((p) => {
          const isCurrent = activePlan === p.id;
          return (
            <motion.div
              key={p.id}
              whileHover={{ y: -5 }}
              className={`card flex flex-col justify-between relative border ${
                isCurrent 
                  ? "border-primary ring-2 ring-primary/20 bg-primary/5 dark:bg-primary/5 shadow-md" 
                  : "border-gray-100 dark:border-gray-800"
              }`}
            >
              {isCurrent && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full flex items-center gap-1 shadow">
                  <Sparkles size={10} /> Active Plan
                </div>
              )}
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-extrabold text-lg text-gray-800 dark:text-gray-200">{p.name}</h3>
                  <p className="text-xs text-gray-400 mt-1 min-h-[32px]">{p.desc}</p>
                </div>
                
                <div className="flex items-baseline gap-1 py-2">
                  <span className="text-3xl font-extrabold text-primary">{p.price}</span>
                  <span className="text-xs text-gray-400 font-medium">{p.period}</span>
                </div>

                <ul className="space-y-2 border-t border-gray-50 dark:border-gray-800 pt-4">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-xs text-gray-500 leading-normal">
                      <Check className="text-primary shrink-0 mt-0.5" size={14} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                {isCurrent ? (
                  <button className="w-full py-2.5 text-center text-xs font-semibold border border-primary/20 text-primary bg-primary/10 rounded-lg cursor-default">
                    Current Tier
                  </button>
                ) : (
                  <button
                    onClick={() => handleSubscribeClick(p)}
                    className={`w-full py-2.5 text-center text-xs font-semibold rounded-lg transition-all ${
                      p.id === "professional"
                        ? "bg-primary text-white hover:opacity-90 shadow-sm"
                        : "border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {p.id === "enterprise" ? "Contact Enterprise" : `Subscribe to ${p.name}`}
                  </button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Checkout Modal */}
      <AnimatePresence>
        {checkoutPlan && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card w-full max-w-md bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden"
            >
              {checkoutSuccess ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-950 text-green-500 rounded-full flex items-center justify-center mx-auto shadow-md">
                    <ShieldCheck size={36} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Payment Successful!</h3>
                  <p className="text-sm text-gray-500 px-6">
                    Your account has been upgraded to the <strong>{checkoutPlan.name}</strong> tier. Enjoy extended uploads and limits!
                  </p>
                </div>
              ) : (
                <form onSubmit={handleCheckoutSubmit} className="space-y-6">
                  {/* Modal Header */}
                  <div className="flex justify-between items-start border-b border-gray-50 dark:border-gray-800 pb-4">
                    <div>
                      <h3 className="font-extrabold text-xl">Payment Checkout</h3>
                      <p className="text-xs text-gray-400 mt-1">Simulated payment process</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setCheckoutPlan(null)}
                      className="text-gray-400 hover:text-gray-600 text-sm font-semibold"
                    >
                      Cancel
                    </button>
                  </div>

                  {/* Plan Summary */}
                  <div className="bg-gray-50 dark:bg-gray-800/40 rounded-xl p-4 flex justify-between items-center text-sm border border-gray-100 dark:border-gray-800">
                    <div>
                      <span className="font-bold text-gray-800 dark:text-gray-200">{checkoutPlan.name} Plan</span>
                      <span className="block text-xs text-gray-400 mt-0.5">Renews monthly</span>
                    </div>
                    <span className="font-extrabold text-primary text-lg">{checkoutPlan.price}</span>
                  </div>

                  {/* Card Fields */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500 flex items-center gap-1.5">
                        <CreditCard size={12} /> Cardholder Name
                      </label>
                      <input
                        className="input"
                        placeholder="Vikram Sharma"
                        required
                        value={cardDetails.name}
                        onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-gray-500">Card Number</label>
                      <input
                        className="input"
                        placeholder="4111 2222 3333 4444"
                        required
                        maxLength={19}
                        value={cardDetails.number}
                        onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim() })}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500">Expiration (MM/YY)</label>
                        <input
                          className="input"
                          placeholder="12/28"
                          required
                          maxLength={5}
                          value={cardDetails.expiry}
                          onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-gray-500">CVC (3 Digits)</label>
                        <input
                          className="input"
                          placeholder="123"
                          required
                          maxLength={3}
                          type="password"
                          value={cardDetails.cvc}
                          onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {error && <p className="text-red-500 text-xs font-medium">{error}</p>}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={paying}
                    className="btn-primary w-full py-3 flex items-center justify-center gap-2"
                  >
                    {paying ? (
                      <>
                        <Loader2 className="animate-spin" size={16} /> Processing Payment...
                      </>
                    ) : (
                      `Pay Securely ${checkoutPlan.price}`
                    )}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
