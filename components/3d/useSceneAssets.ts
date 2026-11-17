"use client";

import { useEffect, useMemo } from "react";
import {
  BoxGeometry,
  EdgesGeometry,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PlaneGeometry,
} from "three";
import type { ScenePalette } from "@/lib/three/palette";

export interface SceneAssets {
  plane: PlaneGeometry;
  box: BoxGeometry;
  boxEdges: EdgesGeometry;
  /** Invisible material used for generous click areas. */
  hit: MeshBasicMaterial;
  /** Opaque-ish backing behind a technology tag, so branch lines don't show through. */
  tagBack: MeshBasicMaterial;
  chipBody: MeshStandardMaterial;
  chipBodyDim: MeshStandardMaterial;
}

export function useSceneAssets(palette: ScenePalette): SceneAssets {
  const assets = useMemo<SceneAssets>(() => {
    const box = new BoxGeometry(1, 1, 1);
    return {
      plane: new PlaneGeometry(1, 1),
      box,
      boxEdges: new EdgesGeometry(box),
      hit: new MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }),
      tagBack: new MeshBasicMaterial({
        color: palette.body,
        transparent: true,
        opacity: 0.88,
        depthWrite: false,
        toneMapped: false,
      }),
      chipBody: new MeshStandardMaterial({
        color: palette.body,
        roughness: 0.55,
        metalness: 0.25,
      }),
      chipBodyDim: new MeshStandardMaterial({
        color: palette.body,
        roughness: 0.55,
        metalness: 0.25,
        transparent: true,
        opacity: 0.5,
      }),
    };
  }, [palette]);

  useEffect(
    () => () => {
      assets.plane.dispose();
      assets.box.dispose();
      assets.boxEdges.dispose();
      assets.hit.dispose();
      assets.tagBack.dispose();
      assets.chipBody.dispose();
      assets.chipBodyDim.dispose();
    },
    [assets],
  );

  return assets;
}