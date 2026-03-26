"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useRef } from "react";
import { BrochureButton } from "@/components/common/apply-now-button";
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Download,
  Briefcase,
  Clock,
  CheckSquare,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import courses from "@/data/courses.json";

type Course = (typeof courses)[number];

const COURSE_IMAGE: Record<string, string> = {
  "full-stack":              "/images/courses/full-stack.jpg",
  "ai-agents":               "/images/courses/ai-agents.jpg",
  "python-for-data-science": "/images/courses/python-for-data-science.jpg",
  "data-science":            "/images/courses/data-science.jpg",
  "data-analytics":          "/images/courses/data-analytics.jpg",
  "system-design":           "/images/courses/system-design.jpg",
  "c-cpp":                   "/images/courses/c-cpp.jpg",
  "dsa-mastery":             "/images/courses/dsa-mastery.jpg",
};

const META_ICON_MAP: Record<string, React.ElementType> = {
  briefcase: Briefcase,
  clock: Clock,
  check: CheckSquare,
};

function CourseCard({
  course,
  className = "",
}: {
  course: Course;
  className?: string;
}) {
  const img = COURSE_IMAGE[course.slug];
  return (
    <div
      className={`border border-white/8 bg-[#111] overflow-hidden flex flex-col hover:border-primary/30 transition-colors ${className}`}>

      {/* Image / gradient header */}
      <div className={`h-44 sm:h-48 relative overflow-hidden bg-linear-to-br ${course.gradient}`}>
        {img ? (
          <Image
            src={img}
            alt={course.title}
            fill
            className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, 320px"
          />
        ) : null}
        {/* gradient overlay so text stays readable */}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent" />
        {course.isNew && (
          <span className="absolute top-3 right-3 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 z-10">
            New
          </span>
        )}
      </div>

      {/* Card content */}
      <div className="flex flex-col flex-1 p-5 gap-3 border-t border-primary/20">
        <p className="text-xs font-bold tracking-[0.15em] text-primary/60 uppercase flex items-center gap-1.5">
          <span className="h-3 w-3 border border-primary/30 inline-flex items-center justify-center shrink-0">
            <span className="h-1 w-1 bg-primary/50" />
          </span>
          {course.badge}
        </p>

        <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
          {course.title}
        </h3>

        <ul className="space-y-2 flex-1">
          {course.meta.map((m, j) => {
            const IconComp = META_ICON_MAP[m.icon] ?? Briefcase;
            return (
              <li key={j} className="text-sm text-white/50 flex items-center gap-2.5">
                <IconComp className="h-3.5 w-3.5 text-white/30 shrink-0" strokeWidth={1.5} />
                {m.text}
              </li>
            );
          })}
        </ul>

        <div className="flex flex-col gap-2 mt-1">
          <Link
            href={`/courses/${course.slug}`}
            className="h-11 border border-white/10 text-xs font-bold text-white/50 hover:text-white hover:border-white/25 transition-all flex items-center justify-center tracking-[0.15em] uppercase">
            Go To Program
          </Link>
          <BrochureButton
            source={`brochure-home-${course.slug}`}
            className="h-11 bg-primary hover:bg-primary/85 text-xs font-bold text-white transition-all flex items-center justify-center gap-2 tracking-[0.15em] uppercase">
            <Download className="h-4 w-4" />
            Brochure
          </BrochureButton>
        </div>
      </div>
    </div>
  );
}

export function CoursesSection() {
  const [showAll, setShowAll] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const visibleMobile = showAll ? courses : courses.slice(0, 2);

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -660 : 660,
      behavior: "smooth",
    });
  };

  return (
    <section className="bg-[#0a0a0a] py-16 sm:py-20 md:py-24 overflow-hidden border-t border-white/5">
      <Container>
        <div className="flex flex-col items-center text-center mb-10 sm:mb-12">
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-primary uppercase mb-3">
            OUR COURSES
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-white font-heading tracking-tight">
            Programs To Help You Upskill
          </h2>
          <p className="mt-4 text-sm sm:text-base md:text-lg text-white/40 max-w-xl">
            Structured programs built around real projects, 1-on-1 mentorship,
            and guaranteed placement support.
          </p>
          <span className="mt-6 inline-block text-[10px] font-bold tracking-[0.2em] text-primary uppercase border border-primary/30 px-4 py-1.5">
            On-Campus · Indore
          </span>
        </div>

        {/* ── MOBILE grid ── */}
        <div className="md:hidden">
          <div className="grid grid-cols-1 gap-3">
            {visibleMobile.map((course, i) => (
              <CourseCard key={i} course={course} className="w-full" />
            ))}
          </div>
          {courses.length > 2 && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowAll((p) => !p)}
                className="flex items-center gap-2 border border-white/20 px-6 py-3 text-sm font-semibold text-white/60 hover:border-primary hover:text-primary transition-all">
                {showAll ? (
                  <><ChevronUp className="size-4" /> View Less</>
                ) : (
                  <><ChevronDown className="size-4" /> View More ({courses.length - 2} more)</>
                )}
              </button>
            </div>
          )}
        </div>
      </Container>

      {/* ── DESKTOP carousel ── */}
      <div className="relative mt-2 hidden md:block">
        <button
          onClick={() => scroll("left")}
          aria-label="Previous"
          className="absolute left-0 top-0 bottom-0 z-20 w-20 sm:w-28 flex items-center justify-start pl-3 sm:pl-5 bg-linear-to-r from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent group cursor-pointer">
          <span className="h-10 w-10 border border-white/15 bg-[#1c1c1c]/90 flex items-center justify-center text-white/50 group-hover:text-white group-hover:border-white/35 group-hover:bg-[#252525] transition-all">
            <ChevronLeft className="h-5 w-5" />
          </span>
        </button>
        <button
          onClick={() => scroll("right")}
          aria-label="Next"
          className="absolute right-0 top-0 bottom-0 z-20 w-20 sm:w-28 flex items-center justify-end pr-3 sm:pr-5 bg-linear-to-l from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent group cursor-pointer">
          <span className="h-10 w-10 border border-white/15 bg-[#1c1c1c]/90 flex items-center justify-center text-white/50 group-hover:text-white group-hover:border-white/35 group-hover:bg-[#252525] transition-all">
            <ChevronRight className="h-5 w-5" />
          </span>
        </button>
        <div
          ref={scrollRef}
          className="no-scrollbar flex gap-2 overflow-x-auto px-20 sm:px-32">
          {courses.map((course, i) => (
            <CourseCard key={i} course={course} className="flex-none w-72 sm:w-80" />
          ))}
        </div>
      </div>
    </section>
  );
}
