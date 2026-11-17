import { cn } from "@/lib/utils/cn";
import type { Project } from "@/types/content";
import { ProjectImage } from "./ProjectImage";

const ACTIVE_GLOW = {
  boxShadow:
    "0 0 0 1px var(--accent), 0 0 40px color-mix(in srgb, var(--accent) 38%, transparent)",
} as const;

interface ProjectCardProps {
  project: Project;
  index: number;
  /** True for the card in front: it opens the details. Other cards come to the front. */
  active: boolean;
  onClick: () => void;
}

export function ProjectCard({
  project,
  index,
  active,
  onClick,
}: ProjectCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={
        active ? undefined : `Show project ${index + 1}: ${project.title}`
      }
      aria-haspopup={active ? "dialog" : undefined}
      style={active ? ACTIVE_GLOW : undefined}
      className={cn(
        "group relative block aspect-16/10 w-full overflow-hidden rounded-3xl border bg-surface text-left transition-[translate,scale,border-color,box-shadow] duration-300 ease-out",
        active
          ? "border-accent hover:-translate-y-2 hover:scale-[1.03] focus-visible:-translate-y-2 focus-visible:scale-[1.03]"
          : "border-line hover:border-line-strong",
      )}
    >
      <ProjectImage src={project.image} title={project.title} variant="card" />

      <div
        aria-hidden="true"
        className="absolute inset-0 bg-linear-to-t from-canvas/95 via-canvas/25 to-transparent"
      />

      <span className="absolute left-4 top-4 rounded-full border border-line bg-canvas/75 px-3 py-1 font-mono text-label text-muted sm:left-5 sm:top-5">
        {String(index + 1).padStart(2, "0")} · {project.category}
      </span>

      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6">
        <span className="block font-display text-xl tracking-tight text-fg sm:text-3xl">
          {project.title}
        </span>
        {active ? (
          <p className="mt-1.5 text-sm text-accent-text">View details</p>
        ) : null}
      </div>
    </button>
  );
}
