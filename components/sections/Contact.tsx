import { Briefcase, Code, Download, MessageCircle, type LucideIcon } from "lucide-react";
import { EmailRow } from "@/components/ui/EmailRow";
import { Section } from "@/components/ui/Section";
import { contact } from "@/data/portfolio";

interface Channel {
  label: string;
  value: string;
  href: string;
  external: boolean;
  download?: boolean;
  Icon: LucideIcon;
}

function buildChannels(): Channel[] {
  const channels: Channel[] = [];

  if (contact.whatsappNumber) {
    channels.push({
      label: "WhatsApp",
      value: contact.phoneDisplay ?? contact.whatsappNumber,
      href: `https://wa.me/${contact.whatsappNumber}`,
      external: true,
      Icon: MessageCircle,
    });
  }
  if (contact.linkedIn) {
    channels.push({
      label: "LinkedIn",
      value: "linkedin.com/in/santiago-al-jon-b-31a478281",
      href: contact.linkedIn,
      external: true,
      Icon: Briefcase,
    });
  }
  if (contact.github) {
    channels.push({
      label: "GitHub",
      value: "github.com/Aljon0",
      href: contact.github,
      external: true,
      Icon: Code,
    });
  }
  if (contact.resumeUrl) {
    channels.push({
      label: "Resume",
      value: "Download CV (PDF)",
      href: contact.resumeUrl,
      external: false,
      download: true,
      Icon: Download,
    });
  }
  return channels;
}

export function Contact() {
  const channels = buildChannels();

  return (
    <Section
      id="contact"
      index="05"
      label="Contact"
      title="Have a project or idea in mind?"
      intro="Reach out directly through any of the channels below."
    >
      <ul
        data-reveal-children="fade-up"
        className="max-w-2xl divide-y divide-line border-y border-line"
      >
        <EmailRow />
        {channels.map(({ label, value, href, external, download, Icon }) => (
          <li key={label}>
            <a
              href={href}
              {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              {...(download ? { download: true } : {})}
              className="group flex min-h-14 flex-wrap items-center gap-x-4 gap-y-1 py-5 transition-colors hover:text-accent-text"
            >
              <Icon
                size={20}
                aria-hidden="true"
                className="text-muted group-hover:text-accent-text"
              />
              <span className="font-mono text-label text-muted">{label}</span>
              <span className="w-full break-all pl-9 text-sm sm:ml-auto sm:w-auto sm:pl-0 sm:text-right sm:text-base">
                {value}
              </span>
              {external ? <span className="sr-only"> (opens in a new tab)</span> : null}
            </a>
          </li>
        ))}
      </ul>
    </Section>
  );
}