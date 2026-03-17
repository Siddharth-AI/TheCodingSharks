"use client";

import { useRef, useState } from "react";
import {
  Play,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import home from "@/data/home.json";
import { Container } from "@/components/layout/container";

type Story = (typeof home.placementStories)[number];

function StoryCard({
  story,
  className = "",
}: {
  story: Story;
  className?: string;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div
      className={`flex flex-col bg-linear-to-b from-[#180b0b] to-[#0c0505] border border-white/[0.07] ${className}`}>
      {/* Thumbnail / Video */}
      <div
        className="relative aspect-[4/3] cursor-pointer overflow-hidden group bg-[#0e0404]"
        onClick={() => setPlaying(true)}>
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${story.videoId}?autoplay=1`}
            className="absolute inset-0 h-full w-full"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        ) : (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={story.thumbnailUrl}
              alt={story.name}
              className="absolute inset-0 h-full w-full object-cover opacity-50 transition-opacity duration-300 group-hover:opacity-35"
            />
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex size-16 items-center justify-center rounded-full bg-primary shadow-[0_0_28px_rgba(255,107,44,0.55)] transition-transform duration-300 group-hover:scale-110">
                <Play className="size-6 fill-white text-white ml-1" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Card body */}
      <div className="flex flex-col gap-3 p-4 flex-1 border-t border-primary/20">
        <div>
          <p className="text-base font-bold text-white leading-tight">
            {story.name}
          </p>
          <p className="mt-0.5 text-xs text-white/40">
            {story.cohort} · {story.city}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs text-white/40">
          <span>{story.fromRole}</span>
          <ArrowRight className="size-3 shrink-0 text-primary" />
          <span className="font-semibold text-[#38bdf8]">
            {story.toRole} · {story.company}
          </span>
        </div>

        <span className="w-fit border border-primary/40 bg-primary/10 px-3 py-1 text-[11px] font-semibold tracking-wide text-primary">
          {story.ctc} · {story.ctcLocation}
        </span>

        <p className="text-xs leading-relaxed text-white/55 italic mt-auto">
          &ldquo;{story.quote}&rdquo;
        </p>
      </div>
    </div>
  );
}

export function PlacementStoriesSection() {
  const { placementStories } = home;
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showAll, setShowAll] = useState(false);

  const scroll = (dir: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: dir === "right" ? 660 : -660,
      behavior: "smooth",
    });
  };

  const visibleMobile = showAll
    ? placementStories
    : placementStories.slice(0, 2);

  return (
    <section className="relative overflow-hidden py-16 sm:py-20 md:py-24 bg-linear-to-b from-[#fff7ee] via-[#fffbf7] to-white border-t border-orange-100">
      {/* bg blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-24 -left-32 h-96 w-96 rounded-full bg-orange-100/50 blur-[120px]" />
        <div className="absolute top-1/2 -right-32 h-80 w-80 rounded-full bg-orange-50/80 blur-[100px]" />
      </div>

      {/* Header */}
      <Container>
        <div className="flex flex-col items-center text-center mb-10 sm:mb-12">
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-primary uppercase mb-3">
            Newton Alumni Network
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-gray-900 font-heading tracking-tight">
            Placement Stories
          </h2>
          <p className="mt-4 text-sm sm:text-base md:text-lg text-gray-500 max-w-xl">
            Every story is real. Every salary verified. They started exactly
            where you are.
          </p>
        </div>

        {/* ── MOBILE grid (hidden on md+) ── */}
        <div className="md:hidden">
          <div className="grid grid-cols-1 gap-3">
            {visibleMobile.map((story) => (
              <StoryCard key={story.name} story={story} className="w-full" />
            ))}
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setShowAll((p) => !p)}
              className="flex items-center gap-2 border border-primary/50 px-6 py-3 text-sm font-semibold text-primary hover:bg-primary hover:text-white transition-all">
              {showAll ? (
                <>
                  <ChevronUp className="size-4" /> View Less
                </>
              ) : (
                <>
                  <ChevronDown className="size-4" /> View More
                </>
              )}
            </button>
          </div>
        </div>
      </Container>

      {/* ── DESKTOP carousel (hidden on mobile) ── */}
      <div className="relative mt-2 hidden md:block">
        {/* Left arrow */}
        <button
          onClick={() => scroll("left")}
          aria-label="Previous"
          className="absolute left-0 top-0 bottom-0 z-20 w-20 sm:w-28 flex items-center justify-start pl-3 sm:pl-5 bg-linear-to-r from-[#fff7ee] via-[#fff7ee]/60 to-transparent group cursor-pointer">
          <span className="h-10 w-10 border border-gray-200 bg-white/90 flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:border-primary/40 transition-all">
            <ChevronLeft className="h-5 w-5" />
          </span>
        </button>

        {/* Right arrow */}
        <button
          onClick={() => scroll("right")}
          aria-label="Next"
          className="absolute right-0 top-0 bottom-0 z-20 w-20 sm:w-28 flex items-center justify-end pr-3 sm:pr-5 bg-linear-to-l from-white via-white/60 to-transparent group cursor-pointer">
          <span className="h-10 w-10 border border-gray-200 bg-white/90 flex items-center justify-center text-gray-400 group-hover:text-primary group-hover:border-primary/40 transition-all">
            <ChevronRight className="h-5 w-5" />
          </span>
        </button>

        {/* Scroll track */}
        <div
          ref={scrollRef}
          className="no-scrollbar flex gap-3 overflow-x-auto px-20 sm:px-32">
          {placementStories.map((story) => (
            <StoryCard
              key={story.name}
              story={story}
              className="flex-none w-72 sm:w-80"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
