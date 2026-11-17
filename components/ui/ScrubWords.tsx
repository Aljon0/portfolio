import { Fragment } from "react";

export function ScrubWords({ text }: { text: string }) {
  const words = text.split(" ");

  return (
    <>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span data-scrub-word>{word}</span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}