"use client";

import { useSyncExternalStore } from "react";
import { detect3DSupport, type Support3D } from "@/lib/three/support";

function subscribe(): () => void {
  return () => undefined;
}

function getServerSnapshot(): Support3D {
  return "pending";
}

export function use3DSupport(): Support3D {
  return useSyncExternalStore(subscribe, detect3DSupport, getServerSnapshot);
}