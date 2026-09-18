'use client';

import React, { useState, useEffect } from 'react';
import { X, Download, Copy, Check, Sparkles, ExternalLink } from 'lucide-react';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  diagnosedElo: number;
  levelName: string;
  patternName: string;
  insight: string;
  strength: string;
  weakness: string;
  attemptsCount: number;
  correctCount: number;
  noveltyVerified?: boolean;
  isCrucibleActive?: boolean;
}

export function SocialShareModal({
  isOpen,
  onClose,
  diagnosedElo,
  levelName,
  patternName,
  insight,
  strength,
  weakness,
  attemptsCount,
  correctCount,
  noveltyVerified = false,
  isCrucibleActive = false,
}: SocialShareModalProps) {
  const [copied, setCopied] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    if (!isOpen) return;

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 675; // Standard 16:9 Twitter/WhatsApp/OG ratio
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // 1. Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1200, 675);
    bgGrad.addColorStop(0, '#0F172A'); // Deep Slate
    bgGrad.addColorStop(0.6, '#14202B'); // ChessZ Ink
    bgGrad.addColorStop(1, '#1E293B'); // Slate 800
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1200, 675);

    // 2. Subtle Chessboard Pattern Watermark
    ctx.save();
    ctx.globalAlpha = 0.035;
    const sqSize = 56;
    for (let r = 0; r < 12; r++) {
      for (let c = 0; c < 22; c++) {
        if ((r + c) % 2 === 0) {
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(c * sqSize, r * sqSize, sqSize, sqSize);
        }
      }
    }
    ctx.restore();

    // 3. Glowing Ambient Accent Orbs
    ctx.save();
    // Amber glow top-right
    const radGrad1 = ctx.createRadialGradient(1000, 150, 20, 1000, 150, 450);
    radGrad1.addColorStop(0, 'rgba(232, 163, 61, 0.16)');
    radGrad1.addColorStop(1, 'transparent');
    ctx.fillStyle = radGrad1;
    ctx.fillRect(500, 0, 700, 675);

    // Cyan/Emerald glow bottom-left
    const radGrad2 = ctx.createRadialGradient(250, 500, 20, 250, 500, 400);
    radGrad2.addColorStop(0, 'rgba(16, 185, 129, 0.12)');
    radGrad2.addColorStop(1, 'transparent');
    ctx.fillStyle = radGrad2;
    ctx.fillRect(0, 200, 600, 475);
    ctx.restore();

    // 4. Header Bar: Logo & Branding
    // Draw ChessZ Mark (64-unit geometry scaled to 52px)
    ctx.save();
    const logoX = 72;
    const logoY = 64;
    const logoSize = 52;

    // Tile rounded rect
    ctx.fillStyle = '#14202B';
    ctx.strokeStyle = 'rgba(244, 241, 234, 0.2)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(logoX, logoY, logoSize, logoSize, 12);
    ctx.fill();
    ctx.stroke();

    // Draw Z blocks inside tile (4x4 unit grid, unit = 52 * (40/64) / 4 = 8.125)
    const zBox = logoSize * (40 / 64);
    const u = zBox / 4;
    const zOriginX = logoX + (logoSize - zBox) / 2;
    const zOriginY = logoY + (logoSize - zBox) / 2;

    // Top Bar (bone)
    ctx.fillStyle = '#F4F1EA';
    ctx.beginPath();
    ctx.roundRect(zOriginX + u, zOriginY, 3 * u, u, 2.5);
    ctx.fill();

    // Upper Diagonal Block (bone)
    ctx.beginPath();
    ctx.roundRect(zOriginX + 2 * u, zOriginY + u, u, u, 2.5);
    ctx.fill();

    // Lower Diagonal Block (Amber - the critical block)
    ctx.fillStyle = '#E8A33D';
    ctx.beginPath();
    ctx.roundRect(zOriginX + u, zOriginY + 2 * u, u, u, 2.5);
    ctx.fill();

    // Bottom Bar (bone)
    ctx.fillStyle = '#F4F1EA';
    ctx.beginPath();
    ctx.roundRect(zOriginX, zOriginY + 3 * u, 3 * u, u, 2.5);
    ctx.fill();
    ctx.restore();

    // App Name & Benchmark Header Text
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('ChessZ', 140, 96);

    ctx.fillStyle = '#94A3B8';
    ctx.font = '600 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('COGNITIVE BENCHMARK & DIAGNOSIS', 142, 114);

    // Top Right Header Pill
    ctx.save();
    ctx.fillStyle = 'rgba(255, 255, 255, 0.06)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(880, 68, 248, 40, 20);
    ctx.fill();
    ctx.stroke();

    // Small green dot
    ctx.fillStyle = '#10B981';
    ctx.beginPath();
    ctx.arc(904, 88, 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#E2E8F0';
    ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('TOURNAMENT ELO MODEL', 922, 92);
    ctx.restore();

    // 5. Card Frame: Left Side (Rating & Level)
    ctx.save();
    ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
    ctx.strokeStyle = 'rgba(232, 163, 61, 0.35)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(72, 160, 360, 435, 24);
    ctx.fill();
    ctx.stroke();

    // Diagnosed Level Label
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('DIAGNOSED STRENGTH', 104, 205);

    // Big Elo Display
    ctx.fillStyle = '#E8A33D';
    ctx.font = '900 68px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`~${diagnosedElo}`, 100, 275);

    ctx.fillStyle = '#E2E8F0';
    ctx.font = 'bold 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('ESTIMATED TOURNAMENT ELO', 104, 305);

    // Level Title Banner
    ctx.fillStyle = 'rgba(244, 241, 234, 0.08)';
    ctx.beginPath();
    ctx.roundRect(104, 335, 296, 52, 14);
    ctx.fill();

    ctx.fillStyle = '#F8FAFC';
    ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(levelName, 120, 367);

    // Trials Passed Metric
    ctx.fillStyle = '#94A3B8';
    ctx.font = '13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Accuracy Rate:', 104, 430);

    ctx.fillStyle = '#10B981';
    ctx.font = 'bold 18px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(`${correctCount} / ${attemptsCount} Trials Correct`, 104, 458);

    // Calculation Badges
    if (noveltyVerified) {
      ctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
      ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(104, 490, 296, 36, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#34D399';
      ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('✓ Live Calculation Verified', 124, 513);
    } else if (isCrucibleActive) {
      ctx.fillStyle = 'rgba(168, 85, 247, 0.15)';
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.roundRect(104, 490, 296, 36, 10);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#C084FC';
      ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText('👑 Grandmaster Crucible Tested', 124, 513);
    }
    ctx.restore();

    // 6. Card Frame: Right Side (Cognitive Archetype & Radar)
    ctx.save();
    ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(460, 160, 668, 435, 24);
    ctx.fill();
    ctx.stroke();

    // Archetype Label
    ctx.fillStyle = '#94A3B8';
    ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('COGNITIVE ARCHETYPE', 496, 205);

    // Archetype Title (Large White)
    ctx.fillStyle = '#F8FAFC';
    ctx.font = '900 34px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(patternName, 496, 252);

    // Insight Quote
    ctx.fillStyle = '#CBD5E1';
    ctx.font = 'italic 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

    // Helper: text wrapper
    const wrapText = (text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
      const words = text.split(' ');
      let line = '';
      let currentY = y;
      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && n > 0) {
          ctx.fillText(line, x, currentY);
          line = words[n] + ' ';
          currentY += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line, x, currentY);
      return currentY;
    };

    wrapText(`"${insight}"`, 496, 290, 596, 26);

    // Core Strength Chip
    ctx.fillStyle = 'rgba(16, 185, 129, 0.12)';
    ctx.strokeStyle = 'rgba(16, 185, 129, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(496, 380, 596, 60, 14);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#34D399';
    ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('CORE STRENGTH', 516, 404);

    ctx.fillStyle = '#F8FAFC';
    ctx.font = '600 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(strength, 516, 426);

    // Area to Improve Chip
    ctx.fillStyle = 'rgba(232, 163, 61, 0.12)';
    ctx.strokeStyle = 'rgba(232, 163, 61, 0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.roundRect(496, 455, 596, 60, 14);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#FBBF24';
    ctx.font = 'bold 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('AREA TO IMPROVE', 516, 479);

    ctx.fillStyle = '#F8FAFC';
    ctx.font = '600 14px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText(weakness, 516, 501);

    // Footer Watermark inside card
    ctx.fillStyle = '#64748B';
    ctx.font = '500 13px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('Diagnose your chess calculation at chesszapp.vercel.app', 496, 560);

    ctx.restore();

    // 7. Outer Bottom Footer
    ctx.fillStyle = '#475569';
    ctx.font = '500 12px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
    ctx.fillText('ChessZ • Tournament Benchmark Engine • 100% Free & Open-Source', 72, 636);

    // Convert to Image Data URL for high-res preview
    const dataUrl = canvas.toDataURL('image/png');
    const timer = setTimeout(() => {
      setPreviewUrl(dataUrl);
      setImageLoaded(true);
    }, 0);
    return () => clearTimeout(timer);
  }, [
    isOpen,
    diagnosedElo,
    levelName,
    patternName,
    insight,
    strength,
    weakness,
    attemptsCount,
    correctCount,
    noveltyVerified,
    isCrucibleActive,
  ]);

  if (!isOpen) return null;

  const handleDownload = () => {
    if (!previewUrl) return;
    const a = document.createElement('a');
    a.href = previewUrl;
    a.download = `ChessZ-Diagnosis-${patternName.replace(/\s+/g, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyImage = async () => {
    if (!previewUrl) return;
    try {
      const res = await fetch(previewUrl);
      const blob = await res.blob();
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (err) {
      console.warn('Clipboard write failed, triggering download fallback', err);
      handleDownload();
    }
  };

  const shareText = `I was diagnosed as "${patternName}" (~${diagnosedElo} Elo) on ChessZ! Test your real chess calculation level here:`;
  const shareUrl = 'https://chesszapp.vercel.app/diagnose';

  const handleShareTwitter = () => {
    const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(tweetUrl, '_blank', 'noopener,noreferrer');
  };

  const handleShareWhatsApp = () => {
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="share-card-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl theme-surface border border-[var(--border-subtle)] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-[var(--border-subtle)]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-amber-500/15 text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-500/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 id="share-card-title" className="text-base font-bold theme-text-primary font-display">
                Share Your Chess Diagnosis
              </h2>
              <p className="text-[11px] theme-text-muted font-mono">
                High-Resolution Social Card (1200 x 675)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl theme-surface-hover theme-text-muted hover:theme-text-primary transition cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content with Card Preview */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4">
          {/* Card Preview Container */}
          <div className="rounded-2xl overflow-hidden border border-[var(--border-subtle)] shadow-xl bg-[#0F172A] aspect-video relative flex items-center justify-center">
            {imageLoaded && previewUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={previewUrl}
                alt="ChessZ Diagnostic Share Card Preview"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-400">
                <div className="w-6 h-6 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                <span className="text-xs font-mono">Generating social card...</span>
              </div>
            )}
          </div>

          {/* Quick Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
            {/* Download PNG Button */}
            <button
              onClick={handleDownload}
              className="py-3 px-4 rounded-xl bg-[var(--accent-primary)] hover:opacity-90 text-white font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm active:scale-98"
            >
              <Download className="w-4 h-4" />
              <span>Download Image (.PNG)</span>
            </button>

            {/* Copy to Clipboard Button */}
            <button
              onClick={handleCopyImage}
              className="py-3 px-4 rounded-xl theme-surface border border-[var(--border-focus)] hover:bg-[var(--surface-muted)] theme-text-primary font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer shadow-sm active:scale-98"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-500">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Image to Clipboard</span>
                </>
              )}
            </button>
          </div>

          {/* Direct Social Share Links */}
          <div className="pt-2 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-[11px] font-mono theme-text-muted">Share directly to:</span>
            <div className="flex items-center gap-2">
              {/* Twitter / X */}
              <button
                onClick={handleShareTwitter}
                className="px-3 py-1.5 rounded-lg bg-black hover:bg-neutral-800 text-white font-semibold text-[11px] flex items-center gap-1.5 transition cursor-pointer border border-neutral-700"
              >
                <span>𝕏 Post on X</span>
                <ExternalLink className="w-3 h-3 text-neutral-400" />
              </button>

              {/* WhatsApp */}
              <button
                onClick={handleShareWhatsApp}
                className="px-3 py-1.5 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-black font-bold text-[11px] flex items-center gap-1.5 transition cursor-pointer"
              >
                <span>Share on WhatsApp</span>
                <ExternalLink className="w-3 h-3 text-black/60" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
