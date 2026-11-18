import { Fragment } from "react";

/** --w goes from 0 (muted text color) to 1 (full text color). It defaults to 1 when unset. */
const WORD_STYLE = {
  color: "color-mix(in srgb, var(--fg) calc(var(--w, 1) * 100%), var(--muted))",
} as const;

export function ScrubWords({ text }: { text: string }) {
  const words = text.split(" ");

  return (
    <>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span data-scrub-word style={WORD_STYLE}>
            {word}
          </span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}