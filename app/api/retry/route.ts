import { NextRequest } from "next/server";
import { generateText } from "@/src/lib/claude";

export async function POST(request: NextRequest) {
  try {
    const { topic, difficulty = "Easy", numQuestions = 5 } = await request.json();

    if (!topic?.trim()) {
      return Response.json({ error: "Topic is required" }, { status: 400 });
    }

    const n = Math.min(Math.max(Number(numQuestions) || 5, 5), 20);

    const raw = await generateText(
      `You are an educator generating MCQ quiz questions.
Return ONLY a valid JSON array. No markdown, no preamble.`,
      `Generate ${n} NEW MCQ questions on "${topic}" at ${difficulty} level.
These must be DIFFERENT from typical first-attempt questions — cover less obvious aspects.

Return a JSON array:
[
  {
    "id": 1,
    "question": "string",
    "options": ["A text", "B text", "C text", "D text"],
    "correctIndex": 0
  }
]

Rules:
- Exactly ${n} questions, each with exactly 4 options
- correctIndex is 0–3; distribute values across questions
- Plausible distractors for wrong options`
    );

    const json = raw.replace(/```json|```/g, "").trim();
    return Response.json(JSON.parse(json));
  } catch (err) {
    console.error("[/api/retry]", err);
    return Response.json({ error: "AI service temporarily unavailable." }, { status: 500 });
  }
}
