import { getAssistantEnv } from "@/lib/assistant/env";
import { systemPrompt } from "@/lib/assistant/knowledge";
import { LlmError, complete, type LlmErrorKind, type LlmMessage } from "@/lib/assistant/llm";
import { checkRateLimit } from "@/lib/assistant/rateLimit";
import { validateChatBody } from "@/lib/assistant/validation";
import type { ApiErrorBody, ChatResponseBody } from "@/types/chat";

/** Seconds. Must stay above the model timeout (20s by default). */
export const maxDuration = 30;

const MAX_BODY_CHARS = 10_000;

const ERRORS: Record<LlmErrorKind, { status: number; body: ApiErrorBody }> = {
  not_configured: {
    status: 503,
    body: { error: "assistant_unavailable", message: "the assistant isn't set up yet." },
  },
  rate_limited: {
    status: 503,
    body: {
      error: "assistant_busy",
      message: "the assistant is busy right now. please try again shortly.",
    },
  },
  timeout: {
    status: 504,
    body: { error: "assistant_timeout", message: "the assistant took too long to answer." },
  },
  upstream: {
    status: 502,
    body: { error: "assistant_error", message: "the assistant ran into a problem. please try again." },
  },
};

function respond(body: ChatResponseBody | ApiErrorBody, status = 200): Response {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

/** Browsers always send Origin on POST, so a different site's page is rejected. */
function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(request: Request): Promise<Response> {
  if (!isSameOrigin(request)) {
    return respond({ error: "forbidden", message: "requests must come from this site." }, 403);
  }

  const env = getAssistantEnv();

  if (!checkRateLimit(clientIp(request), env.rateLimitMax, env.rateLimitWindowMinutes * 60_000)) {
    return respond(
      {
        error: "rate_limited",
        message: "that's a lot of questions. please wait a few minutes and try again.",
      },
      429,
    );
  }

  const raw = await request.text();
  if (raw.length > MAX_BODY_CHARS) {
    return respond({ error: "payload_too_large", message: "that request is too large." }, 413);
  }

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return respond({ error: "invalid_request", message: "request body must be valid JSON." }, 400);
  }

  const result = validateChatBody(body);
  if (!result.ok) return respond({ error: "invalid_request", message: result.message }, 400);

  try {
    const messages: LlmMessage[] = [{ role: "system", content: systemPrompt }, ...result.messages];
    const reply = await complete(messages);
    return respond({ reply });
  } catch (error) {
    if (error instanceof LlmError) {
      console.error(`[chat] ${error.kind}: ${error.message}`);
      const mapped = ERRORS[error.kind];
      return respond(mapped.body, mapped.status);
    }
    console.error("[chat] unexpected error", error);
    return respond(ERRORS.upstream.body, 500);
  }
}