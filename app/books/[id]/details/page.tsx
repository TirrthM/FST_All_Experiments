import React from "react";
import { notFound } from "next/navigation";
import { getBookById } from "../../db";
import { BookMarked, Box, Layers, Tag } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BookDetailsTab({ params }: Props) {
  const { id } = await params;
  const book = await getBookById(id);

  if (!book) {
    notFound();
  }

  const specRows = [
    { label: "Publisher Organization", value: book.publisher },
    { label: "Official Release Date", value: book.publishedDate },
    { label: "ISBN-13 Barcode", value: book.isbn },
    { label: "Printed Page Count", value: `${book.pages} pages` },
    { label: "Discount / Promotion", value: book.discountPercentage ? `${book.discountPercentage}% OFF` : "Standard Retail" },
  ];

  const stockInfo = book.stockTracking || {
    sku: `PRAG-000${book.id}`,
    warehouse: "Primary-Depot",
    quantity: 25,
    lowStockThreshold: 5,
    reorderAuto: true,
  };

  const specs = book.specifications || {
    format: "Paperback",
    dimensions: "7.0 x 9.2 x 1.1 inches",
    weightGrams: 650,
    techStack: ["TypeScript", "Next.js", "MongoDB", "Mongoose"],
    edition: "Mongoose 8.x Edition",
  };

  return (
    <div className="space-y-6 text-left">
      {/* 1. Core Specs */}
      <div className="p-5 rounded-2xl glass-card border-slate-200/40 dark:border-slate-800/40 space-y-4">
        <div className="flex items-center gap-2">
          <BookMarked className="w-5 h-5 text-brand-500" />
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">Publishing & Metadata Specs</h3>
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">Mongoose schema document attributes</p>
          </div>
        </div>

        {/* Spec table */}
        <div className="overflow-hidden border border-slate-200/40 dark:border-slate-850/60 rounded-xl">
          <table className="w-full text-xs font-semibold">
            <thead>
              <tr className="bg-slate-100/50 dark:bg-slate-900/40 text-slate-550 border-b border-slate-200/40 dark:border-slate-850/60">
                <th className="px-4 py-3 text-left font-extrabold uppercase tracking-wider w-1/3">Property</th>
                <th className="px-4 py-3 text-left font-extrabold uppercase tracking-wider">Details Registry</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/40 dark:divide-slate-850/60 text-slate-700 dark:text-slate-300">
              {specRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-100/30 dark:hover:bg-slate-900/10 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-950 dark:text-white bg-slate-50/20 dark:bg-slate-955/10">
                    {row.label}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {row.value}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 2. Mongoose Sub-Document: Stock Tracking */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-5 rounded-2xl glass-card border-slate-200/40 dark:border-slate-800/40 space-y-3">
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4 text-emerald-500" />
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Warehouse Sub-Document</h4>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-850/60 font-semibold">
              <span className="text-slate-500">Tracking SKU</span>
              <span className="font-mono font-bold text-brand-500">{stockInfo.sku}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-850/60 font-semibold">
              <span className="text-slate-500">Depot Hub</span>
              <span className="font-bold text-slate-900 dark:text-white">{stockInfo.warehouse}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-850/60 font-semibold">
              <span className="text-slate-500">Available Stock</span>
              <span className="font-bold text-emerald-500">{stockInfo.quantity} copies in depot</span>
            </div>
            <div className="flex justify-between py-1.5 font-semibold">
              <span className="text-slate-500">Low Stock Trigger</span>
              <span className="text-slate-900 dark:text-white font-mono">&lt; {stockInfo.lowStockThreshold} units</span>
            </div>
          </div>
        </div>

        {/* 3. Polymorphic Specifications */}
        <div className="p-5 rounded-2xl glass-card border-slate-200/40 dark:border-slate-800/40 space-y-3">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-cyan-500" />
            <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Polymorphic Specifications</h4>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-850/60 font-semibold">
              <span className="text-slate-500">Edition Format</span>
              <span className="font-bold text-slate-900 dark:text-white">{specs.format || "Paperback"}</span>
            </div>
            <div className="flex justify-between py-1.5 border-b border-slate-100 dark:border-slate-850/60 font-semibold">
              <span className="text-slate-500">Dimensions & Weight</span>
              <span className="font-bold text-slate-900 dark:text-white">{specs.dimensions} ({specs.weightGrams}g)</span>
            </div>
            <div className="flex flex-col gap-1.5 pt-1.5 font-semibold">
              <span className="text-slate-500">Tech Stack Tags</span>
              <div className="flex flex-wrap gap-1.5">
                {(specs.techStack || ["TypeScript", "Mongoose"]).map((tag, i) => (
                  <span key={i} className="px-2 py-0.5 rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-400 text-[10px] font-bold border border-brand-500/20">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
