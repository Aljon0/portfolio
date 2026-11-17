"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { skillCategories } from "@/data/portfolio";
import { projects } from "@/data/projects";
import { use3DSupport } from "@/hooks/use3DSupport";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTheme } from "@/hooks/useTheme";
import { ScrollTrigger } from "@/lib/animations/gsap";
import { buildNodeIndex, buildUniverse } from "@/lib/three/layout";
import { buildRelations } from "@/lib/three/relations";
import { cn } from "@/lib/utils/cn";

const EMPTY_IDS: ReadonlySet<string> = new Set();

function CanvasMessage({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-full items-center justify-center px-6 text-center font-mono text-label text-muted">
      {children}
    </div>
  );
}

const UniverseCanvas = dynamic(() => import("@/components/3d/UniverseCanvas"), {
  ssr: false,
  loading: () => <CanvasMessage>Loading 3D view…</CanvasMessage>,
});

interface FilterChipProps {
  pressed: boolean;
  onClick: () => void;
  children: ReactNode;
}

function FilterChip({ pressed, onClick, children }: FilterChipProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        "min-h-10 rounded-full border px-4 text-sm transition-colors",
        pressed
          ? "border-accent bg-surface-2 text-fg"
          : "border-line text-muted hover:border-line-strong hover:text-fg",
      )}
    >
      {children}
    </button>
  );
}

const CORNERS = [
  "left-3 top-3 border-l border-t",
  "right-3 top-3 border-r border-t",
  "bottom-3 left-3 border-b border-l",
  "bottom-3 right-3 border-b border-r",
] as const;

