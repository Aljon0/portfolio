"use client";

import { useCursor } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import { BufferGeometry, Float32BufferAttribute, MathUtils, type Group } from "three";
import type { UniverseNode } from "@/lib/three/layout";
import type { ScenePalette } from "@/lib/three/palette";
import {
  TECH_H,
  TECH_W,
  Z_TILE,
  Z_TRACE,
  circuitLanes,
  interleave,
  stubSegments,
  type TilePlacement,
} from "@/lib/three/radialLayout";
import { iconPathFor } from "@/lib/three/techIcons";
import { Segments } from "./Segments";
import { useTileTextures } from "./useLabelTexture";
import type { SceneAssets } from "./useSceneAssets";

export type TileState = "normal" | "related" | "selected" | "dim";

const GROW_SECONDS = 0.7;
const STAGGER_SECONDS = 0.07;
const MIN_SCALE = 0.0001;

interface TechTileProps {
  node: UniverseNode;
  placement: TilePlacement;
  index: number;
  state: TileState;
  palette: ScenePalette;
  assets: SceneAssets;
  reducedMotion: boolean;
  onSelect: (id: string) => void;
}

export function TechTile({
  node,
  placement,
  index,
  state,
  palette,
  assets,
  reducedMotion,
  onSelect,
}: TechTileProps) {
  const groupRef = useRef<Group>(null);
  const progress = useRef(reducedMotion ? 1 : 0);
  const elapsed = useRef(0);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  const iconPath = useMemo(() => iconPathFor(node.label), [node.label]);
  const tile = useTileTextures(node.short, iconPath, TECH_W, TECH_H);

  const { x, y, side } = placement;

  const trace = useMemo(() => {
    const positions = interleave(circuitLanes(placement), Z_TRACE);
    const geometry = new BufferGeometry();
    geometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
    const vertexCount = positions.length / 3;
    geometry.setDrawRange(0, reducedMotion ? vertexCount : 0);
    return { geometry, vertexCount };
  }, [placement, reducedMotion]);

  useEffect(() => () => trace.geometry.dispose(), [trace]);

  const stubs = useMemo(() => stubSegments(side, index), [side, index]);

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    if (reducedMotion) {
      progress.current = 1;
    } else if (progress.current < 1) {
      elapsed.current += delta;
      if (elapsed.current > index * STAGGER_SECONDS) {
        progress.current = Math.min(1, progress.current + delta / GROW_SECONDS);
      }
    }

    const p = progress.current;
    const traceProgress = 1 - Math.pow(1 - Math.min(1, p / 0.7), 3);
    const segments = trace.vertexCount / 2;
    trace.geometry.setDrawRange(0, Math.floor(traceProgress * segments) * 2);
    group.scale.setScalar(Math.max(MathUtils.smoothstep(p, 0.55, 1), MIN_SCALE));
  });

  const base = side === -1 ? palette.accent : palette.warm;
  const strong = side === -1 ? palette.accentStrong : palette.warmStrong;
  const frameColor =
    state === "selected" ? palette.highlight : state === "related" || hovered ? strong : base;
  const contentColor = state === "selected" ? palette.highlight : palette.text;
  const opacity = state === "dim" ? 0.45 : 1;
  const emphasis = hovered || state === "selected" ? 1.06 : 1;

  return (
    <>
      <lineSegments geometry={trace.geometry}>
        <lineBasicMaterial
          color={state === "selected" ? strong : base}
          transparent
          opacity={(state === "selected" ? 1 : 0.85) * opacity}
        />
      </lineSegments>

      <group
        ref={groupRef}
        position={[x, y, Z_TILE]}
        scale={reducedMotion ? 1 : MIN_SCALE}
      >
        <group scale={emphasis}>
          <Segments positions={stubs} color={base} opacity={0.4 * opacity} />

          <mesh
            geometry={assets.plane}
            material={assets.tagBack}
            position={[0, 0, -0.5]}
            scale={[TECH_W - 4, TECH_H - 4, 1]}
            renderOrder={1}
          />
          <mesh geometry={assets.plane} scale={[TECH_W, TECH_H, 1]} renderOrder={2}>
            <meshBasicMaterial
              map={tile.frame}
              color={frameColor}
              transparent
              opacity={opacity}
              toneMapped={false}
              depthWrite={false}
            />
          </mesh>
          <mesh
            geometry={assets.plane}
            position={[0, 0, 0.5]}
            scale={[TECH_W, TECH_H, 1]}
            renderOrder={3}
          >
            <meshBasicMaterial
              map={tile.content}
              color={contentColor}
              transparent
              opacity={opacity}
              toneMapped={false}
              depthWrite={false}
            />
          </mesh>
          <mesh
            geometry={assets.plane}
            material={assets.hit}
            position={[0, 0, 1]}
            scale={[TECH_W + 10, TECH_H + 10, 1]}
            onPointerOver={(event) => {
              event.stopPropagation();
              setHovered(true);
            }}
            onPointerOut={() => setHovered(false)}
            onClick={(event) => {
              event.stopPropagation();
              onSelect(node.id);
            }}
          />
        </group>
      </group>
    </>
  );
}