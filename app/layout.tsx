import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeSwitcher } from "@/components/ThemeSwitcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ChessZ — Modern Offline Chess Tactics & Cognitive Mastery",
  description: "500 offline Lichess puzzles, diagnostic tactical assessment, and commercial-grade 2026 minimalist design.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="sage"
      data-mode="light"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('chessz_theme') || 'sage';
                  var m = localStorage.getItem('chessz_mode') || 'light';
                  document.documentElement.setAttribute('data-theme', t);
                  document.documentElement.setAttribute('data-mode', m);
                  if (m === 'dark') {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col selection:bg-neutral-300 dark:selection:bg-neutral-700">
        {children}
        <ThemeSwitcher />
      </body>
    </html>
  );
}