export function UniverseExplorer() {
  const clusters = useMemo(() => buildUniverse(skillCategories), []);
  const nodeIndex = useMemo(() => buildNodeIndex(clusters), [clusters]);
  const relations = useMemo(() => buildRelations(clusters, projects), [clusters]);

  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [selectedTechId, setSelectedTechId] = useState<string | null>(null);
  const [userPreference, setUserPreference] = useState<boolean | null>(null);
  const [failed, setFailed] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const nearby = useInView(rootRef, "400px");
  const visible = useInView(rootRef, "0px");
  const reducedMotion = useReducedMotion();
  const { theme } = useTheme();
  const support = use3DSupport();

  const supported = support === "on" || support === "off";
  const show3D = supported && (userPreference ?? support === "on") && !failed;
  // Reserve the canvas space while detection is pending, so the layout doesn't jump.
  const reserve3D = support === "pending" || show3D;

  useEffect(() => {
    ScrollTrigger.refresh();
  }, [reserve3D]);

  const selectCategory = useCallback((id: string | null) => {
    setActiveCategoryId(id);
    setSelectedTechId(null);
  }, []);

  const selectTech = useCallback(
    (id: string) => {
      const node = nodeIndex.get(id);
      if (!node) return;
      setActiveCategoryId(node.categoryId);
      setSelectedTechId(id);
    },
    [nodeIndex],
  );

  const clearSelection = useCallback(() => selectCategory(null), [selectCategory]);
  const handleFail = useCallback(() => setFailed(true), []);

  const relatedIds = useMemo<ReadonlySet<string>>(
    () =>
      selectedTechId ? new Set(relations.relatedByTech.get(selectedTechId) ?? []) : EMPTY_IDS,
    [selectedTechId, relations],
  );

  const selectedNode = selectedTechId ? nodeIndex.get(selectedTechId) : undefined;
  const activeCluster = clusters.find((cluster) => cluster.id === activeCategoryId);
  const visibleClusters = activeCluster ? [activeCluster] : clusters;
  const usedIn = selectedTechId ? (relations.projectsByTech.get(selectedTechId) ?? []) : [];
  const relatedLabels = [...relatedIds]
    .map((id) => nodeIndex.get(id)?.label)
    .filter((label): label is string => label !== undefined);
  const selectedCategoryLabel = clusters.find(
    (cluster) => cluster.id === selectedNode?.categoryId,
  )?.label;

  return (
    <div ref={rootRef} data-reveal="fade-up" className="space-y-8">
      {reserve3D ? (
        <div
          aria-hidden="true"
          className="universe-canvas relative h-120 overflow-hidden rounded-3xl border border-line bg-surface/40 sm:h-136"
        >
          {show3D && nearby ? (
            <UniverseCanvas
              clusters={clusters}
              activeCategoryId={activeCategoryId}
              selectedTechId={selectedTechId}
              relatedIds={relatedIds}
              onSelectCategory={selectCategory}
              onSelectTech={selectTech}
              onClear={clearSelection}
              onFail={handleFail}
              active={visible}
              reducedMotion={reducedMotion}
              theme={theme}
            />
          ) : (
            <CanvasMessage>3D view loads as you scroll.</CanvasMessage>
          )}

          {CORNERS.map((corner) => (
            <span
              key={corner}
              className={cn(
                "pointer-events-none absolute h-4 w-4 border-accent-text/60",
                corner,
              )}
            />
          ))}
          <p className="pointer-events-none absolute bottom-4 left-8 font-mono text-label text-muted">
            Select a group · drag to tilt
          </p>
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-2">
        <div className="min-w-0">
          <div
            className="flex flex-wrap items-center gap-2"
            role="group"
            aria-label="Technology groups"
          >
            <FilterChip pressed={activeCategoryId === null} onClick={() => selectCategory(null)}>
              All
            </FilterChip>
            {clusters.map((cluster) => (
              <FilterChip
                key={cluster.id}
                pressed={activeCategoryId === cluster.id}
                onClick={() => selectCategory(cluster.id)}
              >
                {cluster.label}
              </FilterChip>
            ))}
          </div>

          {supported ? (
            <button
              type="button"
              aria-pressed={show3D}
              onClick={() => setUserPreference(!show3D)}
              className="mt-4 min-h-10 font-mono text-label text-muted transition-colors hover:text-accent-text"
            >
              3D view: {show3D ? "on" : "off"}
            </button>
          ) : null}
          {failed ? (
            <p role="status" className="mt-4 text-sm text-muted">
              The 3D view couldn&apos;t start. Everything is available in the list.
            </p>
          ) : null}

          <div aria-live="polite" className="mt-6 min-h-28">
            {selectedNode ? (
              <div>
                <p className="font-mono text-label text-accent-text">{selectedCategoryLabel}</p>
                <h3 className="mt-2 font-display text-2xl tracking-tight">
                  {selectedNode.label}
                </h3>
                {usedIn.length > 0 ? (
                  <>
                    <p className="mt-4 font-mono text-label text-muted">Used in</p>
                    <ul className="mt-2 space-y-1 text-sm">
                      {usedIn.map((project) => (
                        <li key={project.id}>{project.title}</li>
                      ))}
                    </ul>
                    <a
                      href="#projects"
                      className="mt-3 inline-block text-sm text-accent-text underline-offset-4 hover:underline"
                    >
                      See the projects
                    </a>
                  </>
                ) : (
                  <p className="mt-4 text-sm text-muted">
                    Not named in any project stack listed on this site.
                  </p>
                )}
                {relatedLabels.length > 0 ? (
                  <>
                    <p className="mt-4 font-mono text-label text-muted">Used together with</p>
                    <p className="mt-2 text-sm text-muted">{relatedLabels.join(", ")}</p>
                  </>
                ) : null}
              </div>
            ) : activeCluster ? (
              <div>
                <p className="font-mono text-label text-accent-text">Group</p>
                <h3 className="mt-2 font-display text-2xl tracking-tight">
                  {activeCluster.label}
                </h3>
                <p className="mt-2 text-sm text-muted">
                  {activeCluster.nodes.length} technologies. Select one to see where it&apos;s
                  used.
                </p>
              </div>
            ) : (
              <p className="text-sm text-muted">
                Select a group or a technology to see where it appears in my projects.
              </p>
            )}
          </div>
        </div>

        <div className="min-w-0 space-y-6">
          {visibleClusters.map((cluster) => (
            <div key={cluster.id}>
              <h3 className="font-mono text-label text-muted">{cluster.label}</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {cluster.nodes.map((node) => {
                  const pressed = selectedTechId === node.id;
                  return (
                    <li key={node.id}>
                      <button
                        type="button"
                        aria-pressed={pressed}
                        onClick={() => selectTech(node.id)}
                        className={cn(
                          "min-h-9 rounded-xl border px-3 py-1 text-left font-mono text-xs leading-snug transition-colors",
                          pressed
                            ? "border-accent text-accent-text"
                            : "border-line text-muted hover:border-line-strong hover:text-fg",
                        )}
                      >
                        {node.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}