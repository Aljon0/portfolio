"use client";

import { useCursor } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef, useState } from "react";
import { MathUtils, type Group } from "three";
import type { ScenePalette } from "@/lib/three/palette";
import { GROUP_TILE, HUB_TILE, Z_HUB, type Slot } from "@/lib/three/radialLayout";
import { useGlyphTexture, useTextTexture } from "./useLabelTexture";
import type { SceneAssets } from "./useSceneAssets";

export type HubMode = "overview" | "active" | "hidden";

const DEPTH = 14;
const GLYPH_PX = 64;
const LABEL_FONT = 15;
const ACTIVE_SCALE = HUB_TILE / GROUP_TILE;
const MIN_SCALE = 0.0001;

interface GroupHubProps {
  id: string;
  label: string;
  slot: Slot;
  mode: HubMode;
  palette: ScenePalette;
  assets: SceneAssets;
  reducedMotion: boolean;
  onSelect: (id: string) => void;
}

export function GroupHub({
  id,
  label,
  slot,
  mode,
  palette,
  assets,
  reducedMotion,
  onSelect,
}: GroupHubProps) {
  const groupRef = useRef<Group>(null);
  const [hovered, setHovered] = useState(false);
  const interactive = mode !== "hidden";
  useCursor(hovered && interactive);

  const glyph = useGlyphTexture(id, GLYPH_PX);
  const text = useTextTexture(label, LABEL_FONT);

  const active = mode === "active";

  useFrame((_, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const targetX = active ? 0 : slot.x;
    const targetY = active ? 0 : slot.y;
    const targetScale = active ? ACTIVE_SCALE : mode === "hidden" ? MIN_SCALE : 1;

    if (reducedMotion) {
      group.position.set(targetX, targetY, Z_HUB);
      group.scale.setScalar(targetScale);
    } else {
      group.position.x = MathUtils.damp(group.position.x, targetX, 7, delta);
      group.position.y = MathUtils.damp(group.position.y, targetY, 7, delta);
      group.scale.setScalar(MathUtils.damp(group.scale.x, targetScale, 7, delta));
    }
    group.visible = group.scale.x > 0.02;
  });

  return (
    <group ref={groupRef} position={[slot.x, slot.y, Z_HUB]}>
      <group scale={hovered && interactive ? 1.05 : 1}>
        <mesh
          geometry={assets.box}
          material={assets.chipBody}
          scale={[GROUP_TILE, GROUP_TILE, DEPTH]}
          onPointerOver={
            interactive
              ? (event) => {
                  event.stopPropagation();
                  setHovered(true);
                }
              : undefined
          }
          onPointerOut={interactive ? () => setHovered(false) : undefined}
          onClick={
            interactive
              ? (event) => {
                  event.stopPropagation();
                  onSelect(id);
                }
              : undefined
          }
        />
        <lineSegments geometry={assets.boxEdges} scale={[GROUP_TILE, GROUP_TILE, DEPTH]}>
          <lineBasicMaterial color={active ? palette.highlight : palette.accentStrong} />
        </lineSegments>

        <mesh
          position={[0, 0, DEPTH / 2 + 1]}
          geometry={assets.plane}
          scale={[GLYPH_PX, GLYPH_PX, 1]}
          renderOrder={2}
        >
          <meshBasicMaterial
            map={glyph.texture}
            color={active ? palette.highlight : palette.accentStrong}
            transparent
            toneMapped={false}
            depthWrite={false}
          />
        </mesh>

        <mesh
          position={[0, -(GROUP_TILE / 2 + 6 + text.height / 2), 1]}
          geometry={assets.plane}
          scale={[text.width, text.height, 1]}
          renderOrder={2}
        >
          <meshBasicMaterial
            map={text.texture}
            color={active ? palette.highlight : palette.text}
            transparent
            toneMapped={false}
            depthWrite={false}
          />
        </mesh>
      </group>
    </group>
  );
}