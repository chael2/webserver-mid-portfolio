import Link from "next/link";
import { Icon } from "./Icon";
import { LinkButtons } from "./LinkButtons";
import type { ProjectItem } from "@/lib/queries";

const KIND: Record<string, string> = { team: "팀", personal: "개인", assignment: "과제" };

export function ProjectCard({ p }: { p: ProjectItem }) {
  return (
    <article className="glow-card flex h-full flex-col p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <span className="icon-box">
          <Icon name={p.icon} />
        </span>
        <span className="font-mono text-[11px] text-muted">
          {p.badge ? `${p.badge} · ` : ""}
          {KIND[p.kind] ?? p.kind}
        </span>
      </div>
      <h3 className="mt-5 text-lg font-semibold leading-snug break-keep">
        <Link href={`/projects/${p.slug}`} className="hover:text-secondary">
          {p.title}
        </Link>
      </h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted">{p.summary}</p>
      {p.stack?.length > 0 && <p className="mt-4 font-mono text-[11px] text-muted">{p.stack.join(" · ")}</p>}
      <LinkButtons githubUrl={p.githubUrl} deployUrl={p.deployUrl} size="sm" className="mt-4" />
    </article>
  );
}
