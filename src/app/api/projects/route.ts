import { getProjects } from "@/lib/queries";

/** GET /api/projects — 프로젝트 목록 JSON (외부 공개용) */
export async function GET() {
  return Response.json(await getProjects());
}
