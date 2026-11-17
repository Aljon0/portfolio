import type { ReactNode } from "react";

export function Tag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block max-w-full wrap-break-word rounded-xl border border-line px-3 py-1 font-mono text-xs leading-snug text-muted">
      {children}
    </span>
  );
}