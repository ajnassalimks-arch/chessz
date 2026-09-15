# ChessZ — Complete Architecture & AI Agent Handoff Guide

> **For AI Agents & Engineers**: This document provides the complete structural blueprint, data flow diagrams, math algorithms, API specifications, and operational rules for the entire ChessZ codebase.

---

## 1. System Overview & Product Thesis

**ChessZ** is an open-source, zero-paywall chess training platform built to disrupt traditional commercial chess apps (which limit free users to 3 puzzles/day or charge ₹1,500–₹10,000/year for premium features).

### Core Differentiators
1. **100% Free Tactical Arena**: Unlimited curated tactical puzzles across 5 skill tiers (Beginner to Grandmaster).
2. **Interactive 3-Puzzle Diagnostic Benchmark (`/diagnose`)**: Calibrates accurate Elo in under 3 minutes using millisecond move telemetry, psychological conviction tracking (*"Sure"*, *"Think so"*, *"Guessing"*), and behavioral archetypes.
3. **Weakness Studio (`/weakness`) & Blunder Trainer**: Connects to any player's Lichess account (via OAuth PKCE or public username) to stream and parse their recent games, extract exact blunder positions where they threw, and categorize them into 5 actionable pedagogical pillars.
4. **Client-Side Stockfish 16 WASM**: Multi-threaded in-browser engine running with 0ms server latency and $0/mo server compute cost. Auto-reveals real-time evaluation and top 4 continuation moves upon puzzle completion.
5. **Tournament-Grade Board Engine**: `react-chessboard` + `chess.js` wrapped in a custom bezel (`ChessboardFrame.tsx`) with right-click tactical annotations, outside coordinates, check radial glow, and Web Audio API synthesized sounds.

---

## 2. Directory Structure & File Map

```
c:\ChessZ\chessz-app\
├── app/
│   ├── api/
│   │   ├── auth/lichess/          # Lichess OAuth 2.0 PKCE flow (login, callback, me, logout)
│   │   ├── cron/keepalive/        # Vercel cron heartbeat for serverless warm-up
│   │   └── lichess/
│   │       ├── blunders/route.ts  # Extracts blunder puzzles with setupMoves from games
│   │       ├── games/stream/      # Streaming NDJSON proxy with browser fallback
│   │       └── user/validate/     # Lichess username lookup & validation
│   ├── diagnose/
│   │   └── page.tsx               # 3-Puzzle diagnostic benchmark & cognitive dossier
│   ├── weakness/
│   │   └── page.tsx               # Standalone Weakness Studio deep analytics page
│   ├── layout.tsx                 # Root layout with global metadata, fonts, and styles
│   └── page.tsx                   # Main Tactical Arena, lobby, and curriculum trainer
├── components/
│   ├── pieces/                    # Custom SVG piece sets (Liquid Chrome, Neo-Arcade, Classic)
│   ├── ChessboardFrame.tsx        # Outer bezel, coordinate rails, square highlights & check glow
│   ├── LichessModal.tsx           # Lichess login/connection modal + official LichessIcon SVG
│   ├── SettingsModal.tsx          # Palette switcher, piece selector, wallpaper toggle, sound mute
│   ├── ThemeSwitcher.tsx          # Board color themes & theme tokens
│   └── WeaknessDashboard.tsx      # Modal blunder trainer with 2-move stepper (BlunderCardItem)
├── lib/
│   ├── chessMetrics/              # Pure TypeScript math engine
│   │   ├── gameParser.ts          # PGN tokenizer, phase detection, eval extraction
│   │   ├── math.ts                # Centipawns-to-win% curve, accuracy formula, Wilson score
│   │   └── types.ts               # Data interfaces for games, plies, stats, and critical moments
│   ├── diagnosisEngine.ts         # 10-puzzle benchmark pool, seed rating, behavioral classifiers
│   ├── lichess.ts                 # Lichess user interfaces & API helpers
│   ├── lichessStream.ts           # Client-side streaming reader for NDJSON games
│   ├── mistakeClassifier.ts       # 5-pillar blunder categorization engine
│   ├── puzzles.ts                 # Core puzzle datasets (CONTINUOUS, DIAGNOSTIC, ALL_PUZZLES_MAP)
│   ├── sounds.ts                  # Web Audio API zero-latency procedural synthesizer
│   ├── supabaseWeakness.ts        # Supabase caching layer for scanned games & stats
│   ├── useLichess.ts              # React hook managing Lichess auth state & storage
│   └── useStockfish.ts            # Stockfish 16 WASM Web Worker controller
├── public/
│   ├── pieces/lichess/            # Standard piece SVG assets
│   ├── stockfish/                 # stockfish.js, stockfish.wasm, stockfish.wasm.js
│   ├── wallpapers/                # Background wallpaper textures (emerald-glitter.jpg)
│   ├── logo-icon.png              # Geometric Knight-Z brandmark
│   └── og-image.jpg               # OpenGraph social banner
├── tests/
│   ├── behavioralPatterns.test.ts # Tests for conviction & archetype classifications
│   ├── chessMetrics.test.ts       # Tests for pure math, winPct, and PGN tokenization
│   ├── diagnosticCon1.test.ts     # Category rules & refutation trees
│   ├── diagnosticCon2.test.ts     # Velocity heuristic & novelty crucible
│   ├── diagnosticCon3.test.ts     # Master ceiling & grandmaster crucible
│   └── qaStress.test.ts           # Stress testing boundary conditions & edge cases
├── AGENTS.md                      # Instructions for autonomous AI agents
├── CLAUDE.md                      # Quick reference file for AI assistants
├── package.json                   # Dependencies, scripts, test runner
└── README.md                      # Public project documentation
```

