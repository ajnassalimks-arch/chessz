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
      let mate: number | null = null;

      const cpMatch = line.match(/\bscore cp (-?\d+)\b/);
      const mateMatch = line.match(/\bscore mate (-?\d+)\b/);

      if (cpMatch) {
        // UCI gives score from engine's POV; convert to White's POV
        const rawCp = parseInt(cpMatch[1], 10);
        score = isBlackTurn ? -rawCp : rawCp;
      } else if (mateMatch) {
        const rawMate = parseInt(mateMatch[1], 10);
        mate = isBlackTurn ? -rawMate : rawMate;
      }

      // Extract PV line
      const pvIndex = line.indexOf(' pv ');
      const pvMoves = pvIndex !== -1 ? line.slice(pvIndex + 4).trim().split(/\s+/) : [];

      if (score !== null || mate !== null) {
        const isMate = mate !== null;
        const displayScore = isMate
          ? (mate! > 0 ? `+M${mate}` : `-M${Math.abs(mate!)}`)
          : `${score! > 0 ? '+' : ''}${(score! / 100).toFixed(1)}`;

        setEvaluation({
          score,
          displayScore,
          isMate,
          mateIn: mate,
          depth,
          nps: nps || undefined,
        });
      }

      // If we have PV moves, construct readable SAN line
      if (pvMoves.length > 0 && fen) {
        try {
          const testChess = new Chess(fen);
          const sanMoves: string[] = [];
          for (const uciMove of pvMoves.slice(0, 5)) {
            const from = uciMove.slice(0, 2);
            const to = uciMove.slice(2, 4);
            const promotion = uciMove.length > 4 ? uciMove[4] : undefined;
            const res = testChess.move({ from, to, promotion: promotion || 'q' });
            if (!res) break;
            sanMoves.push(res.san);
          }
          setBestLine(sanMoves);

          // Update arrow from first PV move
          const firstMove = pvMoves[0];
          if (firstMove && firstMove.length >= 4) {
            setEngineArrow({
              startSquare: firstMove.slice(0, 2),
              endSquare: firstMove.slice(2, 4),
              color: 'rgba(16, 185, 129, 0.88)',
            });
          }
        } catch {}
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

  const parseInfoLineRef = useRef(parseInfoLine);
  const parseBestMoveLineRef = useRef(parseBestMoveLine);

  useEffect(() => {
    parseInfoLineRef.current = parseInfoLine;
    parseBestMoveLineRef.current = parseBestMoveLine;
  }, [parseInfoLine, parseBestMoveLine]);

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
          parseInfoLineRef.current(line);
        } else if (line.startsWith('bestmove')) {
          parseBestMoveLineRef.current(line);
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

  // Start analysis on a given FEN
  const startAnalysis = useCallback(
    (fen: string, depth: number = 15) => {
      if (!workerRef.current || !fen) return;

      currentFenRef.current = fen;
      setIsAnalyzing(true);
      setBestMove(null);
      setEngineArrow(null);

      workerRef.current.postMessage('stop');
      workerRef.current.postMessage(`position fen ${fen}`);
      workerRef.current.postMessage(`go depth ${depth}`);
    },
    []
  );

  // Stop current calculation and clear visual engine marks
  const stopAnalysis = useCallback(() => {
    if (workerRef.current) {
      workerRef.current.postMessage('stop');
    }
    setIsAnalyzing(false);
    setEvaluation(null);
    setBestMove(null);
    setEngineArrow(null);
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
