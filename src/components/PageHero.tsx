import type { ReactNode } from "react";

/** 서브 페이지 상단 제목 영역 */
export function PageHero({ label, title, accent, desc }: { label: string; title: string; accent: string; desc?: ReactNode }) {
  return (
    <header className="animate-fade-up py-10 text-center sm:py-16">
      <p className="section-label justify-center">{label}</p>
      <h1 className="mt-4 font-display text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
        {title} <span className="accent-text">{accent}</span>
      </h1>
      {desc && <p className="mx-auto mt-5 max-w-2xl text-base text-muted sm:text-lg">{desc}</p>}
    </header>
  );
}

export function SectionHeading({ label, title, accent, className = "" }: { label: string; title: string; accent: string; className?: string }) {
  return (
    <div className={className}>
      <p className="section-label">{label}</p>
      <h2 className="section-title mt-3">
        {title} <span>{accent}</span>
      </h2>
    </div>
  );
}
