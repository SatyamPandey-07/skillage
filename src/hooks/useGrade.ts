"use client";

import { useState } from "react";

export interface GradeData {
  scores: { questionId: number; score: number; feedback: string }[];
  totalScore: number;
  passed: boolean;
  overallFeedback: string;
  strongestAnswer: number;
  weakestAnswer: number;
}

interface GradeParams {
  topic: string;
  difficulty: string;
  lessonSummary: string;
  questions: { id: number; question: string }[];
  answers: { questionId: number; answer: string }[];
}

export function useGrade() {
  const [grade, setGrade] = useState<GradeData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function gradeAnswers(params: GradeParams) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/grade", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Grading failed");
      setGrade(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI service temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  }

  return { grade, loading, error, gradeAnswers };
}
