"use client";

import { Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { ClientAvatar } from "@/components/ui/ClientAvatar";
import { testimonials } from "@/data/portfolio";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/utils/cn";
import type { Testimonial } from "@/types/content";

/** Repeats of the list, so the loop has no gap on wide screens (half the track scrolls). */
const COPIES = 4;
const LOOP_SECONDS = 90;
const FADE_MASK =
  "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)";

function TestimonialCard({ item }: { item: Testimonial }) {
  return (
    <figure className="flex w-84 shrink-0 flex-col justify-between rounded-3xl border border-line bg-surface/60 p-6 sm:w-104">
      <blockquote className="text-muted">“{item.quote}”</blockquote>
      <figcaption className="mt-6 flex items-center gap-3">
        <ClientAvatar name={item.author} photo={item.photo} />
        <span className="text-sm">
          <span className="block text-fg">{item.author}</span>
          <span className="text-muted">{item.affiliation}</span>
        </span>
      </figcaption>
    </figure>
  );
}

export function TestimonialsMarquee() {
  const reducedMotion = useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<Animation | null>(null);
  const hoveringRef = useRef(false);
  const userPausedRef = useRef(false);
  const [userPaused, setUserPaused] = useState(false);

  function sync() {
    const animation = animationRef.current;
    if (!animation) return;
    if (hoveringRef.current || userPausedRef.current) animation.pause();
    else animation.play();
  }

  useEffect(() => {
    const track = trackRef.current;
    if (!track || reducedMotion) return;

    const animation = track.animate(
      [{ transform: "translateX(0)" }, { transform: "translateX(-50%)" }],
      { duration: LOOP_SECONDS * 1000, iterations: Infinity, easing: "linear" },
    );
    animationRef.current = animation;
    if (userPausedRef.current) animation.pause();

    return () => {
      animation.cancel();
      animationRef.current = null;
    };
  }, [reducedMotion]);

  function togglePause() {
    userPausedRef.current = !userPausedRef.current;
    setUserPaused(userPausedRef.current);
    sync();
  }

  function setHovering(value: boolean) {
    hoveringRef.current = value;
    sync();
  }

  const copies = reducedMotion ? 1 : COPIES;

  return (
    <div>
      {reducedMotion ? null : (
        <div className="mb-3 flex justify-end">
          <button
            type="button"
            onClick={togglePause}
            aria-pressed={userPaused}
            aria-label={userPaused ? "Resume feedback scrolling" : "Pause feedback scrolling"}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-line px-4 font-mono text-label text-muted transition-colors hover:border-accent hover:text-accent-text"
          >
            {userPaused ? (
              <Play size={14} aria-hidden="true" />
            ) : (
              <Pause size={14} aria-hidden="true" />
            )}
            {userPaused ? "play" : "pause"}
          </button>
        </div>
      )}

      <div
        role="region"
        aria-label="Feedback from people I've worked with"
        tabIndex={reducedMotion ? 0 : undefined}
        onMouseEnter={() => setHovering(true)}
        onMouseLeave={() => setHovering(false)}
        onFocus={() => setHovering(true)}
        onBlur={() => setHovering(false)}
        className={cn(reducedMotion ? "overflow-x-auto" : "overflow-hidden")}
        style={
          reducedMotion ? undefined : { maskImage: FADE_MASK, WebkitMaskImage: FADE_MASK }
        }
      >
        <div ref={trackRef} className="flex w-max">
          {Array.from({ length: copies }, (_, copy) => (
            <ul
              key={copy}
              aria-hidden={copy > 0 ? true : undefined}
              className="flex shrink-0 gap-6 pr-6"
            >
              {testimonials.map((item) => (
                <li key={item.id} className="flex">
                  <TestimonialCard item={item} />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}