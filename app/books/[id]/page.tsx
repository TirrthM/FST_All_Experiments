import React from "react";
import { notFound } from "next/navigation";
import { getBookById } from "../db";
import { Sparkles } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BookOverviewPage({ params }: Props) {
  const { id } = await params;
  const book = await getBookById(id);

  if (!book) {
    notFound();
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
      {/* Description */}
      <div className="md:col-span-2 space-y-6">
        <div className="p-5 rounded-2xl glass-card border-slate-200/40 dark:border-slate-800/40 space-y-4">
          <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-500" /> Book Overview & Synopsis
          </h3>
          <p className="text-xs font-semibold text-slate-655 dark:text-slate-350 leading-relaxed">
            {book.description}
          </p>
        </div>
      </div>

      {/* Quick specs card */}
      <div className="p-5 rounded-2xl glass-card border-slate-200/40 dark:border-slate-800/40 space-y-4">
        <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Quick Metrics</h4>
        <div className="space-y-3">
          {[
            { name: "Genre Category", value: book.genre },
            { name: "Volume Length", value: `${book.pages} pages` },
            { name: "Rating", value: `${book.rating} / 5.0` },
          ].map((stat, idx) => (
            <div key={idx} className="flex justify-between items-center text-xs py-2 border-b border-b-slate-100 dark:border-b-slate-850/60 font-semibold">
              <span className="text-slate-500 dark:text-slate-450">{stat.name}</span>
              <span className="text-slate-900 dark:text-white font-extrabold">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
