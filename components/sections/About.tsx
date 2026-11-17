import { ScrubWords } from "@/components/ui/ScrubWords";
import { Section } from "@/components/ui/Section";
import { highlights, profile } from "@/data/portfolio";

export function About() {
  return (
    <Section
      id="about"
      index="01"
      label="About"
      title="A product-first, full-cycle developer."
      className="lg:flex lg:min-h-svh lg:items-center"
    >
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-20">
        <div data-scrub className="space-y-5 text-lg text-muted">
          {profile.biography.map((paragraph) => (
            <p key={paragraph}>
              <ScrubWords text={paragraph} />
            </p>
          ))}
        </div>

        <ul data-reveal-children="fade-up" className="space-y-8">
          {highlights.map((item) => (
            <li key={item.title} className="border-l border-line-strong pl-5">
              <h3 className="font-display text-xl tracking-tight">{item.title}</h3>
              <p className="mt-2 text-muted">{item.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}