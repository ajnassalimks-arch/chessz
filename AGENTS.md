<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# ChessZ AI Agent Engineering Guide

> Read `CLAUDE.md` for the architecture, the data pipeline and the invariants
> before changing anything.

## 1. Verification
```bash
npm test            # 58 tests across 8 suites
npx tsc --noEmit    # must exit 0 with zero errors
npm run build       # Turbopack production build, 17 routes
```

## 2. Rules
1. **One pipeline, one destination.** `lib/useWeaknessScan.ts` is the only source
   of weakness data, and `/weakness` is the sole destination for scanning and
   reviewing blunders. The legacy in-arena modal was deleted.
2. **Append-only attempt logging**: `lib/trainingLog.ts` records every attempt
   (correct or not) into IndexedDB `attempts` store (DB_VERSION 2) and mirrors
   to Supabase `puzzle_history`. Never mutate or store simple boolean flags.
3. **Lichess logo**: always `LichessIcon` from `@/components/LichessModal`
   (`viewBox="0 0 24 24"`).
4. **Engine lifecycle**: `stopAnalysis()` and `setEngineEnabled(false)` when
   changing position or unmounting; drain an abandoned search before the next.
5. **Blunder taxonomy**: keep `TIER_CATEGORY_DEFINITIONS` in
   `lib/mistakeClassifier.ts` at 3 tiers x 5 categories.
6. **Zero server compute**: engines and replay loops stay in the browser.
7. **No invented numbers**: a figure shown as a measurement must be computed
   from data.
8. **Be direct**: concise, concrete, no filler.
