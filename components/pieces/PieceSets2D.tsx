import React from "react";

export type PieceSetStyle =
  | "default"
  | "liquid-chrome"
  | "neo-arcade"
  | "lichess-shapes"
  | "lichess-mono"
  | "lichess-spatial"
  | "lichess-pixel";

export interface PieceProps {
  fill?: string;
  square?: string;
  svgStyle?: React.CSSProperties;
}

// ============================================================================
// 1. LIQUID CHROME & ACID NEON 2D (Y2K Molten Metallic & Glowing Neon)
// ============================================================================
function LiquidChromePawn({ isWhite, ...props }: { isWhite: boolean } & PieceProps) {
  const gradId = isWhite ? "lc-pawn-w" : "lc-pawn-b";
  return (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", ...props.svgStyle }}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          {isWhite ? (
            <>
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#e2e8f0" />
              <stop offset="85%" stopColor="#94a3b8" />
              <stop offset="100%" stopColor="#64748b" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="35%" stopColor="#10b981" />
              <stop offset="70%" stopColor="#064e3b" />
              <stop offset="100%" stopColor="#022c22" />
            </>
          )}
        </linearGradient>
        <filter id={`${gradId}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation={isWhite ? "1.5" : "3"} floodColor={isWhite ? "#94a3b8" : "#10b981"} floodOpacity={isWhite ? "0.4" : "0.75"} />
        </filter>
      </defs>
      <g filter={`url(#${gradId}-glow)`}>
        {/* Base */}
        <path d="M28 84 C38 80 62 80 72 84 C76 86 76 89 72 90 C60 92 40 92 28 90 C24 89 24 86 28 84 Z" fill={`url(#${gradId})`} stroke={isWhite ? "#cbd5e1" : "#34d399"} strokeWidth="1.5" />
        {/* Body Column */}
        <path d="M36 82 C38 65 42 52 45 44 C42 42 42 38 46 36 C48 37 52 37 54 36 C58 38 58 42 55 44 C58 52 62 65 64 82 Z" fill={`url(#${gradId})`} stroke={isWhite ? "#cbd5e1" : "#34d399"} strokeWidth="1.5" />
        {/* Mirror Sphere Head */}
        <circle cx="50" cy="27" r="14" fill={`url(#${gradId})`} stroke={isWhite ? "#ffffff" : "#6ee7b7"} strokeWidth="1.8" />
        {/* Liquid Specular Glint */}
        <ellipse cx="46" cy="22" rx="4.5" ry="3" fill="#ffffff" opacity={isWhite ? "0.9" : "0.75"} />
      </g>
    </svg>
  );
}

function LiquidChromeKnight({ isWhite, ...props }: { isWhite: boolean } & PieceProps) {
  const gradId = isWhite ? "lc-knight-w" : "lc-knight-b";
  return (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", ...props.svgStyle }}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          {isWhite ? (
            <>
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#64748b" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#6ee7b7" />
              <stop offset="40%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#022c22" />
            </>
          )}
        </linearGradient>
      </defs>
      {/* Mecha Steed Silhouette */}
      <path d="M25 88 C38 84 62 84 75 88 C77 90 73 92 50 92 C27 92 23 90 25 88 Z" fill={`url(#${gradId})`} stroke={isWhite ? "#cbd5e1" : "#34d399"} strokeWidth="1.5" />
      <path d="M30 86 C32 72 35 60 40 50 C36 48 31 42 30 36 C30 30 33 24 40 18 C43 15 47 16 48 20 C52 14 60 14 62 20 C64 26 62 34 68 40 C74 46 72 65 70 86 Z" fill={`url(#${gradId})`} stroke={isWhite ? "#cbd5e1" : "#34d399"} strokeWidth="1.8" />
      {/* Mecha Cyber Visor */}
      <polygon points="34,36 48,30 46,36 36,40" fill={isWhite ? "#38bdf8" : "#a7f3d0"} opacity="0.9" />
      {/* Wing Thruster */}
      <polygon points="52,42 66,35 62,54 52,50" fill={isWhite ? "#94a3b8" : "#059669"} stroke={isWhite ? "#ffffff" : "#34d399"} strokeWidth="1.2" />
    </svg>
  );
}

