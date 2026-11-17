import { AnimationRoot } from "@/components/animation/AnimationRoot";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Hero } from "@/components/sections/Hero";
import { Journey } from "@/components/sections/Journey";
import { Projects } from "@/components/sections/Projects";
import { TechnicalUniverse } from "@/components/sections/TechnicalUniverse";

export default function HomePage() {
  return (
    <AnimationRoot>
      <Hero />
      <About />
      <Journey />
      <TechnicalUniverse />
      <Projects />
      <Contact />
    </AnimationRoot>
  );
}