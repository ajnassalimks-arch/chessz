import type { Metadata } from "next";
import TermsClient from "./TermsClient";

export const metadata: Metadata = {
  title: "Study Chess Terms & Master Coach Academy",
  description:
    "Interactive coach-led study of chess terms and rules used in ChessZ. Brainstorm real historical master positions from Morphy, Fischer, Capablanca, and Steinitz.",
  keywords: [
    "Chess Terms",
    "Chess Tactics Glossary",
    "Chess Rules Explained",
    "2-Second Bodyguard Rule",
    "Zwischenzug",
    "Greek Gift Sacrifice",
    "Smothered Mate",
    "Tarrasch Active Rook",
    "Chess Coach Brainstorm",
    "ChessZ Coach Academy"
  ],
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    title: "Study Chess Terms & Master Coach Academy | ChessZ",
    description:
      "Interactive coach-led study of chess terms and rules used in ChessZ. Brainstorm real historical master positions from Morphy, Fischer, Capablanca, and Steinitz.",
    url: "https://chesszapp.vercel.app/terms",
  },
  twitter: {
    title: "Study Chess Terms & Master Coach Academy | ChessZ",
    description:
      "Interactive coach-led study of chess terms and rules used in ChessZ. Brainstorm real historical master positions from Morphy, Fischer, Capablanca, and Steinitz.",
  },
};

export default function TermsPage() {
  return <TermsClient />;
}
