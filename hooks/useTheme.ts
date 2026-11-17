"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
  THEME_EVENT,
  applyTheme,
  isTheme,
  type Theme,
  type ThemeOrigin,
} from "@/lib/theme";

function subscribe(onChange: () => void): () => void {
  window.addEventListener(THEME_EVENT, onChange);
  return () => window.removeEventListener(THEME_EVENT, onChange);
}

function getSnapshot(): Theme {
  const value = document.documentElement.dataset.theme;
  return isTheme(value) ? value : "dark";
}

function getServerSnapshot(): Theme {
  return "dark";
}

export function useTheme(): { theme: Theme; toggleTheme: (origin?: ThemeOrigin) => void } {
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const toggleTheme = useCallback((origin?: ThemeOrigin) => {
    applyTheme(getSnapshot() === "dark" ? "light" : "dark", origin);
  }, []);

  return { theme, toggleTheme };
}