"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
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
import { SettingsModal } from "@/components/SettingsModal";
import {
  FIXED_PUZZLE_1,
  calculateNewElo,
  evaluatePuzzle1Move,
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
  Settings,
  Activity,
  Clock,
  Brain,
} from "lucide-react";

export default function DiagnosePage() {
  const router = useRouter();

  // Theme synchronization
  const [themePalette, setThemePalette] = useState<ThemePalette>("periwinkle");
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

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
  const [puzzleIndex, setPuzzleIndex] = useState<number>(0);
  const [currentRating, setCurrentRating] = useState<number>(1250);
  const [attempts, setAttempts] = useState<PuzzleAttemptRecord[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analyzingPhase, setAnalyzingPhase] = useState<number>(0);
  const [displayElo, setDisplayElo] = useState<number>(1250);
  const [isFinalScreen, setIsFinalScreen] = useState<boolean>(false);
  const [showEloEstimate, setShowEloEstimate] = useState<boolean>(false);

  // Active Puzzle & Multi-Step Solution State
  const [activePuzzle, setActivePuzzle] = useState<ChessPuzzle & { numericRating: number }>(() => ({
    ...FIXED_PUZZLE_1,
    numericRating: 1350,
  }));
  const [solutionStepIndex, setSolutionStepIndex] = useState<number>(0);
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
      setSolutionStepIndex(0);
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

    // PUZZLE 1: Pure Assessment Mode (Silent Record, Zero Spoilers)
    if (puzzleIndex === 0) {
      sounds.playMove();
      const nextGame = new Chess(game.fen());
      nextGame.move({ from, to, promotion: "q" });
      setGame(nextGame);
      setLastMove({ from, to });

      const evalResult = evaluatePuzzle1Move(from, to, currentRating);
      const elapsed = Date.now() - puzzleStartTimeRef.current;

      const record: PuzzleAttemptRecord = {
        puzzleId: activePuzzle.id,
        puzzleTitle: activePuzzle.title,
        rating: activePuzzle.numericRating,
        userEloBefore: currentRating,
        userEloAfter: evalResult.calibratedElo,
        score: evalResult.score,
        commitment: null,
        helpUsed: "none",
        firstTryCorrect: evalResult.status === "best",
        timeMs: elapsed,
        moveSan: moveResult.san,
        status: evalResult.status,
        userMoveSan: evalResult.userMoveSan,
        bestMoveSan: evalResult.bestMoveSan,
        coachExplanation: evalResult.coachFeedback,
        ruleTitle: evalResult.ruleTitle,
        ruleBody: evalResult.ruleBody,
      };

      setAttempts((prev) => [...prev, record]);
      setCurrentRating(evalResult.calibratedElo);
      setPuzzleStatus("success");
      return true;
    }

    // PUZZLE 2 & 3: Standard Adaptive puzzles with Mandatory Commitment Step!
    sounds.playMove();
    const bestStep = activePuzzle.solutionMoves[0];
    const isBest = bestStep && bestStep.from === from && bestStep.to === to;

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

  // Finalize Move & Score for Puzzle 2 & 3
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

    // Pure Assessment: Silent Record, No In-Test Reveals
    sounds.playMove();
    setPuzzleStatus("success");

    const score = computeMoveScore(
      isBestMove,
      false,
      commitment,
      "none",
      commitment === "sure" && !isBestMove
    );
    const newElo = calculateNewElo(currentRating, activePuzzle.numericRating, score);

    const record: PuzzleAttemptRecord = {
      puzzleId: activePuzzle.id,
      puzzleTitle: activePuzzle.title,
      rating: activePuzzle.numericRating,
      userEloBefore: currentRating,
      userEloAfter: newElo,
      score,
      commitment,
      helpUsed: "none",
      firstTryCorrect: isBestMove,
      timeMs: elapsed,
      moveSan: san,
      status: isBestMove ? "best" : "blunder",
      userMoveSan: san,
      bestMoveSan: activePuzzle.solutionMoves.map((m) => m.san).join(" "),
      coachExplanation: isBestMove
        ? activePuzzle.successExplanation
        : (activePuzzle.defaultRefutation?.coachExplanation || "Missed tactical defense or counter-attack in this position."),
      ruleTitle: activePuzzle.ruleTitle,
      ruleBody: activePuzzle.ruleBody,
    };

    setAttempts((prev) => [...prev, record]);
    setCurrentRating(newElo);
  };

  // Try Again
  const handleTryAgain = () => {
    if (!game) return;
    try {
      const g = new Chess(activePuzzle.initialFen);
      setGame(g);
      setSolutionStepIndex(0);
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
    const bestStep = activePuzzle.solutionMoves[solutionStepIndex] || activePuzzle.solutionMoves[0];
    if (bestStep) {
      setHintSquare(bestStep.from);
      setCurrentHelpUsed("hint");
      setFeedbackMessage(`Hint: Focus on your piece stationed on ${bestStep.from.toUpperCase()}!`);
    }
  };

  // View Solution
  const handleViewSolution = () => {
    if (!game) return;
    if (puzzleIndex === 0) {
      try {
        const solGame = new Chess(activePuzzle.initialFen);
        solGame.move({ from: "c6", to: "e5" });
        solGame.move({ from: "d1", to: "h5" });
        solGame.move({ from: "e5", to: "c4" });
        setGame(solGame);
        setBoardKey((prev) => prev + 1);
        setLastMove({ from: "e5", to: "c4" });
        setPuzzleStatus("success");
        setCurrentHelpUsed("solution");
        setFirstTryCorrect(false);

        const score = computeMoveScore(false, false, null, "solution", false);
        const newElo = calculateNewElo(currentRating, activePuzzle.numericRating, score);
        setCurrentRating(newElo);
        setFeedbackMessage("Solution: 1... Nxe5! 2. Qxh5 Nxc4! Eliminates White's knight, stops checkmate, and wins a full piece.");

        const record: PuzzleAttemptRecord = {
          puzzleId: activePuzzle.id,
          puzzleTitle: activePuzzle.title,
          rating: activePuzzle.numericRating,
          userEloBefore: currentRating,
          userEloAfter: newElo,
          score,
          commitment: null,
          helpUsed: "solution",
          firstTryCorrect: false,
          timeMs: Date.now() - puzzleStartTimeRef.current,
          moveSan: "Nxe5",
        };
        setAttempts((prev) => [...prev, record]);
      } catch {}
      return;
    }

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

  // Advance to next puzzle or start cognitive analysis
  const handleProceedNext = () => {
    if (puzzleIndex === 0) {
      // Move to Puzzle 2: Adaptive selection based on updated rating
      const nextPuz = selectAdaptivePuzzle(currentRating, [FIXED_PUZZLE_1.id]);
      setPuzzleIndex(1);
      loadPuzzle(nextPuz);
    } else if (puzzleIndex === 1) {
      // Move to Puzzle 3: Adaptive selection based on updated rating
      const p2Sure = attempts[1]?.commitment === "sure" && attempts[1]?.firstTryCorrect;
      const p1Clean = attempts[0]?.firstTryCorrect;
      const target = (p1Clean && p2Sure && currentRating >= 1600)
        ? Math.max(currentRating, 1850)
        : currentRating;

      const excluded = [FIXED_PUZZLE_1.id, activePuzzle.id];
      const nextPuz = selectAdaptivePuzzle(target, excluded);
      setPuzzleIndex(2);
      loadPuzzle(nextPuz);
    } else {
      // Reached end of 3 puzzles -> Launch FIDE Cognitive Telemetry Analysis!
      startAnalyzingSequence();
    }
  };

  // Intermediate Cognitive Telemetry Sequence (2.4s custom calculation)
  const startAnalyzingSequence = () => {
    setIsAnalyzing(true);
    setAnalyzingPhase(0);

    const pattern = classifyBehavioralPattern(attempts);
    const levelInfo = mapEloToLevel(currentRating);

    // Save profile to localStorage
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

    // 3-Phase Telemetry Progression
    setTimeout(() => {
      setAnalyzingPhase(1);
    }, 800);

    setTimeout(() => {
      setAnalyzingPhase(2);
    }, 1600);

    // Dynamic ticker count-up to target rating
    const startRating = 1250;
    const targetRating = currentRating;
    const steps = 24;
    let stepCount = 0;
    const interval = setInterval(() => {
      stepCount++;
      const progress = stepCount / steps;
      const current = Math.round(startRating + (targetRating - startRating) * progress);
      setDisplayElo(current);
      if (stepCount >= steps) {
        clearInterval(interval);
        setDisplayElo(targetRating);
      }
    }, 90);

    // Transition to final diagnosis screen after 2.5 seconds
    setTimeout(() => {
      setIsAnalyzing(false);
      setIsFinalScreen(true);
    }, 2500);
  };

  // Start Personalized Training
  const handleStartPersonalizedTraining = () => {
    const levelInfo = mapEloToLevel(currentRating);
    router.push(`/?source=diagnosis&tier=${levelInfo.tierId}`);
  };

  // Custom square styles for hints and last move
  const getCustomSquareStyles = () => {
    const styles: Record<string, any> = {};
    if (hintSquare) {
      styles[hintSquare] = {
        backgroundColor: "rgba(245, 158, 11, 0.45)",
        boxShadow: "inset 0 0 0 3px #f59e0b",
      };
    }
    if (lastMove) {
      styles[lastMove.from] = {
        backgroundColor: "rgba(59, 130, 246, 0.25)",
      };
      styles[lastMove.to] = {
        backgroundColor: "rgba(59, 130, 246, 0.35)",
      };
    }
    return styles;
  };

  const detectedPattern = classifyBehavioralPattern(attempts);
  const currentLevelInfo = mapEloToLevel(currentRating);

  return (
    <main className="min-h-screen md:h-screen md:overflow-hidden flex flex-col justify-between p-3 sm:p-4 md:px-6 md:py-3 font-sans transition-colors duration-200">
      {/* Settings Modal Component */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />

      {/* Top Header */}
      <header className="w-full max-w-md md:max-w-5xl lg:max-w-6xl mx-auto flex items-center justify-between py-2 px-3 sm:px-4 rounded-2xl theme-surface mb-2 shrink-0 border shadow-xs">
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="w-7 h-7 rounded-xl overflow-hidden shrink-0 border border-[var(--border-subtle)] shadow-xs bg-[#0b0f17] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
            title="ChessZ Home"
          >
            <Image
              src="/logo-icon.png"
              alt="ChessZ Logo"
              width={28}
              height={28}
              className="w-full h-full object-cover"
              priority
            />
          </Link>
          <span className="font-extrabold text-sm sm:text-base tracking-tight theme-text-primary">
            ChessZ
          </span>
          <div className="flex items-center gap-1.5 ml-2 px-2.5 py-0.5 rounded-full text-[11px] font-medium theme-pill">
            <Sparkles className="w-3 h-3 text-[var(--accent-primary)] animate-pulse" />
            <span>Level Diagnosis Benchmark</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => {
              const nextMuted = !isMuted;
              setIsMuted(nextMuted);
              sounds.setMuted(nextMuted);
              try {
                localStorage.setItem("chessz_muted", String(nextMuted));
              } catch {}
            }}
            className="w-8 h-8 rounded-xl theme-surface hover:theme-surface-subtle flex items-center justify-center cursor-pointer transition border"
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
            aria-label={isMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 opacity-50" />
            ) : (
              <Volume2 className="w-4 h-4 text-[var(--accent-primary)]" />
            )}
          </button>

          <button
            onClick={() => setShowSettingsModal(true)}
            className="flex items-center gap-1.5 text-[11px] font-mono font-semibold theme-surface hover:theme-surface-subtle px-2.5 py-1.5 rounded-xl cursor-pointer transition border"
            title="Settings & Theme Studio"
            aria-label="Settings and themes"
          >
            <Settings className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span className="hidden sm:inline">Settings</span>
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
      {!isFinalScreen && !isAnalyzing ? (
        <section className="flex-1 flex flex-col md:flex-row items-center justify-center gap-4 lg:gap-8 max-w-5xl mx-auto w-full py-2 min-h-0">
          {/* Left Column: Chessboard with Exterior ChessBase Bezel */}
          <div className="flex flex-col items-center justify-center shrink-0">
            {game && (
              <div
                id="current-puzzle-meta"
                data-from={activePuzzle.solutionMoves[solutionStepIndex]?.from || activePuzzle.solutionMoves[0]?.from}
                data-to={activePuzzle.solutionMoves[solutionStepIndex]?.to || activePuzzle.solutionMoves[0]?.to}
                className="hidden"
              />
            )}
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
                      colors: {
                        default: "#10b981",
                        shift: "#0284c7",
                        ctrl: "#ef4444",
                        alt: "#f59e0b",
                        meta: "#8b5cf6",
                      },
                      color: "#10b981",
                      secondaryColor: "#0284c7",
                      tertiaryColor: "#ef4444",
                      opacity: 0.88,
                      activeOpacity: 0.95,
                      arrowStartOffset: 0.18,
                      arrowLengthReducerDenominator: 2.8,
                      sameTargetArrowLengthReducerDenominator: 3.2,
                      arrowWidthDenominator: 5.5,
                      activeArrowWidthMultiplier: 1.15,
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
                    ? "Tactical Benchmark"
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
                        ? "bg-emerald-500"
                        : idx === puzzleIndex
                        ? "bg-[var(--accent-primary)]"
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

              {/* Move Submitted Quiet Banner (No In-Test Spoilers) */}
              {puzzleStatus === "success" && (
                <div className="theme-surface border border-[var(--border-focus)] p-3 rounded-xl shadow-xs mb-3 flex items-center justify-between animate-card-entrance">
                  <div className="flex items-center gap-2 text-xs font-semibold theme-text-primary">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <span>Move recorded for diagnosis</span>
                  </div>
                  <span className="text-[11px] font-mono theme-text-muted">
                    {attempts[puzzleIndex]?.timeMs ? `${(attempts[puzzleIndex].timeMs / 1000).toFixed(1)}s` : "Saved"}
                  </span>
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
      ) : isAnalyzing ? (
        /* Screen 1.5: FIDE Cognitive Telemetry Analysis & Elo Convergence */
        <section className="flex-1 flex flex-col items-center justify-center max-w-lg mx-auto w-full py-4 min-h-0 animate-card-entrance">
          <div className="w-full theme-surface rounded-3xl p-6 sm:p-7 shadow-2xl border relative overflow-hidden">
            {/* Header Badge */}
            <div className="flex items-center justify-between gap-2 pb-3 mb-4 border-b border-[var(--border-subtle)]">
              <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent-primary)]">
                <Brain className="w-4 h-4 text-[var(--accent-primary)] animate-pulse" />
                <span>Cognitive Analysis Engine</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full theme-pill animate-pulse">
                Phase {analyzingPhase + 1} of 3
              </span>
            </div>

            {/* Central Animated Indicator */}
            <div className="text-center mb-5">
              <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-[var(--accent-subtle)] border border-[var(--border-focus)] flex items-center justify-center shadow-lg relative">
                <Activity className="w-7 h-7 text-[var(--accent-primary)] animate-bounce" />
                <span className="absolute -inset-1 rounded-2xl border border-[var(--accent-primary)] opacity-40 animate-ping" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold theme-text-primary tracking-tight">
                {analyzingPhase === 0 && "Deconstructing Move Velocity..."}
                {analyzingPhase === 1 && "Evaluating Conviction & Risk..."}
                {analyzingPhase === 2 && "Converging FIDE Rating Model..."}
              </h2>
              <p className="text-xs theme-text-secondary mt-1">
                Analyzing your calculation footprint and decision timing across all 3 benchmark positions.
              </p>
            </div>

            {/* Segmented Progress Bar */}
            <div className="grid grid-cols-3 gap-2 w-full mb-5">
              {[0, 1, 2].map((idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    idx <= analyzingPhase
                      ? "bg-[var(--accent-primary)] shadow-xs"
                      : "theme-surface-subtle opacity-30"
                  }`}
                />
              ))}
            </div>

            {/* The 3 Real Data Telemetry Cards */}
            <div className="space-y-2.5 mb-5 font-mono text-xs">
              {/* Telemetry 1: Real Seconds Per Move */}
              <div className={`p-3 rounded-xl border transition-all duration-300 ${
                analyzingPhase >= 0
                  ? "theme-surface border-[var(--border-focus)] shadow-xs"
                  : "opacity-40 theme-surface-subtle"
              }`}>
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="font-bold flex items-center gap-1.5 theme-text-primary">
                    <Clock className="w-3.5 h-3.5 text-sky-500" />
                    <span>Decision Velocity</span>
                  </span>
                  <span className="theme-text-muted">
                    Total: {((attempts.reduce((acc, a) => acc + (a.timeMs || 4000), 0)) / 1000).toFixed(1)}s
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-1 text-center text-[10px]">
                  {attempts.map((att, i) => (
                    <div key={i} className="p-1 rounded bg-[var(--bg-card-subtle)] border border-[var(--border-subtle)]">
                      <span className="theme-text-muted block">P{i + 1}</span>
                      <span className="font-bold theme-text-primary">
                        {((att.timeMs || 4000) / 1000).toFixed(1)}s
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Telemetry 2: Conviction & Self-Trust */}
              <div className={`p-3 rounded-xl border transition-all duration-300 ${
                analyzingPhase >= 1
                  ? "theme-surface border-[var(--border-focus)] shadow-xs"
                  : "opacity-40 theme-surface-subtle"
              }`}>
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="font-bold flex items-center gap-1.5 theme-text-primary">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Conviction Architecture</span>
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {detectedPattern.patternName}
                  </span>
                </div>
                <div className="text-[11px] theme-text-secondary leading-snug">
                  Commitment profile:{" "}
                  <span className="font-semibold theme-text-primary">
                    {attempts[1]?.commitment ? attempts[1].commitment.replace("_", " ").toUpperCase() : "SURE"}
                  </span>{" "}
                  on Puzzle 2 &bull;{" "}
                  <span className="font-semibold theme-text-primary">
                    {attempts[2]?.commitment ? attempts[2].commitment.replace("_", " ").toUpperCase() : "THINK SO"}
                  </span>{" "}
                  on Puzzle 3
                </div>
              </div>

              {/* Telemetry 3: Animated Rating Convergence */}
              <div className={`p-3 rounded-xl border transition-all duration-300 ${
                analyzingPhase >= 2
                  ? "theme-surface border-[var(--border-focus)] shadow-xs"
                  : "opacity-40 theme-surface-subtle"
              }`}>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold flex items-center gap-1.5 theme-text-primary">
                    <Target className="w-3.5 h-3.5 text-rose-500" />
                    <span>Dynamic Rating Calibrator</span>
                  </span>
                  <span className="text-base font-extrabold text-[var(--accent-primary)] font-mono">
                    ~{displayElo} Elo
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] theme-text-muted mt-1">
                  <span>Base: 1250 (K=140)</span>
                  <span className="font-semibold theme-text-primary">
                    Calibrated: {currentLevelInfo.levelName}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Status Ticker */}
            <div className="text-center text-[11px] font-mono theme-text-muted flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Synthesizing personalized training playlist...</span>
            </div>
          </div>
        </section>
      ) : (
        /* Screen 2: The Final Level Diagnosis Dossier */
        <section className="flex-1 flex flex-col items-center justify-center max-w-md md:max-w-lg mx-auto w-full py-4 min-h-0 animate-card-entrance">
          <div className="w-full max-h-[88vh] overflow-y-auto custom-scrollbar theme-surface rounded-3xl p-5 sm:p-6 shadow-2xl border relative">
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
                  <span id="diagnosed-elo-badge" className="text-xs font-mono font-bold px-3 py-1 rounded-full theme-pill animate-in fade-in duration-150">
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
              <p className="text-xs sm:text-sm theme-text-primary italic mt-1 leading-relaxed">
                "{detectedPattern.insight}"
              </p>
            </div>

            {/* Dual Core Strength / Target Weakness Cards */}
            <div className="grid grid-cols-2 gap-2.5 my-3">
              <div className="p-3 rounded-2xl theme-surface border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 block mb-1">
                  Core Strength
                </span>
                <span className="text-xs font-semibold theme-text-primary leading-tight block">
                  {detectedPattern.strength}
                </span>
              </div>

              <div className="p-3 rounded-2xl theme-surface border">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 block mb-1">
                  Target Weakness
                </span>
                <span className="text-xs font-semibold theme-text-primary leading-tight block">
                  {detectedPattern.weakness}
                </span>
              </div>
            </div>

            {/* Benchmark Test Review & Master Solutions */}
            <div className="my-4">
              <div className="flex items-center justify-between mb-2.5">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider theme-text-primary">
                  <Target className="w-4 h-4 text-[var(--accent-primary)]" />
                  <span>Benchmark Review & Solutions</span>
                </div>
                <span className="text-[10px] font-mono theme-text-muted">
                  3 Puzzles Analyzed
                </span>
              </div>

              <div className="space-y-2.5">
                {attempts.map((att, idx) => {
                  const isBest = att.status === "best";
                  const isInaccurate = att.status === "inaccurate";
                  return (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl theme-surface border border-[var(--border-subtle)] hover:border-[var(--border-focus)] transition shadow-xs"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="text-[10px] font-mono uppercase tracking-wider theme-text-muted">
                            Puzzle {idx + 1} &bull; {att.puzzleTitle}
                          </div>
                          <div className="text-xs font-bold theme-text-primary mt-0.5">
                            Your Move:{" "}
                            <span className="font-mono">
                              {att.userMoveSan || att.moveSan || "—"}
                            </span>
                            {att.commitment && (
                              <span className="ml-1.5 font-normal text-[10px] theme-text-muted">
                                ({att.commitment.replace("_", " ")})
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Status Badge */}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            isBest
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                              : isInaccurate
                              ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30"
                              : "bg-rose-500/10 text-rose-500 border-rose-500/30"
                          }`}
                        >
                          {isBest
                            ? "Best Move"
                            : isInaccurate
                            ? "Inaccurate"
                            : "Tactical Blunder"}
                        </span>
                      </div>

                      {/* Master Solution */}
                      <div className="text-[11px] theme-text-secondary mb-2 bg-[var(--bg-card-subtle)] p-2 rounded-xl border border-[var(--border-subtle)] font-mono">
                        <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                          Master Solution:{" "}
                        </span>
                        <span className="theme-text-primary">
                          {att.bestMoveSan || "—"}
                        </span>
                      </div>

                      {/* Coach Explanation */}
                      {att.coachExplanation && (
                        <p className="text-xs theme-text-primary leading-relaxed mb-2">
                          {att.coachExplanation}
                        </p>
                      )}

                      {/* Pedagogical Takeaway Box */}
                      {att.ruleTitle && att.ruleBody && (
                        <div className="text-[11px] theme-surface-subtle p-2 rounded-xl border border-[var(--border-focus)]/40 flex items-start gap-1.5">
                          <span className="text-amber-500 font-bold">💡</span>
                          <div>
                            <span className="font-bold theme-text-primary">
                              {att.ruleTitle}:{" "}
                            </span>
                            <span className="theme-text-secondary">
                              {att.ruleBody}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Callout */}
            <p className="text-xs text-center theme-text-secondary mt-2 mb-4">
              Based on how you think, here’s the best place for you to start training.
            </p>

            {/* Primary CTA: 1-Click Start Personalized Training */}
            <button
              onClick={handleStartPersonalizedTraining}
              className="w-full py-3.5 px-6 rounded-2xl theme-accent-btn font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
            >
              <span>Start My Personalized Training</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </section>
      )}

      {/* Footer Branding */}
      <footer className="w-full text-center py-1 shrink-0 text-[11px] font-mono theme-text-muted">
        ChessZ Cognitive Benchmark &bull; 100% Offline &bull; Powered by Public Domain & Lichess Open Database
      </footer>
    </main>
  );
}
