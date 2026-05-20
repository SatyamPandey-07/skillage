import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

export const MODEL = "gemini-2.5-flash";

export async function generateText(
  systemPrompt: string,
  userMessage: string
): Promise<string> {
  const model = genAI.getGenerativeModel({
    model: MODEL,
    systemInstruction: systemPrompt,
  });
  const result = await model.generateContent(userMessage);
  return result.response.text();
}
