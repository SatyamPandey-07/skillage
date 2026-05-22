import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export const MODEL = "llama-3.1-8b-instant";

export async function generateText(
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const completion = await groq.chat.completions.create({
    model: MODEL,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ],
    temperature: 0.7,
  });
  return completion.choices[0]?.message?.content ?? "";
}
