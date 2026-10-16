import Link from "next/link";
import { Icon } from "./Icon";
import { LinkButtons } from "./LinkButtons";
import type { ProjectItem } from "@/lib/queries";

const KIND: Record<string, string> = { team: "팀", personal: "개인", assignment: "과제" };

export function ProjectCard({ p }: { p: ProjectItem }) {
  return (
    <article className="glow-card flex h-full flex-col">
      <div className="relative grid h-32 place-items-center overflow-hidden rounded-t-[inherit] bg-gradient-to-br from-primary/25 via-secondary/10 to-accent/20 text-5xl text-secondary sm:h-36">
        <Icon name={p.icon} />
        <span className="absolute right-3 top-3 rounded-full bg-canvas/70 px-2.5 py-1 text-[11px] font-semibold text-muted backdrop-blur">
          {KIND[p.kind] ?? p.kind}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        {p.badge && <span className="tag self-start">{p.badge}</span>}
        <h3 className="mt-3 font-display text-lg font-bold leading-snug">
          <Link href={`/projects/${p.slug}`} className="hover:text-accent hover:underline">
            {p.title}
          </Link>
        </h3>
        <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{p.summary}</p>
        {p.stack?.length > 0 && (
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="사용 기술">
            {p.stack.map((s) => (
              <li key={s} className="rounded-md bg-surface-2 px-2 py-0.5 font-mono text-[11px] text-muted">
                {s}
              </li>
            ))}
          </ul>
        )}
        <LinkButtons githubUrl={p.githubUrl} deployUrl={p.deployUrl} size="sm" className="mt-5" />
      </div>
    </article>
  );
}
