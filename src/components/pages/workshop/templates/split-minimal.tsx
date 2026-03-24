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
  [data-reveal],[data-reveal-left],[data-reveal-right]{opacity:0;transition:opacity .35s ease,transform .35s ease}
  [data-reveal]{transform:translateY(16px)}[data-reveal-left]{transform:translateX(-20px)}[data-reveal-right]{transform:translateX(20px)}
  [data-reveal].revealed,[data-reveal-left].revealed,[data-reveal-right].revealed{opacity:1;transform:none}
  [data-d1]{transition-delay:.15s}[data-d2]{transition-delay:.3s}[data-d3]{transition-delay:.45s}
  @keyframes ctaGlow{0%,100%{box-shadow:0 4px 16px var(--cta-shadow)}50%{box-shadow:0 6px 32px var(--cta-glow),0 0 0 6px var(--cta-ring)}}
  .cta-pulse{animation:ctaGlow 2s ease-in-out infinite}
`;

export function TemplateSplitMinimal({ workshop }: { workshop: WorkshopJson }) {
  const [showModal, setShowModal] = useState(false);
  const openModal = useCallback(() => setShowModal(true), []);
  useScrollReveal();
  const stickyVisible = useStickyBar();
  const P = workshop.page_primary_color || "#ea580c";
  const ctaText = workshop.cta_button_text || "ENROLL NOW";

  const media =
    (mediaData.workshops as Record<string, WorkshopMedia>)[workshop.slug] ??
    null;
  const heroBg = media?.hero_bg ?? "";
  const productImg = media?.product ?? "";
  const beforeImg = media?.before ?? "";
  const afterImg = media?.after ?? "";
  const instructorBg = media?.instructor_bg ?? "";
  const instructorImg = media?.instructor ?? "";

  function CtaBtn({
    text,
    outline,
    full,
  }: {
    text: string;
    outline?: boolean;
    full?: boolean;
  }) {
    return (
      <button
        onClick={openModal}
        className={`${full ? "w-full" : "inline-flex"} flex items-center justify-center gap-3 px-8 py-4 font-bold uppercase tracking-widest text-sm transition-all hover:opacity-80 active:scale-[0.99] ${!outline ? "cta-pulse" : ""}`}
        style={
          outline
            ? { border: `2px solid ${P}`, color: P, backgroundColor: "white" }
            : ({
                backgroundColor: P,
                color: "white",
                "--cta-shadow": `${P}55`,
                "--cta-glow": `${P}88`,
                "--cta-ring": `${P}22`,
              } as CSSProperties)
        }>
        {text}
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>
    );
  }

  return (
    <>
      <style>{REVEAL_CSS}</style>
      <div className="font-sans antialiased bg-white">
        {/* HERO: full-bleed 50/50 split */}
        <section className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
          {/* Left: dark image or video */}
          <div className="relative min-h-[50vh] lg:min-h-screen overflow-hidden bg-gray-900">
            {workshop.youtube_url ? (
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${getYouTubeId(workshop.youtube_url)}?rel=0&modestbranding=1`}
                title={workshop.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            ) : (
              <>
                {heroBg && (
                  <Image
                    src={heroBg}
                    alt={workshop.title}
                    fill
                    className="object-cover opacity-50"
                    priority
                    sizes="50vw"
                  />
                )}
                <div className="absolute inset-0 flex flex-col justify-end p-10">
                  <div
                    className="w-1 h-16 mb-6"
                    style={{ backgroundColor: P }}
                  />
                  <p className="text-white/60 text-xs font-bold uppercase tracking-[0.3em] mb-3">
                    {workshop.hero_label || "Workshop"}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {workshop.topics.map((t, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 text-xs font-bold text-white border border-white/30">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Right: content */}
          <div className="flex flex-col justify-center px-4 py-12 sm:px-10 sm:py-20 bg-white border-l border-gray-100">
            <p
              className="text-xs font-bold uppercase tracking-[0.3em] mb-8"
              style={{ color: P }}
              data-reveal>
              {workshop.badge_text}
            </p>
            <h1
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-gray-900 leading-[1.05] tracking-tight mb-4"
              data-reveal
              data-d1>
              {workshop.title}
            </h1>
            {workshop.title_highlight && (
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-black leading-[1.05] tracking-tight mb-8"
                style={{ color: P }}
                data-reveal
                data-d2>
                {workshop.title_highlight}
              </h1>
            )}
            <p
              className="text-gray-500 text-base leading-relaxed mb-10 max-w-md"
              dangerouslySetInnerHTML={{
                __html: workshop.subtitle || workshop.tagline,
              }}
              data-reveal
              data-d3
            />

            <div className="flex items-center gap-6 mb-10" data-reveal>
              <CtaBtn text={ctaText} />
              <div>
                <p className="text-xs text-gray-400">Starting at</p>
                <div className="flex items-baseline gap-2">
                  {workshop.price_original && (
                    <span className="text-sm line-through text-gray-300">
                      {workshop.price_original}
                    </span>
                  )}
                  <span className="text-xl font-black text-gray-900">
                    {workshop.price}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PAIN POINTS — full-width numbered blocks, no images */}
        <section className="border-b border-gray-100 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-12 sm:px-10 sm:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-10 items-start">
              <div className="lg:sticky lg:top-24" data-reveal>
                <p
                  className="text-xs font-bold uppercase tracking-[0.3em] mb-4"
                  style={{ color: P }}>
                  The Problem
                </p>
                <h2 className="text-3xl font-black text-gray-900 mb-2">
                  {workshop.pain_section_title_plain}
                </h2>
                <h2 className="text-3xl font-black mb-6" style={{ color: P }}>
                  {workshop.pain_section_title_bold}
                </h2>
                <CtaBtn text="Fix This Now" />
              </div>
              <div className="space-y-0 border-t border-gray-200">
                {workshop.pain_points.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-6 py-8 border-b border-gray-100 group"
                    data-reveal>
                    <div className="shrink-0 text-center">
                      <span
                        className="text-6xl sm:text-8xl font-black leading-none block"
                        style={{
                          color: `${P}15`,
                          WebkitTextStroke: `1px ${P}30`,
                        }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="pt-2">
                      <h3 className="font-black text-gray-900 text-xl mb-2 group-hover:text-orange-600 transition-colors">
                        {p.title}
                      </h3>
                      <p className="text-gray-500 leading-relaxed">
                        {p.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES — 3-column grid */}
        <section className="border-b border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-12 sm:px-10 sm:py-16">
            <div className="text-center mb-12" data-reveal>
              <p
                className="text-xs font-bold uppercase tracking-[0.3em] mb-4"
                style={{ color: P }}>
                What You Get
              </p>
              <h2 className="text-3xl font-black text-gray-900">
                {workshop.features_section_title}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {workshop.features_section_items.map((item, i) => (
                <div
                  key={i}
                  className="border border-gray-100 p-7 hover:border-gray-300 transition-colors group"
                  data-reveal>
                  <span className="text-4xl mb-5 block">{item.emoji}</span>
                  <h3 className="font-black text-gray-900 text-base mb-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed mb-3">
                    {item.description}
                  </p>
                  <p
                    className="text-xs font-bold uppercase tracking-wide"
                    style={{ color: P }}>
                    {item.link_text} →
                  </p>
                </div>
              ))}
            </div>
            {productImg && (
              <div
                className="relative aspect-video overflow-hidden"
                data-reveal>
                <Image
                  src={productImg}
                  alt="Platform"
                  fill
                  className="object-cover"
                  sizes="900px"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                  <button
                    onClick={openModal}
                    className="px-8 py-4 font-bold uppercase tracking-widest text-white text-sm border-2 border-white hover:bg-white hover:text-gray-900 transition-colors">
                    See Inside →
                  </button>
                </div>
              </div>
            )}
            <div className="mt-8 flex justify-center" data-reveal>
              <CtaBtn text={ctaText} />
            </div>
          </div>
        </section>

        {/* BEFORE/AFTER — center-spine layout */}
        <section className="border-b border-gray-100 bg-gray-50" data-reveal>
          <div className="max-w-7xl mx-auto px-4 py-12 sm:px-10 sm:py-16">
            <p
              className="text-xs font-bold uppercase tracking-[0.3em] mb-4"
              style={{ color: P }}>
              Transformation
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2">
              {workshop.before_after_title_plain}
            </h2>
            <h2
              className="text-3xl sm:text-4xl font-black mb-12"
              style={{ color: P }}>
              {workshop.before_after_title_bold}
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_40px_1fr] gap-0 items-start">
              {/* Before column */}
              <div data-reveal-left>
                <div className="relative aspect-video mb-5 overflow-hidden">
                  {beforeImg && (
                    <Image
                      src={beforeImg}
                      alt="Before"
                      fill
                      className="object-cover grayscale"
                      sizes="40vw"
                    />
                  )}
                  <div className="absolute top-0 left-0 right-0 bg-black text-white text-xs font-black uppercase tracking-widest px-4 py-2">
                    Before
                  </div>
                </div>
                <div className="space-y-3">
                  {workshop.before_items.map((item, i) => (
                    <div
                      key={i}
                      className="flex gap-3 items-start py-3 border-b border-gray-100 last:border-0">
                      <span className="text-red-400 font-black shrink-0">
                        —
                      </span>
                      <span className="text-sm text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* Center spine */}
              <div className="hidden lg:flex flex-col items-center justify-start pt-12 gap-0">
                <div
                  className="w-px flex-1 bg-gray-200"
                  style={{ minHeight: "200px" }}
                />
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 my-2"
                  style={{ backgroundColor: P }}>
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <div
                  className="w-px flex-1 bg-gray-200"
                  style={{ minHeight: "200px" }}
                />
              </div>
              {/* After column */}
              <div data-reveal-right>
                <div className="relative aspect-video mb-5 overflow-hidden">
                  {afterImg && (
                    <Image
                      src={afterImg}
                      alt="After"
                      fill
                      className="object-cover"
                      sizes="40vw"
                    />
                  )}
                  <div
                    className="absolute top-0 left-0 right-0 text-white text-xs font-black uppercase tracking-widest px-4 py-2"
                    style={{ backgroundColor: P }}>
                    After
                  </div>
                </div>
                <div className="space-y-3">
                  {workshop.after_items.map((item, i) => (
                    <div
                      key={i}
                      className="flex gap-3 items-start py-3 border-b border-gray-100 last:border-0">
                      <span
                        className="font-black shrink-0"
                        style={{ color: P }}>
                        +
                      </span>
                      <span className="text-sm text-gray-600">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INSTRUCTOR — 3-col: photo | bio | stats */}
        <section className="border-b border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-12 sm:px-10 sm:py-16">
            <p
              className="text-xs font-bold uppercase tracking-[0.3em] mb-10"
              style={{ color: P }}
              data-reveal>
              Your Instructor
            </p>
            <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_200px] gap-10 items-start">
              {/* Photo */}
              <div data-reveal-left>
                <div className="relative aspect-[3/4] overflow-hidden">
                  {instructorBg && (
                    <Image
                      src={instructorBg}
                      alt={workshop.instructor_name ?? ""}
                      fill
                      className="object-cover"
                      sizes="240px"
                    />
                  )}
                  {!instructorBg && instructorImg && (
                    <Image
                      src={instructorImg}
                      alt={workshop.instructor_name ?? ""}
                      fill
                      className="object-cover"
                      sizes="240px"
                    />
                  )}
                </div>
              </div>
              {/* Bio */}
              <div data-reveal>
                <h2 className="text-4xl sm:text-5xl font-black text-gray-900 mb-2">
                  {workshop.instructor_name}
                </h2>
                {workshop.instructor_title && (
                  <p className="text-sm font-bold mb-8" style={{ color: P }}>
                    {workshop.instructor_title}
                  </p>
                )}
                <div className="space-y-3 mb-8">
                  {workshop.instructor_bio
                    ?.split("\n")
                    .filter(Boolean)
                    .map((para, i) => (
                      <p
                        key={i}
                        className="text-sm text-gray-600 leading-relaxed">
                        {para}
                      </p>
                    ))}
                </div>
                {workshop.instructor_quote && (
                  <blockquote
                    className="border-l-2 pl-5 mb-8"
                    style={{ borderColor: P }}>
                    <p className="text-gray-700 text-sm italic leading-relaxed">
                      &#8220;{workshop.instructor_quote}&#8221;
                    </p>
                  </blockquote>
                )}
                <CtaBtn text="Learn From Me" outline />
              </div>
              {/* Stats */}
              <div className="space-y-6" data-reveal-right>
                {workshop.about_stats.map((s, i) => (
                  <div
                    key={i}
                    className="border-b border-gray-100 pb-5 last:border-0">
                    <p className="text-3xl font-black text-gray-900">
                      {s.value}
                    </p>
                    <p className="text-xs text-gray-400 uppercase tracking-wide mt-1">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CURRICULUM — timeline dots */}
        <section className="border-b border-gray-100 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-12 sm:px-10 sm:py-16">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16">
              <div className="lg:sticky lg:top-24 h-fit">
                <p
                  className="text-xs font-bold uppercase tracking-[0.3em] mb-4"
                  style={{ color: P }}>
                  Curriculum
                </p>
                <h2 className="text-3xl font-black text-gray-900 mb-2">
                  {workshop.curriculum_title_plain}
                </h2>
                <h2 className="text-3xl font-black mb-4" style={{ color: P }}>
                  {workshop.curriculum_title_highlight}
                </h2>
                {workshop.curriculum_ps && (
                  <p className="text-sm text-gray-400 mb-6">
                    {workshop.curriculum_ps}
                  </p>
                )}
                <CtaBtn text={ctaText} />
              </div>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-4 top-4 bottom-4 w-px bg-gray-200" />
                <div className="space-y-0">
                  {workshop.curriculum.map((lesson, i) => (
                    <div
                      key={i}
                      className="flex gap-6 items-start pb-6"
                      data-reveal>
                      {/* Dot */}
                      <div
                        className="relative z-10 w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 bg-white text-xs font-black"
                        style={{ borderColor: P, color: P }}>
                        {lesson.lesson_num}
                      </div>
                      {/* Content */}
                      <div className="flex-1 pb-6 border-b border-gray-100 last:border-0">
                        <h3 className="font-black text-gray-900 mb-2 text-sm">
                          {lesson.title}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
                          {lesson.points.map((pt, j) => (
                            <p
                              key={j}
                              className="text-xs text-gray-500 flex items-start gap-1.5">
                              <span style={{ color: P }} className="shrink-0">
                                →
                              </span>
                              {pt}
                            </p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <TestimonialsSection workshop={workshop} />

        {/* FAQ */}
        <MinimalFaqSection
          workshop={workshop}
          onCta={openModal}
          ctaText={ctaText}
          primary={P}
        />

        {/* STICKY BAR */}
        <MinimalStickyBar
          visible={stickyVisible}
          workshop={workshop}
          ctaText={ctaText}
          primary={P}
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

function MinimalFaqSection({
  workshop,
  onCta,
  ctaText,
  primary,
}: {
  workshop: WorkshopJson;
  onCta: () => void;
  ctaText: string;
  primary: string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="border-b border-gray-100 bg-white pb-24">
      <div className="max-w-3xl mx-auto px-4 py-12 sm:px-10 sm:py-16">
        <p
          className="text-xs font-bold uppercase tracking-[0.3em] mb-4"
          style={{ color: primary }}
          data-reveal>
          FAQ
        </p>
        <h2 className="text-3xl font-black text-gray-900 mb-12" data-reveal>
          Common Questions
        </h2>
        <div className="space-y-0 border-t border-gray-100">
          {workshop.faq.map((item, i) => (
            <div key={i} className="border-b border-gray-100">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left gap-4">
                <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                  {item.question}
                </span>
                <span className="shrink-0 w-6 h-6 flex items-center justify-center border border-gray-200">
                  {open === i ? (
                    <Minus className="w-3 h-3 text-gray-500" />
                  ) : (
                    <Plus className="w-3 h-3 text-gray-500" />
                  )}
                </span>
              </button>
              {open === i && (
                <div className="pb-5">
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-12"></div>
      </div>
    </section>
  );
}

function MinimalStickyBar({
  visible,
  workshop,
  ctaText,
  primary,
  onCta,
}: {
  visible: boolean;
  workshop: WorkshopJson;
  ctaText: string;
  primary: string;
  onCta: () => void;
}) {
  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-50 transition-transform duration-300 ${visible ? "translate-y-0" : "translate-y-full"}`}>
      <div className="border-t border-gray-200 shadow-2xl px-4 py-3 bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Enroll Today
            </p>
          </div>
          <button
            onClick={onCta}
            className="flex items-center gap-2 px-6 py-3 font-bold uppercase tracking-widest text-white text-sm transition-opacity hover:opacity-80 shrink-0"
            style={{ backgroundColor: primary }}>
            {ctaText}
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
