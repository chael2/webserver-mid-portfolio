import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FaArrowLeft } from "react-icons/fa6";
import { Icon } from "@/components/Icon";
import { LinkButtons } from "@/components/LinkButtons";
import { getProjects } from "@/lib/queries";

const KIND: Record<string, string> = { team: "팀 프로젝트", personal: "개인 프로젝트", assignment: "강의 과제" };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map((p) => ({ slug: p.slug }));
}

async function getProject(slug: string) {
  return (await getProjects()).find((p) => p.slug === slug);
}

export async function generateMetadata({ params }: PageProps<"/projects/[slug]">): Promise<Metadata> {
  const p = await getProject((await params).slug);
  return p ? { title: p.title, description: p.summary } : { title: "Project" };
}

export default async function ProjectDetailPage({ params }: PageProps<"/projects/[slug]">) {
  const p = await getProject((await params).slug);
  if (!p) notFound();

  const hasRole = Boolean(p.role || p.contributions?.length);
  const troubles = p.troubleshooting?.filter((t) => t.problem) ?? [];

  return (
    <article className="mx-auto max-w-4xl py-6 sm:py-10">
      <Link href="/projects" className="inline-flex min-h-11 items-center gap-2 text-sm text-muted hover:text-accent">
        <FaArrowLeft aria-hidden /> 프로젝트 목록
      </Link>

      <header className="mt-4 flex flex-col gap-5 sm:flex-row sm:items-start">
        <div className="icon-box size-14 text-2xl">
          <Icon name={p.icon} />
        </div>
        <div>
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            {p.badge && <span className="tag">{p.badge}</span>}
            <span>{KIND[p.kind] ?? p.kind}</span>
            {p.period && <span>· {p.period}</span>}
          </div>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">{p.title}</h1>
          <p className="mt-4 leading-relaxed text-muted sm:text-lg">{p.summary}</p>
          <LinkButtons githubUrl={p.githubUrl} deployUrl={p.deployUrl} className="mt-6" />
        </div>
      </header>

      <dl className="mt-10 grid gap-4 sm:grid-cols-2">
        {p.stack.length > 0 && (
          <div className="rounded-2xl border border-line bg-surface p-5">
            <dt className="text-xs font-semibold uppercase tracking-wider text-accent">사용 기술</dt>
            <dd className="mt-2 font-mono text-sm">{p.stack.join(" · ")}</dd>
          </div>
        )}
        {p.role && (
          <div className="rounded-2xl border border-line bg-surface p-5">
            <dt className="text-xs font-semibold uppercase tracking-wider text-secondary">담당 역할</dt>
            <dd className="mt-2 text-sm">{p.role}</dd>
          </div>
        )}
      </dl>

      {p.highlights && p.highlights.length > 0 && (
        <Section title="주요 기능">
          <ul className="space-y-2">
            {p.highlights.map((h) => (
              <Bullet key={h}>{h}</Bullet>
            ))}
          </ul>
        </Section>
      )}

      {hasRole && p.contributions && p.contributions.length > 0 && (
        <Section title="내가 한 일">
          <ul className="space-y-2">
            {p.contributions.map((c) => (
              <Bullet key={c}>{c}</Bullet>
            ))}
          </ul>
        </Section>
      )}

      {troubles.length > 0 && (
        <Section title="트러블슈팅">
          <div className="space-y-4">
            {troubles.map((t, i) => (
              <div key={i} className="rounded-2xl border border-line bg-surface p-5 sm:p-6">
                <h3 className="font-display font-bold">{t.problem}</h3>
                <dl className="mt-3 space-y-2 text-sm leading-relaxed">
                  <Row label="원인">{t.cause}</Row>
                  <Row label="해결">{t.solution}</Row>
                  {t.learned && <Row label="배운 점">{t.learned}</Row>}
                </dl>
              </div>
            ))}
          </div>
        </Section>
      )}
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="font-display text-xl font-bold sm:text-2xl">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-3 leading-relaxed text-muted">
      <span className="text-accent" aria-hidden>▹</span>
      <span>{children}</span>
    </li>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[72px_1fr]">
      <dt className="font-semibold text-accent">{label}</dt>
      <dd className="text-muted">{children}</dd>
    </div>
  );
}
