import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";
import { Container } from "./Container";
import { SectionLabel } from "./SectionLabel";
import { SplitWords } from "./SplitWords";

interface SectionProps {
  id: string;
  index: string;
  label: string;
  title: string;
  intro?: string;
  children: ReactNode;
  className?: string;
}

export function Section({
  id,
  index,
  label,
  title,
  intro,
  children,
  className,
}: SectionProps) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("border-t border-line py-20 sm:py-28 lg:py-32", className)}
    >
      <Container>
        <div data-reveal="fade-up">
          <SectionLabel index={index}>{label}</SectionLabel>
        </div>
        <h2
          id={`${id}-title`}
          data-reveal="words"
          className="mt-5 max-w-3xl text-balance font-display text-headline"
        >
          <SplitWords text={title} />
        </h2>
        {intro ? (
          <p data-reveal="fade-up" className="mt-5 max-w-2xl text-lg text-muted">
            {intro}
          </p>
        ) : null}
        <div className="mt-12 sm:mt-16">{children}</div>
      </Container>
    </section>
  );
}