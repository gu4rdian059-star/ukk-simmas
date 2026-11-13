import React from "react";

export default function SiswaLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto font-sans animate-in fade-in duration-300">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-28 rounded-2xl bg-muted/60 animate-pulse border border-border/40"
          />
        ))}
      </div>
      <div className="h-14 rounded-2xl bg-muted/60 animate-pulse border border-border/40" />
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-xs space-y-4">
        {[1, 2, 3, 4].map((row) => (
          <div
            key={row}
            className="grid grid-cols-4 gap-4 py-3 border-b border-border/40 items-center"
          >
            <div className="h-4 w-24 rounded-full bg-muted animate-pulse" />
            <div className="h-4 w-40 rounded-full bg-muted animate-pulse" />
            <div className="h-6 w-20 rounded-full bg-muted animate-pulse" />
            <div className="h-4 w-12 rounded-full bg-muted animate-pulse justify-self-end" />
          </div>
        ))}
      </div>
    </div>
  );
}

