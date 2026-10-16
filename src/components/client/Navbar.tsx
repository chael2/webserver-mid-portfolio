"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { FaBars, FaXmark } from "react-icons/fa6";
import ThemeToggle from "./ThemeToggle";

const NAV = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/github", label: "GitHub" },
  { href: "/projects", label: "Projects" },
  { href: "/team", label: "Team" },
  { href: "/security", label: "Security" },
  { href: "/guestbook", label: "Guestbook" },
];

export default function Navbar({ handle }: { handle: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // 메뉴가 열려 있을 때 배경 스크롤 잠금 + Esc로 닫기
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <>
      <nav
        className={`fixed inset-x-3 z-50 mx-auto flex max-w-6xl items-center justify-between rounded-2xl border px-4 backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 sm:inset-x-6 sm:px-6 ${
          scrolled
            ? "top-2 h-14 border-line bg-surface-strong shadow-card"
            : "top-4 h-16 border-transparent bg-transparent"
        }`}
        aria-label="주요 메뉴"
      >
        <Link href="/" className="logo" onClick={() => setOpen(false)}>
          {handle}
        </Link>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV.map((n) => (
            <li key={n.href}>
              <Link
                href={n.href}
                aria-current={isActive(n.href) ? "page" : undefined}
                className={`rounded-full px-3.5 py-2 text-sm font-medium transition ${
                  isActive(n.href)
                    ? "bg-surface-2 text-ink"
                    : "text-muted hover:bg-surface-2 hover:text-ink"
                }`}
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full text-xl text-ink lg:hidden"
            aria-label={open ? "메뉴 닫기" : "메뉴 열기"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <FaXmark /> : <FaBars />}
          </button>
        </div>
      </nav>

      {/* 모바일 전체 화면 메뉴 */}
      <div
        id="mobile-menu"
        className={`fixed inset-0 z-40 flex flex-col items-center justify-center gap-2 bg-canvas/95 backdrop-blur-xl transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
      >
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            tabIndex={open ? 0 : -1}
            onClick={() => setOpen(false)}
            className={`w-64 rounded-2xl px-6 py-3 text-center text-2xl font-semibold transition ${
              isActive(n.href) ? "text-secondary" : "text-ink hover:text-secondary"
            }`}
          >
            {n.label}
          </Link>
        ))}
      </div>
    </>
  );
}
