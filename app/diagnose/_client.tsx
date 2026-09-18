"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Chess } from "chess.js";
import { Chessboard, defaultArrowOptions } from "react-chessboard";
import { ChessboardFrame } from "@/components/ChessboardFrame";
import { AnnotationPalette, AnnotationColor, ANNOTATION_COLORS } from "@/components/AnnotationPalette";
import { sounds } from "@/lib/sounds";
import { THEME_BOARD_COLORS } from "@/components/themeTokens";
import { useTheme } from "@/components/ThemeProvider";
import { SettingsModal } from "@/components/SettingsModal";
import { ConfidenceModal } from "@/components/ConfidenceModal";
import {
  BENCHMARK_PUZZLE_POOL,
  HISTORICAL_BENCHMARKS_STAGE_1,
  HISTORICAL_BENCHMARKS_STAGE_2,
  getRandomBenchmarkPair,
  getRandomDiagnosticQuintet,
  evaluateBenchmarkMove,
  calculateNewElo,
  calculateNewElo5,
  computeTimeModifier,
  checkBookMemoryPattern,
  selectNoveltyCruciblePuzzle,
  getPuzzleCategoryRule,
  mapEloToLevel,
  selectAdaptivePuzzle,
  computeMoveScore,
  classifyBehavioralPattern,
  CommitmentLevel,
  HelpType,
  PuzzleAttemptRecord,
  DiagnosisProfile,
} from "@/lib/diagnosisEngine";
import { BrowserStockfishEngine } from "@/lib/engine/browserStockfish";
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
  BookOpen,
} from "lucide-react";
import { track } from "@vercel/analytics";
import { useLichess } from "@/lib/useLichess";
import { LichessModal, LichessIcon } from "@/components/LichessModal";
import { ChessZMark } from "@/components/ChessZLogo";
import { CoachStudyModal, CoachStudyItem } from "@/components/CoachStudyModal";
import { TermHoverCard } from "@/components/TermHoverCard";

