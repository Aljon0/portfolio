export const DURATION = { fast: 0.6, base: 0.8, slow: 1.1 } as const;

export const EASE = { out: "power3.out", expo: "expo.out" } as const;

export const REVEAL_START = "top 85%";
export const REVEAL_DISTANCE = 28;
export const MOBILE_DISTANCE_FACTOR = 0.6;

/** Siblings in the same visual row get a small stagger. */
export const STAGGER_COLUMNS = 3;
export const STAGGER_STEP = 0.08;

/** Extra scroll distance (in viewport heights) while the About section is pinned. */
export const PIN_SCROLL_RATIO = 1.5;
/** Starting opacity of words in the scroll-brightened biography. */
export const SCRUB_DIM_OPACITY = 0.25;

export const MEDIA_QUERIES = {
  motion: "(prefers-reduced-motion: no-preference)",
  reduce: "(prefers-reduced-motion: reduce)",
  desktop: "(min-width: 1024px)",
  /** Pinning needs room: wide enough, and tall enough for the section to fit. */
  pinned: "(min-width: 1024px) and (min-height: 720px)",
} as const;