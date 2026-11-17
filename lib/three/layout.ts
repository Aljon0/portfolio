import type { SkillCategory } from "@/types/content";

export interface UniverseNode {
  id: string;
  label: string;
  /** Label used inside the 3D scene (short, no parenthetical details). */
  short: string;
  categoryId: string;
}

export interface UniverseCluster {
  id: string;
  label: string;
  nodes: UniverseNode[];
}

const SHORT_OVERRIDES: Readonly<Record<string, string>> = {
  "Hugging Face Inference API": "Hugging Face",
};

export function shortLabel(label: string): string {
  return SHORT_OVERRIDES[label] ?? label.replace(/\s*\([^)]*\)/g, "").trim();
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function buildUniverse(categories: readonly SkillCategory[]): UniverseCluster[] {
  return categories.map((category) => ({
    id: category.id,
    label: category.label,
    nodes: category.items.map(
      (label): UniverseNode => ({
        id: `${category.id}:${slugify(label)}`,
        label,
        short: shortLabel(label),
        categoryId: category.id,
      }),
    ),
  }));
}

export function buildNodeIndex(
  clusters: readonly UniverseCluster[],
): ReadonlyMap<string, UniverseNode> {
  const index = new Map<string, UniverseNode>();
  for (const cluster of clusters) {
    for (const node of cluster.nodes) index.set(node.id, node);
  }
  return index;
}