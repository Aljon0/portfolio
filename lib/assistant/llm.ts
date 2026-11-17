import { getAssistantEnv } from "./env";

export interface LlmMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export type LlmErrorKind = "not_configured" | "rate_limited" | "timeout" | "upstream";

export class LlmError extends Error {
  readonly kind: LlmErrorKind;

  constructor(kind: LlmErrorKind, message: string) {
    super(message);
    this.name = "LlmError";
    this.kind = kind;
  }
}

/** Generous, because some Gemini models count internal "thinking" tokens in this limit. */
const MAX_OUTPUT_TOKENS = 1024;
const TEMPERATURE = 0.3;

interface GeminiContent {
  role: "user" | "model";
  parts: { text: string }[];
}

/** Gemini uses "user" and "model" turns; consecutive turns from the same side are merged. */
function toContents(messages: LlmMessage[]): GeminiContent[] {
  const contents: GeminiContent[] = [];

  for (const message of messages) {
    if (message.role === "system") continue;

    const role = message.role === "assistant" ? "model" : "user";
    const last = contents[contents.length - 1];
    if (last && last.role === role) {
      last.parts.push({ text: message.content });
    } else {
      contents.push({ role, parts: [{ text: message.content }] });
    }
  }
  return contents;
}

function extractText(body: unknown): string | null {
  if (typeof body !== "object" || body === null || !("candidates" in body)) return null;
  if (!Array.isArray(body.candidates)) return null;

  const candidates: unknown[] = body.candidates;
  const first = candidates[0];
  if (typeof first !== "object" || first === null || !("content" in first)) return null;

  const content = first.content;
  if (typeof content !== "object" || content === null || !("parts" in content)) return null;
  if (!Array.isArray(content.parts)) return null;

  const parts: unknown[] = content.parts;
  const texts: string[] = [];
  for (const part of parts) {
    if (
      typeof part === "object" &&
      part !== null &&
      "text" in part &&
      typeof part.text === "string" &&
      !("thought" in part && part.thought === true)
    ) {
      texts.push(part.text);
    }
  }
  return texts.length > 0 ? texts.join("") : null;
}

async function completeWithGemini(
  apiKey: string,
  messages: LlmMessage[],
  signal: AbortSignal,
): Promise<string> {
  const env = getAssistantEnv();
  const system = messages
    .filter((message) => message.role === "system")
    .map((message) => message.content)
    .join("\n\n");

  const url = `${env.geminiBaseUrl}/models/${encodeURIComponent(env.geminiModel)}:generateContent`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: toContents(messages),
      generationConfig: { temperature: TEMPERATURE, maxOutputTokens: MAX_OUTPUT_TOKENS },
    }),
    signal,
  });

  if (!response.ok) {
    const detail = (await response.text().catch(() => "")).slice(0, 300);
    console.error(`[gemini] HTTP ${response.status}: ${detail}`);
    if (response.status === 429) throw new LlmError("rate_limited", "Gemini quota reached.");
    throw new LlmError("upstream", `Gemini returned HTTP ${response.status}.`);
  }

  const body: unknown = await response.json().catch(() => null);
  const text = extractText(body);
  if (text === null || text.trim().length === 0) {
    throw new LlmError("upstream", "Gemini returned an empty or blocked response.");
  }
  return text.trim();
}

export async function complete(messages: LlmMessage[]): Promise<string> {
  const env = getAssistantEnv();
  if (env.geminiApiKey === undefined) {
    throw new LlmError("not_configured", "GEMINI_API_KEY is not set.");
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), env.timeoutMs);

  try {
    return await completeWithGemini(env.geminiApiKey, messages, controller.signal);
  } catch (error) {
    if (controller.signal.aborted) {
      throw new LlmError("timeout", "The language model took too long to respond.");
    }
    if (error instanceof LlmError) throw error;
    console.error("[gemini] request failed", error);
    throw new LlmError("upstream", "Could not reach the language model.");
  } finally {
    clearTimeout(timer);
  }
}