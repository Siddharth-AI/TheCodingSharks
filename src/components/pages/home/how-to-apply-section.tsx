"use client";

import { useEffect, useRef, useState } from "react";
import { Container } from "@/components/layout/container";
import home from "@/data/home.json";
import { ApplyNowButton } from "@/components/common/apply-now-button";

/* ─── Pac-man SVG marker — inline so we can recolor it ─── */
function StepMarker({ number, visible, delay }: { number: number; visible: boolean; delay: number }) {
  return (
    <div
      className="relative shrink-0"
      style={{
        transform: visible ? "scale(1)" : "scale(0)",
        opacity: visible ? 1 : 0,
        transition: `transform 0.5s cubic-bezier(0.34,1.56,0.64,1) ${delay}s, opacity 0.4s ease ${delay}s`,
      }}>
      {/* The pac-man SVG shape — recolored to primary orange */}
      <svg width="52" height="66" viewBox="0 0 52 66" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M37.9032 38.1109C42.5467 35.4014 45.9454 30.987 47.3578 25.8265C48.7785 20.6356 48.073 15.115 45.3965 10.4792C42.72 5.84339 38.2918 2.47213 33.086 1.10703C27.8802 -0.258068 22.3233 0.494827 17.6376 3.20008L17.6418 3.20729C13.8109 5.43323 10.4473 8.37896 7.74073 11.8789C5.01476 15.4039 3.00856 19.422 1.83668 23.7038C0.66479 27.9856 0.350164 32.4473 0.910766 36.8341C1.47137 41.2209 2.89622 45.4469 5.10396 49.2708C7.3117 53.0947 10.2591 56.4417 13.7779 59.1206C17.2967 61.7995 21.3179 63.7578 25.612 64.8839C29.9061 66.0099 34.389 66.2815 38.8047 65.6832C43.2204 65.085 47.4824 63.6285 51.3475 61.397L37.9032 38.1109Z"
          fill="#ff6b2c"
        />
      </svg>
      {/* Number centered on the shape */}
      <span className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg pb-1">
        {number}
      </span>
    </div>
  );
}

export function HowToApplySection() {
  const { howToApply } = home;
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  /* Trigger animations once when scrolled into view */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-16 sm:py-20 md:py-24 bg-linear-to-b from-[#fff7ee] via-[#fffbf7] to-white border-t border-orange-100">

      <Container>
        {/* ── Header ── */}
        <div
          className="mb-16 sm:mb-20 flex flex-col items-center text-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(24px)",
            transition: "opacity 0.6s ease, transform 0.6s ease",
          }}>
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-primary uppercase mb-4">
            {howToApply.eyebrow}
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 font-heading tracking-tight">
            {howToApply.headline1}{" "}
            <span className="text-primary italic">{howToApply.headline2}</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-gray-500 max-w-lg">
            {howToApply.subline}
          </p>
        </div>

        {/* ── DESKTOP Timeline ── */}
        <div className="hidden md:block">
          {/* Number row with connecting line */}
          <div className="relative flex items-center justify-between px-0">

            {/* Animated connecting line — draws left to right */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-gray-200 overflow-hidden">
              <div
                className="h-full bg-primary"
                style={{
                  width: visible ? "100%" : "0%",
                  transition: "width 1.4s cubic-bezier(0.4,0,0.2,1) 0.3s",
                }}
              />
            </div>

            {/* Step markers */}
            {howToApply.steps.map((_, i) => (
              <StepMarker
                key={i}
                number={i + 1}
                visible={visible}
                delay={0.4 + i * 0.15}
              />
            ))}
          </div>

          {/* Text row — below the markers */}
          <div className="mt-10 grid grid-cols-5 gap-6">
            {howToApply.steps.map((step, i) => {
              const isLast = i === howToApply.steps.length - 1;
              return (
                <div
                  key={i}
                  className="flex flex-col gap-3"
                  style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0)" : "translateY(20px)",
                    transition: `opacity 0.5s ease ${0.7 + i * 0.12}s, transform 0.5s ease ${0.7 + i * 0.12}s`,
                  }}>
                  <h3 className={`text-base font-bold leading-snug ${isLast ? "text-primary" : "text-gray-900"}`}>
                    {step.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {step.description}
                  </p>
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    {step.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-[10px] font-medium px-2 py-0.5 border ${
                          isLast
                            ? "border-primary/40 text-primary bg-primary/10"
                            : "border-gray-200 text-gray-500 bg-white"
                        }`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── MOBILE: vertical steps ── */}
        <div className="md:hidden flex flex-col gap-0">
          {howToApply.steps.map((step, i) => {
            const isLast = i === howToApply.steps.length - 1;
            return (
              <div
                key={i}
                className="flex gap-5"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateX(0)" : "translateX(-16px)",
                  transition: `opacity 0.5s ease ${0.3 + i * 0.1}s, transform 0.5s ease ${0.3 + i * 0.1}s`,
                }}>
                {/* Left: marker + line */}
                <div className="flex flex-col items-center shrink-0">
                  <StepMarker number={i + 1} visible={visible} delay={0.3 + i * 0.1} />
                  {!isLast && <div className="w-px flex-1 bg-primary/40 my-2 min-h-7" />}
                </div>
                {/* Right: text */}
                <div className={`${isLast ? "pb-0" : "pb-8"} pt-2`}>
                  <h3 className={`text-base font-bold leading-snug ${isLast ? "text-primary" : "text-gray-900"}`}>
                    {step.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-500 leading-relaxed">{step.description}</p>
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {step.tags.map((tag) => (
                      <span
                        key={tag}
                        className={`text-[10px] font-medium px-2 py-0.5 border ${
                          isLast
                            ? "border-primary/40 text-primary bg-primary/10"
                            : "border-gray-200 text-gray-500 bg-white"
                        }`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* CTA */}
        <div
          className="mt-14 flex justify-center"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(16px)",
            transition: "opacity 0.5s ease 1.5s, transform 0.5s ease 1.5s",
          }}>
          <ApplyNowButton
            source="how-to-apply"
            className="inline-flex items-center gap-2 bg-primary px-8 py-4 text-sm font-bold text-white uppercase tracking-widest hover:bg-primary/85 transition-colors">
            Apply Now — Free
          </ApplyNowButton>
        </div>
      </Container>
    </section>
  );
}
