import { Color } from '../chessMetrics/types';

export interface EnginePosition {
  fen: string;
  ply: number;
  color: Color;
  san: string;
}

export interface EngineEvalResult {
  cp?: number;
  mate?: number;
  bestMove?: string;
  depth: number;
  nodes: number;
}

export interface EngineProgress {
  status: 'idle' | 'running' | 'paused' | 'done' | 'error';
  currentGame: number;
  totalGames: number;
  currentPly: number;
  totalPliesInGame: number;
  pass: 1 | 2;
  totalNodesEvaluated: number;
  error?: string;
}

export interface ChessEngine {
  init(): Promise<boolean>;
  evaluatePosition(fen: string, nodes: number): Promise<EngineEvalResult>;
  terminate(): void;
  isReady(): boolean;
}
