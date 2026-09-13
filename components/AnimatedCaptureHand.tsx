"use client";

import React, { useEffect, useState } from "react";

interface AnimatedCaptureHandProps {
  targetSquare: string | null;
  boardOrientation?: "white" | "black";
  boardSize: number;
  bezelSize?: number;
  triggerKey?: number | string;
  enabled?: boolean;
}

export function AnimatedCaptureHand({
  targetSquare,
  boardOrientation = "white",
  boardSize,
  bezelSize = 24,
  triggerKey,
  enabled = true,
}: AnimatedCaptureHandProps) {
  const [active, setActive] = useState(false);
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!enabled || !targetSquare || targetSquare.length !== 2) {
      setActive(false);
      return;
    }

    const file = targetSquare[0].toLowerCase();
    const rank = targetSquare[1];
    const fileIdx = file.charCodeAt(0) - 97;
    const rankNum = parseInt(rank, 10);

    if (fileIdx < 0 || fileIdx > 7 || rankNum < 1 || rankNum > 8) return;

    const squareSize = boardSize / 8;
    const col = boardOrientation === "white" ? fileIdx : 7 - fileIdx;
    const row = boardOrientation === "white" ? 8 - rankNum : rankNum - 1;

    const posX = col * squareSize + squareSize * 0.5;
    const posY = row * squareSize + squareSize * 0.5;

    setCoords({ x: posX, y: posY });
    setActive(true);

    const timer = setTimeout(() => {
      setActive(false);
    }, 620);

    return () => clearTimeout(timer);
  }, [targetSquare, triggerKey, boardOrientation, boardSize, bezelSize, enabled]);

  if (!active || !coords) return null;

  return (
    <div
      className="absolute pointer-events-none z-40 transition-none select-none"
      style={{
        left: coords.x,
        top: coords.y,
        width: 0,
        height: 0,
      }}
      aria-hidden="true"
    >
      <div className="relative animate-capture-hand" style={{ width: 130, height: 130, marginLeft: -65, marginTop: -65 }}>
        {/* Glowing impact burst ripple on capture */}
        <div className="absolute inset-0 rounded-full bg-red-500/30 blur-md animate-ping" />
        
        {/* Beautiful Illustrated Sleek Red / Crimson Hand */}
        <svg
          viewBox="0 0 160 160"
          className="w-full h-full drop-shadow-[0_0_18px_rgba(239,68,68,0.9)]"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="redHandGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff4d6d" />
              <stop offset="40%" stopColor="#ef4444" />
              <stop offset="85%" stopColor="#991b1b" />
              <stop offset="100%" stopColor="#450a0a" />
            </linearGradient>
            <linearGradient id="cyberNeonGlint" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.6" />
            </linearGradient>
          </defs>

          <g transform="translate(18, 16)">
            {/* Forearm & Wrist entering gracefully */}
            <path
              d="M135 15 C122 32 108 55 96 74 C90 83 80 88 72 94 L62 82 C75 70 88 48 110 10 Z"
              fill="url(#redHandGlow)"
              stroke="#ff758f"
              strokeWidth="1.5"
            />

            {/* Palm Base */}
            <ellipse cx="68" cy="88" rx="22" ry="18" fill="url(#redHandGlow)" stroke="#ff758f" strokeWidth="1.5" />

            {/* Thumb reaching around */}
            <path
              d="M78 82 C88 78 94 88 88 98 C82 106 72 104 68 98 Z"
              fill="url(#redHandGlow)"
              stroke="#ff758f"
              strokeWidth="1.2"
            />

            {/* Index Finger pinching down at center (x: 50, y: 55) */}
            <path
              d="M62 76 C56 68 50 58 48 52 C46 48 40 48 42 54 C45 62 52 74 58 84 Z"
              fill="url(#redHandGlow)"
              stroke="#ffffff"
              strokeWidth="1.2"
            />
            {/* Index Finger Manicured Crimson Claw / Nail */}
            <ellipse cx="44" cy="51" rx="3.5" ry="5.5" transform="rotate(-25 44 51)" fill="#ffffff" />

            {/* Middle Finger arching over */}
            <path
              d="M66 74 C62 62 55 48 52 42 C50 38 45 40 47 46 C50 54 58 68 62 80 Z"
              fill="url(#redHandGlow)"
              stroke="#ff758f"
              strokeWidth="1.2"
            />
            <ellipse cx="48" cy="41" rx="3" ry="5" transform="rotate(-20 48 41)" fill="#ffffff" />

            {/* Ring Finger */}
            <path
              d="M72 76 C70 66 66 54 62 48 C60 45 56 46 58 52 C61 60 67 72 70 82 Z"
              fill="url(#redHandGlow)"
              stroke="#ff758f"
              strokeWidth="1"
            />

            {/* Pinky Finger curled */}
            <path
              d="M78 82 C80 74 78 64 74 60 C72 58 68 60 70 66 C72 72 75 78 76 86 Z"
              fill="url(#redHandGlow)"
              stroke="#ff758f"
              strokeWidth="1"
            />

            {/* Cyber Neon Accent Lines & Joint Details */}
            <line x1="85" y1="65" x2="105" y2="35" stroke="url(#cyberNeonGlint)" strokeWidth="2" strokeLinecap="round" />
            <circle cx="94" cy="52" r="2.5" fill="#ffffff" />
            <circle cx="82" cy="70" r="2" fill="#ff4d6d" />
          </g>
        </svg>
      </div>
    </div>
  );
}
