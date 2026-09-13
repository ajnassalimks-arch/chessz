import { Color, MoveToken } from './types';
import { parseClockToSeconds } from './math';

export interface ParsedPgn {
  headers: Record<string, string>;
  movetext: string;
  moves: MoveToken[];
}

/**
 * Parses raw PGN into headers, raw movetext, and structured MoveToken array
 */
export function parsePgn(pgn: string): ParsedPgn {
  if (!pgn || typeof pgn !== 'string') {
    return { headers: {}, movetext: '', moves: [] };
  }

  // 1. Separate headers and movetext at the first blank line (or double newline)
  const normalized = pgn.replace(/\r\n/g, '\n');
  const blankLineIdx = normalized.search(/\n\s*\n/);

  let headerSection = '';
  let movetextSection = '';

  if (blankLineIdx !== -1) {
    headerSection = normalized.slice(0, blankLineIdx).trim();
    movetextSection = normalized.slice(blankLineIdx).trim();
  } else if (normalized.trim().startsWith('[')) {
    // If no blank line, find end of last tag pair
    const lastBracket = normalized.lastIndexOf(']');
    if (lastBracket !== -1) {
      headerSection = normalized.slice(0, lastBracket + 1).trim();
      movetextSection = normalized.slice(lastBracket + 1).trim();
    } else {
      movetextSection = normalized.trim();
    }
  } else {
    movetextSection = normalized.trim();
  }

  // 2. Parse headers
  const headers: Record<string, string> = {};
  const headerRegex = /\[(\w+)\s+"([^"]*)"\]/g;
  let headerMatch: RegExpExecArray | null;
  while ((headerMatch = headerRegex.exec(headerSection)) !== null) {
    headers[headerMatch[1]] = headerMatch[2];
  }

  // 3. Tokenize movetext
  const moves = tokenizeMovetext(movetextSection);

  return {
    headers,
    movetext: movetextSection,
    moves,
  };
}

/**
 * Tokenize movetext using a single unified regex handling:
 * {comments}, $nags, move numbers, recursive variations, and SAN moves.
 */
export function tokenizeMovetext(movetext: string): MoveToken[] {
  if (!movetext) return [];

  // Unified regex:
  // Group 1: Comment content inside { ... }
  // Group 2: NAG number inside $1, $2, etc.
  // Group 3: Move number e.g. 1. or 1...
  // Group 4: Variation ( ... ) - to skip alternative lines
  // Group 5: Game termination (1-0, 0-1, 1/2-1/2, *)
  // Group 6: SAN move token
  const tokenRegex =
    /\{([^}]*)\}|\$(\d+)|(\d+\s*\.{1,3})|\(([^)]*)\)|(1-0|0-1|1\/2-1\/2|\*)|([a-hA-H1-8KQRBNkqrbnO0\-+#=xX]+)/g;

  const moves: MoveToken[] = [];
  let currentPly = 0;
  let match: RegExpExecArray | null;

  while ((match = tokenRegex.exec(movetext)) !== null) {
    const [
      ,
      commentText,
      nagVal,
      moveNumStr,
      variationText,
      gameResult,
      sanToken,
    ] = match;

    // 1. Comment token -> attach to the preceding move
    if (commentText !== undefined) {
      const cleanComment = commentText.trim();
      if (moves.length > 0) {
        const lastMove = moves[moves.length - 1];
        lastMove.comment = lastMove.comment
          ? `${lastMove.comment} ${cleanComment}`
          : cleanComment;

        // Parse eval: [%eval 0.24] or [%eval -1.50] or [%eval #2] or [%eval #-3]
        const evalMatch = cleanComment.match(/\[%eval\s+(#?-?\d+(?:\.\d+)?)\]/);
        if (evalMatch) {
          const evalStr = evalMatch[1];
          if (evalStr.startsWith('#')) {
            const mate = parseInt(evalStr.slice(1), 10);
            lastMove.eval = { mate: isNaN(mate) ? 1 : mate };
          } else {
            const pawnVal = parseFloat(evalStr);
            if (!isNaN(pawnVal)) {
              // Convert pawns to centipawns
              lastMove.eval = { cp: Math.round(pawnVal * 100) };
            }
          }
        }

        // Parse clock: [%clk 0:03:00] or [%clk 12:45.3]
        const clkMatch = cleanComment.match(/\[%clk\s+([0-9:.]+)\]/);
        if (clkMatch) {
          lastMove.clockSeconds = parseClockToSeconds(clkMatch[1]);
        }
      }
      continue;
    }

    // 2. NAG token -> attach to preceding move
    if (nagVal !== undefined) {
      if (moves.length > 0) {
        const lastMove = moves[moves.length - 1];
        if (!lastMove.nags) lastMove.nags = [];
        lastMove.nags.push(`$${nagVal}`);
      }
      continue;
    }

    // 3. Move number or Variation or Result -> skip
    if (moveNumStr !== undefined || variationText !== undefined || gameResult !== undefined) {
      continue;
    }

    // 4. SAN token -> new move ply
    if (sanToken !== undefined) {
      // Ignore results that might slip through like '1-0'
      if (sanToken === '1-0' || sanToken === '0-1' || sanToken === '1/2-1/2' || sanToken === '*') {
        continue;
      }

      currentPly++;
      const color: Color = currentPly % 2 === 1 ? 'white' : 'black';
      const moveNumber = Math.ceil(currentPly / 2);

      moves.push({
        san: sanToken,
        ply: currentPly,
        moveNumber,
        color,
      });
    }
  }

  return moves;
}
