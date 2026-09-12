"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Chess } from "chess.js";
import { Chessboard, defaultArrowOptions } from "react-chessboard";
import { ChessboardFrame } from "@/components/ChessboardFrame";
import {
  Zap,
  RotateCcw,
  Award,
  ChevronRight,
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
  Settings
} from "lucide-react";
import {
  DIAGNOSTIC_PUZZLES,
  CONTINUOUS_PUZZLES,
  ALL_PUZZLES_MAP,
  getCuratedDiagnosisPlaylist,
  ChessPuzzle,
  RefutationMove,
  LevelType
} from "@/lib/puzzles";
import { sounds } from "@/lib/sounds";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { THEME_BOARD_COLORS, ThemePalette, ThemeMode } from "@/components/ThemeSwitcher";
import { SettingsModal } from "@/components/SettingsModal";
import { AnimatedCaptureHand } from "@/components/AnimatedCaptureHand";
import { getPieceSet, PieceSetStyle } from "@/components/pieces/PieceSets2D";
import { useLichess } from "@/lib/useLichess";
import { LichessModal, LichessIcon } from "@/components/LichessModal";
import { useStockfish } from "@/lib/useStockfish";
import { EngineAnalysisBar } from "@/components/EngineAnalysisBar";

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

interface DiagnosticOption {
  label: string;
  score: number;
}

interface DiagnosticQuestion {
  category: string;
  weight: number;
  question: string;
  options: DiagnosticOption[];
}

const DIAGNOSTIC_QUESTIONS: DiagnosticQuestion[] = [
  {
    category: "Vision & Calculation (Weight: 30%)",
    weight: 0.30,
    question: "When it's your turn, what is the first thing you look for?",
    options: [
      { label: "I just react to whatever my opponent attacked.", score: 500 },
      { label: "I check which pieces are defended and which are free to take.", score: 900 },
      { label: "I ask: 'What is my opponent planning next?'", score: 1300 },
      { label: "I calculate 3 to 4 moves ahead before touching a piece.", score: 1700 },
    ],
  },
  {
    category: "Blunder Defense (Weight: 30%)",
    weight: 0.30,
    question: "What is the most common way you lose games?",
    options: [
      { label: "I leave a piece completely unprotected and lose it for free.", score: 500 },
      { label: "I get caught in forks, pins, or surprise checkmates.", score: 900 },
      { label: "I get a winning position, but make a mistake in the endgame.", score: 1300 },
      { label: "I slowly run out of good moves and get outplayed.", score: 1700 },
    ],
  },
  {
    category: "Strategy & Planning (Weight: 20%)",
    weight: 0.20,
    question: "When there are no direct captures on the board, what do you do?",
    options: [
      { label: "I feel stuck and don't know what to move.", score: 500 },
      { label: "I try to trade pieces or push pawns forward.", score: 900 },
      { label: "I move my worst piece to a better square.", score: 1300 },
      { label: "I find a weak square in my opponent's camp and build an attack.", score: 1700 },
    ],
  },
  {
    category: "Pressure & Composure (Weight: 20%)",
    weight: 0.20,
    question: "When the clock is running low or the game gets tense, what happens?",
    options: [
      { label: "I panic and make fast moves without looking.", score: 500 },
      { label: "I defend, but usually miss opponent tricks.", score: 900 },
      { label: "I stay calm and stick to solid basics.", score: 1300 },
      { label: "I play even faster and find precise tactical shots.", score: 1700 },
    ],
  },
];

const ARCHETYPE_TITLES: string[][] = [
  // q0 = 0 (Reactive / 1-move horizon)
  [
    "The Instinctive Scrapper",          // q3 = 0
    "The Reactive Defender",             // q3 = 1
    "The Resilient Fighter",             // q3 = 2
    "The High-Octane Blitz Attacker",    // q3 = 3
  ],
  // q0 = 1 (Piece Protection & Material Radar)
  [
    "The Eager Opportunist",             // q3 = 0
    "The Cautious Defender",             // q3 = 1
    "The Disciplined Competitor",        // q3 = 2
    "The Sharp Tactical Poacher",        // q3 = 3
  ],
  // q0 = 2 (Intent & Prophylaxis reader)
  [
    "The Ambitious Strategist",          // q3 = 0
    "The Measured Counter-Puncher",      // q3 = 1
    "The Methodical Positionalist",      // q3 = 2
    "The Prophylactic Striker",          // q3 = 3
  ],
  // q0 = 3 (3-4 moves deep calculator)
  [
    "The Deep-Thinker in Time Trouble",  // q3 = 0
    "The Analytical Perfectionist",      // q3 = 1
    "The Cold-Blooded Calculator",       // q3 = 2
    "The Master Blitz Prodigy",          // q3 = 3
  ],
];

const VISION_NARRATIVES: string[] = [
  "You play with fast instinctive reflexes, scanning the board one move at a time.",
  "You possess strong piece-protection radar and consistently monitor friendly and enemy piece safety.",
  "You read the board through intent, actively deducing what your opponent plans before choosing your candidate moves.",
  "You calculate deep multi-ply candidate variations before touching a piece with grandmaster-like discipline.",
];

