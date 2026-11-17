import { ProjectShowcase } from "@/components/sections/ProjectShowcase";
import { Section } from "@/components/ui/Section";

export function Projects() {
  return (
    <Section
      id="projects"
      index="04"
      label="Selected Projects"
      title="Things I've built."
      intro="Drag, swipe or use the arrows to browse my main projects. Select the front one to see the full story."
    >
      <ProjectShowcase />
    </Section>
  );
}