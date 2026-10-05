import React from "react";

export default function DashboardLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Title */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-slate-205 dark:bg-slate-800 rounded-lg" />
          <div className="h-4 w-72 bg-slate-200 dark:bg-slate-850 rounded" />
        </div>
        <div className="h-10 w-40 bg-slate-205 dark:bg-slate-800 rounded-xl" />
      </div>

      {/* Stats cards loading */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 bg-slate-100/50 dark:bg-slate-900/30 h-28 space-y-4" />
        ))}
      </div>

      {/* Charts loading */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 bg-slate-100/50 dark:bg-slate-900/30 h-80" />
        <div className="p-5 rounded-2xl border border-slate-200/40 dark:border-slate-800/40 bg-slate-100/50 dark:bg-slate-900/30 h-80" />
      </div>
    </div>
  );
}
