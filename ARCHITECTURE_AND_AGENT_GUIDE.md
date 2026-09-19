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
│   └── TransparentProgressBar.tsx # Scan and sweep progress bar
├── lib/
│   ├── chessMetrics/          # Pure TypeScript math engine
│   │   ├── gameParser.ts      # PGN tokenizer, phase detection, eval extraction
│   │   ├── math.ts            # Centipawns-to-win% curve, accuracy formula, Wilson score
│   │   └── types.ts           # Data interfaces for games, plies, stats, and critical moments
│   ├── engine/
│   │   ├── browserStockfish.ts # UCI worker + two-pass batch sweep
│   │   └── types.ts
│   ├── blunderAdapter.ts      # critical moment -> trainable puzzle
│   ├── gameLibrary.ts         # IndexedDB v2 game store + backfill cursors
│   ├── trainingLog.ts         # Append-only attempt log + mastery derivation
│   ├── useWeaknessScan.ts     # THE scan pipeline
│   ├── diagnosisEngine.ts     # 16-puzzle benchmark pool, adaptive selector, bounded Elo
│   ├── lichess.ts             # Lichess user interfaces & API helpers
│   ├── lichessStream.ts       # Client-side streaming reader for NDJSON games
│   ├── mistakeClassifier.ts   # 3-tier x 5-category blunder taxonomy (TIER_CATEGORY_DEFINITIONS)
│   ├── puzzles.ts             # 500 authentic Lichess puzzles (CONTINUOUS, DIAGNOSTIC, ALL_PUZZLES_MAP)
│   ├── sounds.ts              # Web Audio API zero-latency procedural synthesizer
│   ├── supabaseWeakness.ts    # Supabase caching layer for scanned games & stats
│   ├── useLichess.ts          # React hook managing Lichess auth state & storage
│   └── useStockfish.ts        # Stockfish WASM Web Worker controller
├── supabase/
│   └── migrations/
│       └── 20260919_puzzle_history_attempt_log.sql # attempt log schema extensions
├── tests/
│   ├── chessMetrics.test.ts          # Pure math, winPct curve, PGN tokenization
│   ├── diagnosticEnhancements.test.ts # Category rules, velocity heuristic, master ceiling
│   ├── puzzleIntegrity.test.ts       # Validates FENs, solution lines, mates, and refutations
│   ├── qaStress.test.ts              # Stress testing boundary conditions & edge cases
│   ├── studyTermsIntegrity.test.ts   # Terms, legal master lines, rule mapping
│   ├── trainingLog.test.ts           # Attempt log invariants, mastery map, legacy import
│   └── weaknessPipeline.test.ts      # The seams: parse -> sweep -> adapt
├── AGENTS.md                  # Instructions for autonomous AI agents
├── CLAUDE.md                  # Quick reference file for AI assistants
├── LICENSE                    # MIT License
├── package.json               # Dependencies, scripts, test runner
└── README.md                  # Public project documentation
```

---

## 3. Core Routing & State Architecture

### A. Route 1: The Main Arena (`/` ➔ `app/page.tsx`)
- **Primary Responsibility**: Tactical puzzle training, level selection lobby, 5-puzzle diagnostic curriculum, and blunder training execution.
- **Key State Variables**:
  - `game`: Current `chess.js` instance.
  - `currentPuzzle`: Active `ChessPuzzle` object with `solutionMoves`, `defaultRefutation`, and `ruleTitle`.
  - `puzzleStatus`: `"solving"` | `"solved"` | `"failed"` | `"refuting"`.
  - `engineEnabled` & `evaluation`: Stockfish WASM evaluation state (`useStockfish`).
  - `showLichessModal`: Controls the Lichess connection modal.
- **Auto-Reveal Engine Integration & Training Log**:
  When `handleMoveAttempt` validates `isCorrect === true`:
  ```typescript
  setEngineEnabled(true);
  startAnalysis(testChess.fen());
  recordAttempt(username, { ... input, correct: true });
  ```
  Renders Stockfish eval score, top continuation line, and WASM badge.
  On failed refutation or blunder repeat:
  ```typescript
  recordAttempt(username, { ... input, correct: false });
  ```
  When launched in blunder mode (`/?mode=blunder`), completion cards provide a direct `<Link href="/weakness">` ("Back to Weakness Studio").

### B. Route 2: The 5-Puzzle Skill Diagnostic (`/diagnose` ➔ `app/diagnose/page.tsx`)
- **Primary Responsibility**: Rapid 5-puzzle diagnostic benchmark (+1 optional Grandmaster Crucible) estimating true playing strength.
- **Flow**:
  1. **Trial 1**: Historic Opening Radar benchmark puzzle (`HISTORICAL_BENCHMARKS_STAGE_1`).
  2. **Trial 2**: Historic Tactical Geometry benchmark puzzle (`HISTORICAL_BENCHMARKS_STAGE_2`).
  3. **Trials 3–5**: Dynamic adaptive puzzles chosen in real-time from the 500-puzzle Lichess pool (`selectAdaptivePuzzle`) with psychological conviction prompt (*"Sure"*, *"Think so"*, *"Guessing"*).
  4. **Trial 6 (Optional)**: Grandmaster Crucible ($K=260$), unlocked if player scores 5/5 first-try correct and achieves $\ge 1700$ rating.
  5. **Results Screen**: Generates converged rating (`calibratedRating`), behavioral archetype, and an option to train targeted blindspots on `/`.

### C. Route 3: Deep Weakness Studio (`/weakness` ➔ `app/weakness/page.tsx`)
- **Primary Responsibility**: Full-page analytics studio scanning and analyzing the player's full game history.
- **Key Capabilities**:
  - **Single Canonical Pipeline**: `lib/useWeaknessScan.ts` streams games via NDJSON with browser fallback and stores records quota-free in IndexedDB `lib/gameLibrary.ts`.
  - **Unbounded History**: `backfillHistory()` walks backward page-by-page using Lichess `until` with persistent cursors in IndexedDB so scans resume rather than restart.
  - **Live Mastery Badging & Attempt Log**: Powered by `lib/trainingLog.ts`. Displays `{fixedCount} of {moments.length} fixed`, with dynamic row badges (🟢 **Fixed**, 🟡 **Attempted**) and switches button from `"Fix it"` to `"Train again"`. Window focus listener automatically refreshes mastery upon returning from the Arena.
  - **Multi-Pass Stockfish WASM Sweep**: 80k nodes pass 1 ➔ 300k nodes pass 2 refinement for games lacking server evals, checkpointed into IndexedDB.
  - **Phase Diagnosis**: Identifies whether the player bleeds most in the Opening, Middlegame, or Endgame.
  - **1-Click Arena Handoff**: Each blunder row carries a mini-board and launches training into `/` via `mode=blunder` with setup moves and engine refutation preloaded.

### D. Route 4: Study Terms & Master Lexicon (`/terms` ➔ `app/terms/page.tsx`)
- **Primary Responsibility**: Interactive pedagogical encyclopedia featuring 21 real master historical positions (e.g. Greek Gift, Smothered Mate, Légal's Trap, Noah's Ark, Anastasia's Corridor).
- **Key Capabilities**:
  - Full board replay of master lines and candidate moves with historical citations and annotations.
  - Study terms also surface contextually on blunder cards via `TermHoverCard`, rather than only inside this route.
  - Quick hover preview cards (`components/TermHoverCard.tsx`) embedded throughout the app.

---

## 4. Key Components & Modals

### 1. Weakness Studio Queue Card (`app/weakness/_client.tsx`)
- **Role**: Clean, responsive critical moment queue item.
- **Features**:
  - Mini-board preview rendering the exact blunder position with proper board orientation.
  - Move details: played SAN, move number, game phase, clock remaining, and win probability loss.
  - Status badges: 🟢 **Fixed** for mastered blunders, 🟡 **Attempted** for uncompleted attempts, plus blunder/mistake classification pill.
  - Action buttons: direct Lichess game deep-link and `"Fix it"` / `"Train again"` button triggering Arena handoff.

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
# Run all automated tests (58 tests in 8 suites)
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
