"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * 전역 화면 효과 (기존 global.js 이식)
 * - 스크롤 진행률 바
 * - .reveal 요소 스크롤 등장 (IntersectionObserver)
 * - .glow-card 마우스 추적 글로우 (마우스가 있는 기기에서만)
 */
export default function Effects() {
  const pathname = usePathname();

  // 페이지가 바뀔 때마다 새 .reveal 요소 관찰
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(".reveal:not([data-visible='true'])"));
    if (!("IntersectionObserver" in window)) {
      els.forEach((el) => (el.dataset.visible = "true"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e, i) => {
          if (!e.isIntersecting) return;
          const el = e.target as HTMLElement;
          setTimeout(() => (el.dataset.visible = "true"), i * 65);
          io.unobserve(el);
        });
      },
      { threshold: 0.08 },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);

  // 글로우 카드 + 진행률 바
  useEffect(() => {
    const bar = document.getElementById("page-progress");
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (bar) bar.style.transform = `scaleX(${total > 0 ? window.scrollY / total : 0})`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    let frame = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        document.querySelectorAll<HTMLElement>(".glow-card").forEach((card) => {
          const r = card.getBoundingClientRect();
          card.style.setProperty("--x", `${e.clientX - r.left}px`);
          card.style.setProperty("--y", `${e.clientY - r.top}px`);
        });
      });
    };
    if (canHover) document.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
