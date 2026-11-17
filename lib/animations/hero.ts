import { DURATION, EASE } from "./config";
import { gsap } from "./gsap";

function heroPart(hero: ParentNode, name: string): HTMLElement | null {
  return hero.querySelector<HTMLElement>(`[data-hero="${name}"]`);
}

/** Used for reduced motion: makes sure nothing stays hidden by the pre-hide CSS. */
export function showHeroInstantly(root: ParentNode): void {
  gsap.set(root.querySelectorAll("[data-hero]"), { opacity: 1 });
  gsap.set(root.querySelectorAll("[data-hero] [data-word]"), { opacity: 1 });
}

export function buildHeroTimeline(root: ParentNode, withParallax: boolean): void {
  const hero = root.querySelector<HTMLElement>("#hero");
  if (!hero) return;

  const label = heroPart(hero, "label");
  const text = heroPart(hero, "text");
  const actions = heroPart(hero, "actions");
  const meta = heroPart(hero, "meta");
  const media = heroPart(hero, "media");
  const scroll = heroPart(hero, "scroll");
  const words = hero.querySelectorAll('[data-hero="title"] [data-word]');

  const tl = gsap.timeline({ defaults: { ease: EASE.out }, delay: 0.1 });

  if (label) {
    tl.fromTo(
      label,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: DURATION.fast },
    );
  }

  if (words.length > 0) {
    tl.fromTo(
      words,
      { yPercent: 105, opacity: 1 },
      { yPercent: 0, opacity: 1, duration: 1, stagger: 0.09, ease: EASE.expo },
      "-=0.3",
    );
  }

  if (text) {
    tl.fromTo(
      text,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: DURATION.base },
      "-=0.6",
    );
  }

  if (actions) {
    tl.fromTo(
      actions,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: DURATION.base },
      "-=0.55",
    );
  }

  if (meta) {
    tl.fromTo(
      meta,
      { opacity: 0 },
      { opacity: 1, duration: DURATION.base },
      "-=0.5",
    );
  }

  if (media) {
    tl.fromTo(
      media,
      { opacity: 0, clipPath: "inset(100% 0% 0% 0%)" },
      {
        opacity: 1,
        clipPath: "inset(0% 0% 0% 0%)",
        duration: 1.1,
        ease: EASE.expo,
        clearProps: "clipPath",
      },
      0.25,
    );
  }

  if (scroll) {
    tl.fromTo(
      scroll,
      { opacity: 0 },
      { opacity: 1, duration: DURATION.base },
      "-=0.4",
    );
  }

  if (withParallax && media) {
    gsap.to(media, {
      yPercent: -6,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: "bottom top",
        scrub: true,
      },
    });
  }
}