"use client";

import { ScoreRing } from "./ScoreRing";
import { RefreshCcw, Award, CheckCircle2, XCircle } from "lucide-react";

export interface McqGradeData {
  results: {
    questionId: number;
    question: string;
    options: string[];
    selectedIndex: number;
    correctIndex: number;
    correct: boolean;
  }[];
  correct: number;
  total: number;
  totalScore: number;
  passed: boolean;
}

interface GradeResultProps {
  grade: McqGradeData;
  onMint: () => void;
  onRetry: () => void;
}

export function GradeResult({ grade, onMint, onRetry }: GradeResultProps) {
  return (
    <div className="space-y-6">
      {/* Score ring + status */}
      <div className="se-card p-8 flex flex-col items-center gap-4">
        <ScoreRing score={grade.totalScore} />
        <p className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.5)" }}>
          {grade.correct} / {grade.total} correct
        </p>
        <div className="text-center">
          {grade.passed ? (
            <span
              className="text-sm font-medium px-3 py-1 rounded-full"
              style={{
                background: "rgba(16,185,129,0.12)",
                border: "1px solid rgba(16,185,129,0.25)",
                color: "#34d399",
              }}
            >
              Passed ✓
            </span>
          ) : (
            <span
              className="text-sm font-medium px-3 py-1 rounded-full"
              style={{
                background: "rgba(239,68,68,0.1)",
                border: "1px solid rgba(239,68,68,0.2)",
                color: "#f87171",
              }}
            >
              {grade.totalScore < 60 ? "Keep trying!" : "Almost there!"}
            </span>
          )}
        </div>
      </div>

      {/* Per-question breakdown */}
      <div className="space-y-3">
        <p className="se-label">Question breakdown</p>
        {grade.results.map((r) => (
          <div
            key={r.questionId}
            className="se-card px-4 py-3 space-y-2"
            style={
              r.correct
                ? { borderLeft: "2px solid rgba(16,185,129,0.4)" }
                : { borderLeft: "2px solid rgba(239,68,68,0.4)" }
            }
          >
            <div className="flex items-start gap-3">
              {r.correct ? (
                <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-400" />
              ) : (
                <XCircle size={16} className="shrink-0 mt-0.5 text-red-400" />
              )}
              <p className="text-sm text-white/70 leading-relaxed">{r.question}</p>
            </div>

            {!r.correct && (
              <div className="pl-7 space-y-1">
                <p className="text-xs" style={{ color: "rgba(239,68,68,0.7)" }}>
                  Your answer: {r.options[r.selectedIndex] ?? "—"}
                </p>
                <p className="text-xs" style={{ color: "rgba(16,185,129,0.8)" }}>
                  Correct: {r.options[r.correctIndex]}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA */}
      {grade.passed ? (
        <button
          onClick={onMint}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-[8px] text-sm font-semibold text-white transition-all se-btn-glow-cyan hover:scale-[1.01]"
          style={{
            background: "linear-gradient(90deg, #06b6d4, #6366f1)",
            border: "none",
          }}
        >
          <Award size={16} />
          Mint your Soulbound Certificate
        </button>
      ) : (
        <div className="space-y-2">
          <button
            onClick={onRetry}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-[8px] text-sm font-semibold text-white/70 border border-white/10 hover:border-white/20 hover:text-white transition-all"
          >
            <RefreshCcw size={16} />
            Try again with new questions
          </button>
          <p className="text-xs text-white/35 text-center">
            You need ≥80% to earn a certificate. New questions, same topic.
          </p>
        </div>
      )}
    </div>
  );
}
