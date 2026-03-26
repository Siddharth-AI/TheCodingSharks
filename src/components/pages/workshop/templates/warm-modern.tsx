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

const P = "#c2410c";
const P_LIGHT = "#fff7ed";
const P_OFF_WHITE = "#fafaf8";

export function TemplateWarmModern({ workshop }: { workshop: WorkshopJson }) {
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
    full,
    white,
  }: {
    text: string;
    sub?: string;
    full?: boolean;
    white?: boolean;
  }) {
    return (
      <button
        onClick={openModal}
        className={`${full ? "w-full" : "inline-flex"} flex items-center justify-center gap-3 px-8 py-4 font-extrabold uppercase tracking-widest text-sm hover:opacity-90 transition-all ${!white ? "cta-pulse" : ""}`}
        style={
          white
            ? { backgroundColor: "white", color: P }
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
          <path d="M8 5v14l11-7z" />
        </svg>
      </button>
    );
  }

  return (
    <>
      <style>{REVEAL_CSS}</style>
      <div
        className="font-sans antialiased"
        style={{ backgroundColor: P_OFF_WHITE }}>
        {/* ─── HERO — Agency split grid ─── */}
        <section className="grid grid-cols-1 lg:grid-cols-[60%_40%] min-h-screen">
          {/* LEFT 60%: content */}
          <div
            className="bg-white px-8 sm:px-12 py-16 sm:py-20 flex flex-col justify-center"
            data-reveal-left>
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 mb-8 text-xs font-extrabold uppercase tracking-widest self-start"
              style={{ backgroundColor: P_LIGHT, color: P }}>
              <span
                className="w-2 h-2 animate-pulse"
                style={{ backgroundColor: P }}
              />
              LIVE ONLINE
            </div>
            {/* Title */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-gray-900 leading-[0.9] tracking-tight mb-2">
              {workshop.title}
            </h1>
            {workshop.title_highlight && (
              <h1
                className="text-5xl sm:text-6xl lg:text-7xl font-black leading-[0.9] tracking-tight mb-6"
                style={{ color: P }}>
                {workshop.title_highlight}
              </h1>
            )}
            {/* Orange rule */}
            <div
              className="mb-6"
              style={{ width: 80, height: 4, backgroundColor: P }}
            />
            <p
              className="text-gray-600 text-base leading-relaxed mb-8 max-w-lg"
              dangerouslySetInnerHTML={{
                __html: workshop.subtitle || workshop.tagline,
              }}
            />
            {/* Why join as numbered rows */}
            {workshop.why_join_items.length > 0 && (
              <ol className="space-y-3 mb-8">
                {workshop.why_join_items.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span
                      className="w-7 h-7 flex items-center justify-center font-black text-xs text-white shrink-0 mt-0.5"
                      style={{ backgroundColor: P }}>
                      {i + 1}
                    </span>
                    <span className="text-sm text-gray-700 leading-snug">
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            )}
            {/* CTA + price */}
            <div className="flex flex-wrap items-center gap-4">
              <CtaBtn
                text={ctaText}
                sub={workshop.cta_button_subtext ?? undefined}
              />
              <div>
                {workshop.price_original && (
                  <p className="text-sm line-through text-gray-400">
                    {workshop.price_original}
                  </p>
                )}
                <p className="font-black text-gray-900 text-xl">
                  {workshop.price}
                </p>
              </div>
            </div>
          </div>
          {/* RIGHT 40%: hero image or video */}
          <div className="relative hidden lg:block min-h-[400px]">
            {workshop.youtube_url ? (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-50 p-6">
                <div
                  className="w-full overflow-hidden shadow-lg"
                  style={{ aspectRatio: "16/9" }}>
                  {showHeroVideo ? (
                    <iframe
                      src={`https://www.youtube-nocookie.com/embed/${getYouTubeId(workshop.youtube_url)}?autoplay=1&rel=0&modestbranding=1`}
                      title={workshop.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0 w-full h-full border-0"
                    />
                  ) : (
                    <>
                      {(media?.hero_bg || media?.hero_preview) && (
                        <Image
                          src={media?.hero_preview ?? media?.hero_bg ?? ""}
                          alt={workshop.title}
                          fill
                          className="object-cover"
                          sizes="40vw"
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
                  )}
                </div>
              </div>
            ) : (
              <>
                {media?.hero_bg ? (
                  <Image
                    src={media.hero_bg}
                    alt={workshop.title}
                    fill
                    className="object-cover"
                    sizes="40vw"
                    priority
                  />
                ) : (
                  <div
                    className="absolute inset-0"
                    style={{ backgroundColor: "#fed7aa" }}
                  />
                )}
                {/* Warm gradient overlay at bottom */}
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to top, ${P}88 0%, transparent 50%)`,
                  }}
                />
              </>
            )}
          </div>
        </section>

        {/* ─── WHY JOIN — Horizontal rows ─── */}
        {workshop.why_join_items.length > 0 && (
          <section
            className="py-16 px-4 sm:px-8"
            style={{ backgroundColor: P_LIGHT }}>
            <div className="max-w-4xl mx-auto">
              <h2
                className="text-2xl sm:text-3xl font-black text-gray-900 text-center mb-8"
                data-reveal>
                Why Thousands Choose This Program
              </h2>
              <div>
                {workshop.why_join_items.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-5 py-5 border-b border-orange-100 last:border-b-0"
                    data-reveal>
                    <span
                      className="w-8 h-8 flex items-center justify-center font-black text-xs text-white shrink-0"
                      style={{ backgroundColor: P }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-gray-700 text-sm leading-snug">{item}</p>
                  </div>
                ))}
              </div>
              <div className="flex justify-center mt-8" data-reveal>
                <CtaBtn text={ctaText} />
              </div>
            </div>
          </section>
        )}

        {/* ─── PAIN — Magazine typographic ─── */}
        <section className="py-16 px-4 sm:px-8 bg-white">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-[40%_60%] gap-12 items-start">
              {/* Left: sticky decorative label */}
              <div
                className="hidden lg:block lg:sticky lg:top-24"
                data-reveal-left>
                <p
                  className="font-black uppercase leading-none select-none"
                  style={{ fontSize: "5rem", color: P_LIGHT }}>
                  THE
                  <br />
                  PAIN
                </p>
                <div
                  className="mt-3"
                  style={{ width: 60, height: 4, backgroundColor: P }}
                />
                <p className="text-sm text-gray-500 mt-4 leading-relaxed">
                  {workshop.pain_section_title_plain}
                </p>
                <h2 className="text-xl font-black text-gray-900 mt-1">
                  {workshop.pain_section_title_bold}
                </h2>
              </div>
              {/* Mobile heading */}
              <div className="lg:hidden mb-4" data-reveal>
                <p className="text-gray-500 text-base">
                  {workshop.pain_section_title_plain}
                </p>
                <h2 className="text-2xl font-black text-gray-900 mt-1">
                  {workshop.pain_section_title_bold}
                </h2>
              </div>
              {/* Right: article blocks */}
              <div className="space-y-0">
                {workshop.pain_points.map((p, i) => {
                  const painImg = media?.pain[i] ?? "";
                  return (
                    <div
                      key={i}
                      className="py-7 border-b border-gray-100 last:border-b-0"
                      data-reveal>
                      <div className="flex gap-4 items-start">
                        {painImg && (
                          <div
                            className="relative overflow-hidden shrink-0"
                            style={{ width: 80, height: 80 }}>
                            <Image
                              src={painImg}
                              alt={p.title}
                              fill
                              className="object-cover"
                              sizes="80px"
                            />
                          </div>
                        )}
                        <div>
                          <h3 className="font-black text-gray-900 text-lg mb-2">
                            {p.title}
                          </h3>
                          <p className="text-gray-500 text-sm leading-relaxed">
                            {p.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div className="pt-6" data-reveal>
                  <CtaBtn text="Fix This With Our Course" />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ─── FEATURES — Alternating full-width rows ─── */}
        <section
          className="py-16 px-4 sm:px-8"
          style={{ backgroundColor: P_OFF_WHITE }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12" data-reveal>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900">
                {workshop.features_section_title}
              </h2>
            </div>
            <div className="space-y-0">
              {workshop.features_section_items.map((item, i) => {
                const isOdd = i % 2 === 0;
                return (
                  <div
                    key={i}
                    className={`grid grid-cols-1 sm:grid-cols-2 gap-0 border-b border-gray-200 last:border-b-0`}
                    data-reveal>
                    {/* Image / emoji half */}
                    <div
                      className={`relative flex items-center justify-center py-12 px-8 ${isOdd ? "sm:order-1" : "sm:order-2"}`}
                      style={{
                        backgroundColor:
                          i === 0
                            ? "#fff7ed"
                            : i % 2 === 0
                              ? "#fafaf8"
                              : "#fff",
                      }}>
                      {i === 0 && media?.product ? (
                        <div
                          className="relative w-full overflow-hidden"
                          style={{ aspectRatio: "4/3" }}>
                          <Image
                            src={media.product}
                            alt={item.title}
                            fill
                            className="object-cover"
                            sizes="(max-width:640px) 100vw, 50vw"
                          />
                          <div
                            className="absolute inset-0"
                            style={{
                              background: `linear-gradient(to bottom, transparent 50%, ${P}44)`,
                            }}
                          />
                        </div>
                      ) : (
                        <div
                          className="w-40 h-40 flex items-center justify-center text-7xl"
                          style={{ backgroundColor: P_LIGHT }}>
                          {item.emoji}
                        </div>
                      )}
                    </div>
                    {/* Content half */}
                    <div
                      className={`py-12 px-8 flex flex-col justify-center ${isOdd ? "sm:order-2" : "sm:order-1"}`}>
                      {i > 0 && (
                        <span className="text-5xl mb-4 block">
                          {item.emoji}
                        </span>
                      )}
                      <h3 className="font-black text-gray-900 text-2xl mb-3 leading-tight">
                        {item.title}
                      </h3>
                      <p className="text-gray-500 text-base leading-relaxed mb-4">
                        {item.description}
                      </p>
                      {item.link_text && (
                        <p
                          className="text-sm font-extrabold"
                          style={{ color: P }}>
                          {item.link_text}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center mt-12" data-reveal>
              <CtaBtn
                text={ctaText}
                sub={workshop.cta_button_subtext ?? undefined}
              />
            </div>
          </div>
        </section>

        {/* ─── BEFORE/AFTER — Offset overlap cards ─── */}
        <section
          className="py-20 px-4 sm:px-8"
          style={{ backgroundColor: P_LIGHT }}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16" data-reveal>
              <p className="text-gray-500 text-base">
                {workshop.before_after_title_plain}
              </p>
              <h2 className="text-3xl sm:text-4xl font-black text-gray-900 mt-1">
                {workshop.before_after_title_bold}
              </h2>
            </div>
            {/* Offset grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 items-start">
              {/* Before card: slightly higher */}
              <div
                className="bg-white overflow-hidden shadow-sm sm:-mt-6"
                style={{ borderTop: "4px solid #ef4444" }}
                data-reveal-left>
                {media?.before && (
                  <div className="relative aspect-video">
                    <Image
                      src={media.before}
                      alt="Before"
                      fill
                      className="object-cover"
                      sizes="(max-width:640px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-red-900/40 flex items-end p-4">
                      <span className="text-white font-black text-lg uppercase tracking-widest">
                        Before
                      </span>
                    </div>
                  </div>
                )}
                <div className="px-6 py-5 space-y-3">
                  {workshop.before_items.map((item, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className="text-red-400 font-black shrink-0">
                        ✗
                      </span>
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* After card: slightly lower */}
              <div
                className="bg-white overflow-hidden shadow-sm sm:mt-6"
                style={{ borderTop: `4px solid ${P}` }}
                data-reveal-right>
                {media?.after && (
                  <div className="relative aspect-video">
                    <Image
                      src={media.after}
                      alt="After"
                      fill
                      className="object-cover"
                      sizes="(max-width:640px) 100vw, 50vw"
                    />
                    <div
                      className="absolute inset-0 flex items-end p-4"
                      style={{ background: `${P}77` }}>
                      <span className="text-white font-black text-lg uppercase tracking-widest">
                        After
                      </span>
                    </div>
                  </div>
                )}
                <div className="px-6 py-5 space-y-3">
                  {workshop.after_items.map((item, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span
                        className="font-black shrink-0"
                        style={{ color: P }}>
                        ✓
                      </span>
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-12" data-reveal>
              <CtaBtn text={ctaText} />
            </div>
          </div>
        </section>

        {/* ─── INSTRUCTOR — Warm dark section ─── */}
        <section
          className="relative py-20 px-4 sm:px-8 overflow-hidden"
          style={{ backgroundColor: "#1c1917" }}>
          {/* Giant name texture */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <span
              className="font-black whitespace-nowrap"
              style={{
                fontSize: "9rem",
                color: "rgba(255,255,255,0.04)",
                lineHeight: 1,
              }}>
              {workshop.instructor_name}
            </span>
          </div>
          <div className="relative max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: photo with glow */}
              <div className="flex justify-center" data-reveal-left>
                <div
                  className="relative overflow-hidden shadow-2xl"
                  style={{
                    width: 280,
                    height: 360,
                    boxShadow: `0 0 60px ${P}55`,
                  }}>
                  {media?.instructor_bg ? (
                    <Image
                      src={media.instructor_bg}
                      alt={workshop.instructor_name ?? ""}
                      fill
                      className="object-cover"
                      sizes="280px"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 flex items-center justify-center text-8xl font-black"
                      style={{ backgroundColor: "#2d1f18", color: P }}>
                      {workshop.instructor_name?.[0]}
                    </div>
                  )}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, ${P}66, transparent 50%)`,
                    }}
                  />
                </div>
              </div>
              {/* Right: details */}
              <div data-reveal-right>
                <p
                  className="text-[10px] font-extrabold uppercase tracking-[0.3em] mb-3"
                  style={{ color: `${P}` }}>
                  Meet Your Mentor
                </p>
                <h2 className="text-3xl sm:text-4xl font-black text-white mb-1">
                  {workshop.instructor_name}
                </h2>
                {workshop.instructor_title && (
                  <p className="text-base mb-5" style={{ color: "#fb923c" }}>
                    {workshop.instructor_title}
                  </p>
                )}
                <div className="space-y-3 mb-6">
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
                {workshop.instructor_quote && (
                  <blockquote
                    className="border-l-4 pl-4 mb-6 italic text-sm leading-relaxed"
                    style={{ borderLeftColor: P, color: "#fdba74" }}>
                    &#8220;{workshop.instructor_quote}&#8221;
                  </blockquote>
                )}

                <CtaBtn text={ctaText} white />
              </div>
            </div>
          </div>
        </section>

        {/* ─── CURRICULUM — Elegant numbered list ─── */}
        <section
          className="py-20 px-4 sm:px-8"
          style={{ backgroundColor: P_OFF_WHITE }}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12" data-reveal>
              <p className="text-gray-500 text-base">
                {workshop.curriculum_title_plain}
              </p>
              <h2
                className="text-3xl sm:text-4xl font-black mt-1"
                style={{ color: P }}>
                {workshop.curriculum_title_highlight}
              </h2>
              {workshop.curriculum_ps && (
                <p className="text-xs text-gray-400 mt-2">
                  {workshop.curriculum_ps}
                </p>
              )}
            </div>
            <div>
              {workshop.curriculum.map((lesson, i) => (
                <div key={i}>
                  {i === 2 && (
                    <div className="py-8 flex justify-center" data-reveal>
                      <CtaBtn text={ctaText} />
                    </div>
                  )}
                  <div
                    className="flex items-start gap-6 py-8 border-b border-gray-200 last:border-b-0"
                    data-reveal>
                    {/* Big orange number */}
                    <span
                      className="text-5xl font-black leading-none shrink-0 select-none"
                      style={{ color: "#fed7aa" }}>
                      {String(lesson.lesson_num).padStart(2, "0")}
                    </span>
                    <div className="flex-1 pt-2">
                      <h3 className="font-black text-gray-900 text-lg mb-4">
                        {lesson.title}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {lesson.points.map((pt, j) => (
                          <p
                            key={j}
                            className="text-sm text-gray-500 flex items-start gap-2">
                            <span
                              className="shrink-0 mt-0.5 font-bold"
                              style={{ color: P }}>
                              →
                            </span>
                            <span>{pt}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-10" data-reveal>
              <CtaBtn
                text={ctaText}
                sub={workshop.cta_button_subtext ?? undefined}
              />
            </div>
          </div>
        </section>

        {/* ─── TESTIMONIALS ─── */}
        <TestimonialsSection workshop={workshop} />

        {/* ─── FAQ — Two-column split, left-aligned title ─── */}
        <WarmFaqSection
          workshop={workshop}
          onCta={openModal}
          ctaText={ctaText}
        />

        {/* ─── STICKY BAR ─── */}
        <WarmStickyBar
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

function WarmFaqSection({
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
    globalIdx,
  }: {
    item: { question: string; answer: string };
    globalIdx: number;
  }) {
    return (
      <div className="border-b border-gray-100">
        <button
          onClick={() => setOpen(open === globalIdx ? null : globalIdx)}
          className="w-full flex items-center justify-between py-4 text-left gap-4">
          <span className="font-extrabold text-gray-900 text-sm leading-snug">
            {item.question}
          </span>
          <span className="shrink-0" style={{ color: "#c2410c" }}>
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
    <section className="py-20 px-4 sm:px-8 pb-28 bg-white">
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-3xl sm:text-4xl font-black text-gray-900 mb-12"
          data-reveal>
          Got Questions?
          <br />
          <span style={{ color: "#c2410c" }}>We Have Answers.</span>
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-16">
          <div>
            {leftItems.map((item, i) => (
              <FaqItem key={i} item={item} globalIdx={i} />
            ))}
          </div>
          <div>
            {rightItems.map((item, i) => (
              <FaqItem key={i} item={item} globalIdx={half + i} />
            ))}
          </div>
        </div>
        <div className="flex justify-start mt-12" data-reveal></div>
      </div>
    </section>
  );
}

function WarmStickyBar({
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
      <div
        className="shadow-2xl px-4 py-3"
        style={{ backgroundColor: "#c2410c" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-orange-200">
              Reserve Your Spot
            </p>
          </div>
          <button
            onClick={onCta}
            className="flex items-center gap-2 px-6 py-3 font-extrabold uppercase tracking-widest text-sm shadow-md shrink-0 hover:opacity-90 transition-opacity bg-white"
            style={{ color: "#c2410c" }}>
            {ctaText}
            <svg
              className="w-3 h-3"
              style={{ color: "#c2410c" }}
              fill="currentColor"
              viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
