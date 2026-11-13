import React from "react";

export default function AdminLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans animate-in fade-in duration-300">
      {/* 1. TOP 4 SKELETON STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-28 rounded-2xl bg-muted/60 animate-pulse border border-border/40"
          />
        ))}
      </div>

      {/* 2. MIDDLE FILTER BAR SKELETON */}
      <div className="h-14 rounded-2xl bg-muted/60 animate-pulse border border-border/40" />

      {/* 3. TABLE / MAIN CONTENT SKELETON CARD */}
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
        {/* Table header skeleton */}
        <div className="grid grid-cols-6 gap-4 pb-4 border-b border-border/60">
          {[1, 2, 3, 4, 5, 6].map((col) => (
            <div key={col} className="h-4 rounded-full bg-muted/80 animate-pulse" />
          ))}
        </div>

        {/* 6 Skeleton Table Rows */}
        {[1, 2, 3, 4, 5, 6].map((row) => (
          <div
            key={row}
            className="grid grid-cols-6 gap-4 py-3.5 border-b border-border/40 items-center"
          >
            <div className="h-4 w-20 rounded-full bg-muted animate-pulse" />
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse shrink-0" />
              <div className="space-y-1.5 flex-1">
                <div className="h-3.5 w-24 rounded-full bg-muted animate-pulse" />
                <div className="h-2.5 w-32 rounded-full bg-muted/60 animate-pulse" />
              </div>
            </div>
            <div className="h-4 w-16 rounded-full bg-muted animate-pulse" />
            <div className="h-6 w-24 rounded-full bg-muted animate-pulse" />
            <div className="h-4 w-24 rounded-full bg-muted animate-pulse" />
            <div className="h-4 w-12 rounded-full bg-muted animate-pulse justify-self-end" />
          </div>
        ))}
      </div>
    </div>
  );
}

