"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Chess } from "chess.js";
import { Chessboard, defaultArrowOptions } from "react-chessboard";
import { ChessboardFrame } from "@/components/ChessboardFrame";
import { AnnotationPalette, AnnotationColor, ANNOTATION_COLORS } from "@/components/AnnotationPalette";
import {
  Zap,
  RotateCcw,
  Award,
  ChevronLeft,
  ChevronRight,
  History,
  Swords,
  Sparkles,
  Target,
  Compass,
  Lightbulb,
  Play,
  CheckCircle2,
  AlertTriangle,
  Flame,
  ArrowRight,
  RefreshCw,
  HelpCircle,
  Save,
  Mail,
  X,
  BookOpen,
  Share2,
  Check,
  Volume2,
  VolumeX,
  Settings,
  Cpu
} from "lucide-react";
import {
  DIAGNOSTIC_PUZZLES,
  CONTINUOUS_PUZZLES,
  ALL_PUZZLES_MAP,
  ChessPuzzle,
  RefutationMove,
  LevelType
} from "@/lib/puzzles";
import { sounds } from "@/lib/sounds";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { ChessZMark } from "@/components/ChessZLogo";
import { THEME_BOARD_COLORS } from "@/components/themeTokens";
import { useTheme } from "@/components/ThemeProvider";
import { SettingsModal } from "@/components/SettingsModal";
import { useLichess } from "@/lib/useLichess";
import { LichessModal, LichessIcon } from "@/components/LichessModal";
import { WeaknessDashboard } from "@/components/WeaknessDashboard";
import { useStockfish } from "@/lib/useStockfish";
import { EngineAnalysisBar } from "@/components/EngineAnalysisBar";
import { CoachStudyModal, CoachStudyItem } from "@/components/CoachStudyModal";
import { TermHoverCard } from "@/components/TermHoverCard";

interface CoachDiagnosis {
  archetypeTitle: string;
  headline: string;
  ruleTitle: string;
  ruleBody: string;
  targetFocus: string;
  leakName: string;
  leakDetail: string;
  strategicAntidote: string;
  composureTip: string;
  personalizedSummary: string;
  curatedPlaylist: ChessPuzzle[];
  starterPuzzleId: string;
}

interface LevelOption {
  id: LevelType;
  badge: string;
  pieceSymbol: string;
  chessComRange: string;
  lichessRange: string;
  fideRange?: string;
  title: string;
  desc: string;
  tag: string;
  icon: any;
  colorClass: string;
  borderClass: string;
  accentBg: string;
  starterPuzzleId: string;
  approxRating: number;
}

const LEVEL_OPTIONS: LevelOption[] = [
  {
    id: "beginner",
    badge: "Tier 1",
    pieceSymbol: "♟",
    chessComRange: "400 – 900",
    lichessRange: "600 – 1200",
    title: "Beginner",
    desc: "Basic checks, simple captures, and learning to stop hanging free pieces.",
    tag: "Mate-in-1 & Free Pieces",
    icon: Sparkles,
    colorClass: "text-[var(--accent-primary)]",
    borderClass: "border-[var(--border-subtle)] hover:border-[var(--border-focus)]",
    accentBg: "theme-surface",
    starterPuzzleId: "beginner_1a",
    approxRating: 500,
  },
  {
    id: "adv_beginner",
    badge: "Tier 2",
    pieceSymbol: "♞",
    chessComRange: "900 – 1200",
    lichessRange: "1200 – 1500",
    title: "Advanced Beginner",
    desc: "Forks, pins, skewers, and double attacks that win material in the opening.",
    tag: "Essential Tactical Patterns",
    icon: Compass,
    colorClass: "text-[var(--accent-primary)]",
    borderClass: "border-[var(--border-subtle)] hover:border-[var(--border-focus)]",
    accentBg: "theme-surface",
    starterPuzzleId: "adv_beginner_2a",
    approxRating: 900,
  },
  {
    id: "intermediate",
    badge: "Tier 3",
    pieceSymbol: "♜",
    chessComRange: "1200 – 1500",
    lichessRange: "1500 – 1800",
    fideRange: "1300 – 1600 FIDE",
    title: "Intermediate",
    desc: "Complex combinations, Greek Gift sacrifices, candidate moves, and in-between checks.",
    tag: "Multi-Move Combinations",
    icon: Swords,
    colorClass: "text-[var(--accent-primary)]",
    borderClass: "border-[var(--border-subtle)] hover:border-[var(--border-focus)]",
    accentBg: "theme-surface",
    starterPuzzleId: "intermediate_3a",
    approxRating: 1300,
  },
  {
    id: "advanced",
    badge: "Tier 4",
    pieceSymbol: "♚",
    chessComRange: "1500 – 1900+",
    lichessRange: "1800 – 2100+",
    fideRange: "1600 – 1950+ FIDE",
    title: "Advanced",
    desc: "Subtle positional pressure, prophylactic thinking, pawn levers, and deep refutations.",
    tag: "Master Calculation & Strategy",
    icon: Target,
    colorClass: "text-[var(--accent-primary)]",
    borderClass: "border-[var(--border-subtle)] hover:border-[var(--border-focus)]",
    accentBg: "theme-surface",
    starterPuzzleId: "advanced_4a",
    approxRating: 1700,
  },
];

type PuzzleStatus = "solving" | "refuting" | "failed" | "solved";

interface LegalMoveTarget {
  to: string;
  captured?: string;
}

