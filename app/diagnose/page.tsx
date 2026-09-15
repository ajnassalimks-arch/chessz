import type { Metadata } from "next";
import DiagnoseClient from "./_client";

export const metadata: Metadata = {
  title: "5-Puzzle Diagnostic Benchmark",
  description:
    "Calibrate your chess rating and pinpoint cognitive tactical leaks in a 5-puzzle diagnostic benchmark with in-browser analysis.",
  alternates: {
    canonical: "/diagnose",
  },
  openGraph: {
    title: "5-Puzzle Diagnostic Benchmark | ChessZ",
    description:
      "Calibrate your chess rating and pinpoint cognitive tactical leaks in a 5-puzzle diagnostic benchmark with in-browser analysis.",
    url: "https://chesszapp.vercel.app/diagnose",
  },
  twitter: {
    title: "5-Puzzle Diagnostic Benchmark | ChessZ",
    description:
      "Calibrate your chess rating and pinpoint cognitive tactical leaks in a 5-puzzle diagnostic benchmark with in-browser analysis.",
  },
};

export default function DiagnosePage() {
  return <DiagnoseClient />;
}
