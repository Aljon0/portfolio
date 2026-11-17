import { ArrowDown, Download, MapPin } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionLabel } from "@/components/ui/SectionLabel";
import { SplitWords } from "@/components/ui/SplitWords";
import { contact, profile } from "@/data/portfolio";

export function Hero() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative flex min-h-svh items-center pb-24 pt-28 sm:pt-32"
    >
      <Container className="grid items-center gap-10 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
        <div>
          <div data-hero="label">
            <SectionLabel>{profile.titles[0]}</SectionLabel>
          </div>
          <h1
            id="hero-title"
            data-hero="title"
            className="mt-6 text-balance font-display text-display"
          >
            <SplitWords text={profile.name} />
          </h1>
          <p data-hero="text" className="mt-6 max-w-xl text-lg text-muted">
            {profile.tagline}
          </p>

          <div data-hero="actions" className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="#projects" size="lg">
              View projects
            </ButtonLink>
            <ButtonLink href="#contact" variant="ghost" size="lg">
              Get in touch
            </ButtonLink>
            {contact.resumeUrl ? (
              <ButtonLink href={contact.resumeUrl} download variant="ghost" size="lg">
                <Download size={18} aria-hidden="true" />
                Download CV
              </ButtonLink>
            ) : null}
          </div>

          <p
            data-hero="meta"
            className="mt-10 flex items-center gap-2 font-mono text-label text-muted"
          >
            <MapPin size={14} aria-hidden="true" />
            {profile.location}
          </p>
        </div>

        <div className="flex justify-start lg:justify-end">
          <div
            data-hero="media"
            className="w-full max-w-52 sm:max-w-xs lg:max-w-sm"
          >
            <Avatar name={profile.name} />
          </div>
        </div>
      </Container>

      <a
        href="#about"
        data-hero="scroll"
        aria-label="Scroll to the about section"
        className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 text-muted transition-colors hover:text-fg sm:block"
      >
        <ArrowDown size={20} aria-hidden="true" />
      </a>
    </section>
  );
}