function LiquidChromeBishop({ isWhite, ...props }: { isWhite: boolean } & PieceProps) {
  const gradId = isWhite ? "lc-bishop-w" : "lc-bishop-b";
  return (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", ...props.svgStyle }}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          {isWhite ? (
            <>
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#64748b" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#a7f3d0" />
              <stop offset="40%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#064e3b" />
            </>
          )}
        </linearGradient>
      </defs>
      {/* Pedestal */}
      <path d="M26 88 C38 85 62 85 74 88 C76 90 73 92 50 92 C27 92 24 90 26 88 Z" fill={`url(#${gradId})`} stroke={isWhite ? "#cbd5e1" : "#34d399"} strokeWidth="1.5" />
      <path d="M34 85 C36 68 40 50 42 42 C40 38 42 35 44 32 C43 24 45 16 50 14 C55 16 57 24 56 32 C58 35 60 38 58 42 C60 50 64 68 66 85 Z" fill={`url(#${gradId})`} stroke={isWhite ? "#cbd5e1" : "#34d399"} strokeWidth="1.8" />
      {/* Slanted Mitre Cut Beam */}
      <line x1="44" y1="28" x2="56" y2="40" stroke={isWhite ? "#38bdf8" : "#ffffff"} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="50" cy="12" r="3.5" fill={isWhite ? "#ffffff" : "#6ee7b7"} />
    </svg>
  );
}

function LiquidChromeRook({ isWhite, ...props }: { isWhite: boolean } & PieceProps) {
  const gradId = isWhite ? "lc-rook-w" : "lc-rook-b";
  return (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", ...props.svgStyle }}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          {isWhite ? (
            <>
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="45%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#475569" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#6ee7b7" />
              <stop offset="50%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#022c22" />
            </>
          )}
        </linearGradient>
      </defs>
      <path d="M24 88 C38 85 62 85 76 88 C78 90 75 92 50 92 C25 92 22 90 24 88 Z" fill={`url(#${gradId})`} stroke={isWhite ? "#cbd5e1" : "#34d399"} strokeWidth="1.5" />
      {/* Brutalist Monolith Tower */}
      <path d="M33 85 L37 42 L31 42 L31 22 L39 22 L39 29 L46 29 L46 22 L54 22 L54 29 L61 29 L61 22 L69 22 L69 42 L63 42 L67 85 Z" fill={`url(#${gradId})`} stroke={isWhite ? "#cbd5e1" : "#34d399"} strokeWidth="1.8" />
      {/* Neon Bastion Core */}
      <rect x="44" y="48" width="12" height="18" rx="3" fill={isWhite ? "#38bdf8" : "#00ff88"} opacity="0.85" />
    </svg>
  );
}

function LiquidChromeQueen({ isWhite, ...props }: { isWhite: boolean } & PieceProps) {
  const gradId = isWhite ? "lc-queen-w" : "lc-queen-b";
  return (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", ...props.svgStyle }}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          {isWhite ? (
            <>
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#cbd5e1" />
              <stop offset="100%" stopColor="#475569" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#a7f3d0" />
              <stop offset="40%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#042f20" />
            </>
          )}
        </linearGradient>
      </defs>
      <path d="M22 88 C38 85 62 85 78 88 C80 90 76 92 50 92 C24 92 20 90 22 88 Z" fill={`url(#${gradId})`} stroke={isWhite ? "#cbd5e1" : "#34d399"} strokeWidth="1.5" />
      {/* Fluid Arch Body */}
      <path d="M30 85 C32 60 38 45 42 38 C34 38 27 34 26 26 C35 30 42 32 50 33 C58 32 65 30 74 26 C73 34 66 38 58 38 C62 45 68 60 70 85 Z" fill={`url(#${gradId})`} stroke={isWhite ? "#cbd5e1" : "#34d399"} strokeWidth="1.8" />
      {/* Floating Crown with Neon Halo */}
      <ellipse cx="50" cy="24" rx="16" ry="4.5" fill="none" stroke={isWhite ? "#38bdf8" : "#00ff88"} strokeWidth="2.5" />
      <path d="M38 22 L42 12 L50 17 L58 12 L62 22 Z" fill={`url(#${gradId})`} stroke={isWhite ? "#ffffff" : "#6ee7b7"} strokeWidth="1.5" />
      <circle cx="50" cy="9" r="3.2" fill={isWhite ? "#ffffff" : "#00ff88"} />
    </svg>
  );
}

