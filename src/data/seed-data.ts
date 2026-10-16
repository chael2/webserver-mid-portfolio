/**
 * 초기 데이터 (기존 HTML 포트폴리오에서 옮겨온 내용)
 *
 * - `npm run seed` 실행 시 이 내용이 MongoDB에 upsert 됩니다.
 * - MONGODB_URI가 없을 때(로컬에서 DB 없이 실행할 때)는 화면이 이 데이터로 대신 그려집니다.
 * - 개인정보(학번, 전화번호, 개인 이메일 등)는 넣지 않습니다.
 */

export type ProjectCategory = "web" | "security" | "hardware" | "study";
export type ProjectKind = "personal" | "team" | "assignment";

export type ProjectSeed = {
  slug: string;
  title: string;
  badge?: string;
  summary: string;
  category: ProjectCategory;
  kind: ProjectKind;
  stack: string[];
  icon: string;
  githubUrl?: string;
  deployUrl?: string;
  highlights?: string[];
  isCurrentCourse?: boolean;
  isTeamFeature?: boolean;
  showOnGithub?: boolean;
  order: number;
};

export const profileSeed = {
  key: "main",
  name: "함유진",
  handle: "chael2",
  headline: "Information Security Student",
  intro:
    "정보보호학을 전공하는 미래의 보안 전문가. 악성코드 분석과 취약점 분석, 그리고 안전한 보안 생태계를 구축하기 위해 오늘도 굴러갑니다.",
  tagline:
    "어제보다 오늘 더 안전한 세상을 만들기 위해, 오늘도 탐구하고 성장하는 정보보호학과 학생 함유진입니다.",
  about:
    "정보보호학을 공부하며 끊임없이 문제를 분석하고 해결책을 찾아 기록하는 학생입니다. 시스템 내부에서 일어나는 비정상적인 흐름을 추적하는 악성코드 분석에 강한 매력을 느끼고 있습니다.",
  typingWords: ["정보보호학 학생", "취약점 분석가", "시큐어 코딩", "악성코드 연구원 지망생", "감자"],
  fields: [
    { label: "악성코드 분석 (Malware Analysis)", icon: "bug" },
    { label: "웹 시스템 보안 (Web Security)", icon: "shield" },
    { label: "리눅스 시스템 관리 (Linux System)", icon: "linux" },
    { label: "취약점 분석 (Vulnerability Analysis)", icon: "code" },
  ],
  links: {
    github: "https://github.com/chael2",
    blog: "https://chael2.tistory.com/",
  },
  blogTitle: "감자의 떼굴떼굴 굴러가는 블로그",
  blogDescription: "보안, Linux, 웹 개발에 대해 직접 공부하고 체득한 기술 지식 로그를 꾸준히 작성하고 있습니다.",
};

export const skillsSeed = [
  { name: "HTML5", group: "language", icon: "html", color: "#e34f26", note: "표준 마크업 & 기기별 반응형 최적화 설계", order: 0 },
  { name: "CSS3", group: "language", icon: "css", color: "#264de4", note: "CSS 변수 기반 테마 시스템 설계", order: 1 },
  { name: "JavaScript", group: "language", icon: "js", color: "#f7df1e", note: "Vanilla JS DOM 제어 및 인터랙션 구현", order: 2 },
  { name: "Python", group: "language", icon: "python", color: "#3776ab", note: "보안 스크립트 작성 및 취약점 분석 자동화", order: 3 },
  { name: "Java", group: "language", icon: "java", color: "#e76f00", note: "OOP 구조 개발 및 자료구조 핸들링", order: 4 },
  { name: "C / C++", group: "language", icon: "c", color: "#a8b5c0", note: "포인터·메모리 관리, 시큐어 코딩", order: 5 },
  { name: "Next.js", group: "framework", icon: "next", color: "#f3f0ff", note: "App Router, Server Actions 기반 풀스택 개발", order: 6 },
  { name: "MongoDB", group: "framework", icon: "mongo", color: "#10b981", note: "Mongoose 스키마 설계 및 데이터 연동", order: 7 },
  { name: "Linux", group: "tool", icon: "linux", color: "#f3f0ff", note: "권한 관리 및 시스템 명령어 활용", order: 8 },
  { name: "MySQL", group: "tool", icon: "db", color: "#4479a1", note: "관계형 DB 기초 및 SQL 작성", order: 9 },
  { name: "Git / GitHub", group: "tool", icon: "github", color: "#f3f0ff", note: "형상 관리 및 팀 협업", order: 10 },
  { name: "Kali Linux", group: "tool", icon: "shield", color: "#d946ef", note: "보안 진단 실습 환경 구성", order: 11 },
  { name: "VMware", group: "tool", icon: "server", color: "#06b6d4", note: "가상화 실습 환경 구축", order: 12 },
];

