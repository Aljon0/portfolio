"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import { Vector3, type Group } from "three";
import type { Theme } from "@/lib/theme";
import type { UniverseCluster, UniverseNode } from "@/lib/three/layout";
import { PALETTES } from "@/lib/three/palette";
import {
  HUB_TILE,
  LANES,
  LAYOUT_HEIGHT,
  LAYOUT_WIDTH,
  PIN_LENGTH,
  Z_HUB,
  expandedPlacements,
  overviewSlots,
  type Slot,
} from "@/lib/three/radialLayout";
import { worldPerPixel } from "@/lib/three/screenScale";
import { ControlsRig } from "./ControlsRig";
import { GroupHub, type HubMode } from "./GroupHub";
import { Segments } from "./Segments";
import { TechTile, type TileState } from "./TechTile";
import { useSceneAssets } from "./useSceneAssets";

const ORIGIN = new Vector3();
const FALLBACK_SLOT: Slot = { x: 0, y: 0 };
const FIT_MARGIN = 40;
const MIN_FIT = 0.4;
/** Rough world units per pixel before the first frame corrects it. */
const INITIAL_SCALE = 0.03;

export interface UniverseSceneProps {
  clusters: readonly UniverseCluster[];
  activeCategoryId: string | null;
  selectedTechId: string | null;
  /** Node ids used together with the selected technology in at least one project. */
  relatedIds: ReadonlySet<string>;
  /** Called with null to collapse an open group. */
  onSelectCategory: (id: string | null) => void;
  onSelectTech: (id: string) => void;
  /** True while the scene is on screen. */
  active: boolean;
  reducedMotion: boolean;
  theme: Theme;
}

export function UniverseScene({
  clusters,
  activeCategoryId,
  selectedTechId,
  relatedIds,
  onSelectCategory,
  onSelectTech,
  active,
  reducedMotion,
  theme,
}: UniverseSceneProps) {
  const palette = PALETTES[theme];
  const assets = useSceneAssets(palette);
  const rootRef = useRef<Group>(null);
  const swayRef = useRef<Group>(null);

  const slots = useMemo(() => overviewSlots(clusters.length), [clusters.length]);

  const activeCluster = activeCategoryId
    ? clusters.find((cluster) => cluster.id === activeCategoryId)
    : undefined;

  const placements = useMemo(
    () => (activeCluster ? expandedPlacements(activeCluster.nodes.length) : []),
    [activeCluster],
  );

  // Pins on the center tile's left and right edges, where the traces attach.
  const pins = useMemo(() => {
    const left: number[] = [];
    const right: number[] = [];
    for (const placement of placements) {
      const edge = placement.side * (HUB_TILE / 2);
      const tip = placement.side * (HUB_TILE / 2 + PIN_LENGTH);
      for (const lane of LANES) {
        const y = placement.attachY + lane;
        (placement.side === -1 ? left : right).push(edge, y, Z_HUB, tip, y, Z_HUB);
      }
    }
    return { left, right };
  }, [placements]);

  useFrame((state) => {
    const root = rootRef.current;
    if (root) {
      const fit = Math.min(
        1,
        (state.size.width - FIT_MARGIN) / LAYOUT_WIDTH,
        (state.size.height - FIT_MARGIN) / LAYOUT_HEIGHT,
      );
      root.scale.setScalar(worldPerPixel(state, ORIGIN) * Math.max(fit, MIN_FIT));
    }

    const sway = swayRef.current;
    if (sway && active && !reducedMotion) {
      sway.rotation.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.05;
    }
  });

  function hubMode(id: string): HubMode {
    if (activeCategoryId === null) return "overview";
    return activeCategoryId === id ? "active" : "hidden";
  }

  function tileState(node: UniverseNode): TileState {
    if (node.id === selectedTechId) return "selected";
    if (selectedTechId !== null) return relatedIds.has(node.id) ? "related" : "dim";
    return "normal";
  }

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[6, 8, 6]} intensity={1.6} />

      <group ref={rootRef} scale={INITIAL_SCALE}>
        <group ref={swayRef}>
          {clusters.map((cluster, index) => (
            <GroupHub
              key={cluster.id}
              id={cluster.id}
              label={cluster.label}
              slot={slots[index] ?? FALLBACK_SLOT}
              mode={hubMode(cluster.id)}
              palette={palette}
              assets={assets}
              reducedMotion={reducedMotion}
              onSelect={(id) => onSelectCategory(activeCategoryId === id ? null : id)}
            />
          ))}

          {activeCluster ? (
            <>
              <Segments positions={pins.left} color={palette.accentStrong} opacity={0.9} />
              <Segments positions={pins.right} color={palette.warm} opacity={0.9} />
              {activeCluster.nodes.map((node, index) => {
                const placement = placements[index];
                if (!placement) return null;
                return (
                  <TechTile
                    key={node.id}
                    node={node}
                    placement={placement}
                    index={index}
                    state={tileState(node)}
                    palette={palette}
                    assets={assets}
                    reducedMotion={reducedMotion}
                    onSelect={onSelectTech}
                  />
                );
              })}
            </>
          ) : null}
        </group>
      </group>

      <ControlsRig reducedMotion={reducedMotion} />
    </>
  );
}