function LiquidChromeKing({ isWhite, ...props }: { isWhite: boolean } & PieceProps) {
  const gradId = isWhite ? "lc-king-w" : "lc-king-b";
  return (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", ...props.svgStyle }}>
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
          {isWhite ? (
            <>
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="50%" stopColor="#e2e8f0" />
              <stop offset="100%" stopColor="#475569" />
            </>
          ) : (
            <>
              <stop offset="0%" stopColor="#6ee7b7" />
              <stop offset="45%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#022c22" />
            </>
          )}
        </linearGradient>
      </defs>
      <path d="M22 88 C38 85 62 85 78 88 C80 90 76 92 50 92 C24 92 20 90 22 88 Z" fill={`url(#${gradId})`} stroke={isWhite ? "#cbd5e1" : "#34d399"} strokeWidth="1.5" />
      {/* Imperial Robe Silhouette */}
      <path d="M28 85 C30 60 38 42 40 34 C33 32 30 25 32 20 C38 23 44 26 50 26 C56 26 62 23 68 20 C70 25 67 32 60 34 C62 42 70 60 72 85 Z" fill={`url(#${gradId})`} stroke={isWhite ? "#cbd5e1" : "#34d399"} strokeWidth="1.8" />
      {/* Floating Cyber Cross Sigil */}
      <path d="M48 6 L52 6 L52 11 L57 11 L57 15 L52 15 L52 20 L48 20 L48 15 L43 15 L43 11 L48 11 Z" fill={isWhite ? "#ffffff" : "#00ff88"} stroke={isWhite ? "#38bdf8" : "#ffffff"} strokeWidth="1.2" />
    </svg>
  );
}

// ============================================================================
// 2. NEO-ARCADE & STREETWEAR ART TOYS 2D (Designer Collectible Figures)
// ============================================================================
function NeoArcadePawn({ isWhite, ...props }: { isWhite: boolean } & PieceProps) {
  const bg = isWhite ? "#f3e8ff" : "#0f172a";
  const trim = isWhite ? "#c084fc" : "#06b6d4";
  const visor = isWhite ? "#38bdf8" : "#ec4899";
  return (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", ...props.svgStyle }}>
      {/* Chubby Mini-Bot Body */}
      <rect x="28" y="44" width="44" height="42" rx="16" fill={bg} stroke={trim} strokeWidth="3" />
      {/* Mini-Bot Head */}
      <rect x="33" y="16" width="34" height="26" rx="10" fill={bg} stroke={trim} strokeWidth="3" />
      {/* Digital Screen Visor */}
      <rect x="38" y="22" width="24" height="13" rx="4" fill="#000000" />
      {/* Glowing Pixel Eyes */}
      <circle cx="44" cy="28" r="2" fill={visor} />
      <circle cx="56" cy="28" r="2" fill={visor} />
      {/* Chest Badge */}
      <rect x="43" y="55" width="14" height="6" rx="2" fill={trim} />
    </svg>
  );
}

function NeoArcadeKnight({ isWhite, ...props }: { isWhite: boolean } & PieceProps) {
  const bg = isWhite ? "#f3e8ff" : "#0f172a";
  const trim = isWhite ? "#a855f7" : "#06b6d4";
  const glow = isWhite ? "#10b981" : "#ec4899";
  return (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", ...props.svgStyle }}>
      {/* Base */}
      <rect x="24" y="82" width="52" height="10" rx="5" fill={bg} stroke={trim} strokeWidth="3" />
      {/* Robo-Horse Helmet */}
      <path d="M28 82 C30 65 32 46 40 32 C35 28 30 22 34 16 C40 18 45 22 50 18 C58 12 68 18 66 28 C64 36 68 45 70 82 Z" fill={bg} stroke={trim} strokeWidth="3" />
      {/* Neon Mohawk Fin */}
      <path d="M48 10 C52 4 60 4 62 12 L56 22 Z" fill={glow} />
      {/* Cyber Visor Eyes */}
      <polygon points="36,32 52,26 48,34 38,36" fill={glow} />
    </svg>
  );
}

