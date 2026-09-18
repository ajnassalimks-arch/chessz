import type { Metadata } from "next";
import { Suspense } from "react";
import TacticalArenaClient from "./_client";

export const metadata: Metadata = {
  title: "Tactical Arena",
  description:
    "Sharpen your tactical vision with curated puzzles, interactive refutations, and instant engine analysis.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Tactical Arena | ChessZ",
    description:
      "Sharpen your tactical vision with curated puzzles, interactive refutations, and instant engine analysis.",
    url: "https://chesszapp.vercel.app/",
  },
  twitter: {
    title: "Tactical Arena | ChessZ",
    description:
      "Sharpen your tactical vision with curated puzzles, interactive refutations, and instant engine analysis.",
  },
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <span className="text-xs font-mono font-bold text-zinc-400">Loading Tactical Arena...</span>
        </div>
      }
    >
      <TacticalArenaClient />
    </Suspense>
  );
}
