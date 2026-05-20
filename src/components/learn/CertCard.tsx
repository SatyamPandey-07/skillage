"use client";

import { useState } from "react";
import { ExternalLink, Copy, Check, ShieldCheck } from "lucide-react";
import { ScoreRing } from "./ScoreRing";
import { shortenAddress } from "@/src/utils/shortenAddress";
import Link from "next/link";

export interface CertData {
  tokenId?: number;
  topic: string;
  difficulty: string;
  score: number;
  issuedAt?: number;
  mintedAt?: string;
  txHash?: string;
  learner?: string;
}

interface CertCardProps {
  cert: CertData;
  showShareLink?: boolean;
}

function formatDate(ts?: number, dateStr?: string): string {
  const d = ts ? new Date(ts * 1000) : dateStr ? new Date(dateStr) : null;
  if (!d) return "";
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

const DIFFICULTY_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  Beginner: { bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)", text: "#34d399" },
  Intermediate: { bg: "rgba(99,102,241,0.1)", border: "rgba(99,102,241,0.3)", text: "#818cf8" },
  Advanced: { bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)", text: "#fbbf24" },
};

export function CertCard({ cert, showShareLink }: CertCardProps) {
  const [copied, setCopied] = useState(false);
  const diffColor = DIFFICULTY_COLORS[cert.difficulty] ?? DIFFICULTY_COLORS.Beginner;
  const date = formatDate(cert.issuedAt, cert.mintedAt);

  function copyShareLink() {
    if (!cert.learner) return;
    const url = `${window.location.origin}/verify/${cert.learner}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className="rounded-[12px] overflow-hidden border border-white/8 transition-all hover:border-white/15 hover:translate-y-[-2px]"
      style={{
        background: "rgba(255,255,255,0.03)",
        borderTop: "2px solid transparent",
        backgroundImage:
          "linear-gradient(rgba(12,12,18,1),rgba(12,12,18,1)), linear-gradient(90deg,#8B5CF6,#6366f1)",
        backgroundOrigin: "border-box",
        backgroundClip: "padding-box, border-box",
      }}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate">{cert.topic}</h3>
            <div className="flex items-center gap-2 mt-2">
              <span
                className="text-[10px] font-medium px-2 py-0.5 rounded-full"
                style={{ background: diffColor.bg, border: `1px solid ${diffColor.border}`, color: diffColor.text }}
              >
                {cert.difficulty}
              </span>
              {date && <span className="text-xs text-white/35">{date}</span>}
            </div>
          </div>
          <ScoreRing score={cert.score} size={72} />
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-white/8 flex items-center justify-between">
          <span
            className="flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full"
            style={{
              background: "rgba(139,92,246,0.1)",
              border: "1px solid rgba(139,92,246,0.25)",
              color: "#a78bfa",
            }}
          >
            <ShieldCheck size={10} />
            Soulbound
          </span>

          <div className="flex items-center gap-1">
            {cert.txHash && (
              <Link
                href={`https://sepolia.basescan.org/tx/${cert.txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-[6px] text-white/35 hover:text-violet-400 transition-colors border border-white/8 hover:border-violet-500/30"
                aria-label="View transaction on BaseScan"
              >
                <ExternalLink size={12} />
              </Link>
            )}
            {showShareLink && cert.learner && (
              <button
                onClick={copyShareLink}
                className="p-1.5 rounded-[6px] text-white/35 hover:text-indigo-400 transition-colors border border-white/8 hover:border-indigo-500/30"
                aria-label="Copy share link"
              >
                {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
              </button>
            )}
          </div>
        </div>

        {cert.tokenId !== undefined && (
          <p
            className="mt-2 text-[10px] text-white/25"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            #{cert.tokenId}
          </p>
        )}
      </div>
    </div>
  );
}
