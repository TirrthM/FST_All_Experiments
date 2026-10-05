"use client";

import React, { createContext, useContext, useState } from "react";
import { Book } from "./BookData";

type BookstoreContextType = {
  cart: Book[];
  addToCart: (book: Book) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedGenre: string;
  setSelectedGenre: (genre: string) => void;
};

const BookstoreContext = createContext<BookstoreContextType | undefined>(undefined);

export function BookstoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Book[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  const addToCart = (book: Book) => {
    if (cart.some((b) => b.id === book.id)) return;
    setCart([...cart, book]);
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((b) => b.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <BookstoreContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        searchQuery,
        setSearchQuery,
        selectedGenre,
        setSelectedGenre,
      }}
    >
      {children}
    </BookstoreContext.Provider>
  );
}

export function useBookstore() {
  const context = useContext(BookstoreContext);
  if (context === undefined) {
    throw new Error("useBookstore must be used within a BookstoreProvider");
  }
  return context;
}
