# ChessZ — Architecture & Operational Guide

ChessZ turns a player's own losses into training material: it scans their recent
Lichess games, finds the exact positions where they dropped the most win
probability, and puts them back on the board to play again.

Everything else in this repo exists to serve that loop.

---

## 1. Verification

Run all three before finishing any change. All must be clean.

```bash
npm test            # 58 tests across 8 suites
npx tsc --noEmit    # must exit 0 with zero errors
npm run build       # Turbopack production build, 17 routes
npm run dev         # local dev server on :3000
```

---

## 2. Stack

- **Framework**: Next.js 16.3.4 (App Router, Turbopack), React 19.2.8
- **Language**: TypeScript 5, strict
- **Styling**: Tailwind CSS v4 with `@theme` tokens in `app/globals.css`
- **Chess**: `chess.js` ^1.4.0, `react-chessboard` ^5.12.1
- **Engine**: `stockfish.js` ^10.0.2 (niklasf's multi-variant build), run in a
  browser Web Worker from `/public/stockfish/`
- **Sound**: procedural Web Audio synthesizer, `lib/sounds.ts`, no audio assets
- **Lichess**: OAuth 2.0 PKCE (`/api/auth/lichess/*`), NDJSON game streaming
- **Persistence**: IndexedDB (`lib/gameLibrary.ts`) for the game library and
  training attempt log (`lib/trainingLog.ts`), Supabase for cross-device aggregates
  and history sync when configured
- **Tests**: `node:test` via `tsx`

---

## 3. The loop

```
Lichess games ──> useWeaknessScan ──> critical moments ──> blunderAdapter ──> Arena board
                        │                                                         │
                        └── Stockfish WASM sweep for games Lichess never analyzed ─┘
```

**`lib/useWeaknessScan.ts` is the single source of weakness data.** The standalone
`/weakness` route is the sole destination for scanning, reviewing, and queueing
mistakes. The legacy in-arena `WeaknessDashboard` modal was deleted. Blunder
training launches into the Arena board with `/?mode=blunder` and returns to
`/weakness` with live mastery badging (`Fixed` / `Attempted`).

### Routes

1. **`/` — the board** (`app/_client.tsx`). Curated 500-puzzle pool across 4
   tiers, plus blunder-fix mode. When a puzzle arrives with `solutionMoves: []`
   (every real blunder does), the Arena derives the answer from the in-browser
   engine rather than being handed one.
2. **`/weakness` — your mistakes** (`app/weakness/_client.tsx`). One screen:
   worst phase in a sentence, live mastery progress (`X of Y fixed`), then
   the positions ranked worst first with interactive boards and one-click training.
3. **`/diagnose` — 5-puzzle benchmark** (`app/diagnose/_client.tsx`). A starting
   point for players with no connected account. Produces a bounded rating
   estimate and a training focus.
4. **`/terms` — the lexicon** (`app/terms/TermsClient.tsx`). 21 historical master
   positions. Also surfaces contextually through `TermHoverCard` wherever a rule
   is named.

---

## 4. Layout

```
chessz-app/
├── app/
│   ├── _client.tsx                 # the board
│   ├── diagnose/_client.tsx        # 5-puzzle benchmark
│   ├── terms/TermsClient.tsx       # lexicon
│   ├── weakness/_client.tsx        # the mistake queue & mastery tracking
│   ├── api/
│   │   ├── auth/lichess/           # OAuth PKCE: login, callback, me, logout, link
│   │   ├── cron/keepalive/         # daily Supabase free-tier anti-pause ping
│   │   └── lichess/
│   │       ├── games/stream/       # NDJSON proxy, body piped, no buffering
│   │       └── user/validate/      # username lookup
│   ├── error.tsx                   # themed route error boundary
│   └── globals.css                 # Tailwind v4 tokens, 4 palettes, dark variant
├── components/
│   ├── ChessboardFrame.tsx         # bezel, coordinate rails, check glow
│   ├── CoachStudyModal.tsx         # move-by-move review of a puzzle set
│   ├── ConfidenceModal.tsx         # conviction prompt (keys 1/2/3, Esc)
│   ├── EngineAnalysisBar.tsx       # eval readout for the Arena
│   ├── LichessModal.tsx            # identity only + the official LichessIcon
│   ├── SettingsModal.tsx           # palette, light/dark, sound, wallpaper
│   ├── TermHoverCard.tsx           # inline study popover
│   └── TransparentProgressBar.tsx  # scan and sweep progress
├── lib/
│   ├── chessMetrics/               # pure math and PGN parsing
│   │   ├── gameParser.ts           # phase detection, critical moments
│   │   ├── math.ts                 # win% curve, accuracy, Wilson
│   │   ├── tokenizer.ts            # PGN tokenizer, [%eval] and [%clk]
│   │   └── types.ts                # the shared data shapes
│   ├── engine/
│   │   ├── browserStockfish.ts     # UCI worker + two-pass batch sweep
│   │   └── types.ts
│   ├── blunderAdapter.ts           # critical moment -> trainable puzzle
│   ├── gameLibrary.ts              # IndexedDB v2 game store + backfill cursors
│   ├── trainingLog.ts              # append-only attempt log + mastery derivation
│   ├── useWeaknessScan.ts          # THE scan pipeline
│   ├── diagnosisEngine.ts          # benchmark pool, Elo estimate, patterns
│   ├── lichessStream.ts            # incremental NDJSON reader
│   ├── mistakeClassifier.ts        # 3 tiers x 5 categories
│   ├── puzzles.ts                  # 500 Lichess puzzles, 16 rule titles
│   ├── studyTerms.ts               # 21 historical terms
│   ├── supabaseWeakness.ts         # localStorage + Supabase persistence
│   └── useStockfish.ts             # single-position engine hook
├── supabase/
│   └── migrations/
│       └── 20260919_puzzle_history_attempt_log.sql # attempt log schema extensions
└── tests/                          # 8 suites (58 tests)
    ├── chessMetrics.test.ts        # win% curve, tokenizer, phases
    ├── diagnosticEnhancements.test.ts # rules, velocity, rating bounds
    ├── puzzleIntegrity.test.ts     # all 500 FENs, solutions, refutations
    ├── qaStress.test.ts            # boundaries and edge cases
    ├── studyTermsIntegrity.test.ts # terms, legal master lines, rule mapping
    ├── trainingLog.test.ts         # attempt log invariants, mastery map, legacy import
    └── weaknessPipeline.test.ts    # the seams: parse -> sweep -> adapt
```

---

## 5. Invariants

### 1. Zero server compute
Stockfish runs only in a browser Web Worker. API routes are I/O only — they
proxy, validate or authenticate. Never run an engine or a replay loop in a route
handler.

### 2. Eval detection reads the raw PGN token
```ts
const hasEvals = parsedPgn.moves.some((m) => m.eval !== undefined);
```
Never test `m.evalAfter.cp !== undefined`: moves default `lastEval` to
`{ cp: 15 }`, so that is always true. When `evalSource === 'none'` the UI offers
the local sweep.

### 3. Evals are stored from White's perspective
`evalBefore` / `evalAfter` on a `CriticalMoment` are always White's view. Flip
them before showing them to a Black player, and compute swing with
`evalSwingForPlayer()`. Getting this wrong is silent — the numbers still look
plausible.

### 4. Lichess identity may arrive as `id`, not `name`
```ts
const name = (player?.user?.name || player?.user?.id || '').toLowerCase().trim();
```

### 5. Scoped dark mode
`app/globals.css` defines the variant so OS dark mode cannot override a chosen
light theme:
```css
@custom-variant dark (&:where([data-mode="dark"], [data-mode="dark"] *, .dark, .dark *));
```
Use semantic classes (`theme-surface`, `theme-text-primary`, `theme-canvas`)
rather than raw colors, including in error and empty states.

### 6. Engine lifecycle
Call `stopAnalysis()` and `setEngineEnabled(false)` when changing position or
unmounting. On a search timeout the abandoned search must be drained before the
next one starts, or its `info` lines leak into the next position's result.

### 7. Positions must survive persistence
`saveGameStatsBatch` stores each move's `fen`, and the engine sweep restores it
from replay. Anything that carries a position — critical moments, setup steppers
— must keep it through a save and a reload, or the trainer has no board.

### 8. Move numbers
A move number is `Math.ceil(ply / 2)`. Plies 1 and 2 are both move 1.
`floor(ply/2)+1` numbers Black's move as the next move.

### 9. The library is unbounded; a request is not
There is no cap on how many games a player can hold. `RECENT_WINDOW_GAMES` is a
latency budget for the first scan and `BACKFILL_PAGE_GAMES` is one page of the
backwards walk — neither is a ceiling. The walk's cursor (`oldestGameAt`) lives
in IndexedDB, so a paused or reloaded backfill resumes rather than restarts.

Two things this must keep straight:
- A page with rows but no *standard* games is not the end of the history. Only
  `rawGames === 0` is. See `decideBackfillStep`.
- A backwards page must never touch the incremental `since` cursor: its games
  are older by construction, and recording them would drag the cursor backwards.

### 10. Manual scans never send `since`
In `lib/lichessStream.ts`, only send `since` when `options.incremental === true`.
Sending it on a full scan makes Lichess return 0 or 1 game.

### 11. Do not invent numbers
Anything shown as a measurement must be derived from data. A statistic with no
computation behind it does not ship, however plausible it reads.

---

## 6. Working here

1. **Verify before claiming done.** All three commands, clean.
2. **Look for the second copy.** Duplication is this codebase's failure mode —
   the same capability built twice, with the weaker one on the path users take.
   Before adding a surface, check whether one already exists.
3. **Test the seams.** The modules are individually sound; the defects live in
   the handoffs. `tests/weaknessPipeline.test.ts` is the model.
4. **Delete rather than disable.** If a feature is switched off, remove it —
   `PieceSets2D.tsx` sat unreachable for months because it was only disabled.
5. **Be direct.** Short, concrete, no padding.
