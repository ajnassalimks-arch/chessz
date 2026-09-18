# ♟️ ChessZ — Zero-Paywall Chess Training Platform

> **"Why Pay ₹1,500/yr For Diamond? Unlimited Coach-Verified Training • Free Forever."**  
> Built with coaching pedagogy developed in consultation with academy coaches at Premier Chess Academy (PCA), Ernakulam.

[![Live Production](https://img.shields.io/badge/Production-Live%20on%20Vercel-emerald?style=for-the-badge&logo=vercel)](https://chesszapp.vercel.app/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](./LICENSE)
[![Framework: Next.js 16](https://img.shields.io/badge/Framework-Next.js%2016%20Turbopack-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Database: Supabase](https://img.shields.io/badge/Database-Supabase%20Free%20Tier-green?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![OAuth: Lichess](https://img.shields.io/badge/OAuth-Lichess%20API-orange?style=for-the-badge&logo=lichess)](https://lichess.org)
[![Engine: Stockfish WASM](https://img.shields.io/badge/Engine-Stockfish%20WASM-blueviolet?style=for-the-badge)](https://stockfishchess.org/)

---

## 🌐 Live Application
* **Production Deployment:** [https://chesszapp.vercel.app/](https://chesszapp.vercel.app/)
* **Interactive Skill Diagnosis:** [https://chesszapp.vercel.app/diagnose](https://chesszapp.vercel.app/diagnose)
* **Weakness Studio:** [https://chesszapp.vercel.app/weakness](https://chesszapp.vercel.app/weakness)
* **Study Terms (Lexicon):** [https://chesszapp.vercel.app/terms](https://chesszapp.vercel.app/terms)
* **GitHub Repository:** [https://github.com/ajnassalimks-arch/chessz](https://github.com/ajnassalimks-arch/chessz)

---

## 💡 The Disruption Hook: 100% Free Forever
Commercial chess platforms restrict free players to **3 puzzles a day** and charge ₹1,500 to ₹10,000/year for unlimited tactical training and blunder reviews.

**ChessZ** eliminates this paywall with a clean, high-performance architecture:
* **Unlimited Training:** 100% free access to verified tactical positions.
* **Zero Subscriptions & Zero Ads:** Distraction-free, mobile-first interface.
* **Instant Start:** Zero mandatory signup friction — train immediately as a guest or connect your Lichess account.

---

## 🧭 The 4 Core Routes

ChessZ is organized around a unified four-view navigation hierarchy:

```
                      ┌───────────────────────────────────────────────┐
                      │                  ChessZ App                   │
                      └───────────────────────┬───────────────────────┘
         ┌─────────────────────────┬──────────┴──────────────┬─────────────────────────┐
         ▼                         ▼                         ▼                         ▼
   Train (`/`)            Skill Test (`/diagnose`)   Weakness (`/weakness`)     Study Terms (`/terms`)
• Tactical Arena          • 5-Puzzle Benchmark       • 50-Game NDJSON Stream    • 21 Historical Studies
• 4-Tier Lobby            • Millisecond Telemetry    • Phase Loss Metrics       • Interactive Board Replay
• Blunder Trainer         • Conviction Tracking      • In-Browser Stockfish     • Contextual Study Terms
• Stockfish Auto-Eval     • Cognitive Dossier        • Critical Moments         • Coach Definitions & Tips
```

---

## 🧠 Interactive 5-Puzzle Level Diagnosis (`/diagnose`)

The diagnostic engine benchmarks a player's tactical vision, calculation speed, and psychological conviction in ~2.5 minutes:

### 1. Curated 16-Puzzle Benchmark Pool
Instead of static quizzes, `/diagnose` dynamically samples 5 balanced, non-repeating puzzles across ratings 850 to 1750:
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

## 🔍 Weakness Studio (`/weakness`) & In-Arena Blunder Trainer

### 1. Dual-Mode Lichess Game Streaming
- Direct client-side streaming reader (`lib/lichessStream.ts`) that fetches NDJSON from Lichess incrementally.
- Automatic fallback proxy (`/api/lichess/games/stream`) with exponential backoff if browser CORS or rate limits occur.
- Fast browser-side parsing extracts existing Lichess server evaluations (`[%eval +3.4]`) with 0ms server compute.

### 2. 5-Pillar Blunder Classification
Classifies real game mistakes into 5 skill-calibrated categories:
1. **Hanging Pieces & Simple Tactics**: Unprotected pieces, undefended captures.
2. **Threat Perception & Defense**: Overlooked checks, missed king attacks.
3. **Calculation Depth & Complex Geometry**: Multi-ply combinations, clearance, deflections.
4. **Opening Principles & Traps**: Moves $\le 10$, development negligence, uncastled king.
5. **Endgame Conversion & Technique**: King activity, pawn breakthrough, technical rooks.

### 3. Preceding Move Stepper (`BlunderCardItem`)
Each blunder card provides an interactive move stepper (`◀` `▶` or step pills) that lets players walk through the preceding 2 moves (`setupMoves`) to see how the tactical crisis developed before attempting the fix.

---

## ⚡ Client-Side Stockfish WASM & Auto-Reveal Eval Bar

* **Client-Side Engine**: In-browser single-threaded Stockfish WASM running in a background Web Worker (zero server compute).
* **Auto-Reveal on Solved**: When a puzzle is solved, Stockfish immediately analyzes the position and displays:
  * Canonical evaluation score (`+3.4`, `-1.2`, `Mate in 2`).
  * Top 4-ply engine continuation line (`Top: Nf3 d5 d4 e6`).
  * Green `WASM` engine badge.
* **Clean Lifecycle**: Engine automatically stops (`stopAnalysis()`) when changing positions, avoiding memory leaks.

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

---

## 🎨 Theme Studio & Piece Customization

Players can tailor the board to their preferred study environment via **Settings**:
* **Board Palettes**:
  * **Periwinkle Mist** (Slate Modern — Default)
  * **Emerald Glow** (Brat Cyber Glitter Arena with optional bokeh wallpaper)
  * **Sage Nordic** (Calm Scandinavian Atelier)
  * **Terracotta Kyoto** (Warm Japanese Sandstone)
* **2D Piece Sets**:
  * **Classic Staunton** (Official Staunton Vectors by cburnett)
  * **Liquid Chrome** (Y2K Molten Metallic)
  * **Neo-Arcade** (Streetwear Art Toy)
* **Light / Dark Mode**: Instant contrast toggle.

---

## 🔊 Zero-Latency Web Audio Synthesizer

* Zero audio assets to fetch — generates procedural audio on-the-fly using the native browser **Web Audio API**.
* Wooden move clicks, deep capture strikes, refutation alarms, and victory arpeggios.
* Header mute toggle synchronized to `localStorage`.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technology | Hosting & Execution |
| :--- | :--- | :--- |
| **Framework** | Next.js 16 (App Router, Turbopack, React 19) | Vercel Hobby |
| **Styling** | Tailwind CSS v4 with custom `@theme` tokens | Client-Side |
| **Chess Engine** | Stockfish.js (single-threaded WASM) + `chess.js` v1 | In-Browser Web Worker |
| **Typography** | Space Grotesk + Inter + JetBrains Mono | Google Fonts CDN (OFL) |
| **OAuth** | Lichess OAuth 2.0 PKCE (`/api/auth/lichess/*`) | Vercel Serverless |
| **Streaming** | Browser ReadableStream + NDJSON Parser | Client-Side |
| **Audio** | Native Web Audio API Procedural Synthesizer | Native Browser |
| **Icons** | Official Lichess Vector + Lucide React | Client-Side |

---

## 🧪 Testing & Quality Assurance

ChessZ features an automated test suite verifying pure mathematical formulas, game parsing, phase detection, puzzle integrity, and edge-case boundary conditions:

```bash
# Run 52 automated tests across 7 suites
npm test

# Run TypeScript type check (0 errors required)
npx tsc --noEmit

# Run Next.js 16 production build
npm run build
```

---

## 📖 AI Agent & Developer Guide

For detailed technical specifications, state machines, math models, and architectural handoff instructions, see:
👉 **[`ARCHITECTURE_AND_AGENT_GUIDE.md`](./ARCHITECTURE_AND_AGENT_GUIDE.md)**

---

## ⚖️ License & Attribution
* **Chess Puzzle Data**: Puzzles courtesy of [Lichess.org](https://lichess.org) under the [CC0 1.0](https://creativecommons.org/publicdomain/zero/1.0/) Universal Public Domain Dedication.
* **Chess Engine**: Powered by [Stockfish.js](https://github.com/niklasf/stockfish.js) (GNU GPLv3).
* **Piece Artwork**: Staunton vectors by Colin M.L. Burnett (cburnett, CC BY-SA 3.0 / GPL) and Lichess contributors (AGPLv3).
* **Pedagogy & Heuristics**: Diagnostic cognitive framework designed in consultation with academy chess coaches.
* **Codebase**: Licensed under the [MIT License](./LICENSE).
