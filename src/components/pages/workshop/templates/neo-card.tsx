"use client";

import { useState, useCallback, type CSSProperties } from "react";
import Image from "next/image";
import { Plus, Minus } from "lucide-react";
import { useScrollReveal, useStickyBar } from "../hooks";
import { RegistrationModal } from "../shared/registration-modal";
import { TestimonialsSection } from "../shared/testimonials-section";
import type { WorkshopJson } from "../types";
import mediaData from "@/data/media.json";

function getYouTubeId(url: string): string | null {
  const m = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&?/\s]+)/,
  );
  return m?.[1] ?? null;
}

type WorkshopMedia =
  (typeof mediaData.workshops)[keyof typeof mediaData.workshops];

const REVEAL_CSS = `
 [data-reveal],[data-reveal-left],[data-reveal-right],[data-reveal-up]{opacity:0;transition:opacity .35s ease,transform .35s ease}
 [data-reveal]{transform:translateY(20px)}[data-reveal-left]{transform:translateX(-24px)}[data-reveal-right]{transform:translateX(24px)}[data-reveal-up]{transform:translateY(-16px)}
 [data-reveal].revealed,[data-reveal-left].revealed,[data-reveal-right].revealed,[data-reveal-up].revealed{opacity:1;transform:none}
 [data-d1]{transition-delay:.1s}[data-d2]{transition-delay:.2s}[data-d3]{transition-delay:.3s}[data-d4]{transition-delay:.4s}
 @keyframes ctaGlow{0%,100%{box-shadow:0 4px 16px var(--cta-shadow)}50%{box-shadow:0 6px 32px var(--cta-glow),0 0 0 6px var(--cta-ring)}}
 .cta-pulse{animation:ctaGlow 2s ease-in-out infinite}
`;

const P = "#4f46e5";
const P_LIGHT = "#eef2ff";

