# ♟️ ChessZ — Zero-Paywall Chess Training Platform

> **"Why Pay ₹1,500/yr For Diamond? Unlimited Coach-Verified Training • Free Forever."**  
> Built by FIDE rated coaches at Premier Chess Academy (PCA), Ernakulam.

[![Live Production](https://img.shields.io/badge/Production-Live%20on%20Vercel-emerald?style=for-the-badge&logo=vercel)](https://chesszapp.vercel.app/)
[![License: CC BY 4.0](https://img.shields.io/badge/License-CC%20BY%204.0-blue.svg?style=for-the-badge)](https://creativecommons.org/licenses/by/4.0/)
[![Framework: Next.js 16](https://img.shields.io/badge/Framework-Next.js%2016%20Turbopack-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Database: Supabase](https://img.shields.io/badge/Database-Supabase%20Free%20Tier-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![OAuth: Lichess](https://img.shields.io/badge/OAuth-Lichess%20API-orange?style=for-the-badge&logo=lichess)](https://lichess.org)

---

## 🌐 Live Application
* **Production Deployment:** [https://chesszapp.vercel.app/](https://chesszapp.vercel.app/)
* **Interactive Level Diagnosis:** [https://chesszapp.vercel.app/diagnose](https://chesszapp.vercel.app/diagnose)
* **GitHub Repository:** [https://github.com/ajnassalimks-arch/chessz](https://github.com/ajnassalimks-arch/chessz)

---

## 💡 The Disruption Hook: 100% Free Forever
Traditional platforms restrict free players to **3 puzzles a day** and charge ₹1,500 to ₹10,000/year for unlimited tactical training.

**ChessZ** eliminates this paywall with a clean, high-performance architecture:
* **Unlimited Training:** 100% free access to verified tactical positions.
* **Zero Subscriptions & Zero Ads:** Distraction-free, mobile-first interface.
* **Instant Start:** Zero mandatory signup friction — train immediately as a guest or connect your Lichess account.

---

## 💎 Brand Identity & Visual Language

### 1. Geometric Knight-Z Brandmark (Masterwork A)
* Handcrafted SVG brand identity with sharp 45-degree facets that fuse a noble knight profile with an integrated geometric **'Z'** monogram.
* Evokes authority, strategic precision, and institutional prestige.

### 2. Modernistic Typography Hierarchy
* **Brand & Headers (`Space Grotesk`)**: Algorithmic, proportional geometric sans-serif mirroring the angular cuts of the Knight-Z emblem.
* **Interface & Controls (`Inter`)**: Clean, neutral micro-scale legibility optimized for rapid calculation.
* **Notation & Timers (`JetBrains Mono`)**: Monospace tabular numbers (`tnum`) for jitter-free clock recording and move notation.

---

## 🧠 Interactive 3-Puzzle Level Diagnosis (`/diagnose`)

The diagnostic engine benchmarks a player's tactical vision, calculation speed, and psychological conviction in ~2.5 minutes:

### 1. Curated 10-Puzzle Benchmark Pool
Instead of static tests, `/diagnose` randomly samples 3 balanced, non-repeating puzzles across ratings 850 to 1750:
1. **Opening Benchmark**: Légal's Counter-Trap (850)
2. **Central Fork**: Double-Threat Geometry (950)
3. **Corridor Benchmark**: Back-Rank Overload Decoy (1100)
4. **Pin Benchmark**: Eliminating the Defender (1150)
5. **Trapping Benchmark**: Noah's Ark Trap (1200)
6. **Endgame Benchmark**: Absolute Rank Skewer (1250)
7. **Mating Net**: Smothered Geometry Decoy (1350)
8. **Kingside Destruction**: Greek Gift Sacrifice (1450)
9. **Mating Net**: Anastasia's Corridor (1500)
10. **Master Benchmark**: Kingside Clearance Sacrifice (1750)

### 2. Pure Assessment Mode (Zero Spoilers)
* **Puzzle 1**: Runs in silent assessment mode. The move is recorded with millisecond telemetry without hints, answer reveals, or retries.
* **Puzzles 2 & 3**: Adaptive calibration with mandatory **Psychological Conviction** tracking (*"Sure"*, *"Think so"*, *"Guessing"*).

### 3. Cognitive Dossier Output
* **Estimated Rating**: Real-time calibrated rating (e.g. `~1420`).
* **Cognitive Archetype**: Classifies play into archetypes (e.g. *High Conviction + Accurate*, *Impulsive Tactician*, *Hesitant Calculator*).
* **FIDE Golden Rules**: Actionable coach heuristics targeting the player's primary blindspot.

---

## ⚡ Lichess OAuth 2.0 Integration & Smart Calibration

* **Seamless Connection**: Secure PKCE OAuth 2.0 flow connecting directly to [Lichess.org](https://lichess.org).
* **Live Stats Sync**: Syncs username, profile avatar, and live Rapid & Blitz ratings.
* **Smart Tier Auto-Recommendation**: When connected, ChessZ reads your live rating and places a golden badge on your optimal tier:
  `Recommended for @username (1420 Rapid)`.

---

## 🎯 Tournament-Grade Board & Tactical Annotation Engine

* **Tactical Square Highlights**:
  * 🟢 **Target / Safe Square**: Right-Click
  * 🔴 **Threat / Danger Square**: <kbd>Ctrl</kbd> + Right-Click
  * 🔵 **Plan / Candidate Move**: <kbd>Shift</kbd> + Right-Click
  * 🟡 **Caution / Critical Square**: <kbd>Alt</kbd> + Right-Click
  * ✕ **Auto-Clearing**: Clicking empty space or making a move instantly clears markings.
* **King-in-Check Radial Glow**: Dynamic crimson pulse encircling the defending king when placed in check.
* **Tactical Vector Arrows**: Right-click and drag to project calculation arrows.
* **ChessBase 17 Exterior Bezel**: Outer coordinate rail keeping the 64 squares completely unobstructed.
* **Settings & Help Modal**: Complete shortcuts guide accessible via the Settings icon.

---

## 🎨 Theme Studio & Piece Customization

Players can tailor the board to their preferred study environment via **Settings**:
* **Board Palettes**:
  * **Periwinkle Mist** (Slate Modern — Default)
  * **Emerald Glow** (Brat Cyber Glitter Arena with optional bokeh wallpaper)
  * **Sage Nordic** (Calm Scandinavian Atelier)
  * **Terracotta Kyoto** (Warm Japanese Sandstone)
* **2D Piece Sets**:
  * **Liquid Chrome** (Y2K Molten Metallic)
  * **Neo-Arcade** (Streetwear Art Toy)
  * **Classic** (Standard FIDE Pro)
* **Interactive Animations**:
  * **Animated Red Hand**: Graphic hand that snatches captured pieces off the board.
  * **Light / Dark Mode**: Instant contrast toggle.

---

## 🔊 Zero-Latency Web Audio Synthesizer

* Zero audio assets to fetch — generates sound on-the-fly using the native browser **Web Audio API**.
* Wooden move clicks, deep capture strikes, refutation alarms, and victory arpeggios.
* Header mute toggle synchronized to `localStorage`.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Hosting & Cost |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router, Turbopack, React 19) | Vercel Hobby ($0/mo) |
| **Styling** | Tailwind CSS v4 with custom `@theme` tokens | Vercel Edge ($0/mo) |
| **Chess Engine** | `chess.js` & `react-chessboard` | Client-Side ($0/mo) |
| **Typography** | Space Grotesk + Inter + JetBrains Mono | Google Fonts CDN ($0/mo) |
| **OAuth** | Lichess OAuth 2.0 PKCE (`/api/auth/lichess/*`) | Vercel Serverless ($0/mo) |
| **Audio** | Web Audio API Synthesizer | Native Browser ($0/mo) |
| **Icons** | Lucide React | Zero Cost ($0/mo) |

---

## 🚀 Local Development

```bash
# Clone the repository
git clone https://github.com/ajnassalimks-arch/chessz.git
cd chessz/chessz-app

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

To run a production build:
```bash
npm run build
npm run start
```

---

## ⚖️ License & Attribution
* **Chess Puzzle Data**: Derived from the public domain and open datasets of [Lichess.org](https://lichess.org) under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
* **Pedagogy & Heuristics**: Diagnostic cognitive framework designed by FIDE coaches at Premier Chess Academy (PCA).
* **Codebase**: Licensed under the MIT License.
