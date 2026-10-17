# chael2 Portfolio — Next.js + MongoDB

기존 HTML/CSS 기말 포트폴리오(`web-fin-portfolio`)를 **Next.js 16 (App Router) + MongoDB (Mongoose) + Tailwind CSS v4**로 재구축한 버전입니다.

| 구분 | 내용 |
| --- | --- |
| 프레임워크 | Next.js 16.4 App Router, React 19, TypeScript |
| 데이터베이스 | MongoDB Atlas + Mongoose 9 |
| 스타일 | Tailwind CSS v4 (`src/app/globals.css`의 `@theme` 토큰으로 기존 Cyber Shield Purple 테마 유지) |
| 배포 | Vercel |

## 페이지

| 경로 | 내용 | 데이터 |
| --- | --- | --- |
| `/` | Hero, 보안 CLI 터미널, 현재 강의 실습 프로젝트, 허브 카드 | profile, projects, skills, team |
| `/about` | 프로필, Core Fields, 기술 스택 | profile, skills |
| `/projects` | 현재 강의 프로젝트(GitHub·배포 주소 분리 표기) + 전체 목록 필터 | projects |
| `/team` | 팀 프로젝트 배포 주소, 팀원 4명, 개발 타임라인 | team, projects, timeline |
| `/blog` | Tistory 블로그 링크, 카테고리, 최신 글 | profile, posts |
| `/github` | GitHub 프로필, 주요 저장소 | profile, projects |
| `/guestbook` | 방명록 작성(Server Action) / 목록 | guestbook |
| `/security` | 이 사이트에 적용한 보안 설정 | — |
| `/projects/[slug]` | 프로젝트 상세 (역할·기여·트러블슈팅) | projects |
| `/login`, `/admin` | 관리자 로그인, 방명록 삭제 | guestbook |
| `/toys/*.html` | SQL Injection Sandbox, Secure Task Manager (기존 토이 프로젝트 그대로) | — |
| `/api/projects`, `/api/guestbook` | JSON API (GET) | |