export default function Home() {
  // Lichess Integration Hook
  const {
    user: lichessUser,
    isAuthenticated: isLichessAuthenticated,
    loading: isLichessLoading,
    login: loginLichess,
    logout: logoutLichess,
    refreshUser: refreshLichess,
    connectByUsername: connectLichessUsername,
  } = useLichess();
  const [showLichessModal, setShowLichessModal] = useState<boolean>(false);
  const [showWeaknessDashboard, setShowWeaknessDashboard] = useState<boolean>(false);
  
  // Stockfish In-Browser WASM Engine Hook
  const {
    isReady: isEngineReady,
    isAnalyzing: isEngineAnalyzing,
    engineEnabled,
    evaluation: engineEvaluation,
    bestMove: engineBestMove,
    bestLine: engineBestLine,
    engineArrow,
    setEngineEnabled,
    startAnalysis,
    stopAnalysis,
    toggleEngine,
  } = useStockfish();

  const searchParams = useSearchParams();

  const [selectedLevel, setSelectedLevel] = useState<LevelOption | null>(null);
  const [calibratedRating, setCalibratedRating] = useState<number>(900);
  const [coachDiagnosis, setCoachDiagnosis] = useState<CoachDiagnosis | null>(null);
  const [isCalibrated, setIsCalibrated] = useState<boolean>(false);

  // 5-Puzzle Diagnostic Curriculum State
  const [diagnosisPlaylist, setDiagnosisPlaylist] = useState<ChessPuzzle[]>([]);
  const [curriculumIndex, setCurriculumIndex] = useState<number>(0);
  const [isCurriculumActive, setIsCurriculumActive] = useState<boolean>(false);
  const [curriculumCompleted, setCurriculumCompleted] = useState<boolean>(false);
  const [showStudyModal, setShowStudyModal] = useState<boolean>(false);

  const curriculumStudyItems: CoachStudyItem[] = useMemo(() => {
    const list = coachDiagnosis?.curatedPlaylist || diagnosisPlaylist;
    return list.map((p) => ({
      id: p.id,
      title: p.title,
      tier: p.tier,
      initialFen: p.initialFen,
      playerColor: p.playerColor,
      bestMoveSan: p.solutionMoves[0]?.san || '',
      status: 'solved' as const,
      prompt: p.prompt,
      ruleTitle: p.ruleTitle,
      ruleBody: p.ruleBody,
      coachExplanation: p.successExplanation,
      solutionMoves: p.solutionMoves,
      opponentResponses: p.opponentResponses,
      defaultRefutation: p.defaultRefutation,
    }));
  }, [coachDiagnosis?.curatedPlaylist, diagnosisPlaylist]);

  // Puzzle State
  const [currentPuzzle, setCurrentPuzzle] = useState<ChessPuzzle | null>(null);
  const [puzzleStatus, setPuzzleStatus] = useState<PuzzleStatus>("solving");
  const [refutationInfo, setRefutationInfo] = useState<RefutationMove | null>(null);
  const [game, setGame] = useState<Chess | null>(null);
  const [boardWidth, setBoardWidth] = useState<number>(380);
  const [bezelSize, setBezelSize] = useState<number>(24);
  const [status, setStatus] = useState<string>("White to move");
  const [streak, setStreak] = useState<number>(0);
  const [solvedCount, setSolvedCount] = useState<number>(0);
  const [continuousIndex, setContinuousIndex] = useState<number>(0);
  const [setupStepIndex, setSetupStepIndex] = useState<number>(-1);

  // Piece Selection & Marking State
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<LegalMoveTarget[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [hintSquare, setHintSquare] = useState<string | null>(null);
  const [annotatedSquares, setAnnotatedSquares] = useState<
    Record<string, { bg: string; border: string; type: AnnotationColor }>
  >({});
  const [activeAnnotationColor, setActiveAnnotationColor] = useState<AnnotationColor | null>(null);
  const [boardKey, setBoardKey] = useState<number>(0);

  // Lichess Rating & Smart Tier Recommendation
  const lichessRating =
    lichessUser?.perfs?.rapid?.rating ||
    lichessUser?.perfs?.blitz?.rating ||
    lichessUser?.perfs?.puzzle?.rating;

  let recommendedTierId: LevelType | null = null;
  if (lichessRating) {
    if (lichessRating < 1100) recommendedTierId = "beginner";
    else if (lichessRating < 1450) recommendedTierId = "adv_beginner";
    else if (lichessRating < 1750) recommendedTierId = "intermediate";
    else recommendedTierId = "advanced";
  }

  // Right-click modifier tracking refs for square markings & arrows
  const lastRightClickModifiersRef = useRef<{ ctrl: boolean; shift: boolean; alt: boolean }>({
    ctrl: false,
    shift: false,
    alt: false,
  });
  const activeModifiersRef = useRef<{ ctrl: boolean; shift: boolean; alt: boolean }>({
    ctrl: false,
    shift: false,
    alt: false,
  });

  // Timer references for resilient asynchronous scheduling and clean teardown
  const refutationTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const victoryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const saveModalTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearPuzzleTimeouts = () => {
    if (refutationTimeoutRef.current) {
      clearTimeout(refutationTimeoutRef.current);
      refutationTimeoutRef.current = null;
    }
    if (victoryTimeoutRef.current) {
      clearTimeout(victoryTimeoutRef.current);
      victoryTimeoutRef.current = null;
    }
    if (saveModalTimeoutRef.current) {
      clearTimeout(saveModalTimeoutRef.current);
      saveModalTimeoutRef.current = null;
    }
  };

  // Teardown any pending timeouts when unmounting
  useEffect(() => {
    return () => {
      clearPuzzleTimeouts();
    };
  }, []);

  // Modals (Save Progress & Credits)
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [showCreditsModal, setShowCreditsModal] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>("");
  const [authStatusMessage, setAuthStatusMessage] = useState<string>("");
  const [shareCopied, setShareCopied] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [savedDiagnosisProfile, setSavedDiagnosisProfile] = useState<any>(null);

  // Live Theme State & Board Synchronization
  // Theme comes from ThemeProvider; these pages used to hold their own copy and
  // stay in step by listening for window events.
  const { theme: themePalette, mode: themeMode } = useTheme();

  const currentBoardColors =
    THEME_BOARD_COLORS[themePalette]?.[themeMode] || THEME_BOARD_COLORS.periwinkle.light;

  // Load Session & Mute preferences from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("chessz_session");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.streak) setStreak(parsed.streak);
        if (parsed.solvedCount) setSolvedCount(parsed.solvedCount);
      }
      const savedMute = localStorage.getItem("chessz_muted");
      if (savedMute !== null) {
        const muted = JSON.parse(savedMute);
        setIsMuted(muted);
        sounds.setMuted(muted);
      }
      const savedDiag = localStorage.getItem("chessz_diagnosis_profile");
      if (savedDiag) {
        const parsed = JSON.parse(savedDiag);
        setSavedDiagnosisProfile(parsed);
        if (typeof window !== "undefined" && window.location.search.includes("source=diagnosis")) {
          window.history.replaceState({}, document.title, window.location.pathname);
          const targetLevel = LEVEL_OPTIONS.find((l) => l.id === parsed.tierId) || LEVEL_OPTIONS[2];
          handleStartDiagnosedTraining(parsed, targetLevel);
        }
      }
    } catch {}
  }, []);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sounds.setMuted(nextMuted);
    try {
      localStorage.setItem("chessz_muted", JSON.stringify(nextMuted));
    } catch {}
  };

  // Save Session to localStorage on changes
  useEffect(() => {
    try {
      localStorage.setItem(
        "chessz_session",
        JSON.stringify({ streak, solvedCount })
      );
    } catch {}
  }, [streak, solvedCount]);

  // Viewport-aware resize handler for mobile & desktop zero-scroll layouts
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const currentBezel = width < 640 ? 18 : 24;
      setBezelSize(currentBezel);
      const totalBezelMargin = currentBezel * 2;

      if (width < 768) {
        const availableHeight = height - 250 - totalBezelMargin;
        const availableWidth = width - (width < 440 ? 20 : 32) - totalBezelMargin;
        const maxMobileSize = width < 440 ? 330 : 360;
        const calculatedSize = Math.floor(Math.min(availableWidth, availableHeight, maxMobileSize));
        setBoardWidth(Math.max(260, calculatedSize));
      } else {
        // Desktop: board sized dynamically to fit viewport height with zero overflow
        const maxVertical = Math.max(300, height - 130 - totalBezelMargin);
        const maxHorizontal = Math.max(300, width - 450 - totalBezelMargin);
        const optimalSize = Math.floor(Math.min(maxVertical, maxHorizontal, 520));
        setBoardWidth(optimalSize);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Track keyboard modifier keys globally (Ctrl, Shift, Alt, Meta) for right-click annotations
  useEffect(() => {
    const handleKeyChange = (e: KeyboardEvent) => {
      activeModifiersRef.current = {
        ctrl: !!e.ctrlKey || !!e.metaKey,
        shift: !!e.shiftKey,
        alt: !!e.altKey,
      };
    };
    window.addEventListener("keydown", handleKeyChange);
    window.addEventListener("keyup", handleKeyChange);
    return () => {
      window.removeEventListener("keydown", handleKeyChange);
      window.removeEventListener("keyup", handleKeyChange);
    };
  }, []);

  // Direct Tier Selection
  const handleDirectTierSelect = (level: LevelOption) => {
    setSelectedLevel(level);
    setCalibratedRating(level.approxRating);
    setIsCalibrated(true);
    setIsCurriculumActive(false);
    setCurriculumIndex(0);
    setCurriculumCompleted(false);
    const starter = DIAGNOSTIC_PUZZLES[level.starterPuzzleId] || DIAGNOSTIC_PUZZLES["beginner_1a"];
    loadPuzzle(starter);
  };

  // Start Personalized Training from Diagnosis Profile
  const handleStartDiagnosedTraining = (profile: any, level: LevelOption) => {
    setSelectedLevel(level);
    setCalibratedRating(profile.finalElo || level.approxRating);
    setIsCalibrated(true);
    setIsCurriculumActive(true);
    setCurriculumIndex(0);
    setCurriculumCompleted(false);

    const matching = CONTINUOUS_PUZZLES.filter((p) => p.tier === level.id);
    const playlist = matching.length >= 5 ? matching.slice(0, 5) : CONTINUOUS_PUZZLES.slice(0, 5);
    setCoachDiagnosis({
      archetypeTitle: profile.behavioralPattern || "The Calibrated Player",
      headline: `Diagnosed Level: ${profile.finalLevel}`,
      ruleTitle: "Personalized Training Regimen",
      ruleBody: `Behavioral Pattern: ${profile.behavioralPattern}. Focus on ${profile.weakness} to unlock your next rating milestone.`,
      targetFocus: profile.weakness || "Tactical Precision",
      leakName: profile.weakness || "Tactical Verification",
      leakDetail: profile.weakness || "Verification of candidate ideas under time pressure",
      strategicAntidote: `Strength: ${profile.strength}. Channel this into systematic candidate checks.`,
      composureTip: "Take a 2-second pause before touching a piece to verify safety.",
      starterPuzzleId: playlist[0]?.id || "beginner_1a",
      personalizedSummary: profile.insightShown || "Based on how you calculate under pressure, this curriculum is tailored for you.",
      curatedPlaylist: playlist,
    });
    loadPuzzle(playlist[0]);
  };

  // Start Blunder Fix Training from User's Real Lichess Game
  const handleStartBlunderTraining = (puzzle: ChessPuzzle) => {
    const tier = LEVEL_OPTIONS.find((l) => l.id === puzzle.tier) || LEVEL_OPTIONS[2];
    setSelectedLevel(tier);
    setShowLichessModal(false);
    setShowWeaknessDashboard(false);
    setIsCalibrated(true);
    setIsCurriculumActive(false);
    loadPuzzle(puzzle);
    // User must calculate first! Never spoil the solution with engine arrows on open.
    setEngineEnabled(false);
    // Start background engine calculation immediately so engineBestMove evaluates refutation
    startAnalysis(puzzle.initialFen);
  };

  // Hydrate Blunder from Weakness Studio if navigated via ?mode=blunder
  const hasHydratedBlunderRef = useRef<boolean>(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mode = searchParams.get("mode");
    if (mode === "blunder" && !hasHydratedBlunderRef.current) {
      hasHydratedBlunderRef.current = true;
      let blunderData: any = null;

      try {
        const stored = sessionStorage.getItem("chessz_active_blunder");
        if (stored) {
          blunderData = JSON.parse(stored);
        }
      } catch {}

      const fen = blunderData?.initialFen || searchParams.get("fen");
      const playerColor = (blunderData?.playerColor || searchParams.get("color") || "white") as "white" | "black";
      const playedSan = blunderData?.playedSan || searchParams.get("blunder") || "";
      const gameId = blunderData?.gameId || searchParams.get("gameId") || "game";
      const ply = blunderData?.ply || parseInt(searchParams.get("ply") || "0", 10);

      if (fen) {
        const blunderPuzzle: ChessPuzzle = {
          id: blunderData?.id || `blunder_${gameId}_${ply}`,
          lichessId: gameId,
          tier: "intermediate",
          track: "tactical",
          ratingBadge: "Blunder Fix",
          title: `Blunder Fix: Game ${gameId.slice(0, 8)}`,
          initialFen: fen,
          playerColor,
          prompt: `${playerColor === "white" ? "White" : "Black"} to move: In your game you played ${playedSan}. Calculate the Stockfish refutation!`,
          ruleTitle: `Tactical Correction: ${playedSan}`,
          ruleBody: `Avoid playing ${playedSan}. Find the tactical counter-strike.`,
          solutionMoves: blunderData?.solutionMoves || [],
          defaultRefutation: {
            from: "",
            to: "",
            san: playedSan,
            coachExplanation: `In your game, ${playedSan} was a critical tactical error. Find the tactical counter-strike!`,
          },
          successExplanation: `Masterful calculation! You found the exact tactical refutation.`,
          setupMoves: blunderData?.setupMoves || [],
        };

        handleStartBlunderTraining(blunderPuzzle);
      }
    }
  }, [searchParams]);

  // Synchronize Stockfish best move into blunder puzzles lacking predefined solutions
  useEffect(() => {
    if (
      currentPuzzle &&
      currentPuzzle.solutionMoves.length === 0 &&
      engineBestMove &&
      puzzleStatus === "solving"
    ) {
      setCurrentPuzzle((prev) => {
        if (!prev || prev.solutionMoves.length > 0) return prev;
        return {
          ...prev,
          solutionMoves: [
            {
              from: engineBestMove.from,
              to: engineBestMove.to,
              san: engineBestMove.san,
              promotion: engineBestMove.promotion,
              explanation: `${engineBestMove.san}! Stockfish's optimal continuation that refutes the blunder.`,
            },
          ],
        };
      });
    }
  }, [currentPuzzle, engineBestMove, puzzleStatus]);

  // Advance to next puzzle in the 5-puzzle curriculum
  const handleAdvanceCurriculum = () => {
    const playlist = coachDiagnosis?.curatedPlaylist || diagnosisPlaylist;
    if (curriculumIndex + 1 < playlist.length) {
      const nextIdx = curriculumIndex + 1;
      setCurriculumIndex(nextIdx);
      loadPuzzle(playlist[nextIdx]);
    } else {
      setCurriculumCompleted(true);
    }
  };

  // Transition from curriculum completion into unlimited practice
  const continueToUnlimitedPractice = () => {
    setIsCurriculumActive(false);
    setCurriculumCompleted(false);
    nextPuzzle();
  };

  const loadPuzzle = (puzzle: ChessPuzzle) => {
    clearPuzzleTimeouts();
    setEngineEnabled(false);
    stopAnalysis();
    setCurrentPuzzle(puzzle);
    setPuzzleStatus("solving");
    setRefutationInfo(null);
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
    setHintSquare(null);
    setAnnotatedSquares({});
    setBoardKey((prev) => prev + 1);
    const newChess = new Chess(puzzle.initialFen);
    setGame(newChess);
    setStatus(`${newChess.turn() === "w" ? "White" : "Black"} to move`);
    if (puzzle.setupMoves && puzzle.setupMoves.length > 0) {
      setSetupStepIndex(puzzle.setupMoves.length - 1);
    } else {
      setSetupStepIndex(-1);
    }
  };

  const handleStepSetupMove = (targetIndex: number) => {
    if (!currentPuzzle?.setupMoves || targetIndex < 0 || targetIndex >= currentPuzzle.setupMoves.length) return;
    setSetupStepIndex(targetIndex);
    clearPuzzleTimeouts();
    setSelectedSquare(null);
    setLegalMoves([]);
    setHintSquare(null);
    setAnnotatedSquares({});
    const targetFen = currentPuzzle.setupMoves[targetIndex].fen;
    const newChess = new Chess(targetFen);
    setGame(newChess);
    setBoardKey((prev) => prev + 1);

    if (targetIndex === currentPuzzle.setupMoves.length - 1) {
      setStatus(`${newChess.turn() === "w" ? "White" : "Black"} to move`);
    } else {
      const step = currentPuzzle.setupMoves[targetIndex];
      setStatus(`Lead-up: ${step.turnPrefix} ${step.san} (Click 'Solve' to refute)`);
    }
  };

  const clearAllAnnotations = () => {
    setAnnotatedSquares({});
    setBoardKey((prev) => prev + 1);
  };

  // Shared move executor for Drag-and-Drop and Tap-to-Move
  const handleMoveAttempt = (sourceSquare: string, targetSquare: string): boolean => {
    if (!game || !currentPuzzle || puzzleStatus !== "solving") return false;
    if (currentPuzzle.setupMoves && setupStepIndex !== -1 && setupStepIndex < currentPuzzle.setupMoves.length - 1) {
      return false;
    }

    // Clear UI markings
    clearPuzzleTimeouts();
    setSelectedSquare(null);
    setLegalMoves([]);
    setHintSquare(null);
    setAnnotatedSquares({});

    // 1. Check legal move in chess.js with expected promotion piece awareness
    const targetSolution = currentPuzzle.solutionMoves[0];
    const expectedPromotion =
      targetSolution &&
      targetSolution.from === sourceSquare &&
      targetSolution.to === targetSquare &&
      targetSolution.promotion
        ? targetSolution.promotion
        : (engineBestMove?.from === sourceSquare && engineBestMove?.to === targetSquare && engineBestMove?.promotion
            ? engineBestMove.promotion
            : "q");

    const testChess = new Chess(game.fen());
    let moveResult = null;
    try {
      moveResult = testChess.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: expectedPromotion,
      });
    } catch {
      return false;
    }
    if (!moveResult) return false;

    setSelectedSquare(null);
    setLegalMoves([]);
    setHintSquare(null);

    // Play sound based on move type
    if (testChess.inCheck()) {
      sounds.playCheck();
    } else if (moveResult.captured) {
      sounds.playCapture();
    } else {
      sounds.playMove();
    }

    setLastMove({ from: sourceSquare, to: targetSquare });

    // 2. Check winning solution move:
    // If targetSolution exists, match against targetSolution.
    // If targetSolution is not provided (e.g. ad-hoc blunder position), match against Stockfish's best move!
    const isCorrect = targetSolution
      ? sourceSquare === targetSolution.from && targetSquare === targetSolution.to
      : engineBestMove
      ? sourceSquare === engineBestMove.from && targetSquare === engineBestMove.to
      : false;

    if (isCorrect) {
      setGame(testChess);
      setPuzzleStatus("solved");
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setSolvedCount((prev) => prev + 1);
      setStatus("Tactical Win! Rule Mastered 🎉");

      // Auto-reveal Stockfish engine analysis on solved position
      setEngineEnabled(true);
      startAnalysis(testChess.fen());

      // If this was a Lichess blunder puzzle, mark it as mastered in localStorage
      if (currentPuzzle.id && currentPuzzle.id.startsWith("lichess_")) {
        try {
          const stored = localStorage.getItem("chessz_mastered_blunders");
          const parsed = stored ? JSON.parse(stored) : [];
          if (!parsed.includes(currentPuzzle.id)) {
            parsed.push(currentPuzzle.id);
            localStorage.setItem("chessz_mastered_blunders", JSON.stringify(parsed));
          }
        } catch {}
      }

      victoryTimeoutRef.current = setTimeout(() => {
        sounds.playVictory();
        victoryTimeoutRef.current = null;
      }, 250);

      // Trigger "Save Progress" prompt at streak 3 milestone
      if (nextStreak === 3) {
        saveModalTimeoutRef.current = setTimeout(() => {
          setShowSaveModal(true);
          saveModalTimeoutRef.current = null;
        }, 1200);
      }
      return true;
    }

    // 3. Instant Refutation
    setGame(testChess);
    setPuzzleStatus("refuting");
    setStatus("Analyzing move...");

    refutationTimeoutRef.current = setTimeout(() => {
      const ref = currentPuzzle.defaultRefutation;
      let refutationApplied = false;

      if (ref && ref.from && ref.to) {
        try {
          const refutingChess = new Chess(testChess.fen());
          const refResult = refutingChess.move({
            from: ref.from,
            to: ref.to,
            promotion: ref.promotion || "q",
          });
          if (refResult) {
            refutationApplied = true;
            setGame(refutingChess);
            setLastMove({ from: ref.from, to: ref.to });
            if (refutingChess.inCheck()) {
              sounds.playCheck();
            } else if (refResult.captured) {
              sounds.playCapture();
            } else {
              sounds.playRefutation();
            }
          }
        } catch (err) {
          console.error(
            `[ChessZ] defaultRefutation is illegal for puzzle "${currentPuzzle.id}" ` +
              `(${ref.from}->${ref.to}, san "${ref.san}") at FEN "${testChess.fen()}". ` +
              `Suppressing the coach explanation so it cannot describe a move that was never played.`,
            err
          );
        }
      }

      // Check if user replayed the exact blunder from their game
      const playedBlunder = ref?.san && moveResult.san === ref.san;
      const coachMsg = playedBlunder
        ? `In your game you played ${ref.san}, which was the critical tactical blunder! Calculate the winning alternative instead.`
        : ref?.coachExplanation || `Not the best move. Keep calculating to find Stockfish's top refutation!`;

      setRefutationInfo({
        from: ref?.from || "",
        to: ref?.to || "",
        san: ref?.san || moveResult.san,
        coachExplanation: coachMsg,
      });
      setPuzzleStatus("failed");
      setStreak(0);
      setStatus(playedBlunder ? "Original Blunder Repeated!" : (refutationApplied ? "Refuted by opponent!" : "Not the best move"));
      refutationTimeoutRef.current = null;
    }, 650);

    return true;
  };

  // Tap-to-move square click handler
  const handleSquareClick = ({ square }: { square: string }) => {
    if (!game || !currentPuzzle || puzzleStatus !== "solving") return;
    if (currentPuzzle.setupMoves && setupStepIndex !== -1 && setupStepIndex < currentPuzzle.setupMoves.length - 1) return;

    // 0. If mobile touch annotation color is active, mark the square directly
    if (activeAnnotationColor) {
      const palette = ANNOTATION_COLORS[activeAnnotationColor];

      setAnnotatedSquares((prev) => {
        const next = { ...prev };
        if (next[square] && next[square].type === activeAnnotationColor) {
          delete next[square];
        } else {
          next[square] = { bg: palette.bg, border: palette.border, type: activeAnnotationColor };
        }
        return next;
      });
      return;
    }

    // Left-clicking empty square clears markings
    if (!selectedSquare && !game.get(square as any) && Object.keys(annotatedSquares).length > 0) {
      setAnnotatedSquares({});
    }

    if (selectedSquare) {
      // 1. If clicking the EXACT same square that is currently selected -> DESELECT and CLEAR DOTS!
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setLegalMoves([]);
        setHintSquare(null);
        return;
      }

      // 2. If clicking a legal target -> execute move
      const isLegalTarget = legalMoves.some((m) => m.to === square);
      if (isLegalTarget) {
        if (Object.keys(annotatedSquares).length > 0) {
          setAnnotatedSquares({});
        }
        const fromSquare = selectedSquare;
        setSelectedSquare(null);
        setLegalMoves([]);
        setHintSquare(null);
        handleMoveAttempt(fromSquare, square);
        return;
      }

      // 3. If clicking another friendly piece -> switch selection to that piece
      const pieceOnSquare = game.get(square as any);
      if (pieceOnSquare && pieceOnSquare.color === game.turn()) {
        setSelectedSquare(square);
        setHintSquare(null);
        const moves = game.moves({ square: square as any, verbose: true });
        setLegalMoves(moves.map((m) => ({ to: m.to, captured: m.captured })));
        sounds.playMove();
        return;
      }

      // 4. If clicking any other square (empty or enemy square that is not a legal move) -> CLEAR SELECTION & DOTS!
      setSelectedSquare(null);
      setLegalMoves([]);
      setHintSquare(null);
      if (Object.keys(annotatedSquares).length > 0) {
        setAnnotatedSquares({});
      }
      return;
    }

    // When no piece is selected:
    const piece = game.get(square as any);
    if (piece && piece.color === game.turn()) {
      setSelectedSquare(square);
      setHintSquare(null);
      const moves = game.moves({ square: square as any, verbose: true });
      setLegalMoves(moves.map((m) => ({ to: m.to, captured: m.captured })));
      sounds.playMove();
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
      setHintSquare(null);
      if (Object.keys(annotatedSquares).length > 0) {
        setAnnotatedSquares({});
      }
    }
  };

  // Right-click tactical annotation handler:
  // Default: Green (#10b981)
  // Control: Red (#ef4444)
  // Shift (swift): Blue (#0284c7)
  // Alt: Yellow (#f59e0b)
  const handleSquareRightClick = ({ square }: { square: string }) => {
    if (!game || puzzleStatus !== "solving") return;

    const isAlt = lastRightClickModifiersRef.current.alt || activeModifiersRef.current.alt;
    const isShift = lastRightClickModifiersRef.current.shift || activeModifiersRef.current.shift;
    const isCtrl = lastRightClickModifiersRef.current.ctrl || activeModifiersRef.current.ctrl;

    const colorType: AnnotationColor = isAlt
      ? "yellow"
      : isShift
      ? "cyan"
      : isCtrl
      ? "red"
      : "green";
    const { bg, border } = ANNOTATION_COLORS[colorType];

    setAnnotatedSquares((prev) => {
      const next = { ...prev };
      if (next[square] && next[square].type === colorType) {
        // Clicking same square with same modifier toggles it off
        delete next[square];
      } else {
        // Set new color highlight
        next[square] = { bg, border, type: colorType };
      }
      return next;
    });
  };

  const triggerHint = () => {
    if (!game || !currentPuzzle || puzzleStatus !== "solving") return;
    const keyPieceSquare = currentPuzzle.solutionMoves[0]?.from || engineBestMove?.from;
    if (!keyPieceSquare) return;
    setHintSquare(keyPieceSquare);
    setSelectedSquare(keyPieceSquare);
    const moves = game.moves({ square: keyPieceSquare as any, verbose: true });
    setLegalMoves(moves.map((m) => ({ to: m.to, captured: m.captured })));
    sounds.playMove();
  };

  const getCustomSquareStyles = () => {
    const styles: Record<string, React.CSSProperties> = {};

    // 1. Right-click tactical annotations (crisp tile framing with modern glowing perimeter)
    Object.entries(annotatedSquares).forEach(([sq, item]) => {
      styles[sq] = {
        backgroundColor: item.bg,
        boxShadow: `inset 0 0 0 2.5px ${item.border}, inset 0 0 14px ${item.border}35`,
      };
    });

    // 2. Last move highlight (calm theme wash)
    if (lastMove) {
      styles[lastMove.from] = {
        ...styles[lastMove.from],
        backgroundColor: "var(--board-last-move, rgba(100, 135, 195, 0.30))",
      };
      styles[lastMove.to] = {
        ...styles[lastMove.to],
        backgroundColor: "var(--board-last-move, rgba(100, 135, 195, 0.38))",
      };
    }

    // 3. Selected square highlight (refined accent inset ring)
    if (selectedSquare) {
      styles[selectedSquare] = {
        backgroundColor: "var(--board-last-move, rgba(100, 135, 195, 0.35))",
        boxShadow: "inset 0 0 0 2.5px var(--accent-primary, #426199)",
      };
    }

    // 4. Legal moves dots and capture rings (calm dots & precision rings)
    legalMoves.forEach((move) => {
      if (move.captured) {
        styles[move.to] = {
          background:
            "radial-gradient(circle, transparent 52%, var(--accent-primary, #426199) 54%, var(--accent-primary, #426199) 68%, transparent 70%)",
          borderRadius: "50%",
        };
      } else {
        styles[move.to] = {
          background:
            "radial-gradient(circle, var(--board-legal-dot, rgba(66, 97, 153, 0.42)) 22%, transparent 24%)",
          borderRadius: "50%",
        };
      }
    });

    // 5. Hint square highlight (emerald pulse)
    if (hintSquare) {
      styles[hintSquare] = {
        backgroundColor: "rgba(52, 211, 153, 0.4)",
        boxShadow: "inset 0 0 0 4px #10b981",
      };
    }

    // 6. Dynamic King-in-Check crimson radial glow
    if (game && game.inCheck()) {
      const turn = game.turn();
      for (let r = 0; r < 8; r++) {
        for (let f = 0; f < 8; f++) {
          const sq = `${"abcdefgh"[f]}${8 - r}`;
          const piece = game.get(sq as any);
          if (piece && piece.type === "k" && piece.color === turn) {
            styles[sq] = {
              ...styles[sq],
              background:
                "radial-gradient(circle, rgba(239, 68, 68, 0.85) 0%, rgba(220, 38, 38, 0.50) 45%, rgba(185, 28, 28, 0.20) 75%, transparent 100%)",
              boxShadow: "inset 0 0 0 2.5px #ef4444, inset 0 0 16px rgba(239, 68, 68, 0.75)",
            };
          }
        }
      }
    }

    return styles;
  };

  const retryCurrentPuzzle = () => {
    if (!currentPuzzle) return;
    loadPuzzle(currentPuzzle);
  };

  const nextPuzzle = () => {
    if (!selectedLevel) return;
    let matching = CONTINUOUS_PUZZLES.filter(
      (p) => p.tier === selectedLevel.id
    );
    if (matching.length === 0) {
      matching = CONTINUOUS_PUZZLES;
    }
    const nextP = matching[continuousIndex % matching.length] || CONTINUOUS_PUZZLES[0];
    setContinuousIndex((prev) => prev + 1);
    loadPuzzle(nextP);
  };

  const resetCalibration = () => {
    clearPuzzleTimeouts();
    setSelectedLevel(null);
    setIsCalibrated(false);
    setIsCurriculumActive(false);
    setCurriculumIndex(0);
    setCurriculumCompleted(false);
    setDiagnosisPlaylist([]);
    setCoachDiagnosis(null);
    setGame(null);
    setCurrentPuzzle(null);
    setPuzzleStatus("solving");
    setRefutationInfo(null);
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
    setHintSquare(null);
    setAnnotatedSquares({});
    setSetupStepIndex(-1);
  };

  const handleSaveProgressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase.auth.signInWithOtp({
          email: emailInput.trim(),
        });
        if (error) {
          setAuthStatusMessage(`Error: ${error.message}`);
        } else {
          setAuthStatusMessage("Magic link sent! Check your inbox to sync.");
        }
      } catch {
        setAuthStatusMessage("Saved locally to your browser!");
      }
    } else {
      // Local graceful fallback
      setAuthStatusMessage("Progress saved locally to this device!");
      setTimeout(() => {
        setShowSaveModal(false);
        setAuthStatusMessage("");
      }, 1500);
    }
  };

  const handleShareDiagnosis = async () => {
    console.log("[handleShareDiagnosis] called!");
    if (!coachDiagnosis || !selectedLevel) return;
    const shareText = `♟️ My ChessZ Coach Diagnosis:\nRating Tier: ${selectedLevel.title}\n${coachDiagnosis.headline}\nGolden Rule: ${coachDiagnosis.ruleTitle} — "${coachDiagnosis.ruleBody}"\nFocus Area: ${coachDiagnosis.targetFocus}\n\n100% Free Chess Training • No ₹1,500/yr Paywall\nTrain now: https://chessz.vercel.app`;

    let shared = false;
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: "ChessZ Coach Diagnosis",
          text: shareText,
          url: typeof window !== "undefined" ? window.location.origin : undefined,
        });
        shared = true;
      } catch (err: any) {
        // If user actively cancelled the share sheet, return without modifying clipboard
        if (err?.name === "AbortError") {
          return;
        }
      }
    }

    let copied = false;
    if (!shared) {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(shareText);
          copied = true;
        } catch {
          // Fallback below
        }
      }

      if (!copied && typeof document !== "undefined") {
        try {
          const textarea = document.createElement("textarea");
          textarea.value = shareText;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand("copy");
          document.body.removeChild(textarea);
          copied = true;
        } catch {}
      }

      // Show confirmation toast for clipboard fallback
      if (copied) {
        setShareCopied(true);
        setTimeout(() => setShareCopied(false), 2500);
      }
    }
  };

  return (
    <main className={`min-h-screen flex flex-col p-3 sm:p-4 md:px-6 md:py-4 font-sans transition-colors duration-200 overflow-x-hidden ${
      selectedLevel ? "md:h-screen md:overflow-hidden justify-between" : "justify-start"
    }`}>
      {/* Top Header */}
      <header className="w-full max-w-md md:max-w-5xl lg:max-w-6xl mx-auto flex items-center justify-between py-2.5 px-3.5 sm:px-4 rounded-2xl theme-surface mb-4 md:mb-6 shrink-0 border shadow-xs relative z-30">
        <div className="flex items-center gap-2.5">
          <button
            onClick={resetCalibration}
            className="flex items-center gap-2 cursor-pointer group text-left"
            title="ChessZ Home"
          >
            <div className="w-7 h-7 rounded-xl overflow-hidden shrink-0 shadow-xs flex items-center justify-center group-hover:opacity-90 transition-opacity">
              <ChessZMark size={28} treatment="tight" className="w-full h-full" />
            </div>
            <span className="font-extrabold text-sm sm:text-base tracking-tight theme-text-primary font-display">
              ChessZ
            </span>
          </button>

          </div>

        <div className="flex items-center gap-1.5">
          {/* Lichess Account / Sync Button */}
          <button
            onClick={() => setShowLichessModal(true)}
            className={`flex items-center gap-2 text-[11px] font-mono font-semibold px-3 py-1.5 rounded-xl cursor-pointer transition-all border ${
              lichessUser
                ? "bg-amber-100/90 dark:bg-amber-950/40 border-amber-300/90 dark:border-amber-500/40 text-amber-950 dark:text-amber-200 hover:bg-amber-200/80 dark:hover:bg-amber-900/50 shadow-2xs"
                : "theme-surface theme-surface-hover"
            }`}
            title={lichessUser ? `Lichess: @${lichessUser.username}` : "Connect Lichess Account"}
            aria-label="Lichess account connection"
          >
            <LichessIcon className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" />
            <span className="hidden sm:inline font-bold">
              {lichessUser ? lichessUser.username : "Connect Lichess"}
            </span>
            {lichessUser?.perfs?.rapid?.rating && (
              <span className="hidden md:inline px-1.5 py-0.5 rounded-md bg-amber-200/90 dark:bg-amber-500/30 text-[10px] text-amber-950 dark:text-amber-100 font-extrabold border border-amber-300 dark:border-amber-500/40">
                {lichessUser.perfs.rapid.rating}
              </span>
            )}
          </button>

          {/* Mute Toggle */}
          <button
            onClick={toggleMute}
            className="w-8 h-8 rounded-xl theme-surface theme-surface-hover flex items-center justify-center cursor-pointer transition border"
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
            aria-label={isMuted ? "Unmute Sound" : "Mute Sound"}
          >
            {isMuted ? (
              <VolumeX className="w-4 h-4 opacity-50" />
            ) : (
              <Volume2 className="w-4 h-4 text-[var(--accent-primary)]" />
            )}
          </button>

          {/* Settings & Theme Studio Button */}
          <button
            onClick={() => setShowSettingsModal(true)}
            className="flex items-center gap-1.5 text-[11px] font-mono font-semibold theme-surface theme-surface-hover px-2.5 py-1.5 rounded-xl cursor-pointer transition border"
            title="Settings & Theme Studio"
            aria-label="Settings and themes"
          >
            <Settings className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span className="hidden sm:inline">Settings</span>
          </button>

          {isCalibrated && (
            <button
              onClick={() => setShowSaveModal(true)}
              className="flex items-center gap-1 text-[11px] font-mono font-medium theme-surface theme-surface-hover px-2.5 py-1.5 rounded-xl cursor-pointer transition"
              title="Save Progress"
            >
              <Save className="w-3 h-3 text-[var(--accent-primary)]" />
              <span>Save</span>
            </button>
          )}

          {selectedLevel && (
            <>
              <button
                onClick={resetCalibration}
                className="text-xs theme-text-secondary hover:theme-text-primary transition underline underline-offset-4 cursor-pointer px-1"
              >
                Change Tier
              </button>
              {isCalibrated && (
                <button
                  onClick={retryCurrentPuzzle}
                  className="flex items-center gap-1 text-xs theme-surface theme-surface-hover transition px-2.5 py-1.5 rounded-xl cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </>
          )}
        </div>
      </header>

      {/* Screen 1: Redesigned High-Authority Landing Screen */}
      {!selectedLevel ? (
        <section className="flex-1 flex flex-col items-center justify-start max-w-md md:max-w-4xl mx-auto w-full pt-3 sm:pt-6 md:pt-8 pb-8 md:pb-12">
          {/* Eyebrow Pill */}
          <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-wide px-3.5 py-1 rounded-full mb-3 shadow-xs bg-[var(--surface-muted)]/80 backdrop-blur-sm border border-[var(--border-subtle)]">
            <Sparkles className="w-3.5 h-3.5 text-[var(--accent-primary)] animate-pulse" />
            <span className="theme-text-primary font-medium">✨ The vibe check for your chess rating</span>
          </div>

          {/* Grandmaster Authority Headline with Atmospheric Lighting */}
          <div className="relative text-center mb-6 sm:mb-8 max-w-2xl mx-auto">
            {/* Multi-Depth Ambient Glow */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-80 sm:w-[480px] h-44 bg-[var(--accent-primary)]/15 rounded-full blur-3xl pointer-events-none -z-10" />
            <div className="absolute top-8 left-1/3 -translate-x-1/2 w-48 h-28 bg-amber-500/10 dark:bg-amber-400/5 rounded-full blur-2xl pointer-events-none -z-10" />

            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[42px] font-extrabold tracking-tight theme-text-primary leading-[1.15] mb-2.5 font-display">
              Stop Throwing Won Games. <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-[var(--accent-primary)] via-[var(--accent-primary)] to-sky-500 dark:to-sky-400 bg-clip-text text-transparent">
                Spot Your Tactical Blindspots.
              </span>
            </h1>
            <p className="theme-text-secondary text-xs sm:text-sm max-w-xl mx-auto leading-relaxed">
              Grinding random puzzles won&apos;t stop you from hanging pieces at move 15. ChessZ tests how you calculate under pressure—your speed, hesitation, and tactical habits—then gives you drills to stop gifting free Elo.
            </p>
          </div>

          {/* Dual Bento Action Cards */}
          <div className="w-full max-w-3xl grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 mb-5">
            {/* Card 1: 5-to-6 Trial Level Diagnostic */}
            <div className="relative rounded-2xl p-5 sm:p-6 theme-surface theme-surface-hover shadow-md border border-[var(--border-subtle)] hover:border-[var(--border-focus)] hover:-translate-y-1 hover:shadow-xl transition-all duration-200 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] border border-[var(--accent-primary)]/20 text-[10px] font-mono font-bold uppercase tracking-wider">
                    <Sparkles className="w-3 h-3 text-[var(--accent-primary)]" />
                    <span>5-Move Vibe Check</span>
                  </div>
                  <span className="text-[10px] font-mono theme-text-muted">~2.5 Mins</span>
                </div>

                <h3 className="text-base sm:text-lg font-extrabold theme-text-primary tracking-tight mb-1.5 font-display">
                  Find Your Tactical Baseline
                </h3>
                <p className="text-xs theme-text-secondary leading-relaxed mb-3.5">
                  Play 5 benchmark positions. We measure your speed, calculation discipline, and tactical vision to map your true playing tier.
                </p>

                {/* Telemetry Micro-Pills (High-Contrast Jewel Tones) */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/25 font-semibold">
                    ⚡ Speed Test
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/25 font-semibold">
                    🎯 Bluff or Sure?
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/25 font-semibold">
                    👑 Adaptive Scale (600–2150+)
                  </span>
                </div>

                {savedDiagnosisProfile && (
                  <div className="mb-4 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-mono flex items-center justify-between">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      ✓ Diagnosed: {savedDiagnosisProfile.finalLevel} (~{savedDiagnosisProfile.finalElo} Elo)
                    </span>
                    <span className="text-[10px] theme-text-muted">
                      {savedDiagnosisProfile.behavioralPattern}
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                {savedDiagnosisProfile && (
                  <button
                    onClick={() => {
                      const targetLevel =
                        LEVEL_OPTIONS.find((l) => l.id === savedDiagnosisProfile.tierId) ||
                        LEVEL_OPTIONS[2];
                      handleStartDiagnosedTraining(savedDiagnosisProfile, targetLevel);
                    }}
                    className="w-full sm:w-1/2 py-2.5 px-3 rounded-xl theme-surface hover:theme-surface-subtle font-bold text-xs tracking-wide border transition cursor-pointer text-center"
                  >
                    Resume Training
                  </button>
                )}
                <Link
                  href="/diagnose"
                  className={`w-full ${savedDiagnosisProfile ? "sm:w-1/2" : "w-full"} py-2.5 px-4 rounded-xl theme-accent-btn font-bold text-xs tracking-wide flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg hover:brightness-105 active:scale-[0.98] transition-all cursor-pointer group`}
                >
                  <span>{savedDiagnosisProfile ? "Retake Test" : "Take The Test"}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Card 2: Lichess Account & Blunder Studio */}
            <div className="relative rounded-2xl p-5 sm:p-6 theme-surface theme-surface-hover shadow-md border border-[var(--border-subtle)] hover:border-[var(--border-focus)] hover:-translate-y-1 hover:shadow-xl transition-all duration-200 flex flex-col justify-between group">
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200 border border-amber-300 dark:border-amber-500/40 text-[10px] font-mono font-bold uppercase tracking-wider">
                    <LichessIcon className="w-3.5 h-3.5 text-amber-800 dark:text-amber-400" />
                    <span>Lichess Sync</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-semibold">1-Click Sync</span>
                </div>

                <h3 className="text-base sm:text-lg font-extrabold theme-text-primary tracking-tight mb-1.5 font-display">
                  Turn Your Blunders Into XP
                </h3>
                <p className="text-xs theme-text-secondary leading-relaxed mb-3.5">
                  Connect Lichess to automatically scan the real games where you threw, and turn your exact mistakes into custom practice puzzles.
                </p>

                {/* Telemetry Micro-Pills */}
                <div className="flex flex-wrap items-center gap-1.5 mb-3.5">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-900 dark:text-amber-200 border border-amber-500/25 font-semibold">
                    ♟️ 50-Game Scanner
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-rose-500/10 text-rose-700 dark:text-rose-300 border border-rose-500/25 font-semibold">
                    💥 Blunder Extraction
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 font-semibold">
                    🔄 Live Rating Sync
                  </span>
                </div>

                {lichessUser ? (
                  <div className="p-3 rounded-xl bg-amber-100/70 dark:bg-amber-950/40 border border-amber-300/90 dark:border-amber-500/35 mb-4 flex items-center justify-between text-xs font-mono shadow-2xs">
                    <div className="flex items-center gap-2.5">
                      <div className="w-6 h-6 rounded-lg bg-amber-200/90 dark:bg-amber-900/60 border border-amber-300 dark:border-amber-500/40 flex items-center justify-center shrink-0">
                        <LichessIcon className="w-3.5 h-3.5 text-amber-900 dark:text-amber-300" />
                      </div>
                      <span className="font-extrabold text-neutral-900 dark:text-neutral-100">@{lichessUser.username}</span>
                    </div>
                    <span className="text-[11px] px-2.5 py-1 rounded-md bg-amber-200/90 dark:bg-amber-500/30 text-amber-950 dark:text-amber-100 font-extrabold border border-amber-300 dark:border-amber-500/40">
                      Rapid: {lichessUser.perfs?.rapid?.rating || lichessUser.perfs?.blitz?.rating || "Synced"}
                    </span>
                  </div>
                ) : (
                  <div className="mb-4 p-2.5 rounded-xl bg-[var(--surface-muted)] border border-[var(--border-subtle)] text-[11px] font-mono flex items-center justify-between">
                    <span className="font-medium theme-text-secondary">
                      Scan your latest 50 rated games
                    </span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      Ready to Sync
                    </span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center gap-2">
                {lichessUser ? (
                  <>
                    <button
                      onClick={() => setShowWeaknessDashboard(true)}
                      className="w-full sm:w-1/2 py-2.5 px-3 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 text-rose-700 dark:text-rose-300 border border-rose-500/30 font-bold text-xs tracking-wide transition cursor-pointer flex items-center justify-center gap-1.5 active:scale-95"
                    >
                      <Target className="w-3.5 h-3.5" />
                      <span>Practice My Blunders</span>
                    </button>
                    <button
                      onClick={() => setShowLichessModal(true)}
                      className="w-full sm:w-1/2 py-2.5 px-3 rounded-xl theme-surface hover:theme-surface-subtle font-bold text-xs tracking-wide border transition cursor-pointer text-center active:scale-95"
                    >
                      View Profile
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setShowLichessModal(true)}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs tracking-wide flex items-center justify-center gap-1.5 shadow-md hover:shadow-lg active:scale-[0.98] transition cursor-pointer"
                  >
                    <LichessIcon className="w-3.5 h-3.5 text-amber-100" />
                    <span>Connect Lichess Account</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Bento Card 3: Study Chess Terms & Coach Brainstorming */}
          <div className="w-full max-w-3xl mb-4 p-3.5 sm:p-4 rounded-2xl theme-surface theme-surface-hover border border-[var(--border-subtle)] hover:border-[var(--border-focus)] shadow-xs hover:shadow-md transition-all duration-150 flex flex-col sm:flex-row items-center justify-between gap-3 group">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] border border-[var(--accent-primary)]/30 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="flex flex-wrap items-center gap-2 mb-0.5">
                  <span className="text-xs sm:text-sm font-extrabold theme-text-primary">
                    Study Chess Terms & Master Coach
                  </span>
                  <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 uppercase">
                    Real Master Games
                  </span>
                </div>
                <p className="text-xs theme-text-secondary leading-snug">
                  Brainstorm candidate moves with live coach feedback on historical games from Morphy, Fischer, and Capablanca. Hover over any chess term to inspect its rule.
                </p>
              </div>
            </div>
            <Link
              href="/terms"
              className="shrink-0 w-full sm:w-auto py-2 px-3.5 rounded-xl theme-accent-btn text-xs font-mono font-bold flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md transition cursor-pointer"
            >
              <span>Explore Terms</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Direct Practice Lobby Selector (Prestige Rank Accents) */}
          <div className="w-full max-w-3xl mb-5">
            <div className="flex items-center gap-3 my-2 text-zinc-400">
              <div className="flex-1 h-px bg-[var(--border-subtle)]" />
              <span className="text-[10px] uppercase tracking-widest font-semibold theme-text-muted font-mono">
                Or Pick Your Lobby
              </span>
              <div className="flex-1 h-px bg-[var(--border-subtle)]" />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {LEVEL_OPTIONS.map((lvl) => {
                const tierStyles =
                  lvl.id === "beginner"
                    ? {
                        hoverBorder: "hover:border-emerald-500/50 hover:bg-emerald-500/5",
                        iconBg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
                        dot: "bg-emerald-500",
                      }
                    : lvl.id === "adv_beginner"
                    ? {
                        hoverBorder: "hover:border-sky-500/50 hover:bg-sky-500/5",
                        iconBg: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
                        dot: "bg-sky-500",
                      }
                    : lvl.id === "intermediate"
                    ? {
                        hoverBorder: "hover:border-amber-500/50 hover:bg-amber-500/5",
                        iconBg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
                        dot: "bg-amber-500",
                      }
                    : {
                        hoverBorder: "hover:border-purple-500/50 hover:bg-purple-500/5",
                        iconBg: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
                        dot: "bg-purple-500",
                      };

                return (
                  <button
                    key={lvl.id}
                    onClick={() => handleDirectTierSelect(lvl)}
                    className={`flex items-center gap-2 p-2 sm:p-2.5 rounded-2xl theme-surface border border-[var(--border-subtle)] ${tierStyles.hoverBorder} hover:-translate-y-0.5 hover:shadow-md transition-all duration-150 group cursor-pointer text-left shadow-2xs active:scale-95`}
                  >
                    <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl ${tierStyles.iconBg} border flex items-center justify-center text-base sm:text-lg select-none shrink-0 group-hover:scale-105 transition-transform`}>
                      {lvl.pieceSymbol}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <span className={`w-1.5 h-1.5 rounded-full ${tierStyles.dot} shrink-0`} />
                        <span className="text-[11px] sm:text-xs font-bold theme-text-primary block truncate group-hover:text-[var(--accent-primary)] transition-colors">
                          {lvl.title}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono theme-text-muted block truncate pl-2.5">
                        {lvl.chessComRange}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* "Why ChessZ?" — The 3 Pillars Section */}
          <div className="w-full max-w-3xl my-3 p-4 sm:p-5 rounded-3xl theme-surface border border-[var(--border-subtle)] shadow-sm">
            <div className="text-center mb-4">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--accent-primary)] block mb-1">
                Why ChessZ Hits Different
              </span>
              <h2 className="text-base sm:text-lg md:text-xl font-extrabold theme-text-primary font-display">
                Endless random puzzles are an L.
              </h2>
              <p className="text-xs theme-text-secondary max-w-md mx-auto mt-1 leading-relaxed">
                Memorizing 12-move queen sacrifices won&apos;t help when you hang rooks in rapid. Here&apos;s how ChessZ actually helps you climb:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Pillar 1 */}
              <div className="p-3.5 rounded-2xl theme-surface-subtle border border-[var(--border-subtle)] hover:-translate-y-1 hover:shadow-md transition-all duration-200">
                <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20 flex items-center justify-center mb-2.5">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold theme-text-primary uppercase tracking-wide mb-1 font-display">
                  1. Speed & Bluff Check
                </h3>
                <p className="text-[11px] theme-text-secondary leading-relaxed">
                  Did you calculate it or did you panic-guess? We track hesitation and confidence so you stop bluffing yourself.
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="p-3.5 rounded-2xl theme-surface-subtle border border-[var(--border-subtle)] hover:-translate-y-1 hover:shadow-md transition-all duration-200">
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center mb-2.5">
                  <Swords className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold theme-text-primary uppercase tracking-wide mb-1 font-display">
                  2. Computer Claps Back
                </h3>
                <p className="text-[11px] theme-text-secondary leading-relaxed">
                  Ever wonder &quot;why can&apos;t I just play this?&quot; The engine immediately plays the winning counter-punch right on your board.
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="p-3.5 rounded-2xl theme-surface-subtle border border-[var(--border-subtle)] hover:-translate-y-1 hover:shadow-md transition-all duration-200">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center mb-2.5">
                  <Award className="w-4 h-4" />
                </div>
                <h3 className="text-xs font-bold theme-text-primary uppercase tracking-wide mb-1 font-display">
                  3. Cheat Codes That Stick
                </h3>
                <p className="text-[11px] theme-text-secondary leading-relaxed">
                  No boring 500-page opening manuals. Just sticky rules like <em>The 2-Second Bodyguard Rule</em> to stop gifting free elo.
                </p>
              </div>
            </div>
          </div>

          {/* Clear Human-Friendly Trust Markers */}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[11px] theme-text-secondary bg-[var(--surface-muted)]/80 backdrop-blur-sm px-4 py-1.5 rounded-full border border-[var(--border-subtle)] shadow-2xs font-mono">
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">✓ 100% Free Forever</span>
            <span className="hidden sm:inline theme-text-muted">•</span>
            <span className="font-semibold text-[var(--accent-primary)]">✓ Built-In Engine</span>
            <span className="hidden sm:inline theme-text-muted">•</span>
            <span className="font-semibold text-amber-600 dark:text-amber-400">✓ Lichess Connected</span>
            <span className="hidden sm:inline theme-text-muted">•</span>
            <span className="theme-text-muted">No Ads • Zero Paywalls</span>
          </div>
        </section>
      ) : (
        /* Screen 2: The Interactive Chessboard Arena (Chess.com Desktop Layout Reference) */
        <section className="flex-1 flex flex-col md:flex-row items-center justify-center gap-4 lg:gap-8 max-w-6xl mx-auto w-full py-1 md:py-2 min-h-0">
          {/* Mobile Only: Top HUD */}
          <div className="w-full flex md:hidden items-center justify-between mb-1 px-1">
            <div className="flex items-center gap-2">
              {isCurriculumActive ? (
                <>
                  <div className="flex items-center gap-1 text-xs font-mono font-bold theme-pill px-2 py-0.5 rounded-lg">
                    <Target className="w-3 h-3 text-[var(--accent-primary)]" />
                    <span>Curriculum {curriculumIndex + 1}/5</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {[0, 1, 2, 3, 4].map((step) => (
                      <div
                        key={step}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          step < curriculumIndex
                            ? "w-2.5 bg-[var(--accent-primary)]"
                            : step === curriculumIndex
                            ? "w-4 bg-[var(--accent-primary)] animate-pulse"
                            : "w-1.5 theme-surface-subtle"
                        }`}
                      />
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center gap-1 text-xs font-mono font-bold theme-pill px-2.5 py-1 rounded-lg">
                    <Flame className="w-3.5 h-3.5 text-[var(--accent-primary)] fill-current" />
                    <span>{streak} Streak</span>
                  </div>
                  <span className="text-xs theme-text-muted font-mono">
                    {solvedCount} Solved
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Mobile Only: Coach Tip Reminder Banner above board */}
          {currentPuzzle && (
            <div className="w-full md:hidden theme-surface-subtle border rounded-xl p-2.5 mb-2 flex items-start gap-2 text-left">
              <Sparkles className="w-4 h-4 text-[var(--accent-primary)] shrink-0 mt-0.5" />
              <div className="text-xs flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--accent-primary)] block mb-0.5">
                  {isCurriculumActive ? `Curriculum Step ${curriculumIndex + 1} of 5` : "Coach Instruction"}
                </span>
                <span className="font-bold theme-text-primary block">{currentPuzzle.prompt}</span>
                <span className="text-[11px] theme-text-secondary flex items-center gap-1">
                  Rule: <TermHoverCard term={currentPuzzle.ruleTitle} showIcon />
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded theme-surface theme-text-muted border">
                {currentPuzzle.ratingBadge}
              </span>
            </div>
          )}

          {/* Mobile Only: Status Row with Hint Button */}
          <div className="w-full flex md:hidden items-center justify-between mb-1.5 px-1 text-xs">
            <div className="flex items-center gap-2">
              <span
                className={`w-3 h-3 rounded-full ${
                  game?.turn() === "w" ? "bg-[var(--accent-primary)] shadow-sm" : "theme-surface-subtle border-2 border-neutral-500"
                }`}
              />
              <span className="font-extrabold text-xs tracking-wider font-display uppercase theme-text-primary">{status}</span>
            </div>

            <div className="flex items-center gap-2">
              {puzzleStatus === "solving" && (
                <button
                  onClick={triggerHint}
                  className="flex items-center gap-1 text-[11px] theme-pill px-2 py-0.5 rounded-md transition cursor-pointer hover:opacity-80"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>Hint</span>
                </button>
              )}
              <span className="theme-text-muted font-mono text-[11px]">
                Drag or Tap
              </span>
            </div>
          </div>

          {/* Mobile Only: square marking. The right-click modifiers desktop uses
              have no touch equivalent, so the colours get explicit controls. */}
          {puzzleStatus === "solving" && (
            <div className="w-full flex md:hidden mb-1.5 px-1 overflow-x-auto">
              <AnnotationPalette
                active={activeAnnotationColor}
                onSelect={setActiveAnnotationColor}
                onClear={clearAllAnnotations}
                hasMarks={Object.keys(annotatedSquares).length > 0}
              />
            </div>
          )}

          {/* Chessboard Column (Left / Center) with Exterior ChessBase Bezel */}
          <div className="flex flex-col items-center justify-center shrink-0">
            {/* Setup Moves Lead-up Stepper for Blunder Review */}
            {currentPuzzle?.setupMoves && currentPuzzle.setupMoves.length > 1 && (
              <div 
                className="w-full mb-2 px-2.5 py-1.5 rounded-xl theme-surface border border-[var(--border-subtle)] flex items-center justify-between gap-2 text-xs select-none shadow-xs"
                style={{ maxWidth: boardWidth + bezelSize * 2 }}
              >
                <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-500 shrink-0 flex items-center gap-1">
                    <History className="w-3 h-3" /> Lead-up:
                  </span>
                  <div className="flex items-center gap-1 overflow-x-auto">
                    {currentPuzzle.setupMoves.map((m, idx) => {
                      const isCurrent = setupStepIndex === idx;
                      const isCritical = idx === currentPuzzle.setupMoves!.length - 1;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleStepSetupMove(idx)}
                          className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-semibold transition cursor-pointer shrink-0 ${
                            isCurrent
                              ? isCritical
                                ? "bg-rose-500 text-white shadow-xs"
                                : "bg-[var(--accent-primary)] text-white shadow-xs"
                              : isCritical
                              ? "bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 hover:bg-rose-500/25"
                              : "theme-surface-subtle theme-text-secondary hover:theme-text-primary"
                          }`}
                          title={isCritical ? "Critical Blunder Position (Solve)" : `Lead-up Move ${m.turnPrefix} ${m.san}`}
                        >
                          {m.turnPrefix} {m.san || "..."}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleStepSetupMove(Math.max(0, setupStepIndex - 1))}
                    disabled={setupStepIndex <= 0}
                    className="p-1 rounded-md theme-surface-subtle theme-text-secondary hover:theme-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                    title="Previous Move (◀)"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStepSetupMove(Math.min(currentPuzzle.setupMoves!.length - 1, setupStepIndex + 1))}
                    disabled={setupStepIndex >= currentPuzzle.setupMoves.length - 1}
                    className="p-1 rounded-md theme-surface-subtle theme-text-secondary hover:theme-text-primary disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
                    title="Next Move (▶)"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>

                  {setupStepIndex < currentPuzzle.setupMoves.length - 1 && (
                    <button
                      type="button"
                      onClick={() => handleStepSetupMove(currentPuzzle.setupMoves!.length - 1)}
                      className="ml-1 px-2 py-0.5 rounded-md bg-rose-500 hover:bg-rose-600 text-white font-bold text-[10px] uppercase tracking-wider transition shadow-xs cursor-pointer"
                      title="Jump to critical blunder position"
                    >
                      Solve
                    </button>
                  )}
                </div>
              </div>
            )}

            {game && currentPuzzle && (
              <ChessboardFrame
                  boardOrientation={currentPuzzle.playerColor}
                  boardSize={boardWidth}
                  bezelSize={bezelSize}
                >
                  <Chessboard
                    key={boardKey}
                    options={{
                      position: game.fen(),
                      boardOrientation: currentPuzzle.playerColor,
                      squareStyles: getCustomSquareStyles(),
                      showNotation: false,
                      allowDrawingArrows: true,
                      clearArrowsOnClick: true,
                      arrows: engineEnabled && engineArrow ? [engineArrow] : undefined,
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
                      onSquareClick: ({ square }) => handleSquareClick({ square }),
                      onSquareRightClick: ({ square }) => handleSquareRightClick({ square }),
                      onSquareMouseDown: ({ square }, e) => {
                        if (e?.button === 2) {
                          lastRightClickModifiersRef.current = {
                            ctrl: !!e.ctrlKey || !!e.metaKey,
                            shift: !!e.shiftKey,
                            alt: !!e.altKey,
                          };
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

          {/* Mobile Only: Interactive Feedback Cards below board */}
          <div className="w-full flex md:hidden flex-col">
            {puzzleStatus === "failed" && (
              <div className="w-full mt-3 theme-surface border border-rose-500/40 rounded-2xl p-4 shadow-md animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wide mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{refutationInfo ? "Instant Learning: Refutation" : "Not the Best Move"}</span>
                </div>
                {refutationInfo && (
                  <p className="text-xs sm:text-sm theme-text-primary leading-relaxed mb-3">
                    {refutationInfo.coachExplanation}
                  </p>
                )}
                <button
                  onClick={retryCurrentPuzzle}
                  className="w-full py-2.5 px-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
              </div>
            )}

            {puzzleStatus === "solved" && currentPuzzle && (
              <div className="w-full mt-3 theme-surface border border-[var(--border-focus)] rounded-2xl p-4 shadow-md animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="flex items-center gap-2 text-[var(--accent-primary)] text-xs font-bold uppercase tracking-wide mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>
                    {isCurriculumActive
                      ? `Curriculum Step ${curriculumIndex + 1} of 5 Mastered!`
                      : "Rule Mastered!"}
                  </span>
                </div>
                <p className="text-xs sm:text-sm theme-text-primary leading-relaxed mb-3">
                  {currentPuzzle.successExplanation}
                </p>
                {isCurriculumActive ? (
                  curriculumIndex < 4 ? (
                    <button
                      onClick={handleAdvanceCurriculum}
                      className="group relative w-full py-2.5 px-3 rounded-xl theme-accent-btn font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-200 shadow-sm cursor-pointer animate-next-btn btn-shimmer-effect hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
                    >
                      <span className="relative z-10">Next Curriculum Puzzle ({curriculumIndex + 2}/5)</span>
                      <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1.5 transition-transform duration-200 ease-out animate-arrow-nudge" />
                    </button>
                  ) : (
                    <div className="space-y-2">
                      <div className="p-2.5 theme-pill rounded-xl text-center">
                        <span className="text-xs font-bold theme-text-primary block">
                          5/5 Curriculum Mastered!
                        </span>
                        <span className="text-[11px] theme-text-secondary">
                          Your leak ({coachDiagnosis?.leakName}) is now patched.
                        </span>
                      </div>
                      <button
                        onClick={() => setShowStudyModal(true)}
                        className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                      >
                        <BookOpen className="w-4 h-4" />
                        <span>🎓 Coach Study Mode (Review My 5 Puzzles)</span>
                      </button>
                      <button
                        onClick={continueToUnlimitedPractice}
                        className="group relative w-full py-2.5 px-3 rounded-xl theme-accent-btn font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-200 shadow-sm cursor-pointer animate-next-btn btn-shimmer-effect hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
                      >
                        <span className="relative z-10">Continue to Unlimited Practice</span>
                        <Zap className="w-4 h-4 fill-current relative z-10 group-hover:scale-110 transition-transform duration-200" />
                      </button>
                    </div>
                  )
                ) : (
                  <button
                    onClick={() => nextPuzzle()}
                    className="group relative w-full py-2.5 px-3 rounded-xl theme-accent-btn font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-200 shadow-sm cursor-pointer animate-next-btn btn-shimmer-effect hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
                  >
                    <span className="relative z-10">Next Puzzle</span>
                    <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1.5 transition-transform duration-200 ease-out animate-arrow-nudge" />
                  </button>
                )}
                {isCurriculumActive && (
                  <button
                    onClick={() => toggleEngine(game?.fen())}
                    className="w-full mt-2 py-2 px-3 rounded-xl border border-[var(--border-subtle)] hover:bg-[var(--surface-muted)] text-xs font-semibold theme-text-secondary flex items-center justify-center gap-1.5 transition cursor-pointer"
                  >
                    <Cpu className="w-3.5 h-3.5 text-emerald-500" />
                    <span>{engineEnabled ? "Hide Engine Analysis" : "Check Engine Analysis"}</span>
                  </button>
                )}
              </div>
            )}

            {/* Mobile Stockfish Engine Analysis Bar: only shown in practice or when explicitly requested */}
            {(!isCurriculumActive || engineEnabled) && (
              <div className="mt-3">
                <EngineAnalysisBar
                  isReady={isEngineReady}
                  isAnalyzing={isEngineAnalyzing}
                  engineEnabled={engineEnabled}
                  evaluation={engineEvaluation}
                  bestMove={engineBestMove}
                  bestLine={engineBestLine}
                  onToggleEngine={() => toggleEngine(game?.fen())}
                />
              </div>
            )}
          </div>

          {/* Desktop Only: Dedicated Chessboard Sidebar Console */}
          <div 
            className="hidden md:flex flex-col justify-between w-80 lg:w-96 shrink-0 theme-surface rounded-2xl p-4 shadow-xl border overflow-y-auto"
            style={{ height: boardWidth + bezelSize * 2 }}
          >
            {/* Top: HUD Stats & Track Switcher */}
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-2">
                  {isCurriculumActive ? (
                    <>
                      <div className="flex items-center gap-1.5 text-xs font-mono font-bold theme-pill px-2.5 py-1 rounded-lg">
                        <Target className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                        <span>Curriculum {curriculumIndex + 1}/5</span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[0, 1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={`h-2 rounded-full transition-all duration-300 ${
                              step < curriculumIndex
                                ? "w-3 bg-[var(--accent-primary)]"
                                : step === curriculumIndex
                                ? "w-5 bg-[var(--accent-primary)] animate-pulse"
                                : "w-1.5 theme-surface-subtle"
                            }`}
                            title={`Step ${step + 1}`}
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-1 text-xs font-mono font-bold theme-pill px-2.5 py-1 rounded-lg">
                        <Flame className="w-3.5 h-3.5 text-[var(--accent-primary)] fill-current" />
                        <span>{streak} Streak</span>
                      </div>
                      <span className="text-xs theme-text-muted font-mono">
                        {solvedCount} Solved
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Status Row (Turn & Hint) */}
              <div className="flex items-center justify-between mb-3 px-0.5 text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      game?.turn() === "w" ? "bg-[var(--accent-primary)] shadow-sm" : "theme-surface-subtle border-2 border-neutral-500"
                    }`}
                  />
                  <span className="font-extrabold text-xs sm:text-sm tracking-wider font-display uppercase theme-text-primary">{status}</span>
                </div>

                <div className="flex items-center gap-2">
                  {puzzleStatus === "solving" && (
                    <button
                      onClick={triggerHint}
                      className="flex items-center gap-1 text-[11px] theme-pill px-2 py-0.5 rounded-md transition cursor-pointer hover:opacity-80"
                    >
                      <HelpCircle className="w-3 h-3" />
                      <span>Hint</span>
                    </button>
                  )}
                  <span className="theme-text-muted font-mono text-[10px]">
                    Drag or Click
                  </span>
                </div>
              </div>

              {/* Coach Tip Reminder Banner */}
              {currentPuzzle && (
                <div className="theme-surface-subtle border rounded-xl p-3 mb-3 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 text-[var(--accent-primary)] font-bold text-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isCurriculumActive ? `Curriculum Step ${curriculumIndex + 1} of 5` : "Coach Instruction"}</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded theme-surface theme-text-muted border">
                      {currentPuzzle.ratingBadge}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold theme-text-primary mb-1 leading-snug">
                    {currentPuzzle.prompt.includes("to move:") ? (
                      <>
                        <strong className="font-extrabold font-display text-[var(--accent-primary)] uppercase tracking-wide mr-1.5">
                          {currentPuzzle.prompt.split("to move:")[0]}to move:
                        </strong>
                        <span>{currentPuzzle.prompt.split("to move:")[1]}</span>
                      </>
                    ) : (
                      currentPuzzle.prompt
                    )}
                  </p>
                  <p className="text-[11px] theme-text-secondary leading-relaxed flex items-center gap-1">
                    Rule: <TermHoverCard term={currentPuzzle.ruleTitle} showIcon />
                  </p>
                </div>
              )}
            </div>

            {/* Middle: Dynamic Learning Action Area */}
            <div className="flex-1 flex flex-col justify-center my-2">
              {puzzleStatus === "solving" && (
                <div className="theme-surface-subtle border rounded-xl p-3 text-center">
                  <span className="text-xs font-medium theme-text-primary block mb-1">
                    Your Turn
                  </span>
                  <p className="text-[11px] theme-text-muted leading-relaxed">
                    Find the best continuation. Drag pieces or tap squares to move.
                  </p>
                  <AnnotationPalette
                    className="mt-2.5 justify-center"
                    active={activeAnnotationColor}
                    onSelect={setActiveAnnotationColor}
                    onClear={clearAllAnnotations}
                    hasMarks={Object.keys(annotatedSquares).length > 0}
                  />
                </div>
              )}

              {puzzleStatus === "failed" && (
                <div className="w-full theme-surface-subtle border border-rose-500/40 rounded-xl p-3.5 shadow-md animate-in fade-in duration-200">
                  <div className="flex items-center gap-1.5 text-rose-500 text-xs font-bold uppercase tracking-wide mb-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{refutationInfo ? "Instant Refutation" : "Not the Best Move"}</span>
                  </div>
                  {refutationInfo && (
                    <p className="text-xs theme-text-primary leading-relaxed mb-3">
                      {refutationInfo.coachExplanation}
                    </p>
                  )}
                  <div className="space-y-2">
                    <button
                      onClick={retryCurrentPuzzle}
                      className="w-full py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Try Again</span>
                    </button>
                  </div>
                </div>
              )}

              {puzzleStatus === "solved" && currentPuzzle && (
                <div className="w-full theme-surface-subtle border border-[var(--border-focus)] rounded-xl p-3.5 shadow-md animate-in fade-in duration-200">
                  <div className="flex items-center gap-1.5 text-[var(--accent-primary)] text-xs font-bold uppercase tracking-wide mb-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {isCurriculumActive
                        ? `Curriculum Step ${curriculumIndex + 1} of 5 Mastered!`
                        : "Rule Mastered!"}
                    </span>
                  </div>
                  <p className="text-xs theme-text-primary leading-relaxed mb-3">
                    {currentPuzzle.successExplanation}
                  </p>

                  {/* Auto-Revealed Mini-Eval Bar with Top Engine Line */}
                  <div className="mb-3 p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-between text-xs font-mono animate-in fade-in duration-200">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="w-5 h-5 rounded-md bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                        <Cpu className="w-3 h-3" />
                      </div>
                      <span className="font-bold text-emerald-400 shrink-0">
                        {engineEvaluation?.displayScore
                          ? `Eval: ${engineEvaluation.displayScore}`
                          : engineEvaluation?.isMate
                          ? `Mate in ${Math.abs(engineEvaluation.mateIn || 0)}`
                          : "Eval: +Decisive"}
                      </span>
                      {engineBestLine && engineBestLine.length > 0 ? (
                        <span className="theme-text-secondary truncate max-w-[170px] sm:max-w-[270px]">
                          Top: {engineBestLine.slice(0, 4).join(" ")}
                        </span>
                      ) : (
                        <span className="theme-text-muted italic text-[11px]">
                          Stockfish calculating...
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/30 uppercase shrink-0">
                      WASM
                    </span>
                  </div>
                  {isCurriculumActive ? (
                    curriculumIndex < 4 ? (
                      <button
                        onClick={handleAdvanceCurriculum}
                        className="group relative w-full py-2.5 px-3 rounded-xl theme-accent-btn font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-200 shadow-sm cursor-pointer animate-next-btn btn-shimmer-effect hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
                      >
                        <span className="relative z-10">Next Curriculum Puzzle ({curriculumIndex + 2}/5)</span>
                        <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1.5 transition-transform duration-200 ease-out animate-arrow-nudge" />
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <div className="p-2.5 theme-pill rounded-xl text-center">
                          <span className="text-xs font-bold text-emerald-400 block">
                            🎉 5/5 Curriculum Mastered!
                          </span>
                          <span className="text-[11px] theme-text-secondary">
                            Target leak patched: <strong className="theme-text-primary">{coachDiagnosis?.leakName || "Tactical Precision"}</strong>
                          </span>
                        </div>

                        <button
                          onClick={() => setShowStudyModal(true)}
                          className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                        >
                          <BookOpen className="w-4 h-4" />
                          <span>🎓 Coach Study Mode (Review My 5 Puzzles)</span>
                        </button>

                        <button
                          onClick={continueToUnlimitedPractice}
                          className="group relative w-full py-2.5 px-3 rounded-xl theme-accent-btn font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-200 shadow-sm cursor-pointer animate-next-btn btn-shimmer-effect hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
                        >
                          <span className="relative z-10">Keep Practicing ({selectedLevel?.title})</span>
                          <Zap className="w-4 h-4 fill-current relative z-10 group-hover:scale-110 transition-transform duration-200" />
                        </button>

                        <div className="grid grid-cols-2 gap-1.5">
                          <Link
                            href="/diagnose"
                            className="py-2 px-2.5 rounded-lg theme-surface hover:theme-surface-subtle border text-[11px] font-bold theme-text-primary flex items-center justify-center gap-1 transition text-center"
                          >
                            <Sparkles className="w-3 h-3 text-[var(--accent-primary)]" />
                            <span>Retake Test</span>
                          </Link>

                          <button
                            onClick={() => {
                              if (!lichessUser && !(typeof window !== 'undefined' && localStorage.getItem('chessz_last_username'))) {
                                setShowLichessModal(true);
                              } else {
                                setShowWeaknessDashboard(true);
                              }
                            }}
                            className="py-2 px-2.5 rounded-lg theme-surface hover:theme-surface-subtle border text-[11px] font-bold theme-text-primary flex items-center justify-center gap-1 transition cursor-pointer"
                          >
                            <Target className="w-3 h-3 text-rose-400" />
                            <span>My Blunders</span>
                          </button>
                        </div>

                        <button
                          onClick={handleShareDiagnosis}
                          className="w-full py-1.5 px-3 rounded-lg theme-surface hover:theme-surface-subtle border text-[11px] font-medium theme-text-secondary flex items-center justify-center gap-1.5 transition cursor-pointer"
                        >
                          <Share2 className="w-3 h-3 text-[var(--accent-primary)]" />
                          <span>{shareCopied ? "Copied to Clipboard!" : "Share Training Report"}</span>
                        </button>
                      </div>
                    )
                  ) : (
                    <button
                      onClick={() => nextPuzzle()}
                      className="group relative w-full py-2.5 px-3 rounded-xl theme-accent-btn font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all duration-200 shadow-sm cursor-pointer animate-next-btn btn-shimmer-effect hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98]"
                    >
                      <span className="relative z-10">Next Puzzle</span>
                      <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1.5 transition-transform duration-200 ease-out animate-arrow-nudge" />
                    </button>
                  )}
                  {isCurriculumActive && (
                    <button
                      onClick={() => toggleEngine(game?.fen())}
                      className="w-full mt-2 py-1.5 px-3 rounded-lg border border-[var(--border-subtle)] hover:bg-[var(--surface-muted)] text-[11px] font-semibold theme-text-secondary flex items-center justify-center gap-1.5 transition cursor-pointer"
                    >
                      <Cpu className="w-3.5 h-3.5 text-emerald-500" />
                      <span>{engineEnabled ? "Hide Engine Analysis" : "Check Engine Analysis"}</span>
                    </button>
                  )}
                </div>
              )}

              {/* Desktop Stockfish Engine Analysis Bar: only shown in practice or when explicitly requested */}
              {(!isCurriculumActive || engineEnabled) && (
                <div className="mt-3">
                  <EngineAnalysisBar
                    isReady={isEngineReady}
                    isAnalyzing={isEngineAnalyzing}
                    engineEnabled={engineEnabled}
                    evaluation={engineEvaluation}
                    bestMove={engineBestMove}
                    bestLine={engineBestLine}
                    onToggleEngine={() => toggleEngine(game?.fen())}
                  />
                </div>
              )}
            </div>

            {/* Bottom: Console Quick Controls */}
            <div className="pt-2.5 border-t border-[var(--border-subtle)] flex items-center justify-between text-xs">
              <button
                onClick={retryCurrentPuzzle}
                className="flex items-center gap-1 text-[11px] theme-text-muted hover:theme-text-primary transition cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Position</span>
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Save Progress Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm theme-surface border rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowSaveModal(false)}
              className="absolute top-4 right-4 p-1.5 theme-text-muted hover:theme-text-primary rounded-lg theme-surface-subtle cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 theme-pill px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 w-fit">
              <Flame className="w-4 h-4 fill-current" />
              <span>Streak Milestone</span>
            </div>

            <h3 className="text-lg font-bold theme-text-primary mb-2">
              Save Your Streak ({streak} Solved)
            </h3>
            <p className="text-xs theme-text-secondary leading-relaxed mb-4">
              Enter your email to sync your Coach Diagnosis, rating progress, and solved puzzles across all your devices.
            </p>

            <form onSubmit={handleSaveProgressSubmit} className="space-y-3">
              <div className="relative">
                <Mail className="w-4 h-4 theme-text-muted absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full theme-surface-subtle border rounded-xl pl-10 pr-4 py-2.5 text-xs theme-text-primary placeholder:theme-text-muted focus:outline-none focus:border-[var(--border-focus)] transition"
                  required
                />
              </div>

              {authStatusMessage && (
                <div className="text-xs theme-pill p-2 rounded-lg text-center font-medium">
                  {authStatusMessage}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl theme-accent-btn font-bold text-xs tracking-wide transition cursor-pointer shadow-sm"
              >
                Save Progress
              </button>

              <button
                type="button"
                onClick={() => setShowSaveModal(false)}
                className="w-full text-center text-xs theme-text-muted hover:theme-text-primary transition pt-1 cursor-pointer"
              >
                Keep playing as guest
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Credits & Open Source Modal (License Compliance) */}
      {showCreditsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm theme-surface border rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowCreditsModal(false)}
              className="absolute top-4 right-4 p-1.5 theme-text-muted hover:theme-text-primary rounded-lg theme-surface-subtle cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 theme-pill px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-2 w-fit">
              <BookOpen className="w-4 h-4" />
              <span>Open Source & Credits</span>
            </div>

            <h3 className="text-base font-bold theme-text-primary mb-2">
              Credits & Acknowledgements
            </h3>
            <div className="text-xs theme-text-secondary space-y-2.5 leading-relaxed max-h-64 overflow-y-auto pr-1">
              <p>
                <strong className="theme-text-primary">Stockfish Chess Engine:</strong> Powered by{" "}
                <span className="font-mono text-[var(--accent-primary)]">Stockfish.js</span> (GNU GPLv3, the Stockfish developers). Complete source code is available at{" "}
                <a
                  href="https://github.com/niklasf/stockfish.js"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:theme-text-primary"
                >
                  github.com/niklasf/stockfish.js
                </a>{" "}
                and upstream at{" "}
                <a
                  href="https://stockfishchess.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:theme-text-primary"
                >
                  stockfishchess.org
                </a>.
              </p>
              <p>
                <strong className="theme-text-primary">Lichess Puzzle Database:</strong> Puzzles courtesy of{" "}
                <span className="font-mono text-[var(--accent-primary)]">Lichess.org</span> under the{" "}
                <span className="theme-text-primary">Creative Commons CC0</span> license.
              </p>
              <p>
                <strong className="theme-text-primary">Piece Artwork:</strong> Staunton chess vectors by Colin M.L. Burnett (cburnett, CC BY-SA 3.0 / GPL) and Lichess.org contributors (AGPLv3).
              </p>
              <p>
                <strong className="theme-text-primary">Typography:</strong> Google Fonts (Inter, JetBrains Mono, Space Grotesk) licensed under the SIL Open Font License (OFL).
              </p>
              <p>
                <strong className="theme-text-primary">Open-Source Libraries:</strong> Built with{" "}
                <span className="font-mono theme-text-primary">chess.js</span> (MIT, Jeff Hlywa) and{" "}
                <span className="font-mono theme-text-primary">react-chessboard</span> (MIT, Clariity).
              </p>
              <p>
                <strong className="theme-text-primary">Coaching Pedagogy:</strong> Diagnostic framework and Golden Rules designed in consultation with chess academy coaches.
              </p>
            </div>

            <button
              onClick={() => setShowCreditsModal(false)}
              className="w-full mt-4 py-2 rounded-xl theme-accent-btn font-medium text-xs transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full max-w-md md:max-w-5xl lg:max-w-6xl mx-auto py-2 text-xs theme-text-muted border-t border-[var(--border-subtle)] mt-2 shrink-0 flex items-center justify-end px-2">
        <button
          onClick={() => setShowCreditsModal(true)}
          className="text-[11px] theme-text-muted hover:theme-text-primary underline underline-offset-2 cursor-pointer transition"
        >
          Credits & License
        </button>
      </footer>

      {/* Settings & Theme Studio Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />

      {/* Lichess Account & Sync Modal */}
      <LichessModal
        isOpen={showLichessModal}
        onClose={() => setShowLichessModal(false)}
        user={lichessUser}
        isAuthenticated={isLichessAuthenticated}
        loading={isLichessLoading}
        onLogin={() => loginLichess()}
        onLogout={logoutLichess}
        onRefresh={refreshLichess}
        onConnectUsername={connectLichessUsername}
        diagnosedElo={isCalibrated ? calibratedRating : null}
        onOpenWeaknessDashboard={() => setShowWeaknessDashboard(true)}
      />

      {/* 5-Category Weakness Studio Dashboard */}
      <WeaknessDashboard
        isOpen={showWeaknessDashboard}
        onClose={() => setShowWeaknessDashboard(false)}
        user={lichessUser}
        onStartTraining={handleStartBlunderTraining}
      />

      {/* Interactive Coach Study Mode Modal */}
      <CoachStudyModal
        isOpen={showStudyModal}
        onClose={() => setShowStudyModal(false)}
        title="Curriculum Tactical Review"
        subtitle={`Step-by-step master breakdown of your 5 calibrated curriculum positions for ${coachDiagnosis?.leakName || "Tactical Precision"}.`}
        items={curriculumStudyItems}
      />
    </main>
  );
}
