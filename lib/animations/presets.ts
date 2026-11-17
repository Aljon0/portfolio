import { DURATION, EASE, REVEAL_DISTANCE, REVEAL_START } from "./config";
import { gsap } from "./gsap";

export type RevealVariant = "fade-up" | "fade-left" | "scale-in";

interface VariantVars {
  from: gsap.TweenVars;
  to: gsap.TweenVars;
}

const VARIANTS: Record<RevealVariant, (factor: number) => VariantVars> = {
  "fade-up": (f) => ({
    from: { opacity: 0, y: REVEAL_DISTANCE * f },
    to: { opacity: 1, y: 0 },
  }),
  "fade-left": (f) => ({
    from: { opacity: 0, x: -REVEAL_DISTANCE * f },
    to: { opacity: 1, x: 0 },
  }),
  "scale-in": (f) => ({
    from: { opacity: 0, scale: 0.96, y: (REVEAL_DISTANCE / 2) * f },
    to: { opacity: 1, scale: 1, y: 0 },
  }),
};

export function isRevealVariant(value: string | undefined): value is RevealVariant {
  return value === "fade-up" || value === "fade-left" || value === "scale-in";
}

interface RevealOptions {
  /** Scales movement distance (smaller on mobile). */
  factor: number;
  delay?: number;
}

/** Reveals one element once, when it scrolls into view. */
export function revealElement(
  el: Element,
  variant: RevealVariant,
  { factor, delay = 0 }: RevealOptions,
): void {
  const { from, to } = VARIANTS[variant](factor);
  gsap.fromTo(el, from, {
    ...to,
    delay,
    duration: DURATION.base,
    ease: EASE.out,
    clearProps: "transform",
    scrollTrigger: { trigger: el, start: REVEAL_START, once: true },
  });
}

/** Reveals the `[data-word]` spans inside a container (see SplitWords). */
export function revealWords(container: Element): void {
  const words = container.querySelectorAll("[data-word]");
  if (words.length === 0) return;

  gsap.fromTo(
    words,
    { yPercent: 105 },
    {
      yPercent: 0,
      duration: DURATION.slow,
      ease: EASE.expo,
      stagger: 0.06,
      scrollTrigger: { trigger: container, start: REVEAL_START, once: true },
    },
  );
}