import React from "react";

export function LandingPage({ onBrowse, onSell }: { onBrowse: () => void; onSell: () => void }) {
  return (
    <div className="mx-auto max-w-4xl py-20 text-center">
      <h1 className="text-4xl font-bold">LastChance</h1>
      <p className="mt-4 text-slate-600">Saving meals from waste — one rescue at a time.</p>
      <div className="mt-8 flex justify-center gap-4">
        <button onClick={onBrowse} className="rounded bg-indigo-600 px-5 py-3 text-white">Browse meals</button>
        <button onClick={onSell} className="rounded border px-5 py-3">Sell surplus</button>
      </div>
    </div>
  );
}
