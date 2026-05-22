"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import type { McqQuestion } from "@/src/hooks/useLesson";

export interface McqAnswer {
  questionId: number;
  selectedIndex: number;
}

interface QuizFormProps {
  questions: McqQuestion[];
  onSubmit: (answers: McqAnswer[]) => void;
  loading?: boolean;
}

export function QuizForm({ questions, onSubmit, loading }: QuizFormProps) {
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [showUnanswered, setShowUnanswered] = useState(false);

  const answeredCount = Object.keys(selected).length;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const hasUnanswered = questions.some((q) => selected[q.id] === undefined);
    if (hasUnanswered) {
      setShowUnanswered(true);
      return;
    }
    onSubmit(questions.map((q) => ({ questionId: q.id, selectedIndex: selected[q.id] })));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-24">
      {questions.map((q, i) => {
        const isUnanswered = showUnanswered && selected[q.id] === undefined;

        return (
          <div
            key={q.id}
            className="se-card p-5"
            style={isUnanswered ? { borderColor: "rgba(239,68,68,0.4)" } : {}}
          >
            {/* Question header */}
            <div className="flex items-start gap-3 mb-4">
              <span
                className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold"
                style={{
                  background: "rgba(99,102,241,0.15)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  color: "#818cf8",
                }}
              >
                {i + 1}
              </span>
              <p className="text-sm font-medium text-white/85 leading-relaxed pt-0.5">
                {q.question}
              </p>
            </div>

            {/* Options */}
            <div className="space-y-2">
              {q.options.map((opt, idx) => {
                const isSelected = selected[q.id] === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() =>
                      !loading && setSelected((prev) => ({ ...prev, [q.id]: idx }))
                    }
                    disabled={loading}
                    className="w-full text-left px-4 py-3 rounded-[8px] text-sm transition-all flex items-center gap-3"
                    style={{
                      border: `1px solid ${
                        isSelected ? "rgba(99,102,241,0.5)" : "rgba(255,255,255,0.08)"
                      }`,
                      background: isSelected ? "rgba(99,102,241,0.08)" : "transparent",
                      color: isSelected ? "#a5b4fc" : "rgba(255,255,255,0.65)",
                      cursor: loading ? "default" : "pointer",
                    }}
                  >
                    <span
                      className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold"
                      style={{
                        background: isSelected
                          ? "rgba(99,102,241,0.2)"
                          : "rgba(255,255,255,0.06)",
                        color: isSelected ? "#a5b4fc" : "rgba(255,255,255,0.3)",
                      }}
                    >
                      {["A", "B", "C", "D"][idx]}
                    </span>
                    <span className="flex-1">{opt}</span>
                  </button>
                );
              })}
            </div>

            {isUnanswered && (
              <p className="mt-2 text-xs text-red-400">Please select an answer.</p>
            )}
          </div>
        );
      })}

      {/* Sticky submit bar */}
      <div
        className="fixed bottom-0 left-0 right-0 p-4 flex items-center justify-between gap-4 border-t border-white/8"
        style={{ background: "rgba(10,10,15,0.95)", backdropFilter: "blur(12px)" }}
      >
        <span className="text-sm text-white/40">
          {answeredCount} / {questions.length} answered
        </span>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-6 py-2.5 rounded-[8px] text-sm font-semibold text-white transition-all disabled:opacity-50"
          style={{
            background: loading ? "rgba(99,102,241,0.5)" : "rgb(99,102,241)",
          }}
        >
          <Send size={14} />
          {loading ? "Saving…" : "Submit Quiz"}
        </button>
      </div>
    </form>
  );
}
