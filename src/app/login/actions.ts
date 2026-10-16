"use server";

import { redirect } from "next/navigation";
import { trusted } from "mongoose";
import { z } from "zod";
import { clientIpHash, createSession, destroySession, isAuthConfigured, verifyPassword } from "@/lib/auth";
import { connectDB, hasDB } from "@/lib/db";
import { LoginAttempt } from "@/models/LoginAttempt";

export type LoginState = { error?: string };

const MAX_FAILS = 5; // 15분 동안 5번 실패하면 잠금
const WINDOW_MS = 15 * 60_000;
const memoryFails = new Map<string, number[]>(); // DB가 없을 때 쓰는 임시 저장소

const schema = z.object({
  username: z.string().trim().min(1).max(40),
  password: z.string().min(1).max(200),
});

async function recentFails(ipHash: string) {
  if (hasDB()) {
    await connectDB();
    return LoginAttempt.countDocuments({ ipHash, createdAt: trusted({ $gte: new Date(Date.now() - WINDOW_MS) }) });
  }
  const list = (memoryFails.get(ipHash) ?? []).filter((t) => t > Date.now() - WINDOW_MS);
  memoryFails.set(ipHash, list);
  return list.length;
}

async function recordFail(ipHash: string) {
  if (hasDB()) await LoginAttempt.create({ ipHash });
  else memoryFails.set(ipHash, [...(memoryFails.get(ipHash) ?? []), Date.now()]);
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  if (!isAuthConfigured()) return { error: "관리자 계정이 설정되지 않았습니다." };

  const parsed = schema.safeParse({
    username: String(formData.get("username") ?? ""),
    password: String(formData.get("password") ?? ""),
  });
  if (!parsed.success) return { error: "아이디와 비밀번호를 입력하세요." };

  const ipHash = await clientIpHash();
  if ((await recentFails(ipHash)) >= MAX_FAILS) {
    return { error: "로그인 시도가 너무 많습니다. 15분 후 다시 시도하세요." };
  }

  const { username, password } = parsed.data;
  const userOk = username === (process.env.ADMIN_USERNAME ?? "admin");
  const passOk = await verifyPassword(password, process.env.ADMIN_PASSWORD_HASH); // 아이디가 틀려도 항상 계산
  if (!userOk || !passOk) {
    await recordFail(ipHash);
    return { error: "아이디 또는 비밀번호가 올바르지 않습니다." }; // 어느 쪽이 틀렸는지 알려주지 않음
  }

  await createSession(username);
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/login");
}
