import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { FaTerminal } from "react-icons/fa6";
import { PageHero } from "@/components/PageHero";
import GuestbookForm from "@/components/client/GuestbookForm";
import { getGuestbook } from "@/lib/queries";
import { hasDB } from "@/lib/db";

export const metadata: Metadata = { title: "Guestbook", description: "MongoDB에 저장되는 방명록" };

export default function GuestbookPage() {
  return (
    <>
      <PageHero
        label="Secure Feedback Gateway"
        title="방명록"
        accent="(Guestbook)"
        desc="서버 커넥션 로그처럼 한 마디 남겨주세요. 입력한 글은 Server Action을 통해 MongoDB에 저장됩니다."
      />
      <div className="mx-auto max-w-3xl space-y-6">
        <section className="glow-card p-6 sm:p-8">
          <GuestbookForm />
        </section>
        <section className="glow-card p-6 sm:p-8" aria-label="방명록 목록">
          <Suspense fallback={<p className="font-mono text-sm text-muted">[~] loading guestbook logs...</p>}>
            <GuestbookList />
          </Suspense>
        </section>
      </div>
    </>
  );
}

const fmt = new Intl.DateTimeFormat("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

/** 요청 시점마다 DB에서 최신 글을 읽음 (캐시하지 않음) */
async function GuestbookList() {
  await connection();
  if (!hasDB()) {
    return <p className="font-mono text-sm text-gold">[!] DB 미연결: .env.local에 MONGODB_URI를 설정하면 방명록이 동작합니다.</p>;
  }
  let entries: Awaited<ReturnType<typeof getGuestbook>> = [];
  try {
    entries = await getGuestbook();
  } catch {
    return <p className="font-mono text-sm text-[#f87171]">[x] 방명록을 불러오지 못했습니다. DB 연결 상태를 확인하세요.</p>;
  }
  if (!entries.length) return <p className="font-mono text-sm text-muted">[ ] 아직 로그가 없습니다. 첫 번째 메시지를 남겨주세요.</p>;

  return (
    <>
      <p className="mb-4 font-mono text-xs text-muted">{entries.length} log(s)</p>
      <ul className="space-y-3">
        {entries.map((e) => (
          <li key={e.id} className="rounded-xl border border-line bg-surface-2 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2 font-mono text-xs">
              <span className="flex items-center gap-2 font-semibold text-accent">
                <FaTerminal aria-hidden /> {e.name}
              </span>
              <time dateTime={e.createdAt} className="text-muted">
                {fmt.format(new Date(e.createdAt))}
              </time>
            </div>
            {/* React가 텍스트를 자동 이스케이프하므로 XSS 스크립트가 실행되지 않음 */}
            <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed">{e.message}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
