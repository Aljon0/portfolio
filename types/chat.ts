export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  role: ChatRole;
  content: string;
}


export interface ChatResponseBody {
  reply: string;
}

export interface ApiErrorBody {
  error: string;
  message: string;
}