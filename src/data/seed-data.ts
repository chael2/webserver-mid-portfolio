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
  period?: string; // 예: "2026.09 – 2026.12"
  role?: string; // 본인 역할 한 줄
  contributions?: string[]; // 본인이 직접 한 일
  troubleshooting?: { problem: string; cause: string; solution: string; learned?: string }[];
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
  intro: "취약점 분석과 악성코드 분석에 관심이 많은 정보보호학 전공생입니다.",
  tagline: "취약점과 악성코드를 공부하는 정보보호학과 함유진입니다.",
  about:
    "취약점이 생기는 원리와 악성코드의 동작 방식에 관심이 많습니다. 직접 재현하고 분석한 내용을 코드와 글로 정리합니다.",
  typingWords: ["Vulnerability Analysis", "Malware Analysis", "Secure Coding"],
  fields: [
    { label: "취약점 분석", icon: "bug" },
    { label: "악성코드 분석", icon: "shield" },
    { label: "시스템 보안 (Linux)", icon: "linux" },
    { label: "시큐어 코딩", icon: "code" },
  ],
  links: {
    github: "https://github.com/chael2",
    blog: "https://chael2.tistory.com/",
    // TODO: 면접용 공개 이메일 주소를 넣으면 About·Footer에 연락처가 표시됩니다
    email: "",
  },
  blogTitle: "기술 블로그",
  blogDescription: "보안과 Linux를 공부하며 정리한 기록입니다.",
};

export const skillsSeed = [
  { name: "HTML5", group: "language", icon: "html", color: "#e34f26", note: "마크업", order: 0 },
  { name: "CSS3", group: "language", icon: "css", color: "#264de4", note: "스타일링", order: 1 },
  { name: "JavaScript", group: "language", icon: "js", color: "#f7df1e", note: "DOM 제어", order: 2 },
  { name: "Python", group: "language", icon: "python", color: "#3776ab", note: "분석 스크립트", order: 3 },
  { name: "Java", group: "language", icon: "java", color: "#e76f00", note: "객체지향 기초", order: 4 },
  { name: "C / C++", group: "language", icon: "c", color: "#a8b5c0", note: "메모리 구조 이해", order: 5 },
  { name: "Next.js", group: "framework", icon: "next", color: "#f3f0ff", note: "이 사이트 구현", order: 6 },
  { name: "MongoDB", group: "framework", icon: "mongo", color: "#10b981", note: "데이터 저장", order: 7 },
  { name: "Linux", group: "tool", icon: "linux", color: "#f3f0ff", note: "시스템 명령어", order: 8 },
  { name: "MySQL", group: "tool", icon: "db", color: "#4479a1", note: "SQL 기초", order: 9 },
  { name: "Git / GitHub", group: "tool", icon: "github", color: "#f3f0ff", note: "버전 관리", order: 10 },
  { name: "Kali Linux", group: "tool", icon: "shield", color: "#d946ef", note: "보안 실습 환경", order: 11 },
  { name: "VMware", group: "tool", icon: "server", color: "#06b6d4", note: "가상 분석 환경", order: 12 },
];

