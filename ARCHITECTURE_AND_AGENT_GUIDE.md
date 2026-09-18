# ChessZ — Complete Architecture & AI Agent Handoff Guide

> **For AI Agents & Engineers**: This document provides the complete structural blueprint, data flow diagrams, math algorithms, API specifications, and operational rules for the entire ChessZ codebase.

---

## 1. System Overview & Product Thesis

**ChessZ** is an open-source, zero-paywall chess training platform built to disrupt traditional commercial chess apps (which limit free users to 3 puzzles/day or charge ₹1,500–₹10,000/year for premium features).

### Core Differentiators
1. **100% Free Tactical Arena**: Unlimited curated tactical puzzles across 4 skill tiers (Beginner to Advanced).
2. **Interactive 5-Puzzle Diagnostic Benchmark (`/diagnose`)**: A starting estimate from 5 trials using move-time telemetry and conviction tracking (*"Sure"*, *"Think so"*, *"Guessing"*). No single trial may move the estimate by more than `MAX_TRIAL_SWING` (120 points), because 5 puzzles is a small sample.
3. **Weakness Studio (`/weakness`) & Blunder Trainer**: Connects to any player's Lichess account (via OAuth PKCE or public username) to stream and parse their recent games, extract exact blunder positions, and categorize them into actionable pedagogical categories.
4. **Client-Side Stockfish WASM**: Single-threaded in-browser engine running in a Web Worker with 0ms server latency and zero server compute cost. Auto-reveals real-time evaluation and top 4 continuation moves upon puzzle completion.
5. **Tournament-Grade Board Engine**: `react-chessboard` + `chess.js` wrapped in a custom bezel (`ChessboardFrame.tsx`) with right-click tactical annotations, outside coordinates, check radial glow, and Web Audio API synthesized sounds.

---

## 2. Directory Structure & File Map

```
c:\ChessZ\chessz-app\
├── app/
│   ├── _client.tsx            # Client component for Tactical Arena
│   ├── api/
│   │   ├── auth/lichess/      # Lichess OAuth 2.0 PKCE flow (login, callback, me, logout)
│   │   ├── cron/keepalive/    # Vercel cron heartbeat for serverless warm-up
│   │   └── lichess/
│   │       ├── games/stream/  # Streaming NDJSON proxy with browser fallback
│   │       └── user/validate/ # Lichess username lookup & validation
│   ├── diagnose/
│   │   ├── _client.tsx        # 5-Puzzle diagnostic benchmark client component
│   │   └── page.tsx           # Server component with route metadata & canonical link
│   ├── weakness/
│   │   ├── _client.tsx        # Standalone Weakness Studio client component
│   │   └── page.tsx           # Server component with indexable intro & metadata
│   ├── layout.tsx             # Root layout with metadataBase, fonts, analytics, styles
│   └── page.tsx               # Server component for homepage with dedicated metadata
├── components/
│   ├── pieces/                # Staunton SVG pieces (cburnett) & theme support
│   ├── ChessboardFrame.tsx    # Outer bezel, coordinate rails, square highlights & check glow
│   ├── ChessZLogo.tsx         # Official ChessZ 4x4 vector brandmark & lockups
│   ├── LichessModal.tsx       # Lichess login/connection modal + official LichessIcon SVG
│   ├── SettingsModal.tsx      # Palette switcher, piece selector, wallpaper toggle, sound mute
│   ├── ThemeSwitcher.tsx      # Board color themes & theme tokens
│   └── WeaknessDashboard.tsx  # Modal blunder trainer with 2-move stepper (BlunderCardItem)
├── lib/
│   ├── chessMetrics/          # Pure TypeScript math engine
│   ├── blunderAdapter.ts      # critical moment -> trainable puzzle
│   ├── useWeaknessScan.ts     # THE scan pipeline (page + modal share it)
│   │   ├── gameParser.ts      # PGN tokenizer, phase detection, eval extraction
│   │   ├── math.ts            # Centipawns-to-win% curve, accuracy formula, Wilson score
│   │   └── types.ts           # Data interfaces for games, plies, stats, and critical moments
│   ├── diagnosisEngine.ts     # 16-puzzle benchmark pool, adaptive selector, bounded Elo
│   ├── lichess.ts             # Lichess user interfaces & API helpers
│   ├── lichessStream.ts       # Client-side streaming reader for NDJSON games
│   ├── mistakeClassifier.ts   # 3-tier x 5-category blunder taxonomy (TIER_CATEGORY_DEFINITIONS)
│   ├── puzzles.ts             # 500 authentic Lichess puzzles (CONTINUOUS, DIAGNOSTIC, ALL_PUZZLES_MAP)
│   ├── sounds.ts              # Web Audio API zero-latency procedural synthesizer
│   ├── supabaseWeakness.ts    # Supabase caching layer for scanned games & stats
│   ├── useLichess.ts          # React hook managing Lichess auth state & storage
│   └── useStockfish.ts        # Stockfish WASM Web Worker controller
├── public/
│   ├── pieces/lichess/        # Standard piece SVG assets
│   ├── stockfish/             # stockfish.js, stockfish.wasm, stockfish.wasm.js
│   ├── wallpapers/            # Background wallpaper textures (emerald-glitter.jpg)
│   ├── logo-mark.svg          # Official vector brandmark
│   └── og-image.jpg           # OpenGraph social banner
├── tests/
│   ├── chessMetrics.test.ts          # Pure math, winPct curve, PGN tokenization
│   ├── diagnosticEnhancements.test.ts # Category rules, velocity heuristic, master ceiling
│   ├── puzzleIntegrity.test.ts       # Validates FENs, solution lines, mates, and refutations
│   └── qaStress.test.ts              # Stress testing boundary conditions & edge cases
├── AGENTS.md                  # Instructions for autonomous AI agents
├── CLAUDE.md                  # Quick reference file for AI assistants
├── LICENSE                    # MIT License
├── package.json               # Dependencies, scripts, test runner
└── README.md                  # Public project documentation
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

### B. Route 2: The 5-Puzzle Skill Diagnostic (`/diagnose` ➔ `app/diagnose/page.tsx`)
- **Primary Responsibility**: Rapid 5-puzzle diagnostic benchmark (+1 optional Grandmaster Crucible) estimating true playing strength.
- **Flow**:
  1. **Trial 1**: Historic Opening Radar benchmark puzzle (`HISTORICAL_BENCHMARKS_STAGE_1`).
  2. **Trial 2**: Historic Tactical Geometry benchmark puzzle (`HISTORICAL_BENCHMARKS_STAGE_2`).
  3. **Trials 3–5**: Dynamic adaptive puzzles chosen in real-time from the 500-puzzle Lichess pool (`selectAdaptivePuzzle`) with psychological conviction prompt (*"Sure"*, *"Think so"*, *"Guessing"*).
  4. **Trial 6 (Optional)**: Grandmaster Crucible ($K=260$), unlocked if player scores 5/5 first-try correct and achieves $\ge 1700$ rating.
  5. **Results Screen**: Generates converged rating (`calibratedRating`), behavioral archetype, and an option to train targeted blindspots on `/`.

### C. Route 3: Deep Weakness Studio (`/weakness` ➔ `app/weakness/page.tsx`)
- **Primary Responsibility**: Full-page analytics studio scanning up to 50 recent Lichess games.
- **Key Capabilities**:
  - A single pipeline (`lib/useWeaknessScan.ts`) shared with the in-arena trainer. Dual-mode game streaming: tries direct browser fetch to `https://lichess.org/api/games/user/...` with backoff retry, falling back to `/api/lichess/games/stream` if CORS or rate limits occur.
  - Smart Game Merging: Preserves previously computed client-side Stockfish evaluations (`evalSource: 'local'`) across syncs without losing 50-game history.
  - Multi-pass in-browser Stockfish WASM sweep (80k nodes pass 1 ➔ 300k nodes pass 2 refinement) for games lacking Lichess computer evals (`evalSource: 'none'`).
  - Classifies critical turning points into Opening, Middlegame, and Endgame phases.
  - Provides direct deep links to review the game on Lichess (`m.deepLink`).

