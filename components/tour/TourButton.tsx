"use client";

import { Play } from "lucide-react";
import { TOUR_EVENT } from "./steps";

export function TourButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(TOUR_EVENT))}
      className="ml-3 inline-flex min-h-8 items-center gap-1.5 rounded-full border border-line px-3 text-muted transition-colors hover:border-accent hover:text-accent-text"
    >
      <Play size={12} aria-hidden="true" />
      take the tour
    </button>
  );
}