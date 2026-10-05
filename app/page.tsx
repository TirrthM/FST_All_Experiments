import React from "react";
import Link from "next/link";
import { BookOpen, FolderTree, ArrowRight, Zap, CheckCircle2 } from "lucide-react";
import { getBooks } from "./books/db";

export default async function Home() {
  const books = await getBooks();
  const featuredBooks = books.slice(0, 3); // show top 3 featured books

  return (
    <div className="relative min-h-screen grid-bg flex flex-col justify-center items-center py-20 px-4 sm:px-6 lg:px-8">
      {/* Visual background blobs decor */}
      <div className="absolute top-1/4 left-1/10 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10 animate-pulse-slow" style={{ animationDelay: "2s" }}></div>

      <div className="max-w-4xl w-full text-center space-y-12 animate-fade-in-up">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-xs font-semibold tracking-wider text-brand-600 dark:text-brand-400 uppercase">
            <Zap className="w-3.5 h-3.5" /> Book Store Catalog Suite
          </div>
          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-none">
            App Router, Actions &{" "}
            <span className="bg-gradient-to-r from-brand-500 via-indigo-500 to-blue-500 bg-clip-text text-transparent">
              API Endpoints
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-slate-605 dark:text-slate-400 font-medium">
            Modern bookstore platform managing products, inventory logs, localized category queries, custom layouts, direct server actions, and REST endpoints.
          </p>
        </div>

        {/* Feature Details Box */}
        <div className="p-6 rounded-2xl glass-card border border-slate-205/30 dark:border-slate-800/40 text-left space-y-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-brand-500 rounded-xl text-white">
              <FolderTree className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white">Core Platform Features</h3>
              <p className="text-[10px] text-slate-450 dark:text-slate-500 uppercase tracking-wider font-bold">Integrated Workspace Specs</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold text-slate-605 dark:text-slate-350">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                <span>App Router Navigation & Route Boundaries</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                <span>Responsive Inventory Analytics Dashboard</span>
              </li>
            </ul>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                <span>Localized Layouts & Preserved Client Context</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-brand-500 shrink-0" />
                <span>API Route Handlers & Server Actions Mutations</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Featured books catalog strip */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-500" /> Featured Catalog Books
            </h3>
            <Link
              href="/books"
              className="text-xs font-bold text-brand-500 hover:text-brand-600 flex items-center gap-1"
            >
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {featuredBooks.map((book) => (
              <div
                key={book.id}
                className="p-5 rounded-2xl glass-card border border-slate-205/30 dark:border-slate-800/40 hover:scale-[1.02] hover:border-slate-350 dark:hover:border-slate-700 transition-all duration-200"
              >
                <span className="text-[9px] font-bold uppercase tracking-wider text-brand-500 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                  {book.genre}
                </span>
                <h4 className="font-extrabold text-sm text-slate-905 dark:text-white mt-3 truncate">{book.title}</h4>
                <p className="text-[11px] text-slate-450 mt-1">{book.author}</p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/50 dark:border-slate-850/50">
                  <span className="text-xs font-black text-slate-900 dark:text-white">{book.price}</span>
                  <Link
                    href={`/books/${book.id}`}
                    className="text-[10px] font-bold px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-brand-500 dark:hover:bg-brand-500 hover:text-white dark:hover:text-white transition-colors"
                  >
                    Details
                  </Link>
                </div>
              </div>
            ))}
            {featuredBooks.length === 0 && (
              <div className="col-span-3 text-center py-10 text-xs text-slate-400">
                Database empty. Add books inside the Dashboard!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
