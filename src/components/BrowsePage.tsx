import React from "react";

export function BrowsePage({ onOpenAuth }: { onOpenAuth: () => void }) {
  return (
    <div className="mx-auto max-w-4xl py-12">
      <h2 className="text-2xl font-semibold">Browse available rescues</h2>
      <p className="mt-2 text-slate-500">Demo items would appear here. Sign in to reserve.</p>
      <div className="mt-6">
        <button onClick={onOpenAuth} className="rounded bg-indigo-600 px-4 py-2 text-white">Sign in to reserve</button>
      </div>
    </div>
  );
}