export const projectsSeed: ProjectSeed[] = [
  {
    slug: "portfolio-nextjs",
    title: "Chael2's Portfolio (Next.js + MongoDB)",
    badge: "웹서버프로그래밍 [NOW]",
    summary:
      "HTML/CSS 기말 포트폴리오를 Next.js App Router, MongoDB(Mongoose), Tailwind CSS로 재구축한 버전입니다. 프로젝트·기술 스택·팀 정보와 방명록을 DB에서 불러옵니다.",
    category: "web",
    kind: "assignment",
    stack: ["Next.js", "MongoDB", "Tailwind CSS", "Vercel"],
    icon: "next",
    githubUrl: "https://github.com/chael2/webserver-mid-portfolio",
    // TODO: Vercel 배포 후 deployUrl: "https://....vercel.app/" 추가하고 `npm run seed` 다시 실행
    isCurrentCourse: true,
    showOnGithub: true,
    order: 0,
  },
  {
    slug: "owasp-top10-demo",
    title: "OWASP Top 10 시연 및 방어 모의 웹사이트",
    badge: "웹서버프로그래밍 Team Project",
    summary:
      "SQL Injection, XSS 등 OWASP Top 10 주요 웹 취약점을 직접 체험하고, 같은 기능을 시큐어 코딩으로 막아낸 방어 로직과 나란히 비교해 볼 수 있는 모의 실습 웹사이트입니다.",
    category: "security",
    kind: "team",
    stack: ["Node.js", "MongoDB"],
    icon: "shield",
    // TODO: 저장소를 옮기면 githubUrl을 새 주소로 바꾸고 `npm run seed` 다시 실행
    githubUrl: "https://github.com/kimjungeunn/Web_Programming_Midterm_Demo",
    deployUrl: "https://web-programming-midterm-demo.vercel.app/",
    highlights: [
      "취약점 모의 실습: SQL Injection, XSS 등 OWASP Top 10 주요 웹 취약점 체험 페이지",
      "보안 방어 코드: 취약한 로직과 대비되는 시큐어 코딩 방어 로직 구현 및 비교",
      "시연 환경: 누구나 손쉽게 접속해 실습 내용을 직관적으로 확인할 수 있는 웹 환경",
    ],
    isCurrentCourse: true,
    isTeamFeature: true,
    showOnGithub: true,
    order: 1,
  },
  {
    slug: "web-pedia-final",
    title: "Web-Pedia v2 (웹 표준 & 모의 해킹 가이드 백과사전)",
    badge: "Team Project [FINAL] · 2026-1",
    summary:
      "중간 발표의 웹 표준 가이드를 기말 최종 리뉴얼하여, 핵심 보안 취약점(XSS, SQL Injection)에 대한 가상 대응을 시각적으로 학습할 수 있는 실시간 모의 퀴즈 엔진을 탑재한 협업 사이트입니다.",
    category: "security",
    kind: "team",
    stack: ["HTML", "CSS", "JavaScript"],
    icon: "shield",
    githubUrl: "https://github.com/chael2/web-fin-team",
    deployUrl: "https://web-fin-team.vercel.app/",
    showOnGithub: true,
    order: 2,
  },
  {
    slug: "web-pedia-mid",
    title: "Web-Pedia (중간)",
    badge: "Team Project [MID] · 2026-1",
    summary: "웹 표준 문법 및 보안 취약점 안내 백과사전. 팀 프로젝트 중간 협업 산출물입니다.",
    category: "web",
    kind: "team",
    stack: ["HTML", "CSS", "JavaScript"],
    icon: "shield",
    githubUrl: "https://github.com/chael2/web-mid-team",
    deployUrl: "https://web-mid-team.vercel.app/",
    showOnGithub: true,
    order: 3,
  },
  {
    slug: "portfolio-final",
    title: "Chael2's Portfolio (기말)",
    badge: "Portfolio [FINAL]",
    summary: "HTML/CSS/JS 기반 기말 포트폴리오 웹사이트. 해킹 터미널 추가 및 JS 기능 구현.",
    category: "web",
    kind: "assignment",
    stack: ["HTML", "CSS", "JavaScript"],
    icon: "id",
    githubUrl: "https://github.com/chael2/web-fin-portfolio",
    deployUrl: "https://chael2-fin-portfolio.vercel.app/",
    showOnGithub: true,
    order: 4,
  },
  {
    slug: "portfolio-mid",
    title: "Chael2's Portfolio (중간)",
    badge: "Portfolio [MID]",
    summary: "첫 개인 포트폴리오 웹사이트. HTML/CSS 기반 웹사이트.",
    category: "web",
    kind: "assignment",
    stack: ["HTML", "CSS"],
    icon: "id",
    githubUrl: "https://github.com/chael2/web-mid-portfolio",
    deployUrl: "https://web-mid-portfolio.vercel.app/",
    showOnGithub: true,
    order: 5,
  },
  {
    slug: "web-programming-demo",
    title: "Web Programming Demo",
    badge: "WebDemo",
    summary:
      "HTML, CSS, JavaScript 기초 연습 사이트. 로컬 실시간 시계 구현, 반응형 레이아웃 설계, 멀티미디어 태그 실습 등을 수록했습니다.",
    category: "web",
    kind: "assignment",
    stack: ["HTML", "CSS", "JavaScript"],
    icon: "html",
    githubUrl: "https://github.com/chael2/hcj1",
    deployUrl: "https://hcj1-five.vercel.app/",
    showOnGithub: true,
    order: 6,
  },
  {
    slug: "sql-sandbox",
    title: "SQL Injection Sandbox",
    badge: "Toy Project 1",
    summary:
      "SQL 인젝션 공격 구문을 직접 입력하고, DB 우회 동작 프로세스를 실시간 터미널 애니메이션으로 모니터링하는 시뮬레이터입니다.",
    category: "security",
    kind: "personal",
    stack: ["HTML", "CSS", "JavaScript"],
    icon: "terminal",
    githubUrl: "https://github.com/chael2/sql-sandbox",
    deployUrl: "/toys/sql-sandbox.html",
    order: 7,
  },
  {
    slug: "secure-todo",
    title: "Secure Task Manager",
    badge: "Toy Project 2",
    summary:
      "작전실 테마의 할 일 CRUD 및 일정 통제실. 로컬스토리지 데이터를 Access Key로 암호화(XOR/Base64) 보관하는 보안 특화 플래너입니다.",
    category: "security",
    kind: "personal",
    stack: ["HTML", "CSS", "JavaScript"],
    icon: "key",
    githubUrl: "https://github.com/chael2/secure-todo",
    deployUrl: "/toys/secure-todo.html",
    order: 8,
  },
  {
    slug: "arduino-switch",
    title: "Remote Light Switch",
    badge: "Arduino",
    summary:
      "Arduino 보드를 장착하고 제어 앱을 구현해 원격으로 조작이 가능한 지능형 전등 스위치 컨트롤러 하드웨어 프로젝트입니다.",
    category: "hardware",
    kind: "team",
    stack: ["C++", "Arduino"],
    icon: "chip",
    githubUrl: "https://github.com/SCProject-Tech/Arduino",
    order: 9,
  },
  {
    slug: "codeup-java",
    title: "codeup_java",
    badge: "Study",
    summary: "CodeUp Java 기초 100제 소스코드 저장소. 자바 프로그래밍 기본 알고리즘 학습 풀이 모음입니다.",
    category: "study",
    kind: "personal",
    stack: ["Java"],
    icon: "java",
    githubUrl: "https://github.com/chael2/codeup_java",
    showOnGithub: true,
    order: 10,
  },
];

