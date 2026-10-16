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

## 처음 실행하기

```bash
npm install
cp .env.example .env.local   # Windows PowerShell: copy .env.example .env.local
# .env.local 의 MONGODB_URI 를 Atlas 연결 문자열로 바꾸기
npm run seed                 # 기존 사이트 내용을 DB에 입력
npm run dev                  # http://localhost:3000
```

`MONGODB_URI`가 없어도 `npm run dev`는 동작합니다. 이 경우 화면은 `src/data/seed-data.ts` 내용으로 그려지고, 방명록만 "DB 미연결"로 표시됩니다.

## 관리자 로그인 설정

```bash
npm run hash-password -- "10자 이상의 비밀번호"
```

출력된 `ADMIN_PASSWORD_HASH`, `SESSION_SECRET` 두 줄을 `.env.local`(로컬)과 Vercel 환경 변수에 넣고, `ADMIN_USERNAME`도 정해 주세요. 페이지 하단 자물쇠 아이콘 → `/login`에서 로그인하면 `/admin`에서 방명록 글을 삭제할 수 있습니다.

## 데이터 수정

1. `src/data/seed-data.ts`를 고칩니다 (예: 새 GitHub 저장소·배포 주소).
2. `npm run seed`로 DB에 반영합니다 (upsert라 여러 번 실행해도 중복 없음).
3. 배포된 사이트는 최대 1시간 안에 갱신됩니다. 바로 반영하려면:
   ```bash
   curl -X POST "https://<배포주소>/api/revalidate?secret=<REVALIDATE_SECRET>"
   ```

## 구조

```text
src/
├─ app/                  # 페이지(App Router), API Routes, Server Action
│  └─ guestbook/actions.ts
├─ components/           # 서버 컴포넌트 (카드, 링크 버튼, 아이콘)
│  └─ client/            # 클라이언트 컴포넌트 (터미널, 파티클, 메뉴, 필터, 방명록 폼)
├─ lib/db.ts             # MongoDB 연결 (전역 캐시)
├─ lib/queries.ts        # 데이터 조회 ('use cache' + cacheTag)
├─ models/               # Mongoose 스키마 7개
└─ data/seed-data.ts     # 초기 데이터
scripts/seed.ts          # npm run seed
public/toys/             # 토이 프로젝트 HTML
```

## Vercel 배포

1. MongoDB Atlas에서 무료 클러스터 생성 → Database Access에서 사용자 생성 → Network Access에 `0.0.0.0/0` 허용
2. GitHub에 이 저장소 push
3. Vercel → Add New → Project → 저장소 Import (설정은 기본값)
4. Settings → Environment Variables에 `.env.example`의 값들(`MONGODB_URI`, `MONGODB_DB`, `REVALIDATE_SECRET`, `IP_HASH_SALT`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`, `SESSION_SECRET`) 등록 후 Redeploy

빌드할 때 DB를 읽어 페이지를 미리 만들기 때문에, Vercel 환경 변수를 넣지 않고 배포하면 seed-data로 만들어집니다.

## 보안 메모

- `.env.local`은 커밋되지 않습니다 (`.gitignore`).
- 방명록은 zod로 길이·형식을 서버에서 검증하고, React가 출력을 자동 이스케이프해 XSS를 막습니다. honeypot 칸으로 단순 봇을 거릅니다.
- 학번·전화번호 등 개인정보는 DB와 코드 어디에도 두지 않습니다.
