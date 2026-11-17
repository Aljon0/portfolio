"use client";

import { Fragment, type ReactNode } from "react";
import { useTypewriter } from "@/hooks/useTypewriter";
import { contact } from "@/data/portfolio";
import { gmailComposeUrl } from "@/lib/contact";
import { Caret } from "./Caret";

/** Only links to these hosts (your portfolio's own demos and profiles) become clickable. */
const ALLOWED_HOSTS = ["github.com", "linkedin.com", "vercel.app", "onrender.com", "loom.com"];
const TOKEN = /(https?:\/\/\S+|[\w.+-]+@[\w-]+(?:\.[\w-]+)+)/g;
const TRAILING_PUNCTUATION = /[.,;:!?)\]]+$/;
const LINK_CLASS = "text-accent-text underline underline-offset-4 hover:text-fg";

function isAllowedUrl(raw: string): boolean {
  try {
    const url = new URL(raw);
    return (
      url.protocol === "https:" &&
      ALLOWED_HOSTS.some((host) => url.hostname === host || url.hostname.endsWith(`.${host}`))
    );
  } catch {
    return false;
  }
}

function linkify(text: string): ReactNode[] {
  return text.split(TOKEN).map((part, index) => {
    if (index % 2 === 0) return part;

    const trailing = part.match(TRAILING_PUNCTUATION)?.[0] ?? "";
    const core = trailing ? part.slice(0, -trailing.length) : part;

    if (core.toLowerCase() === contact.email.toLowerCase()) {
      return (
        <Fragment key={index}>
          <a
            href={gmailComposeUrl(core)}
            target="_blank"
            rel="noopener noreferrer"
            className={LINK_CLASS}
          >
            {core}
          </a>
          {trailing}
        </Fragment>
      );
    }

    if (isAllowedUrl(core)) {
      return (
        <Fragment key={index}>
          <a href={core} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
            {core}
          </a>
          {trailing}
        </Fragment>
      );
    }

    return part;
  });
}

interface AnswerTextProps {
  text: string;
  instant: boolean;
}

export function AnswerText({ text, instant }: AnswerTextProps) {
  const { typed, done, skip } = useTypewriter(text.length, instant);

  return (
    <div
      onClick={skip}
      // While typing the text is hidden from assistive tech (a status message announces the
      // answer). Once complete it is exposed, with its links.
      aria-hidden={!done}
      className="whitespace-pre-line wrap-break-words font-mono text-lg leading-relaxed text-fg sm:text-xl"
    >
      {done ? linkify(text) : text.slice(0, typed)}
      <Caret />
    </div>
  );
}