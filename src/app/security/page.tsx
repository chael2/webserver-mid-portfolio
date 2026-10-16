import type { Metadata } from "next";
import { PageHero, SectionHeading } from "@/components/PageHero";

export const metadata: Metadata = { title: "Security", description: "이 포트폴리오 사이트에 적용한 보안 설정" };

const HEADERS = [
  ["Content-Security-Policy", "스크립트·스타일·폰트를 불러올 수 있는 출처를 자기 도메인과 꼭 필요한 CDN으로 제한하고, object 태그와 다른 사이트의 iframe 삽입을 막습니다."],
  ["Strict-Transport-Security", "브라우저가 2년 동안 HTTPS로만 접속하도록 강제해 다운그레이드 공격을 막습니다."],
  ["X-Frame-Options: DENY", "다른 사이트가 이 페이지를 iframe으로 감싸는 클릭재킹을 막습니다. (CSP frame-ancestors 'none'과 함께 적용)"],
  ["X-Content-Type-Options: nosniff", "브라우저가 응답의 MIME 타입을 추측해 스크립트로 실행하는 것을 막습니다."],
  ["Referrer-Policy", "다른 사이트로 이동할 때 전체 URL 대신 출처만 전달합니다."],
  ["Permissions-Policy", "카메라, 마이크, 위치, 결제 API 사용을 모두 끕니다."],
  ["X-Powered-By 제거", "서버 프레임워크 정보를 응답 헤더에 노출하지 않습니다."],
];

const SECTIONS = [
  {
    title: "방명록 입력 처리",
    items: [
      "Server Action에서 zod로 이름 20자, 내용 300자 제한과 빈 값 여부를 서버에서 다시 검증합니다. 브라우저의 maxLength만 믿지 않습니다.",
      "출력은 React가 자동으로 이스케이프하므로 <script> 같은 입력이 실행되지 않습니다. dangerouslySetInnerHTML은 쓰지 않습니다.",
      "사람에게 보이지 않는 honeypot 입력칸으로 단순한 스팸 봇을 거릅니다.",
      "같은 IP에서 1분에 3개까지만 작성할 수 있습니다. IP 원문은 저장하지 않고 솔트를 섞은 SHA-256 해시만 저장하며, 조회 결과에서도 제외합니다.",
    ],
  },
  {
    title: "데이터베이스",
    items: [
      "Mongoose sanitizeFilter를 켜서 { \"$ne\": \"\" } 같은 연산자 객체가 쿼리에 주입되는 NoSQL Injection을 막습니다. 서버 코드에서 만든 연산자만 trusted()로 허용합니다.",
      "FormData 값은 문자열로 변환한 뒤 검증해, 객체나 배열이 그대로 DB에 전달되지 않게 합니다.",
      "MongoDB 연결 정보는 코드에 넣지 않고 환경 변수(.env.local, Vercel Environment Variables)로만 관리하며, .env 파일은 Git에 올리지 않습니다.",
      "DB 계정은 이 사이트가 쓰는 데이터베이스의 읽기·쓰기 권한만 갖도록 설정합니다.",
    ],
  },
  {
    title: "개인정보와 캐시 무효화",
    items: [
      "학번, 전화번호 등 개인정보는 DB와 코드 어디에도 저장하지 않습니다.",
      "캐시를 즉시 갱신하는 /api/revalidate는 비밀값(REVALIDATE_SECRET)이 맞을 때만 동작합니다.",
    ],
  },
];

export default function SecurityPage() {
  return (
    <>
      <PageHero label="Security" title="보안" accent="설계" desc="정보보호 전공자로서 이 포트폴리오 사이트 자체에 적용한 보안 설정을 정리했습니다." />

      <section>
        <SectionHeading label="HTTP Headers" title="HTTP" accent="보안 헤더" />
        <div className="mt-8 overflow-hidden rounded-2xl border border-line">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface-2 text-xs uppercase tracking-wider text-muted">
              <tr>
                <th scope="col" className="px-4 py-3 sm:px-6">헤더</th>
                <th scope="col" className="hidden px-4 py-3 sm:table-cell sm:px-6">역할</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line bg-surface">
              {HEADERS.map(([h, d]) => (
                <tr key={h} className="align-top">
                  <th scope="row" className="px-4 py-4 font-mono text-xs font-semibold text-accent sm:w-72 sm:px-6">
                    {h}
                    <p className="mt-2 font-sans text-sm font-normal leading-relaxed text-muted sm:hidden">{d}</p>
                  </th>
                  <td className="hidden px-4 py-4 leading-relaxed text-muted sm:table-cell sm:px-6">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          한계: Next.js는 정적으로 만든 페이지에 하이드레이션용 인라인 스크립트를 넣기 때문에, CSP의 script-src에 &apos;unsafe-inline&apos;을 허용했습니다.
          요청마다 nonce를 발급하면 막을 수 있지만, 모든 페이지를 매 요청마다 렌더링해야 해서 이 사이트에서는 적용하지 않았습니다.
        </p>
      </section>

      {SECTIONS.map((s) => (
        <section key={s.title} className="glow-card reveal mt-8 p-6 sm:p-8">
          <h2 className="font-display text-xl font-bold">{s.title}</h2>
          <ul className="mt-4 space-y-3">
            {s.items.map((it) => (
              <li key={it} className="flex gap-3 text-sm leading-relaxed text-muted sm:text-base">
                <span className="mt-0.5 text-accent" aria-hidden>▹</span>
                <span>{it}</span>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </>
  );
}
