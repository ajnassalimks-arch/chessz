# ChessZ — Claude Code Architecture & Operational Guide

Welcome to **ChessZ**. This guide gives Claude Code complete technical context, architecture specifications, operational invariants, verification commands, and system invariants.

---

## 1. Quick Verification Commands

Always run these commands before finalizing any changes:

```bash
# 1. Run all 48 automated tests across 8 suites
npm test

# 2. Strict TypeScript type check (must exit with code 0 and zero errors)
npx tsc --noEmit

# 3. Next.js 16 Turbopack production build (must compile all 20 routes cleanly)
npm run build

# 4. Local development server
npm run dev
```

---

## 2. Technology Stack & Environment

- **Framework**: Next.js 16.3.4 (App Router, Turbopack)
- **UI / Core**: React 19.2.8, Tailwind CSS v4, Lucide React icons
- **Language**: TypeScript 5 (strict mode enabled)
- **Chess Logic**: `chess.js` (v0.13.4), `react-chessboard` (v4.7.2)
- **In-Browser Engine**: Stockfish 16 WASM executing in client-side Web Worker (`/public/stockfish/stockfish.wasm.js` and `/public/stockfish/stockfish.wasm`)
- **Sound Engine**: Procedural Web Audio API synthesizer (`lib/sounds.ts`, zero external audio files)
- **Auth & External API**: Lichess OAuth 2.0 PKCE (`/api/auth/lichess/*`), NDJSON games streaming (`/api/lichess/games/stream`), user validation (`/api/lichess/user/validate`)
- **Persistence**: Dual-layer architecture — Supabase client (`lib/supabaseWeakness.ts`) with immediate zero-latency `localStorage` caching
- **Test Runner**: Node.js native test runner (`node:test` + `node:assert`) executed via `tsx`

---

## 3. Four Core Routes & Features

```
┌────────────────────────────────────────────────────────────────────────┐
│                              CHESSZ APP                                │
└──────────────┬───────────────────┬───────────────────┬─────────────────┘
               ▼                   ▼                   ▼                 ▼
          Train (`/`)      Skill Test (`/diagnose`) Weakness (`/weakness`) Terms (`/terms`)
      Tactical Arena       5-Puzzle Benchmark       50-Game Scanner       Mastery Lexicon
      500-Puzzle Loop      Adaptive Calibration     Phase Loss Metrics    18 Historical Studies
      Blunder Trainer      Cognitive Archetypes     Stockfish WASM Sweep  Interactive Boards
      Stockfish Auto-Eval  Conviction Telemetry     Critical Moments      Maia AI Spectrum
```

1. **Tactical Arena (`/` ➔ `app/_client.tsx`)**:
   - Curated 500-puzzle loop across 4 skill tiers (Beginner to Advanced).
   - Custom tournament bezel (`components/ChessboardFrame.tsx`) with coordinate rails, check radial glow, and right-click annotations.
   - Auto-reveal Stockfish WASM evaluation bar upon puzzle completion.
   - In-arena Blunder Trainer modal (`components/WeaknessDashboard.tsx`) with preceding 2-move stepper (`setupMoves`).

2. **Skill Test (`/diagnose` ➔ `app/diagnose/_client.tsx`)**:
   - 5-puzzle benchmark (+1 optional Grandmaster Crucible trial with $K=260$).
   - Millisecond calculation speed telemetry, mistake refutation trees, and psychological conviction prompt (*"Sure"*, *"Think so"*, *"Guessing"*).
   - Generates calibrated Elo and Cognitive Archetype dossier.

3. **Weakness Studio (`/weakness` ➔ `app/weakness/_client.tsx`)**:
   - Streams up to 50 recent rated games from Lichess via client-side NDJSON reader with server proxy fallback.
   - Calculates Opening, Middlegame, and Endgame win% loss per move, blunder counts, and critical moments.
   - If games lack Lichess server evaluations (`evalSource: 'none'`), an in-browser Stockfish WASM sweep (80k nodes pass 1 ➔ 300k nodes pass 2 refinement) analyzes positions deterministically in the client.

