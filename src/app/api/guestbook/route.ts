import { connection } from "next/server";
import { getGuestbook } from "@/lib/queries";

/** GET /api/guestbook — 최근 방명록 50개 JSON */
export async function GET() {
  await connection(); // 항상 요청 시점에 실행
  return Response.json(await getGuestbook());
}
