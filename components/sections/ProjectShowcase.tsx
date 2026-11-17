"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useCallback,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { ProjectCard } from "@/components/projects/ProjectCard";
import dynamic from "next/dynamic";
import { projects } from "@/data/projects";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils/cn";

const ProjectModal = dynamic(() =>
  import("@/components/projects/ProjectModal").then((module) => module.ProjectModal),
);

const LAST = projects.length - 1;

/** Distance between neighbouring cards, as a percentage of a card's width. */
const CARD_SPACING_PERCENT = 62;
const DEPTH_PX = 150;
const TILT_DEGREES = 36;
const FAN_DELAY_MS = 45;

/** Pointer movement (px) before a press counts as a drag, to change cards, and per card. */
const DRAG_START_PX = 6;
const SWIPE_THRESHOLD_PX = 50;
const DRAG_PX_PER_CARD = 280;

const REFLECTION = "below 6px linear-gradient(transparent 62%, rgba(255, 255, 255, 0.16))";

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));

/** offset = card index minus the (possibly fractional) front position. */
function poseStyle(offset: number, entered: boolean, instant: boolean): CSSProperties {
  const distance = Math.abs(offset);
  const shown = entered && distance < 2.6;
  const tilt = -clamp(offset, -1.5, 1.5) * TILT_DEGREES;
  const scale = 1 - Math.min(distance, 2) * 0.09;
  const delay = Math.round(distance * FAN_DELAY_MS);

  return {
    transform: entered
      ? `translate3d(${-50 + offset * CARD_SPACING_PERCENT}%, 0, ${-distance * DEPTH_PX}px) rotateY(${tilt}deg) scale(${scale})`
      : "translate3d(-50%, 48px, -240px) scale(0.9)",
    opacity: shown ? Math.max(0, 1 - distance * 0.32) : 0,
    zIndex: 100 - Math.round(distance * 10),
    pointerEvents: shown ? "auto" : "none",
    transition: instant
      ? "none"
      : `transform 700ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, opacity 500ms ease ${delay}ms`,
  };
}

const stepButtonClass =
  "inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-muted transition-colors hover:border-accent hover:text-accent-text disabled:pointer-events-none disabled:opacity-40";

export function ProjectShowcase() {
  const [index, setIndex] = useState(0);
  const [dragPx, setDragPx] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const stageRef = useRef<HTMLDivElement>(null);
  const movedRef = useRef(false);

  const entered = useInView(stageRef, "0px 0px -15% 0px");
  const reducedMotion = useReducedMotion();
  const { theme } = useTheme();

  const goTo = useCallback((next: number) => setIndex(clamp(next, 0, LAST)), []);
  const closeModal = useCallback(() => setOpenId(null), []);

  const openProject = projects.find((project) => project.id === openId);
  const shift = clamp(dragPx / DRAG_PX_PER_CARD, -1, 1);
  const instant = reducedMotion || dragging;
  const reflect: CSSProperties =
    theme === "dark" && !reducedMotion ? { WebkitBoxReflect: REFLECTION } : {};

  function handlePointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    const startX = event.clientX;
    const pointerId = event.pointerId;
    movedRef.current = false;

    const finish = (upEvent: PointerEvent, cancelled: boolean) => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
      window.removeEventListener("pointercancel", handleCancel);

      if (!movedRef.current) return;

      const dx = upEvent.clientX - startX;
      if (!cancelled) {
        if (dx <= -SWIPE_THRESHOLD_PX) setIndex((current) => clamp(current + 1, 0, LAST));
        else if (dx >= SWIPE_THRESHOLD_PX) setIndex((current) => clamp(current - 1, 0, LAST));
      }
      setDragging(false);
      setDragPx(0);
      // Keep suppressing the click that follows a drag, then allow clicks again.
      window.setTimeout(() => {
        movedRef.current = false;
      }, 60);
    };

    const handleMove = (moveEvent: PointerEvent) => {
      if (moveEvent.pointerId !== pointerId) return;
      const dx = moveEvent.clientX - startX;
      if (!movedRef.current && Math.abs(dx) < DRAG_START_PX) return;
      movedRef.current = true;
      setDragging(true);
      setDragPx(dx);
    };
    const handleUp = (upEvent: PointerEvent) => {
      if (upEvent.pointerId === pointerId) finish(upEvent, false);
    };
    const handleCancel = (cancelEvent: PointerEvent) => {
      if (cancelEvent.pointerId === pointerId) finish(cancelEvent, true);
    };

    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    window.addEventListener("pointercancel", handleCancel);
  }

  function handleKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowRight") {
      event.preventDefault();
      goTo(index + 1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      goTo(index - 1);
    }
  }

  const current = projects[index];

  return (
    <div className="space-y-6">
      <div
        ref={stageRef}
        role="group"
        aria-roledescription="carousel"
        aria-label="Main projects"
        onPointerDown={handlePointerDown}
        onKeyDown={handleKeyDown}
        onDragStart={(event) => event.preventDefault()}
        onClickCapture={(event) => {
          // A drag must not also count as a click on the card underneath.
          if (movedRef.current) {
            event.preventDefault();
            event.stopPropagation();
          }
        }}
        className="relative h-76 w-full overflow-x-clip sm:h-96 lg:h-108"
        style={{ perspective: "1600px", touchAction: "pan-y", userSelect: "none" }}
      >
        {projects.map((project, i) => (
          <div
            key={project.id}
            className="absolute left-1/2 top-4 w-[74%] max-w-136"
            inert={!entered || Math.abs(i - index) >= 2.6}
            style={{ ...poseStyle(i - index + shift, entered, instant), ...reflect }}
          >
            <ProjectCard
              project={project}
              index={i}
              active={i === index}
              onClick={() => (i === index ? setOpenId(project.id) : goTo(i))}
            />
          </div>
        ))}
      </div>

      <p className="sr-only" aria-live="polite">
        Project {index + 1} of {projects.length}: {current?.title}
      </p>

      <div className="flex items-center justify-center gap-4">
        <button
          type="button"
          aria-label="Previous project"
          onClick={() => goTo(index - 1)}
          disabled={index === 0}
          className={stepButtonClass}
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>

        <p aria-hidden="true" className="font-mono text-label text-muted">
          {String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}
        </p>

        <ul className="flex items-center">
          {projects.map((project, i) => (
            <li key={project.id}>
              <button
                type="button"
                aria-label={`Go to project ${i + 1}: ${project.title}`}
                aria-current={i === index ? "true" : undefined}
                onClick={() => goTo(i)}
                className="flex h-6 min-w-6 items-center justify-center px-1"
              >
                <span
                  className={cn(
                    "block h-1.5 rounded-full transition-all duration-300",
                    i === index ? "w-6 bg-accent" : "w-1.5 bg-line-strong hover:bg-accent-soft",
                  )}
                />
              </button>
            </li>
          ))}
        </ul>

        <button
          type="button"
          aria-label="Next project"
          onClick={() => goTo(index + 1)}
          disabled={index === LAST}
          className={stepButtonClass}
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </div>

      {openProject ? (
        <ProjectModal key={openProject.id} project={openProject} onClose={closeModal} />
      ) : null}
    </div>
  );
}