4. **Study Terms (`/terms` ➔ `app/terms/_client.tsx`)**:
   - 18 historical master positions covering Greek Gift, Smothered Mate, Légal's Trap, Noah's Ark, etc.
   - Interactive move player, coach explanations, and Maia Human-AI intelligence prediction spectrum.

---

## 4. Key Directory & File Layout

```
c:\ChessZ\chessz-app\
├── app/
│   ├── _client.tsx               # Tactical Arena client component
│   ├── diagnose/_client.tsx       # 5-Puzzle diagnostic benchmark
│   ├── terms/_client.tsx          # Study terms lexicon
│   ├── weakness/_client.tsx       # Weakness Studio client component
│   ├── api/
│   │   ├── auth/lichess/          # Lichess OAuth 2.0 PKCE (login, callback, me, logout)
│   │   ├── lichess/blunders/      # Blunder extraction endpoint with setupMoves
│   │   ├── lichess/games/stream/  # Streaming NDJSON proxy with zero CPU buffering
│   │   └── lichess/user/validate/ # Lichess username lookup & validation
│   └── globals.css                # Tailwind CSS v4 root tokens & dark variant
├── components/
│   ├── ChessboardFrame.tsx       # Outer bezel, coordinate rails, check radial glow
│   ├── ChessZLogo.tsx            # Official vector brandmark (tight, square, lockup)
│   ├── LichessModal.tsx          # Lichess login modal + official LichessIcon SVG
│   ├── MaiaHumanSpectrum.tsx     # Maia 1100-1900 human move prediction component
│   ├── SettingsModal.tsx         # Theme switcher, piece style, sound volume
│   ├── TermHoverCard.tsx         # Interactive hover definition cards
│   ├── TransparentProgressBar.tsx # High-contrast glass progress bar
│   └── WeaknessDashboard.tsx     # Blunder trainer modal with 2-move stepper
├── lib/
│   ├── chessMetrics/             # Pure math & PGN parsing engine
│   │   ├── gameParser.ts         # PGN tokenizer, phase detection, eval extraction
│   │   ├── math.ts               # Centipawns-to-win% curve, accuracy formula, Wilson score
│   │   └── types.ts              # GameDerivedStats, MoveAnalysis, CriticalMoment
│   ├── engine/                   # Stockfish Web Worker & analysis runner
│   │   ├── browserStockfish.ts   # Multi-pass batch Stockfish evaluator
│   │   └── types.ts              # ChessEngine, EngineEvalResult, EngineProgress
│   ├── lichessStream.ts          # Incremental NDJSON stream reader
│   ├── mistakeClassifier.ts      # 3-tier x 5-category blunder taxonomy
│   ├── puzzles.ts                # 500 authentic Lichess puzzles + benchmark pool
│   ├── sounds.ts                 # Web Audio zero-latency procedural synthesizer
│   ├── supabaseWeakness.ts       # Supabase and localStorage persistence
│   ├── useLichess.ts             # Auth hook for session and user state
│   └── useStockfish.ts           # Single-position Stockfish WASM hook
├── public/
│   ├── stockfish/                # stockfish.js, stockfish.wasm, stockfish.wasm.js
│   ├── pieces/lichess/           # Staunton piece SVGs
│   └── wallpapers/               # Background wallpapers
└── tests/
    ├── chessMetrics.test.ts      # Pure math, winPct curve, PGN tokenization
    ├── diagnosticEnhancements.test.ts # Rules, velocity heuristic, master ceiling
    ├── maiaAnalysis.test.ts      # Maia probability calculations & psychology
    ├── puzzleIntegrity.test.ts   # Validates all 500 FENs, solutions, and refutations
    ├── qaStress.test.ts          # Boundary conditions & edge cases
    └── studyTermsIntegrity.test.ts # Historical terms, legal moves, citations
```

---

## 5. Architectural Invariants & Critical Rules

### Invariant 1: Zero Server Compute
All chess computation is strictly client-side:
- Stockfish WASM runs exclusively in a browser Web Worker (`new Worker('/stockfish/stockfish.wasm.js')`).
- API routes are strictly I/O streaming proxies (`TransformStream` or raw body piping). **Never** run Stockfish or heavy CPU loops in Next.js route handlers.

