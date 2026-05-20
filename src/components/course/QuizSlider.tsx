"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import type { QuizQuestion } from "@/src/types/course";

interface QuizSliderProps {
  questions: QuizQuestion[];
  onComplete: () => void;
}

export function QuizSlider({ questions, onComplete }: QuizSliderProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<Record<number, number>>({});
  const [revealed, setRevealed] = useState<Record<number, boolean>>({});
  const [done, setDone] = useState(false);

  const q = questions[current];
  const isRevealed = revealed[q.id];
  const selectedIdx = selected[q.id];
  const correctCount = questions.filter((q) => selected[q.id] === q.correctIndex).length;

  function handleSelect(idx: number) {
    if (isRevealed) return;
    setSelected((prev) => ({ ...prev, [q.id]: idx }));
  }

  function handleCheck() {
    if (selectedIdx === undefined) return;
    setRevealed((prev) => ({ ...prev, [q.id]: true }));
  }

  function handleNext() {
    if (current < questions.length - 1) {
      setCurrent((c) => c + 1);
    } else {
      setDone(true);
      onComplete();
    }
  }

  if (done) {
    return (
      <div
        className="se-card p-6 text-center space-y-3"
        style={{ borderColor: "rgba(16,185,129,0.3)" }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center mx-auto"
          style={{
            background: "rgba(16,185,129,0.12)",
            border: "1px solid rgba(16,185,129,0.3)",
          }}
        >
          <CheckCircle2 size={24} className="text-emerald-400" />
        </div>
        <p className="font-semibold text-white">Submodule Complete!</p>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)" }}>
          {correctCount} / {questions.length} correct
        </p>
      </div>
    );
  }

  return (
    <div className="se-card overflow-hidden">
      {/* Slide progress bar */}
      <div className="flex gap-1 p-3 pb-0">
        {questions.map((_, i) => (
          <div
            key={i}
            className="flex-1 h-1 rounded-full transition-all duration-300"
            style={{
              background:
                i < current
                  ? revealed[questions[i].id]
                    ? selected[questions[i].id] === questions[i].correctIndex
                      ? "#10b981"
                      : "#ef4444"
                    : "rgba(255,255,255,0.2)"
                  : i === current
                  ? "#6366f1"
                  : "rgba(255,255,255,0.08)",
            }}
          />
        ))}
      </div>

      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <span className="se-label">
            Question {current + 1} of {questions.length}
          </span>
        </div>

        <p className="text-sm font-medium leading-relaxed" style={{ color: "rgba(255,255,255,0.9)" }}>
          {q.question}
        </p>

        <div className="space-y-2">
          {q.options.map((opt, idx) => {
            const isSelected = selectedIdx === idx;
            const isCorrect = idx === q.correctIndex;
            let borderColor = "rgba(255,255,255,0.08)";
            let bgColor = "transparent";
            let textColor = "rgba(255,255,255,0.65)";

            if (isRevealed) {
              if (isCorrect) {
                borderColor = "rgba(16,185,129,0.5)";
                bgColor = "rgba(16,185,129,0.08)";
                textColor = "#6ee7b7";
              } else if (isSelected) {
                borderColor = "rgba(239,68,68,0.4)";
                bgColor = "rgba(239,68,68,0.06)";
                textColor = "rgba(255,255,255,0.45)";
              }
            } else if (isSelected) {
              borderColor = "rgba(99,102,241,0.5)";
              bgColor = "rgba(99,102,241,0.08)";
              textColor = "#a5b4fc";
            }

            return (
              <button
                key={idx}
                onClick={() => handleSelect(idx)}
                className="w-full text-left px-4 py-3 rounded-[8px] text-sm transition-all flex items-center gap-3"
                style={{
                  border: `1px solid ${borderColor}`,
                  background: bgColor,
                  color: textColor,
                  cursor: isRevealed ? "default" : "pointer",
                }}
              >
                <span
                  className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-semibold"
                  style={{
                    background: isSelected && !isRevealed ? "rgba(99,102,241,0.2)" : "rgba(255,255,255,0.06)",
                    color: isSelected && !isRevealed ? "#a5b4fc" : "rgba(255,255,255,0.3)",
                  }}
                >
                  {["A", "B", "C", "D"][idx]}
                </span>
                <span className="flex-1">{opt}</span>
                {isRevealed && isCorrect && (
                  <CheckCircle2 size={15} className="shrink-0 text-emerald-400" />
                )}
                {isRevealed && isSelected && !isCorrect && (
                  <XCircle size={15} className="shrink-0 text-red-400" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center justify-between pt-1">
          <button
            onClick={() => current > 0 && setCurrent((c) => c - 1)}
            disabled={current === 0}
            className="flex items-center gap-1 text-sm transition-colors disabled:opacity-20"
            style={{ color: "rgba(255,255,255,0.4)" }}
          >
            <ChevronLeft size={16} />
            Prev
          </button>

          {!isRevealed ? (
            <button
              onClick={handleCheck}
              disabled={selectedIdx === undefined}
              className="px-5 py-2 rounded-[8px] text-sm font-semibold text-white transition-all disabled:opacity-30"
              style={{
                background: selectedIdx !== undefined ? "rgb(99,102,241)" : "rgba(99,102,241,0.3)",
              }}
            >
              Check Answer
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-1.5 px-5 py-2 rounded-[8px] text-sm font-semibold text-white transition-all"
              style={{ background: "rgb(99,102,241)" }}
            >
              {current < questions.length - 1 ? "Next" : "Complete"}
              <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
