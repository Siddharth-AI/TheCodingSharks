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
  [data-d1]{transition-delay:.1s}[data-d2]{transition-delay:.2s}[data-d3]{transition-delay:.3s}
  @keyframes ctaGlow{0%,100%{box-shadow:0 4px 16px var(--cta-shadow)}50%{box-shadow:0 6px 32px var(--cta-glow),0 0 0 6px var(--cta-ring)}}
  .cta-pulse{animation:ctaGlow 2s ease-in-out infinite}
`;

const CREAM = "#fdf8f2";
const CREAM_DARK = "#f5ede0";
const WARM_BROWN = "#7c4a1e";
const P = "#ea580c";

export function TemplateCreamWarm({ workshop }: { workshop: WorkshopJson }) {
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
  const heroBg = media?.hero_bg ?? "";
  const instructorImg = media?.instructor ?? "";
  const productImg = media?.product ?? "";
  const beforeImg = media?.before ?? "";
  const afterImg = media?.after ?? "";
  const instructorBg = media?.instructor_bg ?? "";

  function CtaBtn({
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
        className={`${full ? "w-full" : ""} group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-extrabold uppercase tracking-widest text-white text-sm hover:scale-[1.02] active:scale-100 transition-all cta-pulse`}
        style={
          {
            backgroundColor: P,
            "--cta-shadow": `${P}55`,
            "--cta-glow": `${P}88`,
            "--cta-ring": `${P}22`,
          } as CSSProperties
        }>
        <span className="flex-1 text-center">
          <span className="block">{text}</span>
          {sub && (
            <span className="block text-[10px] font-bold opacity-80 mt-0.5">
              {sub}
            </span>
          )}
        </span>
        <span className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
          <svg
            className="w-4 h-4 text-white"
            fill="currentColor"
            viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        </span>
      </button>
    );
  }

  return (
    <>
      <style>{REVEAL_CSS}</style>
      <div className="font-sans antialiased" style={{ backgroundColor: CREAM }}>
        {/* HERO — diagonal split: left content / right image */}
        <section
          className="relative overflow-hidden min-h-screen grid grid-cols-1 lg:grid-cols-[55%_45%]"
          style={{
            background: `linear-gradient(160deg, #fff7ee 0%, #fde8d0 60%, ${CREAM} 100%)`,
          }}>
          {/* Left: content */}
          <div className="flex flex-col justify-center px-6 py-16 sm:px-12 sm:py-20 lg:py-24 relative z-10">
            <div
              className="inline-flex items-center gap-2 rounded-full px-5 py-2 mb-8 text-white text-xs font-bold uppercase tracking-widest shadow-md self-start"
              style={{ backgroundColor: P }}
              data-reveal-up>
              <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
              {workshop.badge_text || "Live Workshop"} ·{" "}
              {workshop.badge_subtext}
            </div>

            <h1
              className="text-4xl sm:text-5xl xl:text-6xl font-extrabold text-gray-900 leading-tight mb-3"
              data-reveal>
              {workshop.title}
            </h1>
            {workshop.title_highlight && (
              <h1
                className="text-4xl sm:text-5xl xl:text-6xl font-extrabold leading-tight mb-6"
                style={{ color: P }}
                data-reveal
                data-d1>
                {workshop.title_highlight}
              </h1>
            )}

            <p
              className="text-gray-600 text-base leading-relaxed mb-8 max-w-lg"
              data-reveal
              data-d2
              dangerouslySetInnerHTML={{
                __html: workshop.subtitle || workshop.tagline,
              }}
            />

            {/* Instructor pill */}
            {workshop.instructor_name && (
              <div
                className="inline-flex items-center gap-3 bg-white rounded-2xl px-5 py-3 shadow-md mb-8 self-start"
                data-reveal
                data-d3>
                {instructorImg ? (
                  <div className="w-11 h-11 rounded-xl overflow-hidden relative shrink-0">
                    <Image
                      src={instructorImg}
                      alt={workshop.instructor_name}
                      fill
                      className="object-cover"
                      sizes="44px"
                    />
                  </div>
                ) : (
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-extrabold text-lg shrink-0"
                    style={{ backgroundColor: P }}>
                    {workshop.instructor_name[0]}
                  </div>
                )}
                <div>
                  <p className="font-extrabold text-gray-900 text-sm">
                    {workshop.instructor_name}
                  </p>
                  <p className="text-xs" style={{ color: P }}>
                    {workshop.instructor_title}
                  </p>
                </div>
              </div>
            )}

            <div className="max-w-xs mb-10" data-reveal>
              <CtaBtn
                text={ctaText}
                sub={workshop.cta_button_subtext ?? undefined}
                full
              />
            </div>

            {/* Stats row */}
            <div
              className="grid grid-cols-4 gap-4 pt-6 border-t-2 border-orange-100 max-w-lg"
              data-reveal>
              {workshop.about_stats.slice(0, 4).map((s, i) => (
                <div key={i}>
                  <p className="text-xl font-extrabold" style={{ color: P }}>
                    {s.value}
                  </p>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: full-height image or video */}
          <div className="relative hidden lg:block" data-reveal-right>
            {workshop.youtube_url ? (
              <div className="absolute inset-0 flex items-center justify-center bg-orange-50 p-8">
                <div
                  className="w-full rounded-2xl overflow-hidden shadow-2xl"
                  style={{ aspectRatio: "16/9" }}>
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${getYouTubeId(workshop.youtube_url)}?rel=0&modestbranding=1`}
                    title={workshop.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full border-0"
                  />
                </div>
              </div>
            ) : (
              <>
                {heroBg ? (
                  <Image
                    src={heroBg}
                    alt={workshop.title}
                    fill
                    className="object-cover"
                    sizes="45vw"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 bg-orange-100" />
                )}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(to right, rgba(253,248,242,0.7) 0%, transparent 40%)",
                  }}
                />
                {/* Duration floating badge */}
                <div className="absolute bottom-10 right-8 bg-white rounded-2xl shadow-xl px-6 py-4">
                  <p className="text-xs text-gray-400 uppercase tracking-widest mb-1">
                    Duration
                  </p>
                  <p className="font-extrabold text-gray-900 text-lg">
                    {workshop.duration}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {workshop.platform} · {workshop.mode}
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Mobile hero image/video (below content on small screens) */}
          <div className="lg:hidden relative aspect-video" data-reveal>
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
                    className="object-cover"
                    sizes="100vw"
                  />
                )}
                <div className="absolute inset-0 bg-orange-600/20" />
              </>
            )}
          </div>
        </section>

        {/* WHY JOIN */}
        {workshop.why_join_items.length > 0 && (
          <section
            className="py-16 px-4"
            style={{ backgroundColor: CREAM_DARK }}>
            <div className="max-w-5xl mx-auto">
              <h2
                className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center mb-10"
                data-reveal>
                Why Thousands Choose This Program
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {workshop.why_join_items.map((item, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-5 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow"
                    data-reveal>
                    <div
                      className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-white text-sm font-bold"
                      style={{ backgroundColor: P }}>
                      {i + 1}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* PAIN POINTS — zigzag alternating rows */}
        <section className="py-16 px-4" style={{ backgroundColor: CREAM }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14" data-reveal>
              <p className="text-gray-500 text-lg mb-1">
                {workshop.pain_section_title_plain}
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
                {workshop.pain_section_title_bold}
              </h2>
            </div>
            <div className="space-y-0 border-t-2 border-orange-100">
              {workshop.pain_points.map((p, i) => {
                const painImg = media?.pain[i] ?? "";
                const isOdd = i % 2 === 1;
                return (
                  <div
                    key={i}
                    className={`grid grid-cols-1 lg:grid-cols-2 min-h-[300px] border-b-2 border-orange-100 ${isOdd ? "lg:grid-flow-col" : ""}`}
                    data-reveal>
                    {/* Image side */}
                    <div
                      className={`relative min-h-[240px] lg:min-h-auto overflow-hidden ${isOdd ? "lg:order-2" : ""}`}>
                      {painImg ? (
                        <Image
                          src={painImg}
                          alt={p.title}
                          fill
                          className="object-cover"
                          sizes="50vw"
                        />
                      ) : (
                        <div
                          className="absolute inset-0"
                          style={{ backgroundColor: `${P}15` }}
                        />
                      )}
                      <div
                        className="absolute inset-0"
                        style={{
                          background: isOdd
                            ? "linear-gradient(to left, rgba(253,248,242,0.3), rgba(234,88,12,0.25))"
                            : "linear-gradient(to right, rgba(253,248,242,0.3), rgba(234,88,12,0.25))",
                        }}
                      />
                      <div
                        className="absolute top-4 left-4 w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold text-sm"
                        style={{ backgroundColor: P }}>
                        {String(i + 1).padStart(2, "0")}
                      </div>
                    </div>
                    {/* Text side */}
                    <div
                      className={`flex flex-col justify-center px-8 py-10 bg-white ${isOdd ? "lg:order-1" : ""}`}>
                      <h3
                        className="font-extrabold text-gray-900 text-xl mb-4"
                        style={{
                          borderLeft: `3px solid ${P}`,
                          paddingLeft: "16px",
                        }}>
                        {p.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed">
                        {p.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center mt-10" data-reveal>
              <CtaBtn text="Fix This With Our Course" />
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section
          className="py-12 px-4 sm:py-16 rounded-3xl mx-2 sm:mx-4 mb-8"
          style={{ backgroundColor: P }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10" data-reveal>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {workshop.features_section_title}
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                data-reveal-left>
                {workshop.features_section_items.map((item, i) => (
                  <div
                    key={i}
                    className="bg-white/15 backdrop-blur rounded-2xl p-5 border border-white/20 hover:bg-white/20 transition-all">
                    <span className="text-3xl mb-3 block">{item.emoji}</span>
                    <h3 className="font-extrabold text-white text-sm mb-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-white/70 text-xs leading-relaxed mb-2">
                      {item.description}
                    </p>
                    <p className="text-xs font-bold text-white/90">
                      {item.link_text}
                    </p>
                  </div>
                ))}
              </div>
              <div data-reveal-right>
                <div className="rounded-3xl overflow-hidden aspect-4/3 relative shadow-2xl border-4 border-white/20">
                  {productImg && (
                    <Image
                      src={productImg}
                      alt="Program"
                      fill
                      className="object-cover"
                      sizes="500px"
                    />
                  )}
                  <div
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(0,0,0,0.2), transparent)",
                    }}
                  />
                </div>
                <div className="mt-6">
                  <button
                    onClick={openModal}
                    className="w-full py-4 rounded-2xl font-extrabold uppercase tracking-widest text-orange-600 text-sm shadow-lg hover:shadow-xl bg-white transition-all">
                    {ctaText}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BEFORE/AFTER — vertical stacked */}
        <section className="py-16 px-4" style={{ backgroundColor: CREAM_DARK }}>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10" data-reveal>
              <p className="text-gray-500 text-lg">
                {workshop.before_after_title_plain}
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-1">
                {workshop.before_after_title_bold}
              </h2>
            </div>

            {/* BEFORE block */}
            <div
              className="bg-white rounded-3xl overflow-hidden shadow-sm border-2 border-red-100 mb-0"
              data-reveal-left>
              <div
                className="px-6 py-4 flex items-center gap-3"
                style={{ backgroundColor: "#fef2f2" }}>
                <span className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-extrabold text-sm">
                  ✗
                </span>
                <h3 className="font-extrabold text-red-700 uppercase tracking-widest text-sm">
                  Before This Program
                </h3>
              </div>
              {beforeImg && (
                <div className="relative aspect-[5/2] overflow-hidden">
                  <Image
                    src={beforeImg}
                    alt="Before"
                    fill
                    className="object-cover grayscale opacity-60"
                    sizes="(max-width:640px) 100vw, 700px"
                  />
                  <div className="absolute inset-0 bg-red-600/30" />
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-red-50 px-6 py-2">
                {workshop.before_items.map((item, i) => (
                  <div key={i} className="py-3 flex gap-3 items-start">
                    <span className="text-red-400 font-bold shrink-0 mt-0.5">
                      ✗
                    </span>
                    <span className="text-sm text-gray-600">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Connector arrow */}
            <div className="flex justify-center items-center py-4" data-reveal>
              <div className="flex flex-col items-center gap-1">
                <div className="w-0.5 h-6 bg-orange-300" />
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold shadow-lg"
                  style={{ backgroundColor: P }}>
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24">
                    <path d="M7 10l5 5 5-5z" />
                  </svg>
                </div>
                <div className="w-0.5 h-6 bg-orange-300" />
              </div>
            </div>

            {/* AFTER block */}
            <div
              className="bg-white rounded-3xl overflow-hidden shadow-sm border-2 border-orange-200"
              data-reveal-right>
              <div
                className="px-6 py-4 flex items-center gap-3"
                style={{ backgroundColor: "#fff7ed" }}>
                <span
                  className="w-8 h-8 rounded-full text-white flex items-center justify-center font-extrabold text-sm"
                  style={{ backgroundColor: P }}>
                  ✓
                </span>
                <h3
                  className="font-extrabold uppercase tracking-widest text-sm"
                  style={{ color: P }}>
                  After This Program
                </h3>
              </div>
              {afterImg && (
                <div className="relative aspect-[5/2] overflow-hidden">
                  <Image
                    src={afterImg}
                    alt="After"
                    fill
                    className="object-cover opacity-80"
                    sizes="(max-width:640px) 100vw, 700px"
                  />
                  <div className="absolute inset-0 bg-orange-600/20" />
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 divide-y sm:divide-y-0 sm:divide-x divide-orange-50 px-6 py-2">
                {workshop.after_items.map((item, i) => (
                  <div key={i} className="py-3 flex gap-3 items-start">
                    <span
                      className="font-bold shrink-0 mt-0.5"
                      style={{ color: P }}>
                      ✓
                    </span>
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* INSTRUCTOR */}
        <section
          className="py-12 px-4 sm:py-16"
          style={{ backgroundColor: WARM_BROWN }}>
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
              <div className="flex justify-center" data-reveal-left>
                <div className="relative w-72 h-80 rounded-3xl overflow-hidden shadow-2xl border-4 border-orange-200/30">
                  {instructorBg ? (
                    <Image
                      src={instructorBg}
                      alt={workshop.instructor_name ?? ""}
                      fill
                      className="object-cover"
                      sizes="288px"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-orange-400/30 flex items-center justify-center">
                      <span className="text-white text-8xl font-black">
                        {workshop.instructor_name?.[0]}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <div data-reveal-right>
                <p className="text-orange-200 text-sm font-bold uppercase tracking-widest mb-3">
                  Meet Your Mentor
                </p>
                <h2 className="text-4xl font-extrabold text-white mb-2">
                  {workshop.instructor_name}
                </h2>
                {workshop.instructor_title && (
                  <p className="text-orange-200 text-sm mb-6">
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
                        className="text-orange-100 text-sm leading-relaxed">
                        {para}
                      </p>
                    ))}
                </div>
                <div className="flex flex-wrap gap-3">
                  {workshop.instructor_feature_videos.map((v, i) => {
                    const feature = media?.feature_videos?.[i];
                    const thumbSrc = feature?.thumb ?? "";
                    const videoUrl = feature?.youtube ?? null;
                    const videoId = videoUrl ? getYouTubeId(videoUrl) : null;
                    const isPlaying = activeFeatureVideo === i && !!videoId;
                    return (
                      <div
                        key={i}
                        className="w-36 h-20 rounded-2xl overflow-hidden relative border-2 border-orange-200/30"
                        style={{ cursor: videoId ? "pointer" : "default" }}
                        onClick={
                          videoId ? () => setActiveFeatureVideo(i) : undefined
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
                                sizes="144px"
                              />
                            )}
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                              <span className="text-white text-[10px] font-bold px-2 text-center">
                                {v.platform}
                              </span>
                            </div>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CURRICULUM — vertical timeline */}
        <section className="py-16 px-4" style={{ backgroundColor: CREAM }}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12" data-reveal>
              <h2 className="text-2xl font-bold text-gray-700">
                {workshop.curriculum_title_plain}
              </h2>
              <h2
                className="text-3xl sm:text-4xl font-extrabold mt-1"
                style={{ color: P }}>
                {workshop.curriculum_title_highlight}
              </h2>
              {workshop.curriculum_ps && (
                <p className="text-sm text-gray-400 mt-2">
                  {workshop.curriculum_ps}
                </p>
              )}
            </div>
            <div className="relative">
              {/* Vertical timeline line */}
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-orange-200 hidden sm:block" />
              <div className="space-y-4">
                {workshop.curriculum.map((lesson, i) => (
                  <div key={i} className="flex gap-6 items-start" data-reveal>
                    {/* Timeline dot */}
                    <div className="hidden sm:flex flex-col items-center shrink-0">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white text-sm font-extrabold shadow-md relative z-10"
                        style={{ backgroundColor: P }}>
                        {lesson.lesson_num}
                      </div>
                    </div>
                    {/* Content */}
                    <div className="flex-1 bg-white rounded-2xl overflow-hidden shadow-sm border border-orange-50 hover:shadow-md transition-shadow mb-0">
                      <div className="px-5 py-4 flex items-center gap-3 border-b border-orange-50">
                        <div
                          className="sm:hidden w-8 h-8 rounded-xl flex items-center justify-center text-white text-xs font-extrabold shrink-0"
                          style={{ backgroundColor: P }}>
                          {lesson.lesson_num}
                        </div>
                        <h3 className="font-extrabold text-gray-900 text-sm">
                          {lesson.title}
                        </h3>
                      </div>
                      <div className="px-5 py-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {lesson.points.map((pt, j) => (
                          <p
                            key={j}
                            className="text-xs text-gray-600 flex items-start gap-1.5">
                            <span className="shrink-0" style={{ color: P }}>
                              ✓
                            </span>
                            <span>{pt}</span>
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-10" data-reveal>
              <CtaBtn text={ctaText} full />
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <TestimonialsSection workshop={workshop} />

        {/* FAQ */}
        <WarmFaqSection
          workshop={workshop}
          onCta={openModal}
          ctaText={ctaText}
        />

        {/* STICKY BAR */}
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
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section
      className="py-16 px-4 pb-24"
      style={{ backgroundColor: "#fdf0e4" }}>
      <div className="max-w-3xl mx-auto">
        <h2
          className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center mb-10"
          data-reveal>
          Got Questions? We Have Answers
        </h2>
        <div className="space-y-4">
          {workshop.faq.map((item, i) => (
            <div
              key={i}
              className={`rounded-2xl overflow-hidden border-2 transition-all ${open === i ? `border-orange-300 shadow-md` : "border-orange-100 bg-white"}`}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left gap-4"
                style={{ backgroundColor: open === i ? "#fff7ed" : "white" }}>
                <span className="text-sm font-extrabold text-gray-900 uppercase tracking-wide">
                  {item.question}
                </span>
                <span
                  className="shrink-0 w-7 h-7 rounded-xl flex items-center justify-center text-white text-xs font-bold"
                  style={{ backgroundColor: P }}>
                  {open === i ? (
                    <Minus className="w-3.5 h-3.5" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-5 bg-orange-50/30">
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-10 mb-24"></div>
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
      <div className="border-t-2 border-orange-100 shadow-2xl px-4 py-3 bg-white">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-500">
              Reserve Your Spot
            </p>
          </div>
          <button
            onClick={onCta}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-extrabold uppercase tracking-widest text-white text-sm shadow-lg shrink-0 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: P }}>
            {ctaText}
            <svg
              className="w-3 h-3 text-white"
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
