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
 [data-d1]{transition-delay:.1s}[data-d2]{transition-delay:.2s}[data-d3]{transition-delay:.3s}[data-d4]{transition-delay:.4s}
 @keyframes ctaGlow{0%,100%{box-shadow:0 4px 16px var(--cta-shadow)}50%{box-shadow:0 6px 32px var(--cta-glow),0 0 0 6px var(--cta-ring)}}
 .cta-pulse{animation:ctaGlow 2s ease-in-out infinite}
`;

const BG = "#0f0a2e";
const P = "#7c3aed";
const P_LIGHT = "#a78bfa";
const P_PINK = "#ec4899";

export function TemplateGradientVibrant({
  workshop,
}: {
  workshop: WorkshopJson;
}) {
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
  const instructorImg = media?.instructor ?? "";
  const productImg = media?.product ?? "";
  const beforeImg = media?.before ?? "";
  const afterImg = media?.after ?? "";
  const instructorBg = media?.instructor_bg ?? "";

  function GlassCard({
    children,
    className = "",
  }: {
    children: React.ReactNode;
    className?: string;
  }) {
    return (
      <div
        className={` border border-white/20 bg-white/10 backdrop-blur-md ${className}`}>
        {children}
      </div>
    );
  }

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
        className={`${full ? "w-full" : ""} group inline-flex items-center justify-center gap-3 px-8 py-4 font-extrabold uppercase tracking-widest text-white text-sm hover:scale-[1.03] active:scale-100 transition-all cta-pulse`}
        style={
          {
            background: `linear-gradient(135deg, ${P} 0%, ${P_PINK} 100%)`,
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
        <span className="w-8 h-8 bg-white/20 flex items-center justify-center shrink-0">
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
      <div className="font-sans antialiased" style={{ backgroundColor: BG }}>
        {/* HERO */}
        <section className="relative min-h-screen flex items-center overflow-hidden px-4 py-16 sm:py-20">
          {media?.hero_bg && (
            <Image
              src={media.hero_bg}
              alt=""
              fill
              className="object-cover opacity-10"
              priority
              sizes="100vw"
            />
          )}
          {/* Purple gradient blobs */}
          <div
            className="absolute top-0 left-0 w-[800px] h-[800px] pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${P}33 0%, transparent 60%)`,
              transform: "translate(-30%, -30%)",
            }}
          />
          <div
            className="absolute bottom-0 right-0 w-[600px] h-[600px] pointer-events-none"
            style={{
              background: `radial-gradient(circle, ${P_PINK}22 0%, transparent 60%)`,
              transform: "translate(20%, 20%)",
            }}
          />

          <div className="relative max-w-7xl mx-auto w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              {/* Left: content */}
              <div data-reveal-left>
                <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 border border-purple-500/30 bg-purple-500/10">
                  <span
                    className="w-2 h-2 animate-pulse"
                    style={{ backgroundColor: P_PINK }}></span>
                  <span
                    className="text-xs font-bold uppercase tracking-widest"
                    style={{ color: P_LIGHT }}>
                    {workshop.badge_text || "Live Workshop"}
                  </span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-3">
                  {workshop.title}
                </h1>
                {workshop.title_highlight && (
                  <h1
                    className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6"
                    style={{
                      background: `linear-gradient(90deg, ${P_LIGHT}, ${P_PINK})`,
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}>
                    {workshop.title_highlight}
                  </h1>
                )}

                <p
                  className="text-gray-300 text-base leading-relaxed mb-8 max-w-lg"
                  dangerouslySetInnerHTML={{
                    __html: workshop.subtitle || workshop.tagline,
                  }}
                />

                <div className="flex flex-wrap gap-3 mb-8">
                  {workshop.topics.map((t, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 text-xs font-bold border border-purple-500/30 bg-purple-500/10"
                      style={{ color: P_LIGHT }}>
                      {t}
                    </span>
                  ))}
                </div>

                <CtaBtn
                  text={ctaText}
                  sub={workshop.cta_button_subtext ?? undefined}
                  full
                />

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 mt-8 pt-6 border-t border-white/10">
                  {workshop.about_stats.slice(0, 4).map((s, i) => (
                    <div key={i} className="text-center">
                      <p
                        className="text-lg font-extrabold"
                        style={{ color: P_LIGHT }}>
                        {s.value}
                      </p>
                      <p className="text-gray-500 text-[10px] uppercase tracking-wide">
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: floating image/video card */}
              <div className="relative" data-reveal-right>
                <div
                  className={`relative overflow-hidden ${workshop.youtube_url ? "aspect-video" : "aspect-3/4"}`}
                  style={{ boxShadow: `0 0 100px ${P}44` }}>
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
                      {(media?.hero_preview || media?.hero_bg) && (
                        <Image
                          src={media.hero_preview ?? media.hero_bg ?? ""}
                          alt="Workshop Preview"
                          fill
                          className="object-cover"
                          sizes="500px"
                        />
                      )}
                      <div
                        className="absolute inset-0"
                        style={{
                          background: `linear-gradient(to top, ${BG}ee 0%, transparent 50%)`,
                        }}
                      />
                    </>
                  )}
                  {/* Floating instructor card — only on image mode */}
                  {!workshop.youtube_url && (
                    <>
                      <div className="absolute bottom-6 left-4 right-4">
                        <GlassCard className="p-4 flex items-center gap-3">
                          {instructorImg ? (
                            <div className="w-12 h-12 overflow-hidden relative shrink-0">
                              <Image
                                src={instructorImg}
                                alt={workshop.instructor_name ?? ""}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            </div>
                          ) : (
                            <div
                              className="w-12 h-12 shrink-0 flex items-center justify-center text-white font-bold"
                              style={{ backgroundColor: P }}>
                              {workshop.instructor_name?.[0]}
                            </div>
                          )}
                          <div>
                            <p className="text-white font-bold text-sm">
                              {workshop.instructor_name}
                            </p>
                            <p className="text-xs" style={{ color: P_LIGHT }}>
                              {workshop.instructor_title}
                            </p>
                          </div>
                          <div className="ml-auto">
                            <div
                              className="w-8 h-8 flex items-center justify-center"
                              style={{
                                background: `linear-gradient(135deg, ${P}, ${P_PINK})`,
                              }}>
                              <svg
                                className="w-4 h-4 text-white"
                                fill="currentColor"
                                viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                              </svg>
                            </div>
                          </div>
                        </GlassCard>
                      </div>
                      <div className="absolute top-4 right-4">
                        <GlassCard className="px-3 py-2 text-center">
                          <p className="text-white font-extrabold text-sm">
                            {workshop.duration}
                          </p>
                          <p className="text-[10px]" style={{ color: P_LIGHT }}>
                            Program
                          </p>
                        </GlassCard>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PAIN POINTS */}
        <section
          className="py-16 px-4"
          style={{
            background: "linear-gradient(180deg, #1a0533 0%, #0f0a2e 100%)",
          }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12" data-reveal>
              <p className="text-gray-400 text-lg mb-2">
                {workshop.pain_section_title_plain}
              </p>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                {workshop.pain_section_title_bold}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {workshop.pain_points.map((p, i) => {
                const painImg = media?.pain[i] ?? "";
                const accent = [P, P_PINK, P_LIGHT][i % 3];
                return (
                  <div
                    key={i}
                    className=" overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 transition-all group backdrop-blur-sm"
                    style={{ borderLeftColor: accent, borderLeftWidth: "4px" }}
                    data-reveal>
                    {painImg && (
                      <div className="relative aspect-video overflow-hidden">
                        <Image
                          src={painImg}
                          alt={p.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500 opacity-70"
                          sizes="(max-width: 640px) 100vw, 33vw"
                        />
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(to bottom, transparent 40%, rgba(15,10,46,0.9))",
                          }}
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <h3
                        className="font-extrabold mb-2"
                        style={{ color: accent }}>
                        {p.title}
                      </h3>
                      <p className="text-sm text-gray-300 leading-relaxed">
                        {p.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-center mt-10" data-reveal>
              <CtaBtn text="Solve This With Our Program" />
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section
          className="py-16 px-4"
          style={{
            background: `linear-gradient(135deg, #1a0a3e 0%, #0f0a2e 50%, #1a0533 100%)`,
          }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12" data-reveal>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                {workshop.features_section_title}
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
              <div
                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                data-reveal-left>
                {workshop.features_section_items.map((item, i) => (
                  <GlassCard
                    key={i}
                    className="p-5 hover:border-purple-400/40 transition-all group">
                    <span className="text-3xl mb-3 block">{item.emoji}</span>
                    <h3 className="font-extrabold text-white text-sm mb-2 leading-snug">
                      {item.title}
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed mb-2">
                      {item.description}
                    </p>
                    <p className="text-xs font-bold" style={{ color: P_LIGHT }}>
                      {item.link_text}
                    </p>
                  </GlassCard>
                ))}
              </div>
              <div data-reveal-right>
                <div
                  className="relative overflow-hidden aspect-video border border-white/20"
                  style={{ boxShadow: `0 0 80px ${P}33` }}>
                  {productImg && (
                    <Image
                      src={productImg}
                      alt="Platform"
                      fill
                      className="object-cover opacity-70"
                      sizes="500px"
                    />
                  )}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(135deg, ${P}44, ${P_PINK}22)`,
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={openModal}
                      className="w-20 h-20 border-4 border-white/30 flex items-center justify-center hover:scale-110 transition-transform"
                      style={{
                        background: `linear-gradient(135deg, ${P}, ${P_PINK})`,
                      }}>
                      <svg
                        className="w-8 h-8 text-white ml-1"
                        fill="currentColor"
                        viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="mt-6">
                  <CtaBtn text={ctaText} full />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* BEFORE/AFTER */}
        <section className="py-16 px-4" style={{ background: "#100d28" }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-10" data-reveal>
              <p className="text-gray-400 text-lg">
                {workshop.before_after_title_plain}
              </p>
              <h2
                className="text-3xl sm:text-4xl font-extrabold mt-1"
                style={{
                  background: `linear-gradient(90deg, ${P_LIGHT}, ${P_PINK})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                {workshop.before_after_title_bold}
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div
                className=" overflow-hidden"
                data-reveal-left
                style={{
                  border: `2px solid rgba(239,68,68,0.3)`,
                  background: "rgba(239,68,68,0.05)",
                }}>
                <div className="relative aspect-3/2 overflow-hidden">
                  {beforeImg && (
                    <Image
                      src={beforeImg}
                      alt="Before"
                      fill
                      className="object-cover grayscale opacity-60"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  )}

                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-extrabold text-white tracking-[0.2em]">
                    BEFORE
                  </span>
                </div>
                <div className="divide-y divide-dashed divide-red-500/20 px-5 py-1">
                  {workshop.before_items.map((item, i) => (
                    <div key={i} className="py-3 flex items-start gap-3">
                      <span className="text-red-400 font-bold shrink-0">✗</span>
                      <span className="text-sm text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div
                className=" overflow-hidden"
                data-reveal-right
                style={{
                  border: `2px solid ${P}44`,
                  background: `rgba(124,58,237,0.08)`,
                }}>
                <div className="relative aspect-3/2 overflow-hidden">
                  {afterImg && (
                    <Image
                      src={afterImg}
                      alt="After"
                      fill
                      className="object-cover opacity-60"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  )}
                  <div
                    className="absolute inset-0"
                    style={{ background: `${P}66` }}
                  />
                  <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-4xl font-extrabold text-white tracking-[0.2em]">
                    AFTER
                  </span>
                </div>
                <div className="divide-y divide-dashed divide-purple-500/20 px-5 py-1">
                  {workshop.after_items.map((item, i) => (
                    <div key={i} className="py-3 flex items-start gap-3">
                      <span
                        className="font-bold shrink-0"
                        style={{ color: P_LIGHT }}>
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
          className="py-16 px-4"
          style={{ background: `linear-gradient(135deg, #1a0a3e, #0f0a2e)` }}>
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1" data-reveal-left>
                <p
                  className="text-sm font-bold uppercase tracking-widest mb-3"
                  style={{ color: P_LIGHT }}>
                  Your Instructor
                </p>
                <h2 className="text-4xl font-extrabold text-white mb-1">
                  {workshop.instructor_name}
                </h2>
                {workshop.instructor_title && (
                  <p className="mb-6" style={{ color: P_LIGHT }}>
                    {workshop.instructor_title}
                  </p>
                )}
                <div className="space-y-4 mb-8">
                  {workshop.instructor_bio
                    ?.split("\n")
                    .filter(Boolean)
                    .map((para, i) => (
                      <p
                        key={i}
                        className="text-gray-300 text-sm leading-relaxed">
                        {para}
                      </p>
                    ))}
                </div>
                {workshop.instructor_quote && (
                  <GlassCard className="p-5 mb-6">
                    <p className="text-white/90 text-sm italic leading-relaxed">
                      &#8220;{workshop.instructor_quote}&#8221;
                    </p>
                  </GlassCard>
                )}
              </div>
              <div
                className="order-1 lg:order-2 flex justify-center"
                data-reveal-right>
                <div
                  className="relative w-80 h-96 overflow-hidden"
                  style={{ boxShadow: `0 0 80px ${P}55` }}>
                  {instructorBg && (
                    <Image
                      src={instructorBg}
                      alt={workshop.instructor_name ?? ""}
                      fill
                      className="object-cover"
                      sizes="320px"
                    />
                  )}
                  <div
                    className="absolute inset-0"
                    style={{
                      background: `linear-gradient(to top, ${P}66, transparent)`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CURRICULUM */}
        <section className="py-16 px-4" style={{ background: "#100d28" }}>
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-10" data-reveal>
              <h2 className="text-2xl font-bold text-white">
                {workshop.curriculum_title_plain}
              </h2>
              <h2
                className="text-3xl sm:text-4xl font-extrabold mt-1"
                style={{
                  background: `linear-gradient(90deg, ${P_LIGHT}, ${P_PINK})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                {workshop.curriculum_title_highlight}
              </h2>
            </div>
            <div className="space-y-3">
              {workshop.curriculum.map((lesson, i) => (
                <GlassCard key={i} className="overflow-hidden" data-reveal>
                  <div className="px-5 py-3 border-b border-white/10 flex items-center gap-3">
                    <span
                      className="w-7 h-7 flex items-center justify-center text-white text-xs font-extrabold shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${P}, ${P_PINK})`,
                      }}>
                      {lesson.lesson_num}
                    </span>
                    <h3 className="font-extrabold text-white text-sm">
                      {lesson.title}
                    </h3>
                  </div>
                  <div className="px-5 py-3 grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                    {lesson.points.map((pt, j) => (
                      <p
                        key={j}
                        className="text-xs text-gray-300 flex items-start gap-1.5">
                        <span style={{ color: P_LIGHT }} className="shrink-0">
                          ✓
                        </span>
                        <span>{pt}</span>
                      </p>
                    ))}
                  </div>
                </GlassCard>
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
        <VibrantFaqSection
          workshop={workshop}
          onCta={openModal}
          ctaText={ctaText}
        />

        {/* STICKY BAR */}
        <VibrantStickyBar
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

function VibrantFaqSection({
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
      style={{
        background: "linear-gradient(180deg, #0f0a2e 0%, #1a0533 100%)",
      }}>
      <div className="max-w-5xl mx-auto">
        <h2
          className="text-2xl sm:text-3xl font-extrabold text-white text-center mb-10"
          data-reveal>
          Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {workshop.faq.map((item, i) => (
            <div
              key={i}
              className=" overflow-hidden border transition-all"
              style={{
                backgroundColor:
                  open === i
                    ? "rgba(124,58,237,0.15)"
                    : "rgba(255,255,255,0.05)",
                borderColor: open === i ? `${P}55` : "rgba(255,255,255,0.1)",
              }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left gap-4">
                <span className="text-sm font-extrabold text-white uppercase tracking-wide">
                  {item.question}
                </span>
                <span className="shrink-0 w-7 h-7 border border-white/20 flex items-center justify-center text-gray-400">
                  {open === i ? (
                    <Minus className="w-3.5 h-3.5" />
                  ) : (
                    <Plus className="w-3.5 h-3.5" />
                  )}
                </span>
              </button>
              {open === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-gray-300 leading-relaxed">
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

function VibrantStickyBar({
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
        style={{
          background: `linear-gradient(135deg, #1a0a3e, #0f0a2e)`,
          borderTop: `1px solid ${P}44`,
        }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div>
            <p
              className="text-xs font-bold uppercase tracking-wide"
              style={{ color: P_LIGHT }}>
              Limited Seats Left
            </p>
          </div>
          <button
            onClick={onCta}
            className="flex items-center gap-2 px-6 py-3 font-extrabold uppercase tracking-widest text-white text-sm shadow-lg shrink-0"
            style={{ background: `linear-gradient(135deg, ${P}, ${P_PINK})` }}>
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
