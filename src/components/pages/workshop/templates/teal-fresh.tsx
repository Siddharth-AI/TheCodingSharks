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
 [data-reveal],[data-reveal-left],[data-reveal-right],[data-reveal-up]{opacity:0;transition:opacity .4s ease,transform .4s ease}
 [data-reveal]{transform:translateY(24px)}[data-reveal-left]{transform:translateX(-28px)}[data-reveal-right]{transform:translateX(28px)}[data-reveal-up]{transform:translateY(-16px)}
 [data-reveal].revealed,[data-reveal-left].revealed,[data-reveal-right].revealed,[data-reveal-up].revealed{opacity:1;transform:none}
 [data-d1]{transition-delay:.1s}[data-d2]{transition-delay:.2s}[data-d3]{transition-delay:.3s}[data-d4]{transition-delay:.4s}
 @keyframes ctaGlow{0%,100%{box-shadow:0 4px 16px var(--cta-shadow)}50%{box-shadow:0 8px 32px var(--cta-glow),0 0 0 6px var(--cta-ring)}}
 .cta-pulse{animation:ctaGlow 2.2s ease-in-out infinite}
`;

const P = "#0d9488";
const P_DARK = "#134e4a";
const P_BG = "#f0fdfa";

function CtaBtn({
  text,
  sub,
  full,
  outline,
  onOpen,
}: {
  text: string;
  sub?: string;
  full?: boolean;
  outline?: boolean;
  onOpen: () => void;
}) {
  const style: CSSProperties = outline
    ? { border: `2px solid ${P}`, color: P, backgroundColor: "transparent" }
    : ({
        backgroundColor: P,
        color: "white",
        "--cta-shadow": `${P}55`,
        "--cta-glow": `${P}88`,
        "--cta-ring": `${P}22`,
      } as CSSProperties);
  return (
    <button
      onClick={onOpen}
      className={`${full ? "w-full" : "inline-flex"} flex items-center justify-center gap-2.5 px-8 py-4 font-extrabold uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-100 transition-all ${!outline ? "cta-pulse" : ""}`}
      style={style}>
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
        <path d="M8 5v14l11-7z" />
      </svg>
    </button>
  );
}

export function TemplateTealFresh({ workshop }: { workshop: WorkshopJson }) {
  const [showModal, setShowModal] = useState(false);
  const [showHeroVideo, setShowHeroVideo] = useState(false);
  const openModal = useCallback(() => setShowModal(true), []);
  useScrollReveal();
  const stickyVisible = useStickyBar();
  const ctaText = workshop.cta_button_text || "ENROLL NOW";

  const media =
    (mediaData.workshops as Record<string, WorkshopMedia>)[workshop.slug] ??
    null;
  const instructorBg = media?.instructor_bg ?? "";

  return (
    <>
      <style>{REVEAL_CSS}</style>
      <div className="font-sans antialiased bg-white">
        {/* ═══════════════════════════════════════
 HERO — Centered SaaS style
 ═══════════════════════════════════════ */}
        <section className="relative overflow-hidden bg-white px-4 sm:px-8 pt-16 pb-10 sm:pt-24">
          {/* Radial teal gradient from top-center */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at top, #99f6e433 0%, transparent 70%)`,
            }}
          />
          <div className="relative max-w-7xl mx-auto text-center" data-reveal>
            {/* Live dot badge */}
            <div
              className="inline-flex items-center gap-2 border px-4 py-1.5 mb-6 text-xs font-extrabold"
              style={{ borderColor: `${P}66`, color: P }}>
              <span
                className="w-1.5 h-1.5 animate-pulse"
                style={{ backgroundColor: P }}
              />
              LIVE · {workshop.badge_text || "Workshop Enrollment Open"}
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 leading-tight mb-2 tracking-tight">
              {workshop.title}
            </h1>
            {workshop.title_highlight && (
              <h1
                className="text-4xl sm:text-6xl font-extrabold leading-tight mb-5 tracking-tight"
                style={{ color: P }}>
                {workshop.title_highlight}
              </h1>
            )}
            <p
              className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed mb-7"
              dangerouslySetInnerHTML={{
                __html: workshop.subtitle || workshop.tagline,
              }}
            />
            {/* Stat pills */}
            {workshop.about_stats.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mb-8">
                {workshop.about_stats.slice(0, 3).map((s, i) => (
                  <span
                    key={i}
                    className=" border px-4 py-1.5 text-xs font-extrabold text-gray-700"
                    style={{ borderColor: `${P}55` }}>
                    <span style={{ color: P }}>{s.value}</span> {s.label}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Hero video / preview card — above CTA on mobile */}
          {(workshop.youtube_url || media?.hero_preview) && (
            <div className="max-w-4xl mx-auto mb-8" data-reveal>
              <div
                className=" overflow-hidden relative"
                style={{
                  aspectRatio: "16/9",
                  boxShadow: `0 20px 60px ${P}33`,
                }}>
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
                        <div className="w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center text-white shadow-2xl bg-black/30 rounded-full">
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
                ) : media?.hero_preview ? (
                  <Image
                    src={media.hero_preview}
                    alt={workshop.title}
                    fill
                    className="object-cover"
                    sizes="(max-width:768px) 100vw, 672px"
                    priority
                  />
                ) : null}
              </div>
            </div>
          )}

          {/* CTA + price — below video on mobile */}
          <div className="max-w-7xl mx-auto text-center">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pb-8">
              <CtaBtn
                text={ctaText}
                sub={workshop.cta_button_subtext ?? undefined}
                onOpen={openModal}
              />
              <div className="text-center">
                {workshop.price_original && (
                  <p className="text-sm line-through text-gray-400">
                    {workshop.price_original}
                  </p>
                )}
                <p className="font-extrabold text-gray-900 text-xl">
                  {workshop.price}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
 PAIN — Dark teal with real image cards
 ═══════════════════════════════════════ */}
        <section
          className="py-20 px-4 sm:px-8"
          style={{ backgroundColor: P_DARK }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-14" data-reveal>
              <p className="text-teal-300/60 text-sm font-bold uppercase tracking-[0.25em] mb-3">
                The Problem
              </p>
              <h2 className="text-3xl sm:text-5xl font-extrabold text-white leading-tight">
                {workshop.pain_section_title_plain}
                <br />
                <span style={{ color: "#5eead4" }}>
                  {workshop.pain_section_title_bold}
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {workshop.pain_points.map((p, i) => {
                const painImg = media?.pain[i] ?? "";
                return (
                  <div
                    key={i}
                    className=" overflow-hidden"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.06)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    data-reveal>
                    {/* Clean image — no colour overlay */}
                    {painImg && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={painImg}
                          alt={p.title}
                          fill
                          className="object-cover"
                          sizes="(max-width:640px) 100vw, 33vw"
                        />
                        {/* Number badge only */}
                        <span
                          className="absolute top-3 left-3 w-8 h-8 flex items-center justify-center text-white text-xs font-extrabold shadow-lg"
                          style={{ backgroundColor: P }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                    )}
                    {!painImg && (
                      <div
                        className="h-14 flex items-center px-5"
                        style={{
                          borderBottom: "1px solid rgba(255,255,255,0.08)",
                        }}>
                        <span
                          className="w-8 h-8 flex items-center justify-center text-white text-xs font-extrabold"
                          style={{ backgroundColor: P }}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                    )}
                    <div className="p-5">
                      <h3 className="font-extrabold text-white text-base mb-2 leading-snug">
                        {p.title}
                      </h3>
                      <p
                        className="text-sm leading-relaxed"
                        style={{ color: "#99f6e4" }}>
                        {p.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-center mt-12" data-reveal>
              <button
                onClick={openModal}
                className="inline-flex items-center gap-2.5 px-8 py-4 font-extrabold uppercase tracking-widest text-sm bg-white hover:bg-gray-50 transition-all"
                style={{ color: P }}>
                Fix This With Our Program
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
 FEATURES — Clean bento grid
 ═══════════════════════════════════════ */}
        <section className="py-20 px-4 sm:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12" data-reveal>
              <p
                className="text-[10px] font-extrabold uppercase tracking-[0.28em] mb-3"
                style={{ color: P }}>
                What You Get
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                {workshop.features_section_title}
              </h2>
            </div>

            {/* Top: product image full-width */}
            {media?.product && (
              <div
                className="relative overflow-hidden mb-5 w-full"
                style={{ height: 340 }}
                data-reveal>
                <Image
                  src={media.product}
                  alt="Platform"
                  fill
                  sizes="(max-width:1280px) 100vw, 1200px"
                />
                <div className="absolute inset-0 flex items-end p-8">
                  <button
                    onClick={openModal}
                    className="inline-flex items-center gap-2.5 px-7 py-3.5 font-extrabold uppercase tracking-widest text-white text-sm shadow-xl backdrop-blur-sm transition-all hover:opacity-90"
                    style={{ backgroundColor: P }}>
                    {ctaText}
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                </div>
              </div>
            )}

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {workshop.features_section_items.map((item, i) => (
                <div
                  key={i}
                  className=" p-6 border hover:border-teal-300 transition-colors"
                  style={{
                    borderColor: "#e0f2f1",
                    borderLeft: `4px solid ${P}`,
                    backgroundColor: i % 3 === 0 ? P_BG : "white",
                  }}
                  data-reveal>
                  <span className="text-3xl block mb-4">{item.emoji}</span>
                  <h3 className="font-extrabold text-gray-900 text-base mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {item.description}
                  </p>
                  {item.link_text && (
                    <p
                      className="text-xs font-extrabold mt-3"
                      style={{ color: P }}>
                      {item.link_text}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
 BEFORE / AFTER — Clean images, no overlays
 ═══════════════════════════════════════ */}
        <section
          className="py-20 px-4 sm:px-8"
          style={{ backgroundColor: P_BG }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12" data-reveal>
              <p className="text-gray-400 text-base">
                {workshop.before_after_title_plain}
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-1">
                {workshop.before_after_title_bold}
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Before */}
              <div
                className="bg-white overflow-hidden shadow-sm"
                data-reveal-left>
                <div className="h-1.5 bg-red-400" />
                {media?.before && (
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={media.before}
                      alt="Before"
                      fill
                      className="grayscale"
                      sizes="(max-width:640px) 100vw, 50vw"
                    />
                    {/* Clean badge — no full-image colour overlay */}
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 shadow">
                      Before
                    </span>
                  </div>
                )}
                <div className="px-6 py-5 space-y-3">
                  {workshop.before_items.map((item, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className="text-red-400 font-extrabold shrink-0">
                        ✗
                      </span>
                      <span className="text-sm text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* After */}
              <div
                className="bg-white overflow-hidden shadow-sm"
                data-reveal-right>
                <div className="h-1.5" style={{ backgroundColor: P }} />
                {media?.after && (
                  <div className="relative aspect-video overflow-hidden">
                    <Image
                      src={media.after}
                      alt="After"
                      fill
                      sizes="(max-width:640px) 100vw, 50vw"
                    />
                    {/* Clean badge — no full-image colour overlay */}
                    <span
                      className="absolute top-3 left-3 text-white text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 shadow"
                      style={{ backgroundColor: P }}>
                      After
                    </span>
                  </div>
                )}
                <div className="px-6 py-5 space-y-3">
                  {workshop.after_items.map((item, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span
                        className="font-extrabold shrink-0"
                        style={{ color: P }}>
                        ✓
                      </span>
                      <span className="text-sm text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-10" data-reveal>
              <CtaBtn
                text={ctaText}
                sub={workshop.cta_button_subtext ?? undefined}
                onOpen={openModal}
              />
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════
 INSTRUCTOR — Two-column split, no overlay
 ═══════════════════════════════════════ */}
        <section className="py-20 px-4 sm:px-8 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: portrait — clean, no gradient */}
              {instructorBg ? (
                <div
                  className="relative overflow-hidden order-1 lg:order-1"
                  style={{ height: 520, boxShadow: `0 32px 80px ${P}22` }}
                  data-reveal-left>
                  <Image
                    src={instructorBg}
                    alt={workshop.instructor_name ?? ""}
                    fill
                    className="object-cover object-top"
                    sizes="(max-width:1024px) 100vw, 600px"
                  />
                </div>
              ) : (
                <div className="order-1 lg:order-1" />
              )}

              {/* Right: content */}
              <div className="order-2 lg:order-2" data-reveal-right>
                <p
                  className="text-[10px] font-extrabold uppercase tracking-[0.3em] mb-4"
                  style={{ color: P }}>
                  Meet Your Instructor
                </p>
                <h2 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-1 leading-tight">
                  {workshop.instructor_name}
                </h2>
                {workshop.instructor_title && (
                  <p
                    className="text-base font-semibold mb-6"
                    style={{ color: P }}>
                    {workshop.instructor_title}
                  </p>
                )}

                {workshop.instructor_quote && (
                  <blockquote
                    className="border-l-4 pl-5 italic text-gray-500 text-base leading-relaxed mb-6"
                    style={{ borderColor: P }}>
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
                        className="text-gray-500 text-sm leading-relaxed">
                        {para}
                      </p>
                    ))}
                </div>

                {/* Stats */}
                {workshop.about_stats.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8 pt-6 border-t border-gray-100">
                    {workshop.about_stats.slice(0, 3).map((s, i) => (
                      <div key={i}>
                        <p
                          className="text-2xl font-extrabold"
                          style={{ color: P }}>
                          {s.value}
                        </p>
                        <p className="text-[11px] text-gray-400 uppercase tracking-wide mt-0.5">
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-center lg:justify-start">
                  <CtaBtn
                    text={ctaText}
                    sub={workshop.cta_button_subtext ?? undefined}
                    onOpen={openModal}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── CURRICULUM ─── */}
        <TealCurriculumSection
          workshop={workshop}
          onCta={openModal}
          ctaText={ctaText}
        />

        {/* ─── TESTIMONIALS ─── */}
        <TestimonialsSection workshop={workshop} />

        {/* ─── FAQ ─── */}
        <TealFaqSection
          workshop={workshop}
          onCta={openModal}
          ctaText={ctaText}
        />

        {/* ─── STICKY BAR ─── */}
        <TealStickyBar
          visible={stickyVisible}
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

function TealCurriculumSection({
  workshop,
  onCta,
  ctaText,
}: {
  workshop: WorkshopJson;
  onCta: () => void;
  ctaText: string;
}) {
  const [activeTab, setActiveTab] = useState(0);
  const active = workshop.curriculum[activeTab];

  return (
    <section
      className="py-20 px-4 sm:px-8"
      style={{ backgroundColor: "#f0fdfa" }}>
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12" data-reveal>
          <p className="text-gray-400 text-base">
            {workshop.curriculum_title_plain}
          </p>
          <h2
            className="text-3xl sm:text-4xl font-extrabold mt-1"
            style={{ color: "#0d9488" }}>
            {workshop.curriculum_title_highlight}
          </h2>
          {workshop.curriculum_ps && (
            <p className="text-xs text-gray-400 mt-2">
              {workshop.curriculum_ps}
            </p>
          )}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-6 items-start">
          {/* Tab list */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
            {workshop.curriculum.map((lesson, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className="shrink-0 text-left px-4 py-3 font-extrabold text-sm transition-all"
                style={
                  activeTab === i
                    ? { backgroundColor: "#0d9488", color: "white" }
                    : {
                        backgroundColor: "white",
                        color: "#374151",
                        border: "1px solid #99f6e4",
                      }
                }>
                <span className="block text-[10px] font-black uppercase tracking-widest opacity-60 mb-0.5">
                  Lesson {lesson.lesson_num}
                </span>
                <span className="block leading-snug">
                  {lesson.title.split(" ").slice(0, 4).join(" ")}
                  {lesson.title.split(" ").length > 4 ? "…" : ""}
                </span>
              </button>
            ))}
          </div>
          {/* Active lesson detail */}
          {active && (
            <div className="bg-white p-8 shadow-sm border border-teal-100">
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-10 h-10 flex items-center justify-center text-white font-extrabold text-sm shrink-0"
                  style={{ backgroundColor: "#0d9488" }}>
                  {active.lesson_num}
                </div>
                <h3 className="font-extrabold text-gray-900 text-xl">
                  {active.title}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {active.points.map((pt, j) => (
                  <p
                    key={j}
                    className="text-sm text-gray-600 flex items-start gap-2">
                    <span
                      className="shrink-0 mt-0.5 font-bold"
                      style={{ color: "#0d9488" }}>
                      ✓
                    </span>
                    <span>{pt}</span>
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-center mt-10">
          <button
            onClick={onCta}
            className="inline-flex items-center gap-2.5 px-8 py-4 font-extrabold uppercase tracking-widest text-white text-sm shadow-md hover:scale-[1.02] transition-all"
            style={{ backgroundColor: "#0d9488" }}>
            {ctaText}
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}

function TealFaqSection({
  workshop,
  onCta,
  ctaText,
}: {
  workshop: WorkshopJson;
  onCta: () => void;
  ctaText: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="py-20 px-4 sm:px-8 pb-28 bg-white">
      <div className="max-w-4xl mx-auto">
        <h2
          className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center mb-12"
          data-reveal>
          Frequently Asked Questions
        </h2>
        <div className="space-y-2">
          {workshop.faq.map((item, i) => (
            <div
              key={i}
              className=" overflow-hidden border transition-all"
              style={{
                borderColor: open === i ? "#0d9488" : "#e0f2f1",
                backgroundColor: open === i ? "#f0fdfa" : "white",
              }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left gap-4">
                <span className="font-extrabold text-gray-900 text-sm leading-snug">
                  {item.question}
                </span>
                <span
                  className="shrink-0 w-7 h-7 border flex items-center justify-center transition-colors"
                  style={{
                    borderColor: open === i ? "#0d9488" : "#d1fae5",
                    color: open === i ? "#0d9488" : "#9ca3af",
                  }}>
                  {open === i ? (
                    <Minus className="w-3.5 h-3.5" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-12"></div>
      </div>
    </section>
  );
}

function TealStickyBar({
  visible,

  ctaText,
  onCta,
}: {
  visible: boolean;

  ctaText: string;
  onCta: () => void;
}) {
  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-50 transition-transform duration-300 ${visible ? "translate-y-0" : "translate-y-full"}`}>
      <div
        className="shadow-2xl border-t px-4 py-3"
        style={{ backgroundColor: "#f0fdfa", borderColor: "#99f6e4" }}>
        <button
          onClick={onCta}
          className="mx-auto flex items-center gap-2.5 px-6 py-3 font-extrabold uppercase tracking-widest text-white text-sm shadow-md shrink-0 hover:opacity-90 transition-opacity"
          style={{ backgroundColor: "#0d9488" }}>
          {ctaText}
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
