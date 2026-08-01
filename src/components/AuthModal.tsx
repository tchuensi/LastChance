import React, { useState } from "react";
import { useAuth } from "../lib/auth";

export function AuthModal({ open, onClose, defaultMode = "signin" }: { open: boolean; onClose: () => void; defaultMode?: "signin" | "signup" }) {
  const { signIn, loading } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">(defaultMode);
  const [email, setEmail] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6">
        <h3 className="text-lg font-semibold">{mode === "signin" ? "Sign in" : "Sign up"}</h3>
        <p className="mt-1 text-sm text-slate-500">Use any email to sign in (demo).</p>
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-4 w-full rounded border px-3 py-2" />
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-2">
            <button onClick={() => setMode("signin")} className={`rounded px-3 py-2 ${mode === "signin" ? "bg-indigo-600 text-white" : "border"}`}>Sign in</button>
            <button onClick={() => setMode("signup")} className={`rounded px-3 py-2 ${mode === "signup" ? "bg-indigo-600 text-white" : "border"}`}>Sign up</button>
          </div>
          <div>
            <button
              onClick={async () => {
                await signIn(email || "demo@local", mode, mode === "signup" ? false : false);
                onClose();
              }}
              disabled={loading}
              className="rounded bg-indigo-600 px-3 py-2 text-white"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
