import type { Metadata } from "next";
import { FaAddressCard, FaGithub, FaRss } from "react-icons/fa6";
import { PageHero, SectionHeading } from "@/components/PageHero";
import { LinkButtons } from "@/components/LinkButtons";
import { getProjects, getTeamMembers, getTimeline } from "@/lib/queries";

export const metadata: Metadata = { title: "Team", description: "Web-Pedia 팀원 소개와 팀 프로젝트 배포 주소" };

export default async function TeamPage() {
  const [members, timeline, projects] = await Promise.all([getTeamMembers(), getTimeline(), getProjects()]);
  const teamProjects = projects.filter((p) => p.slug.startsWith("web-pedia"));

  return (
    <>
      <PageHero label="Web-Pedia Team" title="Meet Our" accent="Team" desc="Web-Pedia 프로젝트를 함께 성실하게 설계하고 발전시켜 나가는 팀원들을 소개합니다." />

      {/* 팀 프로젝트 배포 주소 */}
      <section className="glow-card reveal p-6 sm:p-9" aria-labelledby="blueprint">
        <p className="section-label">Team Project Blueprint</p>
        <h2 id="blueprint" className="mt-4 font-display text-2xl font-extrabold sm:text-3xl">
          Web-Pedia <span className="accent-text">(웹피디아)</span>
        </h2>
        <p className="mt-3 max-w-3xl leading-relaxed text-muted">
          정보보안에 도움이 되는 웹 표준 문법과 시큐어 코딩 및 방어 기법들을 정리한 공동 백과사전 개발 산출물입니다.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {teamProjects.map((p) => (
            <div key={p.id} className="rounded-2xl border border-line bg-surface-2 p-5">
              {p.badge && <span className="tag">{p.badge}</span>}
              <h3 className="mt-3 font-display font-bold">{p.title}</h3>
              <LinkButtons githubUrl={p.githubUrl} deployUrl={p.deployUrl} size="sm" className="mt-4" />
            </div>
          ))}
        </div>
      </section>

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
