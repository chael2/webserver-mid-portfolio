import type { Metadata } from "next";
import { FaArrowUpRightFromSquare, FaGithub } from "react-icons/fa6";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/PageHero";
import { getProfile, getProjects } from "@/lib/queries";

export const metadata: Metadata = { title: "GitHub", description: "GitHub 프로필과 주요 저장소" };

export default async function GithubPage() {
  const [profile, projects] = await Promise.all([getProfile(), getProjects()]);
  const repos = projects.filter((p) => p.showOnGithub && p.githubUrl);
  const user = profile.links.github.replace(/\/$/, "").split("/").pop();

  return (
    <>
      <PageHero label="GitHub" title="주요" accent="저장소" />

      <a
        href={profile.links.github}
        target="_blank"
        rel="noopener noreferrer"
        className="glow-card reveal flex items-center gap-4 p-5 sm:p-6"
      >
        <span className="icon-box size-12 text-xl">
          <FaGithub aria-hidden />
        </span>
        <span className="flex-1">
          <span className="block font-mono font-semibold">github.com/{user}</span>
          <span className="block text-sm text-muted">저장소 {repos.length}개</span>
        </span>
        <FaArrowUpRightFromSquare className="text-muted" aria-hidden />
      </a>

      <ul className="mt-6 divide-y divide-line overflow-hidden rounded-[20px] border border-line bg-surface">
        {repos.map((r) => (
          <li key={r.id}>
            <a
              href={r.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 px-5 py-4 transition hover:bg-surface-2 sm:px-6"
            >
              <Icon name={r.icon} className="shrink-0 text-lg text-secondary" />
              <span className="min-w-0 flex-1">
                <span className="block truncate font-mono text-sm font-semibold group-hover:text-secondary">
                  {r.githubUrl!.split("/").pop()}
                </span>
                <span className="block truncate text-sm text-muted">{r.summary}</span>
              </span>
              <span className="hidden shrink-0 font-mono text-xs text-muted sm:block">{r.stack.slice(0, 2).join(" · ")}</span>
            </a>
          </li>
        ))}
      </ul>
    </>
  );
}
