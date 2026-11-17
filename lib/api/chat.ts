
import type { ChatMessage } from "@/types/chat";

/** An error whose message is safe to show to the visitor. */
export class ChatRequestError extends Error {}

function hasString(body: unknown, key: string): body is Record<string, string> {
  return (
    typeof body === "object" &&
    body !== null &&
    key in body &&
    typeof (body as Record<string, unknown>)[key] === "string"
  );
}

export async function sendChat(messages: ChatMessage[], signal: AbortSignal): Promise<string> {
  let response: Response;
  try {
    response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
      signal,
    });
  } catch (error) {
    if (signal.aborted) throw error;
    throw new ChatRequestError("i can't reach the assistant right now. please try again in a moment.");
  }

  const body: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ChatRequestError(
      hasString(body, "message") ? body.message : "something went wrong. please try again.",
    );
  }
  if (!hasString(body, "reply")) {
    throw new ChatRequestError("the assistant sent an unexpected response.");
  }
  return body.reply;
}