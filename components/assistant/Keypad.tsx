"use client";

import { cn } from "@/lib/utils/cn";

const LETTER_ROWS = ["qwertyuiop", "asdfghjkl", "zxcvbnm"] as const;

interface KeyCapProps {
  id: string;
  label: string;
  widthClass: string;
  pressed: boolean;
  disabled: boolean;
  onPress: (id: string) => void;
}

function KeyCap({ id, label, widthClass, pressed, disabled, onPress }: KeyCapProps) {
  return (
    <button
      type="button"
      tabIndex={-1}
      disabled={disabled}
      onPointerDown={(event) => {
        // Keep focus in the text input.
        event.preventDefault();
        onPress(id);
      }}
      className={cn(
        "h-[min(8.4vw,2.75rem)] touch-manipulation rounded-lg border font-mono text-xs transition-[translate,background-color,border-color,box-shadow,color] duration-100 disabled:opacity-60 sm:text-sm",
        widthClass,
        pressed
          ? "-translate-y-0.5 border-accent-text bg-accent/15 text-fg shadow-[0_0_18px_-4px_var(--accent)]"
          : "border-line bg-surface/50 text-muted",
      )}
    >
      {label}
    </button>
  );
}

interface KeypadProps {
  /** Id of the key to show as pressed: a letter, "space", "backspace" or "enter". */
  pressed: string | null;
  disabled: boolean;
  onKey: (id: string) => void;
}

export function Keypad({ pressed, disabled, onKey }: KeypadProps) {
  const rowClass = "flex gap-1.5 sm:gap-2";

  return (
    <div aria-hidden="true" className="flex flex-col items-center gap-1.5 sm:gap-2">
      {LETTER_ROWS.map((row) => (
        <div key={row} className={rowClass}>
          {[...row].map((letter) => (
            <KeyCap
              key={letter}
              id={letter}
              label={letter}
              widthClass="w-[min(8.4vw,2.75rem)]"
              pressed={pressed === letter}
              disabled={disabled}
              onPress={onKey}
            />
          ))}
        </div>
      ))}
      <div className={rowClass}>
        <KeyCap
          id="backspace"
          label="⌫"
          widthClass="w-[min(14vw,4.5rem)]"
          pressed={pressed === "backspace"}
          disabled={disabled}
          onPress={onKey}
        />
        <KeyCap
          id="space"
          label="space"
          widthClass="w-[min(38vw,14rem)]"
          pressed={pressed === "space"}
          disabled={disabled}
          onPress={onKey}
        />
        <KeyCap
          id="enter"
          label="↵"
          widthClass="w-[min(14vw,4.5rem)]"
          pressed={pressed === "enter"}
          disabled={disabled}
          onPress={onKey}
        />
      </div>
    </div>
  );
}