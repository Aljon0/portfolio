import type { ReactNode } from "react";
import {
  certifications,
  contact,
  education,
  experience,
  profile,
  skillCategories,
} from "@/data/portfolio";
import { projects } from "@/data/projects";
import { gmailComposeUrl } from "@/lib/contact";

export type CommandName =
  | "help"
  | "about"
  | "skills"
  | "projects"
  | "experience"
  | "education"
  | "certifications"
  | "resume"
  | "contact"
  | "clear";

export type OutputCommandName = Exclude<CommandName, "clear">;

const OUTPUT_NAMES: readonly OutputCommandName[] = [
  "help",
  "about",
  "skills",
  "projects",
  "experience",
  "education",
  "certifications",
  "resume",
  "contact",
];

interface CommandInfo {
  name: CommandName;
  description: string;
}

const ALL_COMMANDS: readonly CommandInfo[] = [
  { name: "help", description: "show this list" },
  { name: "about", description: "who I am" },
  { name: "skills", description: "technologies by area" },
  { name: "projects", description: "my main projects and demos" },
  { name: "experience", description: "work history" },
  { name: "education", description: "where I studied" },
  { name: "certifications", description: "certificates" },
  { name: "resume", description: "download my CV" },
  { name: "contact", description: "how to reach me" },
  { name: "clear", description: "clear the screen" },
];

/** Commands shown in help and as chips. "resume" appears only when a CV is configured. */
export const COMMAND_LIST: readonly CommandInfo[] = ALL_COMMANDS.filter(
  (command) => command.name !== "resume" || contact.resumeUrl !== undefined,
);

const linkClass = "text-accent-text underline underline-offset-4 hover:text-fg";

function ExtLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
      {children}
    </a>
  );
}

function Heading({ children }: { children: ReactNode }) {
  return <p className="text-accent-text">{children}</p>;
}

const OUTPUTS: Record<OutputCommandName, () => ReactNode> = {
  help: () => (
    <div>
      <Heading>available commands</Heading>
      <ul className="mt-1 space-y-0.5">
        {COMMAND_LIST.map((command) => (
          <li key={command.name}>
            <span className="inline-block w-36 text-fg">{command.name}</span>
            {command.description}
          </li>
        ))}
      </ul>
    </div>
  ),

  about: () => (
    <div className="space-y-2">
      <p className="text-fg">
        {profile.name} · {profile.titles[0]}
      </p>
      <p>{profile.location}</p>
      <p>{profile.tagline}</p>
      {profile.biography.map((paragraph) => (
        <p key={paragraph}>{paragraph}</p>
      ))}
    </div>
  ),

  skills: () => (
    <div className="space-y-2">
      {skillCategories.map((group) => (
        <div key={group.id}>
          <Heading>{group.label}</Heading>
          <p>{group.items.join(", ")}</p>
        </div>
      ))}
    </div>
  ),

  projects: () => (
    <ol className="space-y-3">
      {projects.map((project, index) => (
        <li key={project.id}>
          <p className="text-fg">
            {index + 1}. {project.title} <span className="text-muted">· {project.category}</span>
          </p>
          <p>{project.overview}</p>
          {project.liveUrl ? <ExtLink href={project.liveUrl}>live demo</ExtLink> : null}
        </li>
      ))}
    </ol>
  ),

  experience: () => (
    <div className="space-y-3">
      {experience.map((item) => (
        <div key={item.id}>
          <p className="text-fg">{item.role}</p>
          <p>
            {item.organization} · {item.startDate} – {item.endDate}
          </p>
          <ul className="mt-1 list-disc space-y-0.5 pl-5">
            {item.highlights.map((highlight) => (
              <li key={highlight}>{highlight}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  ),

  education: () => (
    <div className="space-y-2">
      {education.map((item) => (
        <div key={item.id}>
          <p className="text-fg">{item.degree}</p>
          <p>
            {item.school}, {item.location}
          </p>
          <p className="text-accent-text">{item.period}</p>
        </div>
      ))}
    </div>
  ),

  certifications: () => (
    <div className="space-y-2">
      {certifications
        .filter((item) => item.verified)
        .map((item) => (
          <div key={item.id}>
            <p className="text-fg">{item.title}</p>
            <p>
              {item.issuer}, {item.year}
            </p>
            {item.image ? <ExtLink href={item.image}>view certificate</ExtLink> : null}
          </div>
        ))}
    </div>
  ),

  resume: () =>
    contact.resumeUrl ? (
      <p>
        <a href={contact.resumeUrl} download className={linkClass}>
          download CV (PDF)
        </a>
      </p>
    ) : (
      <p>my CV isn&apos;t available here yet.</p>
    ),

  contact: () => (
    <ul className="space-y-1">
      <li>
        <span className="inline-block w-24 text-fg">email</span>
        <ExtLink href={gmailComposeUrl(contact.email)}>{contact.email}</ExtLink>
      </li>
      {contact.whatsappNumber ? (
        <li>
          <span className="inline-block w-24 text-fg">whatsapp</span>
          <ExtLink href={`https://wa.me/${contact.whatsappNumber}`}>
            {contact.phoneDisplay ?? contact.whatsappNumber}
          </ExtLink>
        </li>
      ) : null}
      {contact.linkedIn ? (
        <li>
          <span className="inline-block w-24 text-fg">linkedin</span>
          <ExtLink href={contact.linkedIn}>open profile</ExtLink>
        </li>
      ) : null}
      {contact.github ? (
        <li>
          <span className="inline-block w-24 text-fg">github</span>
          <ExtLink href={contact.github}>open profile</ExtLink>
        </li>
      ) : null}
    </ul>
  ),
};

export const WELCOME: ReactNode = (
  <div className="space-y-1">
    <p className="text-fg">portfolio console</p>
    <p>
      type <span className="text-accent-text">help</span> to see what you can run. this is a
      simulated console: only the listed commands exist, and nothing you type is executed.
    </p>
  </div>
);

export function UnknownCommand({ text }: { text: string }) {
  return (
    <p>
      command not available: <span className="text-fg">{text}</span>. type{" "}
      <span className="text-accent-text">help</span> to see the commands.
    </p>
  );
}

export type ParsedCommand =
  | { kind: "empty" }
  | { kind: "clear" }
  | { kind: "command"; name: OutputCommandName }
  | { kind: "unknown"; text: string };

function isOutputCommand(value: string): value is OutputCommandName {
  return OUTPUT_NAMES.some((name) => name === value);
}

/** Only the first word is considered, and only if it is exactly one of the allowed names. */
export function parseCommand(input: string): ParsedCommand {
  const text = input.trim();
  if (text.length === 0) return { kind: "empty" };

  const word = (text.split(/\s+/)[0] ?? "").toLowerCase();
  if (word === "clear") return { kind: "clear" };
  if (isOutputCommand(word)) return { kind: "command", name: word };
  return { kind: "unknown", text: text.slice(0, 40) };
}

export function outputFor(name: OutputCommandName): ReactNode {
  return OUTPUTS[name]();
}

/** Completes a partial command name when exactly one command matches. */
export function autocomplete(input: string): string | null {
  const word = input.trim().toLowerCase();
  if (word.length === 0 || /\s/.test(word)) return null;

  const matches = COMMAND_LIST.filter((command) => command.name.startsWith(word));
  return matches.length === 1 ? (matches[0]?.name ?? null) : null;
}