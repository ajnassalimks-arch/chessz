import { Chess } from 'chess.js';

export type SkillTier = 'beginner' | 'adv_beginner' | 'intermediate';

export interface MistakeCategoryInfo {
  id: 'hanging_pieces' | 'pins_forks' | 'king_safety' | 'endgame_conversion' | 'opening_traps';
  title: string;
  badge: string;
  icon: string; // lucide icon identifier
  ruleTitle: string;
  ruleBody: string;
  coachTip: string;
  parentTip: string;
}

export interface ClassifiedMistake {
  categoryId: MistakeCategoryInfo['id'];
  categoryTitle: string;
  badge: string;
  icon: string;
  ruleTitle: string;
  ruleBody: string;
  coachTip: string;
  parentTip: string;
}

// Category Templates per Skill Tier
const CATEGORY_DEFINITIONS: Record<SkillTier, Record<MistakeCategoryInfo['id'], Omit<MistakeCategoryInfo, 'id'>>> = {
  beginner: {
    hanging_pieces: {
      title: 'Hanging & Undefended Pieces',
      badge: '1-Move Drop',
      icon: 'AlertTriangle',
      ruleTitle: 'The 2-Second Bodyguard Rule',
      ruleBody: 'Before letting go of any piece, take 2 seconds to check: "Does this piece have a teammate defending it?" Never donate free points.',
      coachTip: 'Count attackers vs defenders before every move. An undefended piece is a target.',
      parentTip: 'Remind your child: "Check your bodyguards! Make sure every piece has a friend protecting it."',
    },
    pins_forks: {
      title: 'Double Attacks & Knight Hops',
      badge: 'Forks & Pins',
      icon: 'Zap',
      ruleTitle: 'The Fork Radar',
      ruleBody: 'Look out for enemy Knights and Queens jumping into squares that hit two of your pieces at the same time.',
      coachTip: 'Keep your King and Queen on opposite colored squares when Knights are on the board.',
      parentTip: 'Ask them: "Watch out for sneaky Knight hops attacking two pieces at once!"',
    },
    king_safety: {
      title: 'Back-Rank & King Exposure',
      badge: 'King Safety',
      icon: 'ShieldAlert',
      ruleTitle: 'The Escape Window (Luft)',
      ruleBody: 'Always make an escape square (like h3 or h6) for your King so you never get checkmated on the back rank.',
      coachTip: 'A back-rank corridor with trapped pawns in front is a recipe for sudden checkmate.',
      parentTip: 'Remind your child to castle early and make a little escape window for their King.',
    },
    endgame_conversion: {
      title: 'Endgame & Free Queens',
      badge: 'Endgame',
      icon: 'Crown',
      ruleTitle: 'March the Passed Pawn',
      ruleBody: 'In the endgame, activate your King into the center and escort your passed pawns to become Queens.',
      coachTip: 'Don\'t leave pawns behind without King support in simplified positions.',
      parentTip: 'Tell your child: "In the endgame, the King is a fighter! Bring the King to help the pawns."',
    },
    opening_traps: {
      title: 'Early Queen & Opening Traps',
      badge: 'Opening Rush',
      icon: 'Sparkles',
      ruleTitle: 'Knights Before Queens',
      ruleBody: 'Develop your Knights and Bishops and castle before bringing your Queen into the fight.',
      coachTip: 'Bringing the Queen out on move 3 gives your opponent free development by attacking her.',
      parentTip: 'Remind them: "Get all your helpers out first—don\'t rush the Queen out alone!"',
    },
  },
  adv_beginner: {
    hanging_pieces: {
      title: 'Tactical Oversights & Loose Pieces',
      badge: 'Tactical Drop',
      icon: 'AlertTriangle',
      ruleTitle: 'Loose Pieces Drop Off (LPDO)',
      ruleBody: 'GM John Nunn\'s golden rule: Loose pieces without defenders are magnets for tactical combinations.',
      coachTip: 'Every undefended piece is a tactical weakness waiting to be exploited by a double attack.',
      parentTip: 'Encourage calculating one move further: "Is that piece really safe after they capture?"',
    },
    pins_forks: {
      title: 'Pins, Skewers & Absolute Ties',
      badge: 'Laser Pins',
      icon: 'Zap',
      ruleTitle: 'Laser Vision',
      ruleBody: 'Whenever your King, Queen, or Rook stand on the same line, watch out for pinning Bishops and Rooks.',
      coachTip: 'Break pins immediately before your opponent piles on more attackers with pressure.',
      parentTip: 'Help them spot lines: "Check if your pieces are lined up like bowling pins!"',
    },
    king_safety: {
      title: 'King Shelter & Castling Breaches',
      badge: 'King Safety',
      icon: 'ShieldAlert',
      ruleTitle: 'The Iron Castle',
      ruleBody: 'Never push the pawns in front of your castled King unless forced. Each pawn push creates permanent holes.',
      coachTip: 'Weakening f7/f2 or g7/g2 opens devastating mating corridors.',
      parentTip: 'Remind them: "Keep the shield solid around the King."',
    },
    endgame_conversion: {
      title: 'Endgame Pawn Races & Opposition',
      badge: 'Endgame Race',
      icon: 'Crown',
      ruleTitle: 'The Rule of the Square',
      ruleBody: 'Calculate whether the King can catch the passed pawn before pushing. King activity is paramount.',
      coachTip: 'Endgames are won by active Kings and precise pawn structure calculation.',
      parentTip: 'Remind them that endgames require patience—count the steps of the pawn race.',
    },
    opening_traps: {
      title: 'Opening Development & Gambit Punishments',
      badge: 'Opening Line',
      icon: 'Sparkles',
      ruleTitle: 'Center Control First',
      ruleBody: 'Greedy pawn grabbing in the opening opens lines for the opponent. Prioritize piece mobility.',
      coachTip: 'Falling for gambits or neglecting center tension leads to rapid collapse against prepared opponents.',
      parentTip: 'Remind them to control the center and finish development before hunting pawns.',
    },
  },
  intermediate: {
    hanging_pieces: {
      title: 'Overloaded Defenders & Deflection',
      badge: 'Overload',
      icon: 'AlertTriangle',
      ruleTitle: 'Remove the Guard',
      ruleBody: 'When a piece is tasked with defending two vital squares, the opponent will deflect it with a sacrifice.',
      coachTip: 'Identify the overloaded piece and calculate deflection or clearance strikes.',
      parentTip: 'Encourage calculating candidate moves deeply.',
    },
    pins_forks: {
      title: 'Complex Pins & Geometric Double Strikes',
      badge: 'Geometry',
      icon: 'Zap',
      ruleTitle: 'Geometric Coordination',
      ruleBody: 'Exploit cross-pins and discovered attacks to win heavy material or force decisive simplification.',
      coachTip: 'Look for discovered checks and dual-purpose tactical moves.',
      parentTip: 'Focus on multi-step calculation and looking at all checks and captures.',
    },
    king_safety: {
      title: 'Dynamic King Attacks & Mating Nets',
      badge: 'King Attack',
      icon: 'ShieldAlert',
      ruleTitle: 'King Ring Vulnerability',
      ruleBody: 'When the defensive minor pieces leave the King\'s perimeter, an attack can be launched with piece sacrifices.',
      coachTip: 'Count defenders within the 3x3 box around the castled King before committing to an attack.',
      parentTip: 'Safety first: calculate opponent counter-attacks before pushing forward.',
    },
    endgame_conversion: {
      title: 'Technical Endgames & Rook Activity',
      badge: 'Technical Ending',
      icon: 'Crown',
      ruleTitle: 'Tarrasch\'s Rook Rule',
      ruleBody: 'Rooks belong behind passed pawns—your own to push them, the opponent\'s to block them.',
      coachTip: 'Activity trumps passive defense in rook endgames. Passive rooks lose quickly.',
      parentTip: 'Keep rooks active and cut off the enemy King.',
    },
    opening_traps: {
      title: 'Opening Imbalances & Structure Concessions',
      badge: 'Structure Concession',
      icon: 'Sparkles',
      ruleTitle: 'Pawn Structure Integrity',
      ruleBody: 'Allowing doubled isolated pawns or ceding key outpost squares in the opening hands opponent long-term control.',
      coachTip: 'Never concede structural weaknesses in the opening without concrete tactical compensation.',
      parentTip: 'Play principled opening moves according to master opening principles.',
    },
  },
};

