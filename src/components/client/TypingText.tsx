"use client";

import { useEffect, useState } from "react";

/** 단어를 차례로 타이핑/삭제하는 효과 (기존 initTyping 이식) */
export default function TypingText({ words }: { words: string[] }) {
  const [text, setText] = useState("");

  useEffect(() => {
    if (!words.length) return;
    let wi = 0;
    let ci = 0;
    let del = false;
    let t: ReturnType<typeof setTimeout>;
    const tick = () => {
      const word = words[wi];
      if (!del) {
        ci++;
        setText(word.slice(0, ci));
        if (ci === word.length) {
          del = true;
          t = setTimeout(tick, 1600);
          return;
        }
      } else {
        ci--;
        setText(word.slice(0, ci));
        if (ci === 0) {
          del = false;
          wi = (wi + 1) % words.length;
        }
      }
      t = setTimeout(tick, del ? 50 : 90);
    };
    tick();
    return () => clearTimeout(t);
  }, [words]);

  return (
    <span className="font-mono text-secondary" aria-label={words.join(", ")}>
      <span aria-hidden>{text}</span>
      <span aria-hidden className="ml-0.5 inline-block h-[1.1em] w-[2px] translate-y-[3px] animate-blink bg-secondary" />
    </span>
  );
}
