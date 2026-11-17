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
  /** "card" crops to fill its box; "full" shows the whole image at its natural proportions. */
  variant: "card" | "full";
}

export function ProjectImage({ src, title, variant }: ProjectImageProps) {
  const [failed, setFailed] = useState(false);

  if (variant === "full") {
    if (!src || failed) {
      return (
        <div className="relative aspect-16/10 w-full overflow-hidden rounded-2xl border border-line">
          <Placeholder title={title} />
        </div>
      );
    }

    return (
      <Image
        src={src}
        alt={`${title} screenshot`}
        // Only a size hint: the image keeps its own proportions.
        width={1600}
        height={1000}
        sizes="(min-width: 1024px) 896px, 92vw"
        onError={() => setFailed(true)}
        className="h-auto max-h-[52svh] w-auto max-w-full rounded-2xl border border-line object-contain shadow-2xl"
      />
    );
  }

  if (!src || failed) return <Placeholder title={title} />;

  return (
    <>
      <Placeholder title={title} />
      <Image
        src={src}
        alt=""
        fill
        sizes="(min-width: 640px) 544px, 74vw"
        className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        onError={(event) => {
          event.currentTarget.style.display = "none";
        }}
      />
    </>
  );
}