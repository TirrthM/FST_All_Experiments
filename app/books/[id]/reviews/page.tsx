import React from "react";
import { notFound } from "next/navigation";
import { getBookById } from "../../db";
import { Star, MessageSquare, User, Calendar, CornerDownRight } from "lucide-react";
import ReviewForm from "./ReviewForm";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function BookReviewsPage({ params }: Props) {
  const { id } = await params;
  const book = await getBookById(id);

  if (!book) {
    notFound();
  }

  const reviewsList = book.reviews;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
      {/* Review comments list */}
      <div className="md:col-span-2 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-205/30 dark:border-slate-850/50">
          <div>
            <h3 className="font-extrabold text-base text-slate-905 dark:text-white flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-brand-500" /> Reader Comments
            </h3>
            <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500">
              Community ratings ({reviewsList.length} reviews)
            </p>
          </div>

          <ReviewForm bookId={book.id} />
        </div>

        {/* Reviews stream */}
        <div className="space-y-3">
          {reviewsList.map((rev, idx) => (
            <div key={idx} className="p-4 rounded-2xl glass-card border-slate-200/40 dark:border-slate-800/40 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-full bg-slate-105 dark:bg-slate-800 text-slate-550 dark:text-slate-400">
                    <User className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="block text-xs font-black text-slate-900 dark:text-white">
                      {rev.reviewer}
                    </span>
                    <span className="text-[9px] text-slate-400 font-semibold flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> {rev.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-0.5 text-xs font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/15">
                  <Star className="w-3 h-3 fill-amber-500" />
                  <span>{rev.stars}.0</span>
                </div>
              </div>

              <div className="flex gap-2 text-xs">
                <CornerDownRight className="w-4 h-4 text-slate-350 shrink-0 mt-0.5" />
                <p className="font-semibold text-slate-600 dark:text-slate-350 leading-relaxed">
                  {rev.comment}
                </p>
              </div>
            </div>
          ))}
          {reviewsList.length === 0 && (
            <div className="text-center py-10 text-xs text-slate-450 border border-dashed border-slate-200 dark:border-slate-850 rounded-2xl">
              No reviews posted yet for this title. Be the first to share your thoughts!
            </div>
          )}
        </div>
      </div>

      {/* Ratings recap sidebar panel */}
      <div className="space-y-6">
        <div className="p-5 rounded-2xl glass-card border-slate-200/40 dark:border-slate-800/40 space-y-4">
          <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Ratings Summary</h4>
          
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-905 dark:text-white">{book.rating}</span>
            <span className="text-xs font-semibold text-slate-400">out of 5.0 stars</span>
          </div>

          <div className="space-y-2.5">
            {[5, 4, 3, 2, 1].map((stars) => {
              const count = reviewsList.filter((r) => r.stars === stars).length;
              const percent = reviewsList.length > 0 ? (count / reviewsList.length) * 100 : 0;
              return (
                <div key={stars} className="flex items-center gap-3 text-xs font-semibold">
                  <span className="w-3 text-left">{stars}★</span>
                  <div className="flex-1 bg-slate-205 dark:bg-slate-850 h-2 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: `${percent}%` }} />
                  </div>
                  <span className="w-4 text-right text-slate-400">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
