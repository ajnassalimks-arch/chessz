import type { Metadata } from "next";
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
  return <TacticalArenaClient />;
}
