import type { Metadata } from "next";
import { Suspense } from "react";
import TacticalArenaClient from "./_client";

export const metadata: Metadata = {
  title: {
    absolute: "ChessZ",
  },
  description:
    "Replay where you went wrong. In-browser Stockfish analysis of your real games, pedagogical weakness diagnosis, and verified tactical training.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ChessZ",
    description:
      "Replay where you went wrong. In-browser Stockfish analysis of your real games, pedagogical weakness diagnosis, and verified tactical training.",
    url: "https://chesszapp.vercel.app/",
  },
  twitter: {
    title: "ChessZ",
    description:
      "Replay where you went wrong. In-browser Stockfish analysis of your real games, pedagogical weakness diagnosis, and verified tactical training.",
  },
};

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0d1117] flex flex-col items-center justify-center space-y-3">
          <div className="w-8 h-8 rounded-full border-2 border-emerald-500 border-t-transparent animate-spin" />
          <span className="text-xs font-mono font-bold text-zinc-400">Loading ChessZ...</span>
        </div>
      }
    >
      <TacticalArenaClient />
    </Suspense>
  );
}
