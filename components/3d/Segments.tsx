"use client";

import { useEffect, useMemo } from "react";
import { BufferGeometry, Float32BufferAttribute } from "three";

interface SegmentsProps {
  /** Flat [x1,y1,z1, x2,y2,z2, ...] pairs. Keep the reference stable (useMemo). */
  positions: readonly number[];
  color: string;
  opacity: number;
}

export function Segments({ positions, color, opacity }: SegmentsProps) {
  const geometry = useMemo(() => {
    const next = new BufferGeometry();
    next.setAttribute("position", new Float32BufferAttribute(positions, 3));
    return next;
  }, [positions]);

  useEffect(() => () => geometry.dispose(), [geometry]);

  return (
    <lineSegments geometry={geometry}>
      <lineBasicMaterial color={color} transparent opacity={opacity} depthWrite={false} />
    </lineSegments>
  );
}