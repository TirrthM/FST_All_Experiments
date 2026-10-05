"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, BarChart3, BookOpen, Database, Activity, Library, Users } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = useState(false);

  const stats = [
    { label: "Book Titles", value: "1,264 cataloged", change: "Full Catalog", icon: Library, color: "text-emerald-500" },
    { label: "Inventory Value", value: "$48,950", change: "+4.2% sales", icon: BookOpen, color: "text-teal-500" },
    { label: "Store Readers", value: "1,420 active", change: "+24 today", icon: Users, color: "text-cyan-500" },
  ];

  return (
    <div className="flex flex-col lg:flex-row flex-1 min-h-screen">
      {/* Sidebar for Dashboard */}
      <aside
        className={`glass-panel border-r border-r-slate-200/20 dark:border-r-slate-800/40 transition-all duration-300 flex flex-col justify-between shrink-0 z-20 ${
          collapsed ? "w-full lg:w-20" : "w-full lg:w-64"
        }`}
      >
        <div className="p-4 flex flex-col gap-6">
          {/* Header & Toggle */}
          <div className="flex items-center justify-between">
            {!collapsed && (
              <span className="font-bold text-xs uppercase tracking-widest text-slate-450 dark:text-slate-400">
                Administration
              </span>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1.5 rounded-lg border border-slate-200 dark:border-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors ml-auto"
              title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Quick Sub-navigation */}
          <div className="flex flex-row lg:flex-col gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
            {[
              { label: "Overview", icon: BarChart3, active: true },
              { label: "Book Inventory", icon: Library, active: false },
              { label: "Database Logs", icon: Activity, active: false },
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    item.active
                      ? "bg-brand-500/10 text-brand-655 dark:text-brand-400 shadow-inner"
                      : "text-slate-655 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className={collapsed ? "lg:hidden" : "block"}>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Sidebar Footer info */}
        <div className="p-4 border-t border-t-slate-200/10 hidden lg:block text-center">
          {!collapsed ? (
            <div className="p-3.5 rounded-xl bg-slate-900/5 dark:bg-slate-950/20 border border-slate-250/25 dark:border-slate-850/50">
              <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">
                Database Status
              </span>
              <span className="text-[10px] font-bold text-emerald-500 mt-1 inline-flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Connected & Synced
              </span>
            </div>
          ) : (
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 mx-auto animate-pulse" title="System normal" />
          )}
        </div>
      </aside>

      {/* Dashboard Main Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Real-time stats strip (responsive row) */}
        <section className="p-4 sm:p-6 border-b border-b-slate-200/30 dark:border-b-slate-850/30 glass-panel grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-2xl glass-card border-slate-200/50 dark:border-slate-855/60 shadow-sm"
              >
                <div className="space-y-1 text-left">
                  <span className="text-[10px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
                    {stat.label}
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {stat.value}
                    </span>
                    <span className="text-xs font-bold text-emerald-500">
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/60 ${stat.color}`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>
            );
          })}
        </section>

        {/* Dashboard Pages Content */}
        <main className="flex-grow p-4 sm:p-6 space-y-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
