"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils/cn";

const iconClass =
  "absolute transition-[rotate,scale,opacity] duration-500 motion-reduce:transition-none";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const dark = theme === "dark";

  return (
    <button
      type="button"
      onClick={(event) => {
        const rect = event.currentTarget.getBoundingClientRect();
        toggleTheme({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
      }}
      aria-label={`Switch to ${dark ? "light" : "dark"} theme`}
      className="relative inline-flex h-10 w-10 items-center justify-center rounded-full text-muted transition-[color,background-color,scale] duration-200 hover:bg-surface-2 hover:text-fg active:scale-95"
    >
      <Sun
        size={18}
        aria-hidden="true"
        className={cn(iconClass, dark ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-50 opacity-0")}
      />
      <Moon
        size={18}
        aria-hidden="true"
        className={cn(iconClass, dark ? "-rotate-90 scale-50 opacity-0" : "rotate-0 scale-100 opacity-100")}
      />
    </button>
  );
}