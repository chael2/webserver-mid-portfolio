import type { Metadata } from "next";
import { FaFingerprint, FaGithub } from "react-icons/fa6";
import { Icon } from "@/components/Icon";
import { PageHero, SectionHeading } from "@/components/PageHero";
import { getProfile, getProjects } from "@/lib/queries";

export const metadata: Metadata = { title: "GitHub", description: "GitHub 프로필과 주요 저장소" };

export default async function GithubPage() {
  const [profile, projects] = await Promise.all([getProfile(), getProjects()]);
  const repos = projects.filter((p) => p.showOnGithub && p.githubUrl);
  const user = profile.links.github.replace(/\/$/, "").split("/").pop();
  const securityRepos = repos.filter((r) => r.category === "security").length;

  return (
    <>
      <PageHero label="GitHub" title="GitHub" accent="Logs" desc="코드 저장소 활동 기록입니다." />

      {/* 프로필 카드 */}
      <section className="glow-card reveal flex flex-col items-center gap-6 p-6 text-center sm:p-8 md:flex-row md:text-left">
        <div className="icon-box size-20 rounded-2xl text-4xl">
          <FaGithub aria-hidden />
        </div>
        <div className="flex-1">
          <span className="tag">
            <FaFingerprint aria-hidden /> GitHub Profile
          </span>
          <h2 className="mt-3 font-mono text-2xl font-bold">{user}</h2>
          <p className="mt-1 text-sm text-muted">정보보호학과 · 취약점 · 악성코드 분석</p>
          <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-5">
            <FaGithub aria-hidden /> GitHub 프로필 방문
          </a>
        </div>
        <dl className="grid grid-cols-2 gap-3">
          <Stat value={repos.length} label="Repositories" />
          <Stat value={securityRepos} label="Security" />
        </dl>
      </section>

      {/* 저장소 카드 */}
      <section className="mt-16">
        <SectionHeading label="Repositories" title="주요" accent="저장소" />
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {repos.map((r) => (
            <a
              key={r.id}
              href={r.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="glow-card reveal group flex flex-col p-6"
            >
              <div className="flex items-center gap-3">
                <span className="icon-box size-10 text-base">
                  <Icon name={r.icon} />
                </span>
                <div className="min-w-0">
                  <h3 className="truncate font-mono text-sm font-semibold group-hover:text-secondary">
                    {r.githubUrl!.split("/").pop()}
                  </h3>
                  <p className="truncate text-xs text-muted">{r.title}</p>
                </div>
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">{r.summary}</p>
              <div className="mt-5 flex items-center justify-between font-mono text-[11px] text-muted">
                <span>{r.stack.join(" · ")}</span>
                <span className="text-accent">{r.kind === "team" ? "team" : "personal"}</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="min-w-28 rounded-2xl border border-line bg-surface-2 px-5 py-4 text-center">
      <dd className="text-3xl font-bold text-secondary">{value}</dd>
      <dt className="text-xs text-muted">{label}</dt>
    </div>
  );
}
