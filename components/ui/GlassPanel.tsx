import type { ElementType, HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface GlassPanelProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
}

export function GlassPanel({ as: Tag = "div", className, ...rest }: GlassPanelProps) {
  return <Tag className={cn("glass rounded-3xl", className)} {...rest} />;
}