"use client";

import React from "react";

interface ChessboardFrameProps {
  boardOrientation?: "white" | "black";
  boardSize: number;
  bezelSize?: number;
  children: React.ReactNode;
  showAllSides?: boolean;
}

export const ChessboardFrame: React.FC<ChessboardFrameProps> = ({
  boardOrientation = "white",
  boardSize,
  bezelSize = 24,
  children,
  showAllSides = true,
}) => {
  const files =
    boardOrientation === "white"
      ? ["a", "b", "c", "d", "e", "f", "g", "h"]
      : ["h", "g", "f", "e", "d", "c", "b", "a"];

  const ranks =
    boardOrientation === "white"
      ? ["8", "7", "6", "5", "4", "3", "2", "1"]
      : ["1", "2", "3", "4", "5", "6", "7", "8"];

  const squareSize = boardSize / 8;
  const totalSize = boardSize + bezelSize * 2;

  return (
    <div
      className="relative flex flex-col items-center justify-center select-none transition-colors duration-200 rounded-2xl shadow-2xl overflow-visible border"
      style={{
        width: totalSize,
        height: totalSize,
        backgroundColor: "var(--board-bezel-bg, #121722)",
        borderColor: "var(--board-bezel-border, rgba(255,255,255,0.1))",
        boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.35), 0 1px 3px rgba(0, 0, 0, 0.15)",
      }}
    >
      {/* Top Bezel: Files (Subtle mirror for tournament broadcast feel) */}
      <div
        className="flex w-full items-center justify-center"
        style={{ height: bezelSize }}
      >
        <div style={{ width: bezelSize, height: bezelSize }} className="shrink-0" />
        <div
          className="flex items-center"
          style={{ width: boardSize, height: bezelSize }}
        >
          {files.map((file, idx) => (
            <div
              key={`top-${file}-${idx}`}
              className="flex items-center justify-center font-mono text-[10px] sm:text-[11px] font-semibold opacity-60 tracking-wider pointer-events-none transition-colors duration-150"
              style={{
                width: squareSize,
                color: "var(--board-coord-color, #8fa7cc)",
              }}
            >
              {showAllSides ? file : ""}
            </div>
          ))}
        </div>
        <div style={{ width: bezelSize, height: bezelSize }} className="shrink-0" />
      </div>

      {/* Middle Row: Left Ranks + 64 Playable Squares + Right Ranks */}
      <div
        className="flex items-center justify-center"
        style={{ width: totalSize, height: boardSize }}
      >
        {/* Left Bezel: Ranks */}
        <div
          className="flex flex-col items-center justify-center shrink-0"
          style={{ width: bezelSize, height: boardSize }}
        >
          {ranks.map((rank, idx) => (
            <div
              key={`left-${rank}-${idx}`}
              className="flex items-center justify-center font-mono text-[10px] sm:text-[11px] font-semibold tracking-wider pointer-events-none transition-colors duration-150"
              style={{
                height: squareSize,
                width: bezelSize,
                color: "var(--board-coord-color, #8fa7cc)",
              }}
            >
              {rank}
            </div>
          ))}
        </div>

        {/* The 64 Squares: Chamfered Inner Frame */}
        <div
          className="relative overflow-visible rounded-[2px]"
          style={{
            width: boardSize,
            height: boardSize,
            boxShadow: "inset 0 0 0 1px var(--board-inner-border, rgba(0,0,0,0.25))",
          }}
        >
          {children}
        </div>

        {/* Right Bezel: Ranks (Mirror) */}
        <div
          className="flex flex-col items-center justify-center shrink-0"
          style={{ width: bezelSize, height: boardSize }}
        >
          {ranks.map((rank, idx) => (
            <div
              key={`right-${rank}-${idx}`}
              className="flex items-center justify-center font-mono text-[10px] sm:text-[11px] font-semibold opacity-60 tracking-wider pointer-events-none transition-colors duration-150"
              style={{
                height: squareSize,
                width: bezelSize,
                color: "var(--board-coord-color, #8fa7cc)",
              }}
            >
              {showAllSides ? rank : ""}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bezel: Files */}
      <div
        className="flex w-full items-center justify-center"
        style={{ height: bezelSize }}
      >
        <div style={{ width: bezelSize, height: bezelSize }} className="shrink-0" />
        <div
          className="flex items-center"
          style={{ width: boardSize, height: bezelSize }}
        >
          {files.map((file, idx) => (
            <div
              key={`bot-${file}-${idx}`}
              className="flex items-center justify-center font-mono text-[10px] sm:text-[11px] font-semibold tracking-wider pointer-events-none transition-colors duration-150"
              style={{
                width: squareSize,
                color: "var(--board-coord-color, #8fa7cc)",
              }}
            >
              {file}
            </div>
          ))}
        </div>
        <div style={{ width: bezelSize, height: bezelSize }} className="shrink-0" />
      </div>
    </div>
  );
};
