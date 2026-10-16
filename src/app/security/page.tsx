import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";

export const metadata: Metadata = { title: "Security", description: "이 사이트에 적용한 보안 설정" };

const GROUPS: { title: string; items: [string, string][] }[] = [
  {
    title: "HTTP 보안 헤더",
    items: [
      ["Content-Security-Policy", "스크립트·스타일 출처 제한, iframe 삽입 차단"],
      ["Strict-Transport-Security", "HTTPS 강제"],
      ["X-Frame-Options", "클릭재킹 방지"],
      ["X-Content-Type-Options", "MIME 스니핑 차단"],
      ["Referrer-Policy", "외부로 전체 URL 미전달"],
      ["Permissions-Policy", "카메라·마이크·위치 API 차단"],
    ],
  },
  {
    title: "관리자 로그인",
    items: [
      ["scrypt", "비밀번호는 솔트를 섞은 해시로만 보관"],
      ["HMAC 서명 쿠키", "세션 위조 방지, 2시간 만료"],
      ["HttpOnly · SameSite=Strict", "쿠키 탈취와 CSRF 완화"],
      ["로그인 제한", "IP당 15분에 5회 실패 시 잠금"],
      ["동일한 오류 메시지", "아이디·비밀번호 중 무엇이 틀렸는지 숨김"],
    ],
  },
  {
    title: "방명록 · DB",
    items: [
      ["zod 서버 검증", "길이·형식을 서버에서 다시 확인"],
      ["React 이스케이프", "입력한 스크립트가 실행되지 않음 (XSS)"],
      ["sanitizeFilter", "MongoDB 연산자 주입 차단 (NoSQL Injection)"],
      ["작성 제한", "IP당 1분에 3개, IP는 해시로만 저장"],
      ["환경 변수", "DB 주소·비밀값은 코드와 Git에 없음"],
    ],
  },
];

export default function SecurityPage() {
  return (
    <>
      <PageHero label="Security" title="이 사이트의" accent="보안 설정" />

      <div className="grid gap-5 lg:grid-cols-3">
        {GROUPS.map((g) => (
          <section key={g.title} className="glow-card reveal p-6">
            <h2 className="text-lg font-semibold">{g.title}</h2>
            <dl className="mt-4 space-y-3">
              {g.items.map(([k, v]) => (
                <div key={k}>
                  <dt className="font-mono text-xs text-accent">{k}</dt>
                  <dd className="text-sm text-muted">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        ))}
      </div>

      <p className="mt-6 text-sm text-muted">
        한계: 정적 페이지의 인라인 스크립트 때문에 CSP script-src에 &apos;unsafe-inline&apos;을 허용했습니다.
      </p>
    </>
  );
}
