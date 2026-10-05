"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Star, ArrowRight, ShoppingCart, Check, RefreshCw } from "lucide-react";
import { useBookstore } from "./BookstoreContext";
import { Book } from "./BookData";

export default function BooksPage() {
  const {
    cart,
    addToCart,
    removeFromCart,
    searchQuery,
    selectedGenre,
  } = useBookstore();

  const [booksList, setBooksList] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch books from our API Route Handler (GET /api/books)
  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/books");
      if (res.ok) {
        const data = await res.json();
        setBooksList(data);
      }
    } catch (error) {
      console.error("Failed to fetch books from API:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  // Filter books based on search query & selected genre
  const filteredBooks = booksList.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGenre =
      selectedGenre === "All" || book.genre === selectedGenre;

    return matchesSearch && matchesGenre;
  });

  const isInCart = (id: string) => {
    return cart.some((b) => b.id === id);
  };

  return (
    <div className="max-w-5xl mx-auto py-10 px-4 sm:px-6 space-y-8">
      {/* Title block */}
      <div className="flex items-center justify-between">
        <div className="text-left space-y-1">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-brand-500" /> Book Catalog
          </h2>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">
            Browse the complete collection of software engineering books and classic developer manuals.
          </p>
        </div>
        <button
          onClick={fetchBooks}
          className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
          title="Refresh Catalog"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-5 rounded-2xl border border-slate-205/30 dark:border-slate-805/40 bg-slate-100/50 dark:bg-slate-900/30 h-64 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in-up">
          {filteredBooks.map((book) => {
            const added = isInCart(book.id);
            return (
              <div
                key={book.id}
                className="group relative flex flex-col justify-between p-5 rounded-2xl glass-card border border-slate-205/30 dark:border-slate-800/40 hover:border-slate-350 dark:hover:border-slate-700/85 transition-all duration-300 shadow-sm hover:shadow-lg"
              >
                {/* Book Spine Accent */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-brand-500 to-teal-400 rounded-t-2xl" />

                <div className="space-y-4 pt-2 text-left">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-850 text-slate-500 dark:text-slate-400 border border-slate-200/40 dark:border-slate-800/60">
                      {book.genre}
                    </span>
                    <div className="flex items-center gap-0.5 text-xs font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      <span>{book.rating}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white group-hover:text-brand-500 transition-colors">
                      {book.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-450 font-medium">
                      By {book.author}
                    </p>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                      {book.description}
                    </p>
                  </div>
                </div>

                {/* Footer pricing & details */}
                <div className="pt-4 mt-6 border-t border-slate-200/40 dark:border-slate-800/40 flex items-center justify-between">
                  <div className="text-left">
                    <span className="block text-[9px] uppercase font-bold text-slate-405">Price</span>
                    <span className="text-sm font-black text-slate-900 dark:text-white">{book.price}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Cart Action button */}
                    <button
                      onClick={() => added ? removeFromCart(book.id) : addToCart(book)}
                      className={`p-2.5 rounded-xl border text-xs font-bold transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                        added
                          ? "bg-brand-500/10 border-brand-500/30 text-brand-650 dark:text-brand-400"
                          : "border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/50"
                      }`}
                    >
                      {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                      <span className="hidden sm:inline">{added ? "In Cart" : "Buy"}</span>
                    </button>

                    <Link
                      href={`/books/${book.id}`}
                      className="flex items-center gap-1 px-3.5 py-2.5 rounded-xl bg-slate-905 dark:bg-white text-white dark:text-slate-950 font-bold text-xs hover:bg-brand-500 dark:hover:bg-brand-500 hover:text-white dark:hover:text-white transition-all shadow"
                    >
                      <span>Specs</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}

          {filteredBooks.length === 0 && (
            <div className="col-span-3 text-center py-20 border border-dashed border-slate-200 dark:border-slate-850 rounded-3xl p-6">
              <span className="block text-xl font-bold text-slate-405">No books found</span>
              <span className="text-xs text-slate-505 font-semibold mt-1">Try typing a different keyword or category.</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
