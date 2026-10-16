import type { Metadata } from "next";
import Link from "next/link";
import { FaArrowRight, FaEnvelope, FaGithub, FaRss } from "react-icons/fa6";
import { Icon } from "@/components/Icon";
import { PageHero } from "@/components/PageHero";
import { getProfile, getSkills } from "@/lib/queries";

export const metadata: Metadata = { title: "About", description: "프로필과 기술 스택 소개" };

const GROUP_LABEL: Record<string, string> = { language: "Languages", framework: "Frameworks & DB", tool: "Tools & OS" };

export default async function AboutPage() {
  const [profile, skills] = await Promise.all([getProfile(), getSkills()]);
  const groups = Object.keys(GROUP_LABEL).map((g) => ({ key: g, label: GROUP_LABEL[g], items: skills.filter((s) => s.group === g) }));

  return (
    <>
      <PageHero label="Profile" title="About" accent="Me" desc={profile.tagline} />

      <div className="grid gap-6 lg:grid-cols-[340px_1fr] lg:items-start">
        {/* 좌측: 프로필 카드 (PC에서는 스크롤 시 고정) */}
        <aside className="space-y-6 lg:sticky lg:top-28">
          <div className="glow-card reveal p-7 text-center">
            <div className="mx-auto grid size-24 place-items-center rounded-full border border-line-strong p-1">
              <div className="grid size-full place-items-center rounded-full bg-surface-2 text-4xl" aria-hidden>
                👩‍💻
              </div>
            </div>
            <h2 className="mt-5 font-display text-2xl font-bold">{profile.name}</h2>
            <p className="mt-1 text-sm text-muted">
              {profile.headline} · {profile.handle}
            </p>
            <div className="mt-5 flex justify-center gap-2">
              <a href={profile.links.github} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                <FaGithub aria-hidden /> GitHub
              </a>
              <a href={profile.links.blog} target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm">
                <FaRss aria-hidden /> Blog
              </a>
              {profile.links.email && (
                <a href={`mailto:${profile.links.email}`} className="btn btn-ghost btn-sm">
                  <FaEnvelope aria-hidden /> Mail
                </a>
              )}
            </div>
          </div>

          <div className="glow-card reveal p-7">
            <p className="section-label">Core Fields</p>
            <ul className="mt-5 space-y-3">
              {profile.fields.map((f) => (
                <li key={f.label} className="flex items-center gap-3 text-sm">
                  <span className="icon-box size-10 text-base">
                    <Icon name={f.icon} />
                  </span>
                  {f.label}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* 우측: 소개 + 기술 스택 */}
        <div className="space-y-6">
          <section className="glow-card reveal p-7 sm:p-9">
            <p className="section-label">Introduction</p>
            <h2 className="mt-4 font-display text-2xl font-bold sm:text-3xl">
              안녕하세요, <span className="accent-text">{profile.name}</span>입니다.
            </h2>
            <p className="mt-4 leading-relaxed text-muted sm:text-lg">{profile.about}</p>
          </section>

          <section className="glow-card reveal p-7 sm:p-9" aria-labelledby="stack">
            <p className="section-label" id="stack">Tech Stack</p>
            <div className="mt-6 space-y-7">
              {groups.map((g) =>
                g.items.length ? (
                  <div key={g.key}>
                    <h3 className="font-mono text-xs uppercase tracking-widest text-muted">{g.label}</h3>
                    <ul className="mt-3 grid grid-cols-2 gap-2 lg:grid-cols-3">
                      {g.items.map((s) => (
                        <li key={s.id} className="flex items-start gap-2.5 rounded-xl border border-line bg-surface-2 p-3">
                          <Icon name={s.icon} color={s.color} className="mt-0.5 size-5 shrink-0" />
                          <div>
                            <div className="text-sm font-medium">{s.name}</div>
                            {s.note && <div className="text-xs leading-relaxed text-muted">{s.note}</div>}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null,
              )}
            </div>
          </section>

          <Link href="/guestbook" className="glow-card reveal group flex items-center justify-between gap-4 p-6 sm:p-7">
            <div>
              <p className="section-label">Guestbook</p>
              <p className="mt-2 font-display text-lg font-bold">방명록 남기기</p>
            </div>
            <FaArrowRight className="shrink-0 text-xl text-accent transition group-hover:translate-x-1" aria-hidden />
          </Link>
        </div>
      </div>
    </>
  );
}
