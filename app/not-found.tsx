import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[70svh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="font-mono text-label text-accent-text">404</p>
      <h1 className="font-display text-headline">This page doesn&apos;t exist.</h1>
      <Link href="/" className="text-accent-text underline underline-offset-4 hover:text-fg">
        Back to the portfolio
      </Link>
    </div>
  );
}