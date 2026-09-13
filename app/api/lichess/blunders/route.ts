export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { Chess } from 'chess.js';
import { cookies } from 'next/headers';
import { LICHESS_HOST } from '@/lib/lichess';
import { ChessPuzzle } from '@/lib/puzzles';
import {
  classifyMistake,
  getCategoryDefinitionsForTier,
  SkillTier,
} from '@/lib/mistakeClassifier';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    let username = searchParams.get('username')?.trim();

    const cookieStore = await cookies();
    const token = cookieStore.get('lichess_token')?.value;

    const headers: Record<string, string> = {
      Accept: 'application/x-ndjson',
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    if (!username && token) {
      try {
        const accRes = await fetch(`${LICHESS_HOST}/api/account`, {
          headers: { Authorization: `Bearer ${token}` },
          cache: 'no-store',
        });
        if (accRes.ok) {
          const accData = await accRes.json();
          username = accData.username;
        }
      } catch {}
    }

    if (!username) {
      return NextResponse.json(
        { error: 'Username or authenticated session required' },
        { status: 400 }
      );
    }

    const maxGames = Math.min(Math.max(parseInt(searchParams.get('max') || '50', 10), 1), 50);
    const rawTier = searchParams.get('tier');
    const skillTier: SkillTier =
      rawTier === 'adv_beginner' || rawTier === 'intermediate' ? rawTier : 'beginner';

    const lichessUrl = `${LICHESS_HOST}/api/games/user/${encodeURIComponent(
      username
    )}?max=${maxGames}&evals=true&opening=true`;

    const response = await fetch(lichessUrl, {
      headers,
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Lichess API returned ${response.status}` },
        { status: response.status }
      );
    }

    const text = await response.text();
    const categoryDefs = getCategoryDefinitionsForTier(skillTier);

    if (!text.trim()) {
      return NextResponse.json({
        summary: {
          username,
          skillTier,
          totalGamesScanned: 0,
          analyzedGamesCount: 0,
          unanalyzedGamesCount: 0,
          totalBlundersFound: 0,
          categories: categoryDefs.map((c) => ({ ...c, count: 0, percentage: 0 })),
          primaryLeak: { ...categoryDefs[0], count: 0, percentage: 0 },
        },
        blunders: [],
      });
    }

    const lines = text.trim().split('\n').filter(Boolean);
    const blunders: (ChessPuzzle & {
      gameId: string;
      speed?: string;
      opponentName: string;
      opponentRating: number;
      moveNumber: number;
      playedSan: string;
      bestSan: string;
      evalSwingPawns?: number;
      judgmentName: string;
      category: string;
      categoryTitle: string;
      categoryBadge: string;
      categoryIcon: string;
      coachTip: string;
      parentTip: string;
    })[] = [];
    const lowerUsername = username.toLowerCase();

    let analyzedGamesCount = 0;
    let unanalyzedGamesCount = 0;

    for (const line of lines) {
      try {
        const g = JSON.parse(line);
        if (!g.moves || !g.players) continue;

        // Check if game already has Stockfish computer analysis on Lichess
        const hasAnalysis = Array.isArray(g.analysis) && g.analysis.length > 0;
        if (hasAnalysis) {
          analyzedGamesCount++;
        } else {
          unanalyzedGamesCount++;
          // Do not re-analyze if unanalyzed, keep untouched
          continue;
        }

        const moves = g.moves.split(/\s+/).filter(Boolean);
        const isWhite =
          g.players.white?.user?.name?.toLowerCase() === lowerUsername;
        const isBlack =
          g.players.black?.user?.name?.toLowerCase() === lowerUsername;

        if (!isWhite && !isBlack) continue;

        const userColor: 'white' | 'black' = isWhite ? 'white' : 'black';
        const opponentName = isWhite
          ? g.players.black?.user?.name || 'Anonymous'
          : g.players.white?.user?.name || 'Anonymous';
        const opponentRating = isWhite
          ? g.players.black?.rating || 1500
          : g.players.white?.rating || 1500;

        for (let i = 0; i < g.analysis.length && i < moves.length; i++) {
          const a = g.analysis[i];
          if (!a?.judgment) continue;

          const judgmentName = a.judgment.name;
          if (judgmentName !== 'Blunder' && judgmentName !== 'Mistake') continue;

          const moveColor: 'white' | 'black' = i % 2 === 0 ? 'white' : 'black';
          if (moveColor !== userColor) continue;

          const bestUci = a.best;
          if (!bestUci || bestUci.length < 4) continue;

          // Replay moves up to ply i to get exact FEN before the blunder
          const chess = new Chess();
          let validReplay = true;
          for (let m = 0; m < i; m++) {
            try {
              const res = chess.move(moves[m]);
              if (!res) {
                validReplay = false;
                break;
              }
            } catch {
              validReplay = false;
              break;
            }
          }

          if (!validReplay) continue;

          const fenBefore = chess.fen();
          const playedSan = moves[i];
          const bestFrom = bestUci.slice(0, 2);
          const bestTo = bestUci.slice(2, 4);
          const bestProm = bestUci.length > 4 ? bestUci[4] : undefined;

          // Verify best move is legal on FEN
          let bestSan = `${bestFrom}-${bestTo}`;
          try {
            const testChess = new Chess(fenBefore);
            const moveRes = testChess.move({
              from: bestFrom,
              to: bestTo,
              promotion: bestProm || 'q',
            });
            if (moveRes) bestSan = moveRes.san;
          } catch {
            continue;
          }

          // Calculate Centipawn / Pawn Swing from existing Lichess analysis
          let evalSwingPawns: number | undefined = undefined;
          const prevAnalysis = i > 0 ? g.analysis[i - 1] : null;
          if (prevAnalysis && typeof prevAnalysis.eval === 'number' && typeof a.eval === 'number') {
            const cpBefore = prevAnalysis.eval;
            const cpAfter = a.eval;
            const rawDrop = userColor === 'white' ? cpBefore - cpAfter : cpAfter - cpBefore;
            evalSwingPawns = Math.max(0, Math.round((rawDrop / 100) * 10) / 10);
          }

          // Classify into 1 of the 5 skill-calibrated categories
          const classified = classifyMistake(
            fenBefore,
            playedSan,
            bestUci,
            i,
            evalSwingPawns,
            skillTier
          );

          const moveNum = Math.floor(i / 2) + 1;
          const turnPrefix = userColor === 'white' ? `${moveNum}.` : `${moveNum}...`;

          const swingText = evalSwingPawns && evalSwingPawns > 0 ? ` (dropped ~${evalSwingPawns} pawns)` : '';

          const blunderPuzzle = {
            id: `lichess_${g.id}_p${i}`,
            lichessId: g.id,
            gameId: g.id,
            speed: g.speed || 'blitz',
            opponentName,
            opponentRating,
            moveNumber: moveNum,
            playedSan,
            bestSan,
            evalSwingPawns,
            judgmentName,
            category: classified.categoryId,
            categoryTitle: classified.categoryTitle,
            categoryBadge: classified.badge,
            categoryIcon: classified.icon,
            coachTip: classified.coachTip,
            parentTip: classified.parentTip,
            tier: 'intermediate' as const,
            track: 'tactical' as const,
            title: `Your Game vs @${opponentName}`,
            ratingBadge: `${g.speed ? g.speed.toUpperCase() : 'GAME'} ~${opponentRating}`,
            initialFen: fenBefore,
            playerColor: userColor,
            prompt: `${userColor === 'white' ? 'White' : 'Black'} to move: In your game against @${opponentName}, you played ${turnPrefix} ${playedSan} (${judgmentName}${swingText}). Find the Stockfish refutation!`,
            ruleTitle: `${classified.ruleTitle}: ${playedSan}`,
            ruleBody:
              a.judgment.comment || classified.ruleBody,
            solutionMoves: [
              {
                from: bestFrom,
                to: bestTo,
                san: bestSan,
                promotion: bestProm,
                explanation: `${bestSan}! Stockfish's recommended continuation that gives you a decisive tactical edge.`,
              },
            ],
            defaultRefutation: {
              from: bestFrom,
              to: bestTo,
              san: playedSan,
              coachExplanation: `In the game you played ${turnPrefix} ${playedSan}, which allowed your opponent counterplay. Look for ${bestSan}!`,
            },
            successExplanation: `Masterful correction! In your real game you played ${turnPrefix} ${playedSan}, but ${bestSan} is the exact winning move Stockfish recommended!`,
          };

          blunders.push(blunderPuzzle);
        }
      } catch {}
    }

    // Aggregate category distribution metrics
    const categoryCounts: Record<string, number> = {};
    for (const def of categoryDefs) {
      categoryCounts[def.id] = 0;
    }
    for (const b of blunders) {
      if (categoryCounts[b.category] !== undefined) {
        categoryCounts[b.category]++;
      }
    }

    let primaryLeakId = categoryDefs[0]?.id || 'hanging_pieces';
    let maxCount = -1;
    for (const [catId, cnt] of Object.entries(categoryCounts)) {
      if (cnt > maxCount) {
        maxCount = cnt;
        primaryLeakId = catId as any;
      }
    }

    const primaryLeakDef =
      categoryDefs.find((c) => c.id === primaryLeakId) || categoryDefs[0];
    const totalBlunders = blunders.length;
    const categoryBreakdown = categoryDefs.map((def) => {
      const count = categoryCounts[def.id] || 0;
      const percentage =
        totalBlunders > 0 ? Math.round((count / totalBlunders) * 100) : 0;
      return {
        ...def,
        count,
        percentage,
      };
    });

    return NextResponse.json({
      summary: {
        username,
        skillTier,
        totalGamesScanned: lines.length,
        analyzedGamesCount,
        unanalyzedGamesCount,
        totalBlundersFound: blunders.length,
        categories: categoryBreakdown,
        primaryLeak: {
          ...primaryLeakDef,
          count: Math.max(0, maxCount),
          percentage:
            totalBlunders > 0
              ? Math.round((Math.max(0, maxCount) / totalBlunders) * 100)
              : 0,
        },
      },
      blunders,
    });
  } catch (error: any) {
    console.error('Error extracting Lichess blunders:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to extract blunders' },
      { status: 500 }
    );
  }
}
