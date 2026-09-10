"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Chess } from "chess.js";
import { Chessboard, defaultArrowOptions } from "react-chessboard";
import { ChessboardFrame } from "@/components/ChessboardFrame";
import { sounds } from "@/lib/sounds";
import {
  THEME_BOARD_COLORS,
  ThemePalette,
  ThemeMode,
} from "@/components/ThemeSwitcher";
import {
  FIXED_PUZZLE_1,
  calculateNewElo,
  mapEloToLevel,
  selectAdaptivePuzzle,
  computeMoveScore,
  classifyBehavioralPattern,
  CommitmentLevel,
  HelpType,
  PuzzleAttemptRecord,
  DiagnosisProfile,
} from "@/lib/diagnosisEngine";
import { ChessPuzzle } from "@/lib/puzzles";
import {
  Volume2,
  VolumeX,
  ArrowRight,
  RefreshCw,
  HelpCircle,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  Zap,
  Target,
  ArrowLeft,
  Award,
  ChevronRight,
} from "lucide-react";

export default function DiagnosePage() {
  const router = useRouter();

  // Theme synchronization
  const [themePalette, setThemePalette] = useState<ThemePalette>("periwinkle");
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const [isMuted, setIsMuted] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedTheme = (localStorage.getItem("chessz_theme") as ThemePalette) || "periwinkle";
      const savedMode = (localStorage.getItem("chessz_mode") as ThemeMode) || "light";
      const savedMute = localStorage.getItem("chessz_muted") === "true";
      setThemePalette(savedTheme);
      setThemeMode(savedMode);
      setIsMuted(savedMute);
      sounds.setMuted(savedMute);
    } catch {}

    const handleThemeEvent = (e: Event) => {
      const customEvt = e as CustomEvent<{ theme: ThemePalette; mode: ThemeMode }>;
      if (customEvt.detail) {
        if (customEvt.detail.theme) setThemePalette(customEvt.detail.theme);
        if (customEvt.detail.mode) setThemeMode(customEvt.detail.mode);
      }
    };
    window.addEventListener("chessz-theme-changed", handleThemeEvent);
    return () => window.removeEventListener("chessz-theme-changed", handleThemeEvent);
  }, []);

  const currentBoardColors =
    THEME_BOARD_COLORS[themePalette]?.[themeMode] || THEME_BOARD_COLORS.periwinkle.light;

  // Board Sizing & Responsive Bezel
  const [boardWidth, setBoardWidth] = useState<number>(360);
  const [bezelSize, setBezelSize] = useState<number>(24);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const currentBezel = width < 640 ? 18 : 24;
      setBezelSize(currentBezel);
      const totalBezelMargin = currentBezel * 2;

      if (width < 768) {
        if (width < 440) {
          setBoardWidth(Math.floor(width - 24 - totalBezelMargin));
        } else {
          setBoardWidth(360);
        }
      } else {
        const maxVertical = Math.max(280, height - 160 - totalBezelMargin);
        const maxHorizontal = Math.max(280, width - 460 - totalBezelMargin);
        const optimalSize = Math.floor(Math.min(maxVertical, maxHorizontal, 480));
        setBoardWidth(optimalSize);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Diagnostic Session State
  // Step: 1 (Puzzle 1) | 2 (Puzzle 2) | 3 (Puzzle 3) | 4 (Final Screen)
  const [puzzleIndex, setPuzzleIndex] = useState<number>(0);
  const [currentRating, setCurrentRating] = useState<number>(1250);
  const [attempts, setAttempts] = useState<PuzzleAttemptRecord[]>([]);
  const [isFinalScreen, setIsFinalScreen] = useState<boolean>(false);
  const [showEloEstimate, setShowEloEstimate] = useState<boolean>(false);

  // Active Puzzle & Chess.js State
  const [activePuzzle, setActivePuzzle] = useState<ChessPuzzle & { numericRating: number }>(() => ({
    ...FIXED_PUZZLE_1,
    numericRating: 881,
  }));
  const [game, setGame] = useState<Chess | null>(null);
  const [boardKey, setBoardKey] = useState<number>(0);

  // Interaction & Commitment state
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [hintSquare, setHintSquare] = useState<string | null>(null);
  const [pendingMove, setPendingMove] = useState<{
    from: string;
    to: string;
    san: string;
    isBestMove: boolean;
  } | null>(null);
  const [showCommitmentModal, setShowCommitmentModal] = useState<boolean>(false);

  // Turn evaluation & Feedback state
  const [puzzleStatus, setPuzzleStatus] = useState<"solving" | "success" | "failed">("solving");
  const [currentHelpUsed, setCurrentHelpUsed] = useState<HelpType>("none");
  const [firstTryCorrect, setFirstTryCorrect] = useState<boolean>(true);
  const [blunderedOnSure, setBlunderedOnSure] = useState<boolean>(false);
  const [selectedCommitment, setSelectedCommitment] = useState<CommitmentLevel | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const puzzleStartTimeRef = useRef<number>(Date.now());

  // Initialize Puzzle
  const loadPuzzle = (puzzle: ChessPuzzle & { numericRating: number }) => {
    try {
      const g = new Chess(puzzle.initialFen);
      setGame(g);
      setActivePuzzle(puzzle);
      setBoardKey((prev) => prev + 1);
      setSelectedSquare(null);
      setLastMove(null);
      setHintSquare(null);
      setPendingMove(null);
      setShowCommitmentModal(false);
      setPuzzleStatus("solving");
      setCurrentHelpUsed("none");
      setFirstTryCorrect(true);
      setBlunderedOnSure(false);
      setSelectedCommitment(null);
      setFeedbackMessage("");
      puzzleStartTimeRef.current = Date.now();
      if (typeof window !== "undefined") {
        (window as any).__currentPuzzle = puzzle;
      }
    } catch (e) {
      console.error("Failed to load puzzle:", e);
    }
  };

  useEffect(() => {
    loadPuzzle(activePuzzle);
  }, []);

  // Handle Piece Move Attempt
  const handleMoveAttempt = (from: string, to: string): boolean => {
    if (!game || puzzleStatus !== "solving" || showCommitmentModal) return false;

    // Check legality in chess.js
    const testGame = new Chess(game.fen());
    let moveResult: any = null;
    try {
      moveResult = testGame.move({ from, to, promotion: "q" });
    } catch {
      return false;
    }

    if (!moveResult) return false;

    sounds.playMove();

    const bestStep = activePuzzle.solutionMoves[0];
    const isBest = bestStep && bestStep.from === from && bestStep.to === to;

    // Puzzle 1: No commitment step! Evaluate immediately
    if (puzzleIndex === 0) {
      executeMoveDirectly(from, to, moveResult.san, isBest, null);
      return true;
    }

    // Puzzle 2 & 3: Mandatory Commitment Step!
    setPendingMove({
      from,
      to,
      san: moveResult.san,
      isBestMove: isBest,
    });
    setShowCommitmentModal(true);
    return true;
  };

  // User selects Commitment (Sure / Think so / Guessing) for Puzzle 2 & 3
  const handleSelectCommitment = (commitment: CommitmentLevel) => {
    if (!pendingMove) return;
    setSelectedCommitment(commitment);
    setShowCommitmentModal(false);

    executeMoveDirectly(
      pendingMove.from,
      pendingMove.to,
      pendingMove.san,
      pendingMove.isBestMove,
      commitment
    );
  };

  // Finalize Move & Score
  const executeMoveDirectly = (
    from: string,
    to: string,
    san: string,
    isBestMove: boolean,
    commitment: CommitmentLevel | null
  ) => {
    if (!game) return;

    // Apply move to board
    const newGame = new Chess(game.fen());
    newGame.move({ from, to, promotion: "q" });
    setGame(newGame);
    setLastMove({ from, to });

    const elapsed = Date.now() - puzzleStartTimeRef.current;

    if (isBestMove) {
      sounds.playSuccess();
      setPuzzleStatus("success");

      const score = computeMoveScore(
        true,
        false,
        commitment,
        currentHelpUsed,
        blunderedOnSure
      );

      const newElo = calculateNewElo(currentRating, activePuzzle.numericRating, score);
      const eloDelta = newElo - currentRating;

      setFeedbackMessage(
        puzzleIndex === 0
          ? "Clean strike! Undefended piece captured with check."
          : `Precision calculation! Rating calibrated: ${eloDelta >= 0 ? `+${eloDelta}` : eloDelta} Elo.`
      );

      // Record Attempt
      const record: PuzzleAttemptRecord = {
        puzzleId: activePuzzle.id,
        puzzleTitle: activePuzzle.title,
        rating: activePuzzle.numericRating,
        userEloBefore: currentRating,
        userEloAfter: newElo,
        score,
        commitment,
        helpUsed: currentHelpUsed,
        firstTryCorrect,
        timeMs: elapsed,
        moveSan: san,
      };

      setAttempts((prev) => [...prev, record]);
      setCurrentRating(newElo);
    } else {
      sounds.playRefutation();
      setPuzzleStatus("failed");
      setFirstTryCorrect(false);

      if (commitment === "sure") {
        setBlunderedOnSure(true);
      }

      setFeedbackMessage(
        activePuzzle.defaultRefutation?.coachExplanation ||
          "Not the best move. Spot the tactical flaw and reconsider!"
      );
    }
  };

  // Retry Current Puzzle
  const handleTryAgain = () => {
    if (!game) return;
    try {
      const g = new Chess(activePuzzle.initialFen);
      setGame(g);
      setBoardKey((prev) => prev + 1);
      setLastMove(null);
      setPuzzleStatus("solving");
      setHintSquare(null);
      setPendingMove(null);
      setShowCommitmentModal(false);
      setCurrentHelpUsed("try_again");
      setFeedbackMessage("");
    } catch {}
  };

  // Use Hint
  const handleUseHint = () => {
    if (!game) return;
    const bestStep = activePuzzle.solutionMoves[0];
    if (bestStep) {
      setHintSquare(bestStep.from);
      setCurrentHelpUsed("hint");
      setFeedbackMessage(`Hint: Focus on your piece stationed on ${bestStep.from.toUpperCase()}!`);
    }
  };

  // View Solution
  const handleViewSolution = () => {
    if (!game) return;
    const bestStep = activePuzzle.solutionMoves[0];
    if (bestStep) {
      const g = new Chess(activePuzzle.initialFen);
      g.move({ from: bestStep.from, to: bestStep.to, promotion: "q" });
      setGame(g);
      setBoardKey((prev) => prev + 1);
      setLastMove({ from: bestStep.from, to: bestStep.to });
      setPuzzleStatus("success");
      setCurrentHelpUsed("solution");
      setFirstTryCorrect(false);

      const score = computeMoveScore(false, false, null, "solution", blunderedOnSure);
      const newElo = calculateNewElo(currentRating, activePuzzle.numericRating, score);
      setFeedbackMessage(`Solution: ${bestStep.san} — ${activePuzzle.successExplanation}`);

      const record: PuzzleAttemptRecord = {
        puzzleId: activePuzzle.id,
        puzzleTitle: activePuzzle.title,
        rating: activePuzzle.numericRating,
        userEloBefore: currentRating,
        userEloAfter: newElo,
        score,
        commitment: selectedCommitment,
        helpUsed: "solution",
        firstTryCorrect: false,
        timeMs: Date.now() - puzzleStartTimeRef.current,
        moveSan: bestStep.san,
      };

      setAttempts((prev) => [...prev, record]);
      setCurrentRating(newElo);
    }
  };

  // Advance to next puzzle or final diagnosis
  const handleProceedNext = () => {
    if (puzzleIndex === 0) {
      // Move to Puzzle 2: Adaptive selection based on currentRating (~1250)
      const nextPuz = selectAdaptivePuzzle(currentRating, [FIXED_PUZZLE_1.id]);
      setPuzzleIndex(1);
      loadPuzzle(nextPuz);
    } else if (puzzleIndex === 1) {
      // Move to Puzzle 3: Adaptive selection based on updated currentRating
      const excluded = [FIXED_PUZZLE_1.id, activePuzzle.id];
      const nextPuz = selectAdaptivePuzzle(currentRating, excluded);
      setPuzzleIndex(2);
      loadPuzzle(nextPuz);
    } else {
      // Reached end of 3 puzzles -> Complete Diagnosis!
      finalizeDiagnosis();
    }
  };

  // Finalize Diagnosis Profile
  const finalizeDiagnosis = () => {
    setIsFinalScreen(true);

    const pattern = classifyBehavioralPattern(attempts);
    const levelInfo = mapEloToLevel(currentRating);

    const profile: DiagnosisProfile = {
      finalElo: currentRating,
      finalLevel: levelInfo.levelName,
      tierId: levelInfo.tierId,
      behavioralPattern: pattern.patternName,
      insightShown: pattern.insight,
      strength: pattern.strength,
      weakness: pattern.weakness,
      fullHistory: attempts,
      trainingSeed: {
        focus: pattern.weakness,
        level: levelInfo.levelName,
        tierId: levelInfo.tierId,
      },
      completedAt: new Date().toISOString(),
    };

    try {
      localStorage.setItem("chessz_diagnosis_profile", JSON.stringify(profile));
    } catch {}
  };

  // Launch First Training Module
  const handleStartPersonalizedTraining = () => {
    router.push("/?source=diagnosis");
  };

  // Toggle Mute
  const toggleMute = () => {
    const next = !isMuted;
    setIsMuted(next);
    sounds.setMuted(next);
    try {
      localStorage.setItem("chessz_muted", String(next));
    } catch {}
  };

  // Square Styles (Last Move & Hint)
  const getCustomSquareStyles = () => {
    const styles: Record<string, React.CSSProperties> = {};
    if (lastMove) {
      styles[lastMove.from] = {
        backgroundColor: "var(--board-last-move, rgba(100, 135, 195, 0.30))",
      };
      styles[lastMove.to] = {
        backgroundColor: "var(--board-last-move, rgba(100, 135, 195, 0.38))",
      };
    }
    if (selectedSquare) {
      styles[selectedSquare] = {
        backgroundColor: "var(--board-last-move, rgba(100, 135, 195, 0.35))",
        boxShadow: "inset 0 0 0 2.5px var(--accent-primary, #426199)",
      };
    }
    if (hintSquare) {
      styles[hintSquare] = {
        backgroundColor: "rgba(52, 211, 153, 0.4)",
        boxShadow: "inset 0 0 0 3px #10b981",
      };
    }
    return styles;
  };

  const currentLevelInfo = mapEloToLevel(currentRating);
  const detectedPattern = classifyBehavioralPattern(attempts);

  return (
    <main className="min-h-screen md:h-screen md:overflow-hidden flex flex-col justify-between p-3 sm:p-4 md:px-6 md:py-3 font-sans transition-colors duration-200">
      {/* Top Header */}
      <header className="w-full flex items-center justify-between pb-2 border-b border-[var(--border-subtle)] shrink-0">
        <div className="flex items-center gap-2">
          <Link
            href="/"
            className="flex items-center gap-2 group cursor-pointer"
            title="Return to Home"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg theme-surface border flex items-center justify-center font-bold text-sm theme-text-primary shadow-xs group-hover:border-[var(--border-focus)] transition-colors">
              Z
            </div>
            <span className="font-extrabold text-base sm:text-lg tracking-tight theme-text-primary">
              ChessZ
            </span>
          </Link>

          {!isFinalScreen && (
            <div className="hidden sm:flex items-center gap-1.5 ml-3 px-3 py-1 rounded-full text-xs font-mono font-semibold theme-pill">
              <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
              <span>Level Diagnosis Benchmark</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Sound Mute/Unmute */}
          <button
            onClick={toggleMute}
            className="p-1.5 sm:p-2 rounded-xl theme-surface hover:theme-surface-subtle theme-text-secondary hover:theme-text-primary transition-all border cursor-pointer"
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <Link
            href="/"
            className="flex items-center gap-1 text-xs font-medium theme-text-muted hover:theme-text-primary transition-colors px-2 py-1 rounded-lg"
          >
            <span>Exit</span>
          </Link>
        </div>
      </header>

      {/* Screen 1: The 3-Puzzle Interactive Benchmark */}
      {!isFinalScreen ? (
        <section className="flex-1 flex flex-col md:flex-row items-center justify-center gap-4 lg:gap-8 max-w-5xl mx-auto w-full py-2 min-h-0">
          {/* Left Column: Chessboard with Exterior ChessBase Bezel */}
          <div className="flex flex-col items-center justify-center shrink-0">
            {game && (
              <ChessboardFrame
                boardOrientation={activePuzzle.playerColor}
                boardSize={boardWidth}
                bezelSize={bezelSize}
              >
                <Chessboard
                  key={boardKey}
                  options={{
                    position: game.fen(),
                    boardOrientation: activePuzzle.playerColor,
                    squareStyles: getCustomSquareStyles(),
                    showNotation: false,
                    allowDrawingArrows: true,
                    clearArrowsOnClick: true,
                    arrowOptions: {
                      ...defaultArrowOptions,
                      opacity: 0.95,
                      activeOpacity: 0.85,
                      colors: {
                        default: "var(--accent-primary)",
                        shift: "#06b6d4",
                        ctrl: "#ef4444",
                        alt: "#f59e0b",
                        meta: "#ef4444",
                      },
                      color: "var(--accent-primary)",
                      secondaryColor: "#06b6d4",
                      tertiaryColor: "#ef4444",
                    },
                    onSquareClick: ({ square }) => {
                      if (selectedSquare === square) {
                        setSelectedSquare(null);
                      } else if (!selectedSquare) {
                        setSelectedSquare(square);
                      } else {
                        handleMoveAttempt(selectedSquare, square);
                        setSelectedSquare(null);
                      }
                    },
                    onPieceDrop: ({ sourceSquare, targetSquare }) => {
                      if (!targetSquare) return false;
                      return handleMoveAttempt(sourceSquare, targetSquare);
                    },
                    darkSquareStyle: { backgroundColor: currentBoardColors.dark },
                    lightSquareStyle: { backgroundColor: currentBoardColors.light },
                    animationDurationInMs: 180,
                  }}
                />
              </ChessboardFrame>
            )}
          </div>

          {/* Right Column: Dynamic Diagnosis Console */}
          <div
            className="flex flex-col justify-between w-full max-w-sm md:w-80 lg:w-96 shrink-0 theme-surface rounded-2xl p-4 shadow-xl border overflow-y-auto"
            style={{ height: boardWidth + bezelSize * 2 }}
          >
            {/* Top: Progress and Step Indicator */}
            <div>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold theme-pill px-2.5 py-1 rounded-lg">
                  <Target className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                  <span>Puzzle {puzzleIndex + 1} of 3</span>
                </div>
                <span className="text-[11px] font-mono theme-text-muted">
                  {puzzleIndex === 0
                    ? "Fixed Onboarding"
                    : `Adaptive Calibration`}
                </span>
              </div>

              {/* Progress 3-Segment Bar */}
              <div className="grid grid-cols-3 gap-1.5 w-full mb-3">
                {[0, 1, 2].map((idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx < puzzleIndex
                        ? "bg-[var(--accent-primary)]"
                        : idx === puzzleIndex
                        ? "bg-[var(--accent-primary)] opacity-80"
                        : "theme-surface-subtle opacity-40"
                    }`}
                  />
                ))}
              </div>

              {/* Coach Objective & Instructions */}
              <div className="theme-surface-subtle p-3 rounded-xl border mb-3">
                <div className="text-[11px] font-bold text-[var(--accent-primary)] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Tactical Objective</span>
                </div>
                <p className="text-xs sm:text-sm theme-text-primary font-medium leading-relaxed">
                  {activePuzzle.prompt}
                </p>
              </div>

              {/* Commitment Modal Prompt for Puzzle 2 & 3 */}
              {showCommitmentModal && pendingMove && (
                <div className="theme-surface border border-[var(--border-focus)] p-3.5 rounded-xl shadow-lg mb-3 animate-in fade-in duration-150">
                  <div className="text-xs font-bold theme-text-primary mb-1">
                    How confident are you in this move?
                  </div>
                  <p className="text-[11px] theme-text-muted mb-2.5">
                    Your conviction calibrates how you think under pressure.
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => handleSelectCommitment("sure")}
                      className="py-2 px-1 text-center rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs transition border border-emerald-500/30 cursor-pointer"
                    >
                      🟢 Sure
                    </button>
                    <button
                      onClick={() => handleSelectCommitment("think_so")}
                      className="py-2 px-1 text-center rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-600 dark:text-amber-400 font-bold text-xs transition border border-amber-500/30 cursor-pointer"
                    >
                      🟡 Think so
                    </button>
                    <button
                      onClick={() => handleSelectCommitment("guessing")}
                      className="py-2 px-1 text-center rounded-lg bg-slate-500/10 hover:bg-slate-500/20 theme-text-secondary font-bold text-xs transition border border-slate-500/30 cursor-pointer"
                    >
                      ⚪ Guessing
                    </button>
                  </div>
                </div>
              )}

              {/* Feedback Alert Banners */}
              {puzzleStatus === "success" && (
                <div className="theme-surface border border-emerald-500/40 p-3 rounded-xl shadow-xs mb-3 animate-card-entrance">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold text-xs mb-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Solved Cleanly!</span>
                  </div>
                  <p className="text-xs theme-text-primary leading-relaxed">
                    {feedbackMessage}
                  </p>
                </div>
              )}

              {puzzleStatus === "failed" && (
                <div className="theme-surface border border-rose-500/40 p-3 rounded-xl shadow-xs mb-3 animate-card-entrance">
                  <div className="flex items-center gap-1.5 text-rose-500 font-bold text-xs mb-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>Tactical Refutation</span>
                  </div>
                  <p className="text-xs theme-text-primary leading-relaxed mb-2.5">
                    {feedbackMessage}
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleTryAgain}
                      className="flex-1 py-1.5 px-2 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1 transition cursor-pointer"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Try Again</span>
                    </button>
                    <button
                      onClick={handleUseHint}
                      className="py-1.5 px-2.5 rounded-lg theme-surface hover:theme-surface-subtle font-semibold text-xs border flex items-center gap-1 transition cursor-pointer"
                      title="Reveal key piece hint"
                    >
                      <HelpCircle className="w-3 h-3" />
                      <span>Hint</span>
                    </button>
                    <button
                      onClick={handleViewSolution}
                      className="py-1.5 px-2 rounded-lg theme-surface hover:theme-surface-subtle font-semibold text-xs border flex items-center gap-1 transition cursor-pointer"
                      title="View correct master move"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div>
              {puzzleStatus === "success" && (
                <button
                  onClick={handleProceedNext}
                  className="group relative w-full py-2.5 px-4 rounded-xl theme-accent-btn font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all duration-200 active:scale-[0.98] cursor-pointer animate-next-btn btn-shimmer-effect hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="relative z-10">{puzzleIndex === 2 ? "View Final Diagnosis" : "Next Puzzle"}</span>
                  <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1.5 transition-transform duration-200 ease-out animate-arrow-nudge" />
                </button>
              )}

              {puzzleStatus === "solving" && !showCommitmentModal && (
                <div className="text-center py-2 text-[11px] font-mono theme-text-muted">
                  Drag or tap pieces to calculate
                </div>
              )}
            </div>
          </div>
        </section>
      ) : (
        /* Screen 2: The Final Level Diagnosis Dossier */
        <section className="flex-1 flex flex-col items-center justify-center max-w-md md:max-w-lg mx-auto w-full py-4 min-h-0 animate-card-entrance">
          <div className="w-full theme-surface rounded-3xl p-5 sm:p-6 shadow-2xl border relative overflow-hidden">
            {/* Top Badge */}
            <div className="flex items-center justify-between gap-2 mb-3 pb-3 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-1.5 text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent-primary)]">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Level Diagnosis Complete</span>
              </div>
              <span className="text-[10px] font-mono theme-text-muted px-2 py-0.5 rounded-full theme-surface-subtle border">
                3-Puzzle Benchmark
              </span>
            </div>

            {/* Large Level Name (Locked) */}
            <div className="text-center my-3">
              <span className="text-xs uppercase tracking-widest font-mono font-semibold theme-text-muted">
                Your Diagnosed Level
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight theme-text-primary mt-1">
                {currentLevelInfo.levelName}
              </h1>

              {/* Optional Show Estimated Elo Toggle */}
              <div className="mt-2 flex items-center justify-center gap-2">
                {showEloEstimate ? (
                  <span className="text-xs font-mono font-bold px-3 py-1 rounded-full theme-pill animate-in fade-in duration-150">
                    Estimated Elo: ~{currentRating}
                  </span>
                ) : (
                  <button
                    onClick={() => setShowEloEstimate(true)}
                    className="text-[11px] font-mono theme-text-muted hover:theme-text-primary underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    Show estimated Elo
                  </button>
                )}
              </div>
            </div>

            {/* Behavioral Insight Callout */}
            <div className="theme-surface-subtle border border-[var(--border-focus)] rounded-2xl p-4 my-3">
              <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)] mb-1">
                <Award className="w-4 h-4" />
                <span>Behavioral Pattern: {detectedPattern.patternName}</span>
              </div>
              <p className="text-xs sm:text-sm theme-text-primary leading-relaxed italic">
                “{detectedPattern.insight}”
              </p>
            </div>

            {/* Strength & Weakness Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-3">
              <div className="p-3 rounded-xl theme-surface border border-emerald-500/30">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-0.5">
                  Core Strength
                </div>
                <div className="text-xs font-semibold theme-text-primary">
                  {detectedPattern.strength}
                </div>
              </div>
              <div className="p-3 rounded-xl theme-surface border border-amber-500/30">
                <div className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-0.5">
                  Target Weakness
                </div>
                <div className="text-xs font-semibold theme-text-primary">
                  {detectedPattern.weakness}
                </div>
              </div>
            </div>

            {/* The Bridge Sentence */}
            <p className="text-xs sm:text-sm theme-text-secondary text-center my-3 leading-relaxed">
              Based on how you think, here’s the best place for you to start training.
            </p>

            {/* Primary Action Button */}
            <button
              onClick={handleStartPersonalizedTraining}
              className="group relative w-full py-3 px-4 rounded-xl theme-accent-btn font-bold text-sm sm:text-base tracking-wide flex items-center justify-center gap-2 shadow-md transition-all duration-200 active:scale-[0.98] cursor-pointer mt-2 animate-next-btn btn-shimmer-effect hover:-translate-y-0.5 hover:shadow-lg"
            >
              <span className="relative z-10">Start My Personalized Training</span>
              <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1.5 transition-transform duration-200 ease-out animate-arrow-nudge" />
            </button>
          </div>
        </section>
      )}

      {/* Subtle Footer */}
      <footer className="w-full text-center py-1 text-[11px] theme-text-muted font-mono shrink-0">
        ChessZ Cognitive Benchmark • 100% Offline • Powered by Lichess Open Database
      </footer>
    </main>
  );
}
