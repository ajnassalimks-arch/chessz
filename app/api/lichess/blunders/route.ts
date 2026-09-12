export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { Chess } from 'chess.js';
import { cookies } from 'next/headers';
import { LICHESS_HOST } from '@/lib/lichess';
import { ChessPuzzle } from '@/lib/puzzles';

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

    const lichessUrl = `${LICHESS_HOST}/api/games/user/${encodeURIComponent(
      username
    )}?max=10&evals=true&opening=true`;

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
    if (!text.trim()) {
      return NextResponse.json({ blunders: [] });
    }

    const lines = text.trim().split('\n').filter(Boolean);
    const blunders: ChessPuzzle[] = [];
    const lowerUsername = username.toLowerCase();

    for (const line of lines) {
      try {
        const g = JSON.parse(line);
        if (!g.analysis || !g.moves || !g.players) continue;

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

          // Replay moves up to ply i - 1 to get exact FEN before blunder
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

          const moveNum = Math.floor(i / 2) + 1;
          const turnPrefix = userColor === 'white' ? `${moveNum}.` : `${moveNum}...`;

          const blunderPuzzle: ChessPuzzle = {
            id: `lichess_${g.id}_p${i}`,
            lichessId: g.id,
            tier: 'intermediate',
            track: 'tactical',
            title: `Your Game vs @${opponentName}`,
            ratingBadge: `${g.speed ? g.speed.toUpperCase() : 'GAME'} ~${opponentRating}`,
            initialFen: fenBefore,
            playerColor: userColor,
            prompt: `${userColor === 'white' ? 'White' : 'Black'} to move: In your game against @${opponentName}, you played ${turnPrefix} ${playedSan} (${judgmentName}). Find the Stockfish refutation!`,
            ruleTitle: `${judgmentName} Correction: ${playedSan}`,
            ruleBody:
              a.judgment.comment ||
              `Stockfish flagged ${playedSan} as a ${judgmentName.toLowerCase()}. Find the winning move!`,
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
          if (blunders.length >= 6) break;
        }

        if (blunders.length >= 6) break;
      } catch {}
    }

    return NextResponse.json({ blunders });
  } catch (error: any) {
    console.error('Error extracting Lichess blunders:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to extract blunders' },
      { status: 500 }
    );
  }
}
