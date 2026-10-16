import type { Metadata } from "next";
import { FaAddressCard, FaGithub, FaRss } from "react-icons/fa6";
import { PageHero, SectionHeading } from "@/components/PageHero";
import { LinkButtons } from "@/components/LinkButtons";
import { getProjects, getTeamMembers, getTimeline } from "@/lib/queries";

export const metadata: Metadata = { title: "Team", description: "팀원 소개와 팀 프로젝트 GitHub·배포 주소" };

export default async function TeamPage() {
  const [members, timeline, projects] = await Promise.all([getTeamMembers(), getTimeline(), getProjects()]);
  // 팀 페이지 대표 프로젝트 (seed-data의 isTeamFeature)
  const tp = projects.find((p) => p.isTeamFeature) ?? projects.find((p) => p.kind === "team" && p.isCurrentCourse);

  return (
    <>
      <PageHero label="Web Server Programming Team" title="Meet Our" accent="Team" desc={`${tp ? tp.title : "팀 프로젝트"}를 함께 설계하고 구현하는 팀원들을 소개합니다.`} />

      {/* 팀 프로젝트: GitHub 저장소 / 배포 주소 */}
      {tp && (
        <section className="glow-card reveal p-6 sm:p-9" aria-labelledby="blueprint">
          <p className="section-label">Team Project Blueprint</p>
          {tp.badge && <span className="tag mt-4">{tp.badge}</span>}
          <h2 id="blueprint" className="mt-3 font-display text-2xl font-extrabold leading-snug sm:text-3xl">
            {tp.title}
          </h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-muted">{tp.summary}</p>
          {tp.highlights && tp.highlights.length > 0 && (
            <ol className="mt-6 grid gap-3 md:grid-cols-3">
              {tp.highlights.map((h, i) => {
                const [head, ...rest] = h.split(": ");
                return (
                  <li key={h} className="rounded-2xl border border-line bg-surface-2 p-4">
                    <span className="font-mono text-xs text-accent">FEATURE 0{i + 1}</span>
                    <p className="mt-1 font-display font-bold">{rest.length ? head : `기능 ${i + 1}`}</p>
                    <p className="mt-1 text-sm leading-relaxed text-muted">{rest.length ? rest.join(": ") : h}</p>
                  </li>
                );
              })}
            </ol>
          )}
          {tp.stack.length > 0 && <p className="mt-5 font-mono text-xs text-muted">stack: {tp.stack.join(" · ")}</p>}
          <LinkButtons githubUrl={tp.githubUrl} deployUrl={tp.deployUrl} className="mt-5" />
        </section>
      )}

      {/* 팀원 카드: 1열 → 2열 → 4열 */}
      <section className="mt-16" aria-label="팀원">
        <SectionHeading label="Team Members" title={`${members.length}명의`} accent="팀원" />
        <ul className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((m) => (
            <li key={m.id} className="glow-card reveal p-7 text-center">
              <div
                className="mx-auto grid size-[70px] place-items-center rounded-full font-display text-2xl font-extrabold text-white"
                style={{ background: `linear-gradient(135deg, ${m.color}, #06b6d4)`, boxShadow: `0 0 15px ${m.color}55` }}
                aria-hidden
              >
                {m.name.slice(0, 1)}
              </div>
              <h3 className="mt-5 font-display text-xl font-bold">{m.name}</h3>
              <p className="mt-1 text-sm font-semibold" style={{ color: m.color }}>
                {m.role}
              </p>
              <div className="mt-4 flex justify-center gap-1 text-lg">
                <MemberLink href={m.githubUrl} label={`${m.name} GitHub`} icon={<FaGithub />} />
                <MemberLink href={m.blogUrl} label={`${m.name} 블로그`} icon={<FaRss />} />
                <MemberLink href={m.portfolioUrl} label={`${m.name} 포트폴리오`} icon={<FaAddressCard />} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* 이력 정보: 개발 타임라인 */}
      <section className="mt-16" aria-label="개발 과정">
        <SectionHeading label="Development Timeline" title="개발" accent="과정" />
        <ol className="relative mt-8 space-y-5 border-l border-line pl-6 sm:pl-8">
          {timeline.map((t) => (
            <li key={t.id} className="reveal relative">
              <span className="absolute -left-[37px] top-5 grid size-6 place-items-center rounded-full bg-gradient-to-br from-primary to-secondary font-mono text-xs font-bold text-white sm:-left-[45px]">
                {t.step}
              </span>
              <div className="glow-card p-5 sm:p-6">
                <h3 className="font-display text-lg font-bold">{t.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{t.description}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}

function MemberLink({ href, label, icon }: { href?: string; label: string; icon: React.ReactNode }) {
  if (!href) return null;
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      aria-label={label}
      title={label}
      className="grid size-11 place-items-center rounded-full text-muted transition hover:bg-surface-2 hover:text-secondary"
    >
      {icon}
    </a>
  );
}
