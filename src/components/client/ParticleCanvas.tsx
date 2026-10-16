"use client";

import { useEffect, useRef } from "react";

type Node = { x: number; y: number; r: number; vx: number; vy: number; a: number; hue: number };

/** 사이버 네트워크 노드 배경 (기존 global.js initParticles 이식) */
export default function ParticleCanvas() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const isMobile = window.matchMedia("(max-width: 639px)").matches;
    const NUM = isMobile ? 28 : 55; // 모바일은 노드 수를 줄여 배터리·성능 보호
    const LINK = isMobile ? 100 : 125;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0;
    let H = 0;
    let lastW = 0;
    let raf = 0;
    let running = true;

    const size = (force = false) => {
      // 모바일 주소창 높이 변화(폭은 그대로)는 무시해서 깜빡임 방지
      if (!force && window.innerWidth === lastW) return;
      lastW = window.innerWidth;
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    size(true);

    const make = (): Node => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2 + 1,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      a: Math.random() * 0.25 + 0.08,
      hue: Math.random() > 0.5 ? 250 : 170, // 보라 / 청록
    });
    const nodes = Array.from({ length: NUM }, make);

    const loop = () => {
      if (!running) return;
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > W || p.y < 0 || p.y > H) nodes[i] = make();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 70%, 72%, ${p.a})`;
        ctx.fill();
      }
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d >= LINK) continue;
          const g = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          g.addColorStop(0, `hsla(${a.hue}, 85%, 60%, ${(1 - d / LINK) * 0.07})`);
          g.addColorStop(1, `hsla(${b.hue}, 85%, 60%, ${(1 - d / LINK) * 0.07})`);
          ctx.strokeStyle = g;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
      raf = requestAnimationFrame(loop);
    };
    loop();

    // 탭이 숨겨지면 애니메이션 정지
    const onVis = () => {
      running = !document.hidden;
      cancelAnimationFrame(raf);
      if (running) loop();
    };
    const onResize = () => size();
    window.addEventListener("resize", onResize);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />;
}
