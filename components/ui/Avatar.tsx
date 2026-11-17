import Image from "next/image";
import { PROFILE_IMAGE_SRC } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";

interface AvatarProps {
  name: string;
  className?: string;
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function Avatar({ name, className }: AvatarProps) {
  return (
    <div
      className={cn(
        "glass relative aspect-4/5 w-full overflow-hidden rounded-4xl",
        className,
      )}
    >
      {PROFILE_IMAGE_SRC ? (
        <Image
          src={PROFILE_IMAGE_SRC}
          alt={`Portrait of ${name}`}
          fill
          priority
          sizes="(min-width: 1024px) 24rem, 60vw"
          className="object-cover"
        />
      ) : (
        <div
          role="img"
          aria-label={`Placeholder portrait for ${name}`}
          className="flex h-full w-full items-center justify-center"
        >
          <span
            aria-hidden="true"
            className="font-display text-7xl tracking-tight text-accent-text opacity-80 sm:text-8xl"
          >
            {getInitials(name)}
          </span>
        </div>
      )}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-3 rounded-3xl border border-line"
      />
    </div>
  );
}