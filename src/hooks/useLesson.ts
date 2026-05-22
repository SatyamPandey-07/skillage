"use client";

import { useState } from "react";

export interface McqQuestion {
  id: number;
  question: string;
  options: [string, string, string, string];
  correctIndex: number;
}

export interface LessonData {
  title: string;
  summary: string;
  keyPoints: string[];
  funFact: string;
  questions: McqQuestion[];
  topic?: string;
  difficulty?: string;
  numQuestions?: number;
}

export function useLesson() {
  const [lesson, setLesson] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateLesson(topic: string, difficulty: string, numQuestions = 5) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty, numQuestions }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to generate lesson");
      setLesson(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "AI service temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  }

  async function retryQuestions(topic: string, difficulty: string, numQuestions = 5) {
    if (!lesson) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/retry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, difficulty, numQuestions }),
      });
      const questions = await res.json();
      if (!res.ok) throw new Error(questions.error ?? "Failed to generate questions");
      setLesson({ ...lesson, questions });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to get new questions.");
    } finally {
      setLoading(false);
    }
  }

  return { lesson, loading, error, generateLesson, retryQuestions };
}
