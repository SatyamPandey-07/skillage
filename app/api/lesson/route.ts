import { NextRequest } from "next/server";
import { anthropic, MODEL } from "@/src/lib/claude";

export async function POST(request: NextRequest) {
  try {
    const { topic, difficulty = "Beginner" } = await request.json();

    if (!topic?.trim()) {
      return Response.json({ error: "Topic is required" }, { status: 400 });
    }

    const response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: 1500,
      system: `You are a concise, engaging educator. Given a topic and difficulty level,
return ONLY a valid JSON object. No markdown, no preamble, JSON only.
Schema:
{
  "title": "string — punchy lesson title",
  "summary": "string — 3-4 sentence beginner-friendly explanation",
  "keyPoints": ["string", "string", "string"],
  "funFact": "string — one surprising or memorable fact",
  "questions": [
    { "id": 1, "question": "string — open-ended, requires understanding not recall" },
    { "id": 2, "question": "string" },
    { "id": 3, "question": "string" },
    { "id": 4, "question": "string" },
    { "id": 5, "question": "string — harder, tests deeper understanding" }
  ]
}
Difficulty guide:
- Beginner: plain English, no assumed knowledge, practical analogies
- Intermediate: assumes basics, introduces nuance and edge cases
- Advanced: expects solid foundation, tests depth and trade-offs`,
      messages: [{ role: "user", content: `Topic: ${topic}\nDifficulty: ${difficulty}` }],
    });

    const raw = (response.content[0] as { text: string }).text
      .replace(/```json|```/g, "")
      .trim();

    return Response.json(JSON.parse(raw));
  } catch (err) {
    console.error("[/api/lesson]", err);
    return Response.json({ error: "AI service temporarily unavailable." }, { status: 500 });
  }
}
