"use client";

import { Bot, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGlobalShortcut } from "@/hooks/useGlobalShortcut";
import dynamic from "next/dynamic";

// Loaded only when a visitor opens the assistant.
const AssistantOverlay = dynamic(() =>
  import("./AssistantOverlay").then((module) => module.AssistantOverlay),
);

/** How long the attention ring is shown on a fresh visit. */
const HINT_MS = 9000;

export function AssistantLauncher() {
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState(true);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setHint(false), HINT_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  const openAssistant = useCallback(() => {
    setHint(false);
    setOpen(true);
  }, []);

  // Press "/" anywhere (outside inputs) to open the assistant.
  useGlobalShortcut("/", openAssistant);

  return (
    <>
      <div className="fixed bottom-5 left-4 z-90 md:bottom-auto md:left-3 md:top-1/2 md:-translate-y-1/2">
        <div className="glass relative flex flex-col items-center gap-2 rounded-full p-1.5">
          <div className="relative">
            {hint && !open ? (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 animate-ping rounded-full bg-accent/30 motion-reduce:animate-none"
              />
            ) : null}
            <button
              ref={buttonRef}
              type="button"
              onClick={() => {
                setHint(false);
                setOpen((value) => !value);
              }}
              aria-expanded={open}
              aria-controls="assistant-overlay"
              aria-keyshortcuts="/"
              aria-label={open ? "Close the assistant" : "Ask the portfolio assistant"}
              className="relative inline-flex h-11 w-11 items-center justify-center rounded-full text-accent-text transition-[background-color,transform] duration-200 hover:bg-surface-2 active:scale-95"
            >
              {open ? <X size={20} aria-hidden="true" /> : <Bot size={20} aria-hidden="true" />}
            </button>
          </div>
          <span
            aria-hidden="true"
            className="hidden pb-2 font-mono text-label text-muted [writing-mode:vertical-rl] md:block"
          >
            ask
          </span>
        </div>
      </div>

      {open ? <AssistantOverlay onClose={close} /> : null}
    </>
  );
}