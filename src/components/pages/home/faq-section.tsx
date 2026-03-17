"use client";

import { useState } from "react";
import { Container } from "@/components/layout/container";
import home from "@/data/home.json";

export function FaqSection() {
  const { faq } = home;
  const [open, setOpen] = useState<number>(0);

  return (
    <section className="bg-linear-to-b from-[#fff7ee] via-[#fffbf7] to-white py-16 sm:py-20 md:py-28 border-t border-orange-100">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-12 lg:gap-20 items-start">

          {/* ── Left: sticky header ── */}
          <div className="lg:sticky lg:top-28">
            <span className="inline-block text-[10px] font-bold tracking-[0.28em] text-primary uppercase border border-primary/30 px-4 py-1.5 mb-6">
              {faq.eyebrow}
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 font-heading tracking-tight leading-tight">
              {faq.headline}
              <br />
              <span className="text-primary italic">{faq.subline}</span>
            </h2>
            <p className="mt-5 text-sm sm:text-base text-gray-500 leading-relaxed max-w-sm">
              Can&apos;t find your answer? We&apos;re happy to chat — reach us anytime.
            </p>
            <a
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline underline-offset-4"
            >
              Talk to our team
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </a>

            {/* Decorative element */}
            <div className="hidden lg:block mt-14">
              <div className="relative w-36 h-36">
                <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
                <div className="absolute inset-4 rounded-full bg-primary/15" />
                <div className="absolute inset-0 flex items-center justify-center text-5xl select-none">
                  🦈
                </div>
              </div>
            </div>
          </div>

          {/* ── Right: accordion ── */}
          <div className="flex flex-col gap-3">
            {faq.items.map((item, i) => {
              const isOpen = open === i;
              const num = String(i + 1).padStart(2, "0");
              return (
                <div
                  key={i}
                  className="border overflow-hidden transition-all duration-300"
                  style={{
                    borderColor: isOpen ? "rgba(255,107,44,0.35)" : "rgba(0,0,0,0.07)",
                    background: isOpen ? "#fff5ee" : "#ffffff",
                    boxShadow: isOpen
                      ? "0 4px 24px rgba(255,107,44,0.08)"
                      : "0 1px 4px rgba(0,0,0,0.04)",
                  }}
                >
                  <button
                    className="w-full flex items-center gap-4 px-6 py-5 text-left"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                  >
                    {/* Number */}
                    <span
                      className="shrink-0 text-xs font-bold tabular-nums transition-colors"
                      style={{ color: isOpen ? "#ff6b2c" : "rgba(0,0,0,0.2)" }}
                    >
                      {num}
                    </span>
                    {/* Question */}
                    <span
                      className="flex-1 text-sm sm:text-base font-semibold leading-snug transition-colors"
                      style={{ color: isOpen ? "#1a1a1a" : "#374151" }}
                    >
                      {item.question}
                    </span>
                    {/* Chevron */}
                    <span
                      className="shrink-0 size-8 rounded-full flex items-center justify-center transition-all duration-300"
                      style={{
                        background: isOpen ? "#ff6b2c" : "rgba(0,0,0,0.05)",
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path
                          d="M3 5.5l4 4 4-4"
                          stroke={isOpen ? "#fff" : "#6b7280"}
                          strokeWidth="1.8"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </button>

                  <div
                    style={{
                      maxHeight: isOpen ? "320px" : "0px",
                      overflow: "hidden",
                      transition: "max-height 0.4s cubic-bezier(0.4,0,0.2,1)",
                    }}
                  >
                    {/* Orange left-border accent */}
                    <div className="mx-6 mb-6 pl-4 border-l-2 border-primary/40">
                      <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
                        {item.answer}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
