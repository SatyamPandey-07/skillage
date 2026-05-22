"use client";

import { useState, useEffect } from "react";
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

  // Sync state if defaultTopic changes from suggestions
  useEffect(() => {
    if (defaultTopic) {
      setTopic(defaultTopic);
    }
  }, [defaultTopic]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim() || loading) return;
    onSubmit(topic.trim(), difficulty, numQuestions);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in w-full">
      <div className="se-card border border-white/10 bg-black/45 backdrop-blur-2xl p-4 sm:p-5 rounded-2xl shadow-2xl transition-all hover:border-cyan-500/25">
        {/* Input Area */}
        <div className="w-full">
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="What do you want to learn today? (e.g. Zero Knowledge Proofs)"
            className="w-full bg-transparent border-none outline-none text-white text-base sm:text-lg md:text-xl font-light placeholder-white/20 focus:outline-none focus:ring-0 px-1 py-2 sm:py-3 transition-all"
            disabled={loading}
            autoFocus
          />
        </div>

        {/* Separator line */}
        <div className="h-[1px] w-full bg-white/5 my-3" />

        {/* Controls row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {/* Difficulty Pill */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                className="w-full sm:w-auto appearance-none bg-black/60 border border-white/10 text-white/80 rounded-full pl-3 pr-8 py-1.5 text-xs font-semibold cursor-pointer hover:bg-black/80 hover:border-cyan-500/30 transition-all focus:outline-none"
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
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
              />
            </div>

            {/* Questions Pill */}
            <div className="relative flex-1 sm:flex-initial">
              <select
                value={numQuestions}
                onChange={(e) => setNumQuestions(Number(e.target.value))}
                className="w-full sm:w-auto appearance-none bg-black/60 border border-white/10 text-white/80 rounded-full pl-3 pr-8 py-1.5 text-xs font-semibold cursor-pointer hover:bg-black/80 hover:border-cyan-500/30 transition-all focus:outline-none"
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
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 pointer-events-none"
              />
            </div>
          </div>

          {/* Learn Button */}
          <button
            type="submit"
            disabled={!topic.trim() || loading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold text-white transition-all duration-300 disabled:opacity-40 disabled:scale-100 hover:scale-[1.03] se-btn-glow-cyan w-full sm:w-auto justify-center cursor-pointer"
            style={{
              background: loading ? "rgba(6, 182, 212, 0.4)" : "linear-gradient(90deg, #06b6d4, #6366f1)",
              border: "none",
            }}
            aria-label="Generate lesson"
          >
            <Sparkles size={13} className={loading ? "animate-spin text-cyan-200" : "animate-pulse text-cyan-200"} />
            <span>{loading ? "Generating..." : "Generate AI Lesson"}</span>
          </button>
        </div>
      </div>

      <p className="text-[10px] tracking-wider text-white/30 text-center font-mono uppercase">
        AI generates a customized interactive lesson + {numQuestions}-question {difficulty.toLowerCase()} MCQ quiz. Score ≥80% to earn your soulbound NFT.
      </p>
    </form>
  );
}
