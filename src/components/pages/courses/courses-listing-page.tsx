"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Briefcase, Clock, CheckSquare, ArrowRight,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import courses from "@/data/courses.json";
import { ApplyNowButton } from "@/components/common/apply-now-button";

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

function CourseCard({ course }: { course: Course }) {
  const img = COURSE_IMAGE[course.slug];
  return (
    <Link
      href={`/courses/${course.slug}`}
      className="group border border-white/8 bg-[#111] overflow-hidden flex flex-col hover:border-primary/40 transition-all duration-300"
    >
      {/* Image header */}
      <div className={`h-44 relative overflow-hidden bg-linear-to-br ${course.gradient}`}>
        {img && (
          <Image
            src={img}
            alt={course.title}
            fill
            className="object-cover opacity-80 transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/15 to-transparent" />
        {course.isNew && (
          <span className="absolute top-3 right-3 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 z-10">
            New
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3 border-t border-primary/20">
        <p className="text-[10px] font-bold tracking-[0.18em] text-primary/70 uppercase">
          {course.badge}
        </p>
        <h3 className="text-base font-bold text-white leading-snug group-hover:text-primary transition-colors">
          {course.title}
        </h3>
        <p className="text-xs text-white/40 leading-relaxed flex-1">{course.tagline}</p>

        {/* Meta */}
        <ul className="space-y-1.5 border-t border-white/5 pt-3">
          {course.meta.map((m, i) => {
            const MetaIcon = META_ICON_MAP[m.icon] ?? Briefcase;
            return (
              <li key={i} className="flex items-center gap-2 text-xs text-white/45">
                <MetaIcon className="h-3.5 w-3.5 text-white/25 shrink-0" strokeWidth={1.5} />
                {m.text}
              </li>
            );
          })}
        </ul>

        {/* CTA */}
        <div className="flex items-center justify-between mt-1 pt-3 border-t border-white/5">
          <span className="text-xs font-bold text-primary tracking-wider uppercase flex items-center gap-1.5 group-hover:gap-3 transition-all">
            View Program <ArrowRight className="h-3.5 w-3.5" />
          </span>
          <span className="text-xs text-white/30">{course.duration}</span>
        </div>
      </div>
    </Link>
  );
}

export function CoursesListingPage() {

  return (
    <div className="bg-[#0a0a0a] min-h-screen">

      {/* ── Hero ── */}
      <div className="relative overflow-hidden pt-24 pb-16 sm:pt-32 sm:pb-20">
        {/* Background image */}
        <Image
          src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1920&q=80"
          alt=""
          fill
          className="object-cover scale-105 blur-sm"
          priority
          aria-hidden
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#0a0a0a]/65" />
        {/* Dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Orange glow top */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 70% 55% at 50% -10%, rgba(255,107,44,0.18) 0%, transparent 65%)",
        }} />
        {/* Bottom fade into grid */}
        <div
          className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, #0a0a0a)" }}
        />

        <Container className="relative z-10">
          <div className="flex flex-col items-center text-center">
            <span className="inline-block text-[10px] font-bold tracking-[0.28em] text-primary uppercase border border-primary/30 px-4 py-1.5 mb-6">
              OUR PROGRAMS
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white font-heading tracking-tight leading-tight max-w-3xl">
              Build Skills That{" "}
              <span className="text-primary italic">Get You Hired</span>
            </h1>
            <p className="mt-5 text-sm sm:text-base text-white/45 max-w-xl leading-relaxed">
              Every program is designed around real projects, 1-on-1 mentorship, and direct placement support — not just video lectures.
            </p>

            {/* Stats */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
              {[
                { value: "15K+", label: "Careers Transformed" },
                { value: "94%", label: "Placement Rate" },
                { value: "1200+", label: "Hiring Partners" },
                { value: "₹32L", label: "Highest Package" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col items-center gap-1">
                  <span className="text-2xl sm:text-3xl font-bold text-white font-heading">{s.value}</span>
                  <span className="text-xs text-white/35 tracking-wide">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </div>

      {/* ── Grid ── */}
      <Container className="pt-4 pb-20">
        {/* Count */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase border border-primary/30 px-3 py-1">
              On-Campus Programs
            </span>
          </div>
          <p className="text-xs sm:text-sm text-white/30">{courses.length} programs available</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <CourseCard key={course.slug} course={course} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 border border-white/8 bg-white/3 p-5 sm:p-8 lg:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-heading">Not sure which program to pick?</h3>
            <p className="mt-2 text-sm text-white/45">Book a free 30-min career call with one of our advisors.</p>
          </div>
          <ApplyNowButton
            source="courses-listing"
            className="shrink-0 inline-flex items-center gap-2 bg-primary px-8 py-4 text-sm font-bold text-white uppercase tracking-widest hover:bg-primary/85 transition-colors"
          >
            Book Free Call <ArrowRight className="h-4 w-4" />
          </ApplyNowButton>
        </div>
      </Container>
    </div>
  );
}
