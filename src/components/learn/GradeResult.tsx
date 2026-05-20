"use client";

import { ScoreRing } from "./ScoreRing";
import { RefreshCcw, Award } from "lucide-react";

interface QuestionScore {
  questionId: number;
  score: number;
  feedback: string;
}

interface GradeData {
  scores: QuestionScore[];
  totalScore: number;
  passed: boolean;
  overallFeedback: string;
  strongestAnswer: number;
  weakestAnswer: number;
}

interface GradeResultProps {
  grade: GradeData;
  onMint: () => void;
  onRetry: () => void;
  minting?: boolean;
}

function scoreChipColor(s: number) {
  if (s >= 16) return { bg: "rgba(16,185,129,0.12)", border: "rgba(16,185,129,0.25)", text: "#34d399" };
  if (s >= 8) return { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.25)", text: "#fbbf24" };
  return { bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.25)", text: "#f87171" };
}

export function GradeResult({ grade, onMint, onRetry, minting }: GradeResultProps) {
  return (
    <div className="space-y-6">
      {/* Score ring + status */}
      <div className="se-card p-8 flex flex-col items-center gap-4">
        <ScoreRing score={grade.totalScore} />
        <div className="text-center">
          {grade.passed ? (
            <span
              className="text-sm font-medium px-3 py-1 rounded-full"
              style={{ background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.25)", color: "#34d399" }}
            >
              Passed ✓
            </span>
          ) : (
            <span
              className="text-sm font-medium px-3 py-1 rounded-full"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}
            >
              Not yet — {grade.totalScore < 60 ? "Keep trying!" : "Almost there!"}
            </span>
          )}
        </div>

        {/* Overall feedback */}
        <div
          className="w-full p-4 rounded-[8px]"
          style={{
            background: "rgba(255,255,255,0.03)",
            borderLeft: "3px solid rgba(99,102,241,0.5)",
          }}
        >
          <p className="text-sm text-white/70 leading-relaxed">{grade.overallFeedback}</p>
        </div>
      </div>

      {/* Per-question breakdown */}
      <div className="space-y-3">
        <p className="se-label">Question breakdown</p>
        {grade.scores.map((qs) => {
          const chip = scoreChipColor(qs.score);
          const isWeakest = qs.questionId === grade.weakestAnswer;
          return (
            <div
              key={qs.questionId}
              className="se-card px-4 py-3 flex items-start gap-3"
              style={isWeakest ? { borderLeft: "2px solid rgba(245,158,11,0.5)" } : {}}
            >
              <span className="se-label mt-0.5 shrink-0">Q{qs.questionId}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white/65 leading-relaxed">{qs.feedback}</p>
              </div>
              <span
                className="shrink-0 px-2 py-0.5 rounded-[4px] text-xs font-semibold"
                style={{ background: chip.bg, border: `1px solid ${chip.border}`, color: chip.text }}
              >
                {qs.score}/20
              </span>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      {grade.passed ? (
        <button
          onClick={onMint}
          disabled={minting}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-[8px] text-sm font-semibold text-white transition-all disabled:opacity-60"
          style={{ background: minting ? "rgba(99,102,241,0.5)" : "rgb(99,102,241)" }}
        >
          <Award size={16} />
          {minting ? "Minting your certificate…" : "Mint your certificate"}
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
            You need ≥80 to earn a certificate. New questions, same topic.
          </p>
        </div>
      )}
    </div>
  );
}