function NeoArcadeBishop({ isWhite, ...props }: { isWhite: boolean } & PieceProps) {
  const bg = isWhite ? "#f3e8ff" : "#0f172a";
  const trim = isWhite ? "#a855f7" : "#06b6d4";
  return (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", ...props.svgStyle }}>
      {/* Streetwear Oversized Cowl / Hoodie Silhouette */}
      <path d="M24 86 C26 65 34 45 42 36 C34 30 36 16 50 14 C64 16 66 30 58 36 C66 45 74 65 76 86 Z" fill={bg} stroke={trim} strokeWidth="3" />
      {/* Dark Faceless Mask Opening */}
      <ellipse cx="50" cy="30" rx="9" ry="12" fill="#000000" />
      {/* Glowing Eyes inside Hoodie */}
      <circle cx="47" cy="29" r="1.8" fill="#10b981" />
      <circle cx="53" cy="29" r="1.8" fill="#10b981" />
    </svg>
  );
}

function NeoArcadeRook({ isWhite, ...props }: { isWhite: boolean } & PieceProps) {
  const bg = isWhite ? "#f3e8ff" : "#0f172a";
  const trim = isWhite ? "#a855f7" : "#06b6d4";
  const accent = isWhite ? "#38bdf8" : "#ec4899";
  return (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", ...props.svgStyle }}>
      {/* Chunky Arcade Castle Turret */}
      <path d="M26 86 L32 40 L26 40 L26 20 L36 20 L36 28 L44 28 L44 20 L56 20 L56 28 L64 28 L64 20 L74 20 L74 40 L68 40 L74 86 Z" fill={bg} stroke={trim} strokeWidth="3" />
      {/* Pixel Art Windows */}
      <rect x="42" y="48" width="6" height="6" fill={accent} />
      <rect x="52" y="48" width="6" height="6" fill={accent} />
      <rect x="47" y="60" width="6" height="6" fill={accent} />
    </svg>
  );
}

function NeoArcadeQueen({ isWhite, ...props }: { isWhite: boolean } & PieceProps) {
  const bg = isWhite ? "#f3e8ff" : "#0f172a";
  const trim = isWhite ? "#a855f7" : "#06b6d4";
  const glow = isWhite ? "#ec4899" : "#00ff88";
  return (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", ...props.svgStyle }}>
      <rect x="24" y="84" width="52" height="8" rx="4" fill={bg} stroke={trim} strokeWidth="3" />
      <path d="M30 84 C32 60 38 42 42 36 C32 32 30 20 50 18 C70 20 68 32 58 36 C62 42 68 60 70 84 Z" fill={bg} stroke={trim} strokeWidth="3" />
      {/* Cat-Ear / Crown Antenna Headphones */}
      <path d="M36 28 C34 22 38 12 50 12 C62 12 66 22 64 28" fill="none" stroke={glow} strokeWidth="3.5" />
      <circle cx="34" cy="28" r="4.5" fill={glow} />
      <circle cx="66" cy="28" r="4.5" fill={glow} />
      {/* Crown Horns */}
      <polygon points="46,12 50,4 54,12" fill={trim} />
    </svg>
  );
}

function NeoArcadeKing({ isWhite, ...props }: { isWhite: boolean } & PieceProps) {
  const bg = isWhite ? "#f3e8ff" : "#0f172a";
  const trim = isWhite ? "#a855f7" : "#06b6d4";
  const gold = "#facc15";
  return (
    <svg viewBox="0 0 100 100" style={{ width: "100%", height: "100%", ...props.svgStyle }}>
      <rect x="22" y="84" width="56" height="8" rx="4" fill={bg} stroke={trim} strokeWidth="3" />
      <path d="M28 84 C30 58 36 38 42 32 C34 28 32 16 50 15 C68 16 66 28 58 32 C64 38 70 58 72 84 Z" fill={bg} stroke={trim} strokeWidth="3" />
      {/* Supreme Street Cap with Crown Badge */}
      <path d="M38 18 C42 10 58 10 62 18 Z" fill={gold} />
      <rect x="47" y="6" width="6" height="12" rx="1.5" fill={gold} />
      <rect x="44" y="9" width="12" height="6" rx="1.5" fill={gold} />
      {/* Street Gold Chain */}
      <path d="M42 46 C46 54 54 54 58 46" fill="none" stroke={gold} strokeWidth="2.5" />
    </svg>
  );
}

