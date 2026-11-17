"use client";

import { X } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
  type ReactNode,
} from "react";
import {
  COMMAND_LIST,
  UnknownCommand,
  WELCOME,
  autocomplete,
  outputFor,
  parseCommand,
} from "./commands";

interface Entry {
  id: number;
  command: string | null;
  output: ReactNode;
}

const MAX_ENTRIES = 100;
const MAX_HISTORY = 50;
const MAX_INPUT = 60;

function isCoarsePointer(): boolean {
  return window.matchMedia("(pointer: coarse)").matches;
}

interface DeveloperConsoleProps {
  open: boolean;
  onClose: () => void;
}

export function DeveloperConsole({ open, onClose }: DeveloperConsoleProps) {
  const [value, setValue] = useState("");
  const [entries, setEntries] = useState<Entry[]>([{ id: 0, command: null, output: WELCOME }]);

  const inputRef = useRef<HTMLInputElement>(null);
  const logRef = useRef<HTMLDivElement>(null);
  const nextId = useRef(1);
  const history = useRef<string[]>([]);
  const cursor = useRef(0);

  useEffect(() => {
    if (open && !isCoarsePointer()) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const log = logRef.current;
    if (log) log.scrollTop = log.scrollHeight;
  }, [entries, open]);

  function run(raw: string) {
    const parsed = parseCommand(raw);
    if (parsed.kind === "empty") return;

    const command = raw.trim();
    if (history.current[history.current.length - 1] !== command) {
      history.current.push(command);
      if (history.current.length > MAX_HISTORY) history.current.shift();
    }
    cursor.current = history.current.length;

    if (parsed.kind === "clear") {
      setEntries([]);
      return;
    }

    const output =
      parsed.kind === "command" ? outputFor(parsed.name) : <UnknownCommand text={parsed.text} />;
    const entry: Entry = { id: nextId.current, command, output };
    nextId.current += 1;
    setEntries((previous) => [...previous, entry].slice(-MAX_ENTRIES));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    run(value);
    setValue("");
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }

    if (event.ctrlKey && event.key.toLowerCase() === "l") {
      event.preventDefault();
      setEntries([]);
      return;
    }

    if (event.key === "ArrowUp" && history.current.length > 0) {
      event.preventDefault();
      cursor.current = Math.max(0, cursor.current - 1);
      setValue(history.current[cursor.current] ?? "");
      return;
    }

    if (event.key === "ArrowDown" && history.current.length > 0) {
      event.preventDefault();
      cursor.current = Math.min(history.current.length, cursor.current + 1);
      setValue(history.current[cursor.current] ?? "");
      return;
    }

    if (event.key === "Tab") {
      event.preventDefault();
      const completed = autocomplete(value);
      if (completed) setValue(completed);
    }
  }

  function runChip(name: string) {
    run(name);
    setValue("");
    if (!isCoarsePointer()) inputRef.current?.focus();
  }

  if (!open) return null;

  return (
    <div
      id="developer-console"
      role="dialog"
      aria-label="Developer console"
      className="glass fixed inset-x-0 bottom-0 z-95 mx-auto flex max-h-[70svh] w-full flex-col overflow-hidden rounded-t-2xl sm:bottom-4 sm:max-w-2xl sm:rounded-2xl"
    >
      <div className="flex items-center justify-between border-b border-line px-4 py-2">
        <div className="flex items-center gap-3">
          <span aria-hidden="true" className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-line-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-accent" />
          </span>
          <p className="font-mono text-label text-muted">portfolio-console</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close developer console"
          className="inline-flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-fg"
        >
          <X size={16} aria-hidden="true" />
        </button>
      </div>

      <div
        ref={logRef}
        role="log"
        aria-live="polite"
        className="min-h-24 flex-1 overflow-y-auto px-4 py-3 font-mono text-sm leading-relaxed"
      >
        {entries.map((entry) => (
          <div key={entry.id} className="mb-3">
            {entry.command !== null ? (
              <p className="text-fg">
                <span className="text-accent-text">&gt; </span>
                {entry.command}
              </p>
            ) : null}
            <div className="mt-1 text-muted">{entry.output}</div>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-1.5 border-t border-line px-4 py-2">
        {COMMAND_LIST.map((command) => (
          <button
            key={command.name}
            type="button"
            onClick={() => runChip(command.name)}
            className="min-h-8 rounded-full border border-line px-3 font-mono text-xs text-muted transition-colors hover:border-accent hover:text-accent-text"
          >
            {command.name}
          </button>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 border-t border-line px-4 py-3"
      >
        <span aria-hidden="true" className="font-mono text-sm text-accent-text">
          &gt;
        </span>
        <label htmlFor="console-input" className="sr-only">
          Console command
        </label>
        <input
          id="console-input"
          ref={inputRef}
          type="text"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          maxLength={MAX_INPUT}
          autoComplete="off"
          autoCapitalize="off"
          autoCorrect="off"
          spellCheck={false}
          placeholder="type help"
          className="min-w-0 flex-1 bg-transparent font-mono text-base text-fg outline-none placeholder:text-muted/60 sm:text-sm"
        />
      </form>
    </div>
  );
}