"use client";

import { useState } from "react";
import { Sparkles, ChevronDown } from "lucide-react";

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"] as const;
type Difficulty = (typeof DIFFICULTIES)[number];

interface TopicInputProps {
  onSubmit: (topic: string, difficulty: Difficulty) => void;
  loading?: boolean;
}

export function TopicInput({ onSubmit, loading }: TopicInputProps) {
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<Difficulty>("Beginner");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!topic.trim() || loading) return;
    onSubmit(topic.trim(), difficulty);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="relative">
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="What do you want to learn today?"
          className="se-input text-lg px-5 py-4 pr-40"
          disabled={loading}
          autoFocus
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {/* Difficulty selector */}
          <div className="relative">
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              className="appearance-none pl-3 pr-7 py-1.5 text-sm rounded-[8px] border border-white/10 text-white/70 cursor-pointer focus:outline-none focus:border-indigo-500"
              style={{ background: "rgba(20,20,32,0.9)" }}
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

          {/* Submit button */}
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
        SkillChain will generate a lesson and quiz. Score ≥80% to earn a soulbound certificate.
      </p>
    </form>
  );
}
