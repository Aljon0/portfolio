import { gsap } from "./gsap";

interface GlowState {
  id: string;
  xPercent: number;
  yPercent: number;
  scale: number;
  opacity: number;
}

/** The first state is the CSS resting position (see .bg-glow in globals.css). */
const GLOW_STATES: readonly GlowState[] = [
  { id: "hero", xPercent: 0, yPercent: 0, scale: 1, opacity: 1 },
  { id: "about", xPercent: -85, yPercent: 35, scale: 0.9, opacity: 0.75 },
  { id: "journey", xPercent: -20, yPercent: 70, scale: 1.1, opacity: 0.65 },
  { id: "universe", xPercent: -55, yPercent: 20, scale: 1.35, opacity: 1 },
  { id: "projects", xPercent: -10, yPercent: 50, scale: 1, opacity: 0.6 },
  { id: "contact", xPercent: -50, yPercent: 0, scale: 1.2, opacity: 0.9 },
];

function varsOf(state: GlowState): gsap.TweenVars {
  return {
    xPercent: state.xPercent,
    yPercent: state.yPercent,
    scale: state.scale,
    opacity: state.opacity,
  };
}

export function buildBackgroundTransitions(root: ParentNode): void {
  const glow = root.querySelector<HTMLElement>("[data-bg-glow]");
  if (!glow) return;

  for (let i = 1; i < GLOW_STATES.length; i += 1) {
    const previous = GLOW_STATES[i - 1];
    const next = GLOW_STATES[i];
    if (!previous || !next) continue;

    const section = root.querySelector<HTMLElement>(`#${next.id}`);
    if (!section) continue;

    gsap.fromTo(glow, varsOf(previous), {
      ...varsOf(next),
      ease: "none",
      immediateRender: false,
      scrollTrigger: {
        trigger: section,
        start: "top bottom",
        end: "top 25%",
        scrub: 0.8,
      },
    });
  }
}