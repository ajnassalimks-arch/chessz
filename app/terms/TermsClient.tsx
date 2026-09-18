"use client";

import React, { useState, useEffect, useRef, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Chess } from "chess.js";
import { Chessboard, defaultArrowOptions } from "react-chessboard";
import {
  BookOpen,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Volume2,
  VolumeX,
  Settings,
  Search,
  CheckCircle2,
  AlertTriangle,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Award,
  Zap,
  Shield,
  Layers,
  HelpCircle,
  Flame,
  Swords,
  Target
} from "lucide-react";
import { ChessZMark } from "@/components/ChessZLogo";
import { ChessboardFrame } from "@/components/ChessboardFrame";
import { SettingsModal } from "@/components/SettingsModal";
import { getPieceSet, PieceSetStyle } from "@/components/pieces/PieceSets2D";
import { sounds } from "@/lib/sounds";
import {
  CHESS_STUDY_TERMS,
  ChessStudyTerm,
  TermCategory,
  TermTier,
  CandidateMove,
  getTermDefinition
} from "@/lib/studyTerms";

function TermsContent() {
  const searchParams = useSearchParams();
  const initialTermQuery = searchParams.get("term") || searchParams.get("id");

  // Selection & filtering state
  const [selectedCategory, setSelectedCategory] = useState<TermCategory | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTermId, setSelectedTermId] = useState<string>(() => {
    if (initialTermQuery) {
      const match = getTermDefinition(initialTermQuery);
      if (match) return match.id;
    }
    return CHESS_STUDY_TERMS[0].id;
  });

  // Active study term
  const currentTerm: ChessStudyTerm = useMemo(() => {
    return CHESS_STUDY_TERMS.find((t) => t.id === selectedTermId) || CHESS_STUDY_TERMS[0];
  }, [selectedTermId]);

  // Tab mode: 'brainstorm' | 'walkthrough' | 'dossier'
  const [activeTab, setActiveTab] = useState<"brainstorm" | "walkthrough" | "dossier">("brainstorm");

  // Board state & game instance
  const [game, setGame] = useState<Chess>(() => new Chess(currentTerm.fen));
  const [boardOrientation, setBoardOrientation] = useState<"white" | "black">(currentTerm.playerColor);
  const [activeCandidate, setActiveCandidate] = useState<CandidateMove | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const boardContainerRef = useRef<HTMLDivElement>(null);
  const [boardWidth, setBoardWidth] = useState<number>(380);
  const [bezelSize, setBezelSize] = useState<number>(18);

  // Settings & Theme state
  const [showSettingsModal, setShowSettingsModal] = useState<boolean>(false);
  const [pieceSet, setPieceSet] = useState<PieceSetStyle>("default");
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Audio mute init
  useEffect(() => {
    setIsMuted(sounds.getMuted());
    const savedSet = localStorage.getItem("chessz_piece_set") as PieceSetStyle;
    if (savedSet) setPieceSet(savedSet);
  }, []);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    sounds.setMuted(nextMuted);
  };

  // Sync with search parameter if changed
  useEffect(() => {
    if (initialTermQuery) {
      const match = getTermDefinition(initialTermQuery);
      if (match) {
        setSelectedTermId(match.id);
      }
    }
  }, [initialTermQuery]);

  // Reset board when selectedTerm changes
  useEffect(() => {
    const newGame = new Chess(currentTerm.fen);
    setGame(newGame);
    setBoardOrientation(currentTerm.playerColor);
    setActiveCandidate(null);
    setCurrentStepIndex(0);
    setIsAutoPlaying(false);
  }, [currentTerm]);

  // Responsive container-aware board sizing
  useEffect(() => {
    const el = boardContainerRef.current;
    if (!el) return;

    const updateDimensions = () => {
      const containerWidth = el.clientWidth;
      if (!containerWidth) return;

      const bezel = containerWidth < 380 ? 14 : containerWidth < 520 ? 16 : 18;
      setBezelSize(bezel);

      // Card has padding (p-2 sm:p-3 = 16px to 24px) plus bezel (2 * bezel) + border clearance
      const padding = containerWidth < 640 ? 16 : 24;
      const totalMargin = padding + bezel * 2 + 8;
      const availableSize = Math.floor(containerWidth - totalMargin);

      // Clamp board size between 220px and 450px
      const clamped = Math.max(220, Math.min(availableSize, 450));
      setBoardWidth(clamped);
    };

    updateDimensions();

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(() => {
        updateDimensions();
      });
      resizeObserver.observe(el);
    }

    window.addEventListener("resize", updateDimensions);

    return () => {
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      window.removeEventListener("resize", updateDimensions);
    };
  }, []);

  // Auto-play stepper effect
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isAutoPlaying) {
      timer = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev >= currentTerm.masterLine.length) {
            setIsAutoPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1600);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAutoPlaying, currentTerm.masterLine.length]);

  // Sync board position with currentStepIndex in walkthrough mode
  useEffect(() => {
    if (activeTab === "walkthrough") {
      const g = new Chess(currentTerm.fen);
      for (let i = 0; i < currentStepIndex; i++) {
        const step = currentTerm.masterLine[i];
        if (step) {
          try {
            g.move({ from: step.from, to: step.to, promotion: step.promotion || "q" });
          } catch (e) {}
        }
      }
      setGame(new Chess(g.fen()));
      if (currentStepIndex > 0) {
        sounds.playMove();
      }
    }
  }, [currentStepIndex, activeTab, currentTerm]);

  // Filtered terms list
  const filteredTerms = useMemo(() => {
    return CHESS_STUDY_TERMS.filter((term) => {
      const matchesCategory =
        selectedCategory === "all" || term.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        term.termName.toLowerCase().includes(q) ||
        term.ruleTitle.toLowerCase().includes(q) ||
        term.historicalSource.white.toLowerCase().includes(q) ||
        term.historicalSource.black.toLowerCase().includes(q) ||
        term.historicalSource.event.toLowerCase().includes(q) ||
        term.aliases.some((a) => a.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Handle Candidate Move selection in Brainstorm Mode
  const handleSelectCandidate = (candidate: CandidateMove) => {
    setActiveCandidate(candidate);
    const testGame = new Chess(currentTerm.fen);
    try {
      testGame.move({
        from: candidate.from,
        to: candidate.to,
        promotion: candidate.promotion || "q"
      });
      setGame(testGame);
      if (candidate.isBest) {
        sounds.playVictory();
      } else {
        sounds.playRefutation();
      }
    } catch (e) {}
  };

  // Reset to initial position
  const handleResetPosition = () => {
    setGame(new Chess(currentTerm.fen));
    setActiveCandidate(null);
    setCurrentStepIndex(0);
    setIsAutoPlaying(false);
    sounds.playMove();
  };

  // On board move attempt
  const handlePieceDrop = ({ sourceSquare, targetSquare }: { sourceSquare: string; targetSquare: string | null }): boolean => {
    if (!targetSquare) return false;
    // Check if move matches candidate move
    const candidate = currentTerm.candidateMoves.find(
      (c) => c.from === sourceSquare && c.to === targetSquare
    );

    if (candidate) {
      handleSelectCandidate(candidate);
      return true;
    }

    // Otherwise test if it's a legal move
    const testGame = new Chess(game.fen());
    try {
      const res = testGame.move({ from: sourceSquare, to: targetSquare, promotion: "q" });
      if (res) {
        setGame(testGame);
        sounds.playMove();
        // Custom coach response for an unexpected legal move
        setActiveCandidate({
          san: res.san,
          from: sourceSquare,
          to: targetSquare,
          isBest: false,
          label: `Your Move (${res.san})`,
          coachFeedback: `Legal move! But notice how this differs from the primary theme (${currentTerm.ruleTitle}). Compare this with the Master Move (${currentTerm.candidateMoves.find((c) => c.isBest)?.san}) to see why tactical precision matters.`
        });
        return true;
      }
    } catch (e) {}
    return false;
  };

  // Category Badges & Colors
  const getCategoryTheme = (cat: TermCategory) => {
    switch (cat) {
      case "tactical":
        return {
          label: "Tactics & Weapons",
          bg: "bg-sky-500/10 text-sky-600 dark:text-sky-300 border-sky-500/25",
          dot: "bg-sky-500",
        };
      case "opening_traps":
        return {
          label: "Opening & Traps",
          bg: "bg-amber-500/10 text-amber-600 dark:text-amber-300 border-amber-500/25",
          dot: "bg-amber-500",
        };
      case "positional_endgame":
        return {
          label: "Positional & Endgame",
          bg: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300 border-emerald-500/25",
          dot: "bg-emerald-500",
        };
      case "diagnostics":
        return {
          label: "Engine & Diagnostics",
          bg: "bg-purple-500/10 text-purple-600 dark:text-purple-300 border-purple-500/25",
          dot: "bg-purple-500",
        };
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-start p-2 sm:p-4 md:p-6 select-none bg-[var(--background)]">
      {/* Top Global Navigation Header */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between py-2.5 px-3.5 sm:px-4 rounded-2xl theme-surface mb-3 shrink-0 border shadow-xs relative z-30">
        <div className="flex items-center gap-2.5">
          <Link
            href="/"
            className="flex items-center gap-2 cursor-pointer group text-left"
            title="ChessZ Home"
          >
            <div className="w-7 h-7 rounded-xl overflow-hidden shrink-0 shadow-xs flex items-center justify-center group-hover:opacity-90 transition-opacity">
              <ChessZMark size={28} treatment="tight" className="w-full h-full" />
            </div>
            <span className="font-extrabold text-sm sm:text-base tracking-tight theme-text-primary font-display">
              ChessZ
            </span>
          </Link>

          {/* Harmonized Global Navigation */}
          <nav className="hidden md:flex items-center gap-1 ml-2 pl-2 border-l border-[var(--border-subtle)] text-xs font-mono">
            <Link
              href="/"
              className="px-2.5 py-1 rounded-lg font-semibold theme-text-secondary hover:theme-text-primary hover:bg-[var(--surface-muted)] transition"
            >
              Train
            </Link>
            <Link
              href="/diagnose"
              className="px-2.5 py-1 rounded-lg font-semibold theme-text-secondary hover:theme-text-primary hover:bg-[var(--surface-muted)] transition flex items-center gap-1"
            >
              <span>Skill Test</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-[var(--accent-primary)]/20 text-[var(--accent-primary)] font-bold">5m</span>
            </Link>
            <Link
              href="/weakness"
              className="px-2.5 py-1 rounded-lg font-semibold theme-text-secondary hover:theme-text-primary hover:bg-[var(--surface-muted)] transition flex items-center gap-1"
            >
              <span>Weakness Studio</span>
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400"></span>
            </Link>
            <div className="px-2.5 py-1 rounded-lg font-semibold bg-[var(--accent-primary)]/15 text-[var(--accent-primary)] flex items-center gap-1.5">
              <BookOpen className="w-3 h-3" />
              <span>Study Terms</span>
              <span className="text-[9px] px-1 py-0.2 rounded bg-[var(--accent-primary)]/25 font-bold">Coach</span>
            </div>
          </nav>
        </div>

        <div className="flex items-center gap-1.5">
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

          {/* Back to Training Action */}
          <Link
            href="/"
            className="flex items-center gap-1 text-[11px] font-mono font-bold theme-accent-btn px-2.5 py-1.5 rounded-xl transition cursor-pointer shadow-xs"
          >
            <Swords className="w-3 h-3" />
            <span>Play Arena</span>
          </Link>
        </div>
      </header>

      {/* Main Container: Responsive Layout with Fixed-Width Catalog Sidebar */}
      <div className="w-full max-w-[1400px] mx-auto flex-1 flex flex-col lg:flex-row gap-4 items-start">
        {/* Left Column: Terms Catalog & Filters */}
        <aside className="w-full lg:w-72 xl:w-80 shrink-0 flex flex-col gap-3 rounded-3xl theme-surface border border-[var(--border-subtle)] p-3 sm:p-4 shadow-sm">
          {/* Section Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-[var(--accent-primary)]/10 text-[var(--accent-primary)] flex items-center justify-center">
                <BookOpen className="w-4 h-4" />
              </div>
              <h2 className="text-sm font-extrabold theme-text-primary font-display">
                ChessZ Terms Catalog
              </h2>
            </div>
            <span className="text-[11px] font-mono theme-text-muted">
              {filteredTerms.length} / {CHESS_STUDY_TERMS.length}
            </span>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 theme-text-muted pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search terms, players, rules..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl theme-surface-subtle border border-[var(--border-subtle)] text-xs theme-text-primary placeholder:theme-text-muted focus:outline-hidden focus:border-[var(--accent-primary)] transition"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1 text-[10px] font-mono">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-2 py-1 rounded-lg border transition cursor-pointer ${
                selectedCategory === "all"
                  ? "bg-[var(--accent-primary)] text-white border-transparent font-bold"
                  : "theme-surface theme-surface-hover theme-text-secondary"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedCategory("tactical")}
              className={`px-2 py-1 rounded-lg border transition cursor-pointer ${
                selectedCategory === "tactical"
                  ? "bg-sky-500 text-white border-transparent font-bold"
                  : "theme-surface theme-surface-hover theme-text-secondary"
              }`}
            >
              Tactics
            </button>
            <button
              onClick={() => setSelectedCategory("opening_traps")}
              className={`px-2 py-1 rounded-lg border transition cursor-pointer ${
                selectedCategory === "opening_traps"
                  ? "bg-amber-500 text-white border-transparent font-bold"
                  : "theme-surface theme-surface-hover theme-text-secondary"
              }`}
            >
              Opening
            </button>
            <button
              onClick={() => setSelectedCategory("positional_endgame")}
              className={`px-2 py-1 rounded-lg border transition cursor-pointer ${
                selectedCategory === "positional_endgame"
                  ? "bg-emerald-500 text-white border-transparent font-bold"
                  : "theme-surface theme-surface-hover theme-text-secondary"
              }`}
            >
              Endgame
            </button>
            <button
              onClick={() => setSelectedCategory("diagnostics")}
              className={`px-2 py-1 rounded-lg border transition cursor-pointer ${
                selectedCategory === "diagnostics"
                  ? "bg-purple-500 text-white border-transparent font-bold"
                  : "theme-surface theme-surface-hover theme-text-secondary"
              }`}
            >
              Engine
            </button>
          </div>

          {/* Scrollable Terms List */}
          <div className="max-h-[520px] overflow-y-auto space-y-1.5 pr-1 focus:outline-hidden">
            {filteredTerms.length === 0 ? (
              <div className="p-4 text-center text-xs theme-text-muted">
                No terms found matching &ldquo;{searchQuery}&rdquo;.
              </div>
            ) : (
              filteredTerms.map((t) => {
                const isSelected = t.id === selectedTermId;
                const catTheme = getCategoryTheme(t.category);

                return (
                  <button
                    key={t.id}
                    onClick={() => setSelectedTermId(t.id)}
                    className={`w-full text-left p-2.5 rounded-2xl border transition-all duration-150 cursor-pointer flex flex-col gap-1 ${
                      isSelected
                        ? "theme-surface-subtle border-[var(--border-focus)] shadow-xs ring-1 ring-[var(--accent-primary)]/40"
                        : "theme-surface border-[var(--border-subtle)] hover:border-[var(--border-focus)] hover:-translate-y-0.5"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <span className={`w-1.5 h-1.5 rounded-full ${catTheme.dot} shrink-0`} />
                        <span className="text-xs font-bold theme-text-primary truncate">
                          {t.ruleTitle}
                        </span>
                      </div>
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded-full bg-[var(--surface-muted)] text-[var(--accent-primary)] shrink-0 font-semibold uppercase">
                        {t.tier}
                      </span>
                    </div>

                    <div className="text-[10px] font-mono theme-text-muted truncate pl-3">
                      🏛️ {t.historicalSource.white} vs {t.historicalSource.black} ({t.historicalSource.year})
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Right Column: Interactive Board & Coach Brainstorm Deck */}
        <div className="flex-1 w-full min-w-0 flex flex-col gap-3">
          {/* Term Header & Real Historical Match Attribution */}
          <div className="p-3.5 sm:p-4 rounded-3xl theme-surface border border-[var(--border-subtle)] shadow-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                    getCategoryTheme(currentTerm.category).bg
                  }`}
                >
                  {getCategoryTheme(currentTerm.category).label}
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-[var(--surface-muted)] text-[var(--accent-primary)] font-bold">
                  Tier: {currentTerm.tier.toUpperCase()}
                </span>
              </div>

              {/* Turn Indicator */}
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono font-semibold px-2.5 py-0.5 rounded-full bg-[var(--surface-muted)] border border-[var(--border-subtle)]">
                <span
                  className={`w-2 h-2 rounded-full ${
                    currentTerm.playerColor === "white" ? "bg-white border border-black/40" : "bg-neutral-900 border border-white/40"
                  }`}
                />
                <span className="theme-text-primary capitalize">
                  {currentTerm.playerColor} to Move
                </span>
              </div>
            </div>

            <h1 className="text-lg sm:text-xl font-extrabold theme-text-primary tracking-tight font-display mb-1.5 flex items-center gap-2">
              <span>{currentTerm.ruleTitle}</span>
              <span className="text-xs font-mono font-normal theme-text-muted">
                ({currentTerm.termName})
              </span>
            </h1>

            {/* Authentic Real Historical Source Citation */}
            <div className="p-2.5 rounded-2xl bg-[var(--surface-muted)]/70 border border-[var(--border-subtle)] text-xs leading-relaxed">
              <div className="flex flex-wrap items-center gap-1.5 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-bold mb-1">
                <span>🏛️ Real Master Source:</span>
                <span className="theme-text-primary">
                  {currentTerm.historicalSource.white} vs. {currentTerm.historicalSource.black} ({currentTerm.historicalSource.year})
                </span>
                <span className="theme-text-muted">• {currentTerm.historicalSource.location}</span>
              </div>
              <p className="theme-text-secondary text-[11px]">
                {currentTerm.historicalSource.historicalNote}
              </p>
            </div>
          </div>

          {/* Interactive Arena: Board on Left/Top, Coach Brainstorm on Right/Bottom */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* Chessboard */}
            <div
              ref={boardContainerRef}
              className="lg:col-span-6 xl:col-span-7 w-full overflow-hidden flex flex-col items-center justify-center p-2 sm:p-3 rounded-3xl theme-surface border border-[var(--border-subtle)] shadow-xs"
            >
              <ChessboardFrame
                boardOrientation={boardOrientation}
                boardSize={boardWidth}
                bezelSize={bezelSize}
              >
                <Chessboard
                  options={{
                    position: game.fen(),
                    boardOrientation: boardOrientation,
                    showNotation: false,
                    pieces: getPieceSet(pieceSet),
                    allowDrawingArrows: true,
                    clearArrowsOnClick: true,
                    arrowOptions: {
                      ...defaultArrowOptions,
                      color: "#10b981",
                      opacity: 0.9,
                    },
                    onPieceDrop: handlePieceDrop,
                  }}
                />
              </ChessboardFrame>

              {/* Board Controls */}
              <div className="w-full flex items-center justify-between gap-2 mt-2.5 pt-2 border-t border-[var(--border-subtle)] text-xs font-mono">
                <button
                  onClick={handleResetPosition}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-xl theme-surface-subtle hover:theme-surface transition border border-[var(--border-subtle)] cursor-pointer"
                  title="Reset Position"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset Board</span>
                </button>

                <button
                  onClick={() =>
                    setBoardOrientation((prev) => (prev === "white" ? "black" : "white"))
                  }
                  className="px-2.5 py-1 rounded-xl theme-surface-subtle hover:theme-surface transition border border-[var(--border-subtle)] cursor-pointer"
                  title="Flip Board Orientation"
                >
                  Flip Board ({boardOrientation})
                </button>
              </div>
            </div>

            {/* Coach Brainstorm & Analysis Deck */}
            <div className="lg:col-span-6 xl:col-span-5 w-full min-w-0 flex flex-col gap-2.5">
              {/* Deck Tabs */}
              <div className="flex items-center p-1 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border-subtle)] text-xs font-mono">
                <button
                  onClick={() => setActiveTab("brainstorm")}
                  className={`flex-1 py-1.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    activeTab === "brainstorm"
                      ? "theme-surface theme-text-primary shadow-xs"
                      : "theme-text-muted hover:theme-text-primary"
                  }`}
                >
                  <Zap className="w-3.5 h-3.5 text-amber-500" />
                  <span>Brainstorm</span>
                </button>
                <button
                  onClick={() => setActiveTab("walkthrough")}
                  className={`flex-1 py-1.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    activeTab === "walkthrough"
                      ? "theme-surface theme-text-primary shadow-xs"
                      : "theme-text-muted hover:theme-text-primary"
                  }`}
                >
                  <Play className="w-3.5 h-3.5 text-sky-500" />
                  <span>Master Line</span>
                </button>
                <button
                  onClick={() => setActiveTab("dossier")}
                  className={`flex-1 py-1.5 rounded-xl font-bold flex items-center justify-center gap-1.5 transition cursor-pointer ${
                    activeTab === "dossier"
                      ? "theme-surface theme-text-primary shadow-xs"
                      : "theme-text-muted hover:theme-text-primary"
                  }`}
                >
                  <Award className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Dossier</span>
                </button>
              </div>

              {/* Tab 1: Brainstorm Mode */}
              {activeTab === "brainstorm" && (
                <div className="p-3.5 rounded-3xl theme-surface border border-[var(--border-subtle)] shadow-xs flex flex-col gap-3">
                  {/* Coach Challenge Prompt */}
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 mb-1 font-mono">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Coach&apos;s Brainstorming Challenge:</span>
                    </div>
                    <p className="text-xs theme-text-primary leading-relaxed">
                      {currentTerm.coachPrompt}
                    </p>
                  </div>

                  {/* Candidate Moves Selector */}
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider theme-text-muted font-bold block mb-1.5">
                      Test Candidate Moves On The Board:
                    </span>
                    <div className="flex flex-col gap-1.5">
                      {currentTerm.candidateMoves.map((cand) => {
                        const isSelected = activeCandidate?.san === cand.san;
                        return (
                          <button
                            key={cand.san}
                            onClick={() => handleSelectCandidate(cand)}
                            className={`w-full p-2 rounded-xl text-left border transition-all cursor-pointer flex items-center justify-between text-xs font-mono ${
                              isSelected
                                ? cand.isBest
                                  ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 font-bold"
                                  : "bg-rose-500/15 border-rose-500/40 text-rose-700 dark:text-rose-300 font-bold"
                                : "theme-surface-subtle theme-surface-hover border-[var(--border-subtle)] theme-text-primary"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {cand.isBest ? (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                              ) : (
                                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              )}
                              <span>{cand.label}</span>
                            </div>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[var(--surface-muted)] text-[var(--accent-primary)] font-bold">
                              {cand.san}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Coach Diagnostic Response */}
                  {activeCandidate ? (
                    <div
                      className={`p-3 rounded-2xl border text-xs leading-relaxed animate-in fade-in duration-150 ${
                        activeCandidate.isBest
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-800 dark:text-emerald-200"
                          : "bg-rose-500/10 border-rose-500/30 text-rose-800 dark:text-rose-200"
                      }`}
                    >
                      <div className="font-bold font-mono text-[11px] mb-1 flex items-center gap-1.5">
                        {activeCandidate.isBest ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Coach Verdict: Master Precision!</span>
                          </>
                        ) : (
                          <>
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-500" />
                            <span>Coach Verdict: Tactical Blindspot!</span>
                          </>
                        )}
                      </div>
                      <p>{activeCandidate.coachFeedback}</p>
                    </div>
                  ) : (
                    <div className="p-3 rounded-2xl theme-surface-subtle border border-[var(--border-subtle)] text-xs text-center theme-text-muted">
                      💡 Click a candidate move above or move pieces directly on the board to receive live coach feedback!
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: Master Line Walkthrough */}
              {activeTab === "walkthrough" && (
                <div className="p-3.5 rounded-3xl theme-surface border border-[var(--border-subtle)] shadow-xs flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold theme-text-primary font-mono">
                      Master Move Stepper ({currentStepIndex} / {currentTerm.masterLine.length})
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setIsAutoPlaying(!isAutoPlaying)}
                        className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-mono font-bold transition cursor-pointer ${
                          isAutoPlaying
                            ? "bg-amber-500 text-white"
                            : "theme-surface-subtle border border-[var(--border-subtle)] theme-text-primary hover:bg-[var(--surface-muted)]"
                        }`}
                      >
                        {isAutoPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                        <span>{isAutoPlaying ? "Pause" : "Auto-Play"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Move Stepper Controls */}
                  <div className="flex items-center justify-center gap-2 p-1.5 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border-subtle)]">
                    <button
                      onClick={() => setCurrentStepIndex(0)}
                      disabled={currentStepIndex === 0}
                      className="px-2 py-1 rounded-lg theme-surface theme-surface-hover disabled:opacity-40 cursor-pointer text-xs font-mono"
                    >
                      ⏮ Start
                    </button>
                    <button
                      onClick={() => setCurrentStepIndex((prev) => Math.max(0, prev - 1))}
                      disabled={currentStepIndex === 0}
                      className="px-3 py-1 rounded-lg theme-surface theme-surface-hover disabled:opacity-40 cursor-pointer text-xs font-mono flex items-center gap-1"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                      <span>Prev</span>
                    </button>
                    <button
                      onClick={() =>
                        setCurrentStepIndex((prev) =>
                          Math.min(currentTerm.masterLine.length, prev + 1)
                        )
                      }
                      disabled={currentStepIndex >= currentTerm.masterLine.length}
                      className="px-3 py-1 rounded-lg theme-accent-btn disabled:opacity-40 cursor-pointer text-xs font-mono font-bold flex items-center gap-1 shadow-xs"
                    >
                      <span>Next</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setCurrentStepIndex(currentTerm.masterLine.length)}
                      disabled={currentStepIndex >= currentTerm.masterLine.length}
                      className="px-2 py-1 rounded-lg theme-surface theme-surface-hover disabled:opacity-40 cursor-pointer text-xs font-mono"
                    >
                      ⏭ End
                    </button>
                  </div>

                  {/* Move Sequence Pills */}
                  <div className="flex flex-wrap gap-1.5">
                    {currentTerm.masterLine.map((step, idx) => {
                      const isReached = currentStepIndex > idx;
                      const isCurrent = currentStepIndex === idx + 1;
                      return (
                        <button
                          key={idx}
                          onClick={() => setCurrentStepIndex(idx + 1)}
                          className={`px-2 py-1 rounded-lg text-xs font-mono transition cursor-pointer border ${
                            isCurrent
                              ? "bg-[var(--accent-primary)] text-white border-transparent font-bold shadow-xs"
                              : isReached
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
                              : "theme-surface-subtle theme-text-muted border-[var(--border-subtle)]"
                          }`}
                        >
                          {idx + 1}. {step.san}
                        </button>
                      );
                    })}
                  </div>

                  {/* Active Step Commentary */}
                  {currentStepIndex > 0 ? (
                    <div className="p-3 rounded-2xl bg-[var(--surface-muted)] border border-[var(--border-subtle)] text-xs leading-relaxed">
                      <div className="font-bold text-[11px] font-mono text-[var(--accent-primary)] mb-1">
                        Move {currentStepIndex}: {currentTerm.masterLine[currentStepIndex - 1]?.san}
                      </div>
                      <p className="theme-text-primary">
                        {currentTerm.masterLine[currentStepIndex - 1]?.explanation}
                      </p>
                    </div>
                  ) : (
                    <div className="p-3 rounded-2xl theme-surface-subtle border border-[var(--border-subtle)] text-xs text-center theme-text-muted">
                      Click &ldquo;Next&rdquo; or &ldquo;Auto-Play&rdquo; to step through the historical moves.
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Coach Dossier */}
              {activeTab === "dossier" && (
                <div className="p-3.5 rounded-3xl theme-surface border border-[var(--border-subtle)] shadow-xs flex flex-col gap-3">
                  {/* Golden Rule Card */}
                  <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/25">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 mb-1 font-mono">
                      <span>💡 The ChessZ Golden Rule:</span>
                    </div>
                    <p className="text-xs theme-text-primary font-mono font-medium leading-relaxed">
                      &ldquo;{currentTerm.goldenRule}&rdquo;
                    </p>
                  </div>

                  {/* Amateur Blindspot */}
                  <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/25">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 mb-1 font-mono">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Why Amateurs Throw Here (The Blindspot):</span>
                    </div>
                    <p className="text-xs theme-text-secondary leading-relaxed">
                      {currentTerm.amateurBlindspot}
                    </p>
                  </div>

                  {/* Visual Radar Clues */}
                  <div className="p-3 rounded-2xl theme-surface-subtle border border-[var(--border-subtle)]">
                    <div className="flex items-center gap-1.5 text-xs font-bold theme-text-primary mb-1.5 font-mono">
                      <Target className="w-3.5 h-3.5 text-sky-500" />
                      <span>Visual Radar (Look for these patterns):</span>
                    </div>
                    <ul className="space-y-1 text-xs theme-text-secondary">
                      {currentTerm.radarClues.map((clue, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-[var(--accent-primary)] font-bold">•</span>
                          <span>{clue}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Direct Practice in Tactical Arena Action */}
                  <Link
                    href={currentTerm.arenaFilter ? `/?tier=${currentTerm.arenaFilter.tier}` : "/"}
                    className="w-full py-2.5 px-4 rounded-xl theme-accent-btn font-bold text-xs tracking-wide flex items-center justify-center gap-2 shadow-sm hover:shadow-md transition cursor-pointer"
                  >
                    <Swords className="w-3.5 h-3.5" />
                    <span>Drill This Rule in Tactical Arena ➔</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </main>
  );
}

export default function TermsClient() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-xs font-mono theme-text-muted">
          Loading ChessZ Terms Academy...
        </div>
      }
    >
      <TermsContent />
    </Suspense>
  );
}
