import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, ChevronLeft, FileText } from "lucide-react";
import { getBookById } from "../db";
import BuyButton from "./BuyButton";
import BookTabs from "./BookTabs";

type Props = {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
};

export default async function BookDetailLayout({ children, params }: Props) {
  const { id } = await params;

  // Find book on server
  const book = await getBookById(id);

  if (!book) {
    notFound();
  }

  // Tab definitions
  const tabs = [
    { label: "Overview", href: `/books/${book.id}` },
    { label: "Specs & Publisher", href: `/books/${book.id}/details` },
    { label: "Reader Reviews", href: `/books/${book.id}/reviews` },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto py-10 px-4 sm:px-6">
      {/* Back button */}
      <Link
        href="/books"
        className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
      >
        <ChevronLeft className="w-4 h-4" /> Back to Catalog
      </Link>

      {/* Static Hero Book Card */}
      <section className="relative overflow-hidden p-6 rounded-3xl glass-card border border-slate-200/40 dark:border-slate-800/40 shadow-sm text-left">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-brand-600 to-teal-400" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-5">
            {/* Book Icon Badge representing book cover */}
            <div className="w-16 h-20 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-400 flex flex-col justify-between p-2 text-white shadow-lg shrink-0">
              <span className="text-[9px] font-black uppercase tracking-wider text-brand-200 truncate">{book.genre.split(" ")[0]}</span>
              <FileText className="w-6 h-6 self-center" />
              <span className="text-[10px] font-black text-right">0{book.id}</span>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-3">
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-850 text-slate-550 dark:text-slate-400 border border-slate-205/30 dark:border-slate-800/50">
                  {book.genre}
                </span>
                <div className="flex items-center gap-0.5 text-xs font-bold text-amber-500">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{book.rating}</span>
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">{book.title}</h2>
              <p className="text-xs font-semibold text-slate-550 dark:text-slate-450">
                By {book.author}
              </p>
            </div>
          </div>

          <div className="flex items-center md:flex-col justify-between md:items-end gap-3 border-t md:border-t-0 pt-4 md:pt-0 border-slate-200/50 dark:border-slate-850/50">
            <div className="text-left md:text-right">
              <span className="block text-[9px] uppercase font-bold text-slate-400">Retail Price</span>
              <span className="text-2xl font-black text-slate-900 dark:text-white mb-2 block">{book.price}</span>
            </div>

            {/* Buy Button Client action */}
            <BuyButton book={book} />
          </div>
        </div>

        {/* Localized Tab Bar Client navigation */}
        <BookTabs tabs={tabs} />
      </section>

      {/* Render children sub-pages */}
      <div className="p-1 min-h-[200px]">
        {children}
      </div>
    </div>
  );
}
