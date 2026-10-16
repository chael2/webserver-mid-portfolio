"use client";

import { useActionState } from "react";
import { FaLock } from "react-icons/fa6";
import { login, type LoginState } from "@/app/login/actions";

export default function LoginForm() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <form action={action} className="space-y-4">
      <div>
        <label htmlFor="username" className="mb-1.5 block text-sm text-muted">아이디</label>
        <input id="username" name="username" className="field" autoComplete="username" required maxLength={40} />
      </div>
      <div>
        <label htmlFor="password" className="mb-1.5 block text-sm text-muted">비밀번호</label>
        <input id="password" name="password" type="password" className="field" autoComplete="current-password" required maxLength={200} />
      </div>
      <p className="min-h-5 text-sm text-[#f3a6a6]" role="alert" aria-live="polite">
        {state.error}
      </p>
      <button type="submit" disabled={pending} className="btn btn-primary w-full">
        <FaLock aria-hidden /> {pending ? "확인 중…" : "로그인"}
      </button>
    </form>
  );
}
