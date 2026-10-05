import React from "react";

export default function BookDetailLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse text-left">
      <div className="md:col-span-2 space-y-6">
        {/* Main box skeleton */}
        <div className="p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 bg-slate-100/50 dark:bg-slate-900/30 h-48 space-y-4">
          <div className="h-5 w-40 bg-slate-250 dark:bg-slate-800 rounded" />
          <div className="h-20 bg-slate-200/60 dark:bg-slate-800/60 rounded-xl" />
        </div>
      </div>

      {/* Sidebar skeleton */}
      <div className="p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 bg-slate-100/50 dark:bg-slate-900/30 h-48 space-y-4" />
    </div>
  );
}
