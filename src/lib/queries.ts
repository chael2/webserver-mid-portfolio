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

/**
 * DB에서 읽되, DB가 없거나 / 접속·조회에 실패하거나 / 비어 있으면 seed-data로 대신 그림.
 * → 빌드 중 DB 문제가 있어도 배포가 멈추지 않음. 대체 결과는 1분만 캐시해 DB가 돌아오면 곧 실제 데이터로 바뀜.
 * ('use cache' 함수 안에서만 호출)
 */
async function readOrSeed<T>(label: string, read: () => Promise<T | null>, seed: T): Promise<T> {
  if (!hasDB()) {
    cacheLife("hours");
    return seed;
  }
  try {
    await connectDB();
    const data = await read();
    if (data && (!Array.isArray(data) || data.length > 0)) {
      cacheLife("hours");
      return data;
    }
  } catch (err) {
    console.error(`[db] ${label} 조회 실패 → seed-data로 표시`, err);
  }
  cacheLife("minutes");
  return seed;
}

/* ── 읽기 전용 데이터: 'use cache'로 캐시, 태그로 즉시 무효화 가능 ── */

export async function getProfile(): Promise<ProfileData> {
  "use cache";
  cacheTag("profile");
  return readOrSeed(
    "profile",
    async () => {
      const doc = await Profile.findOne({ key: "main" }).lean();
      if (!doc) return null;
      const [p] = plain<ProfileData & { id: string }>([doc]);
      return { ...profileSeed, ...p };
    },
    profileSeed,
  );
}

export async function getProjects(): Promise<ProjectItem[]> {
  "use cache";
  cacheTag("projects");
  return readOrSeed(
    "projects",
    async () => plain<ProjectItem>(await Project.find().sort({ isCurrentCourse: -1, order: 1 }).lean()),
    withId(
      [...projectsSeed].sort((a, b) => Number(!!b.isCurrentCourse) - Number(!!a.isCurrentCourse) || a.order - b.order),
      (p) => p.slug,
    ),
  );
}

export async function getSkills(): Promise<SkillItem[]> {
  "use cache";
  cacheTag("skills");
  return readOrSeed(
    "skills",
    async () => plain<SkillItem>(await Skill.find().sort({ order: 1 }).lean()),
    withId(skillsSeed, (s) => s.name),
  );
}

export async function getTeamMembers(): Promise<TeamMemberItem[]> {
  "use cache";
  cacheTag("team");
  return readOrSeed(
    "team",
    async () => plain<TeamMemberItem>(await TeamMember.find().sort({ order: 1 }).lean()),
    withId(teamSeed, (m) => m.name),
  );
}

export async function getTimeline(): Promise<TimelineItem[]> {
  "use cache";
  cacheTag("timeline");
  return readOrSeed(
    "timeline",
    async () => plain<TimelineItem>(await Timeline.find().sort({ step: 1 }).lean()),
    withId(timelineSeed, (t) => t.step),
  );
}

export async function getPosts(): Promise<PostItem[]> {
  "use cache";
  cacheTag("posts");
  return readOrSeed(
    "posts",
    async () => plain<PostItem>(await Post.find().sort({ order: 1 }).lean()),
    withId(postsSeed, (p) => p.url),
  );
}

/* ── 방명록: 항상 최신 데이터 (캐시하지 않음, 페이지에서 Suspense로 감쌈) ── */

export async function getGuestbook(limit = 50): Promise<GuestbookItem[]> {
  if (!hasDB()) return [];
  try {
    await connectDB();
    const docs = await Guestbook.find().sort({ createdAt: -1 }).limit(limit).lean();
    return docs.map((d) => ({
      id: String(d._id),
      name: d.name,
      message: d.message,
      createdAt: new Date(d.createdAt).toISOString(),
    }));
  } catch (err) {
    // DB 장애 시 페이지 전체가 깨지지 않도록 빈 목록 (글 작성은 actions에서 오류 메시지로 안내)
    console.error("[db] guestbook 조회 실패", err);
    return [];
  }
}
