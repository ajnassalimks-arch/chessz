<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# ChessZ AI Agent Engineering Guide

> **Important**: Read `ARCHITECTURE_AND_AGENT_GUIDE.md` for complete codebase architecture, math models, and routing topologies before making any modifications.

## 1. Quick Verification Commands
Always verify your changes with these commands before finishing:
```bash
# 1. Run full automated test suite (all 48 tests across 8 suites must pass)
npm test

# 2. Strict TypeScript type check (must exit 0 with 0 errors)
npx tsc --noEmit

# 3. Next.js 16 Turbopack production build (must generate all 20 routes cleanly)
npm run build
```

## 2. Core Operational Rules
1. **Header Consistency**: The 4 main pages (`/`, `/diagnose`, `/weakness`, `/terms`) share a single unified header with the ChessZ mark. Never duplicate buttons. The action button order is strictly: `[Connect Lichess]` ➔ `[Volume]` ➔ `[Settings]` ➔ `[Save/Exit]`.
2. **Lichess Logo**: Always use `LichessIcon` from `@/components/LichessModal` (`viewBox="0 0 24 24"`). Never introduce arbitrary or corrupted SVG paths.
3. **Stockfish WASM Lifecycle**: When transitioning between puzzles, always call `stopAnalysis()` and `setEngineEnabled(false)` to prevent analysis leaks.
4. **Pedagogical Integrity**: Maintain the blunder taxonomy in `lib/mistakeClassifier.ts` (`TIER_CATEGORY_DEFINITIONS`: 3 skill tiers x 5 tactical/strategic categories).
5. **Zero Server Compute Invariant**: All chess calculation runs strictly in client Web Workers or browser threads.
6. **Zero-Yapping Protocol**: Keep answers and summaries direct, high-signal, and free of fluff.
