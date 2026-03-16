"use client";

import { useState } from "react";
import {
  ArrowRight,
  Play,
  CheckCircle2,
  Clock,
  Star,
  Sparkles,
  ShieldCheck,
  Zap,
  Users,
} from "lucide-react";
import home from "@/data/home.json";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

export function BookLiveClassSection() {
  const live = home.liveClass;
  const [showVideo, setShowVideo] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const videoId = "JKXwbbSvlu0";

  return (
    <Section className="relative overflow-hidden py-16 sm:py-20 md:py-28 bg-gradient-to-b from-[#fff7ee] via-[#fffbf7] to-white">
      {/* ── Background ── */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-200 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-100 to-transparent" />
        <div className="absolute -top-24 -left-32 h-96 w-96 rounded-full bg-orange-100/50 blur-[120px]" />
        <div className="absolute top-1/2 -right-32 h-80 w-80 rounded-full bg-orange-50/80 blur-[100px]" />
      </div>

      <Container>
        {/* ── Header ── */}
        <div className="flex flex-col items-center mb-12 sm:mb-16 text-center px-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-200 bg-orange-50 px-4 py-1.5 mb-5">
            <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
            <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] text-primary uppercase">
              Limited Free Live Session
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-gray-900 max-w-3xl leading-[1.1] tracking-tight font-heading">
            Become the{" "}
            <span className="text-primary">Top 1%</span>{" "}
            in Tech
          </h2>

          <p className="mt-4 text-sm sm:text-base md:text-lg text-gray-500 max-w-2xl leading-relaxed">
            Experience our high-intensity, placement-focused model. Join{" "}
            <span className="text-gray-800 font-semibold">15,000+ students</span>{" "}
            who've transformed their careers with real mentorship.
          </p>
        </div>

        {/* ── Main Grid ── */}
        <div className="grid gap-10 lg:gap-14 lg:grid-cols-[1.15fr_0.85fr] items-start">

          {/* ──── Left — Video + Stats + Points ──── */}
          <div className="flex flex-col gap-8">

            {/* Video Player */}
            <div className="relative group/video rounded-2xl overflow-hidden border border-orange-100 shadow-[0_8px_40px_rgba(255,107,44,0.08)]">
              <div className="relative aspect-video bg-gray-900">
                {!showVideo ? (
                  <>
                    <img
                      src="/images/adarshVideo.png"
                      alt="Live class preview"
                      className="w-full h-full object-cover opacity-80 transition-transform duration-700 group-hover/video:scale-[1.02]"
                    />
                    <div
                      className="absolute inset-0 flex items-center justify-center cursor-pointer group/play bg-black/20"
                      onClick={() => setShowVideo(true)}
                    >
                      <div className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-full bg-primary text-white shadow-[0_0_40px_rgba(255,107,44,0.45)] transition-all duration-300 group-hover/play:scale-110">
                        <Play className="h-6 w-6 sm:h-8 sm:w-8 fill-white ml-1" />
                      </div>
                      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-black/50 backdrop-blur-md border border-white/20 text-white/90 text-[10px] sm:text-xs font-semibold tracking-wider flex items-center gap-2">
                        <Zap className="h-3 w-3 text-primary" />
                        CLICK TO PREVIEW
                      </div>
                    </div>
                  </>
                ) : (
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                    title="Coding Sharks Preview"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 h-full w-full border-0"
                  />
                )}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {live.stats.map((s, idx) => (
                <div
                  key={idx}
                  className="relative group p-4 sm:p-6 rounded-xl border border-orange-100 bg-white shadow-sm hover:shadow-md hover:border-orange-200 transition-all duration-300"
                >
                  <div className="absolute top-3 right-3 opacity-10 group-hover:opacity-20 transition-opacity">
                    {idx === 0 ? (
                      <ShieldCheck className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                    ) : idx === 1 ? (
                      <Users className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                    ) : (
                      <Zap className="h-6 w-6 sm:h-7 sm:w-7 text-primary" />
                    )}
                  </div>
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 tracking-tight mb-1 font-heading">
                    {s.value}
                  </div>
                  <div className="text-[10px] sm:text-xs text-gray-400 uppercase tracking-wider font-semibold leading-tight">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Trust Points */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                "Direct mentorship from IIT/NIT alumni",
                "Work on 10+ industry-standard products",
                "Placements with 40 LPA+ packages",
                "Lifetime access to community & sprints",
              ].map((point, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl border border-orange-100/80 bg-orange-50/40 hover:bg-orange-50 transition-colors"
                >
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-sm text-gray-600">{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ──── Right — Form ──── */}
          <div className="lg:sticky lg:top-28">
            <div className="relative rounded-2xl border border-orange-100 bg-white p-6 sm:p-8 shadow-[0_20px_60px_rgba(255,107,44,0.1)] overflow-hidden">
              {/* Soft ambient glow */}
              <div className="absolute -top-20 -right-20 h-48 w-48 rounded-full bg-orange-100/60 blur-[60px]" />
              <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-orange-50/80 blur-[60px]" />

              {!submitted ? (
                <>
                  <div className="relative z-10 mb-6">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1.5 font-heading tracking-tight">
                      {live.form.title}
                    </h3>
                    <p className="text-sm text-gray-400 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      Fills in under 60s · Limited seats
                    </p>
                  </div>

                  <form
                    className="relative z-10 space-y-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      setSubmitted(true);
                    }}
                  >
                    {/* Program Select */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold uppercase tracking-widest text-gray-400 ml-0.5">
                        Choose Program
                      </label>
                      <div className="relative">
                        <select
                          required
                          defaultValue=""
                          className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-800 focus:border-primary focus:ring-2 focus:ring-primary/15 focus:outline-none appearance-none cursor-pointer transition-all hover:border-gray-300"
                        >
                          <option value="" disabled>
                            Select Specialization
                          </option>
                          {live.form.programs.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                        <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                          <ArrowRight className="h-4 w-4 rotate-90" />
                        </div>
                      </div>
                    </div>

                    {/* Name */}
                    <input
                      required
                      className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all outline-none hover:border-gray-300"
                      placeholder="Full Name"
                    />

                    {/* Email */}
                    <input
                      type="email"
                      required
                      className="w-full h-12 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all outline-none hover:border-gray-300"
                      placeholder="Email Address"
                    />

                    {/* Phone */}
                    <div className="flex gap-2">
                      <div className="w-20 h-12 shrink-0 rounded-xl border border-gray-200 bg-gray-50 px-3 text-sm text-gray-700 flex items-center justify-center gap-1.5 font-medium">
                        🇮🇳 +91
                      </div>
                      <input
                        type="tel"
                        required
                        className="flex-1 h-12 rounded-xl border border-gray-200 bg-gray-50 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/15 transition-all outline-none hover:border-gray-300"
                        placeholder="WhatsApp Number"
                      />
                    </div>

                    {/* Submit */}
                    <button
                      type="submit"
                      className="group w-full h-13 rounded-xl bg-primary text-sm sm:text-base font-bold text-white shadow-[0_8px_24px_rgba(255,107,44,0.3)] hover:shadow-[0_12px_32px_rgba(255,107,44,0.4)] hover:bg-primary/95 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
                    >
                      <span>{live.cta.label}</span>
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </button>

                    {/* Trust Row */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-2">
                      <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                          {live.cta.note}
                        </p>
                        <p className="text-[11px] text-primary font-semibold mt-0.5">
                          9.8/10 students recommend CS
                        </p>
                      </div>
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
                        ))}
                      </div>
                    </div>
                  </form>
                </>
              ) : (
                <div className="relative z-10 py-10 flex flex-col items-center text-center">
                  <div className="h-16 w-16 rounded-full bg-green-50 border border-green-100 flex items-center justify-center mb-5">
                    <CheckCircle2 className="h-8 w-8 text-green-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2 font-heading">
                    Booking Confirmed!
                  </h3>
                  <p className="text-gray-500 mb-6 text-sm max-w-[220px]">
                    We've sent the session details to your email and WhatsApp.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-primary text-sm font-semibold hover:underline"
                  >
                    Reschedule booking
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
