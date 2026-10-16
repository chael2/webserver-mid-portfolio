"use client";

import { useActionState, useEffect, useRef } from "react";
import { FaPaperPlane } from "react-icons/fa6";
import { addEntry, type GuestbookState } from "@/app/guestbook/actions";

export default function GuestbookForm() {
  const [state, action, pending] = useActionState<GuestbookState, FormData>(addEntry, { ok: false });
  const formRef = useRef<HTMLFormElement>(null);

  // 저장 성공 시 입력칸 비우기
  useEffect(() => {
    if (state.ok) formRef.current?.reset();
  }, [state]);

  return (
    <form ref={formRef} action={action} className="space-y-3" noValidate={false}>
      {/* 봇 차단용 숨은 칸 */}
      <div className="hidden" aria-hidden>
        <label>
          Website <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="sr-only" htmlFor="gb-name">이름</label>
        <input id="gb-name" name="name" className="field sm:w-48" placeholder="성함 (Your Name)" maxLength={20} required autoComplete="nickname" />
        <button type="submit" disabled={pending} className="btn btn-primary sm:ml-auto">
          <FaPaperPlane aria-hidden /> {pending ? "전송 중…" : "전송 (Submit)"}
        </button>
      </div>
      <label className="sr-only" htmlFor="gb-message">메시지</label>
      <textarea
        id="gb-message"
        name="message"
        className="field min-h-28 resize-y"
        placeholder="로그 코멘트 남기기 (Write secure log message...)"
        maxLength={300}
        required
      />
      <p className="min-h-5 text-sm" role="status" aria-live="polite">
        {state.error && <span className="text-[#f87171]">{state.error}</span>}
        {state.ok && !pending && <span className="text-success">[+] 방명록이 MongoDB에 저장되었습니다.</span>}
      </p>
    </form>
  );
}
