"use client";

import { Check, Copy, Mail } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { contact } from "@/data/portfolio";
import { gmailComposeUrl, mailtoUrl } from "@/lib/contact";

const smallButtonClass =
  "inline-flex min-h-10 items-center gap-2 rounded-full border border-line px-4 text-sm text-muted transition-colors hover:border-accent hover:text-accent-text";

export function EmailRow() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  async function copyAddress() {
    try {
      await navigator.clipboard.writeText(contact.email);
    } catch {
      // Clipboard access can be blocked (for example on plain http). Show the address instead.
      window.prompt("Copy this email address:", contact.email);
      return;
    }
    setCopied(true);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setCopied(false), 2000);
  }

  return (
    <li>
      <div className="flex min-h-14 flex-wrap items-center gap-x-4 gap-y-3 py-5">
        <a
          href={gmailComposeUrl(contact.email)}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex min-w-0 flex-1 flex-wrap items-center gap-x-4 gap-y-1 transition-colors hover:text-accent-text"
        >
          <Mail
            size={20}
            aria-hidden="true"
            className="text-muted group-hover:text-accent-text"
          />
          <span className="font-mono text-label text-muted">Email</span>
          <span className="w-full break-all pl-9 text-sm sm:ml-auto sm:w-auto sm:pl-0 sm:text-right sm:text-base">
            {contact.email}
          </span>
          <span className="sr-only"> (opens Gmail in a new tab)</span>
        </a>

        <div className="flex w-full gap-2 pl-9 sm:w-auto sm:pl-0">
          <a href={mailtoUrl(contact.email)} className={smallButtonClass}>
            Mail app
          </a>
          <button type="button" onClick={copyAddress} className={smallButtonClass}>
            {copied ? (
              <Check size={16} aria-hidden="true" />
            ) : (
              <Copy size={16} aria-hidden="true" />
            )}
            {copied ? "Copied" : "Copy"}
          </button>
          <span role="status" className="sr-only">
            {copied ? "Email address copied" : ""}
          </span>
        </div>
      </div>
    </li>
  );
}