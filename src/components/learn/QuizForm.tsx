"use client";

import { useState } from "react";
import { Send } from "lucide-react";

interface Question {
  id: number;
  question: string;
}

interface Answer {
  questionId: number;
  answer: string;
}

interface QuizFormProps {
  questions: Question[];
  onSubmit: (answers: Answer[]) => void;
  loading?: boolean;
}

export function QuizForm({ questions, onSubmit, loading }: QuizFormProps) {
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [showEmpty, setShowEmpty] = useState(false);

  const answeredCount = Object.values(answers).filter((a) => a.trim()).length;

  function setAnswer(id: number, value: string) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const unanswered = questions.some((q) => !answers[q.id]?.trim());
    if (unanswered) {
      setShowEmpty(true);
      return;
    }
    onSubmit(
      questions.map((q) => ({ questionId: q.id, answer: answers[q.id] ?? "" }))
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pb-24">
      {questions.map((q, i) => {
        const isEmpty = showEmpty && !answers[q.id]?.trim();
        return (
          <div key={q.id} className="se-card p-5">
            {/* Question chip + text */}
            <div className="flex items-start gap-3 mb-3">
              <span
                className="shrink-0 w-7 h-7 flex items-center justify-center rounded-full text-xs font-semibold"
                style={{
                  background: "rgba(99,102,241,0.15)",
                  border: "1px solid rgba(99,102,241,0.3)",
                  color: "#818cf8",
                }}
              >
                Q{q.id}
              </span>
              <p className="text-sm font-medium text-white/80 leading-relaxed pt-0.5">
                {q.question}
              </p>
            </div>

            {/* Textarea */}
            <div className="relative">
              <textarea
                value={answers[q.id] ?? ""}
                onChange={(e) => setAnswer(q.id, e.target.value)}
                placeholder="Answer in your own words…"
                className={`se-input px-4 py-3 text-sm min-h-[100px] resize-y ${
                  isEmpty ? "border-red-500/50 focus:border-red-500" : ""
                }`}
                disabled={loading}
                aria-label={`Answer to question ${q.id}`}
              />
              <span className="absolute bottom-2 right-3 text-[10px] text-white/25">
                {(answers[q.id] ?? "").length} chars
              </span>
            </div>
            {isEmpty && (
              <p className="mt-1 text-xs text-red-400">Please answer this question.</p>
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
          style={{ background: loading ? "rgba(99,102,241,0.5)" : "rgb(99,102,241)" }}
        >
          <Send size={14} />
          {loading ? "Claude is grading…" : "Submit Answers"}
        </button>
      </div>
    </form>
  );
}
