export type Placement = "below" | "right" | "left" | "above";

export interface TourStep {
  id: string;
  /** CSS selector of the thing to point at. Steps whose target isn't visible are skipped. */
  selector: string;
  message: string;
  /** Where the speech bubble sits relative to the cursor. */
  placement: Placement;
  /** "start" points near the left edge of a large element instead of its center. */
  anchor?: "center" | "start";
  /** Draw a highlight ring around the target (default true). */
  ring?: boolean;
}

export const SEEN_KEY = "portfolio-tour-seen";
export const TOUR_EVENT = "portfolio:start-tour";

export const TOUR_STEPS: readonly TourStep[] = [
  {
    id: "welcome",
    selector: "#hero-title",
    message: "Hi! I'm Al-jon. Welcome to my portfolio. Let me show you around.",
    placement: "right",
    anchor: "start",
    ring: false,
  },
  {
    id: "about",
    selector: 'nav[aria-label="Primary"] a[href="#about"]',
    message: "About: who I am and how I like to work.",
    placement: "below",
  },
  {
    id: "journey",
    selector: 'nav[aria-label="Primary"] a[href="#journey"]',
    message: "Journey: my experience, education, certificate, and kind words from clients.",
    placement: "below",
  },
  {
    id: "universe",
    selector: 'nav[aria-label="Primary"] a[href="#universe"]',
    message: "Universe: my tech stack. Pick a group and watch it open up.",
    placement: "below",
  },
  {
    id: "projects",
    selector: 'nav[aria-label="Primary"] a[href="#projects"]',
    message: "Projects: my main work. Open one to see the full story.",
    placement: "below",
  },
  {
    id: "contact",
    selector: 'nav[aria-label="Primary"] a[href="#contact"]',
    message: "Contact: email, WhatsApp, LinkedIn, GitHub and my CV, all in one place.",
    placement: "below",
  },
  {
    id: "menu",
    selector: 'button[aria-controls="mobile-menu"]',
    message: "Tap here to jump between my sections.",
    placement: "below",
  },
  {
    id: "cv",
    selector: "#hero a[download]",
    message: "Short on time? My CV is one click away.",
    placement: "below",
  },
  {
    id: "theme",
    selector: 'button[aria-label^="Switch to"]',
    message: "Prefer light or dark? Switch the theme here and watch it ripple across the page.",
    placement: "below",
  },
  {
    id: "assistant",
    selector: 'button[aria-controls="assistant-overlay"]',
    message:
      "Ask me anything. This assistant answers from my real portfolio. Press / to open it.",
    placement: "right",
  },
  {
    id: "console",
    selector: 'button[aria-controls="developer-console"]',
    message: "Feeling techy? Open the console and type help. Press ` to toggle it.",
    placement: "right",
  },
  {
    id: "finish",
    selector: '#hero a[href="#projects"]',
    message: "That's the tour. Enjoy exploring, and say hi if you like what you see!",
    placement: "below",
  },
];

function isVisible(element: Element): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.width > 0 &&
    rect.height > 0 &&
    rect.bottom > 0 &&
    rect.top < window.innerHeight &&
    rect.right > 0 &&
    rect.left < window.innerWidth
  );
}

/** The steps whose target exists and is on screen right now (differs on phones). */
export function resolveSteps(): TourStep[] {
  return TOUR_STEPS.filter((step) => {
    const target = document.querySelector(step.selector);
    return target !== null && isVisible(target);
  });
}