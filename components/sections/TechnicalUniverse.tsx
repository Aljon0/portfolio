import { UniverseExplorer } from "@/components/sections/UniverseExplorer";
import { Section } from "@/components/ui/Section";

export function TechnicalUniverse() {
  return (
    <Section
      id="universe"
      index="03"
      label="Technical Universe"
      title="The technologies I build with."
      intro="Explore by group, or select a technology to see which of my projects use it."
    >
      <UniverseExplorer />
    </Section>
  );
}