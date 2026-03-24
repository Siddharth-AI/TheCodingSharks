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
  [data-reveal]{transform:translateY(24px)}[data-reveal-left]{transform:translateX(-28px)}[data-reveal-right]{transform:translateX(28px)}[data-reveal-up]{transform:translateY(-20px)}
  [data-reveal].revealed,[data-reveal-left].revealed,[data-reveal-right].revealed,[data-reveal-up].revealed{opacity:1;transform:none}
  [data-d1]{transition-delay:.1s}[data-d2]{transition-delay:.2s}[data-d3]{transition-delay:.3s}[data-d4]{transition-delay:.4s}[data-d5]{transition-delay:.5s}
  @keyframes ctaGlow{0%,100%{box-shadow:0 4px 16px var(--cta-shadow)}50%{box-shadow:0 6px 32px var(--cta-glow),0 0 0 6px var(--cta-ring)}}
  .cta-pulse{animation:ctaGlow 2s ease-in-out infinite}
`;

function PlayIcon() {
  return (
    <svg
      className="w-8 h-8 text-white ml-1"
      fill="currentColor"
      viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ?? "w-4 h-4 text-white"}
      fill="currentColor"
      viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}
function CheckIcon() {
  return (
    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
}

export function TemplateDarkHero({ workshop }: { workshop: WorkshopJson }) {
  const [showModal, setShowModal] = useState(false);
  const openModal = useCallback(() => setShowModal(true), []);
  useScrollReveal();
  const stickyVisible = useStickyBar();
  const [activeFeatureVideo, setActiveFeatureVideo] = useState<number | null>(
    null,
  );
  const [activeFeature, setActiveFeature] = useState(0);
  const P = workshop.page_primary_color || "#ea580c";
  const ctaText = workshop.cta_button_text || "ENROLL NOW";

  const media =
    (mediaData.workshops as Record<string, WorkshopMedia>)[workshop.slug] ??
    null;

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
        className={`${full ? "w-full" : ""} group inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-extrabold uppercase tracking-widest text-white text-sm hover:scale-[1.03] active:scale-100 transition-all cta-pulse`}
        style={
          {
            background: `linear-gradient(135deg, ${P} 0%, ${P}dd 100%)`,
            "--cta-shadow": `${P}55`,
            "--cta-glow": `${P}88`,
            "--cta-ring": `${P}22`,
          } as CSSProperties
        }>
        <span className="flex-1 text-center">
          <span className="block">{text}</span>
          {sub && (
            <span className="block text-[10px] font-bold opacity-80 mt-0.5 tracking-widest">
              {sub}
            </span>
          )}
        </span>
        <span className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center shrink-0 group-hover:bg-white/30 transition-colors">
          <ArrowIcon />
        </span>
      </button>
    );
  }

  const heroBg = media?.hero_bg ?? "";
  const heroPreview = media?.hero_preview ?? "";
  const instructorImg = media?.instructor ?? "";
  const instructorBg = media?.instructor_bg ?? "";
  const productImg = media?.product ?? "";
  const beforeImg = media?.before ?? "";
  const afterImg = media?.after ?? "";

  return (
    <>
      <style>{REVEAL_CSS}</style>
      <div
        className="font-sans antialiased"
        style={{ backgroundColor: "#06080f" }}>
        {/* HERO */}
        <section className="relative min-h-screen flex items-center overflow-hidden pt-12 pb-10 px-4 sm:pt-16">
          {heroBg && (
            <Image
              src={heroBg}
              alt=""
              fill
              className="object-cover opacity-15"
              priority
              sizes="100vw"
            />
          )}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, #06080f 0%, #06080faa 50%, #06080f 100%)",
            }}
          />
          <div
            className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${P}22 0%, transparent 65%)`,
            }}
          />

          <div className="relative max-w-6xl mx-auto w-full">
            <div className="flex justify-center mb-8" data-reveal>
              <div className="inline-flex items-center gap-0 rounded-full overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm">
                <span
                  className="px-4 py-2 text-xs font-extrabold text-white uppercase tracking-widest rounded-full"
                  style={{ backgroundColor: P }}>
                  {workshop.badge_text || "Enroll Now"}
                </span>
                <span className="px-5 py-2 text-sm text-gray-300 font-medium">
                  {workshop.badge_subtext || workshop.tagline}
                </span>
              </div>
            </div>

            <div className="text-center mb-6" data-reveal data-d1>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight tracking-tight">
                {workshop.title}
              </h1>
              {workshop.title_highlight && (
                <h1
                  className="text-4xl sm:text-6xl md:text-7xl font-extrabold leading-tight tracking-tight mt-2"
                  style={{ color: P }}>
                  {workshop.title_highlight}
                </h1>
              )}
            </div>

            <p
              className="text-center text-gray-400 text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
              data-reveal
              data-d2
              dangerouslySetInnerHTML={{
                __html: workshop.subtitle || workshop.tagline,
              }}
            />

            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-6 items-start w-full">
              <div className="space-y-4" data-reveal-left>
                <div
                  className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
                  style={{ boxShadow: `0 0 60px ${P}22` }}>
                  <div className="aspect-video relative bg-gray-900">
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
                        {heroPreview && (
                          <Image
                            src={heroPreview}
                            alt="Preview"
                            fill
                            className="object-cover opacity-50"
                            sizes="600px"
                          />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <button
                            onClick={openModal}
                            className="w-20 h-20 rounded-full border-4 border-white/30 flex items-center justify-center hover:scale-110 transition-transform"
                            style={{ backgroundColor: `${P}cc` }}>
                            <PlayIcon />
                          </button>
                        </div>
                        <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 rounded-lg px-3 py-2 backdrop-blur-sm">
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-extrabold"
                            style={{ backgroundColor: P }}>
                            CS
                          </div>
                          <div>
                            <p className="text-white text-xs font-bold leading-none">
                              {workshop.title.split(" ").slice(0, 3).join(" ")}
                            </p>
                            <p className="text-gray-400 text-[10px]">
                              CodingShark
                            </p>
                          </div>
                        </div>
                        <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm rounded-lg px-3 py-1.5">
                          <p className="text-white text-xs font-bold">
                            {workshop.duration} · {workshop.platform}
                          </p>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {workshop.instructor_name && (
                  <div className="rounded-2xl p-4 flex items-start gap-4 border border-white/10 bg-white/5 backdrop-blur-sm">
                    {instructorImg ? (
                      <div className="w-14 h-14 rounded-xl overflow-hidden relative shrink-0 border border-white/20">
                        <Image
                          src={instructorImg}
                          alt={workshop.instructor_name}
                          fill
                          className="object-cover"
                          sizes="56px"
                        />
                      </div>
                    ) : (
                      <div
                        className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-xl shrink-0"
                        style={{ backgroundColor: P }}>
                        {workshop.instructor_name[0]}
                      </div>
                    )}
                    <div className="flex-1">
                      <span
                        className="text-xs font-bold text-white px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: P }}>
                        Meet Your Trainer
                      </span>
                      <p className="font-extrabold text-white mt-1">
                        {workshop.instructor_name}
                      </p>
                      <p className="text-gray-400 text-xs leading-relaxed line-clamp-2 mt-0.5">
                        {workshop.instructor_bio?.split("\n")[0]}
                      </p>
                    </div>
                  </div>
                )}

                <CtaBtn
                  text={ctaText}
                  sub={workshop.cta_button_subtext ?? undefined}
                  full
                />
              </div>

              {workshop.why_join_items.length > 0 && (
                <div
                  className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6"
                  data-reveal-right>
                  <h3 className="text-lg font-extrabold text-white mb-5 text-center">
                    Why Join This Program?
                  </h3>
                  <ul className="space-y-3">
                    {workshop.why_join_items.map((item, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-3 rounded-xl px-4 py-3 border border-white/8 bg-white/5">
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                          style={{ backgroundColor: P }}>
                          <CheckIcon />
                        </span>
                        <span className="text-sm text-gray-300 leading-snug">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-2 gap-3">
                    {workshop.about_stats.slice(0, 4).map((s, i) => (
                      <div key={i} className="text-center">
                        <p
                          className="text-xl font-extrabold"
                          style={{ color: P }}>
                          {s.value}
                        </p>
                        <p className="text-gray-500 text-[10px] uppercase tracking-wide">
                          {s.label}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* PAIN POINTS */}
        <section className="py-16 px-4" style={{ backgroundColor: "#0d1117" }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12" data-reveal>
              <p className="text-xl sm:text-2xl font-semibold text-gray-300">
                {workshop.pain_section_title_plain}
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                {workshop.pain_section_title_bold}
              </h2>
            </div>
            <div className="space-y-0 border-t border-white/10">
              {workshop.pain_points.map((p, i) => {
                const painImg = media?.pain[i] ?? "";
                return (
                  <div
                    key={i}
                    className="grid grid-cols-[72px_1fr] sm:grid-cols-[100px_1fr] items-start border-b border-white/10 py-7 gap-6 group hover:bg-white/3 transition-colors px-2"
                    data-reveal>
                    <div className="text-right">
                      <span
                        className="text-5xl sm:text-6xl font-black leading-none"
                        style={{ color: `${P}28` }}>
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <div className="flex items-start gap-4">
                      {painImg && (
                        <div className="hidden sm:block w-24 h-16 rounded-lg overflow-hidden relative shrink-0 border border-white/10">
                          <Image
                            src={painImg}
                            alt={p.title}
                            fill
                            className="object-cover opacity-60"
                            sizes="96px"
                          />
                        </div>
                      )}
                      <div>
                        <p
                          className="text-[10px] font-bold uppercase tracking-widest mb-1.5"
                          style={{ color: P }}>
                          Challenge #{i + 1}
                        </p>
                        <h3 className="font-extrabold text-white text-base sm:text-lg mb-1.5">
                          {p.title}
                        </h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                          {p.description}
                        </p>
                      </div>
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
        <section className="py-16 px-4" style={{ backgroundColor: "#06080f" }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-8" data-reveal>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-snug">
                {workshop.features_section_title}
              </h2>
            </div>
            {/* Tab buttons */}
            <div
              className="flex flex-wrap gap-2 justify-center mb-8"
              data-reveal>
              {workshop.features_section_items.map((item, i) => (
                <button
                  key={i}
                  onClick={() => setActiveFeature(i)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all border"
                  style={
                    activeFeature === i
                      ? { backgroundColor: P, color: "white", borderColor: P }
                      : {
                          backgroundColor: "transparent",
                          color: "#9ca3af",
                          borderColor: "#1e2736",
                        }
                  }>
                  <span>{item.emoji}</span>
                  <span className="hidden sm:inline">{item.title}</span>
                </button>
              ))}
            </div>
            {/* Active tab panel */}
            {workshop.features_section_items[activeFeature] && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div
                  className="rounded-2xl border border-white/10 p-8"
                  style={{ backgroundColor: "#0d1117" }}
                  data-reveal-left>
                  <span className="text-5xl mb-5 block">
                    {workshop.features_section_items[activeFeature].emoji}
                  </span>
                  <h3 className="text-2xl font-extrabold text-white mb-3">
                    {workshop.features_section_items[activeFeature].title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed mb-5">
                    {workshop.features_section_items[activeFeature].description}
                  </p>
                  <p className="text-sm font-bold mb-6" style={{ color: P }}>
                    → {workshop.features_section_items[activeFeature].link_text}
                  </p>
                  <CtaBtn text={ctaText} full />
                </div>
                <div
                  className="relative rounded-2xl overflow-hidden aspect-4/3 border border-white/10"
                  style={{ boxShadow: `0 0 80px ${P}18` }}
                  data-reveal-right>
                  {productImg && (
                    <Image
                      src={productImg}
                      alt="Course"
                      fill
                      className="object-cover opacity-80"
                      sizes="500px"
                    />
                  )}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(135deg, ${P}33 0%, transparent 60%)`,
                    }}
                  />
                  <div className="absolute top-4 left-4">
                    <span
                      className="px-3 py-1.5 rounded-lg text-white text-xs font-extrabold uppercase tracking-widest"
                      style={{ backgroundColor: P }}>
                      {activeFeature + 1} /{" "}
                      {workshop.features_section_items.length}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* BEFORE/AFTER */}
        <section className="py-16 px-4" style={{ backgroundColor: "#111827" }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10" data-reveal>
              <p className="text-xl font-semibold text-gray-300">
                {workshop.before_after_title_plain}
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
                {workshop.before_after_title_bold}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div
                className="rounded-2xl overflow-hidden border-2 border-red-500/30"
                data-reveal-left>
                {beforeImg && (
                  <div className="relative aspect-3/2 overflow-hidden">
                    <Image
                      src={beforeImg}
                      alt="Before"
                      fill
                      className="object-cover opacity-50"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-red-900/60" />
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-extrabold text-white tracking-[0.2em] drop-shadow-lg">
                      BEFORE
                    </span>
                  </div>
                )}
                {!beforeImg && (
                  <div
                    className="flex items-center justify-center py-8"
                    style={{ backgroundColor: "rgba(239,68,68,0.15)" }}>
                    <span className="text-4xl font-extrabold text-white tracking-[0.2em]">
                      BEFORE
                    </span>
                  </div>
                )}
                <div className="divide-y divide-dashed divide-red-500/20 px-5 py-1 bg-red-500/5">
                  {workshop.before_items.map((item, i) => (
                    <div key={i} className="py-3.5 flex items-start gap-3">
                      <span className="text-red-400 font-bold text-base shrink-0">
                        ✗
                      </span>
                      <span className="text-sm text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="rounded-2xl overflow-hidden border-2 border-green-500/30"
                data-reveal-right>
                {afterImg && (
                  <div className="relative aspect-3/2 overflow-hidden">
                    <Image
                      src={afterImg}
                      alt="After"
                      fill
                      className="object-cover opacity-50"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                    <div className="absolute inset-0 bg-green-900/60" />
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-extrabold text-white tracking-[0.2em] drop-shadow-lg">
                      AFTER
                    </span>
                  </div>
                )}
                {!afterImg && (
                  <div
                    className="flex items-center justify-center py-8"
                    style={{ backgroundColor: "rgba(34,197,94,0.15)" }}>
                    <span className="text-4xl font-extrabold text-white tracking-[0.2em]">
                      AFTER
                    </span>
                  </div>
                )}
                <div className="divide-y divide-dashed divide-green-500/20 px-5 py-1 bg-green-500/5">
                  {workshop.after_items.map((item, i) => (
                    <div key={i} className="py-3.5 flex items-start gap-3">
                      <span className="text-green-400 font-bold text-base shrink-0">
                        ✓
                      </span>
                      <span className="text-sm text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INSTRUCTOR */}
        <section
          className="relative overflow-hidden px-4 py-12 sm:px-0 sm:py-0"
          style={{ backgroundColor: "#0d1117" }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px]">
            <div className="relative hidden lg:block" data-reveal-left>
              {instructorBg && (
                <Image
                  src={instructorBg}
                  alt="Mentor"
                  fill
                  className="object-cover opacity-40"
                  sizes="50vw"
                />
              )}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to right, transparent 60%, #0d1117)",
                }}
              />
            </div>
            <div
              className="relative z-10 px-4 py-10 sm:px-8 sm:py-14 flex flex-col justify-center"
              data-reveal-right>
              <p
                className="text-sm font-bold uppercase tracking-widest mb-3"
                style={{ color: P }}>
                Meet Your Mentor
              </p>
              <h2
                className="text-4xl sm:text-5xl font-extrabold text-white mb-2 pl-3 border-l-4"
                style={{ borderColor: P }}>
                {workshop.instructor_name}
              </h2>
              {workshop.instructor_title && (
                <p className="text-gray-400 text-sm mb-5 pl-3">
                  {workshop.instructor_title}
                </p>
              )}
              <div className="space-y-3 mb-8 max-w-md">
                {workshop.instructor_bio
                  ?.split("\n")
                  .filter(Boolean)
                  .map((p, i) => (
                    <p
                      key={i}
                      className="text-gray-300 text-sm leading-relaxed">
                      {p}
                    </p>
                  ))}
              </div>
              {workshop.instructor_feature_videos.length > 0 && (
                <div className="flex flex-wrap gap-4">
                  {workshop.instructor_feature_videos.map((v, i) => {
                    const feature = media?.feature_videos?.[i];
                    const thumbSrc = feature?.thumb ?? "";
                    const videoUrl = feature?.youtube ?? null;
                    const videoId = videoUrl ? getYouTubeId(videoUrl) : null;
                    const isPlaying =
                      activeFeatureVideo === i && !!videoId;
                    return (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div
                          className="w-44 h-28 rounded-xl overflow-hidden relative border border-white/10 shadow-xl"
                          style={{ cursor: videoId ? "pointer" : "default" }}
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
                                  sizes="176px"
                                />
                              )}
                              {!thumbSrc && (
                                <div className="absolute inset-0 bg-white/5" />
                              )}
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                <div className="w-8 h-8 rounded-full bg-white/80 flex items-center justify-center">
                                  <ArrowIcon className="w-4 h-4 ml-0.5" />
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                        <p className="text-gray-400 text-xs">
                          Featured in{" "}
                          <span className="font-extrabold" style={{ color: P }}>
                            {v.platform}
                          </span>
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* CURRICULUM */}
        <section
          className="py-12 px-4 sm:py-16"
          style={{ backgroundColor: "#0d1117" }}>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8" data-reveal>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-300">
                {workshop.curriculum_title_plain}
              </h2>
              <h2
                className="text-3xl sm:text-4xl font-extrabold"
                style={{ color: P }}>
                {workshop.curriculum_title_highlight}
              </h2>
              {workshop.curriculum_ps && (
                <p className="mt-3 text-sm text-gray-500">
                  PS: <span style={{ color: P }}>{workshop.curriculum_ps}</span>
                </p>
              )}
            </div>
            <div className="space-y-2" data-reveal>
              {workshop.curriculum.map((lesson, i) => (
                <DarkAccordionLesson key={i} lesson={lesson} primary={P} />
              ))}
            </div>
            <div className="mt-8" data-reveal>
              <CtaBtn text={ctaText} full />
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <TestimonialsSection workshop={workshop} dark />

        {/* FAQ */}
        <DarkFaqSection
          workshop={workshop}
          primary={P}
          onCta={openModal}
          ctaText={ctaText}
        />

        {/* STICKY BAR */}
        <DarkStickyBar
          visible={stickyVisible}
          workshop={workshop}
          primary={P}
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

function DarkAccordionLesson({
  lesson,
  primary,
}: {
  lesson: { lesson_num: number; title: string; points: string[] };
  primary: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div
      className="rounded-xl overflow-hidden border transition-all"
      style={{
        backgroundColor: open ? "#131820" : "#0a0e16",
        borderColor: open ? `${primary}44` : "#1e2736",
      }}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left gap-4">
        <div className="flex items-center gap-4">
          <span
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-extrabold shrink-0"
            style={{ backgroundColor: primary }}>
            {lesson.lesson_num}
          </span>
          <span className="font-extrabold text-white text-sm">
            {lesson.title}
          </span>
        </div>
        {open ? (
          <Minus className="w-4 h-4 text-gray-400 shrink-0" />
        ) : (
          <Plus className="w-4 h-4 text-gray-400 shrink-0" />
        )}
      </button>
      {open && (
        <div className="px-5 pb-4 border-t border-white/10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-3">
            {lesson.points.map((pt, j) => (
              <p
                key={j}
                className="text-xs text-gray-400 flex items-start gap-1.5">
                <span className="text-green-400 shrink-0">✓</span>
                <span>{pt}</span>
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function DarkFaqSection({
  workshop,
  primary,
  onCta,
  ctaText,
}: {
  workshop: WorkshopJson;
  primary: string;
  onCta: () => void;
  ctaText: string;
}) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-16 px-4" style={{ backgroundColor: "#06080f" }}>
      <div className="max-w-3xl mx-auto">
        <h2
          className="text-2xl sm:text-3xl font-extrabold text-center text-white mb-10"
          data-reveal>
          Some Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {workshop.faq.map((item, i) => (
            <div
              key={i}
              className="rounded-2xl overflow-hidden border"
              style={{
                backgroundColor: open === i ? "#131820" : "#0a0e16",
                borderColor: open === i ? `${primary}44` : "#1e2736",
              }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left gap-4">
                <span className="text-sm font-extrabold uppercase tracking-wide text-white">
                  {item.question}
                </span>
                <span className="shrink-0 w-7 h-7 rounded-full border border-[#1e2736] flex items-center justify-center text-gray-400">
                  {open === i ? (
                    <Minus className="w-3.5 h-3.5" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm leading-relaxed text-gray-400">
                    {item.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-10"></div>
      </div>
    </section>
  );
}

function DarkStickyBar({
  visible,
  workshop,
  primary,
  ctaText,
  onCta,
}: {
  visible: boolean;
  workshop: WorkshopJson;
  primary: string;
  ctaText: string;
  onCta: () => void;
}) {
  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-50 transition-transform duration-300 ${visible ? "translate-y-0" : "translate-y-full"}`}>
      <div
        className="border-t border-white/10 shadow-2xl px-4 py-3"
        style={{ backgroundColor: "#0d1117" }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400">
              Get Instant Access
            </p>
          </div>
          <button
            onClick={onCta}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-extrabold uppercase tracking-widest text-white text-sm shadow-lg hover:opacity-90 transition-opacity shrink-0"
            style={{ backgroundColor: primary }}>
            {ctaText}
            <span className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center">
              <svg
                className="w-3 h-3 text-white"
                fill="currentColor"
                viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