---

## 3. Core Routing & State Architecture

### A. Route 1: The Main Arena (`/` ➔ `app/page.tsx`)
- **Primary Responsibility**: Tactical puzzle training, level selection lobby, 5-puzzle diagnostic curriculum, and post-curriculum review.
- **Key State Variables**:
  - `game`: Current `chess.js` instance.
  - `currentPuzzle`: Active `ChessPuzzle` object with `solutionMoves`, `defaultRefutation`, and `ruleTitle`.
  - `puzzleStatus`: `"solving"` | `"solved"` | `"failed"`.
  - `engineEnabled` & `evaluation`: Stockfish WASM evaluation state (`useStockfish`).
  - `showLichessModal`: Controls the Lichess connection modal.
  - `showWeaknessDashboard`: Controls the in-arena `WeaknessDashboard` modal.
- **Auto-Reveal Engine Integration**:
  When `handleMoveAttempt` validates `isCorrect === true`:
  ```typescript
  setEngineEnabled(true);
  startAnalysis(testChess.fen());
  ```
  Renders a mini-eval bar inside the solved banner with numerical score (`Eval: +3.4` or `Mate in 2`), top 4 continuation moves, and the `WASM` badge.
  When loading the next puzzle (`loadPuzzle`), the engine is cleanly stopped (`stopAnalysis()`) and disabled to avoid leaking moves across positions.

### B. Route 2: The 3-Puzzle Skill Diagnostic (`/diagnose` ➔ `app/diagnose/page.tsx`)
- **Primary Responsibility**: Rapid 3-puzzle diagnostic benchmark estimating true playing strength.
- **Flow**:
  1. **Trial 1**: Silent calibration puzzle (zero hints, zero immediate feedback, pure calculation telemetry).
  2. **Trial 2 & 3**: Adaptive difficulty puzzles with psychological conviction prompt (*"Sure"*, *"Think so"*, *"Guessing"*).
  3. **Results Screen**: Generates estimated Elo (`calibratedRating`), cognitive archetype (e.g., *Tactical Precisionist*, *Overconfident Striker*, *Hesitant Calculator*), and a 1-click button to start a targeted 5-puzzle curriculum on `/`.

### C. Route 3: Deep Weakness Studio (`/weakness` ➔ `app/weakness/page.tsx`)
- **Primary Responsibility**: Full-page analytics studio scanning up to 50 recent Lichess games.
- **Key Capabilities**:
  - Dual-mode game streaming: tries direct browser fetch to `https://lichess.org/api/games/user/...` with backoff retry, falling back to `/api/lichess/games/stream` if CORS or rate limits occur.
  - Parses PGN comments to extract Lichess server evaluations (`[%eval +3.4]`).
  - Classifies critical turning points into Opening, Middlegame, and Endgame phases.
  - Provides direct deep links to review the game on Lichess (`m.deepLink`).

---

## 4. Key Components & Modals

