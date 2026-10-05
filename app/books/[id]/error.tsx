"use client";

import React, { useEffect } from "react";
import { ShieldAlert, RefreshCcw } from "lucide-react";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function BookDetailError({ error, reset }: Props) {
  useEffect(() => {
    console.error("Book Detail Error Catcher:", error);
  }, [error]);

  return (
    <div className="p-8 rounded-3xl border border-red-500/25 bg-red-500/5 text-center space-y-6 max-w-xl mx-auto my-10 animate-fade-in-up">
      <div className="inline-flex p-4 rounded-full bg-red-500/10 text-red-500 border border-red-500/20">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <div className="space-y-2">
        <h3 className="font-extrabold text-slate-900 dark:text-white">Book Resource Sync Issue</h3>
        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
          An error occurred while loading details for this catalog item. This might be due to database replica synchronization timeouts.
        </p>
      </div>

      <div className="flex justify-center">
        <button
          onClick={reset}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs hover:bg-brand-600 transition-colors shadow active:scale-95"
        >
          <RefreshCcw className="w-3.5 h-3.5" /> Reload Catalog Item
        </button>
      </div>
    </div>
  );
}
