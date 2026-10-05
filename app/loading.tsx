import React from "react";
import { Cpu } from "lucide-react";

export default function GlobalLoading() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4">
      <div className="p-4 rounded-2xl bg-brand-500/10 text-brand-550 border border-brand-500/20 animate-pulse">
        <Cpu className="w-8 h-8 text-brand-500 animate-spin-slow" />
      </div>
      <div className="space-y-1">
        <h3 className="font-extrabold text-slate-900 dark:text-white">Connecting telemetry links...</h3>
        <p className="text-xs font-semibold text-slate-400">Please wait while resources are compiled</p>
      </div>
    </div>
  );
}
