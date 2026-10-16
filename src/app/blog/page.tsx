import type { Metadata } from "next";
import { FaArrowRight, FaArrowUpRightFromSquare } from "react-icons/fa6";
import { Icon } from "@/components/Icon";
import { PageHero, SectionHeading } from "@/components/PageHero";
import { blogCategories } from "@/data/seed-data";
import { getPosts, getProfile } from "@/lib/queries";

export const metadata: Metadata = { title: "Blog", description: "Tistory 기술 블로그 연동" };

const ext = { target: "_blank", rel: "noopener noreferrer" } as const;

export default async function BlogPage() {
  const [profile, posts] = await Promise.all([getProfile(), getPosts()]);
  const host = profile.links.blog.replace(/^https?:\/\//, "").replace(/\/$/, "");

  return (
    <>
      <PageHero label="Tistory Blog" title="Study" accent="Notes" desc="배운 것을 내 것으로 만들기 위한 기술 기록 저장소입니다." />

      <section className="glow-card reveal flex flex-col gap-6 p-6 sm:p-9 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="section-label">{host}</p>
          <h2 className="mt-3 font-display text-2xl font-extrabold sm:text-3xl">{profile.blogTitle}</h2>
          <p className="mt-3 max-w-2xl leading-relaxed text-muted">{profile.blogDescription}</p>
        </div>
        <a href={profile.links.blog} {...ext} className="btn btn-primary shrink-0">
          <FaArrowUpRightFromSquare aria-hidden /> 블로그 방문하기
        </a>
      </section>

      <section className="mt-16">
        <SectionHeading label="Categories" title="블로그" accent="카테고리" />
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {blogCategories.map((c) => (
            <a key={c.name} href={c.url} {...ext} className="glow-card reveal flex items-center gap-4 p-6">
              <span className="icon-box">
                <Icon name={c.icon} />
              </span>
              <span>
                <span className="block font-display text-lg font-bold">{c.name}</span>
                <span className="block text-sm text-muted">{c.desc}</span>
              </span>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-16">
        <SectionHeading label="Latest Posts" title="최신" accent="포스트" />
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((p, i) => (
            <article key={p.id} className="glow-card reveal flex flex-col">
              <div
                className="h-28 rounded-t-[inherit]"
                style={{ background: ["linear-gradient(135deg,#d946ef,#06b6d4)", "linear-gradient(135deg,#1a0533,#3d0b6e)", "linear-gradient(135deg,#0d1117,#2d0b6e)"][i % 3] }}
                aria-hidden
              />
              <div className="flex flex-1 flex-col p-6">
                {p.tag && <span className="tag self-start">{p.tag}</span>}
                <h3 className="mt-3 font-display text-lg font-bold">{p.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{p.summary}</p>
                <a href={p.url} {...ext} className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-accent hover:underline">
                  글 읽으러 가기 <FaArrowRight aria-hidden />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
