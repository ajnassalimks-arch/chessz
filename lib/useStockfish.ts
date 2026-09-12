'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Chess } from 'chess.js';

export interface EngineEvaluation {
  score: number | null; // Centipawns normalized to White (+ = White winning, - = Black winning)
  displayScore: string; // "+3.4", "-1.2", "M2", "-M1", "0.0"
  isMate: boolean;
  mateIn: number | null;
  depth: number;
  nps?: number;
  nodes?: number;
}

export interface EngineMove {
  from: string;
  to: string;
  promotion?: string;
  san: string;
  uci: string;
}

export interface EngineArrow {
  startSquare: string;
  endSquare: string;
  color: string;
}

export function useStockfish() {
  const [isReady, setIsReady] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [evaluation, setEvaluation] = useState<EngineEvaluation | null>(null);
  const [bestMove, setBestMove] = useState<EngineMove | null>(null);
  const [bestLine, setBestLine] = useState<string[]>([]);
  const [engineArrow, setEngineArrow] = useState<EngineArrow | null>(null);
  const [engineEnabled, setEngineEnabled] = useState(false);

  const workerRef = useRef<Worker | null>(null);
  const currentFenRef = useRef<string>('');
  const isMountedRef = useRef<boolean>(true);

  // Initialize Worker cleanly on mount
  useEffect(() => {
    isMountedRef.current = true;

    if (typeof window === 'undefined') return;

    try {
      const wasmSupported =
        typeof WebAssembly === 'object' &&
        typeof WebAssembly.validate === 'function' &&
        WebAssembly.validate(
          Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00)
        );

      const workerPath = wasmSupported
        ? '/stockfish/stockfish.wasm.js'
        : '/stockfish/stockfish.js';

      const worker = new Worker(workerPath);
      workerRef.current = worker;

      worker.onmessage = (event: MessageEvent) => {
        if (!isMountedRef.current) return;
        const line = typeof event.data === 'string' ? event.data : '';

        if (line.includes('uciok')) {
          worker.postMessage('isready');
        } else if (line.includes('readyok')) {
          setIsReady(true);
        } else if (line.startsWith('info') && line.includes('score')) {
          parseInfoLine(line);
        } else if (line.startsWith('bestmove')) {
          parseBestMoveLine(line);
        }
      };

      worker.onerror = (err) => {
        console.warn('Stockfish worker notice (using fallback):', err);
      };

      worker.postMessage('uci');
    } catch (e) {
      console.warn('Failed to initialize Stockfish worker:', e);
    }

    return () => {
      isMountedRef.current = false;
      if (workerRef.current) {
        try {
          workerRef.current.postMessage('quit');
          workerRef.current.terminate();
        } catch {}
        workerRef.current = null;
      }
    };
  }, []);

  // Parse UCI 'info' line
  const parseInfoLine = useCallback((line: string) => {
    try {
      const fen = currentFenRef.current;
      const isBlackTurn = fen ? fen.split(' ')[1] === 'b' : false;

      // Extract depth
      const depthMatch = line.match(/\bdepth (\d+)\b/);
      const depth = depthMatch ? parseInt(depthMatch[1], 10) : 0;

      // Extract NPS
      const npsMatch = line.match(/\bnps (\d+)\b/);
      const nps = npsMatch ? parseInt(npsMatch[1], 10) : undefined;

      // Extract Score: cp or mate
      let score: number | null = null;
      let displayScore = '0.0';
      let isMate = false;
      let mateIn: number | null = null;

      const mateMatch = line.match(/\bscore mate (-?\d+)\b/);
      const cpMatch = line.match(/\bscore cp (-?\d+)\b/);

      if (mateMatch) {
        isMate = true;
        const rawMate = parseInt(mateMatch[1], 10);
        mateIn = isBlackTurn ? -rawMate : rawMate;
        displayScore = mateIn > 0 ? `M${mateIn}` : `-M${Math.abs(mateIn)}`;
      } else if (cpMatch) {
        const rawCp = parseInt(cpMatch[1], 10);
        // Normalize score to White's perspective (+ = White, - = Black)
        score = isBlackTurn ? -rawCp : rawCp;
        const pawnVal = (score / 100).toFixed(1);
        displayScore = score > 0 ? `+${pawnVal}` : pawnVal;
      }

      // Extract PV moves
      const pvIndex = line.indexOf(' pv ');
      let pvMoves: string[] = [];
      let firstMoveUci: string | null = null;

      if (pvIndex !== -1) {
        const pvStr = line.slice(pvIndex + 4).trim();
        pvMoves = pvStr.split(/\s+/).filter(Boolean);
        firstMoveUci = pvMoves[0] || null;
      }

      setEvaluation({
        score,
        displayScore,
        isMate,
        mateIn,
        depth,
        nps,
      });

      if (pvMoves.length > 0) {
        setBestLine(pvMoves);
      }

      // If we have a first move from PV, convert to SAN & create Engine Arrow
      if (firstMoveUci && firstMoveUci.length >= 4 && fen) {
        const from = firstMoveUci.slice(0, 2);
        const to = firstMoveUci.slice(2, 4);
        const promotion = firstMoveUci.length > 4 ? firstMoveUci[4] : undefined;

        let san = `${from}-${to}`;
        try {
          const testChess = new Chess(fen);
          const moveResult = testChess.move({ from, to, promotion: promotion || 'q' });
          if (moveResult) san = moveResult.san;
        } catch {}

        setBestMove({ from, to, promotion, san, uci: firstMoveUci });

        // Highlight arrow on board: Cyan-Emerald luminous arrow
        setEngineArrow({
          startSquare: from,
          endSquare: to,
          color: 'rgba(16, 185, 129, 0.88)',
        });
      }
    } catch {}
  }, []);

  // Parse UCI 'bestmove' line
  const parseBestMoveLine = useCallback((line: string) => {
    setIsAnalyzing(false);
    const parts = line.split(/\s+/);
    const uci = parts[1];
    if (uci && uci !== '(none)' && uci.length >= 4) {
      const from = uci.slice(0, 2);
      const to = uci.slice(2, 4);
      const promotion = uci.length > 4 ? uci[4] : undefined;

      const fen = currentFenRef.current;
      let san = `${from}-${to}`;
      if (fen) {
        try {
          const testChess = new Chess(fen);
          const moveResult = testChess.move({ from, to, promotion: promotion || 'q' });
          if (moveResult) san = moveResult.san;
        } catch {}
      }

      setBestMove({ from, to, promotion, san, uci });
      setEngineArrow({
        startSquare: from,
        endSquare: to,
        color: 'rgba(16, 185, 129, 0.88)',
      });
    }
  }, []);

  // Start analysis on a given FEN
  const startAnalysis = useCallback(
    (fen: string, depth: number = 15) => {
      if (!workerRef.current || !fen) return;

      currentFenRef.current = fen;
      setIsAnalyzing(true);
      setBestMove(null);
      setEngineArrow(null);

      workerRef.current.postMessage('stop');
      workerRef.current.postMessage('ucinewgame');
      workerRef.current.postMessage(`position fen ${fen}`);
      workerRef.current.postMessage(`go depth ${depth}`);
    },
    []
  );

  // Stop current calculation
  const stopAnalysis = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.postMessage('stop');
    }
    setIsAnalyzing(false);
  }, []);

  // Toggle engine on/off
  const toggleEngine = useCallback(
    (targetFen?: string) => {
      const next = !engineEnabled;
      setEngineEnabled(next);
      if (next) {
        const fenToUse = targetFen || currentFenRef.current;
        if (fenToUse) {
          startAnalysis(fenToUse);
        }
      } else {
        stopAnalysis();
        setEvaluation(null);
        setBestMove(null);
        setEngineArrow(null);
      }
    },
    [engineEnabled, startAnalysis, stopAnalysis]
  );

  return {
    isReady,
    isAnalyzing,
    engineEnabled,
    evaluation,
    bestMove,
    bestLine,
    engineArrow,
    setEngineEnabled,
    startAnalysis,
    stopAnalysis,
    toggleEngine,
  };
}
