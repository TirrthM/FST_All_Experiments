"use client";

import React from "react";
import { ShoppingCart, Check } from "lucide-react";
import { useBookstore } from "../BookstoreContext";
import { Book } from "../BookData";

export default function BuyButton({ book }: { book: Book }) {
  const { cart, addToCart, removeFromCart } = useBookstore();
  const added = cart.some((b) => b.id === book.id);

  return (
    <button
      onClick={() => added ? removeFromCart(book.id) : addToCart(book)}
      className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all duration-200 flex items-center gap-2 cursor-pointer ${
        added
          ? "bg-brand-500/10 border-brand-500/35 text-brand-650 dark:text-brand-400"
          : "border-slate-200 dark:border-slate-800 hover:bg-slate-150 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-350"
      }`}
    >
      {added ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
      <span>{added ? "Added to Cart" : "Buy Book"}</span>
    </button>
  );
}
