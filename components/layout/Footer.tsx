import { Container } from "@/components/ui/Container";
import { contact } from "@/data/portfolio";
import { COPYRIGHT_YEAR, NAV_ITEMS, SITE } from "@/lib/constants";
import { gmailComposeUrl } from "@/lib/contact";

const linkClass =
  "inline-block py-1 text-muted transition-colors hover:text-fg";

export function Footer() {
  return (
    <footer className="border-t border-line pb-24 pt-12">
      <Container>
        <div className="grid gap-10 sm:grid-cols-[1.5fr_1fr_1fr]">
          <p className="font-display text-xl tracking-tight">
            {SITE.name}
            <span className="text-accent-text">.</span>
          </p>

          <nav aria-label="Footer">
            <ul className="text-sm">
              {NAV_ITEMS.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`} className={linkClass}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <ul className="text-sm">
            {contact.github ? (
              <li>
                <a
                  href={contact.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  GitHub
                </a>
              </li>
            ) : null}
            {contact.linkedIn ? (
              <li>
                <a
                  href={contact.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  LinkedIn
                </a>
              </li>
            ) : null}
            <li>
              <a
                href={gmailComposeUrl(contact.email)}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                Email
              </a>
            </li>
          </ul>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
          <p className="font-mono text-label text-muted">
            © {COPYRIGHT_YEAR} {SITE.name}
          </p>
        </div>
      </Container>
    </footer>
  );
}
