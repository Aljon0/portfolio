import { EASE, PIN_SCROLL_RATIO } from "./config";
import { gsap } from "./gsap";

/** Hero content fades and lifts while the hero scrolls away. */
export function buildHeroExit(root: ParentNode, factor: number): void {
  const hero = root.querySelector<HTMLElement>("#hero");
  // The first child of the hero section is its Container.
  const content = hero?.firstElementChild;
  if (!hero || !content) return;

  gsap.to(content, {
    opacity: 0.15,
    y: -80 * factor,
    ease: "none",
    scrollTrigger: {
      trigger: hero,
      start: "top top",
      end: "bottom 35%",
      scrub: true,
    },
  });
}

/**
 * The biography lights up word by word as you scroll, from the muted text color to the full
 * text color (so every word stays readable). Desktop: the About section is pinned while this
 * plays. Elsewhere: no pin; it plays while the text moves through the viewport.
 */
export function buildAboutStory(root: ParentNode, pinned: boolean): void {
  const about = root.querySelector<HTMLElement>("#about");
  if (!about) return;

  const bio = about.querySelector<HTMLElement>("[data-scrub]");
  if (!bio) return;

  const words = bio.querySelectorAll("[data-scrub-word]");
  if (words.length === 0) return;

  const to: gsap.TweenVars = {
    "--w": 1,
    ease: "none",
    duration: 1,
    stagger: 0.25,
  };

  if (pinned) {
    gsap.fromTo(
      words,
      { "--w": 0 },
      {
        ...to,
        scrollTrigger: {
          trigger: about,
          start: "top top",
          end: () => `+=${Math.round(window.innerHeight * PIN_SCROLL_RATIO)}`,
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      },
    );
    return;
  }

  gsap.fromTo(
    words,
    { "--w": 0 },
    {
      ...to,
      scrollTrigger: {
        trigger: bio,
        start: "top 80%",
        end: "bottom 45%",
        scrub: 0.6,
      },
    },
  );
}

/** Timeline progress line, plus dots that light up as their item is reached. */
export function buildJourneyProgress(root: ParentNode): void {
  const line = root.querySelector<HTMLElement>("[data-progress-line]");
  const wrapper = line?.parentElement;

  if (line && wrapper) {
    gsap.fromTo(
      line,
      { scaleY: 0 },
      {
        scaleY: 1,
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top 70%",
          end: "bottom 60%",
          scrub: true,
        },
      },
    );
  }

  root.querySelectorAll<HTMLElement>("[data-timeline-dot]").forEach((dot) => {
    const item = dot.closest("li");
    if (!item) return;

    gsap.fromTo(
      dot,
      { scale: 0.5, opacity: 0.3 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: EASE.out,
        scrollTrigger: {
          trigger: item,
          start: "top 65%",
          toggleActions: "play none none reverse",
        },
      },
    );
  });
}