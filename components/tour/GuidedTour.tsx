"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Caret } from "@/components/assistant/Caret";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useScrollLock } from "@/hooks/useScrollLock";
import { useTypewriter } from "@/hooks/useTypewriter";
import { SEEN_KEY, TOUR_EVENT, resolveSteps, type Placement, type TourStep } from "./steps";

const CURSOR_MS = 800;
const BUBBLE_WIDTH = 288;
const BUBBLE_HEIGHT = 130;
const EDGE = 12;
const RING_PADDING = 6;
const AUTO_START_MS = 3200;

const OFFSETS: Record<Placement, readonly [number, number]> = {
  below: [-14, 30],
  right: [30, -12],
  left: [-(BUBBLE_WIDTH + 30), -12],
  above: [-14, -(BUBBLE_HEIGHT + 30)],
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function pointFor(step: TourStep, rect: DOMRect): { x: number; y: number } {
  if (step.anchor === "start") {
    return { x: rect.left + Math.min(rect.width * 0.2, 80), y: rect.top + rect.height / 2 };
  }
  return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
}

interface StepBubbleProps {
  message: string;
  instant: boolean;
  onNext: () => void;
}

function StepBubble({ message, instant, onNext }: StepBubbleProps) {
  // The bubble waits for the cursor to arrive before typing.
  const { typed, done, skip } = useTypewriter(message.length, instant, instant ? 0 : CURSOR_MS - 50);

  useEffect(() => {
    if (!done || instant) return;
    const timer = window.setTimeout(onNext, Math.max(2000, message.length * 38));
    return () => window.clearTimeout(timer);
  }, [done, instant, message.length, onNext]);

  if (typed === 0) return null;

  return (
    <div
      onClick={skip}
      className="rounded-2xl rounded-tl-md border border-line bg-surface px-4 py-3 shadow-2xl"
    >
      <p className="font-mono text-[0.7rem] text-accent-text">Al-jon</p>
      <p className="mt-1 text-sm leading-relaxed text-fg">
        {message.slice(0, typed)}
        <Caret />
      </p>
    </div>
  );
}

interface ActiveTourProps {
  steps: readonly TourStep[];
  reducedMotion: boolean;
  onStop: () => void;
}

function ActiveTour({ steps, reducedMotion, onStop }: ActiveTourProps) {
  useScrollLock();

  const [index, setIndex] = useState(0);
  const [tick, setTick] = useState(0);
  const [origin] = useState(() => ({ x: window.innerWidth * 0.55, y: window.innerHeight * 0.8 }));

  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const rippleRef = useRef<HTMLDivElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  const step = steps[index];
  const isLast = index >= steps.length - 1;
  const moveMs = reducedMotion ? 0 : CURSOR_MS;

  const next = useCallback(() => {
    if (index >= steps.length - 1) onStop();
    else setIndex(index + 1);
  }, [index, steps.length, onStop]);

  // Keyboard: Escape ends the tour, the right arrow goes on.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onStop();
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        next();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [next, onStop]);

  // Focus the "next" button, and give focus back at the end.
  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    nextRef.current?.focus();
    return () => previous?.focus();
  }, []);

  useEffect(() => {
    const onResize = () => setTick((value) => value + 1);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Move the cursor, ring and bubble to the current target.
  useEffect(() => {
    if (!step) return;

    const target = document.querySelector(step.selector);
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    const ripple = rippleRef.current;
    const bubble = bubbleRef.current;
    if (!cursor || !ring || !ripple || !bubble) return;

    if (!target) {
      // The target disappeared (for example after a resize): move on.
      const skipTimer = window.setTimeout(next, 0);
      return () => window.clearTimeout(skipTimer);
    }

    const rect = target.getBoundingClientRect();
    const point = pointFor(step, rect);

    cursor.style.transform = `translate3d(${point.x}px, ${point.y}px, 0)`;

    if (step.ring === false) {
      ring.style.opacity = "0";
    } else {
      ring.style.opacity = "1";
      ring.style.left = `${rect.left - RING_PADDING}px`;
      ring.style.top = `${rect.top - RING_PADDING}px`;
      ring.style.width = `${rect.width + RING_PADDING * 2}px`;
      ring.style.height = `${rect.height + RING_PADDING * 2}px`;
    }

    const [dx, dy] = OFFSETS[step.placement];
    bubble.style.left = `${clamp(point.x + dx, EDGE, window.innerWidth - BUBBLE_WIDTH - EDGE)}px`;
    bubble.style.top = `${clamp(point.y + dy, EDGE, window.innerHeight - BUBBLE_HEIGHT - EDGE)}px`;

    if (reducedMotion) return;

    // A small "click" ripple when the cursor arrives.
    ripple.style.left = `${point.x}px`;
    ripple.style.top = `${point.y}px`;
    const rippleTimer = window.setTimeout(() => {
      ripple.animate(
        [
          { opacity: 0.8, transform: "translate(-50%, -50%) scale(0.3)" },
          { opacity: 0, transform: "translate(-50%, -50%) scale(1.8)" },
        ],
        { duration: 600, easing: "ease-out" },
      );
    }, CURSOR_MS);

    return () => window.clearTimeout(rippleTimer);
  }, [step, tick, next, reducedMotion]);

  if (!step) return null;

  return (
    <div role="dialog" aria-label="Site tour" className="fixed inset-0 z-100">
      {/* A click anywhere else ends the tour. */}
      <div aria-hidden="true" className="absolute inset-0" onClick={onStop} />

      <div
        ref={ringRef}
        aria-hidden="true"
        className="pointer-events-none absolute rounded-2xl border-2 border-accent-text/70 opacity-0"
        style={{
          transition: `left ${moveMs}ms ease, top ${moveMs}ms ease, width ${moveMs}ms ease, height ${moveMs}ms ease, opacity 300ms ease`,
          boxShadow: "0 0 24px color-mix(in srgb, var(--accent) 35%, transparent)",
        }}
      />

      <div
        ref={rippleRef}
        aria-hidden="true"
        className="pointer-events-none absolute h-10 w-10 rounded-full border-2 border-accent-text opacity-0"
      />

      <div
        ref={cursorRef}
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0"
        style={{
          transform: `translate3d(${origin.x}px, ${origin.y}px, 0)`,
          transition: `transform ${moveMs}ms cubic-bezier(0.22, 1, 0.36, 1)`,
        }}
      >
        <svg
          width="26"
          height="26"
          viewBox="0 0 26 26"
          style={{ marginLeft: -4, marginTop: -3, filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.45))" }}
        >
          <path
            d="M4 3 L4 21 L9 16.5 L12.5 23.5 L16 22 L12.5 15 L19.5 15 Z"
            fill="#ffffff"
            stroke="#101416"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      <div
        ref={bubbleRef}
        aria-hidden="true"
        className="pointer-events-auto absolute w-72 max-w-[calc(100vw-1.5rem)]"
        style={{ left: origin.x, top: origin.y }}
      >
        <StepBubble key={index} message={step.message} instant={reducedMotion} onNext={next} />
      </div>

      <p role="status" className="sr-only">
        {step.message}
      </p>

      <div className="glass pointer-events-auto absolute bottom-24 left-1/2 flex -translate-x-1/2 items-center gap-3 rounded-full px-4 py-2 sm:bottom-6">
        <span className="font-mono text-label text-muted">
          {index + 1} / {steps.length}
        </span>
        <button
          ref={nextRef}
          type="button"
          onClick={next}
          className="min-h-9 rounded-full bg-accent px-4 text-sm text-on-accent transition-colors hover:bg-accent-soft"
        >
          {isLast ? "done" : "next"}
        </button>
        <button
          type="button"
          onClick={onStop}
          className="min-h-9 px-2 font-mono text-label text-muted transition-colors hover:text-fg"
        >
          skip tour
        </button>
      </div>
    </div>
  );
}

export function GuidedTour() {
  const [steps, setSteps] = useState<TourStep[] | null>(null);
  const reducedMotion = useReducedMotion();

  const start = useCallback(() => {
    const resolved = resolveSteps();
    if (resolved.length === 0) return;
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* storage unavailable: the tour still runs */
    }
    setSteps(resolved);
  }, []);

  const stop = useCallback(() => setSteps(null), []);

  // "take the tour" button.
  useEffect(() => {
    window.addEventListener(TOUR_EVENT, start);
    return () => window.removeEventListener(TOUR_EVENT, start);
  }, [start]);

  // First visit: start by itself near the top of the page (never with reduced motion).
  useEffect(() => {
    if (reducedMotion) return;

    let seen = true;
    try {
      seen = localStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = true;
    }
    if (seen || window.location.hash || window.scrollY > 40) return;

    const timer = window.setTimeout(() => {
      if (window.scrollY < 40) start();
    }, AUTO_START_MS);
    return () => window.clearTimeout(timer);
  }, [reducedMotion, start]);

  if (!steps) return null;
  return <ActiveTour steps={steps} reducedMotion={reducedMotion} onStop={stop} />;
}