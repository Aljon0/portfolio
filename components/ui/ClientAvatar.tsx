"use client";

import Image from "next/image";
import { cn } from "@/lib/utils/cn";

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

interface ClientAvatarProps {
  name: string;
  photo?: string;
  className?: string;
}

/** Initials sit underneath, so a missing or broken photo still looks intentional. */
export function ClientAvatar({ name, photo, className }: ClientAvatarProps) {
  return (
    <span
      className={cn(
        "relative inline-flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line-strong bg-surface-2 font-mono text-sm text-accent-text",
        className,
      )}
    >
      <span aria-hidden="true">{initialsOf(name)}</span>
      {photo ? (
        <Image
          src={photo}
          alt=""
          fill
          sizes="48px"
          className="object-cover"
          onError={(event) => {
            event.currentTarget.style.display = "none";
          }}
        />
      ) : null}
    </span>
  );
}