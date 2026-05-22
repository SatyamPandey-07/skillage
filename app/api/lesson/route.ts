import { NextRequest } from "next/server";
import { generateText } from "@/src/lib/claude";

export async function POST(request: NextRequest) {
  try {
    const { topic, difficulty = "Easy", numQuestions = 5 } = await request.json();

    if (!topic?.trim()) {
      return Response.json({ error: "Topic is required" }, { status: 400 });
    }

    const n = Math.min(Math.max(Number(numQuestions) || 5, 5), 20);

    const difficultyGuide =
      difficulty === "Easy"
        ? "Fundamental concepts, straightforward options with one clearly correct answer."
        : difficulty === "Medium"
        ? "Moderate depth with some nuance. Options should require understanding, not just recall."
        : "Advanced level. Tests deep understanding, edge cases, and trade-offs.";

    const raw = await generateText(
      `You are a concise, engaging educator. Return ONLY valid JSON — no markdown, no backticks, no preamble.`,
      `Create a lesson with an MCQ quiz on: "${topic}" at ${difficulty} level.

Return exactly this JSON schema:
{
  "title": "string — punchy lesson title",
  "summary": "string — 3-4 sentence explanation",
  "keyPoints": ["string", "string", "string"],
  "funFact": "string — one surprising or memorable fact",
  "questions": [
    {
      "id": 1,
      "question": "string — tests conceptual understanding, not trivia",
      "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
      "correctIndex": 0
    }
  ]
}

Rules:
- Generate exactly ${n} MCQ questions
- Each question has exactly 4 options
- correctIndex is an integer 0–3 indicating the correct option
- Distribute correctIndex values — do NOT always use 0
- No open-ended questions, no fill-in-the-blank
- Difficulty guide: ${difficultyGuide}
- Plausible distractors — wrong options should be believable, not obviously wrong`
    );

    const json = raw.replace(/```json|```/g, "").trim();
    const data = JSON.parse(json);
    return Response.json({ ...data, topic, difficulty, numQuestions: n });
  } catch (err) {
    console.error("[/api/lesson]", err);
    return Response.json({ error: "AI service temporarily unavailable." }, { status: 500 });
  }
}