/**
 * Classify a mistake into one of the 5 categories based on board position and move metadata
 */
export function classifyMistake(
  fenBefore: string,
  playedSan: string,
  bestUci: string,
  ply: number,
  evalSwingPawns?: number,
  tier: SkillTier = 'beginner'
): ClassifiedMistake {
  const selectedTier: SkillTier = tier in CATEGORY_DEFINITIONS ? tier : 'beginner';
  const tierDefs = CATEGORY_DEFINITIONS[selectedTier];

  try {
    const chess = new Chess(fenBefore);
    const board = chess.board();

    // 1. Count remaining non-pawn, non-king pieces
    let totalPieces = 0;
    let nonPawnPieces = 0;
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const sq = board[r][c];
        if (sq) {
          totalPieces++;
          if (sq.type !== 'p' && sq.type !== 'k') {
            nonPawnPieces++;
          }
        }
      }
    }

    function toClassified(categoryId: MistakeCategoryInfo['id'], def: Omit<MistakeCategoryInfo, 'id'>): ClassifiedMistake {
      return {
        categoryId,
        categoryTitle: def.title,
        badge: def.badge,
        icon: def.icon,
        ruleTitle: def.ruleTitle,
        ruleBody: def.ruleBody,
        coachTip: def.coachTip,
        parentTip: def.parentTip,
      };
    }

    // Heuristic 1: Endgame (Total pieces <= 12 or non-pawn <= 4)
    if (totalPieces <= 12 || nonPawnPieces <= 4) {
      return toClassified('endgame_conversion', tierDefs.endgame_conversion);
    }

    // Heuristic 2: Opening Traps & Early Queen (Move <= 10, ply <= 20)
    if (ply <= 20) {
      if (playedSan.startsWith('Q') || ply <= 12) {
        return toClassified('opening_traps', tierDefs.opening_traps);
      }
    }

    // Heuristic 3: King Safety & Back-Rank (Check on board, or moves involving back-rank 1/8)
    const isCheck = chess.inCheck() || playedSan.includes('+') || playedSan.includes('#');
    const targetSq = bestUci.slice(2, 4);
    const isBackRank = targetSq.endsWith('1') || targetSq.endsWith('8');
    if (isCheck && isBackRank) {
      return toClassified('king_safety', tierDefs.king_safety);
    }

    // Heuristic 4: Pins & Forks (Knight best move, or opponent refutation creates double threat)
    if (bestUci.startsWith('n') || bestUci.startsWith('b') || playedSan.startsWith('N')) {
      return toClassified('pins_forks', tierDefs.pins_forks);
    }

    // Heuristic 5: Default to Hanging Pieces if large eval swing or piece drop
    if (evalSwingPawns && evalSwingPawns >= 2.5) {
      return toClassified('hanging_pieces', tierDefs.hanging_pieces);
    }

    // General fallback distribution based on ply
    if (isCheck) {
      return toClassified('king_safety', tierDefs.king_safety);
    }

    return toClassified('hanging_pieces', tierDefs.hanging_pieces);
  } catch {
    const def = tierDefs.hanging_pieces;
    return {
      categoryId: 'hanging_pieces',
      categoryTitle: def.title,
      badge: def.badge,
      icon: def.icon,
      ruleTitle: def.ruleTitle,
      ruleBody: def.ruleBody,
      coachTip: def.coachTip,
      parentTip: def.parentTip,
    };
  }
}

/**
 * Return all 5 categories info for a given skill tier
 */
export function getCategoryDefinitionsForTier(tier: SkillTier = 'beginner'): MistakeCategoryInfo[] {
  const selectedTier = tier in CATEGORY_DEFINITIONS ? tier : 'beginner';
  const defs = CATEGORY_DEFINITIONS[selectedTier];
  return (Object.keys(defs) as MistakeCategoryInfo['id'][]).map((id) => ({
    id,
    ...defs[id],
  }));
}
