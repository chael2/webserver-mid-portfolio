"use server";

import { z } from "zod";
import { refresh } from "next/cache";
import { connectDB, hasDB } from "@/lib/db";
import { Guestbook } from "@/models/Guestbook";

const schema = z.object({
  name: z.string().trim().min(1, "이름을 입력하세요").max(20, "이름은 20자 이내로 입력하세요"),
  message: z.string().trim().min(1, "내용을 입력하세요").max(300, "내용은 300자 이내로 입력하세요"),
});

export type GuestbookState = { ok: boolean; error?: string; at?: number };

export async function addEntry(_prev: GuestbookState, formData: FormData): Promise<GuestbookState> {
  // honeypot: 사람에게는 보이지 않는 칸. 값이 있으면 봇으로 보고 조용히 무시
  if (formData.get("website")) return { ok: true, at: Date.now() };

  const parsed = schema.safeParse({
    name: formData.get("name") ?? "",
    message: formData.get("message") ?? "",
  });
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0]?.message ?? "입력값을 확인하세요" };

  if (!hasDB()) return { ok: false, error: "DB가 연결되지 않았습니다 (MONGODB_URI 설정 필요)" };

  try {
    await connectDB();
    await Guestbook.create(parsed.data);
  } catch (err) {
    console.error("[guestbook] create failed", err);
    return { ok: false, error: "저장 중 오류가 발생했습니다. 잠시 후 다시 시도하세요." };
  }

  refresh(); // 현재 페이지를 다시 그려 새 글을 바로 보여줌
  return { ok: true, at: Date.now() };
}
