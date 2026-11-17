"use client";

import Image from "next/image";
import { useState } from "react";

function initialsOf(title: string): string {
  return title
    .split(/[\s:()/-]+/)
    .filter((word) => word.length > 0)
    .slice(0, 3)
    .map((word) => word[0] ?? "")
    .join("")
    .toUpperCase();
}

function Placeholder({ title }: { title: string }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 flex items-center justify-center bg-surface-2"
    >
      <span className="font-display text-6xl tracking-tight text-accent-text/40">
        {initialsOf(title)}
      </span>
    </div>
  );
}

interface ProjectImageProps {
  src?: string;
  title: string;
  /** "card" crops to fill; "full" shows the entire image. */
  variant: "card" | "full";
}

export function ProjectImage({ src, title, variant }: ProjectImageProps) {
  const [failed, setFailed] = useState(false);
  const full = variant === "full";

  if (!src || failed) return <Placeholder title={title} />;

  return (
    <>
      {full ? null : <Placeholder title={title} />}
      <Image
        src={src}
        alt={full ? `${title} screenshot` : ""}
        fill
        sizes={full ? "(min-width: 1024px) 55vw, 90vw" : "(min-width: 640px) 544px, 74vw"}
        className={
          full
            ? "object-contain"
            : "object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        }
        onError={(event) => {
          if (full) setFailed(true);
          else event.currentTarget.style.display = "none";
        }}
      />
    </>
  );
}