export function TemplateNeoCard({ workshop }: { workshop: WorkshopJson }) {
  const [showModal, setShowModal] = useState(false);
  const [showHeroVideo, setShowHeroVideo] = useState(false);
  const [activeFeatureVideo, setActiveFeatureVideo] = useState<number | null>(
    null,
  );
  const openModal = useCallback(() => setShowModal(true), []);
  useScrollReveal();
  const stickyVisible = useStickyBar();
  const ctaText = workshop.cta_button_text || "ENROLL NOW";

  const media =
    (mediaData.workshops as Record<string, WorkshopMedia>)[workshop.slug] ??
    null;

  function CtaBtn({
    text,
    sub,
    outline,
    full,
  }: {
    text: string;
    sub?: string;
    outline?: boolean;
    full?: boolean;
  }) {
    return (
      <button
        onClick={openModal}
        className={`${full ? "w-full" : "inline-flex"} flex items-center justify-center gap-3 px-8 py-4 font-black uppercase tracking-widest text-sm hover:opacity-90 transition-all ${!outline ? "cta-pulse" : ""}`}
        style={
          outline
            ? {
                border: `2px solid white`,
                color: "white",
                backgroundColor: "transparent",
              }
            : ({
                backgroundColor: P,
                color: "white",
                "--cta-shadow": `${P}55`,
                "--cta-glow": `${P}88`,
                "--cta-ring": `${P}22`,
              } as CSSProperties)
        }>
        <span className="flex-1 text-center">
          <span className="block">{text}</span>
          {sub && (
            <span className="block text-[10px] font-bold opacity-70 mt-0.5">
              {sub}
            </span>
          )}
        </span>
        <svg
          className="w-4 h-4 shrink-0"
          fill="currentColor"
          viewBox="0 0 24 24">
          <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
        </svg>
      </button>
    );
  }

  function SolidCtaBtn({
    text,
    sub,
    full,
  }: {
    text: string;
    sub?: string;
    full?: boolean;
  }) {
    return (
      <button
        onClick={openModal}
        className={`${full ? "w-full" : "inline-flex"} flex items-center justify-center gap-3 px-8 py-4 font-black uppercase tracking-widest text-sm hover:opacity-90 transition-all cta-pulse`}
        style={
          {
            backgroundColor: P,
            color: "white",
            "--cta-shadow": `${P}55`,
            "--cta-glow": `${P}88`,
            "--cta-ring": `${P}22`,
          } as CSSProperties
        }>
        <span>
          <span className="block">{text}</span>
          {sub && (
            <span className="block text-[10px] font-bold opacity-70 mt-0.5">
              {sub}
            </span>
          )}
        </span>
        <svg
          className="w-4 h-4 shrink-0"
          fill="currentColor"
          viewBox="0 0 24 24">
          <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
        </svg>
      </button>
    );
  }

  return (
    <>
      <style>{REVEAL_CSS}</style>
      <div className="font-sans antialiased bg-white">
        {/* ─── HERO — Magazine cover ─── */}
        <section className="bg-white">
          {/* Top bar */}
          <div className="border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                {workshop.hero_label || "LIVE WORKSHOP"}
              </span>
              {workshop.badge_text && (
                <span
                  className="text-[10px] font-black uppercase tracking-widest px-3 py-1"
                  style={{ backgroundColor: P_LIGHT, color: P }}>
                  {workshop.badge_text}
                </span>
              )}
            </div>
          </div>

          {/* Giant centered headline */}
          <div
            className="max-w-5xl mx-auto px-4 sm:px-8 pt-12 pb-8 text-center"
            data-reveal>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-gray-900 leading-[0.92] tracking-tight mb-3">
              {workshop.title}
            </h1>
            {workshop.title_highlight && (
              <h1
                className="text-5xl sm:text-7xl lg:text-8xl font-black leading-[0.92] tracking-tight"
                style={{ color: P }}>
                {workshop.title_highlight}
              </h1>
            )}
            <p
              className="text-gray-400 text-lg mt-6 max-w-2xl mx-auto"
              dangerouslySetInnerHTML={{
                __html: workshop.subtitle || workshop.tagline,
              }}
            />
          </div>

          {/* Full-width hero image or video */}
          {(workshop.youtube_url || media?.hero_bg) && (
            <div
              className="relative w-full"
              style={{ aspectRatio: workshop.youtube_url ? "16/9" : "16/5" }}>
              {workshop.youtube_url ? (
                showHeroVideo ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${getYouTubeId(workshop.youtube_url)}?autoplay=1&rel=0&modestbranding=1`}
                    title={workshop.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                  />
                ) : (
                  <>
                    {(media?.hero_preview || media?.hero_bg) && (
                      <Image
                        src={media?.hero_preview ?? media?.hero_bg ?? ""}
                        alt={workshop.title}
                        fill
                        className="object-cover"
                        sizes="(max-width:768px) 100vw, 660px"
                        priority
                      />
                    )}
                    <div
                      className="absolute inset-0 bg-black/30 flex items-center justify-center cursor-pointer"
                      onClick={() => setShowHeroVideo(true)}>
                      <div
                        className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-white shadow-2xl"
                        style={{ backgroundColor: P }}>
                        <svg
                          className="w-7 h-7 sm:w-9 sm:h-9 ml-1"
                          fill="currentColor"
                          viewBox="0 0 24 24">
                          <path d="M8 5v14l11-7z" />
                        </svg>
                      </div>
                    </div>
                  </>
                )
              ) : (
                <>
                  <Image
                    src={media!.hero_bg}
                    alt={workshop.title}
                    fill
                    className="object-cover"
                    sizes="100vw"
                    priority
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(to right, rgba(79,70,229,0.15), transparent)",
                    }}
                  />
                  <div
                    className="absolute bottom-0 inset-x-0 h-1"
                    style={{ backgroundColor: P }}
                  />
                </>
              )}
            </div>
          )}

          {/* Instructor + stats + CTA below image */}
          <div className="border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-10">
              {/* Instructor */}
              {workshop.instructor_name && (
                <div className="flex items-center gap-3 shrink-0">
                  {media?.instructor && (
                    <div className="w-10 h-10 overflow-hidden relative shrink-0">
                      <Image
                        src={media.instructor}
                        alt={workshop.instructor_name}
                        fill
                        className="object-cover"
                        sizes="40px"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-black text-gray-900 text-sm">
                      {workshop.instructor_name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {workshop.instructor_title}
                    </p>
                  </div>
                </div>
              )}
              {/* Divider */}
              <div className="hidden sm:block h-10 w-px bg-gray-200" />
              {/* Stats */}
              {workshop.about_stats.slice(0, 3).map((s, i) => (
                <div key={i} className="text-center">
                  <p className="font-black text-gray-900 text-lg">{s.value}</p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                    {s.label}
                  </p>
                </div>
              ))}
              <div className="sm:ml-auto shrink-0">
                <SolidCtaBtn
                  text={ctaText}
                  sub={workshop.cta_button_subtext ?? undefined}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ─── PAIN — Dark editorial numbered blocks ─── */}
        <section
          className="py-20 px-4 sm:px-8"
          style={{ backgroundColor: "#0f0f0f" }}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14" data-reveal>
              <p
                className="text-[10px] font-black uppercase tracking-[0.3em] mb-3"
                style={{ color: `${P}99` }}>
                THE CHALLENGE
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                {workshop.pain_section_title_plain}
                <br />
                <span style={{ color: P }}>
                  {workshop.pain_section_title_bold}
                </span>
              </h2>
            </div>
            <div className="space-y-0">
              {workshop.pain_points.map((p, i) => (
                <div
                  key={i}
                  className="relative py-10 border-t border-white/10"
                  data-reveal>
                  {/* Giant decorative number behind */}
                  <span
                    className="absolute left-0 top-1/2 -translate-y-1/2 select-none pointer-events-none font-black leading-none"
                    style={{
                      fontSize: "8rem",
                      color: "rgba(255,255,255,0.04)",
                    }}>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="relative pl-8 sm:pl-12">
                    <h3 className="text-xl sm:text-2xl font-black text-white mb-2">
                      {p.title}
                    </h3>
                    <p className="text-gray-400 text-base leading-relaxed max-w-xl">
                      {p.description}
                    </p>
                  </div>
                </div>
              ))}
              <div className="border-t border-white/10 pt-10" data-reveal>
                <CtaBtn text="Solve This With Our Program" outline />
              </div>
            </div>
          </div>
        </section>

        {/* ─── FEATURES — Alternating full-width stripes ─── */}
        <section
          className="py-20 px-4 sm:px-8"
          style={{ backgroundColor: "#f8f8f8" }}>
          <div className="max-w-4xl mx-auto">
            <div className="mb-12" data-reveal>
              <p
                className="text-[10px] font-black uppercase tracking-[0.3em] mb-2"
                style={{ color: P }}>
                WHAT YOU GET
              </p>
              <div className="h-0.5 w-16 mb-4" style={{ backgroundColor: P }} />
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
                {workshop.features_section_title}
              </h2>
            </div>
            <div className="divide-y divide-gray-200">
              {workshop.features_section_items.map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-6 py-6"
                  style={{
                    backgroundColor: i % 2 === 1 ? "#f0efff" : "white",
                  }}>
                  <div
                    className="w-14 h-14 flex items-center justify-center text-2xl shrink-0"
                    style={{ backgroundColor: P_LIGHT }}>
                    {item.emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-gray-900 text-base">
                      {item.title}
                    </h3>
                    <p className="text-gray-500 text-sm mt-0.5 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                  {item.link_text && (
                    <span
                      className="text-xs font-black uppercase tracking-widest shrink-0 hidden sm:block"
                      style={{ color: P }}>
                      {item.link_text}
                    </span>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-10" data-reveal>
              <SolidCtaBtn
                text={ctaText}
                sub={workshop.cta_button_subtext ?? undefined}
              />
            </div>
          </div>
        </section>

        {/* ─── BEFORE / AFTER — Table-style comparison ─── */}
        <section className="py-20 px-4 sm:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12" data-reveal>
              <p className="text-gray-400 text-base">
                {workshop.before_after_title_plain}
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-1">
                {workshop.before_after_title_bold}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-gray-200 border border-gray-200">
              {/* BEFORE */}
              <div style={{ backgroundColor: "#fff5f5" }}>
                <div
                  className="px-6 py-4 border-b border-gray-200"
                  style={{ backgroundColor: "#fecaca" }}>
                  <p className="font-black text-red-800 uppercase tracking-widest text-sm">
                    ✗ Life Without This
                  </p>
                </div>
                <div>
                  {workshop.before_items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 px-6 py-4 border-b border-red-100">
                      <span className="text-red-400 font-black shrink-0 mt-0.5">
                        ✗
                      </span>
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* AFTER */}
              <div style={{ backgroundColor: "#f5f3ff" }}>
                <div
                  className="px-6 py-4 border-b border-gray-200"
                  style={{ backgroundColor: P_LIGHT }}>
                  <p
                    className="font-black uppercase tracking-widest text-sm"
                    style={{ color: P }}>
                    ✓ Life With This
                  </p>
                </div>
                <div>
                  {workshop.after_items.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 px-6 py-4 border-b border-indigo-100">
                      <span
                        className="font-black shrink-0 mt-0.5"
                        style={{ color: P }}>
                        ✓
                      </span>
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-10 text-center" data-reveal>
              <SolidCtaBtn text={ctaText} />
            </div>
          </div>
        </section>

        {/* ─── INSTRUCTOR — Dark editorial ─── */}
        <section
          className="py-20 px-4 sm:px-8"
          style={{ backgroundColor: "#0f0f0f" }}>
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              {/* Left: circular photo */}
              <div className="flex justify-center" data-reveal-left>
                <div
                  className="relative overflow-hidden shrink-0"
                  style={{
                    width: 300,
                    height: 300,
                    borderRadius: "50%",
                    border: `4px solid ${P}`,
                  }}>
                  {media?.instructor_bg ? (
                    <Image
                      src={media.instructor_bg}
                      alt={workshop.instructor_name ?? ""}
                      fill
                      className="object-cover"
                      sizes="300px"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 flex items-center justify-center text-7xl font-black"
                      style={{ backgroundColor: P_LIGHT, color: P }}>
                      {workshop.instructor_name?.[0]}
                    </div>
                  )}
                </div>
              </div>
              {/* Right: details */}
              <div data-reveal-right>
                <p
                  className="text-[10px] font-black uppercase tracking-[0.3em] mb-3"
                  style={{ color: `${P}99` }}>
                  MEET YOUR INSTRUCTOR
                </p>
                <h2 className="text-4xl font-black text-white mb-1">
                  {workshop.instructor_name}
                </h2>
                {workshop.instructor_title && (
                  <p className="text-base mb-5" style={{ color: P }}>
                    {workshop.instructor_title}
                  </p>
                )}
                {workshop.instructor_quote && (
                  <blockquote
                    className="border-l-4 pl-4 mb-6 italic text-gray-300 text-base leading-relaxed"
                    style={{ borderLeftColor: P }}>
                    &#8220;{workshop.instructor_quote}&#8221;
                  </blockquote>
                )}
                <div className="space-y-3 mb-8">
                  {workshop.instructor_bio
                    ?.split("\n")
                    .filter(Boolean)
                    .map((para, i) => (
                      <p
                        key={i}
                        className="text-gray-400 text-sm leading-relaxed">
                        {para}
                      </p>
                    ))}
                </div>

                <CtaBtn text={ctaText} outline />
              </div>
            </div>
          </div>
        </section>

        {/* ─── CURRICULUM — Timeline layout ─── */}
        <section className="py-20 px-4 sm:px-8 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-16 items-start">
              {/* Sticky sidebar */}
              <div className="hidden lg:block lg:sticky lg:top-24" data-reveal>
                <p className="text-gray-400 text-base font-bold mb-1">
                  {workshop.curriculum_title_plain}
                </p>
                <h2 className="text-3xl font-black mb-2" style={{ color: P }}>
                  {workshop.curriculum_title_highlight}
                </h2>
                {workshop.curriculum_ps && (
                  <p className="text-xs text-gray-400 mb-6">
                    {workshop.curriculum_ps}
                  </p>
                )}
                <SolidCtaBtn text={ctaText} />
              </div>
              {/* Mobile heading */}
              <div className="lg:hidden mb-8 text-center" data-reveal>
                <p className="text-gray-400 text-base font-bold mb-1">
                  {workshop.curriculum_title_plain}
                </p>
                <h2 className="text-3xl font-black" style={{ color: P }}>
                  {workshop.curriculum_title_highlight}
                </h2>
              </div>
              {/* Timeline */}
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-5 top-0 bottom-0 w-px bg-indigo-100 hidden sm:block" />
                <div className="space-y-10">
                  {workshop.curriculum.map((lesson, i) => (
                    <div key={i} className="flex gap-6 items-start" data-reveal>
                      {/* Circle node */}
                      <div
                        className="relative z-10 w-10 h-10 flex items-center justify-center font-black text-sm text-white shrink-0"
                        style={{ backgroundColor: P }}>
                        {lesson.lesson_num}
                      </div>
                      <div className="flex-1 pt-1">
                        <h3 className="font-black text-gray-900 text-base mb-3">
                          {lesson.title}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                          {lesson.points.map((pt, j) => (
                            <p
                              key={j}
                              className="text-sm text-gray-500 flex items-start gap-2">
                              <span
                                className="shrink-0 mt-0.5"
                                style={{ color: P }}>
                                →
                              </span>
                              <span>{pt}</span>
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-10 lg:hidden" data-reveal>
                  <SolidCtaBtn text={ctaText} full />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIALS ─── */}
        <TestimonialsSection workshop={workshop} />

        {/* ─── FAQ — Two-column layout ─── */}
        <NeoFaqSection
          workshop={workshop}
          onCta={openModal}
          ctaText={ctaText}
        />

        {/* ─── STICKY BAR ─── */}
        <NeoStickyBar
          visible={stickyVisible}
          workshop={workshop}
          ctaText={ctaText}
          onCta={openModal}
        />
      </div>
      {showModal && (
        <RegistrationModal
          workshop={workshop}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

function NeoFaqSection({
  workshop,
  onCta,
  ctaText,
}: {
  workshop: WorkshopJson;
  onCta: () => void;
  ctaText: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  const half = Math.ceil(workshop.faq.length / 2);
  const leftItems = workshop.faq.slice(0, half);
  const rightItems = workshop.faq.slice(half);

  function FaqItem({
    item,
    idx,
    globalIdx,
  }: {
    item: { question: string; answer: string };
    idx: number;
    globalIdx: number;
  }) {
    return (
      <div className="border-t border-indigo-100">
        <button
          onClick={() => setOpen(open === globalIdx ? null : globalIdx)}
          className="w-full flex items-center justify-between py-4 text-left gap-4">
          <span className="text-sm font-black text-gray-900 leading-snug">
            {item.question}
          </span>
          <span className="shrink-0" style={{ color: P }}>
            {open === globalIdx ? (
              <Minus className="w-4 h-4" />
            ) : (
              <Plus className="w-4 h-4" />
            )}
          </span>
        </button>
        {open === globalIdx && (
          <div className="pb-4">
            <p className="text-sm text-gray-500 leading-relaxed">
              {item.answer}
            </p>
          </div>
        )}
      </div>
    );
  }

  return (
    <section
      className="py-20 px-4 sm:px-8 pb-28"
      style={{ backgroundColor: "#f5f5ff" }}>
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-3xl sm:text-4xl font-black text-gray-900 text-center mb-12"
          data-reveal>
          Got Questions? We Have Answers
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16">
          <div>
            {leftItems.map((item, i) => (
              <FaqItem key={i} item={item} idx={i} globalIdx={i} />
            ))}
          </div>
          <div>
            {rightItems.map((item, i) => (
              <FaqItem key={i} item={item} idx={i} globalIdx={half + i} />
            ))}
          </div>
        </div>
        <div className="flex justify-center mt-12" data-reveal></div>
      </div>
    </section>
  );
}

function NeoStickyBar({
  visible,
  workshop,
  ctaText,
  onCta,
}: {
  visible: boolean;
  workshop: WorkshopJson;
  ctaText: string;
  onCta: () => void;
}) {
  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-50 transition-transform duration-300 ${visible ? "translate-y-0" : "translate-y-full"}`}>
      <div className="border-t border-indigo-100 bg-white shadow-2xl px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
              Reserve Your Spot
            </p>
          </div>
          <button
            onClick={onCta}
            className="flex items-center gap-2 px-6 py-3 font-black uppercase tracking-widest text-white text-sm shrink-0 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: P }}>
            {ctaText}
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