### 1. `components/WeaknessDashboard.tsx` (In-Arena Blunder Trainer)
- **Role**: Lightweight modal popup opening directly on `/` so players can drill real-game blunders without leaving the board.
- **Component `BlunderCardItem`**:
  - Displays blunder info: `moveNumber`, `playedSan`, `evalSwingPawns`, and `bestSan`.
  - **Preceding Move Stepper**: Features `◀` and `▶` buttons plus clickable move pills (`sm.turnPrefix sm.san`) allowing players to walk back through the preceding 2 moves (`setupMoves`) to see how the tactical crisis developed.
  - **Fix It Button**: Launches training on the blunder position with 1 click.

### 2. `components/LichessModal.tsx`
- **Role**: Authentication and identity management.
- **Features**:
  - **Official SVG Emblem (`LichessIcon`)**: High-fidelity Simple Icons 24×24 vector (`viewBox="0 0 24 24"`) used across all buttons and headers.
  - **1-Click OAuth 2.0**: Direct PKCE sign-in.
  - **Username Lookup**: Non-OAuth fallback allowing any public player's username to be inspected.
  - **Rating Showcase**: Live Rapid, Blitz, Bullet, and Puzzle ratings.

### 3. `components/ChessboardFrame.tsx`
- **Role**: Custom tournament exterior bezel for `react-chessboard`.
- **Features**:
  - Exterior rank (1–8) and file (a–h) coordinate rails that never cover pieces.
  - Radial pulse animation on the King square when in check.
  - Right-click tactical square highlights (Green, Red, Blue, Yellow).
  - Arrow project calculations.

---

## 5. Mathematical Models & Classification Heuristics

All pure calculation functions reside in [`lib/chessMetrics/math.ts`](file:///c:/ChessZ/chessz-app/lib/chessMetrics/math.ts) and [`lib/mistakeClassifier.ts`](file:///c:/ChessZ/chessz-app/lib/mistakeClassifier.ts).

### A. Centipawns to Win Probability (Lichess Model)
Transforms centipawns ($cp$) into win percentage ($0 \le winPct \le 100$):
$$\text{winPct}(cp) = 50 + 50 \times \left( \frac{2}{1 + e^{-0.00368208 \times \text{clamp}(cp, -1000, 1000)}} - 1 \right)$$
- If White has mate in $N$: $\text{winPct} = 100$.
- If Black has mate in $N$: $\text{winPct} = 0$.

### B. Move Accuracy Formula
Evaluates move quality based on win percentage loss between before and after:
$$\text{accuracy}(\Delta winPct) = 103.1668 \times e^{-0.04354 \times \Delta winPct} - 3.1669$$
Clamped strictly to $[0, 100]$.

### C. Wilson Score Interval
Calculates 95% confidence lower and upper bounds for tactical success rates:
$$p \pm \frac{z^2}{2n} \pm z \sqrt{\frac{p(1-p)}{n} + \frac{z^2}{4n^2}} \Big/ \left(1 + \frac{z^2}{n}\right)$$
Used to provide statistically sound blunder frequencies without sample size distortion.

### D. 5-Pillar Blunder Taxonomy
Classifies any blunder into one of 5 skill categories based on game phase, piece values, and tactical patterns:
1. `hanging`: Unprotected pieces, basic forks, simple undefended captures.
2. `threat`: Overlooked opponent threats, failing to block or parry checks.
3. `tactical`: Pins, skewers, discovered attacks, deflection, clearance.
4. `opening`: Early blunders ($\le 10$ moves), premature queen sorties, neglected castling.
5. `endgame`: King activity, pawn promotion races, rook endings ($\le 6$ pieces left).

---

## 6. Testing & Quality Assurance Protocols

The test suite is located in `tests/` and executes using Node's native runner via `tsx`:

```bash
# Run all automated tests (30/30 suites)
npm test

# Run TypeScript type check (must exit 0 with zero errors)
npx tsc --noEmit

# Run Next.js production build (Turbopack, must generate 17/17 pages)
npm run build
```

### Critical Verification Rules for AI Agents
1. **Never introduce duplicate navigation or action buttons** in headers.
2. **Always test responsive mobile viewports**: headers use `hidden md:flex` for tabs; ensure mobile actions stay accessible.
3. **Preserve WASM Stockfish Lifecycle**: Always stop the engine (`stopAnalysis()`) when changing positions or unmounting.
4. **Never commit broken SVGs**: The Lichess logo must use the official 24×24 vector (`LichessIcon`).
5. **Zero-Yapping Protocol**: Keep user communication concise, direct, high-signal, and free of fluff.
