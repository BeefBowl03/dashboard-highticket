import OpenAI from "openai";
import { HUMANIZER_SYSTEM_PROMPT, buildUserPrompt, type LLMStyle } from "@/lib/prompt";
import { cleanOutput } from "@/lib/postprocess";
import { scoreCandidate } from "@/lib/score";

function getClient(): OpenAI {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    // Defer throwing until runtime when actually called; avoids build-time failure
    throw new Error("OPENAI_API_KEY is not set");
  }
  return new OpenAI({ apiKey });
}

function sanitizePunctuation(output: string): string {
  return output
    // disallow em/en dashes and semicolons
    .replace(/[—–]/g, ",")
    .replace(/;/g, ",")
    // rare/limited colons: collapse sequences and remove trailing colon before line end
    .replace(/:+/g, ":")
    .replace(/:\s*\n/g, "\n")
    // normalize spaces
    .replace(/\s+/g, " ")
    .replace(/\s+([,.!?…:])/g, "$1")
    .trim();
}

const MODEL = "gpt-4o"; // fixed default model; only the API key comes from env

export async function humanizeWithOpenAI(input: string, style: LLMStyle): Promise<string> {
  const client = getClient();
  const messages = [
    { role: "system", content: HUMANIZER_SYSTEM_PROMPT },
    { role: "user", content: buildUserPrompt(input, style) },
  ] as const;

  const response = await client.chat.completions.create({
    model: MODEL,
    temperature: Math.min(1.2, Math.max(0.2, style.creativity + 0.25)),
    top_p: 0.9,
    presence_penalty: 0.4,
    frequency_penalty: 0.3,
    messages: messages as unknown as OpenAI.Chat.Completions.ChatCompletionCreateParams["messages"],
  });

  const raw = response.choices[0]?.message?.content ?? "";
  return sanitizePunctuation(raw);
}

export async function humanizeWithOpenAIDeep(input: string, style: LLMStyle): Promise<string> {
  const client = getClient();
  const samples = 4;
  const candidates: string[] = [];
  for (let i = 0; i < samples; i++) {
    const messages = [
      { role: "system", content: HUMANIZER_SYSTEM_PROMPT },
      { role: "user", content: buildUserPrompt(input, { ...style, creativity: Math.min(1, style.creativity + i * 0.05) }) },
    ] as const;
    const response = await client.chat.completions.create({
      model: MODEL,
      temperature: Math.min(1.2, Math.max(0.2, style.creativity + 0.3 + i * 0.05)),
      top_p: 0.95,
      presence_penalty: 0.6,
      frequency_penalty: 0.4,
      messages: messages as unknown as OpenAI.Chat.Completions.ChatCompletionCreateParams["messages"],
    });
    const raw = response.choices[0]?.message?.content ?? "";
    candidates.push(cleanOutput(raw));
  }
  // Pick the candidate with the lowest heuristic score
  const ranked = candidates
    .map((c) => ({ c, s: scoreCandidate(c, input) }))
    .sort((a, b) => a.s.score - b.s.score);
  return ranked[0]?.c ?? candidates[0] ?? "";
}
