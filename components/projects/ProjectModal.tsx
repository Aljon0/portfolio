"use client";

import { X } from "lucide-react";
import { useCallback, useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { Tag } from "@/components/ui/Tag";
import { TextLink } from "@/components/ui/TextLink";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTypewriter } from "@/hooks/useTypewriter";
import { gsap } from "@/lib/animations/gsap";
import { cn } from "@/lib/utils/cn";
import type { Project } from "@/types/content";
import { ProjectImage } from "./ProjectImage";

interface TextBlock {
  key: string;
  label: string;
  text: string;
}

function buildBlocks(project: Project): TextBlock[] {
  const blocks: TextBlock[] = [{ key: "overview", label: "Overview", text: project.overview }];
  if (project.problem) blocks.push({ key: "problem", label: "Problem", text: project.problem });
  if (project.solution) blocks.push({ key: "solution", label: "Solution", text: project.solution });
  if (project.features.length > 0) {
    blocks.push({
      key: "features",
      label: "Key features",
      text: project.features.map((feature) => `– ${feature}`).join("\n"),
    });
  }
  if (project.architecture) {
    blocks.push({ key: "architecture", label: "Architecture", text: project.architecture });
  }
  if (project.contribution) {
    blocks.push({ key: "contribution", label: "My contribution", text: project.contribution });
  }
  if (project.challenges) {
    blocks.push({ key: "challenges", label: "Decisions", text: project.challenges });
  }
  return blocks;
}

const FOCUSABLE = 'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

interface ProjectModalProps {
  project: Project;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  const titleId = useId();
  const reducedMotion = useReducedMotion();
  const backdropRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const closingRef = useRef(false);

  const blocks = buildBlocks(project);
  const lengths = blocks.map((block) => block.text.length);
  const total = lengths.reduce((sum, length) => sum + length, 0);
  const starts = lengths.map((_, i) =>
    lengths.slice(0, i).reduce((sum, length) => sum + length, 0),
  );
  const { typed, done, skip } = useTypewriter(total, reducedMotion, 450);

  const requestClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;

    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (reducedMotion || !panel || !backdrop) {
      onClose();
      return;
    }

    gsap.to(panel, { opacity: 0, y: 24, scale: 0.97, duration: 0.25, ease: "power2.in" });
    gsap.to(backdrop, { opacity: 0, duration: 0.3, onComplete: onClose });
  }, [onClose, reducedMotion]);

  // Entrance animation.
  useEffect(() => {
    if (reducedMotion) return;
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (!panel || !backdrop) return;

    const context = gsap.context(() => {
      gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: "power2.out" });
      gsap.fromTo(
        panel,
        { opacity: 0, y: 36, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: "power3.out" },
      );
    });
    return () => context.revert();
  }, [reducedMotion]);

  // Lock page scroll, compensating for the scrollbar so the layout doesn't jump.
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

  // Focus: move into the dialog, trap Tab, close on Escape, return focus on exit.
  useEffect(() => {
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        requestClose();
        return;
      }
      if (event.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;
      const focusable = panel.querySelectorAll<HTMLElement>(FOCUSABLE);
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus();
    };
  }, [requestClose]);

  return createPortal(
    <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-6">
      <div
        ref={backdropRef}
        aria-hidden="true"
        onClick={requestClose}
        className="absolute inset-0 bg-canvas/55 backdrop-blur-xl"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative grid max-h-[92svh] w-full max-w-6xl overflow-y-auto rounded-3xl border border-line bg-surface shadow-2xl lg:h-[min(40rem,92svh)] lg:grid-cols-[1.15fr_1fr] lg:overflow-hidden"
      >
        <button
          ref={closeRef}
          type="button"
          onClick={requestClose}
          aria-label="Close project details"
          className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-canvas/70 text-muted backdrop-blur-sm transition-colors hover:border-accent hover:text-fg"
        >
          <X size={18} aria-hidden="true" />
        </button>

        <div className="relative h-64 bg-surface-2 sm:h-80 lg:h-auto">
          <ProjectImage src={project.image} title={project.title} variant="full" />
        </div>

        <div className="flex min-h-0 flex-col p-6 sm:p-8 lg:overflow-y-auto">
          <p className="font-mono text-label text-accent-text">{project.category}</p>
          <h2 id={titleId} className="mt-3 pr-10 font-display text-3xl tracking-tight sm:text-4xl">
            {project.title}
          </h2>

          {project.liveUrl || project.videoUrl || project.repoUrl ? (
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
              {project.liveUrl ? (
                <TextLink href={project.liveUrl} external>
                  Live demo
                </TextLink>
              ) : null}
              {project.videoUrl ? (
                <TextLink href={project.videoUrl} external>
                  Video walkthrough
                </TextLink>
              ) : null}
              {project.repoUrl ? (
                <TextLink href={project.repoUrl} external>
                  Repository
                </TextLink>
              ) : null}
            </div>
          ) : null}

          {done ? null : (
            <button
              type="button"
              onClick={skip}
              className="mt-4 self-start font-mono text-label text-muted transition-colors hover:text-accent-text"
            >
              Skip animation
            </button>
          )}

          {blocks.map((block, i) => {
            const start = starts[i] ?? 0;
            const length = block.text.length;
            const shown = Math.max(0, Math.min(length, typed - start));
            const started = typed > start;
            const typing = !done && typed >= start && typed < start + length;

            return (
              <div key={block.key} className="mt-6">
                <h3
                  className={cn(
                    "font-mono text-label text-muted transition-opacity duration-300",
                    started ? "opacity-100" : "opacity-0",
                  )}
                >
                  {block.label}
                </h3>
                {/* Full text for screen readers, a hidden copy that reserves the space,
                    and the visible typed text on top. */}
                <div className="relative mt-2 text-muted">
                  <p className="sr-only whitespace-pre-line">{block.text}</p>
                  <p aria-hidden="true" className="invisible whitespace-pre-line">
                    {block.text}
                  </p>
                  <p
                    aria-hidden="true"
                    className="absolute inset-0 whitespace-pre-line text-fg/90"
                  >
                    {block.text.slice(0, shown)}
                    {typing ? (
                      <span
                        aria-hidden="true"
                        className="ml-0.5 inline-block h-[1em] w-0.5 animate-pulse bg-accent-text align-[-0.12em] motion-reduce:animate-none"
                      />
                    ) : null}
                  </p>
                </div>
              </div>
            );
          })}

          <ul
            aria-label="Technology stack"
            className={cn(
              "mt-8 flex flex-wrap gap-2 transition-opacity duration-500",
              done ? "opacity-100" : "opacity-0",
            )}
          >
            {project.stack.map((tech) => (
              <li key={tech}>
                <Tag>{tech}</Tag>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>,
    document.body,
  );
}