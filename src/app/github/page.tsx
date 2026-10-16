import type { Metadata } from "next";
import { FaFingerprint, FaGithub } from "react-icons/fa6";
import { Icon } from "@/components/Icon";
import { PageHero, SectionHeading } from "@/components/PageHero";
import { getProfile, getProjects, getTeamMembers } from "@/lib/queries";

export const metadata: Metadata = { title: "GitHub", description: "GitHub 프로필과 주요 저장소" };

export default async function GithubPage() {
  const [profile, projects, team] = await Promise.all([getProfile(), getProjects(), getTeamMembers()]);
  const repos = projects.filter((p) => p.showOnGithub && p.githubUrl);
  const user = profile.links.github.replace(/\/$/, "").split("/").pop();

  return (
    <>
      <PageHero label="GitHub activity" title="GitHub" accent="Logs" desc="주요 저장소 목록입니다." />

      <section className="glow-card reveal flex flex-col items-center gap-6 p-6 text-center sm:p-9 md:flex-row md:text-left">
        <div className="grid size-24 shrink-0 place-items-center rounded-3xl bg-gradient-to-br from-primary to-accent text-5xl text-white shadow-neon">
          <FaGithub aria-hidden />
        </div>
        <div className="flex-1">
          <span className="tag">
            <FaFingerprint aria-hidden /> GitHub Profile
          </span>
          <h2 className="mt-3 font-display text-3xl font-extrabold">{user}</h2>
          <p className="mt-1 text-muted">정보보호학과 · Web Security</p>
          <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-5">
            <FaGithub aria-hidden /> GitHub 프로필 방문
          </a>
        </div>
        <dl className="grid grid-cols-2 gap-3">
          <Stat value={repos.length} label="Repositories" />
          <Stat value={team.length} label="Team Members" />
        </dl>
      </section>

      <section className="mt-16">
        <SectionHeading label="Repositories" title="주요" accent="저장소" />
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {repos.map((r) => (
            <a key={r.id} href={r.githubUrl} target="_blank" rel="noopener noreferrer" className="glow-card reveal group flex flex-col p-6">
              <div className="flex items-center gap-3">
                <Icon name={r.icon} className="text-xl text-secondary" />
                <h3 className="font-mono text-base font-bold group-hover:text-accent">{r.githubUrl!.split("/").pop()}</h3>
              </div>
              <p className="mt-1 text-xs text-muted">{r.title}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{r.summary}</p>
              <p className="mt-4 font-mono text-xs text-accent">{r.stack.join(" / ")}</p>
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
      <dd className="font-display text-3xl font-extrabold text-secondary">{value}</dd>
      <dt className="text-xs text-muted">{label}</dt>
    </div>
  );
}