export const projectsSeed: ProjectSeed[] = [
  {
    slug: "webserver-assignments",
    title: "웹서버프로그래밍 실습",
    badge: "웹서버프로그래밍 · Personal",
    summary: "Next.js와 MongoDB로 회원가입·로그인, 공지사항 CRUD를 구현한 강의 실습.",
    category: "web",
    kind: "assignment",
    stack: ["Next.js", "MongoDB", "NextAuth"],
    icon: "next",
    githubUrl: "https://github.com/chael2/assignments-92410988",
    deployUrl: "https://assignments-92410988.vercel.app/",
    isCurrentCourse: true,
    showOnGithub: true,
    order: 0,
  },
  {
    slug: "portfolio-nextjs",
    title: "Chael2's Portfolio (Next.js + MongoDB)",
    badge: "웹서버프로그래밍",
    summary: "Next.js와 MongoDB로 다시 만든 개인 포트폴리오.",
    category: "web",
    kind: "assignment",
    stack: ["Next.js", "MongoDB", "Tailwind CSS", "Vercel"],
    icon: "next",
    githubUrl: "https://github.com/chael2/webserver-mid-portfolio",
    deployUrl: "https://webserver-mid-portfolio.vercel.app/",
    showOnGithub: true,
    order: 0,
  },
  {
    slug: "owasp-top10-demo",
    title: "OWASP Top 10 시연 및 방어 모의 웹사이트",
    badge: "웹서버프로그래밍 · Team",
    summary: "OWASP Top 10 취약점을 직접 시연하고, 방어 코드와 비교하는 모의 사이트.",
    category: "security",
    kind: "team",
    stack: ["Next.js", "MongoDB"],
    icon: "shield",
    // TODO: 저장소를 옮기면 githubUrl을 새 주소로 바꾸고 `npm run seed` 다시 실행
    githubUrl: "https://github.com/kimjungeunn/Web_Programming_Midterm_Demo",
    deployUrl: "https://web-programming-midterm-demo.vercel.app/",
    // TODO: 본인 역할·기여·트러블슈팅을 채우면 프로젝트 상세 페이지에 표시됩니다
    period: "",
    role: "",
    contributions: [],
    troubleshooting: [],
    highlights: [
      "취약점 실습: SQL Injection, XSS 등 체험 페이지",
      "방어 코드: 취약한 로직과 시큐어 코딩 비교",
      "시연 환경: 누구나 접속해 바로 확인",
    ],
    isCurrentCourse: true,
    isTeamFeature: true,
    showOnGithub: true,
    order: 1,
  },
  {
    slug: "web-pedia-final",
    title: "Web-Pedia v2",
    badge: "Team Project [FINAL] · 2026-1",
    summary: "웹 취약점 설명과 퀴즈를 담은 팀 백과사전 (기말).",
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
    summary: "웹 표준·보안 취약점 백과사전 (중간).",
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
    summary: "HTML/CSS/JS 포트폴리오 (기말).",
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
    summary: "첫 HTML/CSS 포트폴리오 (중간).",
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
    summary: "HTML·CSS·JS 기초 실습.",
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
    summary: "SQL Injection 공격과 Prepared Statement 방어 비교 시뮬레이터.",
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
    summary: "Access Key로 XOR·Base64 난독화해 저장하는 할 일 관리 도구.",
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
    summary: "Arduino 원격 전등 스위치.",
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
    summary: "CodeUp Java 기초 100제 풀이.",
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
    color: "#b3a6ff",
    githubUrl: "https://github.com/chael2",
    blogUrl: "https://chael2.tistory.com/",
    portfolioUrl: "/",
    order: 0,
  },
  {
    name: "김정은",
    role: "팀원",
    color: "#7fd4c4",
    githubUrl: "https://github.com/kimjungeunn",
    order: 1,
  },
  {
    name: "남유진",
    role: "팀원",
    color: "#9bb7ff",
    githubUrl: "https://github.com/yoojin33",
    blogUrl: "https://blog.naver.com/quarter0330",
    portfolioUrl: "https://nyj-final.vercel.app/",
    order: 2,
  },
  {
    name: "박다혜",
    role: "팀원",
    color: "#e2b866",
    order: 3,
  },
];

/** 이력 정보: 현재 팀 프로젝트 개발 과정 (진행 상황에 맞게 수정하세요) */
export const timelineSeed = [
  {
    step: 1,
    title: "기획 & 설계",
    description: "주제 선정과 역할 분담",
  },
  {
    step: 2,
    title: "취약점 실습 페이지 구현",
    description: "SQL Injection, XSS 등 취약점 체험 페이지",
  },
  {
    step: 3,
    title: "방어 로직 적용",
    description: "취약한 코드와 방어 코드 비교",
  },
  {
    step: 4,
    title: "배포",
    description: "Vercel 배포와 시연 환경 구성",
  },
];

export const postsSeed = [
  {
    title: "[Linux] SSH 접속하기",
    tag: "Linux",
    summary: "SSH 원격 접속과 기본 명령어 정리.",
    url: "https://chael2.tistory.com/5",
    order: 0,
  },
  {
    title: "[Linux/RCity] Operation RCity0",
    tag: "CTF / Linux",
    summary: "RCity0 Linux 문제 풀이.",
    url: "https://chael2.tistory.com/6",
    order: 1,
  },
  {
    title: "[Kali Linux] VMware에 설치하기",
    tag: "Kali Linux",
    summary: "VMware에 Kali Linux 설치와 초기 설정.",
    url: "https://chael2.tistory.com/3",
    order: 2,
  },
];

export const blogCategories = [
  { name: "Linux", desc: "명령어, SSH, 파일 시스템", icon: "linux", url: "https://chael2.tistory.com/category/%5BLinux%5D" },
  { name: "Others", desc: "문제 풀이, 취약점 분석", icon: "shield", url: "https://chael2.tistory.com/category/%5BOthers%5D" },
  { name: "Web", desc: "웹 개발 기록", icon: "terminal", url: "https://chael2.tistory.com/category/%5BWeb%5D" },
];
