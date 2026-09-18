import { NextRequest, NextResponse } from 'next/server';
import { Chess } from 'chess.js';
import { fetchMaiaAnalysis, MaiaRatingTier } from '@/lib/engine/maiaClient';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fen = searchParams.get('fen');
  const tierParam = searchParams.get('tier');
  const bestMove = searchParams.get('bestMove') || undefined;

  if (!fen) {
    return NextResponse.json(
      { error: 'Missing required query parameter "fen"' },
      { status: 400 }
    );
  }

  // Validate before forwarding: this route proxies to Lichess, so a malformed
  // FEN should fail here rather than burn an upstream request.
  try {
    new Chess(fen);
  } catch {
    return NextResponse.json(
      { error: 'Invalid FEN' },
      { status: 400 }
    );
  }

  const tier = (tierParam ? parseInt(tierParam, 10) : 1500) as MaiaRatingTier;
  const validTiers: MaiaRatingTier[] = [1100, 1300, 1500, 1700, 1900];
  const selectedTier = validTiers.includes(tier) ? tier : 1500;

  try {
    const analysis = await fetchMaiaAnalysis(fen, selectedTier, bestMove);
    return NextResponse.json(analysis, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error during Maia analysis';
    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}
