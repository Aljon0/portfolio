import { Fragment } from "react";

export function SplitWords({ text }: { text: string }) {
  const words = text.split(" ");

  return (
    <>
      {words.map((word, index) => (
        <Fragment key={`${word}-${index}`}>
          <span className="mx-[-0.05em] mb-[-0.14em] inline-block overflow-hidden px-[0.05em] pb-[0.14em] align-top">
            <span data-word className="inline-block">
              {word}
            </span>
          </span>
          {index < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}