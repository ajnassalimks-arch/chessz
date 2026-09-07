"use client";

import React, { useState, useEffect, useRef } from "react";
import { Chess } from "chess.js";
import { Chessboard, defaultArrowOptions } from "react-chessboard";
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
  VolumeX
} from "lucide-react";
import {
  DIAGNOSTIC_PUZZLES,
  CONTINUOUS_PUZZLES,
  ChessPuzzle,
  RefutationMove,
  LevelType,
  TrackType
} from "@/lib/puzzles";
import { sounds } from "@/lib/sounds";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

interface CoachDiagnosis {
  headline: string;
  ruleTitle: string;
  ruleBody: string;
  targetFocus: string;
  puzzleId: string;
}

interface LevelOption {
  id: LevelType;
  badge: string;
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
    chessComRange: "400 – 900",
    lichessRange: "600 – 1200",
    title: "Beginner",
    desc: "Basic checks, simple captures, and learning to stop hanging free pieces.",
    tag: "Mate-in-1 & Free Pieces",
    icon: Sparkles,
    colorClass: "text-emerald-400",
    borderClass: "border-emerald-500/30 hover:border-emerald-500/80 group-hover:border-emerald-500",
    accentBg: "from-emerald-500/10 to-transparent",
    starterPuzzleId: "beginner_1a",
    approxRating: 500,
  },
  {
    id: "adv_beginner",
    badge: "Tier 2",
    chessComRange: "900 – 1200",
    lichessRange: "1200 – 1500",
    title: "Advanced Beginner",
    desc: "Forks, pins, skewers, and double attacks that win material in the opening.",
    tag: "Essential Tactical Patterns",
    icon: Compass,
    colorClass: "text-cyan-400",
    borderClass: "border-cyan-500/30 hover:border-cyan-500/80 group-hover:border-cyan-500",
    accentBg: "from-cyan-500/10 to-transparent",
    starterPuzzleId: "adv_beginner_2a",
    approxRating: 900,
  },
  {
    id: "intermediate",
    badge: "Tier 3",
    chessComRange: "1200 – 1500",
    lichessRange: "1500 – 1800",
    fideRange: "1300 – 1600 FIDE",
    title: "Intermediate",
    desc: "Complex combinations, Greek Gift sacrifices, candidate moves, and in-between checks.",
    tag: "Multi-Move Combinations",
    icon: Swords,
    colorClass: "text-amber-400",
    borderClass: "border-amber-500/30 hover:border-amber-500/80 group-hover:border-amber-500",
    accentBg: "from-amber-500/10 to-transparent",
    starterPuzzleId: "intermediate_3a",
    approxRating: 1300,
  },
  {
    id: "advanced",
    badge: "Tier 4",
    chessComRange: "1500 – 1900+",
    lichessRange: "1800 – 2100+",
    fideRange: "1600 – 1950+ FIDE",
    title: "Advanced",
    desc: "Subtle positional pressure, prophylactic thinking, pawn levers, and deep refutations.",
    tag: "Master Calculation & Strategy",
    icon: Target,
    colorClass: "text-rose-400",
    borderClass: "border-rose-500/30 hover:border-rose-500/80 group-hover:border-rose-500",
    accentBg: "from-rose-500/10 to-transparent",
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

  const q2Ans = answers[1] ?? 0;
  let diagnosis: CoachDiagnosis;

  if (q2Ans === 0) {
    diagnosis = {
      headline: "Diagnosed: The Free-Piece Blindspot",
      ruleTitle: "The 2-Second Bodyguard Rule",
      ruleBody: "You play with great attacking spirit, but friendly pieces are left undefended. Before making any move, spend 2 seconds verifying: 'Is this piece guarded by a teammate?'",
      targetFocus: "Bodyguard Defense & Free Pieces",
      puzzleId: "beginner_1a",
    };
  } else if (q2Ans === 1) {
    diagnosis = {
      headline: "Diagnosed: Tactical Radar Leak",
      ruleTitle: "The Same-Color Radar Rule",
      ruleBody: "You calculate well, but get caught by surprise double attacks. Knights can only fork pieces standing on the EXACT same color square. Watch your king and heavy piece alignment!",
      targetFocus: "Forks, Pins & Double Attacks",
      puzzleId: "adv_beginner_2a",
    };
  } else if (q2Ans === 2) {
    diagnosis = {
      headline: "Diagnosed: Endgame Conversion Gap",
      ruleTitle: "King Activity & Passed Pawns",
      ruleBody: "You build winning advantages in the middlegame, then drop points in the endgame. In the endgame, activate your King aggressively and push passed pawns immediately!",
      targetFocus: "Endgame Technique & Passed Pawns",
      puzzleId: "intermediate_3a",
    };
  } else {
    diagnosis = {
      headline: "Diagnosed: Strategic Passivity",
      ruleTitle: "Find the Worst Piece & Restrict Counterplay",
      ruleBody: "When tactics disappear, you run out of moves. Always find your least active piece, reposition it to a dominant square, and stop your opponent's counterplay.",
      targetFocus: "Prophylaxis & Piece Improvement",
      puzzleId: "advanced_4a",
    };
  }

  return { calibratedRating, targetLevel, diagnosis };
}

