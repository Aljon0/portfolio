export interface NavItem {
  id: string;
  label: string;
}

export const SITE = {
  name: "Al-jon Santiago",
  shortName: "AS",
} as const;

/** Set to e.g. "/images/profile.jpg" after adding the file to public/images. */
export const PROFILE_IMAGE_SRC: string | "/images/profile.jpg" = "/images/profile.jpg";

export const COPYRIGHT_YEAR = 2026;

export const NAV_ITEMS: readonly NavItem[] = [
  { id: "about", label: "About" },
  { id: "journey", label: "Journey" },
  { id: "universe", label: "Universe" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
];

/** Observed for active-section tracking. "hero" is not a nav link. */
export const SECTION_IDS: readonly string[] = [
  "hero",
  ...NAV_ITEMS.map((item) => item.id),
];