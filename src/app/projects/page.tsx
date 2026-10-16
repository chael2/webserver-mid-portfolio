import type { Metadata } from "next";
import { PageHero, SectionHeading } from "@/components/PageHero";
import { LinkButtons } from "@/components/LinkButtons";
import { Icon } from "@/components/Icon";
import ProjectFilter from "@/components/client/ProjectFilter";
import { getProjects } from "@/lib/queries";

export const metadata: Metadata = { title: "Projects", description: "과제와 개인·팀 프로젝트 아카이브" };

export default async function ProjectsPage() {
  const projects = await getProjects();
  const current = projects.filter((p) => p.isCurrentCourse);
  const others = projects.filter((p) => !p.isCurrentCourse);

  return (
    <>
      <PageHero label="Assignments" title="Web" accent="Projects" desc="웹 프로그래밍 과제와 보안 관련 프로젝트 분석 및 구현 아카이브입니다." />

      {/* 현재 강의 실습 프로젝트: 큰 배너 + GitHub / 배포 주소 분리 표기 */}
      <section aria-label="현재 강의 실습 프로젝트" className="mb-16">
        <SectionHeading label="Now in Class" title="현재 강의" accent="실습 프로젝트" />
        <div className="mt-8 space-y-5">
          {current.map((p) => (
            <article key={p.id} className="glow-card reveal flex flex-col gap-6 p-6 sm:p-8 md:flex-row md:items-center">
              <div className="grid size-20 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-4xl text-white shadow-neon">
                <Icon name={p.icon} />
              </div>
              <div className="min-w-0 flex-1">
                {p.badge && <span className="tag">{p.badge}</span>}
                <h3 className="mt-3 font-display text-xl font-bold leading-snug sm:text-2xl">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">{p.summary}</p>
                <div className="mt-5 grid gap-2 sm:grid-cols-2">
                  <UrlRow label="GitHub 저장소" url={p.githubUrl} tone="text-accent" />
                  <UrlRow label="배포 주소" url={p.deployUrl} tone="text-secondary" />
                </div>
                <LinkButtons githubUrl={p.githubUrl} deployUrl={p.deployUrl} className="mt-5" />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section aria-label="전체 프로젝트">
        <SectionHeading label="All Projects" title="개인 & 팀" accent="작업물" className="mb-8" />
        <ProjectFilter projects={others} />
      </section>
    </>
  );
}

function UrlRow({ label, url, tone }: { label: string; url?: string; tone: string }) {
  if (!url) return null;
  return (
    <div className="min-w-0 rounded-xl border border-line bg-surface-2 px-3 py-2">
      <div className={`text-[11px] font-semibold uppercase tracking-wider ${tone}`}>{label}</div>
      <a href={url} target="_blank" rel="noopener noreferrer" className="block truncate font-mono text-xs text-muted hover:text-ink hover:underline">
        {url.replace(/^https?:\/\//, "")}
      </a>
    </div>
  );
}
