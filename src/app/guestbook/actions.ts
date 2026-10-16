"use server";

import { trusted } from "mongoose";
import { z } from "zod";
import { refresh } from "next/cache";
import { connectDB, hasDB } from "@/lib/db";
import { Guestbook } from "@/models/Guestbook";
import { clientIpHash } from "@/lib/auth";

const schema = z.object({
  name: z.string().trim().min(1, "이름을 입력하세요").max(20, "이름은 20자 이내로 입력하세요"),
  message: z.string().trim().min(1, "내용을 입력하세요").max(300, "내용은 300자 이내로 입력하세요"),
});

export type GuestbookState = { ok: boolean; error?: string; at?: number };

const WINDOW_MS = 60_000; // 1분
const MAX_PER_WINDOW = 3; // 같은 IP에서 1분에 3개까지

export async function addEntry(_prev: GuestbookState, formData: FormData): Promise<GuestbookState> {
  // honeypot: 사람에게는 보이지 않는 칸. 값이 있으면 봇으로 보고 조용히 무시
  if (formData.get("website")) return { ok: true, at: Date.now() };

  // FormData 값을 문자열로 강제해 객체·배열이 DB 쿼리에 섞이지 않게 함
  const parsed = schema.safeParse({
    name: String(formData.get("name") ?? ""),
    message: String(formData.get("message") ?? ""),
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "입력값을 확인하세요" };

  if (!hasDB()) return { ok: false, error: "DB가 연결되지 않았습니다 (MONGODB_URI 설정 필요)" };

  try {
    await connectDB();
    const ipHash = await clientIpHash();
    const recent = await Guestbook.countDocuments({
      ipHash,
      // sanitizeFilter가 켜져 있으므로 서버에서 만든 연산자만 trusted()로 허용
      createdAt: trusted({ $gte: new Date(Date.now() - WINDOW_MS) }),
    });
    if (recent >= MAX_PER_WINDOW) return { ok: false, error: "잠시 후 다시 작성해 주세요. (1분에 3개까지)" };
    await Guestbook.create({ ...parsed.data, ipHash });
  } catch (err) {
    console.error("[guestbook] create failed", err);
    return { ok: false, error: "저장 중 오류가 발생했습니다. 잠시 후 다시 시도하세요." };
  }

  refresh(); // 현재 페이지를 다시 그려 새 글을 바로 보여줌
  return { ok: true, at: Date.now() };
}
