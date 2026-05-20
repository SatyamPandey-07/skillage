import { NextRequest } from "next/server";
import { generateText } from "@/src/lib/claude";

export async function POST(request: NextRequest) {
  try {
    const { topic, difficulty = "Beginner" } = await request.json();

    if (!topic?.trim()) {
      return Response.json({ error: "Topic is required" }, { status: 400 });
    }

    const raw = await generateText(
      `You are a curriculum designer. Create structured course outlines. Return ONLY valid JSON — no markdown, no backticks, no preamble.`,
      `Create a complete course outline for: "${topic}" at ${difficulty} level.

Schema (return exactly this):
{
  "title": "Course title",
  "description": "2-3 sentence overview of what learners will achieve",
  "modules": [
    {
      "id": "m1",
      "title": "Module title",
      "description": "1-2 sentence description",
      "submodules": [
        {
          "id": "m1-s1",
          "title": "Submodule title",
          "description": "One sentence on what this submodule covers"
        }
      ]
    }
  ]
}

Rules:
- 3-5 modules total
- 3-4 submodules per module
- Logical progression: foundations → application → advanced
- IDs: modules are m1, m2, m3... submodules are m1-s1, m1-s2, m2-s1 etc.
- All IDs must be unique strings`
    );

    const json = raw.replace(/```json|```/g, "").trim();
    const data = JSON.parse(json);
    return Response.json({ ...data, topic, difficulty });
  } catch (err) {
    console.error("[/api/course]", err);
    return Response.json({ error: "Failed to generate course." }, { status: 500 });
  }
}
