/** 첫 화면이 그려지기 전에 실행되는 인라인 스크립트 (테마 깜빡임 방지용) */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