type PuzzleStatus = "solving" | "refuting" | "failed" | "solved";

interface LegalMoveTarget {
  to: string;
  captured?: string;
}

export default function Home() {
  const [selectedLevel, setSelectedLevel] = useState<LevelOption | null>(null);
  const [isQuizActive, setIsQuizActive] = useState<boolean>(false);
  const [calibratedRating, setCalibratedRating] = useState<number>(900);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [calibrationAnswers, setCalibrationAnswers] = useState<number[]>([]);
  const [coachDiagnosis, setCoachDiagnosis] = useState<CoachDiagnosis | null>(null);
  const [showDiagnosisModal, setShowDiagnosisModal] = useState<boolean>(false);
  const [isCalibrated, setIsCalibrated] = useState<boolean>(false);

  // Puzzle State
  const [currentPuzzle, setCurrentPuzzle] = useState<ChessPuzzle | null>(null);
  const [puzzleStatus, setPuzzleStatus] = useState<PuzzleStatus>("solving");
  const [refutationInfo, setRefutationInfo] = useState<RefutationMove | null>(null);
  const [game, setGame] = useState<Chess | null>(null);
  const [boardWidth, setBoardWidth] = useState<number>(380);
  const [status, setStatus] = useState<string>("White to move");
  const [streak, setStreak] = useState<number>(0);
  const [solvedCount, setSolvedCount] = useState<number>(0);
  const [activeTrack, setActiveTrack] = useState<TrackType>("tactical");
  const [continuousIndex, setContinuousIndex] = useState<number>(0);

  // Piece Selection & Marking State
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<LegalMoveTarget[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [hintSquare, setHintSquare] = useState<string | null>(null);
  const [annotatedSquares, setAnnotatedSquares] = useState<
    Record<string, { bg: string; border: string; type: "green" | "red" | "cyan" | "yellow" }>
  >({});
  const [boardKey, setBoardKey] = useState<number>(0);

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

  // Modals (Save Progress & Credits)
  const [showSaveModal, setShowSaveModal] = useState<boolean>(false);
  const [showCreditsModal, setShowCreditsModal] = useState<boolean>(false);
  const [emailInput, setEmailInput] = useState<string>("");
  const [authStatusMessage, setAuthStatusMessage] = useState<string>("");
  const [shareCopied, setShareCopied] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

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
      if (width < 768) {
        if (width < 440) {
          setBoardWidth(width - 32);
        } else {
          setBoardWidth(420);
        }
      } else {
        // Desktop: board sized dynamically to fit viewport height with zero overflow
        const maxVertical = Math.max(320, height - 120);
        const maxHorizontal = Math.max(320, width - 440);
        const optimalSize = Math.floor(Math.min(maxVertical, maxHorizontal, 580));
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
    setCurrentQuestionIndex(0);
    setCalibrationAnswers([]);
    setCoachDiagnosis(null);
    setShowDiagnosisModal(false);
    setIsCalibrated(false);
    setSelectedLevel(null);
  };

  // Direct Tier Selection (Skip Diagnostic)
  const handleDirectTierSelect = (level: LevelOption) => {
    setSelectedLevel(level);
    setCalibratedRating(level.approxRating);
    setIsQuizActive(false);
    setShowDiagnosisModal(false);
    setIsCalibrated(true);
    const starter = DIAGNOSTIC_PUZZLES[level.starterPuzzleId] || DIAGNOSTIC_PUZZLES["beginner_1a"];
    loadPuzzle(starter);
  };

  // Answer a Question in the 4-Question Quiz
  const handleAnswerDiagnosticQuestion = (optionIndex: number) => {
    const nextAnswers = [...calibrationAnswers, optionIndex];
    setCalibrationAnswers(nextAnswers);

    if (currentQuestionIndex + 1 < DIAGNOSTIC_QUESTIONS.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // Run Pure Math Diagnostic Algorithm!
      const result = calculateDiagnosticResult(nextAnswers);
      setSelectedLevel(result.targetLevel);
      setCalibratedRating(result.calibratedRating);
      setCoachDiagnosis(result.diagnosis);
      setIsQuizActive(false);
      setShowDiagnosisModal(true);
    }
  };

  const startDiagnosedPuzzle = () => {
    if (!selectedLevel || !coachDiagnosis) return;
    setShowDiagnosisModal(false);
    setIsCalibrated(true);
    const pz = DIAGNOSTIC_PUZZLES[coachDiagnosis.puzzleId] || DIAGNOSTIC_PUZZLES["beginner_1a"];
    loadPuzzle(pz);
  };

  const loadPuzzle = (puzzle: ChessPuzzle) => {
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
    setSelectedSquare(null);
    setLegalMoves([]);
    setHintSquare(null);
    setAnnotatedSquares({});

    // 1. Check legal move in chess.js
    const testChess = new Chess(game.fen());
    let moveResult = null;
    try {
      moveResult = testChess.move({
        from: sourceSquare,
        to: targetSquare,
        promotion: "q",
      });
    } catch {
      return false;
    }
    if (!moveResult) return false;

    // Play sound based on move type
    if (moveResult.captured) {
      sounds.playCapture();
    } else {
      sounds.playMove();
    }

    setLastMove({ from: sourceSquare, to: targetSquare });

    // 2. Check winning solution move
    const targetSolution = currentPuzzle.solutionMoves[0];
    const isCorrect = sourceSquare === targetSolution.from && targetSquare === targetSolution.to;

    if (isCorrect) {
      setGame(testChess);
      setPuzzleStatus("solved");
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setSolvedCount((prev) => prev + 1);
      setStatus("Tactical Win! Rule Mastered 🎉");
      setTimeout(() => {
        sounds.playVictory();
      }, 250);

      // Trigger "Save Progress" prompt at streak 3 milestone
      if (nextStreak === 3) {
        setTimeout(() => {
          setShowSaveModal(true);
        }, 1200);
      }
      return true;
    }

    // 3. Instant Refutation
    setGame(testChess);
    setPuzzleStatus("refuting");
    setStatus("Analyzing move...");

    setTimeout(() => {
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
          } else {
            sounds.playRefutation();
          }
        }
      } catch {}
      setRefutationInfo(currentPuzzle.defaultRefutation);
      setPuzzleStatus("failed");
      setStreak(0);
      setStatus("Refuted by opponent!");
    }, 650);

    return true;
  };

  // Tap-to-move square click handler
  const handleSquareClick = ({ square }: { square: string }) => {
    if (!game || !currentPuzzle || puzzleStatus !== "solving") return;

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
    }
  };

  // Right-click tactical annotation handler:
  // Default: Green (#52b788)
  // Control: Red (#ef4444)
  // Shift (swift): Cyan (#06b6d4)
  // Alt: Yellow (#eab308)
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
      bg = "rgba(234, 179, 8, 0.42)";
      border = "#eab308";
    } else if (isShift) {
      colorType = "cyan";
      bg = "rgba(6, 182, 212, 0.40)";
      border = "#06b6d4";
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

    // 1. Right-click tactical annotations (crisp tile framing with dark perimeter divider so adjacent squares stay distinctly separated)
    Object.entries(annotatedSquares).forEach(([sq, item]) => {
      styles[sq] = {
        backgroundColor: item.bg,
        boxShadow: `inset 0 0 0 1.5px rgba(0, 0, 0, 0.45), inset 0 0 0 4.5px ${item.border}`,
      };
    });

    // 2. Last move highlight
    if (lastMove) {
      styles[lastMove.from] = {
        ...styles[lastMove.from],
        backgroundColor: "rgba(250, 204, 21, 0.28)",
      };
      styles[lastMove.to] = {
        ...styles[lastMove.to],
        backgroundColor: "rgba(250, 204, 21, 0.38)",
      };
    }

    // 3. Selected square highlight (warm gold)
    if (selectedSquare) {
      styles[selectedSquare] = {
        backgroundColor: "rgba(250, 204, 21, 0.55)",
        boxShadow: "inset 0 0 0 3px rgba(234, 179, 8, 0.9)",
      };
    }

    // 4. Legal moves dots and capture rings (emerald dot & crimson capture ring)
    legalMoves.forEach((move) => {
      if (move.captured) {
        styles[move.to] = {
          background:
            "radial-gradient(circle, transparent 55%, rgba(239, 68, 68, 0.55) 56%, rgba(239, 68, 68, 0.8) 70%, transparent 71%)",
          borderRadius: "50%",
        };
      } else {
        styles[move.to] = {
          background:
            "radial-gradient(circle, rgba(16, 185, 129, 0.65) 24%, transparent 25%)",
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

    return styles;
  };

  const retryCurrentPuzzle = () => {
    if (!currentPuzzle) return;
    loadPuzzle(currentPuzzle);
  };

  const nextPuzzle = (overrideTrack?: TrackType) => {
    if (!selectedLevel) return;
    const targetTrack = overrideTrack || activeTrack;
    // 1. Puzzles matching BOTH user's rating tier and target track
    let matching = CONTINUOUS_PUZZLES.filter(
      (p) => p.tier === selectedLevel.id && p.track === targetTrack
    );
    // 2. Fallback to any puzzle with this track
    if (matching.length === 0) {
      matching = CONTINUOUS_PUZZLES.filter((p) => p.track === targetTrack);
    }
    // 3. General fallback
    if (matching.length === 0) {
      matching = CONTINUOUS_PUZZLES;
    }
    const nextP = matching[continuousIndex % matching.length] || CONTINUOUS_PUZZLES[0];
    setContinuousIndex((prev) => prev + 1);
    loadPuzzle(nextP);
  };

  const handleSwitchTrack = (newTrack: TrackType) => {
    if (newTrack === activeTrack) return;
    setActiveTrack(newTrack);
    nextPuzzle(newTrack);
  };

  const resetCalibration = () => {
    setSelectedLevel(null);
    setIsQuizActive(false);
    setIsCalibrated(false);
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
        await Promise.race([
          navigator.share({
            title: "ChessZ FIDE Coach Diagnosis",
            text: shareText,
            url: typeof window !== "undefined" ? window.location.origin : undefined,
          }),
          new Promise((_, reject) => setTimeout(() => reject(new Error("Share timeout")), 800))
        ]);
        shared = true;
      } catch {
        // Fallback to clipboard if cancelled, unsupported, or timed out
      }
    }

    let copied = false;
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

    // Always activate confirmation feedback!
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2500);
  };

  return (
    <main className="min-h-screen md:h-screen md:overflow-hidden bg-zinc-950 text-zinc-100 flex flex-col justify-between p-3 sm:p-4 md:px-6 md:py-3 font-sans">
      {/* Top Header */}
      <header className="w-full max-w-md md:max-w-5xl lg:max-w-6xl mx-auto flex items-center justify-between py-2 border-b border-zinc-800/80 shrink-0">
        <div className="flex items-center gap-2">
          <span className="bg-emerald-500 text-black font-extrabold text-xs px-2.5 py-1 rounded-md flex items-center gap-1 shadow-sm">
            <Zap className="w-3.5 h-3.5 fill-black" />
            ChessZ
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Sound Mute/Unmute Toggle */}
          <button
            onClick={toggleMute}
            className="p-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white transition cursor-pointer hover:border-zinc-700"
            title={isMuted ? "Unmute sound" : "Mute sound"}
            aria-label={isMuted ? "Unmute sound" : "Mute sound"}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-zinc-500" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
            )}
          </button>

          {isCalibrated && (
            <button
              onClick={() => setShowSaveModal(true)}
              className="flex items-center gap-1 text-[11px] font-mono font-medium text-zinc-300 hover:text-white bg-zinc-900 border border-zinc-800 px-2 py-1 rounded cursor-pointer transition hover:border-emerald-500/50"
              title="Save Progress"
            >
              <Save className="w-3 h-3 text-emerald-400" />
              <span>Save</span>
            </button>
          )}

          {selectedLevel && (
            <>
              <button
                onClick={resetCalibration}
                className="text-xs text-zinc-400 hover:text-zinc-200 transition underline underline-offset-4 cursor-pointer"
              >
                Change Tier
              </button>
              {isCalibrated && (
                <button
                  onClick={retryCurrentPuzzle}
                  className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
              )}
            </>
          )}
        </div>
      </header>

      {/* Screen 1: Tier Selection (Jio Disruption Style) */}
      {/* Screen 1: Tier Selection & Diagnostic Entry */}
      {!selectedLevel && !isQuizActive && !showDiagnosisModal ? (
        <section className="flex-1 flex flex-col items-center justify-center max-w-md md:max-w-4xl mx-auto w-full py-2 md:py-3 min-h-0">
          {/* FIDE Coaches Badge */}
          <div className="inline-flex items-center gap-1.5 text-[11px] font-semibold tracking-wide text-emerald-400 bg-emerald-950/70 border border-emerald-700/40 px-3 py-1 rounded-full mb-2 md:mb-2.5 shadow-sm">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>Built by FIDE Rated Coaches</span>
          </div>

          {/* Punchy Hero Headline */}
          <div className="text-center mb-2.5 md:mb-3">
            <div className="inline-block text-[10px] md:text-[11px] font-bold tracking-wider uppercase text-amber-400/90 bg-amber-950/40 border border-amber-800/40 px-2.5 py-0.5 rounded-full mb-1">
              Why Pay ₹1,500/yr For Diamond?
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-tight mb-1">
              Unlimited Training.{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
                No Subscription Needed.
              </span>
            </h1>
            <p className="text-zinc-400 text-xs sm:text-sm max-w-md mx-auto leading-relaxed">
              Stop settling for 3 puzzles a day. Master tactics, learn positional play, and get clear coach explanations on every move.
            </p>
          </div>

          {/* Action 1: The 1-Minute Diagnostic Hook Card */}
          <div className="w-full max-w-3xl mb-3">
            <div className="relative rounded-2xl p-4 sm:p-5 bg-gradient-to-r from-emerald-950/60 via-zinc-900 to-teal-950/60 border border-emerald-500/40 shadow-xl overflow-hidden group">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 relative z-10">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
                    <Sparkles className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-bold text-emerald-300 uppercase tracking-wider mb-1">
                      <span>4-Question Diagnostic</span>
                      <span>•</span>
                      <span>Math-Calibrated</span>
                    </div>
                    <h3 className="text-sm sm:text-base font-extrabold text-white">
                      Find Your Exact Rating & Hidden Leaks
                    </h3>
                    <p className="text-xs text-zinc-300 mt-0.5 max-w-lg leading-relaxed">
                      Answer 4 simple, jargon-free questions. Our formula calculates your exact rating and diagnoses your biggest blunder habit.
                    </p>
                  </div>
                </div>

                <button
                  onClick={startDiagnosticQuiz}
                  className="w-full sm:w-auto shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-black text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <span>Start Diagnostic</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Action 2: Direct Tier Selection (Skip Diagnostic) */}
          <div className="w-full max-w-3xl mb-2">
            <div className="flex items-center gap-3 my-2 text-zinc-600">
              <div className="flex-1 h-px bg-zinc-800" />
              <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-500 font-mono">
                Or Choose Level Directly
              </span>
              <div className="flex-1 h-px bg-zinc-800" />
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-400 px-1 mb-2 font-medium">
              <span>Know your rating? Tap a tier to jump straight onto the board:</span>
              <span className="text-amber-400/90 font-mono text-[11px]">Instant Play ⚡</span>
            </div>

            <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-2.5">
              {LEVEL_OPTIONS.map((lvl) => {
                const Icon = lvl.icon;
                return (
                  <button
                    key={lvl.id}
                    onClick={() => handleDirectTierSelect(lvl)}
                    className={`group relative w-full text-left p-2.5 sm:p-3 rounded-2xl bg-gradient-to-r ${lvl.accentBg} bg-zinc-900/90 border ${lvl.borderClass} transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer shadow-lg`}
                  >
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2.5">
                        <div className={`p-1.5 sm:p-2 rounded-xl bg-zinc-800/80 border border-zinc-700/50 ${lvl.colorClass}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className="font-bold text-white text-sm sm:text-base">{lvl.title}</span>
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-300 font-mono">
                              Chess.com: {lvl.chessComRange}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
                            <span className="px-1.5 py-0.5 rounded bg-zinc-800/80 text-zinc-400 border border-zinc-700/40">
                              Lichess: {lvl.lichessRange}
                            </span>
                            {lvl.fideRange && (
                              <span className={`px-1.5 py-0.5 rounded bg-zinc-800/80 border border-zinc-700/40 font-semibold ${lvl.colorClass}`}>
                                FIDE: {lvl.fideRange}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition group-hover:translate-x-0.5" />
                    </div>
                    <p className="text-xs text-zinc-400 pl-9 sm:pl-10">
                      {lvl.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Social Proof Pill */}
          <div className="mt-1 md:mt-2 flex items-center justify-center gap-3 text-[11px] text-zinc-400 bg-zinc-900/80 border border-zinc-800/60 px-3.5 py-1.5 rounded-full">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              ✓ Zero Ads
            </span>
            <span>•</span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              ✓ No Subscription Needed
            </span>
            <span>•</span>
            <span className="text-zinc-300 font-medium">Unlimited Puzzles</span>
          </div>
        </section>
      ) : isQuizActive && !showDiagnosisModal ? (
        /* Screen 2: 4-Question Pure Math Diagnostic Assessment */
        <section className="flex-1 flex flex-col items-center justify-center max-w-md md:max-w-xl mx-auto w-full py-4 min-h-0">
          <div className="w-full mb-3">
            <div className="flex items-center justify-between text-xs text-zinc-400 mb-1.5 font-mono">
              <span className="font-semibold text-emerald-400">
                {DIAGNOSTIC_QUESTIONS[currentQuestionIndex].category}
              </span>
              <span>Question {currentQuestionIndex + 1} of 4</span>
            </div>
            {/* Progress Bar */}
            <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <div 
                className="h-full bg-emerald-400 transition-all duration-300 rounded-full"
                style={{ width: `${((currentQuestionIndex + 1) / 4) * 100}%` }}
              />
            </div>
          </div>

          <div className="w-full bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 sm:p-5 mb-3 shadow-xl">
            <h2 className="text-sm sm:text-base md:text-lg font-bold text-white mb-3.5 leading-snug">
              {DIAGNOSTIC_QUESTIONS[currentQuestionIndex].question}
            </h2>

            <div className="flex flex-col gap-2.5">
              {DIAGNOSTIC_QUESTIONS[currentQuestionIndex].options.map((opt, oIdx) => (
                <button
                  key={oIdx}
                  onClick={() => handleAnswerDiagnosticQuestion(oIdx)}
                  className="w-full text-left p-3 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 hover:border-emerald-500/60 text-zinc-200 hover:text-white transition-all duration-150 text-xs sm:text-sm font-medium flex items-center justify-between group cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-zinc-900 border border-zinc-700/60 flex items-center justify-center text-xs font-mono font-bold text-zinc-400 group-hover:text-emerald-400 group-hover:border-emerald-500/50">
                      {oIdx + 1}
                    </span>
                    <span>{opt.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-emerald-400 transition group-hover:translate-x-0.5 shrink-0" />
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between w-full px-1 text-xs">
            <p className="text-[11px] text-zinc-500">
              Pick the answer that best matches your play.
            </p>
            <button
              onClick={() => setIsQuizActive(false)}
              className="text-[11px] text-zinc-400 hover:text-zinc-200 underline underline-offset-2 cursor-pointer transition"
            >
              Skip to Direct Level Selection ➔
            </button>
          </div>
        </section>
      ) : showDiagnosisModal && coachDiagnosis && selectedLevel ? (
        /* Screen 2.5: The High-Energy Coach Diagnosis & Math-Calibrated Rating Card */
        <section className="flex-1 flex flex-col items-center justify-center max-w-md md:max-w-lg mx-auto w-full py-4 min-h-0">
          <div className="w-full bg-gradient-to-b from-zinc-900 to-zinc-950 border border-emerald-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl relative overflow-hidden">
            {/* Top Accent Glow */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-500" />

            <div className="flex items-center justify-between gap-2 mb-2.5">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <Lightbulb className="w-4 h-4" />
                </span>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  FIDE Coach Diagnosis
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-full text-[11px] font-mono font-bold text-emerald-300">
                <span>Rating:</span>
                <span>~{calibratedRating}</span>
              </div>
            </div>

            <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white leading-tight mb-1">
              {coachDiagnosis.headline}
            </h2>

            <div className="flex items-center gap-2 mb-3.5">
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full bg-zinc-800 ${selectedLevel.colorClass} border border-zinc-700/60`}>
                {selectedLevel.title}
              </span>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                Focus: {coachDiagnosis.targetFocus}
              </span>
            </div>

            {/* Golden Rule Callout Box */}
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 mb-4 shadow-inner">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wide mb-1 flex items-center gap-1.5">
                <span>⚡</span>
                <span>{coachDiagnosis.ruleTitle}</span>
              </div>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {coachDiagnosis.ruleBody}
              </p>
            </div>

            {/* Put This Rule to the Test CTA */}
            <button
              onClick={startDiagnosedPuzzle}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all duration-150 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <span>Put This Rule To The Test</span>
              <Play className="w-4 h-4 fill-zinc-950" />
            </button>

            {/* Viral Share Diagnosis CTA */}
            <button
              onClick={handleShareDiagnosis}
              className="w-full mt-2 py-2 px-4 rounded-xl bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 hover:border-zinc-600 text-zinc-300 hover:text-white font-semibold text-xs tracking-wide flex items-center justify-center gap-2 transition duration-150 cursor-pointer shadow-sm"
              title="Share or Copy your diagnosis card"
            >
              {shareCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-bold">Diagnosis Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Share My Coach Diagnosis 📸</span>
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
              <div className="flex items-center gap-1 text-xs font-mono font-bold bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded-lg text-amber-400">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                <span>{streak} Streak</span>
              </div>
              <span className="text-xs text-zinc-400 font-mono">
                {solvedCount} Solved
              </span>
            </div>

            {/* Track Switcher */}
            <div className="flex items-center bg-zinc-900 border border-zinc-800 p-0.5 rounded-lg text-[11px] font-medium">
              <button
                onClick={() => handleSwitchTrack("tactical")}
                className={`px-2 py-0.5 rounded transition cursor-pointer ${
                  activeTrack === "tactical"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Tactics ⚡
              </button>
              <button
                onClick={() => handleSwitchTrack("positional")}
                className={`px-2 py-0.5 rounded transition cursor-pointer ${
                  activeTrack === "positional"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Strategy 🧭
              </button>
            </div>
          </div>

          {/* Mobile Only: Coach Tip Reminder Banner above board */}
          {currentPuzzle && (
            <div className="w-full md:hidden bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-2.5 mb-2 flex items-start gap-2 text-left">
              <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-0.5">
                  Coach Says 💡
                </span>
                <span className="font-bold text-emerald-200 block">{currentPuzzle.prompt}</span>
                <span className="text-[11px] text-zinc-400">Remember: {currentPuzzle.ruleTitle}</span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-900 text-zinc-300 border border-zinc-800">
                {currentPuzzle.ratingBadge}
              </span>
            </div>
          )}

          {/* Mobile Only: Status Row with Hint Button */}
          <div className="w-full flex md:hidden items-center justify-between mb-1.5 px-1 text-xs">
            <div className="flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  game?.turn() === "w" ? "bg-amber-200" : "bg-zinc-800 border border-zinc-600"
                }`}
              />
              <span className="font-semibold text-zinc-200">{status}</span>
            </div>

            <div className="flex items-center gap-2">
              {puzzleStatus === "solving" && (
                <button
                  onClick={triggerHint}
                  className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 border border-emerald-600/40 px-2 py-0.5 rounded-md transition cursor-pointer hover:bg-emerald-900/40"
                >
                  <HelpCircle className="w-3 h-3" />
                  <span>Hint</span>
                </button>
              )}
              <span className="text-zinc-400 font-mono text-[11px]">
                Drag or Tap
              </span>
            </div>
          </div>

          {/* Chessboard Column (Left / Center) */}
          <div className="flex flex-col items-center justify-center shrink-0">
            <div 
              className="rounded-2xl overflow-hidden shadow-2xl border border-zinc-800 bg-zinc-900 p-2 relative"
              style={{ width: boardWidth + 16, height: boardWidth + 16 }}
            >
              {game && currentPuzzle && (
                <Chessboard
                  key={boardKey}
                  options={{
                    position: game.fen(),
                    boardOrientation: currentPuzzle.playerColor,
                    squareStyles: getCustomSquareStyles(),
                    allowDrawingArrows: true,
                    clearArrowsOnClick: true,
                    arrowOptions: {
                      ...defaultArrowOptions,
                      opacity: 0.95,
                      activeOpacity: 0.85,
                      colors: {
                        default: "#10b981", // Green
                        shift: "#06b6d4",   // Cyan ("swift")
                        ctrl: "#ef4444",    // Red
                        alt: "#f59e0b",     // Yellow / Amber
                        meta: "#ef4444",    // Red
                      },
                      color: "#10b981",
                      secondaryColor: "#06b6d4",
                      tertiaryColor: "#ef4444",
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
                    darkSquareStyle: { backgroundColor: "#779952" },
                    lightSquareStyle: { backgroundColor: "#edeed1" },
                  }}
                />
              )}
            </div>

          </div>

          {/* Mobile Only: Interactive Feedback Cards below board */}
          <div className="w-full flex md:hidden flex-col">
            {puzzleStatus === "failed" && refutationInfo && (
              <div className="w-full mt-3 bg-rose-950/50 border border-rose-500/40 rounded-2xl p-4 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wide mb-1">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Instant Learning: Refutation</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed mb-3">
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
              <div className="w-full mt-3 bg-emerald-950/60 border border-emerald-500/50 rounded-2xl p-4 shadow-xl animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wide mb-1">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Rule Mastered!</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-200 leading-relaxed mb-3">
                  {currentPuzzle.successExplanation}
                </p>
                <button
                  onClick={() => nextPuzzle()}
                  className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition shadow-lg cursor-pointer"
                >
                  <span>Next Puzzle</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Desktop Only: Dedicated Chess.com-Style Sidebar Console */}
          <div 
            className="hidden md:flex flex-col justify-between w-80 lg:w-96 shrink-0 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 shadow-2xl overflow-y-auto"
            style={{ height: boardWidth + 16 }}
          >
            {/* Top: HUD Stats & Track Switcher */}
            <div>
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 text-xs font-mono font-bold bg-zinc-950 border border-zinc-800 px-2.5 py-1 rounded-lg text-amber-400">
                    <Flame className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{streak} Streak</span>
                  </div>
                  <span className="text-xs text-zinc-400 font-mono">
                    {solvedCount} Solved
                  </span>
                </div>

                {/* Track Switcher */}
                <div className="flex items-center bg-zinc-950 border border-zinc-800 p-0.5 rounded-lg text-[11px] font-medium">
                  <button
                    onClick={() => handleSwitchTrack("tactical")}
                    className={`px-2 py-0.5 rounded transition cursor-pointer ${
                      activeTrack === "tactical"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    Tactics ⚡
                  </button>
                  <button
                    onClick={() => handleSwitchTrack("positional")}
                    className={`px-2 py-0.5 rounded transition cursor-pointer ${
                      activeTrack === "positional"
                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold"
                        : "text-zinc-400 hover:text-zinc-200"
                    }`}
                  >
                    Strategy 🧭
                  </button>
                </div>
              </div>

              {/* Status Row (Turn & Hint) */}
              <div className="flex items-center justify-between mb-3 px-0.5 text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-2.5 h-2.5 rounded-full ${
                      game?.turn() === "w" ? "bg-amber-200" : "bg-zinc-800 border border-zinc-600"
                    }`}
                  />
                  <span className="font-semibold text-zinc-200">{status}</span>
                </div>

                <div className="flex items-center gap-2">
                  {puzzleStatus === "solving" && (
                    <button
                      onClick={triggerHint}
                      className="flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 bg-emerald-950/60 border border-emerald-600/40 px-2 py-0.5 rounded-md transition cursor-pointer hover:bg-emerald-900/40"
                    >
                      <HelpCircle className="w-3 h-3" />
                      <span>Hint</span>
                    </button>
                  )}
                  <span className="text-zinc-500 font-mono text-[10px]">
                    Drag, Click, or Right-Click ✏️
                  </span>
                </div>
              </div>

              {/* Coach Tip Reminder Banner */}
              {currentPuzzle && (
                <div className="bg-emerald-950/40 border border-emerald-500/30 rounded-xl p-3 mb-3 text-left">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold text-xs">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Coach Says 💡</span>
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-950 text-zinc-300 border border-zinc-800">
                      {currentPuzzle.ratingBadge}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-emerald-200 mb-1 leading-snug">
                    {currentPuzzle.prompt}
                  </p>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Golden Rule: <span className="text-zinc-300 font-medium">{currentPuzzle.ruleTitle}</span>
                  </p>
                </div>
              )}
            </div>

            {/* Middle: Dynamic Learning Action Area */}
            <div className="flex-1 flex flex-col justify-center my-2">
              {puzzleStatus === "solving" && (
                <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3 text-center">
                  <span className="text-xs font-medium text-zinc-300 block mb-1">
                    Your Turn
                  </span>
                  <p className="text-[11px] text-zinc-400 leading-relaxed">
                    Find the best continuation. Drag pieces or click squares to move. Right-click any square to mark tactical annotations ✏️
                  </p>
                </div>
              )}

              {puzzleStatus === "failed" && refutationInfo && (
                <div className="w-full bg-rose-950/60 border border-rose-500/40 rounded-xl p-3.5 shadow-xl animate-in fade-in duration-200">
                  <div className="flex items-center gap-1.5 text-rose-400 text-xs font-bold uppercase tracking-wide mb-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Instant Refutation</span>
                  </div>
                  <p className="text-xs text-zinc-200 leading-relaxed mb-3">
                    {refutationInfo.coachExplanation}
                  </p>
                  <button
                    onClick={retryCurrentPuzzle}
                    className="w-full py-2 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Try Again</span>
                  </button>
                </div>
              )}

              {puzzleStatus === "solved" && currentPuzzle && (
                <div className="w-full bg-emerald-950/70 border border-emerald-500/50 rounded-xl p-3.5 shadow-xl animate-in fade-in duration-200">
                  <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-bold uppercase tracking-wide mb-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Rule Mastered!</span>
                  </div>
                  <p className="text-xs text-zinc-200 leading-relaxed mb-3">
                    {currentPuzzle.successExplanation}
                  </p>
                  <button
                    onClick={() => nextPuzzle()}
                    className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition shadow-lg cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
                  >
                    <span>Next Puzzle</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Bottom: Console Quick Controls */}
            <div className="pt-2.5 border-t border-zinc-800 flex items-center justify-between text-xs">
              <button
                onClick={retryCurrentPuzzle}
                className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Position</span>
              </button>

              <button
                onClick={() => setShowCreditsModal(true)}
                className="text-[11px] text-zinc-500 hover:text-zinc-300 transition underline underline-offset-2 cursor-pointer"
              >
                Credits & License
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Save Progress Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowSaveModal(false)}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded-lg bg-zinc-800/80 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
              <Flame className="w-4 h-4 fill-amber-400" />
              <span>Streak Milestone</span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              Save Your Streak ({streak} Solved)
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed mb-4">
              Enter your email to sync your FIDE Coach Diagnosis, rating progress, and solved puzzles across all your devices.
            </p>

            <form onSubmit={handleSaveProgressSubmit} className="space-y-3">
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
                  required
                />
              </div>

              {authStatusMessage && (
                <div className="text-xs text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 p-2 rounded-lg text-center font-medium">
                  {authStatusMessage}
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-zinc-950 font-bold text-xs tracking-wide transition cursor-pointer shadow-md"
              >
                Save Progress
              </button>

              <button
                type="button"
                onClick={() => setShowSaveModal(false)}
                className="w-full text-center text-xs text-zinc-500 hover:text-zinc-300 transition pt-1 cursor-pointer"
              >
                Keep playing as guest
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Credits & Open Source Modal (CC BY 4.0 Compliance) */}
      {showCreditsModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-zinc-900 border border-zinc-800 rounded-3xl p-6 shadow-2xl relative">
            <button
              onClick={() => setShowCreditsModal(false)}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white rounded-lg bg-zinc-800/80 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider mb-2">
              <BookOpen className="w-4 h-4" />
              <span>Open Source & Credits</span>
            </div>

            <h3 className="text-base font-bold text-white mb-2">
              Credits & Acknowledgements
            </h3>
            <div className="text-xs text-zinc-400 space-y-2.5 leading-relaxed max-h-64 overflow-y-auto pr-1">
              <p>
                <strong className="text-zinc-200">Lichess Puzzle Database:</strong> Puzzles courtesy of{" "}
                <span className="text-emerald-400 font-mono">Lichess.org</span> under the{" "}
                <span className="text-zinc-300">Creative Commons CC0 / CC-BY 4.0</span> license.
              </p>
              <p>
                <strong className="text-zinc-200">chess-puzzle-cot:</strong> Curated Chain-of-Thought chess reasoning dataset under open research license.
              </p>
              <p>
                <strong className="text-zinc-200">Open-Source Engines:</strong> Built with{" "}
                <span className="text-zinc-300 font-mono">chess.js</span> (MIT, Jeff Hlywa) and{" "}
                <span className="text-zinc-300 font-mono">react-chessboard</span> (MIT, Clariity).
              </p>
              <p>
                <strong className="text-zinc-200">Coaching Pedagogy:</strong> Diagnostic framework and Golden Rules designed by FIDE Academy certified coaches at Premier Chess Academy (PCA).
              </p>
            </div>

            <button
              onClick={() => setShowCreditsModal(false)}
              className="w-full mt-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium text-xs transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="w-full max-w-md md:max-w-5xl lg:max-w-6xl mx-auto py-2 text-xs text-zinc-500 border-t border-zinc-900 mt-2 shrink-0 flex items-center justify-end px-2">
        <button
          onClick={() => setShowCreditsModal(true)}
          className="text-[11px] text-zinc-500 hover:text-zinc-300 underline underline-offset-2 cursor-pointer transition"
        >
          Credits & License
        </button>
      </footer>
    </main>
  );
}
