import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://chesszapp.vercel.app"),
  title: {
    default: "ChessZ — Free Offline Chess Tactics & Level Diagnosis",
    template: "%s | ChessZ"
  },
  description: "Free offline chess tactics trainer, 3-puzzle diagnostic level benchmark, and cognitive telemetry. 500+ curated Lichess puzzles, 100% free with no subscription.",
  keywords: [
    "ChessZ",
    "Chess Z",
    "chessz app",
    "chess tactics",
    "chess puzzles",
    "free chess tactics",
    "chess level diagnosis",
    "chess rating benchmark",
    "offline chess",
    "offline chess puzzles",
    "free chess coach",
    "chess calculation trainer"
  ],
  authors: [{ name: "ChessZ Team" }],
  creator: "ChessZ",
  publisher: "ChessZ",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://chesszapp.vercel.app",
    siteName: "ChessZ",
    title: "ChessZ — Free Offline Chess Tactics & Level Diagnosis",
    description: "Discover your true chess level in 3 diagnostic puzzles. 100% offline, zero paywalls, FIDE coach telemetry.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1024,
        height: 1024,
        alt: "ChessZ — Master Identity",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ChessZ — Free Offline Chess Tactics & Level Diagnosis",
    description: "Discover your true chess level in 3 diagnostic puzzles. 100% offline, zero paywalls, FIDE coach telemetry.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      data-theme="periwinkle"
      data-mode="light"
      className="h-full antialiased"
      suppressHydrationWarning
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "ChessZ",
              "alternateName": ["Chess Z", "ChessZ App"],
              "url": "https://chesszapp.vercel.app",
              "applicationCategory": "GameApplication",
              "operatingSystem": "All",
              "browserRequirements": "Requires modern web browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "description": "Free offline chess tactics trainer and diagnostic level benchmark with FIDE coach cognitive telemetry."
            })
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('chessz_theme') || 'periwinkle';
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
      </body>
    </html>
  );
}
