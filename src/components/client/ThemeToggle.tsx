"use client";

import { useSyncExternalStore } from "react";
import { FaMoon, FaSun } from "react-icons/fa6";

type Theme = "dark" | "light";

const listeners = new Set<() => void>();
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
const getTheme = (): Theme => (document.documentElement.dataset.theme === "light" ? "light" : "dark");

function setTheme(t: Theme) {
  document.documentElement.dataset.theme = t;
  try {
    localStorage.setItem("site_theme", t); // 기존 사이트와 같은 키
  } catch {}
  listeners.forEach((l) => l());
}

/** 다크/라이트 전환 버튼. 첫 페인트 전 테마 적용은 layout.tsx 인라인 스크립트가 담당 */
export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => "dark" as Theme);
  const next = theme === "dark" ? "light" : "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(next)}
      className="grid size-11 place-items-center rounded-full text-lg text-muted transition hover:bg-surface-2 hover:text-gold"
      aria-label={next === "light" ? "라이트 모드로 전환" : "다크 모드로 전환"}
      title="테마 전환"
    >
      {theme === "dark" ? <FaSun /> : <FaMoon />}
    </button>
  );
}
