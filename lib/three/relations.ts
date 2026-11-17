import type { Project } from "@/types/content";
import type { UniverseCluster } from "./layout";

export interface TechRelations {
  /** node id -> projects whose stack names this technology */
  projectsByTech: ReadonlyMap<string, readonly Project[]>;
  /** node id -> node ids that appear together with it in at least one project */
  relatedByTech: ReadonlyMap<string, readonly string[]>;
}

/** "Next.js (App Router)" and "Next.js" both become "next". */
export function techKey(value: string): string {
  return value
    .toLowerCase()
    .replace(/\([^)]*\)/g, "")
    .replace(/\.js\b/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildRelations(
  clusters: readonly UniverseCluster[],
  projects: readonly Project[],
): TechRelations {
  const nodesByKey = new Map<string, string[]>();
  for (const cluster of clusters) {
    for (const node of cluster.nodes) {
      const key = techKey(node.label);
      nodesByKey.set(key, [...(nodesByKey.get(key) ?? []), node.id]);
    }
  }

  const projectsByTech = new Map<string, Project[]>();
  const techsByProject: string[][] = [];

  for (const project of projects) {
    const used = new Set<string>();
    for (const entry of project.stack) {
      for (const id of nodesByKey.get(techKey(entry)) ?? []) used.add(id);
    }
    const ids = [...used];
    techsByProject.push(ids);
    for (const id of ids) {
      projectsByTech.set(id, [...(projectsByTech.get(id) ?? []), project]);
    }
  }

  const related = new Map<string, Set<string>>();
  for (const ids of techsByProject) {
    for (const id of ids) {
      const set = related.get(id) ?? new Set<string>();
      for (const other of ids) {
        if (other !== id) set.add(other);
      }
      related.set(id, set);
    }
  }

  const relatedByTech = new Map<string, readonly string[]>();
  related.forEach((set, id) => relatedByTech.set(id, [...set]));

  return { projectsByTech, relatedByTech };
}