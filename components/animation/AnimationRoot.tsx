"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { setupAnimations } from "@/lib/animations/setup";

export function AnimationRoot({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    return setupAnimations(root);
  }, []);

  return (
    <div ref={rootRef}>
      <div aria-hidden="true" data-bg-glow className="bg-glow" />
      {children}
    </div>
  );
}