const LEAK_DEFINITIONS = [
  {
    name: "Free-Piece Blindspot",
    ruleTitle: "The 2-Second Bodyguard Rule",
    ruleBody: "Before touching any piece, take 2 seconds to check: 'Does every one of my pieces have an active teammate protecting it?' Never donate free points.",
    leakDetail: "Leaving friendly pieces unguarded in open skirmishes when focusing on your own attack.",
    focus: "Piece Protection & Hanging Pieces",
    starterPuzzleId: "beginner_1a",
  },
  {
    name: "Same-Color Fork Radar Leak",
    ruleTitle: "The Geometric Radar Rule",
    ruleBody: "Knights can only fork pieces on the EXACT same square color. Always notice when your King and heavy pieces share square colors.",
    leakDetail: "Falling victim to surprise knight forks, bishop pins, and tactical batteries.",
    focus: "Forks, Pins & Double Attacks",
    starterPuzzleId: "adv_beginner_2a",
  },
  {
    name: "Endgame Conversion Gap",
    ruleTitle: "King Activity & Passed Pawn Priority",
    ruleBody: "In the endgame, passive kings lose games. Activate your King toward the center aggressively and march passed pawns immediately.",
    leakDetail: "Outplaying opponents in the middlegame, then letting winning advantages slip in the endgame.",
    focus: "Endgame Technique & Passed Pawns",
    starterPuzzleId: "intermediate_3a",
  },
  {
    name: "Positional Stagnation",
    ruleTitle: "Steinitz's Worst-Placed Piece Principle",
    ruleBody: "When tactics fade, locate your least active piece, reposition it with tempo, and systematically restrict your opponent's counterplay.",
    leakDetail: "Running out of constructive plans when no direct captures exist, allowing opponents to squeeze you.",
    focus: "Piece Harmony & Prophylaxis",
    starterPuzzleId: "advanced_4a",
  },
];

const STRATEGY_ANTIDOTES: string[] = [
  "Antidote: Break frozen positions by systematically listing candidate moves (Checks, Captures, Threats).",
  "Antidote: Stop making cosmetic trades. Maintain tension until an exchange opens a file or creates a passed pawn.",
  "Antidote: Reroute your least active piece to a dominant central outpost before seeking an attack.",
  "Antidote: Focus multi-piece pressure onto your opponent's weakest square or pawn until their structure cracks.",
];

const COMPOSURE_TIPS: string[] = [
  "Composure Directive: Breathe and take a mandatory 3-second pause before moving when your clock drops.",
  "Composure Directive: In time trouble, prioritize King safety and simple solid defenses over wild complications.",
  "Composure Directive: Your steady composure under tension is an elite superpower. Keep trusting your fundamentals.",
  "Composure Directive: Channel your rapid speed into forcing tactical knockout strikes.",
];

