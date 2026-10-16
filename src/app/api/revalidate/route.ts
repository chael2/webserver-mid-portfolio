import { revalidateTag } from "next/cache";

const TAGS = ["profile", "projects", "skills", "team", "timeline", "posts"];

/**
 * POST /api/revalidate?secret=...
 * `npm run seed`로 DB 내용을 바꾼 뒤 호출하면 캐시를 바로 갱신합니다.
 * Vercel 환경 변수에 REVALIDATE_SECRET을 등록해 두세요.
 */
export async function POST(request: Request) {
  const secret = new URL(request.url).searchParams.get("secret");
  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return Response.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }
  for (const tag of TAGS) revalidateTag(tag, "max");
  return Response.json({ ok: true, revalidated: TAGS });
}
