"use client";
import { useRef } from "react";
export default function Tilt({ children, className = "", max = 5 }: { children: React.ReactNode; className?: string; max?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || window.matchMedia("(hover: none)").matches) return;
    const el = ref.current; if (!el) return; const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    el.style.transform = `rotateX(${-y * max}deg) rotateY(${x * max}deg) translateZ(3px)`;
  };
  const leave = () => { if (ref.current) ref.current.style.transform = ""; };
  return <div className="stage h-full"><div ref={ref} onMouseMove={move} onMouseLeave={leave} className={`tilt rounded-2xl bg-panel border border-edge ${className}`}>{children}</div></div>;
}
