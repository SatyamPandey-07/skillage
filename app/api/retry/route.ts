import { NextRequest } from "next/server";
import { generateText } from "@/src/lib/claude";

export async function POST(request: NextRequest) {
  try {
    const { topic, difficulty = "Beginner" } = await request.json();

    if (!topic?.trim()) {
      return Response.json({ error: "Topic is required" }, { status: 400 });
    }

    const raw = await generateText(
      `You are an educator generating quiz questions.
Return ONLY a valid JSON array of 5 question objects. No markdown, no preamble.
Schema:
[
  { "id": 1, "question": "string — open-ended, requires understanding not recall" },
  { "id": 2, "question": "string" },
  { "id": 3, "question": "string" },
  { "id": 4, "question": "string" },
  { "id": 5, "question": "string — harder, tests deeper understanding" }
]
Generate 5 DIFFERENT questions from a typical previous set on this topic.
Focus on aspects of the topic not covered by the most obvious questions.`,
      `Topic: ${topic}\nDifficulty: ${difficulty}`
    );

    const json = raw.replace(/```json|```/g, "").trim();
    return Response.json(JSON.parse(json));
  } catch (err) {
    console.error("[/api/retry]", err);
    return Response.json({ error: "AI service temporarily unavailable." }, { status: 500 });
  }
}
