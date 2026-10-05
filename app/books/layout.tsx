"use client";

import React, { useState } from "react";
import { BookstoreProvider, useBookstore } from "./BookstoreContext";
import { Search, SlidersHorizontal, ShoppingCart, X, Trash2, CheckCircle2 } from "lucide-react";
import { usePathname } from "next/navigation";

function BookstoreLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    cart,
    removeFromCart,
    clearCart,
    searchQuery,
    setSearchQuery,
    selectedGenre,
    setSelectedGenre,
  } = useBookstore();

  const [checkoutComplete, setCheckoutComplete] = useState(false);

  const genres = ["All", "Software Engineering", "Software Craftsmanship", "Software Design"];

  // Calculate cart total price
  const calculateTotal = () => {
    return cart
      .reduce((sum, item) => sum + parseFloat(item.price.replace("$", "")), 0)
      .toFixed(2);
  };

  const handleCheckout = () => {
    setCheckoutComplete(true);
    setTimeout(() => {
      clearCart();
      setCheckoutComplete(false);
    }, 3000);
  };

  return (
    <div className="flex-1 flex flex-col lg:flex-row min-h-screen">
      {/* Sidebar for bookstore filters */}
      <aside className="w-full lg:w-72 shrink-0 glass-panel border-r border-r-slate-200/20 dark:border-r-slate-800/40 p-5 flex flex-col gap-6 z-10 text-left">
        <div className="space-y-1">
          <h2 className="font-extrabold text-lg text-slate-900 dark:text-white">Store Filters</h2>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Localized layout state
          </p>
        </div>

        {/* Search */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <Search className="w-3.5 h-3.5" /> Search Catalog
          </label>
          <input
            type="text"
            placeholder="Type book title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 focus:outline-none focus:border-brand-500 text-xs font-semibold text-slate-905 dark:text-white shadow-sm"
          />
        </div>

        {/* Genres */}
        <div className="space-y-2">
          <label className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
            <SlidersHorizontal className="w-3.5 h-3.5" /> Book Genres
          </label>
          <div className="flex flex-wrap lg:flex-col gap-1.5">
            {genres.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`w-auto lg:w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  selectedGenre === g
                    ? "bg-brand-500 text-white shadow"
                    : "text-slate-650 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* State explanation block */}
        <div className="mt-auto p-4 rounded-xl bg-brand-500/5 border border-brand-500/10 space-y-2 text-slate-600 dark:text-slate-350 text-left">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-[10px] uppercase tracking-wider font-extrabold text-brand-655 dark:text-brand-400">
              State Preserved
            </span>
          </div>
          <p className="text-[10.5px] leading-relaxed font-semibold">
            The cart queue and search inputs are held in a Bookstore Layout context. Notice that they remain completely intact as you view catalog details.
          </p>
        </div>
      </aside>

      {/* Book pages workspace */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        <div className="flex-grow">
          {children}
        </div>

        {/* Persistent Floating Shopping Cart Dock (State Preservation Visualizer) */}
        {cart.length > 0 && (
          <div className="sticky bottom-6 left-1/2 -translate-x-1/2 max-w-2xl w-[90%] mx-auto z-40 bg-slate-900/95 dark:bg-slate-950/95 text-white p-4 rounded-2xl shadow-2xl border border-slate-700/50 backdrop-blur-md flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in-up">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-brand-500 rounded-xl text-white">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div className="text-left">
                <span className="block text-[10px] font-black uppercase tracking-wider text-brand-400">
                  Cart Queue ({cart.length})
                </span>
                <span className="text-xs font-semibold text-slate-300">
                  Total Value: ${calculateTotal()}
                </span>
              </div>
            </div>

            {/* List of book titles in cart */}
            <div className="flex flex-wrap gap-2">
              {cart.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-750 text-xs font-semibold"
                >
                  <span className="truncate max-w-[120px]">{item.title}</span>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-0.5 rounded-full hover:bg-slate-700 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCheckout}
                disabled={checkoutComplete}
                className="px-4 py-2 rounded-xl bg-brand-505 hover:bg-brand-600 font-bold text-xs transition-colors cursor-pointer disabled:bg-emerald-600 flex items-center gap-1"
              >
                {checkoutComplete ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-white" /> Ordered
                  </>
                ) : (
                  "Checkout"
                )}
              </button>
              <button
                onClick={clearCart}
                className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                title="Clear Cart"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function BookstoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <BookstoreProvider>
      <BookstoreLayoutInner>{children}</BookstoreLayoutInner>
    </BookstoreProvider>
  );
}