### Invariant 2: PGN Evaluation Detection
Most Lichess games do NOT have server evaluations.
- In `lib/chessMetrics/gameParser.ts`:
  ```typescript
  const hasEvals = parsedPgn.moves.some((m) => m.eval !== undefined);
  const evalSource = hasEvals ? 'lichess' : 'none';
  ```
- **Never** check `m.evalAfter.cp !== undefined` to determine if evaluations exist, because moves default `lastEval` to `{ cp: 15 }`. Always check the raw PGN token `m.eval !== undefined`.
- When `evalSource === 'none'`, the app renders the Stockfish WASM banner so the user can run browser analysis.

### Invariant 3: Lichess Username & ID Attribution
Lichess usernames are case-insensitive, and API responses often provide `user.id` (lowercase) instead of `user.name`.
- Always normalize and check:
  ```typescript
  const whiteName = (rawGame.players?.white?.user?.name || rawGame.players?.white?.user?.id || '').toLowerCase().trim();
  const blackName = (rawGame.players?.black?.user?.name || rawGame.players?.black?.user?.id || '').toLowerCase().trim();
  ```

### Invariant 4: Scoped Dark Mode & Theme Isolation
In Tailwind CSS v4, the default `dark:` variant responds to `@media (prefers-color-scheme: dark)`. To prevent OS dark mode from bleeding into the user's selected Light mode, `app/globals.css` defines:
```css
@custom-variant dark (&:where([data-mode="dark"], [data-mode="dark"] *, .dark, .dark *));
```
Always use semantic theme classes (`theme-surface`, `theme-text-primary`, `theme-text-secondary`) and WCAG AAA amber tokens:
- Light Mode: `bg-amber-100 text-amber-950 border-amber-300`
- Dark Mode: `dark:bg-amber-950/40 dark:text-amber-200 dark:border-amber-500/40`

### Invariant 5: Stockfish WASM Lifecycle
When switching between puzzles or unmounting:
```typescript
stopAnalysis();
setEngineEnabled(false);
```
Always drain the terminating `bestmove` line to prevent UCI message sequence corruption.

### Invariant 6: Move Array Persistence
When saving scanned games to `localStorage` in `lib/supabaseWeakness.ts`:
- **Never** strip `moves: []`.
- Always store essential move fields (`ply`, `san`, `color`, `evalBefore`, `evalAfter`, `winPctLost`, `judgment`, `accuracy`, `phase`, `clockRemaining`, `timeSpentSeconds`) so in-browser Stockfish can replay moves and extract FENs even after page reloads.

### Invariant 7: Lichess Stream Sync
In `lib/lichessStream.ts`:
- Never send `since` parameter on manual user scans unless `options.incremental === true` is explicitly passed. Sending an automatic `since` causes Lichess to return 0 or 1 game, truncating the user's historical set.

---

## 6. Recent Remediation & Bug Fix History

1. **Weakness Studio 1-Game Truncation**: Fixed `streamUserGames` passing `since` from localStorage on full scans, and implemented smart game merging in `app/weakness/_client.tsx`.
2. **False-Positive Evaluation Tagging**: Changed `hasEvals` in `deriveGameStats` to inspect `parsedPgn.moves.some(m => m.eval !== undefined)`.
3. **Player Attribution as Black**: Added `user?.name || user?.id` fallback across `gameParser.ts` and `app/api/lichess/blunders/route.ts`.
4. **Move Preservation**: Fixed `saveGameStatsBatch` stripping moves, enabling offline and cached in-browser Stockfish evaluation.
5. **Dark Mode / Light Mode Amber Contrast**: Replaced low-contrast yellow text with WCAG AAA amber tokens and scoped dark variants.
6. **Harmonized Global Navigation**: Added unified top nav across all 4 pages (`Train`, `Skill Test`, `Weakness Studio`, `Study Terms`).

---

## 7. Operational Guidelines for Claude Code

1. **Verify Before Declaring Complete**: Always run `npm test`, `npx tsc --noEmit`, and `npm run build` to guarantee zero regressions.
2. **Preserve Integrity**: Do not remove existing comments, docstrings, or test assertions.
3. **Be Direct**: Provide concise, high-signal explanations and actionable solutions.