export default function DiagnosePage() {
  const router = useRouter();

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
  const [showStudyModal, setShowStudyModal] = useState<boolean>(false);

  // Theme synchronization
  // Theme comes from ThemeProvider; these pages used to hold their own copy and
  // stay in step by listening for window events.
  const { theme: themePalette, mode: themeMode } = useTheme();

  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);

  useEffect(() => {
    try {
      const savedMute = localStorage.getItem("chessz_muted") === "true";
      setIsMuted(savedMute);
      sounds.setMuted(savedMute);
    } catch {}
  }, []);

  const currentBoardColors =
    THEME_BOARD_COLORS[themePalette]?.[themeMode] || THEME_BOARD_COLORS.periwinkle.light;

  // Board Sizing & Responsive Bezel
  const [boardWidth, setBoardWidth] = useState<number>(360);
  const [bezelSize, setBezelSize] = useState<number>(24);
  const [isMobileView, setIsMobileView] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setIsMobileView(width < 768);
      const currentBezel = width < 640 ? 18 : 24;
      setBezelSize(currentBezel);
      const totalBezelMargin = currentBezel * 2;

      if (width < 768) {
        const availableHeight = height - 240 - totalBezelMargin;
        const availableWidth = width - (width < 440 ? 20 : 32) - totalBezelMargin;
        const maxMobileSize = width < 440 ? 330 : 360;
        const calculatedSize = Math.floor(Math.min(availableWidth, availableHeight, maxMobileSize));
        setBoardWidth(Math.max(260, calculatedSize));
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
  const diagnosticQuintetRef = useRef<(ChessPuzzle & { numericRating: number })[] | null>(null);
  const analysisTimersRef = useRef<(NodeJS.Timeout | number)[]>([]);

  // Engine & novelty verification state
  const stockfishRef = useRef<BrowserStockfishEngine | null>(null);
  const [hasBookMemoryFlag, setHasBookMemoryFlag] = useState<boolean>(false);
  const [noveltyVerified, setNoveltyVerified] = useState<boolean>(false);

  // Initialize Stockfish WASM in background for P3-P5 micro-refutations
  useEffect(() => {
    const engine = new BrowserStockfishEngine();
    engine.init().then((ready) => {
      if (ready) {
        stockfishRef.current = engine;
      }
    });
    return () => {
      stockfishRef.current?.terminate();
    };
  }, []);

  // Lichess Prior Bayesian Seeding (connected users get accurate starting seed)
  useEffect(() => {
    if (lichessUser && attempts.length === 0) {
      const rapid = lichessUser.perfs?.rapid?.rating || lichessUser.perfs?.blitz?.rating;
      if (rapid && typeof rapid === "number") {
        const seededElo = Math.max(900, Math.min(2150, Math.round((1250 + rapid) / 2)));
        setCurrentRating(seededElo);
      }
    }
  }, [lichessUser, attempts.length]);

  const clearAnalysisTimers = () => {
    analysisTimersRef.current.forEach((t) => {
      clearTimeout(t as NodeJS.Timeout);
      clearInterval(t as NodeJS.Timeout);
    });
    analysisTimersRef.current = [];
  };

  // Teardown timers on unmount
  useEffect(() => {
    return () => {
      clearAnalysisTimers();
    };
  }, []);

  // Persist in-progress diagnostic session to sessionStorage
  const persistDiagnosticSession = (
    quintet: (ChessPuzzle & { numericRating: number })[],
    idx: number,
    att: PuzzleAttemptRecord[],
    rating: number
  ) => {
    try {
      sessionStorage.setItem(
        "chessz_diagnostic_session",
        JSON.stringify({ quintet, puzzleIndex: idx, attempts: att, currentRating: rating })
      );
    } catch {}
  };

  const [activePuzzle, setActivePuzzle] = useState<ChessPuzzle & { numericRating: number }>(() => HISTORICAL_BENCHMARKS_STAGE_1[0]);
  const [solutionStepIndex, setSolutionStepIndex] = useState<number>(0);
  const [game, setGame] = useState<Chess | null>(null);
  const [boardKey, setBoardKey] = useState<number>(0);

  // Interaction & Commitment state
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [legalMoves, setLegalMoves] = useState<{ to: string; captured?: boolean }[]>([]);
  const [lastMove, setLastMove] = useState<{ from: string; to: string } | null>(null);
  const [hintSquare, setHintSquare] = useState<string | null>(null);
  const [annotatedSquares, setAnnotatedSquares] = useState<
    Record<string, { bg: string; border: string; type: AnnotationColor }>
  >({});
  const [activeAnnotationColor, setActiveAnnotationColor] = useState<AnnotationColor | null>(null);
  const [pendingMove, setPendingMove] = useState<{
    from: string;
    to: string;
    san: string;
    isBestMove: boolean;
  } | null>(null);
  const [showCommitmentModal, setShowCommitmentModal] = useState<boolean>(false);

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

  // Track keyboard modifier keys globally
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

  // Turn evaluation & Feedback state
  const [puzzleStatus, setPuzzleStatus] = useState<"solving" | "success" | "failed">("solving");
  const [currentHelpUsed, setCurrentHelpUsed] = useState<HelpType>("none");
  const [firstTryCorrect, setFirstTryCorrect] = useState<boolean>(true);
  const [blunderedOnSure, setBlunderedOnSure] = useState<boolean>(false);
  const [selectedCommitment, setSelectedCommitment] = useState<CommitmentLevel | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<string>("");
  const puzzleStartTimeRef = useRef<number>(0);

  // Initialize Puzzle
  const loadPuzzle = (puzzle: ChessPuzzle & { numericRating: number }) => {
    try {
      const g = new Chess(puzzle.initialFen);
      setGame(g);
      setActivePuzzle(puzzle);
      setSolutionStepIndex(0);
      setBoardKey((prev) => prev + 1);
      setSelectedSquare(null);
      setLegalMoves([]);
      setLastMove(null);
      setHintSquare(null);
      setAnnotatedSquares({});
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
    // Check if there is an in-progress diagnostic session in sessionStorage to recover
    try {
      const savedSession = sessionStorage.getItem("chessz_diagnostic_session");
      if (savedSession) {
        const parsed = JSON.parse(savedSession);
        const q = parsed.quintet || parsed.trio;
        if (q && Array.isArray(q) && q.length >= 3 && typeof parsed.puzzleIndex === "number") {
          diagnosticQuintetRef.current = q;
          setAttempts(parsed.attempts || []);
          setCurrentRating(parsed.currentRating || 1250);
          setPuzzleIndex(parsed.puzzleIndex);
          loadPuzzle(q[parsed.puzzleIndex] || q[0]);
          return;
        }
      }
    } catch {}

    // Fresh run only -- a resumed session returns above and is not a new start.
    const quintet = getRandomDiagnosticQuintet();
    diagnosticQuintetRef.current = quintet;
    loadPuzzle(quintet[0]);
    persistDiagnosticSession(quintet, 0, [], 1250);
    track("test_started");
  }, []);

  // Right-click annotation handler
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
        delete next[square];
      } else {
        next[square] = { bg, border, type: colorType };
      }
      return next;
    });
  };

  // Square tap/click handler with touch annotation toggle & empty-square clearing
  const handleSquareClick = ({ square }: { square: string }) => {
    if (!game || puzzleStatus !== "solving" || showCommitmentModal) return;

    // 1. If user has active touch annotation tool selected -> toggle square annotation
    if (activeAnnotationColor) {
      const { bg, border } = ANNOTATION_COLORS[activeAnnotationColor];

      setAnnotatedSquares((prev) => {
        const next = { ...prev };
        if (next[square] && next[square].type === activeAnnotationColor) {
          delete next[square];
        } else {
          next[square] = { bg, border, type: activeAnnotationColor };
        }
        return next;
      });
      return;
    }

    // 2. Normal move interaction:
    if (selectedSquare) {
      if (selectedSquare === square) {
        setSelectedSquare(null);
        setLegalMoves([]);
        return;
      }

      // Check if moving to this square
      const isLegalTarget = legalMoves.some((m) => m.to === square);
      if (isLegalTarget) {
        if (Object.keys(annotatedSquares).length > 0) {
          setAnnotatedSquares({});
        }
        const fromSquare = selectedSquare;
        setSelectedSquare(null);
        setLegalMoves([]);
        handleMoveAttempt(fromSquare, square);
        return;
      }

      // If clicking another friendly piece -> switch selection to that piece
      const pieceOnSquare = game.get(square as any);
      if (pieceOnSquare && pieceOnSquare.color === game.turn()) {
        setSelectedSquare(square);
        const moves = game.moves({ square: square as any, verbose: true });
        setLegalMoves(moves.map((m) => ({ to: m.to, captured: !!m.captured })));
        sounds.playMove();
        return;
      }

      // If clicking empty square or invalid enemy square, clear selection & clear annotations
      setSelectedSquare(null);
      setLegalMoves([]);
      if (Object.keys(annotatedSquares).length > 0) {
        setAnnotatedSquares({});
      }
      return;
    }

    // When no piece is selected yet
    const piece = game.get(square as any);
    if (piece && piece.color === game.turn()) {
      setSelectedSquare(square);
      const moves = game.moves({ square: square as any, verbose: true });
      setLegalMoves(moves.map((m) => ({ to: m.to, captured: !!m.captured })));
      sounds.playMove();
    } else {
      setSelectedSquare(null);
      setLegalMoves([]);
      if (Object.keys(annotatedSquares).length > 0) {
        setAnnotatedSquares({});
      }
    }
  };

  // Handle Piece Move Attempt
  const handleMoveAttempt = (from: string, to: string): boolean => {
    if (!game || puzzleStatus !== "solving" || showCommitmentModal) return false;

    // Check legality in chess.js with underpromotion awareness
    const firstStep = activePuzzle.solutionMoves[0];
    const expectedPromotion =
      firstStep && firstStep.from === from && firstStep.to === to && firstStep.promotion
        ? firstStep.promotion
        : "q";

    const testGame = new Chess(game.fen());
    let moveResult: any = null;
    try {
      moveResult = testGame.move({ from, to, promotion: expectedPromotion });
    } catch {
      return false;
    }

    if (!moveResult) return false;

    setSelectedSquare(null);
    setLegalMoves([]);

    if (Object.keys(annotatedSquares).length > 0) {
      setAnnotatedSquares({});
    }

    // PUZZLES 1 & 2: Historical Benchmark Pure Assessment Mode (Silent Record, Bespoke Candidate Move Feedback)
    if (puzzleIndex === 0 || puzzleIndex === 1) {
      const nextGame = new Chess(game.fen());
      nextGame.move({ from, to, promotion: expectedPromotion });
      setGame(nextGame);
      setLastMove({ from, to });

      if (nextGame.inCheck()) {
        sounds.playCheck();
      } else if (moveResult.captured) {
        sounds.playCapture();
      } else {
        sounds.playMove();
      }

      const currentStep = activePuzzle.solutionMoves[solutionStepIndex] || activePuzzle.solutionMoves[0];
      const isCurrentStepBest = currentStep && currentStep.from === from && currentStep.to === to;

      if (solutionStepIndex === 0) {
        const evalResult = evaluateBenchmarkMove(activePuzzle, from, to, currentRating);
        const elapsed = Date.now() - puzzleStartTimeRef.current;
        const isBookMem = checkBookMemoryPattern(activePuzzle.id, elapsed);
        if (isBookMem) {
          setHasBookMemoryFlag(true);
        }
        const timeMod = computeTimeModifier(elapsed);
        const finalScore = Math.max(0, Math.min(1, evalResult.score + (evalResult.status === "best" ? timeMod : 0)));
        const newElo = calculateNewElo5(
          currentRating,
          activePuzzle.numericRating,
          finalScore,
          puzzleIndex,
          null,
          evalResult.branchType === "blunder_trap",
          isBookMem
        );

        const formattedUserSan =
          evalResult.userMoveSan && !evalResult.userMoveSan.includes("-")
            ? evalResult.userMoveSan
            : moveResult.san || evalResult.userMoveSan;

        // If best move and puzzle has multi-step continuation
        if (evalResult.status === "best" && activePuzzle.solutionMoves.length > 1) {
          setSolutionStepIndex(1);
          const oppResponse = activePuzzle.opponentResponses?.[0];
          if (oppResponse) {
            setTimeout(() => {
              try {
                const oppGame = new Chess(nextGame.fen());
                const oppMoveRes = oppGame.move({
                  from: oppResponse.from,
                  to: oppResponse.to,
                  promotion: oppResponse.promotion || "q",
                });
                if (oppGame.inCheck()) sounds.playCheck();
                else if (oppMoveRes?.captured) sounds.playCapture();
                else sounds.playMove();
                setGame(oppGame);
                setLastMove({ from: oppResponse.from, to: oppResponse.to });
              } catch (e) {
                console.error("Opponent response error:", e);
              }
            }, 450);
            return true;
          }
        }

        // If blunder with refutation sequence (e.g. Légal's checkmate), animate it step-by-step
        if (evalResult.refutationMoves && evalResult.refutationMoves.length > 0) {
          evalResult.refutationMoves.forEach((rm, idx) => {
            setTimeout(() => {
              setGame((prev) => {
                if (!prev) return prev;
                try {
                  const g = new Chess(prev.fen());
                  const res = g.move({ from: rm.from, to: rm.to });
                  if (g.inCheck()) sounds.playCheck();
                  else if (res?.captured) sounds.playCapture();
                  else sounds.playRefutation();
                  setLastMove({ from: rm.from, to: rm.to });
                  return g;
                } catch {
                  return prev;
                }
              });
            }, 500 + idx * 500);
          });
        }

        const record: PuzzleAttemptRecord = {
          puzzleId: activePuzzle.id,
          puzzleTitle: activePuzzle.title,
          rating: activePuzzle.numericRating,
          userEloBefore: currentRating,
          userEloAfter: newElo,
          score: finalScore,
          commitment: null,
          helpUsed: "none",
          firstTryCorrect: evalResult.status === "best",
          timeMs: elapsed,
          moveSan: moveResult.san,
          status: evalResult.status,
          userMoveSan: formattedUserSan,
          bestMoveSan: evalResult.bestMoveSan,
          coachExplanation: evalResult.coachFeedback,
          ruleTitle: evalResult.ruleTitle,
          ruleBody: evalResult.ruleBody,
        };

        const nextAttempts = [...attempts, record];
        setAttempts(nextAttempts);
        setCurrentRating(newElo);
        setPuzzleStatus("success");
        if (evalResult.status === "best") {
          sounds.playVictory();
        } else {
          sounds.playBlunder();
        }
        if (diagnosticQuintetRef.current) {
          persistDiagnosticSession(diagnosticQuintetRef.current, puzzleIndex, nextAttempts, newElo);
        }
        return true;
      } else {
        // Multi-step follow-up move (step 2, 3, etc.)
        if (isCurrentStepBest) {
          const nextStepIdx = solutionStepIndex + 1;
          if (nextStepIdx < activePuzzle.solutionMoves.length) {
            setSolutionStepIndex(nextStepIdx);
            const oppResponse = activePuzzle.opponentResponses?.[solutionStepIndex];
            if (oppResponse) {
              setTimeout(() => {
                try {
                  const oppGame = new Chess(nextGame.fen());
                  const oppMoveRes = oppGame.move({
                    from: oppResponse.from,
                    to: oppResponse.to,
                    promotion: oppResponse.promotion || "q",
                  });
                  if (oppGame.inCheck()) sounds.playCheck();
                  else if (oppMoveRes?.captured) sounds.playCapture();
                  else sounds.playMove();
                  setGame(oppGame);
                  setLastMove({ from: oppResponse.from, to: oppResponse.to });
                } catch {}
              }, 450);
              return true;
            }
          }
          // All steps completed cleanly!
          const elapsed = Date.now() - puzzleStartTimeRef.current;
          const timeMod = computeTimeModifier(elapsed);
          const finalScore = Math.max(0, Math.min(1, 1.0 + timeMod));
          const newElo = calculateNewElo5(currentRating, activePuzzle.numericRating, finalScore, puzzleIndex, null);

          const record: PuzzleAttemptRecord = {
            puzzleId: activePuzzle.id,
            puzzleTitle: activePuzzle.title,
            rating: activePuzzle.numericRating,
            userEloBefore: currentRating,
            userEloAfter: newElo,
            score: finalScore,
            commitment: null,
            helpUsed: "none",
            firstTryCorrect: true,
            timeMs: elapsed,
            moveSan: moveResult.san,
            status: "best",
            userMoveSan: activePuzzle.solutionMoves[0]?.san || moveResult.san,
            bestMoveSan: activePuzzle.solutionMoves.map((m) => m.san).join(" "),
            coachExplanation: activePuzzle.successExplanation,
            ruleTitle: activePuzzle.ruleTitle,
            ruleBody: activePuzzle.ruleBody,
          };

          const nextAttempts = [...attempts, record];
          setAttempts(nextAttempts);
          setCurrentRating(newElo);
          setPuzzleStatus("success");
          sounds.playVictory();
          if (diagnosticQuintetRef.current) {
            persistDiagnosticSession(diagnosticQuintetRef.current, puzzleIndex, nextAttempts, newElo);
          }
          return true;
        } else {
          // Missed follow-up move
          const elapsed = Date.now() - puzzleStartTimeRef.current;
          const finalScore = 0.65;
          const newElo = calculateNewElo5(currentRating, activePuzzle.numericRating, finalScore, puzzleIndex, null);
          sounds.playBlunder();
          const record: PuzzleAttemptRecord = {
            puzzleId: activePuzzle.id,
            puzzleTitle: activePuzzle.title,
            rating: activePuzzle.numericRating,
            userEloBefore: currentRating,
            userEloAfter: newElo,
            score: finalScore,
            commitment: null,
            helpUsed: "none",
            firstTryCorrect: false,
            timeMs: elapsed,
            moveSan: moveResult.san,
            status: "inaccurate",
            userMoveSan: moveResult.san,
            bestMoveSan: activePuzzle.solutionMoves.map((m) => m.san).join(" "),
            coachExplanation: `Accurate first move, but missed the final follow-up: ${activePuzzle.solutionMoves.map((m) => m.san).join(" ")}`,
            ruleTitle: activePuzzle.ruleTitle,
            ruleBody: activePuzzle.ruleBody,
          };
          const nextAttempts = [...attempts, record];
          setAttempts(nextAttempts);
          setCurrentRating(newElo);
          setPuzzleStatus("success");
          if (diagnosticQuintetRef.current) {
            persistDiagnosticSession(diagnosticQuintetRef.current, puzzleIndex, nextAttempts, newElo);
          }
          return true;
        }
      }
    }

    // PUZZLES 3, 4, 5: Standard Adaptive puzzles with Mandatory Commitment Step!
    sounds.playMove();
    const isBest = firstStep && firstStep.from === from && firstStep.to === to;

    setPendingMove({
      from,
      to,
      san: moveResult.san,
      isBestMove: isBest,
    });
    setShowCommitmentModal(true);
    return true;
  };

  // User selects Commitment (Sure / Think so / Guessing) for Puzzles 3, 4, 5
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

  // User cancels/reverts commitment move before locking conviction
  const handleCancelCommitment = () => {
    setShowCommitmentModal(false);
    setPendingMove(null);
    setSelectedSquare(null);
    setBoardKey((prev) => prev + 1);
  };

  // Finalize Move & Score for Puzzles 3, 4, 5
  const executeMoveDirectly = (
    from: string,
    to: string,
    san: string,
    isBestMove: boolean,
    commitment: CommitmentLevel | null
  ) => {
    if (!game) return;

    // Apply move to board with underpromotion awareness
    const firstStep = activePuzzle.solutionMoves[0];
    const expectedPromotion =
      firstStep && firstStep.from === from && firstStep.to === to && firstStep.promotion
        ? firstStep.promotion
        : "q";

    const newGame = new Chess(game.fen());
    const moveRes = newGame.move({ from, to, promotion: expectedPromotion });
    setGame(newGame);
    setLastMove({ from, to });

    const elapsed = Date.now() - puzzleStartTimeRef.current;

    // Pure Assessment: Play sound based on move outcome
    if (newGame.inCheck()) {
      sounds.playCheck();
    } else if (moveRes?.captured) {
      sounds.playCapture();
    } else {
      sounds.playMove();
    }

    if (isBestMove) {
      sounds.playVictory();
    } else {
      sounds.playBlunder();
    }
    setPuzzleStatus("success");

    const score = computeMoveScore(
      isBestMove,
      false,
      commitment,
      "none",
      commitment === "sure" && !isBestMove
    );
    const timeMod = computeTimeModifier(elapsed);
    const finalScore = Math.max(0, Math.min(1, score + (isBestMove ? timeMod : 0)));
    const newElo = calculateNewElo5(
      currentRating,
      activePuzzle.numericRating,
      finalScore,
      puzzleIndex,
      commitment,
      false
    );

    if (puzzleIndex === 2 && hasBookMemoryFlag && isBestMove) {
      setNoveltyVerified(true);
    }

    // If blunder on adaptive puzzle (P3-P5/P6), let BrowserStockfish WASM play the opponent's refutation after 450ms!
    if (!isBestMove && stockfishRef.current && stockfishRef.current.isReady()) {
      const fenAfterUserMove = newGame.fen();
      stockfishRef.current
        .evaluatePosition(fenAfterUserMove, 3000)
        .then((evalRes) => {
          if (evalRes.bestMove && evalRes.bestMove.length >= 4) {
            const oppFrom = evalRes.bestMove.slice(0, 2);
            const oppTo = evalRes.bestMove.slice(2, 4);
            const oppProm = evalRes.bestMove.length > 4 ? evalRes.bestMove[4] : undefined;
            setTimeout(() => {
              setGame((prev) => {
                if (!prev) return prev;
                try {
                  const g = new Chess(prev.fen());
                  const m = g.move({ from: oppFrom, to: oppTo, promotion: oppProm || "q" });
                  if (g.inCheck()) sounds.playCheck();
                  else if (m?.captured) sounds.playCapture();
                  else sounds.playRefutation();
                  setLastMove({ from: oppFrom, to: oppTo });
                  return g;
                } catch {
                  return prev;
                }
              });
            }, 450);
          }
        })
        .catch(() => {});
    }

    const categoryRule = getPuzzleCategoryRule(activePuzzle);
    const ruleTitle = activePuzzle.ruleTitle || categoryRule.ruleTitle;
    const ruleBody = activePuzzle.ruleBody || categoryRule.ruleBody;

    const record: PuzzleAttemptRecord = {
      puzzleId: activePuzzle.id,
      puzzleTitle: activePuzzle.title,
      rating: activePuzzle.numericRating,
      userEloBefore: currentRating,
      userEloAfter: newElo,
      score: finalScore,
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
        : (activePuzzle.defaultRefutation?.coachExplanation || `Tactical leak: Opponent punishes with active play. ${ruleBody}`),
      ruleTitle,
      ruleBody,
    };

    const nextAttempts = [...attempts, record];
    setAttempts(nextAttempts);
    setCurrentRating(newElo);
    if (diagnosticQuintetRef.current) {
      persistDiagnosticSession(diagnosticQuintetRef.current, puzzleIndex, nextAttempts, newElo);
    }
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
    try {
      const solGame = new Chess(activePuzzle.initialFen);
      for (let i = 0; i < activePuzzle.solutionMoves.length; i++) {
        const s = activePuzzle.solutionMoves[i];
        solGame.move({ from: s.from, to: s.to, promotion: s.promotion || "q" });
        const opp = activePuzzle.opponentResponses?.[i];
        if (opp) {
          solGame.move({ from: opp.from, to: opp.to, promotion: opp.promotion || "q" });
        }
      }
      setGame(solGame);
      setBoardKey((prev) => prev + 1);
      const lastStep = activePuzzle.solutionMoves[activePuzzle.solutionMoves.length - 1];
      if (lastStep) setLastMove({ from: lastStep.from, to: lastStep.to });
      setPuzzleStatus("success");
      setCurrentHelpUsed("solution");
      setFirstTryCorrect(false);

      const score = computeMoveScore(false, false, null, "solution", blunderedOnSure);
      const newElo = calculateNewElo(currentRating, activePuzzle.numericRating, score);
      setFeedbackMessage(`Solution: ${activePuzzle.solutionMoves.map((m) => m.san).join(" ")} — ${activePuzzle.successExplanation}`);

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
        moveSan: activePuzzle.solutionMoves[0]?.san || "",
        status: "blunder",
        userMoveSan: "View Solution",
        bestMoveSan: activePuzzle.solutionMoves.map((m) => m.san).join(" "),
        coachExplanation: activePuzzle.successExplanation,
        ruleTitle: activePuzzle.ruleTitle,
        ruleBody: activePuzzle.ruleBody,
      };

      const nextAttempts = [...attempts, record];
      setAttempts(nextAttempts);
      setCurrentRating(newElo);
      if (diagnosticQuintetRef.current) {
        persistDiagnosticSession(diagnosticQuintetRef.current, puzzleIndex, nextAttempts, newElo);
      }
    } catch {}
  };

  // Advance to next puzzle or start cognitive analysis
  const handleProceedNext = () => {
    const maxIndex = 4;

    if (puzzleIndex < maxIndex) {
      const nextIdx = puzzleIndex + 1;
      let nextPuz: ChessPuzzle & { numericRating: number };

      if (nextIdx === 1) {
        // Puzzle 2 is the Stage 2 historical benchmark from quintet
        nextPuz = diagnosticQuintetRef.current?.[1] || HISTORICAL_BENCHMARKS_STAGE_2[0];
      } else {
        const excluded = [
          activePuzzle.id,
          ...attempts.map((a) => a.puzzleId),
          ...(diagnosticQuintetRef.current?.slice(0, nextIdx).map((p) => p.id) || []),
        ];

        if (nextIdx === 2 && hasBookMemoryFlag) {
          // Novelty Crucible: pick an asymmetric non-opening tactical position to verify pure calculation!
          nextPuz = selectNoveltyCruciblePuzzle(currentRating, excluded);
        } else {
          nextPuz = selectAdaptivePuzzle(currentRating, excluded);
        }

        if (diagnosticQuintetRef.current) {
          diagnosticQuintetRef.current[nextIdx] = nextPuz;
        }
      }

      setPuzzleIndex(nextIdx);
      loadPuzzle(nextPuz);
      if (diagnosticQuintetRef.current) {
        persistDiagnosticSession(diagnosticQuintetRef.current, nextIdx, attempts, currentRating);
      }
    } else {
      // Reached end of trials -> Launch FIDE Cognitive Telemetry Analysis!
      startAnalyzingSequence();
    }
  };

  // Intermediate Cognitive Telemetry Sequence (2.4s custom calculation)
  const startAnalyzingSequence = () => {
    clearAnalysisTimers();
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
    const t1 = setTimeout(() => {
      setAnalyzingPhase(1);
    }, 800);
    analysisTimersRef.current.push(t1);

    const t2 = setTimeout(() => {
      setAnalyzingPhase(2);
    }, 1600);
    analysisTimersRef.current.push(t2);

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
    analysisTimersRef.current.push(interval);

    // Transition to final diagnosis screen after 2.5 seconds
    const t3 = setTimeout(() => {
      setIsAnalyzing(false);
      setIsFinalScreen(true);
      track("test_completed", { puzzleCount: attempts.length });
      try {
        sessionStorage.removeItem("chessz_diagnostic_session");
      } catch {}
    }, 2500);
    analysisTimersRef.current.push(t3);
  };

  // Start Personalized Training
  const handleStartPersonalizedTraining = () => {
    clearAnalysisTimers();
    try {
      sessionStorage.removeItem("chessz_diagnostic_session");
    } catch {}
    const levelInfo = mapEloToLevel(currentRating);
    router.push(`/?source=diagnosis&tier=${levelInfo.tierId}`);
  };

  // Custom square styles for annotations, hints, selection, last move, and king in check
  const getCustomSquareStyles = () => {
    const styles: Record<string, any> = {};

    // 1. Right-click tactical annotations (crisp tile framing with modern glowing perimeter)
    Object.entries(annotatedSquares).forEach(([sq, item]) => {
      styles[sq] = {
        backgroundColor: item.bg,
        boxShadow: `inset 0 0 0 2.5px ${item.border}, inset 0 0 14px ${item.border}35`,
      };
    });

    // 2. Hint square
    if (hintSquare) {
      styles[hintSquare] = {
        backgroundColor: "rgba(245, 158, 11, 0.45)",
        boxShadow: "inset 0 0 0 3px #f59e0b",
      };
    }

    // 3. Last move
    if (lastMove) {
      styles[lastMove.from] = {
        ...styles[lastMove.from],
        backgroundColor: "rgba(59, 130, 246, 0.25)",
      };
      styles[lastMove.to] = {
        ...styles[lastMove.to],
        backgroundColor: "rgba(59, 130, 246, 0.35)",
      };
    }

    // 4. Selected square
    if (selectedSquare) {
      styles[selectedSquare] = {
        backgroundColor: "rgba(59, 130, 246, 0.35)",
        boxShadow: "inset 0 0 0 2.5px #3b82f6",
      };
    }

    // 5. Legal moves dots and capture rings (calm dots & precision rings)
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

  const detectedPattern = classifyBehavioralPattern(attempts);
  const currentLevelInfo = mapEloToLevel(currentRating);

  const studyItems: CoachStudyItem[] = useMemo(() => {
    return attempts.map((att) => {
      const puz =
        BENCHMARK_PUZZLE_POOL.find((p) => p.id === att.puzzleId) ||
        HISTORICAL_BENCHMARKS_STAGE_1.find((p) => p.id === att.puzzleId) ||
        HISTORICAL_BENCHMARKS_STAGE_2.find((p) => p.id === att.puzzleId);

      return {
        id: att.puzzleId,
        title: att.puzzleTitle,
        initialFen: puz?.initialFen || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
        playerColor: puz?.playerColor || "white",
        userMoveSan: att.userMoveSan || att.moveSan,
        bestMoveSan: att.bestMoveSan || puz?.solutionMoves[0]?.san || "",
        status: att.status,
        timeMs: att.timeMs,
        prompt: puz?.prompt,
        ruleTitle: att.ruleTitle || puz?.ruleTitle,
        ruleBody: att.ruleBody || puz?.ruleBody,
        coachExplanation: att.coachExplanation || puz?.successExplanation,
        solutionMoves: puz?.solutionMoves,
        opponentResponses: puz?.opponentResponses,
        defaultRefutation: puz?.defaultRefutation,
      };
    });
  }, [attempts]);

  return (
    <main
      className="min-h-screen flex flex-col p-2.5 sm:p-4 md:px-6 md:py-3 font-sans transition-colors duration-200"
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom, 0.75rem))" }}
    >
      {/* Settings Modal Component */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />

      {/* Psychological Conviction Modal (Fluid Mobile Bottom-Sheet & Desktop Centered Dialog) */}
      <ConfidenceModal
        isOpen={showCommitmentModal && !!pendingMove}
        moveSan={pendingMove?.san || ""}
        onSelect={handleSelectCommitment}
        onCancel={handleCancelCommitment}
      />

      {/* Lichess Account & Sync Modal */}
      <LichessModal
        isOpen={showLichessModal}
        onClose={() => setShowLichessModal(false)}
        user={lichessUser}
        isAuthenticated={isLichessAuthenticated}
        loading={isLichessLoading}
        onLogin={() => loginLichess('/diagnose')}
        onLogout={logoutLichess}
        onRefresh={refreshLichess}
        onConnectUsername={connectLichessUsername}
        diagnosedElo={currentRating}
      />

      {/* Coach Study Mode Data Memo */}
      {(() => null)()}

      {/* Interactive Coach Study Mode Modal */}
      <CoachStudyModal
        isOpen={showStudyModal}
        onClose={() => setShowStudyModal(false)}
        title="Diagnostic Benchmark Study Session"
        subtitle="Review your 5 tactical diagnostic positions move-by-move with private academy coach guidance."
        items={studyItems}
      />

      {/* Top Header */}
      <header className="w-full max-w-md md:max-w-5xl lg:max-w-6xl mx-auto flex items-center justify-between py-2 px-3 sm:px-4 rounded-2xl theme-surface mb-3 shrink-0 border shadow-xs relative z-30">
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="flex items-center gap-2 cursor-pointer group"
            title="ChessZ Home"
          >
            <div className="w-7 h-7 rounded-xl overflow-hidden shrink-0 shadow-xs flex items-center justify-center group-hover:opacity-90 transition-opacity">
              <ChessZMark size={28} treatment="tight" className="w-full h-full" />
            </div>
            <span className="font-extrabold text-sm sm:text-base tracking-tight theme-text-primary font-display">
              ChessZ
            </span>
          </Link>

          </div>

        <div className="flex items-center gap-1.5">
          {/* Lichess Account / Sync Button */}
          <button
            onClick={() => setShowLichessModal(true)}
            className={`flex items-center gap-2 text-[11px] font-mono font-semibold px-3 py-1.5 rounded-xl cursor-pointer transition-all border ${
              lichessUser
                ? "bg-amber-100/90 dark:bg-amber-950/40 border-amber-300/90 dark:border-amber-500/40 text-amber-950 dark:text-amber-200 hover:bg-amber-200/80 dark:hover:bg-amber-900/50 shadow-2xs"
                : "theme-surface hover:theme-surface-subtle"
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
            onClick={() => {
              clearAnalysisTimers();
              try {
                sessionStorage.removeItem("chessz_diagnostic_session");
              } catch {}
            }}
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
              <div className="w-full max-w-[360px] sm:max-w-[420px] md:max-w-[480px] flex items-center justify-between mb-2 px-1 text-xs">
                <div className="flex items-center gap-2">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      puzzleStatus === "success"
                        ? "bg-emerald-500 shadow-sm"
                        : game.turn() === "w"
                        ? "bg-[var(--accent-primary)] shadow-sm"
                        : "theme-surface-subtle border-2 border-neutral-500"
                    }`}
                  />
                  <span className="font-extrabold text-xs sm:text-sm tracking-wider font-display uppercase theme-text-primary">
                    {puzzleStatus === "success"
                      ? (game.inCheck() ? "Checkmate! Move Recorded" : "Move Recorded")
                      : (activePuzzle.playerColor === "white" ? "White to move" : "Black to move")}
                  </span>
                </div>
                <span className="text-[11px] font-mono theme-text-muted">
                  {activePuzzle.playerColor === "white" ? "Playing White" : "Playing Black"}
                </span>
              </div>
            )}
            {game && (
              <div
                id="current-puzzle-meta"
                data-from={activePuzzle.solutionMoves[solutionStepIndex]?.from || activePuzzle.solutionMoves[0]?.from}
                data-to={activePuzzle.solutionMoves[solutionStepIndex]?.to || activePuzzle.solutionMoves[0]?.to}
                className="hidden"
              />
            )}
            {game && (
              <div className="touch-none select-none">
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
              </div>
            )}

            {/* Square marking, reachable by tap as well as by modifier. */}
            {puzzleStatus === "solving" && game && (
              <div className="w-full mt-2 flex justify-center overflow-x-auto">
                <AnnotationPalette
                  active={activeAnnotationColor}
                  onSelect={setActiveAnnotationColor}
                  onClear={() => setAnnotatedSquares({})}
                  hasMarks={Object.keys(annotatedSquares).length > 0}
                />
              </div>
            )}
          </div>

          {/* Right Column: Dynamic Diagnosis Console */}
          <div
            className="flex flex-col justify-between w-full max-w-sm md:w-80 lg:w-96 shrink-0 theme-surface rounded-2xl p-3 sm:p-4 shadow-xl border overflow-y-auto min-h-[120px]"
            style={{ height: isMobileView ? "auto" : boardWidth + bezelSize * 2 }}
          >
            {/* Top: Progress and Step Indicator */}
            <div>
              <div className="flex items-center justify-between pb-1.5 sm:pb-2 mb-2 sm:mb-3 border-b border-[var(--border-subtle)]">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold theme-pill px-2.5 py-1 rounded-lg">
                  <Target className="w-3.5 h-3.5 text-[var(--accent-primary)]" />
                  <span>Puzzle {puzzleIndex + 1} of 5</span>
                </div>
                <span className="text-[11px] font-mono theme-text-muted">
                  {puzzleIndex === 0
                    ? "Opening Traps & Awareness"
                    : puzzleIndex === 1
                    ? "Tactical Patterns"
                    : puzzleIndex === 2 && hasBookMemoryFlag
                    ? "Fresh Position (Pure Calculation)"
                    : puzzleIndex === 5
                    ? "Master Challenge"
                    : `Skill Test`}
                </span>
              </div>

              {/* Progress Segment Bar */}
              <div className={"grid grid-cols-5 gap-1.5 w-full mb-2 sm:mb-3"}>
                {Array.from({ length: 5 }).map((_, idx) => (
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
              <div className="theme-surface-subtle p-2.5 sm:p-3 rounded-xl border mb-2.5 sm:mb-3">
                <div className="text-[10px] sm:text-[11px] font-bold text-[var(--accent-primary)] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Tactical Objective</span>
                </div>
                <p className="text-xs sm:text-sm theme-text-primary font-medium leading-relaxed">
                  {activePuzzle.prompt.includes("to move:") ? (
                    <>
                      <strong className="font-extrabold font-display text-[var(--accent-primary)] uppercase tracking-wide mr-1.5">
                        {activePuzzle.prompt.split("to move:")[0]}to move:
                      </strong>
                      <span>{activePuzzle.prompt.split("to move:")[1]}</span>
                    </>
                  ) : (
                    activePuzzle.prompt
                  )}
                </p>
              </div>

              {/* Move Submitted Quiet Banner (No In-Test Spoilers) */}
              {puzzleStatus === "success" && (
                <div className="theme-surface border border-[var(--border-focus)] p-2.5 sm:p-3 rounded-xl shadow-xs mb-2.5 sm:mb-3 flex items-center justify-between animate-card-entrance">
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
                  className="group relative w-full py-3 px-4 rounded-xl theme-accent-btn font-bold text-xs sm:text-sm tracking-wide flex items-center justify-center gap-2 shadow-sm transition-all duration-200 active:scale-[0.98] cursor-pointer animate-next-btn btn-shimmer-effect hover:-translate-y-0.5 hover:shadow-md"
                >
                  <span className="relative z-10">
                    {puzzleIndex === 4 ? "See What To Train" : "Next Puzzle"}
                  </span>
                  <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1.5 transition-transform duration-200 ease-out animate-arrow-nudge" />
                </button>
              )}

              {puzzleStatus === "solving" && !showCommitmentModal && (
                <div className="text-center py-1.5 text-[11px] font-mono theme-text-muted">
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
                {analyzingPhase === 2 && "Calibrating Tournament Elo Model..."}
              </h2>
              <p className="text-xs theme-text-secondary mt-1">
                Analyzing your calculation footprint and decision timing across all {attempts.length} benchmark positions.
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
              {/* Real Data Card 1: Real Seconds Per Move */}
              <div className={`p-3 rounded-xl border transition-all duration-300 ${
                analyzingPhase >= 0
                  ? "theme-surface border-[var(--border-focus)] shadow-xs"
                  : "opacity-40 theme-surface-subtle"
              }`}>
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="font-bold flex items-center gap-1.5 theme-text-primary">
                    <Clock className="w-3.5 h-3.5 text-sky-500" />
                    <span>Thinking Speed</span>
                  </span>
                  <span className="theme-text-muted">
                    Total: {((attempts.reduce((acc, a) => acc + (a.timeMs || 4000), 0)) / 1000).toFixed(1)}s
                  </span>
                </div>
                <div className={`grid ${attempts.length > 5 ? "grid-cols-6" : "grid-cols-5"} gap-1 text-center text-[10px]`}>
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

              {/* Real Data Card 2: Confidence & Intuition */}
              <div className={`p-3 rounded-xl border transition-all duration-300 ${
                analyzingPhase >= 1
                  ? "theme-surface border-[var(--border-focus)] shadow-xs"
                  : "opacity-40 theme-surface-subtle"
              }`}>
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="font-bold flex items-center gap-1.5 theme-text-primary">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>Confidence & Intuition</span>
                  </span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {detectedPattern.patternName}
                  </span>
                </div>
                <div className="text-[11px] theme-text-secondary leading-snug">
                  Your confidence:{" "}
                  {attempts.slice(2).filter((a) => a.commitment).length > 0 ? (
                    attempts
                      .slice(2)
                      .filter((a) => a.commitment)
                      .map((a, i) => (
                        <span key={i} className="mr-2">
                          P{i + 3}: <strong className="font-semibold theme-text-primary">{a.commitment?.replace("_", " ").toUpperCase()}</strong>
                        </span>
                      ))
                  ) : (
                    <span>Fast intuition across all moves</span>
                  )}
                </div>
              </div>

              {/* Real Data Card 3: Rating Calculation */}
              <div className={`p-3 rounded-xl border transition-all duration-300 ${
                analyzingPhase >= 2
                  ? "theme-surface border-[var(--border-focus)] shadow-xs"
                  : "opacity-40 theme-surface-subtle"
              }`}>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold flex items-center gap-1.5 theme-text-primary">
                    <Target className="w-3.5 h-3.5 text-rose-500" />
                    <span>Calculating Rating</span>
                  </span>
                  <span className="text-base font-extrabold text-[var(--accent-primary)] font-mono">
                    ~{displayElo} Elo
                  </span>
                </div>
                <div className="flex items-center justify-between text-[10px] theme-text-muted mt-1">
                  <span>Starting: 1250</span>
                  <span className="font-semibold theme-text-primary">
                    Level: {currentLevelInfo.levelName}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Status Ticker */}
            <div className="text-center text-[11px] font-mono theme-text-muted flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Building your custom practice plan...</span>
            </div>
          </div>
        </section>
      ) : (
        /* Screen 2: The Final Level Diagnosis Bento Dossier */
        <section className="flex-1 flex flex-col items-center justify-center max-w-md md:max-w-3xl lg:max-w-4xl mx-auto w-full py-2 sm:py-4 min-h-0 animate-card-entrance">
          <div className="w-full max-h-[88vh] overflow-y-auto custom-scrollbar theme-surface rounded-3xl p-4 sm:p-7 shadow-2xl border relative space-y-4 sm:space-y-6">
            {/* Top Bento Header Strip */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border-subtle)] gap-2">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-500 flex items-center justify-center font-bold border border-amber-500/30 shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-wider text-[var(--accent-primary)] block">
                    Calibration Dossier
                  </span>
                  <h2 className="text-xs sm:text-sm font-extrabold theme-text-primary font-display">
                    Tactical Diagnostic Assessment Complete
                  </h2>
                </div>
              </div>
              <span className="text-[10px] font-mono theme-text-muted px-2.5 py-1 rounded-full theme-surface-subtle border shrink-0">
                "5-Puzzle Diagnostic Benchmark"
              </span>
            </div>

            {/* Bento Grid Row: Hero Tile + Archetype Tile */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 sm:gap-4">
              {/* Tile 1: Hero Level & Elo Spotlight */}
              <div className="md:col-span-6 lg:col-span-5 theme-surface-subtle rounded-3xl p-5 sm:p-6 border border-[var(--border-focus)]/50 shadow-sm flex flex-col justify-between relative overflow-hidden group">
                <div>
                  <span className="text-[11px] uppercase tracking-widest font-mono font-semibold theme-text-muted block mb-1">
                    Train this next
                  </span>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight theme-text-primary font-display">
                    {detectedPattern.weakness}
                  </h1>
                  <p className="text-xs theme-text-secondary leading-relaxed mt-2">
                    {detectedPattern.insight}
                  </p>

                  <div className="mt-4 p-3.5 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border-subtle)] flex items-center justify-between gap-3">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider theme-text-muted block">
                        Starting estimate
                      </span>
                      <span className="text-xl font-black font-mono text-[var(--accent-primary)] tracking-tight">
                        ~{currentRating}
                      </span>
                      <span className="text-[11px] font-mono theme-text-muted ml-1">
                        Elo &middot; {currentLevelInfo.levelName}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-[10px] font-mono uppercase tracking-wider theme-text-muted block">
                        Clean moves
                      </span>
                      <span className="text-lg font-bold font-mono text-emerald-500">
                        {attempts.filter((a) => a.status === "best").length} / {attempts.length}
                      </span>
                    </div>
                  </div>

                  <p className="text-[10px] theme-text-muted mt-2 leading-relaxed">
                    Five puzzles is a starting point, not a rating. Your own games
                    measure you far better &mdash; scan them from the board.
                  </p>

                  {/* Calculation & Master Badges */}
                  {noveltyVerified && (
                    <div className="mt-3.5 flex flex-wrap gap-2">
                      {noveltyVerified && (
                        <span className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Calculation Verified</span>
                        </span>
                      )}
                    </div>
                  )}
                </div>

              </div>

              {/* Right Side Bento Column: Archetype + Live Platform Calibration */}
              <div className="md:col-span-6 lg:col-span-7 flex flex-col gap-3.5 sm:gap-4">
                {/* Tile 2: Playing Style & Psychological Archetype */}
                <div className="theme-surface-subtle rounded-3xl p-5 sm:p-6 border border-[var(--border-subtle)] shadow-sm flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--accent-primary)]">
                        <Award className="w-4 h-4" />
                        <span>Cognitive Archetype</span>
                      </div>
                      <span className="text-xs font-extrabold font-display theme-text-primary px-2.5 py-0.5 rounded-full bg-[var(--surface-muted)] border">
                        {detectedPattern.patternName}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm theme-text-primary italic leading-relaxed my-2">
                      &ldquo;{detectedPattern.insight}&rdquo;
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2.5 mt-3 pt-3 border-t border-[var(--border-subtle)]">
                    <div className="p-2.5 rounded-2xl theme-surface border border-[var(--border-subtle)]">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-500 block mb-0.5">
                        Core Strength
                      </span>
                      <span className="text-xs font-semibold theme-text-primary block leading-tight">
                        {detectedPattern.strength}
                      </span>
                    </div>
                    <div className="p-2.5 rounded-2xl theme-surface border border-[var(--border-subtle)]">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-500 block mb-0.5">
                        Target Leak
                      </span>
                      <span className="text-xs font-semibold theme-text-primary block leading-tight">
                        {detectedPattern.weakness}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Tile 3: Cross-Platform Calibration Tile */}
                <div className="theme-surface-subtle rounded-3xl p-4 sm:p-5 border border-[var(--border-subtle)] shadow-sm">
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2">
                      <LichessIcon className="w-4 h-4 text-amber-800 dark:text-amber-400" />
                      <span className="text-xs font-bold font-mono tracking-tight theme-text-primary">
                        Platform Calibration
                      </span>
                    </div>
                    {lichessUser ? (
                      <button
                        onClick={() => setShowLichessModal(true)}
                        className="text-[11px] font-mono text-[var(--accent-primary)] hover:underline cursor-pointer"
                      >
                        @{lichessUser.username} &rarr;
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowLichessModal(true)}
                        className="text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/40 text-amber-950 dark:text-amber-200 border border-amber-300 dark:border-amber-500/30 hover:bg-amber-200 dark:hover:bg-amber-900/50 transition cursor-pointer"
                      >
                        Verify with Lichess
                      </button>
                    )}
                  </div>

                  {lichessUser ? (
                    <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
                      <div className="p-2 rounded-xl bg-[var(--surface-muted)] border border-[var(--border-subtle)]">
                        <span className="text-[10px] theme-text-muted block">Diagnosed</span>
                        <span className="font-extrabold text-sm theme-text-primary">~{currentRating}</span>
                      </div>
                      <div className="p-2 rounded-xl bg-[var(--surface-muted)] border border-[var(--border-subtle)]">
                        <span className="text-[10px] theme-text-muted block">Lichess Rapid</span>
                        <span className="font-extrabold text-sm theme-text-primary">
                          {lichessUser.perfs?.rapid?.rating || lichessUser.perfs?.blitz?.rating || "—"}
                        </span>
                      </div>
                      <div className="p-2 rounded-xl bg-[var(--surface-muted)] border border-[var(--border-subtle)]">
                        <span className="text-[10px] theme-text-muted block">Variance</span>
                        <span className="font-extrabold text-sm text-emerald-400">
                          {(() => {
                            const targetRating = lichessUser.perfs?.rapid?.rating || lichessUser.perfs?.blitz?.rating;
                            if (!targetRating) return "Synced";
                            const diff = currentRating - targetRating;
                            return `${diff > 0 ? "+" : ""}${diff} Elo`;
                          })()}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <p className="text-[11px] theme-text-secondary leading-relaxed">
                      ChessZ calibrates against realistic tournament and Lichess benchmarks so you get true playing strength, not inflated puzzle ratings.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Tile 4: Benchmark Solutions & Tactical Timeline */}
            <div className="theme-surface-subtle rounded-3xl p-4 sm:p-6 border border-[var(--border-subtle)] shadow-sm">
              <div className="flex items-center justify-between mb-3.5 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-[var(--accent-primary)]" />
                  <span className="text-xs sm:text-sm font-bold theme-text-primary font-display">
                    Benchmark Breakdown & Solutions
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowStudyModal(true)}
                    className="text-xs font-mono font-bold px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-xs"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>🎓 Move-by-Move Coach Study</span>
                  </button>
                  <span className="text-[10px] font-mono theme-text-muted px-2.5 py-0.5 rounded-full bg-[var(--surface-muted)] border hidden sm:inline">
                    {attempts.length} Positions Analyzed
                  </span>
                </div>
              </div>

              {/* Quick Visual Timeline Ribbon */}
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-1.5 sm:gap-2 mb-4">
                {attempts.map((att, i) => {
                  const isBest = att.status === "best";
                  const isInaccurate = att.status === "inaccurate";
                  return (
                    <div
                      key={i}
                      className={`p-2 rounded-xl border text-center transition ${
                        isBest
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-500"
                          : isInaccurate
                          ? "bg-amber-500/10 border-amber-500/30 text-amber-500"
                          : "bg-rose-500/10 border-rose-500/30 text-rose-500"
                      }`}
                    >
                      <span className="text-[9px] font-mono block opacity-75">P{i + 1}</span>
                      <span className="text-xs font-bold font-mono block">
                        {isBest ? "✓" : isInaccurate ? "!" : "✗"}
                      </span>
                      <span className="text-[9px] font-mono block opacity-75 mt-0.5">
                        {att.timeMs ? `${(att.timeMs / 1000).toFixed(1)}s` : "—"}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Detailed Cards List */}
              <div className="space-y-3">
                {attempts.map((att, idx) => {
                  const isBest = att.status === "best";
                  const isInaccurate = att.status === "inaccurate";
                  return (
                    <div
                      key={idx}
                      className="p-3.5 sm:p-4 rounded-2xl theme-surface border border-[var(--border-subtle)] hover:border-[var(--border-focus)] transition shadow-xs"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <div className="text-[10px] font-mono uppercase tracking-wider theme-text-muted">
                            Puzzle {idx + 1} &bull; {att.puzzleTitle}
                          </div>
                          <div className="text-xs font-bold theme-text-primary mt-0.5">
                            Your Move:{" "}
                            <span className="font-mono font-extrabold text-[var(--accent-primary)]">
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
                      <div className="text-[11px] theme-text-secondary mb-2 bg-[var(--surface-muted)] p-2.5 rounded-xl border border-[var(--border-subtle)] font-mono flex items-center justify-between">
                        <div>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                            Master Continuation:{" "}
                          </span>
                          <span className="theme-text-primary font-bold">
                            {att.bestMoveSan || "—"}
                          </span>
                        </div>
                        {att.timeMs && (
                          <span className="text-[10px] text-neutral-400 font-mono">
                            {(att.timeMs / 1000).toFixed(1)}s elapsed
                          </span>
                        )}
                      </div>

                      {/* Coach Explanation */}
                      {att.coachExplanation && (
                        <p className="text-xs theme-text-primary leading-relaxed mb-2">
                          {att.coachExplanation}
                        </p>
                      )}

                      {/* Pedagogical Takeaway Box */}
                      {att.ruleTitle && att.ruleBody && (
                        <div className="text-[11px] theme-surface-subtle p-2.5 rounded-xl border border-[var(--border-focus)]/40 flex items-start gap-2">
                          <span className="text-amber-500 font-bold shrink-0">💡</span>
                          <div>
                            <span className="font-bold theme-text-primary mr-1">
                              <TermHoverCard term={att.ruleTitle} showIcon />:
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

            {/* Bottom Launchpad CTAs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowStudyModal(true)}
                className="w-full py-4 px-4 rounded-2xl theme-surface border border-emerald-500/40 hover:border-emerald-500 hover:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-md transition cursor-pointer active:scale-[0.98]"
              >
                <BookOpen className="w-4 h-4" />
                <span>🎓 Coach Study Mode</span>
              </button>

              <button
                onClick={handleStartPersonalizedTraining}
                className="w-full py-4 px-4 rounded-2xl theme-accent-btn font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg transition cursor-pointer active:scale-[0.98] hover:shadow-xl group"
              >
                <span>Start Training</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Footer Branding */}
      <footer className="w-full text-center py-1 shrink-0 text-[11px] font-mono theme-text-muted">
        ChessZ Cognitive Benchmark &bull; Client-Side &bull; Powered by Public Domain & Lichess Open Database
      </footer>
    </main>
  );
}
