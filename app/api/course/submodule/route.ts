import { NextRequest } from "next/server";
import { generateText } from "@/src/lib/claude";

const CODE_PATTERN =
  /code|program|function|syntax|implement|algorithm|data.?struct|api|database|web|javascript|python|react|node|css|html|typescript|rust|go|java|c\+\+|swift|kotlin/i;

export async function POST(request: NextRequest) {
  try {
    const { topic, difficulty, moduleTitle, submoduleTitle, submoduleDescription } =
      await request.json();

    const isCode = CODE_PATTERN.test(
      `${topic} ${moduleTitle} ${submoduleTitle}`
    );

    const raw = await generateText(
      `You are an expert educator. Generate detailed course submodule content. Return ONLY valid JSON — no markdown, no backticks.`,
      `Generate full content for this course submodule.

Course topic: ${topic}
Difficulty: ${difficulty}
Module: ${moduleTitle}
Submodule: ${submoduleTitle}
Description: ${submoduleDescription}

Return this exact JSON schema:
{
  "content": "Detailed reading content. Write 4-6 substantive paragraphs separated by \\n\\n. Plain prose — no markdown headers or bullet lists. Thorough and educational.",
  "codeSnippets": ${
    isCode
      ? `[
    {
      "language": "the language name",
      "code": "a complete, runnable code example",
      "explanation": "1-2 sentence explanation of what this code demonstrates"
    }
  ]`
      : "[]"
  },
  "resources": [
    {
      "title": "Resource title",
      "url": "https://real-url.com/path",
      "type": "article"
    }
  ],
  "questions": [
    {
      "id": 1,
      "question": "Question testing conceptual understanding (not trivia)",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0
    },
    { "id": 2, "question": "...", "options": ["...", "...", "...", "..."], "correctIndex": 1 },
    { "id": 3, "question": "...", "options": ["...", "...", "...", "..."], "correctIndex": 2 },
    { "id": 4, "question": "...", "options": ["...", "...", "...", "..."], "correctIndex": 0 }
  ]
}

Requirements:
- content: educational, practical, targeted to ${difficulty} level
- codeSnippets: ${isCode ? "1-2 working examples with correct syntax" : "empty array — topic is not code-related"}
- resources: 2-4 real, authoritative URLs (official docs, MDN, reputable articles)
- questions: exactly 4 MCQ questions, each with exactly 4 options
- correctIndex: integer 0–3 (index into options array)
- vary correctIndex values across the 4 questions`
    );

    const json = raw.replace(/```json|```/g, "").trim();
    return Response.json(JSON.parse(json));
  } catch (err) {
    console.error("[/api/course/submodule]", err);
    return Response.json(
      { error: "Failed to generate submodule content." },
      { status: 500 }
    );
  }
}
