"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-mono text-label text-accent-text">error</p>
      <h1 className="font-display text-headline">Something went wrong.</h1>
      <button
        type="button"
        onClick={reset}
        className="min-h-11 rounded-full border border-line-strong px-6 text-sm transition-colors hover:border-accent hover:text-accent-text"
      >
        Try again
      </button>
    </div>
  );
}