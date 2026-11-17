export type Support3D = "pending" | "unsupported" | "on" | "off";

interface NetworkInformationLike {
  saveData?: boolean;
}
type NavigatorWithConnection = Navigator & { connection?: NetworkInformationLike };

let cached: Support3D | null = null;

function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") ?? canvas.getContext("webgl");
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/**
 * "pending": not on the client yet. "unsupported": no WebGL.
 * "off": supported, but off by default (Save-Data or a low core count).
 * "on": supported and on by default.
 */
export function detect3DSupport(): Support3D {
  if (cached !== null) return cached;
  if (typeof window === "undefined") return "pending";

  if (!isWebGLAvailable()) {
    cached = "unsupported";
    return cached;
  }

  const saveData = (navigator as NavigatorWithConnection).connection?.saveData === true;
  const lowCores = navigator.hardwareConcurrency > 0 && navigator.hardwareConcurrency <= 2;
  const narrow = window.matchMedia("(max-width: 767px)").matches;
  cached = saveData || lowCores || narrow ? "off" : "on";
  return cached;
}