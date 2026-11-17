"use client";

import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useActiveSection } from "@/hooks/useActiveSection";
import { NAV_ITEMS, SECTION_IDS, SITE } from "@/lib/constants";
import { cn } from "@/lib/utils/cn";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const activeId = useActiveSection(SECTION_IDS);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-4">
      <nav
        aria-label="Primary"
        className="glass mx-auto flex max-w-5xl items-center justify-between rounded-full py-2 pl-5 pr-2 sm:pl-6"
      >
        <a href="#hero" className="font-display text-lg tracking-tight">
          {SITE.shortName}
          <span className="text-accent-text">.</span>
        </a>

        <ul className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = activeId === item.id;
            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "relative flex items-center gap-2 rounded-full px-3 py-1.5 text-sm transition-colors duration-200 after:absolute after:inset-x-3 after:-bottom-px after:h-px after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-300 hover:after:scale-x-100",
                    isActive ? "text-fg" : "text-muted hover:text-fg",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "h-1 w-1 rounded-full bg-accent transition-opacity duration-200",
                      isActive ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted transition-colors hover:bg-surface-2 hover:text-fg md:hidden"
          >
            {menuOpen ? (
              <X size={20} aria-hidden="true" />
            ) : (
              <Menu size={20} aria-hidden="true" />
            )}
          </button>
        </div>
      </nav>

      {menuOpen ? (
        <div
          id="mobile-menu"
          className="glass mx-auto mt-2 max-w-5xl rounded-3xl p-2 md:hidden"
        >
          <ul>
            {NAV_ITEMS.map((item) => {
              const isActive = activeId === item.id;
              return (
                <li key={item.id}>
                  <a
                    href={`#${item.id}`}
                    onClick={() => setMenuOpen(false)}
                    aria-current={isActive ? "location" : undefined}
                    className={cn(
                      "flex min-h-12 items-center justify-between rounded-2xl px-4 text-base transition-colors",
                      isActive ? "bg-surface-2 text-fg" : "text-muted hover:text-fg",
                    )}
                  >
                    {item.label}
                    {isActive ? (
                      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
                    ) : null}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}
    </header>
  );
}