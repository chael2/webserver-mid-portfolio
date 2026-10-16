"use server";

import { isValidObjectId } from "mongoose";
import { refresh } from "next/cache";
import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Guestbook } from "@/models/Guestbook";

/** 방명록 글 삭제 — 서버에서 세션을 다시 확인 (화면에서 버튼을 숨기는 것만으로는 부족) */
export async function deleteEntry(formData: FormData) {
  const session = await getSession();
  if (!session) throw new Error("unauthorized");
  const id = String(formData.get("id") ?? "");
  if (!isValidObjectId(id)) return;
  await connectDB();
  await Guestbook.findByIdAndDelete(id);
  refresh();
}
