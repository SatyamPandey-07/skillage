import { NextRequest } from "next/server";
import { generateText } from "@/src/lib/claude";

export async function POST(request: NextRequest) {
  try {
    const { topic, difficulty, lessonSummary, questions, answers } = await request.json();

    if (!questions?.length || !answers?.length) {
      return Response.json({ error: "Questions and answers are required" }, { status: 400 });
    }

    const qaBlock = questions
      .map(
        (q: { id: number; question: string }, i: number) =>
          `Q${q.id}: ${q.question}\nA${q.id}: ${answers[i]?.answer || "(no answer)"}`
      )
      .join("\n\n");

    const raw = await generateText(
      `You are a strict but fair quiz grader for a learning platform.
Return ONLY valid JSON. No markdown, no preamble.
Schema:
{
  "scores": [
    {
      "questionId": number,
      "score": number (0-20),
      "feedback": "string — 1 sentence: what was right or what was missed"
    }
  ],
  "totalScore": number (0-100),
  "passed": boolean (true if totalScore >= 80),
  "overallFeedback": "string — 1-2 sentences of encouragement or key improvement tip",
  "strongestAnswer": number (questionId of best answer),
  "weakestAnswer": number (questionId of worst answer)
}
Scoring rubric per question (max 20 pts):
- 20: Complete, accurate, shows genuine understanding
- 15: Mostly correct, minor gaps
- 10: Partially correct, core idea present
- 5: Vague or tangential but not entirely wrong
- 0: Wrong, off-topic, or blank
Award partial credit generously for partially correct answers.`,
      `Topic: ${topic}\nDifficulty: ${difficulty}\nLesson: ${lessonSummary}\n\n${qaBlock}`
    );

    const json = raw.replace(/```json|```/g, "").trim();
    return Response.json(JSON.parse(json));
  } catch (err) {
    console.error("[/api/grade]", err);
    return Response.json({ error: "AI service temporarily unavailable." }, { status: 500 });
  }
}
