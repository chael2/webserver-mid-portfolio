import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import { FaRightFromBracket, FaTrash } from "react-icons/fa6";
import { getSession } from "@/lib/auth";
import { hasDB } from "@/lib/db";
import { getGuestbook } from "@/lib/queries";
import { logout } from "@/app/login/actions";
import { deleteEntry } from "./actions";

export const metadata: Metadata = { title: "Admin", robots: { index: false } };

export default function AdminPage() {
  return (
    <div className="mx-auto max-w-3xl py-8 sm:py-12">
      <Suspense fallback={<p className="text-sm text-muted">불러오는 중…</p>}>
        <AdminContent />
      </Suspense>
    </div>
  );
}

const fmt = new Intl.DateTimeFormat("ko-KR", { timeZone: "Asia/Seoul", dateStyle: "short", timeStyle: "short" });

async function AdminContent() {
  await connection(); // 항상 요청 시점에 실행 (빌드 때 미리 만들지 않음)
  const session = await getSession();
  if (!session) redirect("/login");
  const entries = hasDB() ? await getGuestbook(100) : [];

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="section-label">Admin</p>
          <h1 className="mt-3 text-3xl font-bold">방명록 관리</h1>
          <p className="mt-1 text-sm text-muted">{session.sub} 로그인 · {entries.length}개</p>
        </div>
        <form action={logout}>
          <button className="btn btn-ghost btn-sm">
            <FaRightFromBracket aria-hidden /> 로그아웃
          </button>
        </form>
      </div>

      <ul className="mt-8 space-y-2">
        {!hasDB() && <li className="text-sm text-gold">DB가 연결되지 않았습니다.</li>}
        {entries.map((e) => (
          <li key={e.id} className="flex items-start gap-4 rounded-xl border border-line bg-surface p-4">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap gap-x-3 text-xs text-muted">
                <span className="font-semibold text-ink">{e.name}</span>
                <time dateTime={e.createdAt}>{fmt.format(new Date(e.createdAt))}</time>
              </div>
              <p className="mt-1 whitespace-pre-wrap break-words text-sm">{e.message}</p>
            </div>
            <form action={deleteEntry}>
              <input type="hidden" name="id" value={e.id} />
              <button className="btn btn-danger btn-sm" aria-label={`${e.name}의 글 삭제`}>
                <FaTrash aria-hidden />
              </button>
            </form>
          </li>
        ))}
      </ul>
    </>
  );
}
