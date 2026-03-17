"use client";

import { useState } from "react";
import { Container } from "@/components/layout/container";

/* ─── Image data ────────────────────────────────────────────── */
const IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=900&q=80",
    alt: "Community event on stage",
  },
  {
    src: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=900&q=80",
    alt: "Students celebrating together",
  },
  {
    src: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=900&q=80",
    alt: "Batch group photo",
  },
  {
    src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=900&q=80",
    alt: "Mentor session",
  },
  {
    src: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=900&q=80",
    alt: "Team working together",
  },
  {
    src: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=900&q=80",
    alt: "Coding session",
  },
  {
    src: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=900&q=80",
    alt: "Placement celebration",
  },
];

/* duplicate once for seamless infinite loop */
const STRIP = [...IMAGES, ...IMAGES];

export function CommunitySection() {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 md:py-24 bg-linear-to-b from-[#fff7ee] via-[#fffbf7] to-white border-t border-orange-100">
      {/* bg glow */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-20 left-1/2 -translate-x-1/2 h-72 w-175 rounded-full bg-orange-100/60 blur-[120px]" />
      </div>

      {/*
        Invisible SVG — defines the curved clip shape using objectBoundingBox
        so it scales to whatever size the strip container is.

        Shape: left & right edges are full height,
               top & bottom edges curve INWARD at center (like a TV/cinema screen).

        Top path:  M 0,0  → Q 0.5, 0.11  → 1,0    (dips down 11% at center)
        Bottom path:       Q 0.5, 0.89   → 0,1    (rises up 11% at center)
      */}
      <svg width="0" height="0" className="absolute" aria-hidden>
        <defs>
          <clipPath id="tv-curve" clipPathUnits="objectBoundingBox">
            <path d="M0,0 Q0.5,0.22 1,0 L1,1 Q0.5,0.78 0,1 Z" />
          </clipPath>
        </defs>
      </svg>

      {/* ── Header ── */}
      <Container>
        <div className="flex flex-col items-center text-center mb-12 sm:mb-14">
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-primary uppercase mb-3">
            Our Community
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-gray-900 font-heading tracking-tight">
            Be A Part Of Our <br className="hidden sm:block" />
            Thriving Community
          </h2>
          <p className="mt-4 text-sm sm:text-base text-gray-500 max-w-lg">
            10,000+ learners. Real friendships. Cohort sprints, demo days, and
            memories that last beyond the program.
          </p>
        </div>
      </Container>

      {/* ── Filmstrip wrapper ──────────────────────────────────────
          • overflow-hidden  → hides the horizontal overflow of the scrolling strip
          • clipPath tv-curve → carves the curved TV-screen shape on top & bottom
          • fixed height     → objectBoundingBox coordinates need a known height
      ─────────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden h-52 sm:h-64 md:h-80 lg:h-96"
        style={{ clipPath: "url(#tv-curve)" }}>

        {/* Left gradient fade — same bg colour so it blends cleanly */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 sm:w-36 z-20 bg-linear-to-r from-[#fff7ee] to-transparent"
        />
        {/* Right gradient fade */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 sm:w-36 z-20 bg-linear-to-l from-white to-transparent"
        />

        {/*
          Scrolling strip
          – animate-marquee-left keyframe: translateX(0) → translateX(-50%)
          – animationDuration overrides the global 32s default
          – animationPlayState pauses cleanly without breaking the translate position
        */}
        <div
          className="flex h-full gap-3 animate-marquee-left"
          style={{
            animationDuration: "22s",
            animationPlayState: paused ? "paused" : "running",
          }}>
          {STRIP.map((img, i) => {
            /* map each duplicated tile back to its 0-based image index */
            const logicalIdx = i % IMAGES.length;
            const isHovered = hoveredIdx === logicalIdx;
            const isOther = hoveredIdx !== null && !isHovered;

            return (
              /* GPU-friendly: only transform + filter — no layout reflow */
              <div
                key={i}
                onMouseEnter={() => {
                  setHoveredIdx(logicalIdx);
                  setPaused(true);
                }}
                onMouseLeave={() => {
                  setHoveredIdx(null);
                  setPaused(false);
                }}
                className="relative h-full w-64 sm:w-72 md:w-80 shrink-0 overflow-hidden rounded-2xl shadow-md cursor-pointer"
                style={{
                  transform: isHovered
                    ? "scale(1.1)"
                    : isOther
                    ? "scale(0.92)"
                    : "scale(1)",
                  filter: isOther ? "blur(2px) brightness(0.75)" : "none",
                  transition:
                    "transform 0.4s cubic-bezier(0.25,0.46,0.45,0.94), filter 0.35s ease",
                  zIndex: isHovered ? 20 : 1,
                }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img.src}
                  alt={img.alt}
                  draggable={false}
                  className="h-full w-full select-none object-cover"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
