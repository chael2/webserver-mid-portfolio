"use client";

import { useState } from "react";
import type { ProjectItem } from "@/lib/queries";
import { ProjectCard } from "../ProjectCard";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "web", label: "Web" },
  { key: "security", label: "Security" },
  { key: "hardware", label: "Hardware" },
  { key: "study", label: "Study" },
] as const;

/** 카테고리 탭 필터 (기존 projects.html filter-bar 이식) */
export default function ProjectFilter({ projects }: { projects: ProjectItem[] }) {
  const [filter, setFilter] = useState<(typeof FILTERS)[number]["key"]>("all");
  const visible = filter === "all" ? projects : projects.filter((p) => p.category === filter);
  const available = FILTERS.filter((f) => f.key === "all" || projects.some((p) => p.category === f.key));

  return (
    <>
      <div className="-mx-4 mb-8 flex gap-2 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:px-0" role="tablist" aria-label="프로젝트 분류">
        {available.map((f) => (
          <button
            key={f.key}
            type="button"
            role="tab"
            aria-selected={filter === f.key}
            onClick={() => setFilter(f.key)}
            className={`min-h-11 shrink-0 rounded-full border px-5 text-sm font-semibold transition ${
              filter === f.key
                ? "border-secondary bg-primary/20 text-secondary shadow-neon"
                : "border-line bg-surface text-muted hover:border-secondary hover:text-ink"
            }`}
          >
            {f.label}
            <span className="ml-1.5 text-xs opacity-70">
              {f.key === "all" ? projects.length : projects.filter((p) => p.category === f.key).length}
            </span>
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((p) => (
          <ProjectCard key={p.id} p={p} />
        ))}
      </div>
    </>
  );
}