/** 현재 팀 프로젝트(OWASP Top 10 시연 사이트) 팀원 — 학번 등 개인정보는 넣지 않음 */
export const teamSeed = [
  {
    name: "함유진",
    role: "팀장",
    color: "#d946ef",
    githubUrl: "https://github.com/chael2",
    blogUrl: "https://chael2.tistory.com/",
    portfolioUrl: "/",
    order: 0,
  },
  {
    name: "김정은",
    role: "팀원",
    color: "#06b6d4",
    githubUrl: "https://github.com/kimjungeunn",
    order: 1,
  },
  {
    name: "남유진",
    role: "팀원",
    color: "#10b981",
    githubUrl: "https://github.com/yoojin33",
    blogUrl: "https://blog.naver.com/quarter0330",
    portfolioUrl: "https://nyj-final.vercel.app/",
    order: 2,
  },
  {
    name: "박다혜",
    role: "팀원",
    color: "#f59e0b",
    order: 3,
  },
];

/** 이력 정보: 현재 팀 프로젝트 개발 과정 (진행 상황에 맞게 수정하세요) */
export const timelineSeed = [
  {
    step: 1,
    title: "기획 & 설계",
    description: "팀 구성 및 주제 선정(OWASP Top 10 시연 및 방어 모의 웹사이트). 실습할 취약점 항목과 역할 분담 결정.",
  },
  {
    step: 2,
    title: "취약점 모의 실습 페이지 구현",
    description: "SQL Injection, XSS 등 OWASP Top 10 주요 웹 취약점을 직접 체험할 수 있는 페이지 구현.",
  },
  {
    step: 3,
    title: "시큐어 코딩 방어 로직 적용",
    description: "취약한 로직과 대비되는 안전한 방어 코드를 구현하고, 두 결과를 비교 확인하는 기능 추가.",
  },
  {
    step: 4,
    title: "배포 및 시연 환경 구축",
    description: "Node.js + MongoDB 기반으로 누구나 접속해 실습 내용을 확인할 수 있도록 Vercel에 배포.",
  },
];

