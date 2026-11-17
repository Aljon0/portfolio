export type Theme = "dark" | "light";

export const THEME_STORAGE_KEY = "portfolio-theme";
export const THEME_EVENT = "portfolio-themechange";

/** Where the color change starts from (viewport pixels), usually the toggle button. */
export interface ThemeOrigin {
  x: number;
  y: number;
}

export function isTheme(value: unknown): value is Theme {
  return value === "dark" || value === "light";
}

/**
 * Runs before first paint (inline in <head>) so there is no theme flash.
 * Falls back to dark, the primary appearance, when nothing is stored.
 */
export const themeInitScript = `(function(){try{var k=${JSON.stringify(
  THEME_STORAGE_KEY,
)};var t=localStorage.getItem(k);if(t!=="light"&&t!=="dark"){t="dark"}document.documentElement.dataset.theme=t}catch(e){document.documentElement.dataset.theme="dark"}})();`;

const REVEAL_MS = 650;
const REVEAL_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

interface ViewTransitionLike {
  ready: Promise<unknown>;
  finished: Promise<unknown>;
}
type StartViewTransition = (update: () => void) => ViewTransitionLike;

function getStartViewTransition(): StartViewTransition | null {
  const candidate: unknown = (document as unknown as Record<string, unknown>).startViewTransition;
  return typeof candidate === "function" ? (candidate as StartViewTransition) : null;
}

export function applyTheme(theme: Theme, origin?: ThemeOrigin): void {
  const root = document.documentElement;

  const commit = () => {
    root.dataset.theme = theme;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      /* storage unavailable: theme still applies for this session */
    }
    window.dispatchEvent(new Event(THEME_EVENT));
  };

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    commit();
    return;
  }

  const start = getStartViewTransition();
  if (!start) {
    // Fallback: a short color fade (styles live in globals.css).
    root.classList.add("theme-transition");
    commit();
    window.setTimeout(() => root.classList.remove("theme-transition"), 350);
    return;
  }

  const x = origin?.x ?? window.innerWidth / 2;
  const y = origin?.y ?? window.innerHeight / 2;
  const radius = Math.hypot(
    Math.max(x, window.innerWidth - x),
    Math.max(y, window.innerHeight - y),
  );

  // Replace the default cross-fade: the old page stays still, the new one is revealed on top.
  const style = document.createElement("style");
  style.textContent =
    "::view-transition-old(root),::view-transition-new(root){animation:none;mix-blend-mode:normal;}";
  document.head.append(style);

  const transition = start.call(document, commit);

  void transition.ready
    .then(() => {
      root.animate(
        {
          clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)`],
        },
        {
          duration: REVEAL_MS,
          easing: REVEAL_EASING,
          pseudoElement: "::view-transition-new(root)",
        },
      );
    })
    .catch(() => undefined);

  void transition.finished.catch(() => undefined).then(() => style.remove());
}