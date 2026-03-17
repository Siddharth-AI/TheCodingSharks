"use client";

import { useState } from "react";
import { Container } from "@/components/layout/container";
import home from "@/data/home.json";

type Mentor = (typeof home.mentors)[number];

const CARD_HEIGHT = 460;
const ACTIVE_W   = 700;
const INACTIVE_W = 130;

export function MentorsSection() {
  const [active, setActive] = useState<number>(0);
  const [mobileOpen, setMobileOpen] = useState<number | null>(0);
  const mentors = home.mentors;

  return (
    <section
      className="bg-[#0a0a0a] py-16 sm:py-20 md:py-24 border-t border-white/5"
      style={{ minHeight: undefined }}>

      {/* Header */}
      <Container>
        <div className="flex flex-col items-center text-center mb-12">
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-primary uppercase mb-3">
            Advisory Committee
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-white font-heading tracking-tight">
            We&apos;re Guided by Top Leaders
          </h2>
        </div>
      </Container>

      {/* ── MOBILE layout (hidden on md+) ── */}
      <div className="md:hidden px-4 space-y-3">
        {mentors.map((mentor, i) => {
          const isOpen = mobileOpen === i;
          return (
            <div
              key={mentor.name}
              className="border border-white/10 overflow-hidden"
              style={{ borderRadius: 6, borderColor: isOpen ? "rgba(var(--color-primary-rgb,255,107,44),0.4)" : undefined }}>
              {/* Card header — always visible */}
              <button
                onClick={() => setMobileOpen(isOpen ? null : i)}
                className="w-full flex items-center gap-4 p-4 text-left"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mentor.imageUrl}
                  alt={mentor.name}
                  className="shrink-0 rounded-full object-cover object-top"
                  style={{ width: 56, height: 56, filter: isOpen ? "none" : "grayscale(70%)" }}
                />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-base leading-tight">{mentor.name}</p>
                  <p className="text-white/50 text-sm mt-0.5 truncate">{mentor.role}</p>
                  <p className="text-primary text-xs font-bold tracking-widest uppercase mt-1">{mentor.company}</p>
                </div>
                <svg
                  className="shrink-0 text-white/30 transition-transform duration-300"
                  style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
                  width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M4.5 6.75L9 11.25L13.5 6.75" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>

              {/* Expandable body */}
              <div
                style={{
                  maxHeight: isOpen ? 320 : 0,
                  overflow: "hidden",
                  transition: "max-height 0.35s cubic-bezier(0.25,0.46,0.45,0.94)",
                }}>
                <div className="flex gap-4 px-4 pb-5">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={mentor.imageUrl}
                    alt={mentor.name}
                    className="shrink-0 object-cover object-top"
                    style={{ width: 88, height: 110, borderRadius: 4 }}
                  />
                  <p className="text-white/60 text-sm leading-relaxed">{mentor.description}</p>
                </div>
                <div className="h-px mx-4 mb-4 bg-white/5" />
              </div>
            </div>
          );
        })}
      </div>

      {/* ── DESKTOP horizontal accordion (hidden on mobile) ── */}
      <div className="hidden md:block w-full overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div
          className="flex gap-2 mx-auto px-4"
          style={{
            height: CARD_HEIGHT,
            width: ACTIVE_W + (mentors.length - 1) * INACTIVE_W + (mentors.length - 1) * 8,
          }}>
          {mentors.map((mentor, i) => (
            <MentorCard
              key={mentor.name}
              mentor={mentor}
              isActive={active === i}
              onHover={() => setActive(i)}
              height={CARD_HEIGHT}
              activeW={ACTIVE_W}
              inactiveW={INACTIVE_W}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function MentorCard({
  mentor,
  isActive,
  onHover,
  height,
  activeW,
  inactiveW,
}: {
  mentor: Mentor;
  isActive: boolean;
  onHover: () => void;
  height: number;
  activeW: number;
  inactiveW: number;
}) {
  return (
    <div
      onMouseEnter={onHover}
      className="relative overflow-hidden cursor-pointer border border-white/10 shrink-0"
      style={{
        width: isActive ? activeW : inactiveW,
        height,
        transition: "width 0.55s cubic-bezier(0.25,0.46,0.45,0.94)",
        borderRadius: 6,
      }}>

      {/* ── ACTIVE layout: image left half | dark text right half ── */}
      {isActive ? (
        <>
          {/* Image confined to left 50% — fully visible, not cropped */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mentor.imageUrl}
            alt={mentor.name}
            draggable={false}
            className="absolute left-0 top-0 bottom-0 select-none"
            style={{
              width: "50%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              filter: "grayscale(0%)",
              transition: "filter 0.5s ease",
            }}
          />
          {/* Solid dark right panel */}
          <div
            className="absolute top-0 bottom-0 right-0"
            style={{
              width: "50%",
              background: "#0d0d0d",
              borderLeft: "1px solid rgba(255,255,255,0.06)",
            }}>
            {/* dot texture */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)",
                backgroundSize: "22px 22px",
              }}
            />
          </div>
        </>
      ) : (
        <>
          {/* INACTIVE: image fills full card, greyscale */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={mentor.imageUrl}
            alt={mentor.name}
            draggable={false}
            className="absolute inset-0 h-full w-full select-none"
            style={{
              objectFit: "cover",
              objectPosition: "center top",
              filter: "grayscale(100%)",
              transform: "scale(1.08)",
              transition: "filter 0.5s ease, transform 0.55s ease",
            }}
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.15) 60%)" }}
          />
        </>
      )}

      {/* ── ACTIVE content: sits on top of the right dark panel ── */}
      <div
        className="absolute top-0 bottom-0 right-0 flex flex-col justify-center gap-5 pl-8 pr-8 py-10"
        style={{
          width: "50%",
          opacity: isActive ? 1 : 0,
          transition: "opacity 0.25s ease",
          transitionDelay: isActive ? "0.3s" : "0s",
          pointerEvents: isActive ? "auto" : "none",
        }}>
        <p className="text-white/70 text-base leading-relaxed">
          {mentor.description}
        </p>
        <div>
          <h3 className="text-white font-bold text-3xl leading-tight">
            {mentor.name}
          </h3>
          <p className="text-white/50 text-base mt-2">{mentor.role}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="h-px w-6 bg-primary/70 shrink-0" />
          <span className="text-base font-bold tracking-widest text-primary uppercase">
            {mentor.company}
          </span>
        </div>
      </div>

      {/* ── INACTIVE: name vertical ── */}
      <div
        className="absolute inset-x-0 bottom-6 flex justify-center pointer-events-none"
        style={{
          opacity: isActive ? 0 : 1,
          transition: "opacity 0.2s ease",
        }}>
        <span
          className="text-white/60 text-[10px] font-semibold tracking-[0.18em] uppercase whitespace-nowrap"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
          {mentor.name}
        </span>
      </div>
    </div>
  );
}
