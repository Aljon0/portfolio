export interface AssistantEnv {
  timeoutMs: number;
  geminiApiKey: string | undefined;
  geminiModel: string;
  geminiBaseUrl: string;
  rateLimitMax: number;
  rateLimitWindowMinutes: number;
}

function readInt(value: string | undefined, fallback: number, min: number, max: number): number {
  if (value === undefined || value === "") return fallback;
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed >= min && parsed <= max ? parsed : fallback;
}

let cached: AssistantEnv | undefined;

export function getAssistantEnv(): AssistantEnv {
  cached ??= {
    timeoutMs: readInt(process.env.LLM_TIMEOUT_MS, 20000, 1000, 60000),
    geminiApiKey: process.env.GEMINI_API_KEY?.trim() || undefined,
    geminiModel: process.env.GEMINI_MODEL?.trim() || "gemini-3.5-flash-lite",
    geminiBaseUrl:
      process.env.GEMINI_API_BASE_URL?.trim() ||
      "https://generativelanguage.googleapis.com/v1beta",
    rateLimitMax: readInt(process.env.CHAT_RATE_LIMIT_MAX, 20, 1, 1000),
    rateLimitWindowMinutes: readInt(process.env.CHAT_RATE_LIMIT_WINDOW_MINUTES, 10, 1, 1440),
  };
  return cached;
}