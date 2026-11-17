import type { AnchorHTMLAttributes, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

type Variant = "primary" | "ghost";
type Size = "md" | "lg";

interface StyleProps {
  variant?: Variant;
  size?: Size;
}

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium transition-[transform,background-color,border-color,color] duration-200 ease-out active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-on-accent hover:bg-accent-soft",
  ghost:
    "border border-line-strong text-fg hover:border-accent hover:text-accent-text",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-7 text-base",
};

function buttonStyles({ variant = "primary", size = "md" }: StyleProps, className?: string): string {
  return cn(base, variants[variant], sizes[size], className);
}

export function Button({
  variant,
  size,
  className,
  type = "button",
  ...rest
}: StyleProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button type={type} className={buttonStyles({ variant, size }, className)} {...rest} />;
}

export function ButtonLink({
  variant,
  size,
  className,
  ...rest
}: StyleProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a className={buttonStyles({ variant, size }, className)} {...rest} />;
}