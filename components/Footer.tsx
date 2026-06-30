import Link from "next/link";
import { Twitter, Linkedin, Github, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 dark:border-gray-800 mt-20 bg-gray-50 dark:bg-gray-950/50">
      <div className="max-w-7xl mx-auto px-4 pt-14 pb-8 grid grid-cols-2 md:grid-cols-5 gap-10 text-sm">
        {/* Brand */}
        <div className="col-span-2">
          <div className="font-extrabold text-xl text-primary mb-3 tracking-tight">
            Thread<span className="text-accent">County</span>
          </div>
          <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
            AI-powered textile technology for fast, accurate fabric thread density analysis and quality inspection.
          </p>
          <div className="flex gap-3 mt-5">
            <a href="#" aria-label="Twitter" className="p-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg text-gray-400 hover:text-primary hover:border-primary/30 transition-colors">
              <Twitter size={16} />
            </a>
            <a href="#" aria-label="LinkedIn" className="p-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg text-gray-400 hover:text-primary hover:border-primary/30 transition-colors">
              <Linkedin size={16} />
            </a>
            <a href="#" aria-label="GitHub" className="p-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg text-gray-400 hover:text-primary hover:border-primary/30 transition-colors">
              <Github size={16} />
            </a>
            <a href="mailto:support@threadcounty.ai" aria-label="Email" className="p-2 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-lg text-gray-400 hover:text-primary hover:border-primary/30 transition-colors">
              <Mail size={16} />
            </a>
          </div>
        </div>

        {/* Product */}
        <div>
          <div className="font-bold text-gray-900 dark:text-gray-200 mb-4">Product</div>
          <ul className="space-y-2.5 text-gray-500">
            <li><Link href="/upload" className="hover:text-primary transition-colors">Upload & Analyze</Link></li>
            <li><Link href="/history" className="hover:text-primary transition-colors">Analysis History</Link></li>
            <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
            <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing Plans</Link></li>
            <li><Link href="/checklist" className="hover:text-primary transition-colors font-semibold text-violet-500 dark:text-violet-400">Submission Checklist</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <div className="font-bold text-gray-900 dark:text-gray-200 mb-4">Company</div>
          <ul className="space-y-2.5 text-gray-500">
            <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
            <li><Link href="/faq" className="hover:text-primary transition-colors">FAQ</Link></li>
          </ul>
        </div>

        {/* Account */}
        <div>
          <div className="font-bold text-gray-900 dark:text-gray-200 mb-4">Account</div>
          <ul className="space-y-2.5 text-gray-500">
            <li><Link href="/login" className="hover:text-primary transition-colors">Login</Link></li>
            <li><Link href="/signup" className="hover:text-primary transition-colors">Sign Up Free</Link></li>
            <li><Link href="/forgot-password" className="hover:text-primary transition-colors">Reset Password</Link></li>
            <li><Link href="/profile" className="hover:text-primary transition-colors">Profile Settings</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-100 dark:border-gray-800 max-w-7xl mx-auto px-4 py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-gray-400">
        <span>© 2026 ThreadCounty. All rights reserved.</span>
        <span className="flex items-center gap-1">
          Built with ❤️ using Next.js, Supabase & Google Gemini · support@threadcounty.ai
        </span>
      </div>
    </footer>
  );
}
