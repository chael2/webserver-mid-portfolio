import Link from "next/link";
import { FaArrowRight, FaFolderOpen, FaGithub, FaLaptopCode, FaRss, FaShieldHalved, FaUserShield, FaUsers } from "react-icons/fa6";
import CyberTerminal from "@/components/client/CyberTerminal";
import TypingText from "@/components/client/TypingText";
import { LinkButtons } from "@/components/LinkButtons";
import { getProfile, getProjects, getSkills, getTeamMembers } from "@/lib/queries";

export default async function HomePage() {
  const [profile, projects, skills, team] = await Promise.all([getProfile(), getProjects(), getSkills(), getTeamMembers()]);
  const current = projects.filter((p) => p.isCurrentCourse);

  const hubs = [
    { href: "/about", icon: FaUserShield, title: "About Me", desc: `관심 분야와 기술 스택`, cta: "자세히 보기", span: "lg:col-span-2", tone: "text-secondary" },
    { href: "/blog", icon: FaRss, title: "Blog", desc: "Linux, CTF 풀이 기록", cta: "블로그 보기", span: "lg:col-span-2", tone: "text-secondary" },
    { href: "/github", icon: FaGithub, title: "GitHub", desc: "주요 저장소와 코드", cta: "저장소 보기", span: "", tone: "text-accent" },
    { href: "/projects", icon: FaFolderOpen, title: "Projects", desc: `강의 과제와 개인·팀 프로젝트 ${projects.length}개`, cta: "프로젝트 보기", span: "lg:col-span-2", tone: "text-secondary" },
    { href: "/team", icon: FaUsers, title: "Team", desc: `현재 팀 프로젝트를 함께하는 ${team.length}명의 팀원`, cta: "팀 보기", span: "", tone: "text-success" },
    { href: "/security", icon: FaShieldHalved, title: "Security", desc: "보안 헤더, 로그인, 입력 검증 등 이 사이트에 적용한 설정", cta: "보안 설계 보기", span: "sm:col-span-2 lg:col-span-4", tone: "text-accent" },
  ];

  return (
    <>
      {/* ── Hero: 모바일 1열 → PC 2열 ── */}
      <section className="grid items-center gap-10 py-6 sm:py-10 lg:grid-cols-[1.1fr_1fr] lg:gap-14 lg:py-16">
        <div className="animate-fade-up">
          <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface-2 px-3 py-1 font-mono text-xs text-accent">
            <FaShieldHalved aria-hidden /> {profile.headline}
          </p>
          <h1 className="mt-5 text-[clamp(2.25rem,6vw,3.75rem)] font-bold leading-[1.15]">
            <span className="block">안녕하세요</span>
            <span className="gradient-text block">{profile.name}입니다</span>
          </h1>
          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted sm:text-lg">{profile.intro}</p>
          <p className="mt-4 min-h-7 text-base sm:text-lg">
            <span className="text-muted">&gt; </span>
            <TypingText words={profile.typingWords} />
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/projects" className="btn btn-primary">
              <FaLaptopCode aria-hidden /> 프로젝트 보기
            </Link>
            <Link href="/about" className="btn btn-ghost">
              <FaUserShield aria-hidden /> 소개 보기
            </Link>
          </div>
          <div className="mt-6 flex gap-2 text-xl">
            <a href={profile.links.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub 프로필" className="grid size-11 place-items-center rounded-full border border-line bg-surface text-muted transition hover:border-accent hover:text-accent">
              <FaGithub />
            </a>
            <a href={profile.links.blog} target="_blank" rel="noopener noreferrer" aria-label="기술 블로그" className="grid size-11 place-items-center rounded-full border border-line bg-surface text-muted transition hover:border-secondary hover:text-secondary">
              <FaRss />
            </a>
          </div>
        </div>

        <CyberTerminal
          profile={{ name: profile.name, handle: profile.handle, headline: profile.headline }}
          skills={skills.map((s) => ({ name: s.name, note: s.note }))}
          projects={projects.map((p) => ({ title: p.title, badge: p.badge, summary: p.summary, kind: p.kind, deployUrl: p.deployUrl, githubUrl: p.githubUrl }))}
        />
      </section>

      {/* ── 현재 강의 실습 프로젝트: GitHub / 배포 주소를 각각 명확하게 ── */}
      {current.length > 0 && (
        <section className="mt-12 sm:mt-16" aria-labelledby="now-building">
          <p className="section-label">Now Building</p>
          <h2 id="now-building" className="section-title mt-3">
            현재 강의 <span>실습 프로젝트</span>
          </h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {current.map((p) => (
              <article key={p.id} className="glow-card reveal flex flex-col p-6 sm:p-8">
                {p.badge && <span className="tag self-start">{p.badge}</span>}
                <h3 className="mt-4 font-display text-xl font-bold leading-snug break-keep sm:text-2xl">{p.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted sm:text-base">{p.summary}</p>
                <dl className="mt-5 space-y-1.5 break-all font-mono text-xs text-muted">
                  {p.githubUrl && (
                    <div className="flex gap-2">
                      <dt className="shrink-0 text-accent">repo</dt>
                      <dd>{p.githubUrl.replace("https://", "")}</dd>
                    </div>
                  )}
                  {p.deployUrl && (
                    <div className="flex gap-2">
                      <dt className="shrink-0 text-secondary">live</dt>
                      <dd>{p.deployUrl.replace("https://", "")}</dd>
                    </div>
                  )}
                </dl>
                <LinkButtons githubUrl={p.githubUrl} deployUrl={p.deployUrl} className="mt-5" />
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ── Bento 허브: 1열 → sm 2열 → lg 4열 ── */}
      <section className="mt-16 sm:mt-20" aria-labelledby="overview">
        <p className="section-label">Overview</p>
        <h2 id="overview" className="section-title mt-3">
          포트폴리오 <span>둘러보기</span>
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {hubs.map((h) => (
            <Link key={h.href} href={h.href} className={`glow-card reveal group flex min-h-48 flex-col justify-between p-6 sm:p-7 ${h.span}`}>
              <div>
                <div className={`icon-box ${h.tone}`}>
                  <h.icon aria-hidden />
                </div>
                <h3 className="mt-5 font-display text-lg font-bold">{h.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{h.desc}</p>
              </div>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-accent">
                {h.cta} <FaArrowRight aria-hidden className="transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