// ============================================================================
// EXPORT DICTIONARIES FOR REACT-CHESSBOARD
// ============================================================================
export const LIQUID_CHROME_PIECES = {
  wP: (props?: PieceProps) => <LiquidChromePawn isWhite={true} {...(props || {})} />,
  wN: (props?: PieceProps) => <LiquidChromeKnight isWhite={true} {...(props || {})} />,
  wB: (props?: PieceProps) => <LiquidChromeBishop isWhite={true} {...(props || {})} />,
  wR: (props?: PieceProps) => <LiquidChromeRook isWhite={true} {...(props || {})} />,
  wQ: (props?: PieceProps) => <LiquidChromeQueen isWhite={true} {...(props || {})} />,
  wK: (props?: PieceProps) => <LiquidChromeKing isWhite={true} {...(props || {})} />,
  bP: (props?: PieceProps) => <LiquidChromePawn isWhite={false} {...(props || {})} />,
  bN: (props?: PieceProps) => <LiquidChromeKnight isWhite={false} {...(props || {})} />,
  bB: (props?: PieceProps) => <LiquidChromeBishop isWhite={false} {...(props || {})} />,
  bR: (props?: PieceProps) => <LiquidChromeRook isWhite={false} {...(props || {})} />,
  bQ: (props?: PieceProps) => <LiquidChromeQueen isWhite={false} {...(props || {})} />,
  bK: (props?: PieceProps) => <LiquidChromeKing isWhite={false} {...(props || {})} />,
};

export const NEO_ARCADE_PIECES = {
  wP: (props?: PieceProps) => <NeoArcadePawn isWhite={true} {...(props || {})} />,
  wN: (props?: PieceProps) => <NeoArcadeKnight isWhite={true} {...(props || {})} />,
  wB: (props?: PieceProps) => <NeoArcadeBishop isWhite={true} {...(props || {})} />,
  wR: (props?: PieceProps) => <NeoArcadeRook isWhite={true} {...(props || {})} />,
  wQ: (props?: PieceProps) => <NeoArcadeQueen isWhite={true} {...(props || {})} />,
  wK: (props?: PieceProps) => <NeoArcadeKing isWhite={true} {...(props || {})} />,
  bP: (props?: PieceProps) => <NeoArcadePawn isWhite={false} {...(props || {})} />,
  bN: (props?: PieceProps) => <NeoArcadeKnight isWhite={false} {...(props || {})} />,
  bB: (props?: PieceProps) => <NeoArcadeBishop isWhite={false} {...(props || {})} />,
  bR: (props?: PieceProps) => <NeoArcadeRook isWhite={false} {...(props || {})} />,
  bQ: (props?: PieceProps) => <NeoArcadeQueen isWhite={false} {...(props || {})} />,
  bK: (props?: PieceProps) => <NeoArcadeKing isWhite={false} {...(props || {})} />,
};

function createLichessPieceSet(dirName: string) {
  const pieceCodes = ["wP", "wN", "wB", "wR", "wQ", "wK", "bP", "bN", "bB", "bR", "bQ", "bK"];
  const setObj: Record<string, (props?: PieceProps) => React.JSX.Element> = {};
  for (const p of pieceCodes) {
    setObj[p] = (props?: PieceProps) => (
      <img
        src={`/pieces/lichess/${dirName}/${p}.svg`}
        alt={p}
        style={{ width: "100%", height: "100%", ...props?.svgStyle }}
        draggable={false}
      />
    );
  }
  return setObj;
}

export const LICHESS_SHAPES_PIECES = createLichessPieceSet("shapes");
export const LICHESS_MONO_PIECES = createLichessPieceSet("mono");
export const LICHESS_SPATIAL_PIECES = createLichessPieceSet("spatial");
export const LICHESS_PIXEL_PIECES = createLichessPieceSet("pixel");

export function getPieceSet(style: PieceSetStyle) {
  switch (style) {
    case "liquid-chrome":
      return LIQUID_CHROME_PIECES;
    case "neo-arcade":
      return NEO_ARCADE_PIECES;
    case "lichess-shapes":
      return LICHESS_SHAPES_PIECES;
    case "lichess-mono":
      return LICHESS_MONO_PIECES;
    case "lichess-spatial":
      return LICHESS_SPATIAL_PIECES;
    case "lichess-pixel":
      return LICHESS_PIXEL_PIECES;
    case "default":
    default:
      return undefined; // Uses react-chessboard's default crisp Staunton vectors
  }
}