### D. Route 4: Study Terms & Master Lexicon (`/terms` ➔ `app/terms/page.tsx`)
- **Primary Responsibility**: Interactive pedagogical encyclopedia featuring 21 real master historical positions (e.g. Greek Gift, Smothered Mate, Légal's Trap, Noah's Ark, Anastasia's Corridor).
- **Key Capabilities**:
  - Full board replay of master lines and candidate moves with historical citations and annotations.
  - Study terms also surface contextually on blunder cards via `TermHoverCard`, rather than only inside this route.
  - Quick hover preview cards (`components/TermHoverCard.tsx`) embedded throughout the app.

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
Calculates 95% confidence lower and upper bounds for opening repertoire performance:
$$p \pm \frac{z^2}{2n} \pm z \sqrt{\frac{p(1-p)}{n} + \frac{z^2}{4n^2}} \Big/ \left(1 + \frac{z^2}{n}\right)$$
Used in `lib/chessMetrics/gameParser.ts` to compute statistically sound opening win rates and confidence intervals without small-sample distortion.

### D. Blunder Taxonomy
Classifies blunders using the 3-tier x 5-category matrix defined in `TIER_CATEGORY_DEFINITIONS` (`lib/mistakeClassifier.ts`):
1. `hanging_piece`: Unprotected pieces, loose pieces dropping off.
2. `threat_missed`: Overlooked opponent threats, failing to parry attacks.
3. `tactical_leak`: Pins, skewers, discovered attacks, clearance, deflections.
4. `opening_development`: Early blunders, king safety, neglected development.
5. `endgame_technique`: King activity, pawn promotion races, conversion technique.

---

## 6. Testing & Quality Assurance Protocols

The test suite is located in `tests/` and executes using Node's native runner via `tsx`:

```bash
# Run all automated tests (52 tests in 7 suites)
npm test

# Run TypeScript type check (must exit 0 with zero errors)
npx tsc --noEmit

# Run Next.js production build (Turbopack, must generate all 17 routes)
npm run build
```

### Critical Verification Rules for AI Agents
1. **Never introduce duplicate navigation or action buttons** in headers.
2. **Always test responsive mobile viewports**: headers use `hidden md:flex` for tabs; ensure mobile actions stay accessible.
3. **Preserve WASM Stockfish Lifecycle**: Always stop the engine (`stopAnalysis()`) when changing positions or unmounting.
4. **Never commit broken SVGs**: The Lichess logo must use the official 24×24 vector (`LichessIcon`).
5. **Zero Server Compute Invariant**: Keep all heavy chess calculations strictly in client Web Workers or browser threads.
6. **Zero-Yapping Protocol**: Keep user communication concise, direct, high-signal, and free of fluff.
