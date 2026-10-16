import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { connectDB, hasDB } from "./db";
import { Project } from "@/models/Project";
import { Skill } from "@/models/Skill";
import { TeamMember } from "@/models/TeamMember";
import { Timeline } from "@/models/Timeline";
import { Profile } from "@/models/Profile";
import { Post } from "@/models/Post";
import { Guestbook } from "@/models/Guestbook";
import {
  profileSeed,
  projectsSeed,
  skillsSeed,
  teamSeed,
  timelineSeed,
  postsSeed,
  type ProjectSeed,
} from "@/data/seed-data";

/* ── 화면에서 쓰는 타입 (DB 문서를 직렬화한 형태) ─────────────────── */
export type ProfileData = typeof profileSeed;
export type ProjectItem = ProjectSeed & { id: string };
export type SkillItem = (typeof skillsSeed)[number] & { id: string };
export type TeamMemberItem = (typeof teamSeed)[number] & { id: string };
export type TimelineItem = (typeof timelineSeed)[number] & { id: string };
export type PostItem = (typeof postsSeed)[number] & { id: string };
export type GuestbookItem = { id: string; name: string; message: string; createdAt: string };

/** Mongoose lean 결과(ObjectId, Date 포함)를 클라이언트로 넘길 수 있는 순수 객체로 변환 */
function plain<T>(docs: unknown[]): T[] {
  return docs.map((d) => {
    const o = JSON.parse(JSON.stringify(d));
    o.id = String(o._id);
    delete o._id;
    delete o.__v;
    return o as T;
  });
}

function withId<T extends object>(rows: T[], key: (r: T) => string | number) {
  return rows.map((r) => ({ ...r, id: String(key(r)) }));
}

/* ── 읽기 전용 데이터: 'use cache'로 캐시, 태그로 즉시 무효화 가능 ── */

export async function getProfile(): Promise<ProfileData> {
  "use cache";
  cacheLife("hours");
  cacheTag("profile");
  if (!hasDB()) return profileSeed;
  await connectDB();
  const doc = await Profile.findOne({ key: "main" }).lean();
  if (!doc) return profileSeed;
  const [p] = plain<ProfileData & { id: string }>([doc]);
  return { ...profileSeed, ...p };
}

export async function getProjects(): Promise<ProjectItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("projects");
  if (!hasDB()) {
    return withId(
      [...projectsSeed].sort((a, b) => Number(!!b.isCurrentCourse) - Number(!!a.isCurrentCourse) || a.order - b.order),
      (p) => p.slug,
    );
  }
  await connectDB();
  const docs = await Project.find().sort({ isCurrentCourse: -1, order: 1 }).lean();
  return plain<ProjectItem>(docs);
}

export async function getSkills(): Promise<SkillItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("skills");
  if (!hasDB()) return withId(skillsSeed, (s) => s.name);
  await connectDB();
  return plain<SkillItem>(await Skill.find().sort({ order: 1 }).lean());
}

export async function getTeamMembers(): Promise<TeamMemberItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("team");
  if (!hasDB()) return withId(teamSeed, (m) => m.name);
  await connectDB();
  return plain<TeamMemberItem>(await TeamMember.find().sort({ order: 1 }).lean());
}

export async function getTimeline(): Promise<TimelineItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("timeline");
  if (!hasDB()) return withId(timelineSeed, (t) => t.step);
  await connectDB();
  return plain<TimelineItem>(await Timeline.find().sort({ step: 1 }).lean());
}

export async function getPosts(): Promise<PostItem[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("posts");
  if (!hasDB()) return withId(postsSeed, (p) => p.url);
  await connectDB();
  return plain<PostItem>(await Post.find().sort({ order: 1 }).lean());
}

/* ── 방명록: 항상 최신 데이터 (캐시하지 않음, 페이지에서 Suspense로 감쌈) ── */

export async function getGuestbook(limit = 50): Promise<GuestbookItem[]> {
  if (!hasDB()) return [];
  await connectDB();
  const docs = await Guestbook.find().sort({ createdAt: -1 }).limit(limit).lean();
  return docs.map((d) => ({
    id: String(d._id),
    name: d.name,
    message: d.message,
    createdAt: new Date(d.createdAt).toISOString(),
  }));
}
