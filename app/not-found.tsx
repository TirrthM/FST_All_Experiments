import React from "react";
import Link from "next/link";
import { Compass, ArrowRight } from "lucide-react";

export default function GlobalNotFound() {
  return (
    <div className="flex-grow flex flex-col items-center justify-center min-h-[70vh] text-center space-y-6 px-4">
      <div className="p-4 rounded-3xl bg-brand-500/10 text-brand-500 border border-brand-500/20 shadow-lg shadow-brand-500/5">
        <Compass className="w-12 h-12" />
      </div>

      <div className="space-y-2">
        <h1 className="text-5xl font-black text-slate-200 dark:text-slate-800/80 font-mono">404</h1>
        <h2 className="text-2xl font-extrabold text-slate-905 dark:text-white">Route Node Not Found</h2>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed max-w-sm mx-auto">
          The routing index you requested does not map to any active controller endpoints. Double-check your path syntax or return to the main console.
        </p>
      </div>

      <Link
        href="/"
        className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 font-bold text-xs hover:bg-brand-650 dark:hover:bg-brand-500 hover:text-white dark:hover:text-white transition-all shadow-md active:scale-95"
      >
        <span>Return to Dashboard Portal</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
