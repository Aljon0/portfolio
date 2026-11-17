"use client";

import { Canvas } from "@react-three/fiber";
import { CanvasErrorBoundary } from "./CanvasErrorBoundary";
import { UniverseScene, type UniverseSceneProps } from "./UniverseScene";

export interface UniverseCanvasProps extends UniverseSceneProps {
  onClear: () => void;
  onFail: () => void;
}

export default function UniverseCanvas({ onClear, onFail, ...scene }: UniverseCanvasProps) {
  return (
    <CanvasErrorBoundary onError={onFail}>
      <Canvas
        frameloop={scene.active && !scene.reducedMotion ? "always" : "demand"}
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 17], fov: 45, near: 0.1, far: 80 }}
        gl={{ antialias: true, powerPreference: "low-power" }}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("webglcontextlost", (event) => {
            event.preventDefault();
            onFail();
          });
        }}
        onPointerMissed={onClear}
      >
        <UniverseScene {...scene} />
      </Canvas>
    </CanvasErrorBoundary>
  );
}