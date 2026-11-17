import type { ChatMessage } from "@/types/chat";

const MAX_MESSAGES = 12;
const MAX_USER_CHARS = 500;
const MAX_ASSISTANT_CHARS = 2000;

export type ChatValidation = { ok: true; messages: ChatMessage[] } | { ok: false; message: string };

function fail(message: string): ChatValidation {
  return { ok: false, message };
}

export function validateChatBody(body: unknown): ChatValidation {
  if (typeof body !== "object" || body === null || !("messages" in body)) {
    return fail("Request body must include a messages array.");
  }
  if (!Array.isArray(body.messages) || body.messages.length === 0) {
    return fail("messages must be a non-empty array.");
  }

  const items: unknown[] = body.messages;
  if (items.length > MAX_MESSAGES) {
    return fail(`messages can contain at most ${MAX_MESSAGES} entries.`);
  }

  const parsed: ChatMessage[] = [];
  for (const item of items) {
    if (typeof item !== "object" || item === null) return fail("Each message must be an object.");

    const role: unknown = "role" in item ? item.role : undefined;
    const content: unknown = "content" in item ? item.content : undefined;
    if ((role !== "user" && role !== "assistant") || typeof content !== "string") {
      return fail("Each message needs a role (user or assistant) and a text content.");
    }

    const text = content.trim();
    if (text.length === 0) return fail("Messages cannot be empty.");

    const limit = role === "user" ? MAX_USER_CHARS : MAX_ASSISTANT_CHARS;
    if (text.length > limit) return fail(`A ${role} message is too long (max ${limit} characters).`);

    parsed.push({ role, content: text });
  }

  const last = parsed[parsed.length - 1];
  if (!last || last.role !== "user") return fail("The last message must come from the user.");

  return { ok: true, messages: parsed };
}