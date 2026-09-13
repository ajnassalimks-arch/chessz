import { Chess } from 'chess.js';

export type SkillTier = 'beginner' | 'adv_beginner' | 'intermediate';

export interface MistakeCategoryInfo {
  id: string;
  tier: SkillTier;
  title: string;
  badge: string;
  icon: string; // lucide icon identifier
  ruleTitle: string;
  ruleBody: string;
  coachTip: string;
  parentTip: string;
}

export interface ClassifiedMistake {
  categoryId: string;
  tier: SkillTier;
  categoryTitle: string;
  badge: string;
  icon: string;
  ruleTitle: string;
  ruleBody: string;
  coachTip: string;
  parentTip: string;
}

// 5 DISTINCT Categories per Skill Tier
export const TIER_CATEGORY_DEFINITIONS: Record<SkillTier, MistakeCategoryInfo[]> = {
  beginner: [
    {
      id: 'beg_hanging_piece',
      tier: 'beginner',
      title: '1-Move Hanging Pieces',
      badge: 'Free Piece Drop',
      icon: 'AlertTriangle',
      ruleTitle: 'The 2-Second Bodyguard Rule',
      ruleBody: 'Before letting go of any piece, take 2 seconds to check: "Does this piece have a teammate defending it?" Never donate free points.',
      coachTip: 'Count attackers vs defenders before every move. An undefended piece is a target.',
      parentTip: 'Remind your child: "Check your bodyguards! Make sure every piece has a friend protecting it."',
    },
    {
      id: 'beg_missed_capture',
      tier: 'beginner',
      title: 'Missed Free Captures',
      badge: 'Free Points Overlooked',
      icon: 'EyeOff',
      ruleTitle: 'Free Lunch Radar',
      ruleBody: 'Scan the board on every turn: did your opponent leave one of their pieces with zero defenders? Take free pieces immediately!',
      coachTip: 'Before playing a quiet move, look at every enemy piece to see if one can be captured for free.',
      parentTip: 'Tell your child: "Look at the other player\'s pieces! If they give you a free piece, take it!"',
    },
    {
      id: 'beg_back_rank_mate',
      tier: 'beginner',
      title: 'Back-Rank & Corridor Mates',
      badge: '1-Move Checkmate',
      icon: 'ShieldAlert',
      ruleTitle: 'The Escape Window (Luft)',
      ruleBody: 'Always push h3 or h6 to give your King a breathing room escape square so you never get trapped on the back row.',
      coachTip: 'A back-rank corridor with pawns stuck in front is a sudden checkmate trap.',
      parentTip: 'Remind your child: "Open a little window for your King so the enemy Rook can\'t trap you!"',
    },
    {
      id: 'beg_early_queen',
      tier: 'beginner',
      title: 'Early Queen Rush',
      badge: 'Queen Out Too Early',
      icon: 'Sparkles',
      ruleTitle: 'Knights & Bishops Before Queens',
      ruleBody: 'Develop your minor pieces (Knights & Bishops) and castle before moving your Queen into enemy territory.',
      coachTip: 'Moving the Queen on moves 2–5 allows your opponent to develop with tempo by attacking her.',
      parentTip: 'Remind them: "Get all your team helpers out first—don\'t rush the Queen out alone!"',
    },
    {
      id: 'beg_uncastled_king',
      tier: 'beginner',
      title: 'Stranded Center King',
      badge: 'King Not Castled',
      icon: 'Castle',
      ruleTitle: 'Castle Early, Castle Often',
      ruleBody: 'Castle within the first 10 moves! A King stuck in the middle will get blasted open by enemy rooks and queens.',
      coachTip: 'Castling tucks the King into safety and connects your rooks for battle.',
      parentTip: 'Tell them: "Tuck your King safely into his castle before starting the attack."',
    },
  ],

  adv_beginner: [
    {
      id: 'adv_knight_forks',
      tier: 'adv_beginner',
      title: 'Knight Forks & Double Attacks',
      badge: 'Tactical Fork',
      icon: 'Zap',
      ruleTitle: 'The Fork Radar',
      ruleBody: 'Watch out for Knight hops and Queen strikes that attack your King and Rook or Queen and Rook simultaneously.',
      coachTip: 'Keep valuable pieces on opposite colored squares when an enemy Knight is nearby.',
      parentTip: 'Help them spot lines: "Watch out for sneaky Knight hops attacking two pieces at once!"',
    },
    {
      id: 'adv_pins_skewers',
      tier: 'adv_beginner',
      title: 'Absolute & Relative Pins',
      badge: 'Pinned Piece',
      icon: 'Target',
      ruleTitle: 'Laser Pin Defense',
      ruleBody: 'Never leave pieces lined up on the same diagonal or file with your King or Queen—Bishops and Rooks will pin them.',
      coachTip: 'Break pins immediately by stepping the King or Queen away or interposing a defender.',
      parentTip: 'Encourage noticing alignment: "Check if your pieces are lined up like bowling pins!"',
    },
    {
      id: 'adv_zwischenzug',
      tier: 'adv_beginner',
      title: 'Missed Counter-Threats (In-Between Moves)',
      badge: 'Zwischenzug',
      icon: 'Clock',
      ruleTitle: 'Check Before You Trade',
      ruleBody: 'Before recapturing a piece, ask: "Can my opponent deliver a check or a bigger threat in between?"',
      coachTip: 'Don\'t assume trades are automatic. Look for intermediate checks and counter-attacks.',
      parentTip: 'Remind them: "Don\'t rush to trade—pause and check if they have a surprise move!"',
    },
    {
      id: 'adv_pawn_races',
      tier: 'adv_beginner',
      title: 'Endgame Pawn Races & King Escorts',
      badge: 'Endgame Tempo',
      icon: 'Crown',
      ruleTitle: 'King Leads the Way',
      ruleBody: 'In pawn endings, your King must walk in front of your passed pawn to shoulder away the enemy King.',
      coachTip: 'Pushing pawns without King activity allows the opponent King to capture them easily.',
      parentTip: 'Remind them: "In the endgame, the King is the hero! Walk with your pawns."',
    },
    {
      id: 'adv_opening_traps',
      tier: 'adv_beginner',
      title: 'Opening Traps & Poisoned Pawns',
      badge: 'Opening Trap',
      icon: 'Flame',
      ruleTitle: 'Never Grab Poisoned Pawns',
      ruleBody: 'Don\'t fall for Fried Liver attacks or grab pawns in the opening when your own pieces are still sleeping.',
      coachTip: 'Falling for gambits or opening traps costs full pieces. Play principled developing moves.',
      parentTip: 'Encourage patience: "Don\'t get tempted by free pawns if it leaves your King open."',
    },
  ],

  intermediate: [
    {
      id: 'inter_overloaded_guards',
      tier: 'intermediate',
      title: 'Overloaded Defenders & Deflections',
      badge: 'Overloaded Guard',
      icon: 'Layers',
      ruleTitle: 'Remove the Defender',
      ruleBody: 'When one piece is responsible for defending two vital squares or pieces, deflect it with a tactical strike.',
      coachTip: 'Identify the overloaded piece and calculate deflection or clearance sacrifices.',
      parentTip: 'Encourage calculating one move deeper on overloaded pieces.',
    },
    {
      id: 'inter_combinations',
      tier: 'intermediate',
      title: 'Multi-Move Combinations & Decoys',
      badge: '3-Ply Tactics',
      icon: 'Cpu',
      ruleTitle: 'Decoy & Clearance Mastery',
      ruleBody: 'Calculate forced lines: checks, captures, and threats that force the opponent onto fatal squares.',
      coachTip: 'Look for quiet waiting moves and double-purpose tactical strikes in complex positions.',
      parentTip: 'Praise their deep calculation and planning ahead.',
    },
    {
      id: 'inter_pawn_structure',
      tier: 'intermediate',
      title: 'Structural Concessions & Outposts',
      badge: 'Outpost Loss',
      icon: 'Grid',
      ruleTitle: 'Pawn Structure Integrity',
      ruleBody: 'Ceding key outpost squares (like d5 or e4) or allowing chronic holes gives the opponent permanent domination.',
      coachTip: 'Never push pawns that weaken color complexes unless concrete advantages are gained.',
      parentTip: 'Remind them to look at the whole board and pawn chains.',
    },
    {
      id: 'inter_king_pressure',
      tier: 'intermediate',
      title: 'King Ring Vulnerabilities & Mating Nets',
      badge: 'King Shelter Loss',
      icon: 'ShieldOff',
      ruleTitle: 'Guard the Perimeter',
      ruleBody: 'When defensive minor pieces leave your castled King\'s perimeter, opponent sacrifices breach the fortress.',
      coachTip: 'Count defenders within the 3x3 box around your castled King before launching a flank attack.',
      parentTip: 'Remind them that King safety is always priority #1.',
    },
    {
      id: 'inter_technical_endgame',
      tier: 'intermediate',
      title: 'Technical Endgames & Passive Rooks',
      badge: 'Endgame Activity',
      icon: 'Anchor',
      ruleTitle: 'Tarrasch\'s Active Rook Principle',
      ruleBody: 'Rooks belong behind passed pawns—never in front or passively tied to defense.',
      coachTip: 'Activity trumps passive defense in rook endgames. Cut off the enemy King.',
      parentTip: 'Encourage active pieces rather than defending passively in endgames.',
    },
  ],
};

