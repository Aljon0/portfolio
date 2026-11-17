"use client";

import { useEffect } from "react";

/** Locks page scroll while mounted, compensating for the scrollbar so the layout doesn't jump. */
export function useScrollLock(): void {
  useEffect(() => {
    const html = document.documentElement;
    const scrollbar = window.innerWidth - html.clientWidth;
    const previousOverflow = html.style.overflow;
    const previousPadding = document.body.style.paddingRight;

    html.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    return () => {
      html.style.overflow = previousOverflow;
      document.body.style.paddingRight = previousPadding;
    };
  }, []);
}