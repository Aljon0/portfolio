import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface SectionLabelProps {
  index?: string;
  children: ReactNode;
  className?: string;
}

export function SectionLabel({ index, children, className }: SectionLabelProps) {
  return (
    <p className={cn("flex items-center gap-3 font-mono text-label text-accent-text", className)}>
      {index ? <span className="text-muted">{index}</span> : null}
      <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
      <span>{children}</span>
    </p>
  );
}