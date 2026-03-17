"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/container";
import home from "@/data/home.json";

type Course = (typeof home.courseShowcase)[number];

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); obs.disconnect(); }
      },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/** Drop a single course card by its index (0, 1, 2…) between any two sections */
export function CourseShowcaseCard({ index }: { index: number }) {
  const course = home.courseShowcase[index];
  if (!course) return null;
  return <CourseCard course={course} />;
}

function CourseCard({ course }: { course: Course }) {
  const { ref, visible } = useInView(0.12);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 0.8s ease",
      }}
      className="relative overflow-hidden min-h-120 sm:min-h-130 md:min-h-140 flex flex-col justify-between"
    >
      {/* Background image */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={course.imageUrl}
        alt={course.headline}
        draggable={false}
        className="absolute inset-0 w-full h-full object-cover select-none"
        style={{ objectPosition: "center" }}
      />

      {/* Dark overlay — strong at top and bottom, lighter in middle */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 40%, rgba(0,0,0,0.72) 100%)",
        }}
      />

      {/* Accent tint strip on left edge */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ background: course.accentColor }}
      />

      {/* ── TOP: eyebrow + headline + badge ── */}
      <div className="relative z-10 flex items-start justify-between gap-4 p-7 sm:p-10 pb-0">
        <div>
          <p
            className="text-[10px] sm:text-xs font-bold tracking-[0.28em] uppercase mb-3"
            style={{ color: course.accentColor }}
          >
            {course.eyebrow}
          </p>
          <h3 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-heading leading-tight tracking-tight">
            {course.headline}
          </h3>
          <p className="mt-2 text-white/60 text-sm sm:text-base max-w-md">
            {course.tagline}
          </p>

          {/* Meta pills */}
          <div className="flex flex-wrap items-center gap-2 mt-5">
            <span className="text-[11px] font-medium text-white/70 border border-white/20 px-3 py-1 rounded-full">
              ⏱ {course.duration}
            </span>
            <span className="text-[11px] font-medium text-white/70 border border-white/20 px-3 py-1 rounded-full">
              🖥 {course.mode}
            </span>
          </div>
        </div>

        {/* Badge */}
        <div
          className="shrink-0 mt-1 text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full"
          style={{ background: course.accentColor, color: "#fff" }}
        >
          {course.badge}
        </div>
      </div>

      {/* ── BOTTOM: feature grid + CTA ── */}
      <div className="relative z-10 p-7 sm:p-10 pt-8">
        {/* 2x2 feature mini-cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {course.features.map((feat, fi) => (
            <div
              key={fi}
              className="rounded-xl p-4 flex flex-col gap-2"
              style={{ background: "rgba(0,0,0,0.55)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <span className="text-xl">{feat.icon}</span>
              <span
                className="text-xs font-bold leading-tight"
                style={{ color: course.accentColor }}
              >
                {feat.title}
              </span>
              <p className="text-[11px] text-white/55 leading-relaxed">
                {feat.description}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <a
          href={course.cta.href}
          className="inline-flex items-center gap-2 px-7 py-3.5 text-sm font-bold uppercase tracking-widest text-white transition-all hover:opacity-85"
          style={{ background: course.accentColor }}
        >
          {course.cta.label}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>
    </div>
  );
}
