"use client";

import { OrbitControls } from "@react-three/drei";

/** How far (radians) the scene can be tilted sideways and up/down. */
const MAX_AZIMUTH = 0.5;
const MAX_POLAR_OFFSET = 0.25;

export function ControlsRig({ reducedMotion }: { reducedMotion: boolean }) {
  return (
    <OrbitControls
      makeDefault
      enablePan={false}
      enableZoom={false}
      enableDamping={!reducedMotion}
      dampingFactor={0.08}
      rotateSpeed={0.5}
      minAzimuthAngle={-MAX_AZIMUTH}
      maxAzimuthAngle={MAX_AZIMUTH}
      minPolarAngle={Math.PI / 2 - MAX_POLAR_OFFSET}
      maxPolarAngle={Math.PI / 2 + MAX_POLAR_OFFSET}
    />
  );
}