"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type Line = { id: number; kind?: "input" | "error"; content: ReactNode };

type Props = {
  profile: { name: string; handle: string; headline?: string };
  skills: { name: string; note?: string }[];
  projects: { title: string; badge?: string; summary: string; kind: string; deployUrl?: string; githubUrl?: string }[];
};

const HELP: [string, string][] = [
  ["about", "전공 분야 및 프로필 정보 출력"],
  ["skills", "보유 핵심 기술 분석 데이터 로드 (DB)"],
  ["projects", "프로젝트 목록 출력 (DB)"],
  ["security", "이 사이트에 적용한 보안 설정 보기"],
  ["toy1 / toy2", "보안 토이 프로젝트 정보 출력"],
  ["clear", "콘솔 로그 초기화"],
];

const KIND_LABEL: Record<string, string> = { team: "팀", personal: "개인", assignment: "과제" };

/** 보안 CLI 터미널 (기존 js/terminal.js를 React 상태 기반으로 이식, skills/projects는 DB 데이터 사용) */
export default function CyberTerminal({ profile, skills, projects }: Props) {
  const introLine = (id: number): Line => ({ id, content: <Intro name={profile.name} handle={profile.handle} /> });
  const [lines, setLines] = useState<Line[]>(() => [introLine(0)]);
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [hIdx, setHIdx] = useState(-1);
  const idRef = useRef(0);
  const timers = useRef<ReturnType<typeof setInterval>[]>([]);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const nextId = () => ++idRef.current;
  const push = useCallback((content: ReactNode, kind?: Line["kind"]) => {
    const id = nextId();
    setLines((ls) => [...ls, { id, kind, content }]);
    return id;
  }, []);
  const stopTimers = () => {
    timers.current.forEach((t) => clearInterval(t));
    timers.current = [];
  };

  // 언마운트 시 진행 중인 애니메이션 타이머 정리
  useEffect(() => stopTimers, []);

  // 새 줄이 생기면 터미널 안에서만 맨 아래로 스크롤 (페이지 전체는 움직이지 않음)
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const showSecurity = () => {
    push(
      <div className="mt-1 text-xs leading-6">
        <span className="font-bold text-secondary">[SECURITY CONFIG]</span>
        <br />- HTTP 보안 헤더: CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy
        <br />- 방명록: zod 서버 검증, React 출력 이스케이프, honeypot, IP 해시 기준 1분 3회 제한
        <br />- DB: Mongoose sanitizeFilter로 NoSQL Injection 방지, 비밀 정보는 환경 변수로 관리
        <br />-{" "}
          <a href="/security" className="font-bold text-success underline">
            자세히 보기 (/security)
          </a>
      </div>,
    );
  };

  const toy = (slugTitle: string, label: string) => {
    const p = projects.find((x) => x.title === slugTitle);
    if (!p) return push("해당 프로젝트 정보를 찾을 수 없습니다.", "error");
    push(
      <div className="mt-1 text-xs leading-6">
        <span className="font-bold text-accent">[{label}]</span>
        <br />- <span className="text-secondary">Description:</span> {p.summary}
        {p.deployUrl && (
          <>
            <br />-{" "}
            <a href={p.deployUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-success underline">
              [Open Live Demo]
            </a>
          </>
        )}
      </div>,
    );
  };

  const run = (raw: string) => {
    const cmd = raw.trim().toLowerCase();
    push(
      <>
        <span className="text-accent">&gt; {profile.handle}.dev $</span> {raw}
      </>,
      "input",
    );
    if (!cmd) return;

    switch (cmd) {
      case "help":
        push(
          <table className="mt-1 w-full text-xs leading-6">
            <tbody>
              {HELP.map(([c, d]) => (
                <tr key={c}>
                  <td className="w-24 pr-2 align-top text-accent">{c}</td>
                  <td className="text-muted">{d}</td>
                </tr>
              ))}
            </tbody>
          </table>,
        );
        break;
      case "about":
        push(
          <div className="mt-1 leading-7">
            <span className="font-bold text-secondary">[PROFILE]</span>
            <br />- <span className="text-accent">Name:</span> {profile.name}({profile.handle}.dev)
            <br />- <span className="text-accent">Major:</span> 정보보호학 전공
            <br />- <span className="text-accent">Focus:</span> 웹 보안, 시큐어 코딩, 악성코드 분석
          </div>,
        );
        break;
      case "skills":
        push(
          <div className="mt-1 text-xs leading-6">
            <span className="font-bold text-secondary">[SKILLS · MongoDB]</span>
            {skills.map((s) => (
              <div key={s.name}>
                - <span className="text-accent">{s.name}</span> : {s.note}
              </div>
            ))}
          </div>,
        );
        break;
      case "projects":
        push(
          <div className="mt-1 text-xs leading-6">
            <span className="font-bold text-secondary">[PROJECTS · MongoDB]</span>
            {projects.map((p, i) => (
              <div key={p.title}>
                {i + 1}. <span className="font-semibold text-accent">{p.title}</span>{" "}
                <span className="text-muted">({KIND_LABEL[p.kind] ?? p.kind})</span>
              </div>
            ))}
          </div>,
        );
        break;
      case "security":
      case "scan":
        showSecurity();
        break;
      case "toy1":
        toy("SQL Injection Sandbox", "TOY PROJECT 1 - SQL INJECTION SANDBOX");
        break;
      case "toy2":
        toy("Secure Task Manager", "TOY PROJECT 2 - SECURE TASK MANAGER");
        break;
      case "clear":
        stopTimers();
        setLines([introLine(nextId())]);
        break;
      default:
        push(
          <>
            Command not found: &quot;{raw}&quot;. Type <span className="text-secondary">&quot;help&quot;</span> for a list of available commands.
          </>,
          "error",
        );
    }
  };

  return (
    <div
      className="animate-fade-up overflow-hidden rounded-xl border border-line-strong bg-terminal font-mono text-[#f3f0ff] shadow-[0_20px_50px_rgb(0_0_0/0.6),0_0_15px_rgb(217_70_239/0.35)]"
      onClick={() => inputRef.current?.focus({ preventScroll: true })}
    >
      <div className="flex items-center justify-between border-b border-line bg-[rgb(15_6_36/0.9)] px-4 py-3">
        <div className="flex gap-1.5" aria-hidden>
          <span className="size-[11px] rounded-full bg-[#ef4444]" />
          <span className="size-[11px] rounded-full bg-[#f59e0b]" />
          <span className="size-[11px] rounded-full bg-[#10b981]" />
        </div>
        <span className="text-xs tracking-wider text-[#a69cc0]">{profile.handle}@portfolio: ~</span>
      </div>

      <div
        ref={bodyRef}
        className="terminal-scroll h-72 overflow-y-auto p-4 text-[13px] leading-relaxed sm:h-80 sm:p-5"
        role="log"
        aria-live="polite"
      >
        {lines.map((l) => (
          <div key={l.id} className={`mb-2.5 break-words ${l.kind === "error" ? "text-[#f87171]" : ""}`}>
            {l.content}
          </div>
        ))}

        <form
          className="flex items-center gap-1.5"
          onSubmit={(e) => {
            e.preventDefault();
            run(value);
            if (value.trim()) setHistory((h) => [value, ...h].slice(0, 30));
            setHIdx(-1);
            setValue("");
          }}
        >
          <label htmlFor="cli" className="shrink-0 text-accent">
            {profile.handle} $
          </label>
          <input
            id="cli"
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowUp" && history.length) {
                e.preventDefault();
                const i = Math.min(hIdx + 1, history.length - 1);
                setHIdx(i);
                setValue(history[i]);
              } else if (e.key === "ArrowDown") {
                e.preventDefault();
                const i = hIdx - 1;
                setHIdx(Math.max(i, -1));
                setValue(i >= 0 ? history[i] : "");
              }
            }}
            placeholder="help 입력"
            autoComplete="off"
            autoCapitalize="none"
            spellCheck={false}
            enterKeyHint="send"
            className="min-w-0 flex-1 bg-transparent text-[16px] text-secondary caret-secondary outline-none placeholder:text-[#6b608c] sm:text-[13px]"
          />
        </form>
      </div>
    </div>
  );
}

function Intro({ name, handle }: { name: string; handle: string }) {
  return (
    <div>
      <div className="font-bold text-accent">{handle}@portfolio ~ $</div>
      <div className="mt-1">{name}({handle})의 포트폴리오 터미널입니다. 프로젝트와 기술 스택을 DB에서 불러와 보여 줍니다.</div>
      <div className="mt-2">
        사용 가능한 명령어 목록을 보시려면 <span className="text-secondary">&quot;help&quot;</span>를 입력하세요.
      </div>
      <hr className="my-3 border-dashed border-[rgb(147_51_234/0.25)]" />
    </div>
  );
}
