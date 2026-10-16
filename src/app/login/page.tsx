import type { Metadata } from "next";
import { Suspense } from "react";
import { connection } from "next/server";
import { redirect } from "next/navigation";
import LoginForm from "@/components/client/LoginForm";
import { getSession, isAuthConfigured } from "@/lib/auth";

export const metadata: Metadata = { title: "Login", robots: { index: false } };

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-sm py-12 sm:py-20">
      <p className="section-label">Admin</p>
      <h1 className="mt-3 text-3xl font-bold">관리자 로그인</h1>
      <p className="mt-2 text-sm text-muted">방명록 관리용 페이지입니다.</p>
      <div className="glow-card mt-8 p-6">
        <Suspense fallback={<div className="h-64" />}>
          <LoginGate />
        </Suspense>
      </div>
    </div>
  );
}

/** 이미 로그인했으면 /admin으로 (쿠키를 읽으므로 요청 시점에 실행) */
async function LoginGate() {
  await connection(); // 항상 요청 시점에 실행 (빌드 때 미리 만들지 않음)
  if (await getSession()) redirect("/admin");
  if (!isAuthConfigured()) {
    return <p className="text-sm text-gold">관리자 계정이 설정되지 않았습니다. README의 &quot;관리자 로그인 설정&quot;을 참고하세요.</p>;
  }
  return <LoginForm />;
}