export const postsSeed = [
  {
    title: "[Linux] SSH 접속하기",
    tag: "Linux",
    summary: "SSH(Secure Shell)를 사용하여 원격 서버에 안전하게 접속하는 방법과 기초 명령어들을 정리했습니다.",
    url: "https://chael2.tistory.com/5",
    order: 0,
  },
  {
    title: "[Linux/RCity] Operation RCity0",
    tag: "CTF / Linux",
    summary: "레드플래그 RCity0 Linux 문제 풀이. 리눅스 명령어와 파일 시스템 구조를 활용한 문제 해결 과정.",
    url: "https://chael2.tistory.com/6",
    order: 1,
  },
  {
    title: "[Kali Linux] VMware에 설치하기",
    tag: "Kali Linux",
    summary: "Kali Linux를 VMware에 설치하는 방법과 초기 보안 설정에 대하여 핵심 내용을 정리했습니다.",
    url: "https://chael2.tistory.com/3",
    order: 2,
  },
];

export const blogCategories = [
  { name: "Linux", desc: "시스템 명령어, SSH, 파일 시스템", icon: "linux", url: "https://chael2.tistory.com/category/%5BLinux%5D" },
  { name: "Others", desc: "보안 문제 풀이, 취약점 분석, 자료구조", icon: "shield", url: "https://chael2.tistory.com/category/%5BOthers%5D" },
  { name: "Web", desc: "웹 개발, 프론트엔드, 백엔드", icon: "terminal", url: "https://chael2.tistory.com/category/%5BWeb%5D" },
];
