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
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&?/\s]+)/);
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

const P = "#0d9488";
const P_BG = "#f0fdfa";
const P_DARK = "#134e4a";

export function TemplateTealFresh({ workshop }: { workshop: WorkshopJson }) {
  const [showModal, setShowModal] = useState(false);
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
    white,
    full,
    outline,
  }: {
    text: string;
    sub?: string;
    white?: boolean;
    full?: boolean;
    outline?: boolean;
  }) {
    const isPrimary = !white && !outline;
    const style = white
      ? { backgroundColor: "white", color: P }
      : outline
        ? { border: `2px solid ${P}`, color: P, backgroundColor: "transparent" }
        : { backgroundColor: P, color: "white", '--cta-shadow': `${P}55`, '--cta-glow': `${P}88`, '--cta-ring': `${P}22` } as CSSProperties;
    return (
      <button
        onClick={openModal}
        className={`${full ? "w-full" : "inline-flex"} flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-extrabold uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-100 transition-all ${isPrimary ? 'cta-pulse' : ''}`}
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

  return (
    <>
      <style>{REVEAL_CSS}</style>
      <div className="font-sans antialiased bg-white">
        {/* ─── HERO — Centered SaaS product style ─── */}
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
              className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 mb-6 text-xs font-extrabold"
              style={{ borderColor: `${P}66`, color: P }}>
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
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
                    className="rounded-full border px-4 py-1.5 text-xs font-extrabold text-gray-700"
                    style={{ borderColor: `${P}55` }}>
                    <span style={{ color: P }}>{s.value}</span> {s.label}
                  </span>
                ))}
              </div>
            )}
            {/* CTA + price */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <CtaBtn
                text={ctaText}
                sub={workshop.cta_button_subtext ?? undefined}
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

          {/* Hero video / preview card */}
          {(workshop.youtube_url || media?.hero_preview) && (
            <div className="max-w-4xl mx-auto" data-reveal>
              <div
                className="rounded-2xl overflow-hidden relative"
                style={{
                  aspectRatio: "16/9",
                  boxShadow: `0 20px 60px ${P}33`,
                }}>
                {workshop.youtube_url ? (
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${getYouTubeId(workshop.youtube_url)}?rel=0&modestbranding=1`}
                    title={workshop.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                  />
                ) : media?.hero_preview ? (
                  <>
                    <Image
                      src={media.hero_preview}
                      alt={workshop.title}
                      fill
                      className="object-cover"
                      sizes="(max-width:768px) 100vw, 672px"
                      priority
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: `linear-gradient(to bottom, transparent 60%, ${P}22)`,
                      }}
                    />
                  </>
                ) : null}
              </div>
            </div>
          )}
        </section>

        {/* ─── PAIN — Dark teal glass cards ─── */}
        <section
          className="py-20 px-4 sm:px-8"
          style={{ backgroundColor: P_DARK }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12" data-reveal>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                {workshop.pain_section_title_plain}
                <br />
                <span style={{ color: "#5eead4" }}>
                  {workshop.pain_section_title_bold}
                </span>
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {workshop.pain_points.map((p, i) => {
                const painImg = media?.pain[i] ?? "";
                return (
                  <div
                    key={i}
                    className="relative rounded-2xl overflow-hidden p-6"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.07)",
                      border: "1px solid rgba(255,255,255,0.1)",
                    }}
                    data-reveal>
                    {/* Subtle bg image */}
                    {painImg && (
                      <div className="absolute inset-0">
                        <Image
                          src={painImg}
                          alt=""
                          fill
                          className="object-cover opacity-10"
                          sizes="33vw"
                        />
                      </div>
                    )}
                    <div className="relative">
                      <span
                        className="inline-block rounded-full px-3 py-1 text-xs font-extrabold mb-4"
                        style={{ backgroundColor: P, color: "white" }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h3 className="font-extrabold text-white text-lg mb-2">
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
            <div className="flex justify-center mt-10" data-reveal>
              <CtaBtn text="Fix This With Our Program" white />
            </div>
          </div>
        </section>

        {/* ─── FEATURES — Asymmetric bento grid ─── */}
        <section className="py-20 px-4 sm:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10" data-reveal>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                {workshop.features_section_title}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {workshop.features_section_items.map((item, i) => {
                const isMain = i === 0;
                return (
                  <div
                    key={i}
                    className={`relative rounded-2xl overflow-hidden p-6 ${isMain ? "lg:col-span-2 lg:row-span-2" : ""}`}
                    style={{
                      border: isMain ? `2px solid ${P}` : "1px solid #e0f2f1",
                      borderLeft: isMain ? `2px solid ${P}` : `4px solid ${P}`,
                      minHeight: isMain ? 260 : "auto",
                    }}
                    data-reveal>
                    {/* Main card bg image */}
                    {isMain && media?.product && (
                      <div className="absolute inset-0">
                        <Image
                          src={media.product}
                          alt=""
                          fill
                          className="object-cover opacity-[0.12]"
                          sizes="400px"
                        />
                      </div>
                    )}
                    <div className="relative">
                      <span className="text-3xl block mb-3">{item.emoji}</span>
                      <h3
                        className={`font-extrabold text-gray-900 mb-2 ${isMain ? "text-xl" : "text-base"}`}>
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
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center mt-10" data-reveal>
              <CtaBtn
                text={ctaText}
                sub={workshop.cta_button_subtext ?? undefined}
              />
            </div>
          </div>
        </section>

        {/* ─── BEFORE/AFTER — Horizontal panels with top bands ─── */}
        <section
          className="py-20 px-4 sm:px-8"
          style={{ backgroundColor: P_BG }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10" data-reveal>
              <p className="text-gray-500 text-base">
                {workshop.before_after_title_plain}
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-1">
                {workshop.before_after_title_bold}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Before */}
              <div
                className="bg-white rounded-2xl overflow-hidden shadow-sm"
                data-reveal-left>
                <div className="h-1.5 bg-red-500" />
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
                      <span className="text-white font-extrabold text-xl uppercase tracking-widest">
                        Before
                      </span>
                    </div>
                  </div>
                )}
                <div className="px-6 py-4 space-y-3">
                  {workshop.before_items.map((item, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className="text-red-400 font-bold shrink-0">✗</span>
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              {/* After */}
              <div
                className="bg-white rounded-2xl overflow-hidden shadow-sm"
                data-reveal-right>
                <div className="h-1.5" style={{ backgroundColor: P }} />
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
                      <span className="text-white font-extrabold text-xl uppercase tracking-widest">
                        After
                      </span>
                    </div>
                  </div>
                )}
                <div className="px-6 py-4 space-y-3">
                  {workshop.after_items.map((item, i) => (
                    <div key={i} className="flex gap-3 items-start">
                      <span className="font-bold shrink-0" style={{ color: P }}>
                        ✓
                      </span>
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-10" data-reveal>
              <CtaBtn text={ctaText} />
            </div>
          </div>
        </section>

        {/* ─── INSTRUCTOR — Card spotlight, centered ─── */}
        <section className="py-20 px-4 sm:px-8 bg-white">
          <div className="max-w-7xl mx-auto text-center">
            <p
              className="text-[10px] font-extrabold uppercase tracking-[0.3em] mb-4"
              style={{ color: P }}>
              Meet Your Instructor
            </p>
            {/* Photo */}
            {media?.instructor_bg && (
              <div
                className="mx-auto mb-6 relative rounded-2xl overflow-hidden shadow-xl"
                style={{
                  width: 280,
                  height: 320,
                  boxShadow: `0 24px 48px ${P}33`,
                }}
                data-reveal>
                <Image
                  src={media.instructor_bg}
                  alt={workshop.instructor_name ?? ""}
                  fill
                  className="object-cover"
                  sizes="280px"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: `linear-gradient(to top, ${P}55, transparent)`,
                  }}
                />
              </div>
            )}
            <h2 className="text-3xl font-extrabold text-gray-900 mb-1">
              {workshop.instructor_name}
            </h2>
            {workshop.instructor_title && (
              <p className="text-sm mb-5" style={{ color: P }}>
                {workshop.instructor_title}
              </p>
            )}
            {workshop.instructor_quote && (
              <blockquote className="italic text-gray-500 text-base leading-relaxed mb-6 max-w-7xl mx-auto">
                &#8220;{workshop.instructor_quote}&#8221;
              </blockquote>
            )}
            <div className="space-y-3 mb-8 text-left max-w-4xl mx-auto">
              {workshop.instructor_bio
                ?.split("\n")
                .filter(Boolean)
                .map((para, i) => (
                  <p key={i} className="text-gray-600 text-sm leading-relaxed">
                    {para}
                  </p>
                ))}
            </div>
            {/* Stats row */}
            {workshop.about_stats.length > 0 && (
              <div className="flex flex-wrap justify-center gap-6 mb-8 pt-6 border-t border-gray-100">
                {workshop.about_stats.slice(0, 4).map((s, i) => (
                  <div key={i}>
                    <p className="text-2xl font-extrabold" style={{ color: P }}>
                      {s.value}
                    </p>
                    <p className="text-xs text-gray-400 uppercase tracking-wide">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {/* Feature videos */}
            {workshop.instructor_feature_videos.length > 0 && (
              <div className="flex flex-wrap justify-center gap-3 mb-8">
                {workshop.instructor_feature_videos.map((v, i) => {
                const feature = media?.feature_videos?.[i];
                const thumbSrc = feature?.thumb ?? "";
                const videoUrl = feature?.youtube ?? null;
                const videoId = videoUrl ? getYouTubeId(videoUrl) : null;
                const isPlaying =
                  activeFeatureVideo === i && !!videoId;
                  return (
                    <div key={i} className="flex flex-col items-center gap-1">
                      <div
                        className="w-32 rounded-xl overflow-hidden relative"
                      style={{ height: 72, cursor: videoId ? "pointer" : "default" }}
                      onClick={
                        videoId
                          ? () => setActiveFeatureVideo(i)
                          : undefined
                      }>
                      {isPlaying && videoId ? (
                        <iframe
                          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
                          title={v.label}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 w-full h-full border-0"
                        />
                      ) : (
                        <>
                          {thumbSrc && (
                            <Image
                              src={thumbSrc}
                              alt={v.label}
                              fill
                              className="object-cover"
                              sizes="128px"
                            />
                          )}
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <div
                              className="w-7 h-7 rounded-full flex items-center justify-center"
                              style={{ backgroundColor: P }}>
                              <svg
                                className="w-3.5 h-3.5 text-white ml-0.5"
                                fill="currentColor"
                                viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </>
                      )}
                      </div>
                      <p className="text-[10px] text-gray-400">
                        in{" "}
                        <span className="font-extrabold" style={{ color: P }}>
                          {v.platform}
                        </span>
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
            <CtaBtn
              text={ctaText}
              sub={workshop.cta_button_subtext ?? undefined}
            />
          </div>
        </section>

        {/* ─── CURRICULUM — Tab navigation ─── */}
        <TealCurriculumSection
          workshop={workshop}
          onCta={openModal}
          ctaText={ctaText}
        />

        {/* ─── TESTIMONIALS ─── */}
        <TestimonialsSection workshop={workshop} />

        {/* ─── FAQ — Borderless list ─── */}
        <TealFaqSection
          workshop={workshop}
          onCta={openModal}
          ctaText={ctaText}
        />

        {/* ─── STICKY BAR ─── */}
        <TealStickyBar
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
        <div className="text-center mb-10" data-reveal>
          <p className="text-gray-500 text-base">
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
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 items-start">
          {/* Tab list */}
          <div className="flex lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0">
            {workshop.curriculum.map((lesson, i) => (
              <button
                key={i}
                onClick={() => setActiveTab(i)}
                className="shrink-0 text-left px-4 py-3 rounded-xl font-extrabold text-sm transition-all"
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
                <span className="block leading-tight">
                  {lesson.title.split(" ").slice(0, 4).join(" ")}
                  {lesson.title.split(" ").length > 4 ? "…" : ""}
                </span>
              </button>
            ))}
          </div>
          {/* Active lesson detail */}
          {active && (
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-teal-100">
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-extrabold text-sm shrink-0"
                  style={{ backgroundColor: "#0d9488" }}>
                  {active.lesson_num}
                </div>
                <h3 className="font-extrabold text-gray-900 text-lg">
                  {active.title}
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {active.points.map((pt, j) => (
                  <p
                    key={j}
                    className="text-sm text-gray-600 flex items-start gap-2">
                    <span
                      className="shrink-0 mt-0.5"
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
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-extrabold uppercase tracking-widest text-white text-sm shadow-md hover:scale-[1.02] transition-all"
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
      <div className="max-w-6xl mx-auto">
        <h2
          className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center mb-10"
          data-reveal>
          Frequently Asked Questions
        </h2>
        <div>
          {workshop.faq.map((item, i) => (
            <div key={i} className="border-b border-gray-100">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between py-5 text-left gap-4">
                <div className="flex items-center gap-3">
                  <span
                    className="w-5 h-5 rounded-full shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: "#f0fdfa" }}>
                    <svg
                      className="w-3 h-3"
                      style={{ color: "#0d9488" }}
                      fill="currentColor"
                      viewBox="0 0 24 24">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                    </svg>
                  </span>
                  <span className="font-extrabold text-gray-900 text-sm leading-snug">
                    {item.question}
                  </span>
                </div>
                <span className="shrink-0" style={{ color: "#0d9488" }}>
                  {open === i ? (
                    <Minus className="w-4 h-4" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </span>
              </button>
              {open === i && (
                <div className="pb-5 pl-8">
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-12">
          <button
            onClick={onCta}
            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-extrabold uppercase tracking-widest text-white text-sm shadow-md hover:scale-[1.02] transition-all"
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

function TealStickyBar({
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
        className="border-t border-teal-200 shadow-2xl px-4 py-3"
        style={{ backgroundColor: "#f0fdfa" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400">
              Reserve Your Spot
            </p>
          </div>
          <button
            onClick={onCta}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl font-extrabold uppercase tracking-widest text-white text-sm shadow-md shrink-0 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: "#0d9488" }}>
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
