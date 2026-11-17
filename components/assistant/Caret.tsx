"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";

export function Caret({ className }: { className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const element = ref.current;
    if (!element || reducedMotion) return;

    const animation = element.animate(
      [
        { opacity: 1, offset: 0 },
        { opacity: 1, offset: 0.5 },
        { opacity: 0, offset: 0.5 },
        { opacity: 0, offset: 1 },
      ],
      { duration: 1000, iterations: Infinity },
    );
    return () => animation.cancel();
  }, [reducedMotion]);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className={cn("ml-0.5 inline-block h-[1.05em] w-[0.12em] bg-fg align-[-0.14em]", className)}
    />
  );
}