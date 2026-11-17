"use client";

import { useEffect, useRef, useState, type ChangeEvent, type KeyboardEvent } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useTypewriter } from "@/hooks/useTypewriter";
import { gsap } from "@/lib/animations/gsap";
import { ChatRequestError, sendChat } from "@/lib/api/chat";
import type { ChatMessage } from "@/types/chat";
import { AnswerText } from "./AnswerText";
import { Caret } from "./Caret";
import { Keypad } from "./Keypad";

const PLACEHOLDER = "what do you want to ask?";
const MAX_INPUT = 300;
const MAX_HISTORY = 8;
const GENERIC_ERROR = "something went wrong. please try again.";
const PROMPT_CLASS =
  "whitespace-pre-wrap break-words font-mono text-2xl leading-snug tracking-tight text-fg sm:text-4xl";

type Phase = "idle" | "loading" | "answer" | "error";

function keyIdFor(key: string): string | null {
  if (key === " ") return "space";
  if (key === "Backspace") return "backspace";
  if (key === "Enter") return "enter";
  return /^[a-z]$/i.test(key) ? key.toLowerCase() : null;
}

function isCoarsePointer(): boolean {
  return window.matchMedia("(pointer: coarse)").matches;
}

interface AssistantOverlayProps {
  onClose: () => void;
}

export function AssistantOverlay({ onClose }: AssistantOverlayProps) {
  const reducedMotion = useReducedMotion();
  useScrollLock();

  const [value, setValue] = useState("");
  const [phase, setPhase] = useState<Phase>("idle");
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [pressed, setPressed] = useState<string | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  const releaseTimer = useRef<number | undefined>(undefined);

  const placeholder = useTypewriter(PLACEHOLDER.length, reducedMotion, 300);

  // Entrance animation.
  useEffect(() => {
    if (reducedMotion) return;
    const backdrop = backdropRef.current;
    const content = contentRef.current;
    if (!backdrop || !content) return;

    const context = gsap.context(() => {
      gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
      gsap.fromTo(
        content,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" },
      );
    });
    return () => context.revert();
  }, [reducedMotion]);

  // Escape closes. Cancel any request and timer on unmount.
  useEffect(() => {
    const onKeyDown = (event: globalThis.KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  useEffect(
    () => () => {
      abortRef.current?.abort();
      window.clearTimeout(releaseTimer.current);
    },
    [],
  );

  // Keep the keyboard focused on the text input (on phones the on-screen keypad is used instead).
  useEffect(() => {
    if (phase !== "loading" && !isCoarsePointer()) inputRef.current?.focus();
  }, [phase]);

  function flash(id: string) {
    setPressed(id);
    window.clearTimeout(releaseTimer.current);
    releaseTimer.current = window.setTimeout(() => setPressed(null), 140);
  }

  function change(next: string) {
    if (phase === "loading") return;
    if (phase !== "idle") {
      setPhase("idle");
      setAnswer("");
      setError("");
    }
    setValue(next.slice(0, MAX_INPUT));
  }

  async function submit() {
    const text = value.trim();
    if (text.length === 0 || phase === "loading") return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setQuestion(text);
    setValue("");
    setAnswer("");
    setError("");
    setPhase("loading");

    const messages: ChatMessage[] = [...history, { role: "user", content: text }];

    try {
      const reply = await sendChat(messages, controller.signal);
      const nextHistory: ChatMessage[] = [...messages, { role: "assistant", content: reply }];
      setHistory(nextHistory.slice(-MAX_HISTORY));
      setAnswer(reply);
      setPhase("answer");
    } catch (caught) {
      if (controller.signal.aborted) return;
      setValue(text);
      setError(caught instanceof ChatRequestError ? caught.message : GENERIC_ERROR);
      setPhase("error");
    }
  }

  function handleInputChange(event: ChangeEvent<HTMLInputElement>) {
    change(event.target.value);
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Tab") {
      // The text input is the only control in this dialog.
      event.preventDefault();
      return;
    }
    const id = keyIdFor(event.key);
    if (id) flash(id);
    if (event.key === "Enter") {
      event.preventDefault();
      void submit();
    }
  }

  function handleKeypad(id: string) {
    flash(id);
    if (id === "enter") {
      void submit();
      return;
    }
    if (id === "backspace") {
      change(value.slice(0, -1));
    } else {
      change(value + (id === "space" ? " " : id));
    }
    if (!isCoarsePointer()) inputRef.current?.focus();
  }

  function renderPrompt() {
    if (phase === "loading") {
      return (
        <div>
          <p className="font-mono text-sm text-muted">&gt; {question}</p>
          <div aria-hidden="true" className="mt-5 flex gap-2">
            {[0, 1, 2].map((dot) => (
              <span
                key={dot}
                className="h-2.5 w-2.5 animate-pulse rounded-full bg-accent-text"
                style={{ animationDelay: `${dot * 180}ms` }}
              />
            ))}
          </div>
        </div>
      );
    }

    if (phase === "answer") {
      return (
        <div>
          <p className="font-mono text-sm text-muted">&gt; {question}</p>
          <div className="mt-4">
            <AnswerText key={history.length} text={answer} instant={reducedMotion} />
          </div>
        </div>
      );
    }

    if (phase === "error") {
      return (
        <div>
          <p className="font-mono text-sm text-muted">&gt; {question}</p>
          <p className="mt-4 font-mono text-lg text-fg sm:text-xl">{error}</p>
          <p className="mt-3 font-mono text-sm text-muted">press enter to try again</p>
        </div>
      );
    }

    return (
      <p className={PROMPT_CLASS}>
        {value.length > 0 ? value : placeholder.typed > 0 ? PLACEHOLDER.slice(0, placeholder.typed) : ""}
        <Caret />
      </p>
    );
  }

  const status =
    phase === "loading" ? "thinking" : phase === "answer" ? "answer received" : phase === "error" ? error : "";

  return (
    <div
      id="assistant-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Ask about this portfolio"
      className="fixed inset-0 z-80"
    >
      <div
        ref={backdropRef}
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-canvas/55 backdrop-blur-xl"
      />

      <div
        ref={contentRef}
        className="pointer-events-none relative flex h-full flex-col items-center justify-between px-5 pb-6 pt-[16svh] sm:pb-10"
      >
        <div
          onClick={() => inputRef.current?.focus()}
          className="pointer-events-auto min-h-0 w-full max-w-3xl flex-1 overflow-y-auto pb-6"
        >
          {renderPrompt()}
        </div>

        <div className="pointer-events-auto shrink-0">
          <Keypad pressed={pressed} disabled={phase === "loading"} onKey={handleKeypad} />
        </div>
      </div>

      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onKeyDown={handleInputKeyDown}
        disabled={phase === "loading"}
        maxLength={MAX_INPUT}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        aria-label="Ask a question about this portfolio"
        className="sr-only"
      />
      <p role="status" className="sr-only">
        {status}
      </p>
    </div>
  );
}