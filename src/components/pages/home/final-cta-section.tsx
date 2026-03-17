"use client";

import home from "@/data/home.json";
import { ApplyNowButton } from "@/components/common/apply-now-button";

/* Fixed positions for the scattered floating images */
const POSITIONS = [
  { top: "6%",  left: "4%",   rotate: "-6deg",  scale: 0.92, blur: 2 },
  { top: "4%",  left: "38%",  rotate: "3deg",   scale: 1,    blur: 0 },
  { top: "5%",  left: "70%",  rotate: "5deg",   scale: 0.95, blur: 2 },
  { top: "42%", left: "2%",   rotate: "4deg",   scale: 0.88, blur: 3 },
  { top: "44%", left: "76%",  rotate: "-4deg",  scale: 0.9,  blur: 3 },
  { top: "68%", left: "12%",  rotate: "-3deg",  scale: 0.93, blur: 2 },
  { top: "65%", left: "48%",  rotate: "6deg",   scale: 0.87, blur: 2 },
  { top: "66%", left: "78%",  rotate: "-5deg",  scale: 0.95, blur: 1 },
];

export function FinalCtaSection() {
  const { finalCta } = home;

  return (
    <section className="relative bg-[#0a0a0a] overflow-hidden border-t border-white/5" style={{ minHeight: "480px" }}>

      {/* Scattered background images — only on sm+ screens */}
      <div className="hidden sm:block">
        {finalCta.images.map((src, i) => {
          const pos = POSITIONS[i % POSITIONS.length];
          return (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={src}
              alt=""
              draggable={false}
              className="absolute select-none pointer-events-none rounded-xl object-cover"
              style={{
                top: pos.top,
                left: pos.left,
                width: "160px",
                height: "200px",
                transform: `rotate(${pos.rotate}) scale(${pos.scale})`,
                filter: `grayscale(30%) blur(${pos.blur}px)`,
                opacity: 0.35,
              }}
            />
          );
        })}
      </div>

      {/* Dark radial overlay to darken edges and let center text pop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 50%, transparent 0%, rgba(10,10,10,0.92) 100%)",
        }}
      />

      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-5 sm:px-6 py-20 sm:py-28 md:py-36">
        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white font-heading tracking-tight leading-tight max-w-3xl">
          {finalCta.headline1}{" "}
          <span className="text-primary italic">{finalCta.headline2}</span>
        </h2>
        <p className="mt-5 text-sm sm:text-base text-white/50 max-w-md">
          {finalCta.subline}
        </p>
        <ApplyNowButton
          source="final-cta"
          className="mt-10 inline-flex items-center gap-2 bg-primary px-10 py-4 text-sm font-bold text-white uppercase tracking-widest hover:bg-primary/85 transition-colors"
        >
          {finalCta.cta.label}
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </ApplyNowButton>
      </div>
    </section>
  );
}