/**
 * Classify a blunder into one of the 5 level-specific categories
 */
export function classifyMistake(
  fenBefore: string,
  playedSan: string,
  bestUci: string,
  ply: number,
  evalSwingPawns?: number,
  tier: SkillTier = 'beginner'
): ClassifiedMistake {
  const selectedTier: SkillTier = tier in TIER_CATEGORY_DEFINITIONS ? tier : 'beginner';
  const tierCategories = TIER_CATEGORY_DEFINITIONS[selectedTier];

  try {
    const chess = new Chess(fenBefore);
    const board = chess.board();

    // Count remaining non-pawn pieces
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

    const isCheck = chess.inCheck() || playedSan.includes('+') || playedSan.includes('#');
    const targetSq = bestUci.slice(2, 4);
    const isBackRank = targetSq.endsWith('1') || targetSq.endsWith('8');

    function toClassified(cat: MistakeCategoryInfo): ClassifiedMistake {
      return {
        categoryId: cat.id,
        tier: cat.tier,
        categoryTitle: cat.title,
        badge: cat.badge,
        icon: cat.icon,
        ruleTitle: cat.ruleTitle,
        ruleBody: cat.ruleBody,
        coachTip: cat.coachTip,
        parentTip: cat.parentTip,
      };
    }

    // ==========================================
    // 1. BEGINNER CLASSIFICATION (400 - 900)
    // ==========================================
    if (selectedTier === 'beginner') {
      // Early Queen (moves 1-6 / ply <= 14)
      if (ply <= 14 && playedSan.startsWith('Q')) {
        const cat = tierCategories.find((c) => c.id === 'beg_early_queen')!;
        return toClassified(cat);
      }

      // Back-Rank or Checkmate
      if (playedSan.includes('#') || (isCheck && isBackRank)) {
        const cat = tierCategories.find((c) => c.id === 'beg_back_rank_mate')!;
        return toClassified(cat);
      }

      // Stranded uncastled king (ply > 16, king on e1/e8)
      const turn = chess.turn();
      const kingSq = turn === 'w' ? 'e1' : 'e8';
      const kingPiece = chess.get(kingSq as any);
      if (ply > 16 && kingPiece && kingPiece.type === 'k') {
        const cat = tierCategories.find((c) => c.id === 'beg_uncastled_king')!;
        return toClassified(cat);
      }

      // Missed Free Captures (Best move was capture with large swing, but user played non-capture)
      if (bestUci.length >= 4 && !playedSan.includes('x') && evalSwingPawns && evalSwingPawns >= 2.0) {
        const cat = tierCategories.find((c) => c.id === 'beg_missed_capture')!;
        return toClassified(cat);
      }

      // Default for beginner: 1-Move Hanging Pieces
      const cat = tierCategories.find((c) => c.id === 'beg_hanging_piece')!;
      return toClassified(cat);
    }

    // ==========================================
    // 2. ADVANCE BEGINNER CLASSIFICATION (900 - 1300)
    // ==========================================
    if (selectedTier === 'adv_beginner') {
      // Opening Traps (ply <= 18)
      if (ply <= 18) {
        const cat = tierCategories.find((c) => c.id === 'adv_opening_traps')!;
        return toClassified(cat);
      }

      // Endgame Pawn Races (Total pieces <= 12)
      if (totalPieces <= 12 || nonPawnPieces <= 4) {
        const cat = tierCategories.find((c) => c.id === 'adv_pawn_races')!;
        return toClassified(cat);
      }

      // Knight Forks & Double Attacks
      if (bestUci.startsWith('n') || playedSan.startsWith('N')) {
        const cat = tierCategories.find((c) => c.id === 'adv_knight_forks')!;
        return toClassified(cat);
      }

      // Pins & Skewers (Bishop/Rook/Queen line)
      if (bestUci.startsWith('b') || bestUci.startsWith('r') || bestUci.startsWith('q')) {
        const cat = tierCategories.find((c) => c.id === 'adv_pins_skewers')!;
        return toClassified(cat);
      }

      // In-Between Moves / Zwischenzug
      const cat = tierCategories.find((c) => c.id === 'adv_zwischenzug')!;
      return toClassified(cat);
    }

    // ==========================================
    // 3. INTERMEDIATE+ CLASSIFICATION (1300 - 1800+)
    // ==========================================
    // Endgame Technicality
    if (totalPieces <= 12 || nonPawnPieces <= 4) {
      const cat = tierCategories.find((c) => c.id === 'inter_technical_endgame')!;
      return toClassified(cat);
    }

    // King Ring Vulnerabilities
    if (isCheck || isBackRank) {
      const cat = tierCategories.find((c) => c.id === 'inter_king_pressure')!;
      return toClassified(cat);
    }

    // Multi-move Combinations (High swing > 3.0 pawns)
    if (evalSwingPawns && evalSwingPawns >= 3.0) {
      const cat = tierCategories.find((c) => c.id === 'inter_combinations')!;
      return toClassified(cat);
    }

    // Overloaded Defenders (Medium tactical swing)
    if (evalSwingPawns && evalSwingPawns >= 1.5) {
      const cat = tierCategories.find((c) => c.id === 'inter_overloaded_guards')!;
      return toClassified(cat);
    }

    // Structural Concessions & Outposts
    const cat = tierCategories.find((c) => c.id === 'inter_pawn_structure')!;
    return toClassified(cat);

  } catch {
    const fallback = tierCategories[0];
    return {
      categoryId: fallback.id,
      tier: selectedTier,
      categoryTitle: fallback.title,
      badge: fallback.badge,
      icon: fallback.icon,
      ruleTitle: fallback.ruleTitle,
      ruleBody: fallback.ruleBody,
      coachTip: fallback.coachTip,
      parentTip: fallback.parentTip,
    };
  }
}

/**
 * Return all 5 categories info for a given skill tier
 */
export function getCategoryDefinitionsForTier(tier: SkillTier = 'beginner'): MistakeCategoryInfo[] {
  const selectedTier = tier in TIER_CATEGORY_DEFINITIONS ? tier : 'beginner';
  return TIER_CATEGORY_DEFINITIONS[selectedTier];
}
