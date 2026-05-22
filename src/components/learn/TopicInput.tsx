"use client";

import { useState } from "react";
import { Sparkles, ChevronDown } from "lucide-react";

const DIFFICULTIES = ["Easy", "Medium", "Hard"] as const;
const QUESTION_COUNTS = [5, 10, 15, 20] as const;
type Difficulty = (typeof DIFFICULTIES)[number];

interface TopicInputProps {
  onSubmit: (topic: string, difficulty: Difficulty, numQuestions: number) => void;
  loading?: boolean;
  defaultTopic?: string;
  defaultDifficulty?: Difficulty;
  defaultNumQuestions?: number;
}

export function TopicInput({
  onSubmit,
  loading,
  defaultTopic = "",
  defaultDifficulty = "Easy",
  defaultNumQuestions = 5,
}: TopicInputProps) {
  const [topic, setTopic] = useState(defaultTopic);
  const [difficulty, setDifficulty] = useState<Difficulty>(defaultDifficulty);
  const [numQuestions, setNumQuestions] = useState(defaultNumQuestions);

  const selectBase =
    "appearance-none pl-3 pr-7 py-1.5 text-sm rounded-[8px] border border-white/10 text-white/70 cursor-pointer focus:outline-none focus:border-indigo-500";
  const selectStyle = { background: "rgba(20,20,32,0.9)" };

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim() || loading) return;
    onSubmit(topic.trim(), difficulty, numQuestions);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="What do you want to learn today?"
          className="se-input text-lg px-5 py-4 pr-60"
          disabled={loading}
          autoFocus
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {/* Difficulty */}
          <div className="relative">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className={selectBase}
              style={selectStyle}
              disabled={loading}
            >
              {DIFFICULTIES.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
            />
          </div>

          {/* Question count */}
          <div className="relative">
            <select
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              className={selectBase}
              style={selectStyle}
              disabled={loading}
            >
              {QUESTION_COUNTS.map((n) => (
                <option key={n} value={n}>
                  {n} Qs
                </option>
              ))}
            </select>
            <ChevronDown
              size={12}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!topic.trim() || loading}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-sm font-semibold text-white transition-all disabled:opacity-40"
            style={{ background: "rgb(99,102,241)" }}
            aria-label="Generate lesson"
          >
            <Sparkles size={14} />
            {loading ? "Generating…" : "Learn"}
          </button>
        </div>
      </div>
      <p className="text-xs text-white/35 text-center">
        AI generates a lesson + {numQuestions}-question {difficulty.toLowerCase()} MCQ quiz. Score ≥80% to earn a certificate.
      </p>
    </form>
  );
}
