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
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div className="relative flex flex-col md:block">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="What do you want to learn today?"
          className="se-input text-base md:text-lg px-5 py-4 pr-4 md:pr-64 w-full"
          disabled={loading}
          autoFocus
        />
        <div className="mt-3 md:mt-0 md:absolute md:right-2 md:top-1/2 md:-translate-y-1/2 flex flex-wrap items-center gap-2 justify-end w-full md:w-auto">
          {/* Difficulty */}
          <div className="relative flex-1 md:flex-initial">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className={`${selectBase} w-full`}
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
          <div className="relative flex-1 md:flex-initial">
            <select
              value={numQuestions}
              onChange={(e) => setNumQuestions(Number(e.target.value))}
              className={`${selectBase} w-full`}
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
            className="flex items-center gap-1.5 px-4 py-2 rounded-[8px] text-sm font-semibold text-white transition-all disabled:opacity-40 se-btn-glow-cyan hover:scale-[1.02] w-full md:w-auto justify-center"
            style={{
              background: loading ? "rgba(6, 182, 212, 0.4)" : "linear-gradient(90deg, #06b6d4, #6366f1)",
              border: "none",
            }}
            aria-label="Generate lesson"
          >
            <Sparkles size={14} className={loading ? "animate-spin" : "animate-pulse"} />
            {loading ? "Generating…" : "Learn"}
          </button>
        </div>
      </div>
      <p className="text-xs text-white/35 text-center">
        AI generates a customized interactive lesson + {numQuestions}-question {difficulty.toLowerCase()} MCQ quiz. Score ≥80% to earn your soulbound NFT.
      </p>
    </form>
  );
}
