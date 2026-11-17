import {
    siDocker,
    siExpress,
    siFirebase,
    siHuggingface,
    siJavascript,
    siLangchain,
    siMake,
    siMistralai,
    siN8n,
    siNextdotjs,
    siNodedotjs,
    siPostgresql,
    siPython,
    siReact,
    siReplit,
    siStripe,
    siSupabase,
    siTailwindcss,
    siTypescript,
    siVite,
    siZapier,
  } from "simple-icons";
  import { techKey } from "./relations";
  
  /** SVG path data (24x24 viewBox) by normalized technology name. */
  const ICON_PATHS: Readonly<Record<string, string>> = {
    next: siNextdotjs.path,
    "next api routes": siNextdotjs.path,
    react: siReact.path,
    typescript: siTypescript.path,
    javascript: siJavascript.path,
    "tailwind css": siTailwindcss.path,
    vite: siVite.path,
    node: siNodedotjs.path,
    express: siExpress.path,
    python: siPython.path,
    postgresql: siPostgresql.path,
    supabase: siSupabase.path,
    firebase: siFirebase.path,
    "mistral ai": siMistralai.path,
    "hugging face inference api": siHuggingface.path,
    langchain: siLangchain.path,
    n8n: siN8n.path,
    "make.com": siMake.path,
    zapier: siZapier.path,
    replit: siReplit.path,
    docker: siDocker.path,
    stripe: siStripe.path,
  };
  
  /** Returns a logo path for the technology, or null when no logo is available. */
  export function iconPathFor(label: string): string | null {
    return ICON_PATHS[techKey(label)] ?? null;
  }