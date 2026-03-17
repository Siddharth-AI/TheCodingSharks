"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/container";
import home from "@/data/home.json";

export function ComparisonSection() {
  const { comparison } = home;
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="bg-[#0a0a0a] py-16 sm:py-20 md:py-28 border-t border-white/5 overflow-hidden">
      <Container>

        {/* Header */}
        <div
          className="flex flex-col items-center text-center mb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(28px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}
        >
          <span className="inline-block text-[10px] font-bold tracking-[0.28em] text-primary uppercase border border-primary/30 px-4 py-1.5 mb-6">
            {comparison.eyebrow}
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white font-heading tracking-tight leading-tight">
            {comparison.headline1}
            <br />
            <span className="text-primary italic">{comparison.headline2}</span>
          </h2>
        </div>

        {/* Comparison table */}
        <div
          className="max-w-5xl mx-auto"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(36px)",
            transition: "opacity 0.7s ease 0.25s, transform 0.7s ease 0.25s",
          }}
        >
          {/* Column headers */}
          <div className="grid grid-cols-[1fr_56px_1fr] mb-2">
            {/* CodingSharks header */}
            <div className="bg-primary/10 border border-b-0 border-primary/40 px-6 py-5 flex items-center gap-3">
              <span className="text-2xl">🦈</span>
              <div>
                <p className="text-white font-bold text-lg leading-tight">{comparison.us.name}</p>
                <p className="text-primary text-xs font-medium tracking-wide mt-0.5">The better way</p>
              </div>
            </div>
            {/* VS badge */}
            <div className="flex items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center z-10">
                <span className="text-[10px] font-bold text-white/40 tracking-wider">VS</span>
              </div>
            </div>
            {/* Others header */}
            <div className="bg-white/3 border border-b-0 border-white/8 px-6 py-5 flex items-center gap-3">
              <div className="size-9 rounded-full bg-white/6 border border-white/10 flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M2 2l10 10M12 2L2 12" stroke="rgba(255,255,255,0.35)" strokeWidth="1.8" strokeLinecap="round"/>
                </svg>
              </div>
              <div>
                <p className="text-white/40 font-bold text-lg leading-tight">{comparison.them.name}</p>
                <p className="text-white/25 text-xs font-medium tracking-wide mt-0.5">Typical programs</p>
              </div>
            </div>
          </div>

          {/* Rows */}
          {comparison.us.points.map((point, i) => {
            const isLast = i === comparison.us.points.length - 1;
            return (
              <div
                key={i}
                className="grid grid-cols-[1fr_56px_1fr]"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0)" : "translateY(16px)",
                  transition: `opacity 0.5s ease ${0.35 + i * 0.08}s, transform 0.5s ease ${0.35 + i * 0.08}s`,
                }}
              >
                {/* Left — us */}
                <div
                  className={`bg-primary/6 border-x border-primary/40 px-6 py-5 flex items-center gap-3 ${isLast ? "border-b" : "border-b border-b-primary/15"}`}
                >
                  <svg className="shrink-0" width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <circle cx="11" cy="11" r="11" fill="#22c55e" fillOpacity="0.15"/>
                    <path d="M7 11.5l3 3 5.5-5.5" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-white/90 text-sm sm:text-[15px] leading-relaxed">{point}</span>
                </div>
                {/* Center separator */}
                <div className="flex items-center justify-center">
                  <div className="w-px h-full bg-white/6" />
                </div>
                {/* Right — them */}
                <div
                  className={`bg-white/2 border-x border-white/8 px-6 py-5 flex items-center gap-3 ${isLast ? "border-b" : "border-b border-b-white/5"}`}
                >
                  <svg className="shrink-0" width="22" height="22" viewBox="0 0 22 22" fill="none">
                    <circle cx="11" cy="11" r="11" fill="rgba(239,68,68,0.1)"/>
                    <path d="M7.5 7.5l7 7M14.5 7.5l-7 7" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                  <span className="text-white/30 text-sm sm:text-[15px] leading-relaxed line-through decoration-white/15">
                    {comparison.them.points[i]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
