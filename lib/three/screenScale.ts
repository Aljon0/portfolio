import type { RootState } from "@react-three/fiber";
import { MathUtils, PerspectiveCamera, type Vector3 } from "three";

/**
 * World units per CSS pixel at `position`. Scaling a group by this value makes
 * content authored in pixels appear at that pixel size on screen.
 */
export function worldPerPixel(state: RootState, position: Vector3): number {
  const { camera, size } = state;
  if (!(camera instanceof PerspectiveCamera)) return 0.03;

  const distance = Math.max(camera.position.distanceTo(position), 0.1);
  const visibleHeight =
    (2 * Math.tan(MathUtils.degToRad(camera.fov) / 2) * distance) / camera.zoom;

  return visibleHeight / Math.max(size.height, 1);
}