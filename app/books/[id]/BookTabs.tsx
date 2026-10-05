"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = {
  label: string;
  href: string;
};

export default function BookTabs({ tabs }: { tabs: Tab[] }) {
  const pathname = usePathname();

  const isTabActive = (href: string) => {
    return pathname === href;
  };

  return (
    <div className="flex items-center gap-1.5 border-t border-slate-200/50 dark:border-slate-850/50 mt-6 pt-4 overflow-x-auto">
      {tabs.map((tab) => {
        const active = isTabActive(tab.href);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
              active
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow"
                : "text-slate-655 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </div>
  );
}