function calculateDiagnosticResult(answers: number[]) {
  let weightedScore = 0;
  for (let i = 0; i < DIAGNOSTIC_QUESTIONS.length; i++) {
    const optIdx = answers[i] ?? 0;
    const score = DIAGNOSTIC_QUESTIONS[i].options[optIdx].score;
    weightedScore += score * DIAGNOSTIC_QUESTIONS[i].weight;
  }
  const calibratedRating = Math.round(weightedScore);

  let targetTierId: LevelType = "beginner";
  if (calibratedRating < 750) {
    targetTierId = "beginner";
  } else if (calibratedRating < 1150) {
    targetTierId = "adv_beginner";
  } else if (calibratedRating < 1550) {
    targetTierId = "intermediate";
  } else {
    targetTierId = "advanced";
  }

  const targetLevel = LEVEL_OPTIONS.find((l) => l.id === targetTierId) || LEVEL_OPTIONS[0];

  const q0Ans = Math.min(Math.max(answers[0] ?? 0, 0), 3);
  const q1Ans = Math.min(Math.max(answers[1] ?? 0, 0), 3);
  const q2Ans = Math.min(Math.max(answers[2] ?? 0, 0), 3);
  const q3Ans = Math.min(Math.max(answers[3] ?? 0, 0), 3);

  const archetypeTitle = ARCHETYPE_TITLES[q0Ans][q3Ans];
  const visionDesc = VISION_NARRATIVES[q0Ans];
  const cleanVision = visionDesc.charAt(0).toLowerCase() + visionDesc.slice(1);
  const leak = LEAK_DEFINITIONS[q1Ans];
  const antidote = STRATEGY_ANTIDOTES[q2Ans];
  const composure = COMPOSURE_TIPS[q3Ans];

  const headline = `Diagnosed: ${archetypeTitle} — ${leak.name}`;
  const personalizedSummary = `As ${archetypeTitle}, ${cleanVision} However, your ${leak.name} holds your rating back because you are ${leak.leakDetail.toLowerCase()} ${antidote} ${composure}`;

  const curatedPlaylist = getCuratedDiagnosisPlaylist(calibratedRating, [q0Ans, q1Ans, q2Ans, q3Ans]);

  const diagnosis: CoachDiagnosis = {
    archetypeTitle,
    headline,
    ruleTitle: leak.ruleTitle,
    ruleBody: leak.ruleBody,
    targetFocus: leak.focus,
    leakName: leak.name,
    leakDetail: leak.leakDetail,
    strategicAntidote: antidote,
    composureTip: composure,
    personalizedSummary,
    curatedPlaylist,
    starterPuzzleId: curatedPlaylist[0]?.id || leak.starterPuzzleId,
  };

  return { calibratedRating, targetLevel, diagnosis };
}

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

  const [selectedLevel, setSelectedLevel] = useState<LevelOption | null>(null);
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [analyzingPhase, setAnalyzingPhase] = useState<number>(0);
  const [calibratedRating, setCalibratedRating] = useState<number>(900);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [calibrationAnswers, setCalibrationAnswers] = useState<number[]>([]);
  const [coachDiagnosis, setCoachDiagnosis] = useState<CoachDiagnosis | null>(null);
  const [showDiagnosisModal, setShowDiagnosisModal] = useState<boolean>(false);
  const [isCalibrated, setIsCalibrated] = useState<boolean>(false);

  // 5-Puzzle Diagnostic Curriculum State
  const [diagnosisPlaylist, setDiagnosisPlaylist] = useState<ChessPuzzle[]>([]);
  const [curriculumIndex, setCurriculumIndex] = useState<number>(0);
  const [isCurriculumActive, setIsCurriculumActive] = useState<boolean>(false);
  const [curriculumCompleted, setCurriculumCompleted] = useState<boolean>(false);

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

  // Piece Selection & Marking State
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<LegalMoveTarget[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [hintSquare, setHintSquare] = useState<string | null>(null);
  const [annotatedSquares, setAnnotatedSquares] = useState<
    Record<string, { bg: string; border: string; type: "green" | "red" | "cyan" | "yellow" }>
  >({});
  const [activeAnnotationColor, setActiveAnnotationColor] = useState<"green" | "red" | "cyan" | "yellow" | null>(null);
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
  const [themePalette, setThemePalette] = useState<ThemePalette>("periwinkle");
  const [themeMode, setThemeMode] = useState<ThemeMode>("light");
  const [pieceSet, setPieceSet] = useState<PieceSetStyle>("liquid-chrome");
  const [captureHandEnabled, setCaptureHandEnabled] = useState<boolean>(true);
  const [captureHandTarget, setCaptureHandTarget] = useState<{ square: string; key: number } | null>(null);

  const triggerCaptureHand = (square: string) => {
    if (!captureHandEnabled) return;
    setCaptureHandTarget({ square, key: Date.now() });
  };

  useEffect(() => {
    try {
      const savedTheme = (localStorage.getItem("chessz_theme") as ThemePalette) || "periwinkle";
      const savedMode = (localStorage.getItem("chessz_mode") as ThemeMode) || "light";
      const savedPiece = (localStorage.getItem("chessz_piece_set") as PieceSetStyle) || "liquid-chrome";
      const savedCapture = localStorage.getItem("chessz_capture_hand");

      setThemePalette(savedTheme);
      setThemeMode(savedMode);
      setPieceSet(savedPiece);
      if (savedCapture !== null) {
        setCaptureHandEnabled(JSON.parse(savedCapture));
      }
    } catch {}

    const handleThemeEvent = (e: Event) => {
      const customEvt = e as CustomEvent<{ theme: ThemePalette; mode: ThemeMode }>;
      if (customEvt.detail) {
        if (customEvt.detail.theme) setThemePalette(customEvt.detail.theme);
        if (customEvt.detail.mode) setThemeMode(customEvt.detail.mode);
      }
    };

    const handleSettingsEvent = (e: Event) => {
      const customEvt = e as CustomEvent<{
        theme?: ThemePalette;
        mode?: ThemeMode;
        pieceSet?: PieceSetStyle;
        wallpaper?: boolean;
        captureHand?: boolean;
      }>;
      if (customEvt.detail) {
        if (customEvt.detail.theme) setThemePalette(customEvt.detail.theme);
        if (customEvt.detail.mode) setThemeMode(customEvt.detail.mode);
        if (customEvt.detail.pieceSet) setPieceSet(customEvt.detail.pieceSet);
        if (customEvt.detail.captureHand !== undefined) setCaptureHandEnabled(customEvt.detail.captureHand);
      }
    };

    window.addEventListener("chessz-theme-changed", handleThemeEvent);
    window.addEventListener("chessz-settings-changed", handleSettingsEvent);
    return () => {
      window.removeEventListener("chessz-theme-changed", handleThemeEvent);
      window.removeEventListener("chessz-settings-changed", handleSettingsEvent);
    };
  }, []);

  // Synchronize Stockfish analysis with current board position when enabled
  useEffect(() => {
    if (engineEnabled && game) {
      startAnalysis(game.fen());
    }
  }, [game, engineEnabled, startAnalysis]);

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
        if (width < 440) {
          // Keep playable board + outer bezel within mobile screen
          setBoardWidth(Math.floor(width - 24 - totalBezelMargin));
        } else {
          setBoardWidth(360);
        }
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

  // Start 4-Question Mathematical Diagnostic Quiz
  const startDiagnosticQuiz = () => {
    setIsQuizActive(true);
    setIsAnalyzing(false);
    setCurrentQuestionIndex(0);
    setCalibrationAnswers([]);
    setCoachDiagnosis(null);
    setShowDiagnosisModal(false);
    setIsCalibrated(false);
    setSelectedLevel(null);
    setIsCurriculumActive(false);
    setCurriculumIndex(0);
    setCurriculumCompleted(false);
    setDiagnosisPlaylist([]);
  };

  // Direct Tier Selection (Skip Diagnostic)
  const handleDirectTierSelect = (level: LevelOption) => {
    setSelectedLevel(level);
    setCalibratedRating(level.approxRating);
    setIsQuizActive(false);
    setIsAnalyzing(false);
    setShowDiagnosisModal(false);
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
    setIsQuizActive(false);
    setIsAnalyzing(false);
    setShowDiagnosisModal(false);
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
    setIsQuizActive(false);
    setIsAnalyzing(false);
    setShowDiagnosisModal(false);
    setShowLichessModal(false);
    setIsCalibrated(true);
    setIsCurriculumActive(false);
    loadPuzzle(puzzle);
    setEngineEnabled(true);
  };

  // Answer a Question in the 4-Question Quiz
  const handleAnswerDiagnosticQuestion = (optionIndex: number) => {
    const nextAnswers = [...calibrationAnswers, optionIndex];
    setCalibrationAnswers(nextAnswers);

    if (currentQuestionIndex + 1 < DIAGNOSTIC_QUESTIONS.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // 1. Run Pure Math Diagnostic Algorithm & Playlist Curation!
      const result = calculateDiagnosticResult(nextAnswers);
      setSelectedLevel(result.targetLevel);
      setCalibratedRating(result.calibratedRating);
      setCoachDiagnosis(result.diagnosis);
      setDiagnosisPlaylist(result.diagnosis.curatedPlaylist);
      setCurriculumIndex(0);
      setCurriculumCompleted(false);

      // 2. Instant Transition to Personalized Diagnostic Dossier (0 artificial delay)
      setIsQuizActive(false);
      setIsAnalyzing(false);
      setShowDiagnosisModal(true);
      sounds.playVictory();
    }
  };

  // Start 5-Puzzle Targeted Curriculum from Diagnosis Card
  const startDiagnosedCurriculum = () => {
    if (!selectedLevel || !coachDiagnosis) return;
    const playlist = coachDiagnosis.curatedPlaylist && coachDiagnosis.curatedPlaylist.length > 0
      ? coachDiagnosis.curatedPlaylist
      : diagnosisPlaylist;
    setShowDiagnosisModal(false);
    setIsCalibrated(true);
    setIsCurriculumActive(true);
    setCurriculumIndex(0);
    setCurriculumCompleted(false);
    const firstPz = playlist[0] || DIAGNOSTIC_PUZZLES[coachDiagnosis.starterPuzzleId] || DIAGNOSTIC_PUZZLES["beginner_1a"];
    loadPuzzle(firstPz);
  };

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
  };

  const clearAllAnnotations = () => {
    setAnnotatedSquares({});
    setBoardKey((prev) => prev + 1);
  };

  // Shared move executor for Drag-and-Drop and Tap-to-Move
  const handleMoveAttempt = (sourceSquare: string, targetSquare: string): boolean => {
    if (!game || !currentPuzzle || puzzleStatus !== "solving") return false;

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
        : "q";

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

    // Play sound based on move type
    if (moveResult.captured) {
      sounds.playCapture();
      triggerCaptureHand(targetSquare);
    } else {
      sounds.playMove();
    }

    setLastMove({ from: sourceSquare, to: targetSquare });

    // 2. Check winning solution move
    const isCorrect = sourceSquare === targetSolution.from && targetSquare === targetSolution.to;

    if (isCorrect) {
      setGame(testChess);
      setPuzzleStatus("solved");
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setSolvedCount((prev) => prev + 1);
      setStatus("Tactical Win! Rule Mastered 🎉");

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
      try {
        const refutingChess = new Chess(testChess.fen());
        const ref = currentPuzzle.defaultRefutation;
        const refResult = refutingChess.move({
          from: ref.from,
          to: ref.to,
          promotion: ref.promotion || "q",
        });
        if (refResult) {
          setGame(refutingChess);
          setLastMove({ from: ref.from, to: ref.to });
          if (refResult.captured) {
            sounds.playCapture();
            triggerCaptureHand(ref.to);
          } else {
            sounds.playRefutation();
          }
        }
      } catch {}
      setRefutationInfo(currentPuzzle.defaultRefutation);
      setPuzzleStatus("failed");
      setStreak(0);
      setStatus("Refuted by opponent!");
      refutationTimeoutRef.current = null;
    }, 650);

    return true;
  };

  // Tap-to-move square click handler
  const handleSquareClick = ({ square }: { square: string }) => {
    if (!game || !currentPuzzle || puzzleStatus !== "solving") return;

    // 0. If mobile touch annotation color is active, mark the square directly
    if (activeAnnotationColor) {
      const palette = {
        green: { bg: "rgba(16, 185, 129, 0.40)", border: "#10b981" },
        red: { bg: "rgba(239, 68, 68, 0.40)", border: "#ef4444" },
        cyan: { bg: "rgba(2, 132, 199, 0.40)", border: "#0284c7" },
        yellow: { bg: "rgba(245, 158, 11, 0.42)", border: "#f59e0b" },
      }[activeAnnotationColor];

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
        handleMoveAttempt(selectedSquare, square);
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

    let colorType: "green" | "red" | "cyan" | "yellow" = "green";
    let bg = "rgba(16, 185, 129, 0.40)";
    let border = "#10b981";

    if (isAlt) {
      colorType = "yellow";
      bg = "rgba(245, 158, 11, 0.42)";
      border = "#f59e0b";
    } else if (isShift) {
      colorType = "cyan";
      bg = "rgba(2, 132, 199, 0.40)";
      border = "#0284c7";
    } else if (isCtrl) {
      colorType = "red";
      bg = "rgba(239, 68, 68, 0.40)";
      border = "#ef4444";
    }

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
    const keyPieceSquare = currentPuzzle.solutionMoves[0].from;
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
    setIsQuizActive(false);
    setIsAnalyzing(false);
    setAnalyzingPhase(0);
    setIsCalibrated(false);
    setIsCurriculumActive(false);
    setCurriculumIndex(0);
    setCurriculumCompleted(false);
    setDiagnosisPlaylist([]);
    setCurrentQuestionIndex(0);
    setCalibrationAnswers([]);
    setCoachDiagnosis(null);
    setShowDiagnosisModal(false);
    setGame(null);
    setCurrentPuzzle(null);
    setPuzzleStatus("solving");
    setRefutationInfo(null);
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
    setHintSquare(null);
    setAnnotatedSquares({});
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
    const shareText = `♟️ My ChessZ FIDE Coach Diagnosis:\nRating Tier: ${selectedLevel.title}\n${coachDiagnosis.headline}\nGolden Rule: ${coachDiagnosis.ruleTitle} — "${coachDiagnosis.ruleBody}"\nFocus Area: ${coachDiagnosis.targetFocus}\n\n100% Free Chess Training • No ₹1,500/yr Paywall\nTrain now: https://chessz.vercel.app`;

    let shared = false;
    if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
      try {
        await navigator.share({
          title: "ChessZ FIDE Coach Diagnosis",
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
          <div className="w-7 h-7 rounded-xl overflow-hidden shrink-0 border border-[var(--border-subtle)] shadow-xs bg-[#0b0f17] flex items-center justify-center">
            <Image
              src="/logo-icon.png"
              alt="ChessZ Logo"
              width={28}
              height={28}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <span className="font-extrabold text-sm sm:text-base tracking-tight theme-text-primary font-display">
            ChessZ
          </span>
          <div className="hidden sm:flex items-center gap-1.5 ml-2 px-2.5 py-0.5 rounded-full text-[11px] font-medium theme-pill">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-primary)] animate-pulse" />
            <span>Coach-Verified Tactics • Free Forever</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Lichess Account / Sync Button */}
          <button
            onClick={() => setShowLichessModal(true)}
            className={`flex items-center gap-1.5 text-[11px] font-mono font-semibold px-2.5 py-1.5 rounded-xl cursor-pointer transition border ${
              lichessUser
                ? "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/15"
                : "theme-surface theme-surface-hover"
            }`}
            title={lichessUser ? `Lichess: @${lichessUser.username}` : "Connect Lichess Account"}
            aria-label="Lichess account connection"
          >
            <LichessIcon className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">
              {lichessUser ? lichessUser.username : "Connect Lichess"}
            </span>
            {lichessUser?.perfs?.rapid?.rating && (
              <span className="hidden md:inline px-1 py-0.2 rounded bg-amber-500/20 text-[10px] text-amber-300 font-bold">
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

      {/* Screen 1: Tier Selection & Diagnostic Entry */}
      {!selectedLevel && !isQuizActive && !showDiagnosisModal ? (
        <section className="flex-1 flex flex-col items-center justify-start max-w-md md:max-w-4xl mx-auto w-full pt-1 pb-6 md:pb-8">
          {/* Lichess Connected Banner (if logged in) */}
          {lichessUser && (
            <button
              onClick={() => setShowLichessModal(true)}
              className="inline-flex items-center gap-2 text-xs font-mono px-3.5 py-1.5 rounded-full mb-3 border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/15 transition cursor-pointer text-amber-300 shadow-xs"
            >
              <LichessIcon className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Connected as <strong className="text-white font-bold">@{lichessUser.username}</strong>
                {lichessUser.perfs?.rapid?.rating ? ` • Rapid ${lichessUser.perfs.rapid.rating}` : ""}
              </span>
              <span className="text-[10px] uppercase font-sans font-semibold underline underline-offset-2 ml-0.5 opacity-80">
                View Profile
              </span>
            </button>
          )}

          {/* Category Eyebrow */}
          <div className="inline-flex items-center gap-2 text-[11px] font-mono tracking-wide theme-pill px-3 py-1 rounded-full mb-3 shadow-xs">
            <Award className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
            <span>Coach-Verified Training • Find Your True Level</span>
          </div>

          {/* Grandmaster Authority Headline */}
          <div className="relative text-center mb-5 max-w-2xl mx-auto">
            {/* Soft Ambient Hero Glow */}
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-96 h-32 bg-[var(--accent-primary)]/10 rounded-full blur-3xl pointer-events-none -z-10" />
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[40px] font-extrabold tracking-tight theme-text-primary leading-[1.18] mb-2 font-display">
              Master Your Calculation. <br className="hidden sm:inline" />
              <span className="text-[var(--accent-primary)]">Eliminate Your Blindspots.</span>
            </h1>
            <p className="theme-text-secondary text-xs sm:text-sm max-w-lg mx-auto leading-relaxed">
              Test your tactical vision, discover the hidden mistakes holding you back, and train with positions calibrated to your real skill level.
            </p>
          </div>

          {/* Action 1: The Level Diagnosis Benchmark Bento Hero Card */}
          <div className="w-full max-w-3xl mb-3">
            <div className="relative rounded-2xl p-4 sm:p-5 theme-surface theme-surface-hover shadow-md overflow-hidden group border border-[var(--border-subtle)] hover:border-[var(--border-focus)] transition-all">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 relative z-10">
                <div className="flex items-start gap-3.5">
                  <div className="w-11 h-11 rounded-2xl bg-linear-to-br from-[var(--accent-subtle)] to-[var(--surface-muted)] border border-[var(--border-focus)] flex items-center justify-center shrink-0 shadow-sm text-[var(--accent-primary)]">
                    <Sparkles className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full theme-pill text-[10px] font-mono font-bold uppercase tracking-wider mb-1.5">
                      <span>3-Puzzle Quick Test</span>
                      <span>•</span>
                      <span>~2.5 Minutes</span>
                    </div>
                    <h3 className="text-base sm:text-lg font-extrabold theme-text-primary tracking-tight">
                      Test Your Real Chess Level
                    </h3>
                    <p className="text-xs theme-text-secondary mt-0.5 max-w-lg leading-relaxed">
                      Play 3 test positions to see how fast you calculate, check your confidence on critical moves, and find your real rating.
                    </p>

                    {/* Telemetry Micro-Pills */}
                    <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md theme-surface-subtle border text-sky-400 font-semibold flex items-center gap-1">
                        ⚡ Thinking Speed
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md theme-surface-subtle border text-amber-400 font-semibold flex items-center gap-1">
                        🧠 Confidence Check
                      </span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded-md theme-surface-subtle border text-emerald-400 font-semibold flex items-center gap-1">
                        🎯 Estimated Rating
                      </span>
                    </div>

                    {savedDiagnosisProfile && (
                      <div className="mt-2.5 flex flex-wrap items-center gap-2 text-[11px] font-mono">
                        <span className="px-2 py-0.5 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold">
                          ✓ Diagnosed: {savedDiagnosisProfile.finalLevel}
                        </span>
                        <span className="theme-text-muted">
                          Pattern: {savedDiagnosisProfile.behavioralPattern}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto shrink-0 pt-1 sm:pt-0">
                  {savedDiagnosisProfile && (
                    <button
                      onClick={() => {
                        const targetLevel =
                          LEVEL_OPTIONS.find((l) => l.id === savedDiagnosisProfile.tierId) ||
                          LEVEL_OPTIONS[2];
                        handleStartDiagnosedTraining(savedDiagnosisProfile, targetLevel);
                      }}
                      className="w-full sm:w-auto px-4 py-2.5 rounded-xl theme-surface hover:theme-surface-subtle font-bold text-xs sm:text-sm tracking-wide border transition cursor-pointer"
                    >
                      <span>Start Training</span>
                    </button>
                  )}
                  <Link
                    href="/diagnose"
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl theme-accent-btn font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition-all duration-150 active:scale-[0.98] cursor-pointer group"
                  >
                    <span>{savedDiagnosisProfile ? "Retake Diagnosis" : "Start Level Diagnosis"}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Action 2: Direct Tier Selection (Skip Diagnostic) */}
          <div className="w-full max-w-3xl mb-2">
            <div className="flex items-center gap-3 my-2 text-zinc-400">
              <div className="flex-1 h-px bg-[var(--border-subtle)]" />
              <span className="text-[10px] uppercase tracking-widest font-semibold theme-text-muted font-mono">
                Or Select Tier Directly
              </span>
              <div className="flex-1 h-px bg-[var(--border-subtle)]" />
            </div>

            <div className="flex items-center justify-between text-xs theme-text-secondary px-1 mb-2 font-medium">
              <span className="font-mono text-[11px] hidden sm:inline">Select your rating bracket for direct tactical training:</span>
              <span className="font-mono text-[11px] sm:hidden">Select rating bracket:</span>
              <span className="text-[var(--accent-primary)] font-mono text-[11px] font-semibold shrink-0">Immediate Practice</span>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-2.5">
              {LEVEL_OPTIONS.map((lvl, idx) => {
                const isRecommended = lvl.id === recommendedTierId;
                return (
                  <button
                    key={lvl.id}
                    onClick={() => handleDirectTierSelect(lvl)}
                    style={{ animationDelay: `${idx * 60}ms` }}
                    className={`group relative w-full text-left p-3 rounded-2xl theme-surface theme-surface-hover animate-card-entrance cursor-pointer ${
                      isRecommended
                        ? "ring-2 ring-amber-500/70 border-amber-500/40 bg-amber-500/[0.03] shadow-md"
                        : ""
                    }`}
                  >
                    {isRecommended && (
                      <div className="absolute -top-2.5 right-3 flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-linear-to-r from-amber-500 to-amber-600 text-neutral-950 text-[10px] font-extrabold shadow-md z-20 font-display">
                        <Sparkles className="w-2.5 h-2.5 fill-current" />
                        <span>Recommended for @{lichessUser?.username} ({lichessRating})</span>
                      </div>
                    )}
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl theme-surface-subtle flex items-center justify-center text-base font-bold select-none shrink-0">
                          {lvl.pieceSymbol}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-bold theme-text-primary text-sm sm:text-base">{lvl.title}</span>
                            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full theme-surface-subtle theme-text-secondary font-mono">
                              {lvl.chessComRange}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                            <span className="px-1.5 py-0.5 rounded theme-surface-subtle theme-text-muted">
                              Lichess: {lvl.lichessRange}
                            </span>
                            {lvl.fideRange && (
                              <span className="px-1.5 py-0.5 rounded theme-pill font-medium">
                                FIDE: {lvl.fideRange}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 theme-text-muted group-hover:theme-text-primary transition group-hover:translate-x-0.5" />
                    </div>
                    <p className="text-xs theme-text-secondary pl-10">
                      {lvl.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Clear Human-Friendly Trust Markers */}
          <div className="mt-1 md:mt-2 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-[11px] theme-text-secondary theme-surface px-4 py-1.5 rounded-full border shadow-2xs font-mono">
            <span className="font-semibold text-emerald-400">✓ Coach-Approved Training</span>
            <span className="hidden sm:inline theme-text-muted">•</span>
            <span className="font-semibold text-[var(--accent-primary)]">✓ Sync with Lichess</span>
            <span className="hidden sm:inline theme-text-muted">•</span>
            <span className="theme-text-muted">Real Game Tactics</span>
          </div>
        </section>
      ) : isQuizActive && !showDiagnosisModal ? (
        /* Screen 2: 4-Question Pure Math Diagnostic Assessment */
        <section className="flex-1 flex flex-col items-center justify-center max-w-md md:max-w-xl mx-auto w-full py-4 min-h-0 animate-card-entrance">
          <div className="w-full mb-3">
            <div className="flex items-center justify-between text-xs theme-text-secondary mb-1.5 font-mono">
              <span className="font-semibold text-[var(--accent-primary)]">
                {DIAGNOSTIC_QUESTIONS[currentQuestionIndex].category}
              </span>
              <span>Question {currentQuestionIndex + 1} of 4</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-1.5 theme-surface-subtle rounded-full overflow-hidden">
              <div 
                className="h-full bg-[var(--accent-primary)] transition-all duration-300 rounded-full"
                style={{ width: `${((currentQuestionIndex + 1) / 4) * 100}%` }}
              />
            </div>
          </div>

          <div className="w-full theme-surface rounded-2xl p-4 sm:p-5 mb-3 shadow-md border">
            <h2 className="text-sm sm:text-base md:text-lg font-bold theme-text-primary mb-3.5 leading-snug">
              {DIAGNOSTIC_QUESTIONS[currentQuestionIndex].question}
            </h2>

            <div className="flex flex-col gap-2.5">
              {DIAGNOSTIC_QUESTIONS[currentQuestionIndex].options.map((opt, oIdx) => (
                <button
                  key={oIdx}
                  onClick={() => handleAnswerDiagnosticQuestion(oIdx)}
                  className="w-full text-left p-3 rounded-xl theme-surface-subtle hover:theme-pill theme-text-primary transition-all duration-150 text-xs sm:text-sm font-medium flex items-center justify-between group cursor-pointer border"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg theme-surface border flex items-center justify-center text-xs font-mono font-bold theme-text-muted group-hover:text-[var(--accent-primary)]">
                      {oIdx + 1}
                    </span>
                    <span>{opt.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 theme-text-muted group-hover:text-[var(--accent-primary)] transition group-hover:translate-x-0.5 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between w-full px-1 text-xs">
            <p className="text-[11px] theme-text-muted">
              Pick the answer that best matches your play.
            </p>
            <button
              onClick={() => setIsQuizActive(false)}
              className="text-[11px] theme-text-secondary hover:theme-text-primary underline underline-offset-2 cursor-pointer transition"
            >
              Skip to Direct Level Selection ➔
            </button>
          </div>
        </section>
      ) : showDiagnosisModal && coachDiagnosis && selectedLevel ? (
        /* Screen 2.5: The Coach Diagnosis & Calibrated Rating Dossier */
        <section className="flex-1 flex flex-col items-center justify-center max-w-md md:max-w-xl mx-auto w-full py-2 sm:py-3 min-h-0 animate-card-entrance">
          <div className="w-full theme-surface rounded-3xl p-4 sm:p-5 shadow-xl relative overflow-hidden max-h-[85vh] overflow-y-auto border">
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg theme-pill">
                  <Lightbulb className="w-4 h-4 text-[var(--accent-primary)]" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)]">
                  FIDE Coach Diagnosis
                </span>
              </div>
              <div className="flex items-center gap-1.5 theme-pill px-2.5 py-1 rounded-full text-[11px] font-mono font-bold">
                <span>Rating:</span>
                <span>~{calibratedRating}</span>
              </div>
            </div>

            <h2 className="text-base sm:text-lg md:text-xl font-extrabold theme-text-primary leading-tight mb-1">
              {coachDiagnosis.headline}
            </h2>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full theme-surface-subtle theme-text-primary border">
                {selectedLevel.title}
              </span>
              <span className="text-[10px] sm:text-[11px] font-mono px-2.5 py-0.5 rounded-full theme-surface-subtle theme-text-secondary border">
                Focus: {coachDiagnosis.targetFocus}
              </span>
            </div>

            {/* Personalized Narrative Breakdown */}
            <p className="text-xs theme-text-secondary leading-relaxed mb-2.5 theme-surface-subtle p-3 rounded-xl border">
              {coachDiagnosis.personalizedSummary}
            </p>

            {/* Golden Rule Callout Box */}
            <div className="theme-surface-subtle border border-[var(--border-focus)] rounded-xl p-3 mb-2.5">
              <div className="text-[11px] font-bold text-[var(--accent-primary)] uppercase tracking-wide mb-0.5 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{coachDiagnosis.ruleTitle}</span>
              </div>
              <p className="text-xs theme-text-primary leading-relaxed">
                {coachDiagnosis.ruleBody}
              </p>
            </div>

            {/* 5-Puzzle Targeted Curriculum Roadmap Preview */}
            <div className="theme-surface-subtle border rounded-xl p-3 mb-3">
              <div className="flex items-center justify-between text-[10px] font-bold theme-text-primary uppercase tracking-wider mb-2">
                <span className="flex items-center gap-1 text-[var(--accent-primary)]">
                  <Target className="w-3.5 h-3.5" />
                  Your 5-Puzzle Curriculum:
                </span>
                <span className="theme-text-muted font-mono">Curated</span>
              </div>
              <div className="space-y-1">
                {(coachDiagnosis.curatedPlaylist || diagnosisPlaylist).map((pz, pIdx) => (
                  <div
                    key={pz.id || pIdx}
                    className="flex items-center justify-between p-2 rounded-lg theme-surface border text-xs theme-text-primary"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded theme-pill flex items-center justify-center text-[10px] font-mono font-bold shrink-0">
                        {pIdx + 1}
                      </span>
                      <span className="font-medium text-[11px] truncate max-w-[190px] sm:max-w-[280px]">
                        {pz.title}
                      </span>
                    </div>
                    <span className="text-[9px] font-mono theme-text-muted theme-surface-subtle px-1.5 py-0.5 rounded border shrink-0">
                      {pz.ratingBadge}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Put This Rule to the Test CTA */}
            <button
              onClick={startDiagnosedCurriculum}
              className="w-full py-2.5 px-4 rounded-xl theme-accent-btn font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all duration-150 active:scale-[0.98] cursor-pointer"
            >
              <span>Start 5-Puzzle Curriculum</span>
              <Play className="w-4 h-4 fill-current" />
            </button>

            {/* Share Diagnosis CTA */}
            <button
              onClick={handleShareDiagnosis}
              className="w-full mt-1.5 py-2 px-4 rounded-xl theme-surface theme-surface-hover font-semibold text-xs tracking-wide flex items-center justify-center gap-2 transition duration-150 cursor-pointer border"
              title="Share or Copy your diagnosis card"
            >
              {shareCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                  <span className="text-[var(--accent-primary)] font-bold">Diagnosis Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                  <span>Share My Coach Diagnosis</span>
                </>
              )}
            </button>
          </div>
        </section>
      ) : (
        /* Screen 3: The Interactive Chessboard Arena (Chess.com Desktop Layout Reference) */
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
                <span className="text-[11px] theme-text-secondary">Rule: {currentPuzzle.ruleTitle}</span>
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

          {/* Chessboard Column (Left / Center) with Exterior ChessBase Bezel */}
          <div className="flex flex-col items-center justify-center shrink-0">
            {game && currentPuzzle && (
              <ChessboardFrame
                  boardOrientation={currentPuzzle.playerColor}
                  boardSize={boardWidth}
                  bezelSize={bezelSize}
                >
                  <AnimatedCaptureHand
                    targetSquare={captureHandTarget?.square || null}
                    triggerKey={captureHandTarget?.key}
                    boardOrientation={currentPuzzle.playerColor}
                    boardSize={boardWidth}
                    bezelSize={bezelSize}
                    enabled={captureHandEnabled}
                  />
                  <Chessboard
                    key={boardKey}
                    options={{
                      position: game.fen(),
                      boardOrientation: currentPuzzle.playerColor,
                      squareStyles: getCustomSquareStyles(),
                      showNotation: false,
                      pieces: getPieceSet(pieceSet),
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
            {puzzleStatus === "failed" && refutationInfo && (
              <div className="w-full mt-3 theme-surface border border-rose-500/40 rounded-2xl p-4 shadow-md animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="flex items-center gap-2 text-rose-500 text-xs font-bold uppercase tracking-wide mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Instant Learning: Refutation</span>
                </div>
                <p className="text-xs sm:text-sm theme-text-primary leading-relaxed mb-3">
                  {refutationInfo.coachExplanation}
                </p>
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
              </div>
            )}

            {/* Mobile Stockfish Engine Analysis Bar */}
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
                  <p className="text-[11px] theme-text-secondary leading-relaxed">
                    Rule: <span className="theme-text-primary font-medium">{currentPuzzle.ruleTitle}</span>
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
                    Find the best continuation. Drag pieces or click squares to move. Right-click any square to mark tactical annotations.
                  </p>
                </div>
              )}

              {puzzleStatus === "failed" && refutationInfo && (
                <div className="w-full theme-surface-subtle border border-rose-500/40 rounded-xl p-3.5 shadow-md animate-in fade-in duration-200">
                  <div className="flex items-center gap-1.5 text-rose-500 text-xs font-bold uppercase tracking-wide mb-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Instant Refutation</span>
                  </div>
                  <p className="text-xs theme-text-primary leading-relaxed mb-3">
                    {refutationInfo.coachExplanation}
                  </p>
                  <button
                    onClick={retryCurrentPuzzle}
                    className="w-full py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-xs"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Try Again</span>
                  </button>
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
                </div>
              )}

              {/* Desktop Stockfish Engine Analysis Bar */}
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
              Enter your email to sync your FIDE Coach Diagnosis, rating progress, and solved puzzles across all your devices.
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

      {/* Credits & Open Source Modal (CC BY 4.0 Compliance) */}
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
                <strong className="theme-text-primary">Lichess Puzzle Database:</strong> Puzzles courtesy of{" "}
                <span className="font-mono text-[var(--accent-primary)]">Lichess.org</span> under the{" "}
                <span className="theme-text-primary">Creative Commons CC0 / CC-BY 4.0</span> license.
              </p>
              <p>
                <strong className="theme-text-primary">chess-puzzle-cot:</strong> Curated Chain-of-Thought chess reasoning dataset under open research license.
              </p>
              <p>
                <strong className="theme-text-primary">Open-Source Engines:</strong> Built with{" "}
                <span className="font-mono theme-text-primary">chess.js</span> (MIT, Jeff Hlywa) and{" "}
                <span className="font-mono theme-text-primary">react-chessboard</span> (MIT, Clariity).
              </p>
              <p>
                <strong className="theme-text-primary">Coaching Pedagogy:</strong> Diagnostic framework and Golden Rules designed by FIDE Academy certified coaches at Premier Chess Academy (PCA).
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
        onStartBlunderTraining={handleStartBlunderTraining}
      />
    </main>
  );
}
