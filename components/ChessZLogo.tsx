/**
 * ChessZ identity — flat vector, 4 x 4 unit grid.
 *
 * Geometry (64-unit tile, unit = 10, Z box 40 x 40 centred):
 *   top bar              x 22->52  y 12->22   bone
 *   upper diagonal block x 32->42  y 22->32   bone
 *   lower diagonal block x 22->32  y 32->42   AMBER  <- the critical block
 *   bottom bar           x 12->42  y 42->52   bone
 *
 * Bars are 3u x 1u offset one unit; the diagonal is two 1u blocks corner to
 * corner. Minimum size 24px; clear space is one bar height. Below 24px drop
 * the tile and set the bare Z (see `tile={false}`).
 */

export const CHESSZ_INK = "#14202B";
export const CHESSZ_BONE = "#F4F1EA";
export const CHESSZ_AMBER = "#E8A33D";
export const CHESSZ_AMBER_DEEP = "#C9872A";

/** Tile treatments. Grid, bars and diagonal are identical in all three. */
export type ChessZTreatment = "tight" | "roomy" | "baseline";

/**
 * solid   — primary. Ink tile, bone Z, amber critical block.
 * inverse — amber ground, ink Z, critical block turns bone.
 * mono    — one ink. The critical block knocks out instead of tinting.
 */
export type ChessZVariant = "solid" | "inverse" | "mono";

const TREATMENTS: Record<ChessZTreatment, { zSize: number; tileRadius: number; barEnd: number }> = {
  tight: { zSize: 44, tileRadius: 9, barEnd: 2 },
  roomy: { zSize: 36, tileRadius: 18, barEnd: 3.5 },
  baseline: { zSize: 40, tileRadius: 12, barEnd: 2.5 },
};

interface ChessZMarkProps {
  size?: number;
  variant?: ChessZVariant;
  treatment?: ChessZTreatment;
  /** false renders the bare Z with no tile — required below 24px. */
  tile?: boolean;
  className?: string;
  title?: string;
}

export function ChessZMark({
  size = 28,
  variant = "solid",
  treatment = "baseline",
  tile = true,
  className = "",
  title = "ChessZ",
}: ChessZMarkProps) {
  const { zSize, tileRadius, barEnd } = TREATMENTS[treatment];

  // Unit = 1/4 of Z height. Z box is centred in the 64-unit tile.
  const u = zSize / 4;
  const origin = (64 - zSize) / 2;
  const x = (units: number) => origin + units * u;

  let ground: string | null = CHESSZ_INK;
  let stroke = CHESSZ_BONE;
  let critical = CHESSZ_AMBER;

  if (variant === "inverse") {
    ground = CHESSZ_AMBER;
    stroke = CHESSZ_INK;
    critical = CHESSZ_BONE;
  } else if (variant === "mono") {
    ground = CHESSZ_INK;
    stroke = CHESSZ_BONE;
    critical = CHESSZ_INK; // knocks out rather than tinting
  }

  if (!tile) {
    ground = null;
    if (variant === "mono") critical = "transparent";
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label={title}
      className={className}
    >
      <title>{title}</title>
      {ground && <rect width="64" height="64" rx={tileRadius} fill={ground} />}

      {/* Top bar: 3u x 1u, offset one unit from the left */}
      <rect x={x(1)} y={x(0)} width={u * 3} height={u} rx={barEnd} fill={stroke} />
      {/* Upper diagonal block */}
      <rect x={x(2)} y={x(1)} width={u} height={u} fill={stroke} />
      {/* Lower diagonal block — the critical block */}
      <rect x={x(1)} y={x(2)} width={u} height={u} fill={critical} />
      {/* Bottom bar: 3u x 1u */}
      <rect x={x(0)} y={x(3)} width={u * 3} height={u} rx={barEnd} fill={stroke} />
    </svg>
  );
}

interface ChessZLockupProps {
  size?: number;
  variant?: ChessZVariant;
  treatment?: ChessZTreatment;
  tile?: boolean;
  /** Wordmark colour. Defaults to the ambient theme text colour. */
  wordColor?: string;
  className?: string;
}

/**
 * Lockup: mark + wordmark. The bare Z carries the lockup; the tile is
 * reserved for app icon and favicon, so `tile` defaults to false here.
 */
export function ChessZLockup({
  size = 28,
  variant = "solid",
  treatment = "baseline",
  tile = false,
  wordColor,
  className = "",
}: ChessZLockupProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <ChessZMark size={size} variant={variant} treatment={treatment} tile={tile} />
      <span
        className="font-extrabold text-sm sm:text-base tracking-tight font-display"
        style={wordColor ? { color: wordColor } : undefined}
      >
        ChessZ
      </span>
    </span>
  );
}

export default ChessZMark;
