import { buildBackgroundTransitions } from "./background";
import {
  MEDIA_QUERIES,
  MOBILE_DISTANCE_FACTOR,
  STAGGER_COLUMNS,
  STAGGER_STEP,
} from "./config";
import { gsap, ScrollTrigger } from "./gsap";
import { buildHeroTimeline, showHeroInstantly } from "./hero";
import { isRevealVariant, revealElement, revealWords } from "./presets";
import {
  buildAboutStory,
  buildHeroExit,
  buildJourneyProgress,
} from "./storytelling";

interface MotionConditions {
  motion?: boolean;
  reduce?: boolean;
  desktop?: boolean;
  pinned?: boolean;
}

function childElements(container: Element): HTMLElement[] {
  return Array.from(container.children).filter(
    (child): child is HTMLElement => child instanceof HTMLElement,
  );
}

/**
 * Builds every animation under `root`. Returns a cleanup function.
 * All tweens and ScrollTriggers are created inside gsap.matchMedia(), so
 * reverting it removes them, and they rebuild when a media query changes.
 */
export function setupAnimations(root: HTMLElement): () => void {
  const mm = gsap.matchMedia();
  let cancelled = false;

  mm.add(
    {
      motion: MEDIA_QUERIES.motion,
      reduce: MEDIA_QUERIES.reduce,
      desktop: MEDIA_QUERIES.desktop,
      pinned: MEDIA_QUERIES.pinned,
    },
    (context) => {
      const { motion, reduce, desktop, pinned } = (context.conditions ??
        {}) as MotionConditions;

      if (reduce || !motion) {
        showHeroInstantly(root);
        return;
      }

      const factor = desktop ? 1 : MOBILE_DISTANCE_FACTOR;

      // Storytelling triggers: top of the page to the bottom (pin first).
      buildHeroTimeline(root, desktop === true);
      buildHeroExit(root, factor);
      buildAboutStory(root, pinned === true);
      buildBackgroundTransitions(root);
      buildJourneyProgress(root);

      // One-shot reveals.
      root.querySelectorAll<HTMLElement>("[data-reveal]").forEach((el) => {
        const value = el.dataset.reveal;
        if (value === "words") {
          revealWords(el);
        } else {
          revealElement(el, isRevealVariant(value) ? value : "fade-up", { factor });
        }
      });

      root
        .querySelectorAll<HTMLElement>("[data-reveal-children]")
        .forEach((container) => {
          const value = container.dataset.revealChildren;
          const variant = isRevealVariant(value) ? value : "fade-up";
          childElements(container).forEach((child, index) => {
            revealElement(child, variant, {
              factor,
              delay: (index % STAGGER_COLUMNS) * STAGGER_STEP,
            });
          });
        });
    },
  );

  // Fonts can change layout after the first measure, so recalculate positions.
  if (document.fonts) {
    void document.fonts.ready.then(() => {
      if (cancelled) return;
      ScrollTrigger.refresh();
      // Pinned sections add page height after load, so jump to a #section link again.
      const id = window.location.hash.slice(1);
      if (id) {
        document.getElementById(id)?.scrollIntoView({ behavior: "instant", block: "start" });
      }
    });
  }

  return () => {
    cancelled = true;
    mm.revert();
  };
}