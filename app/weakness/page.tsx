import type { Metadata } from "next";
import WeaknessDashboardPage from "./_client";

export const metadata: Metadata = {
  title: "Lichess Weakness Studio",
  description:
    "Analyze your Lichess games, opening repertoire, blunder patterns, and tactical weaknesses with client-side Stockfish.",
  alternates: {
    canonical: "/weakness",
  },
  openGraph: {
    title: "Lichess Weakness Studio | ChessZ",
    description:
      "Analyze your Lichess games, opening repertoire, blunder patterns, and tactical weaknesses with client-side Stockfish.",
    url: "https://chesszapp.vercel.app/weakness",
  },
  twitter: {
    title: "Lichess Weakness Studio | ChessZ",
    description:
      "Analyze your Lichess games, opening repertoire, blunder patterns, and tactical weaknesses with client-side Stockfish.",
  },
};

export default function Page() {
  return (
    <>
      <section className="sr-only">
        <h1>ChessZ Weakness Studio — Lichess Game & Blunder Analytics</h1>
        <p>
          Analyze your recent Lichess games to uncover tactical leaks, phase transitions,
          opening repertoire win rates, and critical mistakes evaluated by client-side Stockfish.
        </p>
      </section>
      <WeaknessDashboardPage />
    </>
  );
}
