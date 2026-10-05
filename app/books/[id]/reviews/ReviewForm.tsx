"use client";

import React, { useState } from "react";
import { Plus, User, Star } from "lucide-react";
import { addReviewAction } from "@/app/books/actions";

export default function ReviewForm({ bookId }: { bookId: string }) {
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    setLoading(true);
    setErrorMsg("");

    try {
      await addReviewAction(bookId, name, rating, comment);
      setName("");
      setRating(5);
      setComment("");
      setShowForm(false);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2">
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs flex items-center gap-1.5 hover:bg-brand-600 transition-colors shadow shadow-brand-500/10 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" /> Post Reader Review
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-5 rounded-2xl border border-brand-500/20 dark:border-brand-500/10 bg-brand-500/5 dark:bg-brand-500/5 space-y-4 shadow-sm text-left"
        >
          <h4 className="font-bold text-xs uppercase tracking-wider text-brand-600 dark:text-brand-400">
            Write New Feedback
          </h4>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/15 border border-red-500/25 text-red-550 dark:text-red-450 text-xs font-semibold">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400">Your Name</label>
              <input
                type="text"
                placeholder="e.g. Alice"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:border-brand-500 text-xs font-semibold text-slate-900 dark:text-white"
                required
                disabled={loading}
              />
            </div>

            <div className="space-y-1">
              <label className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400">Rating Stars</label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:border-brand-500 text-xs font-semibold text-slate-900 dark:text-white"
                disabled={loading}
              >
                <option value={5}>5 Stars (Excellent)</option>
                <option value={4}>4 Stars (Good)</option>
                <option value={3}>3 Stars (Average)</option>
                <option value={2}>2 Stars (Poor)</option>
                <option value={1}>1 Star (Terrible)</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[9px] uppercase font-bold text-slate-500 dark:text-slate-400">Review Comments</label>
            <textarea
              placeholder="Provide clean feedback for this book..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:border-brand-500 text-xs font-semibold text-slate-900 dark:text-white"
              required
              disabled={loading}
            />
          </div>

          <div className="flex justify-end gap-2 text-xs font-bold pt-2">
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-4 py-2 rounded-xl border border-slate-250 dark:border-slate-800 text-slate-650 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-brand-500 text-white hover:bg-brand-600 transition-colors shadow disabled:bg-indigo-650 cursor-pointer"
              disabled={loading}
            >
              {loading ? "Posting..." : "Submit Review"}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
