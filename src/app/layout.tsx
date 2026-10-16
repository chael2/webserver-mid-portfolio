import type { Metadata, Viewport } from "next";
import Navbar from "@/components/client/Navbar";
import Footer from "@/components/Footer";
import ParticleCanvas from "@/components/client/ParticleCanvas";
import Effects from "@/components/client/Effects";
import { InlineScript } from "@/components/InlineScript";
import { getProfile } from "@/lib/queries";
// 폰트는 npm 패키지(@fontsource)로 자체 호스팅 → 외부 요청 없이 빌드·표시
import "@fontsource/syne/latin-600.css";
import "@fontsource/syne/latin-700.css";
import "@fontsource/syne/latin-800.css";
import "@fontsource/noto-sans-kr/400.css";
import "@fontsource/noto-sans-kr/500.css";
import "@fontsource/noto-sans-kr/700.css";
import "@fontsource/fira-code/latin-400.css";
import "@fontsource/fira-code/latin-700.css";
import "./globals.css";


export const metadata: Metadata = {
  title: { default: "chael2 · Portfolio Dashboard", template: "%s · chael2" },
  description: "정보보호학 전공자 chael2(함유진)의 포트폴리오 — 프로젝트, 기술 스택, 팀 프로젝트, 방명록",
  openGraph: { title: "chael2 · Portfolio Dashboard", type: "website", locale: "ko_KR" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#05010d" },
    { media: "(prefers-color-scheme: light)", color: "#f6f3fc" },
  ],
};

// 첫 페인트 전에 저장된 테마 적용 (깜빡임 방지)
const themeScript = `try{if(localStorage.getItem("site_theme")==="light")document.documentElement.dataset.theme="light"}catch(e){}`;

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const profile = await getProfile();
  return (
    <html lang="ko" suppressHydrationWarning>
      <head>
        <InlineScript html={themeScript} />
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="flex min-h-dvh flex-col font-sans antialiased">
        <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-white">
          본문으로 건너뛰기
        </a>
        <div className="scan-line" aria-hidden />
        <div id="page-progress" aria-hidden className="fixed left-0 top-0 z-[70] h-[3px] w-full origin-left scale-x-0 bg-gradient-to-r from-primary via-secondary to-accent" />
        <ParticleCanvas />
        <Effects />
        <Navbar handle={profile.handle} />
        <main id="main" className="relative z-10 mx-auto w-full max-w-6xl flex-1 px-4 pb-24 pt-24 sm:px-6 sm:pt-28 lg:px-8">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
