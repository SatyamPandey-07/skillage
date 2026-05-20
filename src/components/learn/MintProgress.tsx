"use client";

import { useEffect } from "react";
import { CheckCircle2, Loader2, ExternalLink, Share2 } from "lucide-react";
import { ugfErrorMessage } from "@/src/utils/ugfErrors";
import Link from "next/link";

export type MintStage = "quoting" | "settling" | "executing" | "confirmed" | "error";

const STAGES: { key: MintStage; label: string; icon: string }[] = [
  { key: "quoting", label: "Getting gas quote", icon: "💬" },
  { key: "settling", label: "Authorizing payment (no ETH needed)", icon: "✍️" },
  { key: "executing", label: "Sending transaction to Base Sepolia", icon: "⚡" },
  { key: "confirmed", label: "Certificate minted!", icon: "🎓" },
];

interface MintProgressProps {
  stage: MintStage;
  txHash?: string;
  error?: string;
  onNewLesson?: () => void;
}

export function MintProgress({ stage, txHash, error, onNewLesson }: MintProgressProps) {
  const currentIndex = STAGES.findIndex((s) => s.key === stage);

  useEffect(() => {
    if (stage !== "confirmed" || typeof window === "undefined") return;
    runConfetti();
  }, [stage]);

  return (
    <div
      className="se-card p-6 space-y-1 max-w-md mx-auto"
      style={
        stage !== "confirmed" && stage !== "error"
          ? { boxShadow: "0 0 30px rgba(99,102,241,0.12)" }
          : {}
      }
    >
      <p className="se-label mb-4">Minting certificate</p>

      {STAGES.map((s, i) => {
        const isDone = i < currentIndex || stage === "confirmed";
        const isActive = s.key === stage && stage !== "confirmed" && stage !== "error";
        const isPending = i > currentIndex;

        return (
          <div
            key={s.key}
            className="flex items-center gap-3 px-3 py-2.5 rounded-[8px] transition-all"
            style={isActive ? { background: "rgba(99,102,241,0.06)" } : {}}
          >
            <span className="text-base w-6 text-center">{s.icon}</span>
            <span
              className={`flex-1 text-sm ${
                isDone ? "text-white/70" : isActive ? "text-white" : "text-white/25"
              }`}
            >
              {s.label}
            </span>
            <div className="w-5 h-5 flex items-center justify-center">
              {isDone ? (
                <CheckCircle2
                  size={16}
                  className="text-emerald-400"
                  style={{ animation: "scale-pop 300ms ease-out" }}
                />
              ) : isActive ? (
                <div
                  className="w-2 h-2 rounded-full bg-indigo-400"
                  style={{ animation: "pulse 2s ease-in-out infinite" }}
                  role="status"
                  aria-label="Processing"
                />
              ) : null}
            </div>
          </div>
        );
      })}

      {/* Error */}
      {stage === "error" && error && (
        <div
          className="mt-3 p-3 rounded-[8px] border"
          role="alert"
          style={{ background: "rgba(239,68,68,0.08)", borderColor: "rgba(239,68,68,0.2)" }}
        >
          <p className="text-sm font-semibold text-red-400">Mint failed</p>
          <p className="text-xs text-red-400/70 mt-1">{ugfErrorMessage(error)}</p>
        </div>
      )}

      {/* Confirmed CTAs */}
      {stage === "confirmed" && txHash && (
        <div className="mt-4 space-y-2 pt-2 border-t border-white/8">
          <Link
            href={`https://sepolia.basescan.org/tx/${txHash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full py-2.5 rounded-[8px] text-sm font-medium text-white/70 border border-white/10 hover:border-white/20 hover:text-white transition-all"
          >
            <ExternalLink size={14} />
            View on BaseScan
          </Link>
          {onNewLesson && (
            <button
              onClick={onNewLesson}
              className="w-full py-2.5 rounded-[8px] text-sm font-semibold text-white transition-all"
              style={{ background: "rgb(99,102,241)" }}
            >
              Start a new lesson
            </button>
          )}
        </div>
      )}

      <style>{`
        @keyframes scale-pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes scale-pop { 0%, 100% { transform: scale(1); } }
          @keyframes pulse { 0%, 100% { opacity: 1; } }
        }
      `}</style>
    </div>
  );
}

function runConfetti() {
  const canvas = document.createElement("canvas");
  canvas.id = "confetti-canvas";
  document.body.appendChild(canvas);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext("2d")!;

  const particles = Array.from({ length: 120 }, () => ({
    x: Math.random() * canvas.width,
    y: -20,
    r: Math.random() * 6 + 3,
    d: Math.random() * 2 + 1,
    color: ["#6366f1", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899"][
      Math.floor(Math.random() * 5)
    ],
    tilt: Math.random() * 10 - 5,
    tiltSpeed: Math.random() * 0.2 - 0.1,
  }));

  let elapsed = 0;
  const duration = 1500;
  let last = performance.now();

  function draw(now: number) {
    elapsed += now - last;
    last = now;
    if (elapsed > duration) {
      canvas.remove();
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.y += p.d;
      p.tilt += p.tiltSpeed;
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.r, p.r / 2, p.tilt, 0, 2 * Math.PI);
      ctx.fillStyle = p.color;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}
