"use client";

import { Bot, Terminal, X } from "lucide-react";
import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState } from "react";
import { useGlobalShortcut } from "@/hooks/useGlobalShortcut";
import { cn } from "@/lib/utils/cn";

// Loaded only when a visitor opens them.
const AssistantOverlay = dynamic(() =>
  import("./AssistantOverlay").then((module) => module.AssistantOverlay),
);
const DeveloperConsole = dynamic(() =>
  import("@/components/console/DeveloperConsole").then((module) => module.DeveloperConsole),
);

/** How long the attention ring is shown on a fresh visit. */
const HINT_MS = 9000;

type Panel = "assistant" | "console" | null;

const railButtonClass =
  "relative inline-flex min-h-11 w-11 flex-col items-center justify-center gap-0.5 rounded-2xl text-accent-text transition-[background-color,transform] duration-200 hover:bg-surface-2 active:scale-95 md:w-12 md:py-1.5";

const captionClass = "hidden font-mono text-[0.6rem] leading-none text-muted md:block";

export function AssistantLauncher() {
  const [panel, setPanel] = useState<Panel>(null);
  const [consoleLoaded, setConsoleLoaded] = useState(false);
  const [hint, setHint] = useState(true);
  const assistantButton = useRef<HTMLButtonElement>(null);
  const consoleButton = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setHint(false), HINT_MS);
    return () => window.clearTimeout(timer);
  }, []);

  const openAssistant = useCallback(() => {
    setHint(false);
    setPanel("assistant");
  }, []);

  const openConsole = useCallback(() => {
    setConsoleLoaded(true);
    setPanel("console");
  }, []);

  const closeAssistant = useCallback(() => {
    setPanel(null);
    assistantButton.current?.focus();
  }, []);

  const closeConsole = useCallback(() => {
    setPanel(null);
    consoleButton.current?.focus();
  }, []);

  const toggleConsole = useCallback(() => {
    if (panel === "console") closeConsole();
    else openConsole();
  }, [panel, closeConsole, openConsole]);

  // "/" opens the assistant and the backtick toggles the console (outside text inputs).
  useGlobalShortcut("/", openAssistant);
  useGlobalShortcut("`", toggleConsole);

  const assistantOpen = panel === "assistant";
  const consoleOpen = panel === "console";

  return (
    <>
      <div className="fixed bottom-5 left-4 z-90 md:bottom-auto md:left-3 md:top-1/2 md:-translate-y-1/2">
        <div className="glass flex flex-row items-center gap-1 rounded-[1.75rem] p-1.5 md:flex-col">
          <div className="relative">
            {hint && panel === null ? (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 animate-ping rounded-2xl bg-accent/30 motion-reduce:animate-none"
              />
            ) : null}
            <button
              ref={assistantButton}
              type="button"
              onClick={() => (assistantOpen ? closeAssistant() : openAssistant())}
              aria-expanded={assistantOpen}
              aria-controls="assistant-overlay"
              aria-keyshortcuts="/"
              aria-label={assistantOpen ? "Close the assistant" : "Ask the portfolio assistant"}
              className={railButtonClass}
            >
              {assistantOpen ? (
                <X size={20} aria-hidden="true" />
              ) : (
                <Bot size={20} aria-hidden="true" />
              )}
              <span aria-hidden="true" className={captionClass}>
                ask
              </span>
            </button>
          </div>

          <span aria-hidden="true" className="hidden h-px w-7 bg-line md:block" />

          <button
            ref={consoleButton}
            type="button"
            onClick={toggleConsole}
            aria-expanded={consoleOpen}
            aria-controls="developer-console"
            aria-keyshortcuts="`"
            aria-label={consoleOpen ? "Close the developer console" : "Open the developer console"}
            className={cn(railButtonClass)}
          >
            {consoleOpen ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <Terminal size={20} aria-hidden="true" />
            )}
            <span aria-hidden="true" className={captionClass}>
              console
            </span>
          </button>
        </div>
      </div>

      {assistantOpen ? <AssistantOverlay onClose={closeAssistant} /> : null}
      {consoleLoaded ? <DeveloperConsole open={consoleOpen} onClose={closeConsole} /> : null}
    </>
  );
}