"use client";

import { useCallback, useEffect, useState } from "react";

const CHARS_PER_SECOND = 220;

export interface Typewriter {
  /** Number of characters revealed so far, across all blocks. */
  typed: number;
  done: boolean;
  skip: () => void;
}

export function useTypewriter(total: number, instant: boolean, delayMs = 0): Typewriter {
  const [count, setCount] = useState(0);
  const [skipped, setSkipped] = useState(false);
  const finished = instant || skipped;

  useEffect(() => {
    if (finished) return;

    const start = performance.now() + delayMs;
    let frame = 0;

    const tick = (now: number) => {
      const elapsed = Math.max(0, now - start);
      const next = Math.min(total, Math.floor((elapsed / 1000) * CHARS_PER_SECOND));
      setCount(next);
      if (next < total) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [finished, total, delayMs]);

  const skip = useCallback(() => setSkipped(true), []);
  const typed = finished ? total : count;

  return { typed, done: typed >= total, skip };
}