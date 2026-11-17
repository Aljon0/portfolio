import { ArrowUpRight } from "lucide-react";
import type { AnchorHTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

interface TextLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  external?: boolean;
}

export function TextLink({
  external = false,
  className,
  children,
  ...rest
}: TextLinkProps) {
  const externalProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <a
      className={cn(
        "inline-flex items-center gap-1 text-sm text-accent-text underline-offset-4 hover:underline",
        className,
      )}
      {...externalProps}
      {...rest}
    >
      {children}
      {external ? (
        <>
          <ArrowUpRight size={14} aria-hidden="true" />
          <span className="sr-only"> (opens in a new tab)</span>
        </>
      ) : null}
    </a>
  );
}