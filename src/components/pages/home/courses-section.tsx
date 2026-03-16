"use client";

import { useState, useRef } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Download,
  Code2,
  Brain,
  Monitor,
  Server,
  GitBranch,
  Cloud,
  Zap,
  Building2,
  Briefcase,
  Clock,
  CheckSquare,
} from "lucide-react";
import { Container } from "@/components/layout/container";

type MetaIcon = "briefcase" | "clock" | "check";

const COURSES = [
  {
    badge: "MOST POPULAR",
    title: "Full Stack Web Development",
    gradient: "from-violet-500 to-purple-800",
    Icon: Code2,
    type: "online" as const,
    isNew: false,
    meta: [
      { icon: "briefcase" as MetaIcon, text: "Min. work exp: Open to all" },
      { icon: "clock" as MetaIcon, text: "Duration: 6 months" },
      { icon: "check" as MetaIcon, text: "10+ real-world products" },
    ],
    href: "/courses/full-stack",
  },
  {
    badge: "IN HIGH DEMAND",
    title: "AI Agents & Automation",
    gradient: "from-rose-500 to-pink-700",
    Icon: Brain,
    type: "online" as const,
    isNew: true,
    meta: [
      { icon: "briefcase" as MetaIcon, text: "Min. work exp: Open to all" },
      { icon: "clock" as MetaIcon, text: "Duration: 4 months" },
      { icon: "check" as MetaIcon, text: "Build 5+ AI agents from scratch" },
    ],
    href: "/courses/ai-agents",
  },
  {
    badge: "NSDC CERTIFIED",
    title: "Frontend Engineering — React & Next.js",
    gradient: "from-fuchsia-500 to-pink-700",
    Icon: Monitor,
    type: "online" as const,
    isNew: false,
    meta: [
      { icon: "briefcase" as MetaIcon, text: "Min. work exp: Open to all" },
      { icon: "clock" as MetaIcon, text: "Duration: 4 months" },
      { icon: "check" as MetaIcon, text: "Real-world UI products" },
    ],
    href: "/courses/frontend",
  },
  {
    badge: "NSDC CERTIFIED",
    title: "Backend Engineering — Node.js & APIs",
    gradient: "from-orange-500 to-red-700",
    Icon: Server,
    type: "online" as const,
    isNew: false,
    meta: [
      { icon: "briefcase" as MetaIcon, text: "Min. work exp: Open to all" },
      { icon: "clock" as MetaIcon, text: "Duration: 4 months" },
      { icon: "check" as MetaIcon, text: "APIs + Database projects" },
    ],
    href: "/courses/backend",
  },
  {
    badge: "PLACEMENT BOOSTER",
    title: "System Design & DSA Masterclass",
    gradient: "from-indigo-500 to-blue-800",
    Icon: GitBranch,
    type: "online" as const,
    isNew: false,
    meta: [
      { icon: "briefcase" as MetaIcon, text: "Min. work exp: 1 year" },
      { icon: "clock" as MetaIcon, text: "Duration: 3 months" },
      { icon: "check" as MetaIcon, text: "50+ coding problem sets" },
    ],
    href: "/courses/system-design",
  },
  {
    badge: "CLOUD SPECIALISATION",
    title: "DevOps, Cloud & CI/CD",
    gradient: "from-cyan-500 to-blue-700",
    Icon: Cloud,
    type: "online" as const,
    isNew: true,
    meta: [
      { icon: "briefcase" as MetaIcon, text: "Min. work exp: Open to all" },
      { icon: "clock" as MetaIcon, text: "Duration: 3 months" },
      { icon: "check" as MetaIcon, text: "AWS + Docker hands-on labs" },
    ],
    href: "/courses/devops",
  },
  {
    badge: "IMMERSIVE · RESIDENTIAL",
    title: "On-Campus Full Stack Bootcamp",
    gradient: "from-slate-500 to-blue-900",
    Icon: Building2,
    type: "campus" as const,
    isNew: false,
    meta: [
      { icon: "briefcase" as MetaIcon, text: "Completed 12th grade" },
      { icon: "clock" as MetaIcon, text: "Duration: 6 months residential" },
      { icon: "check" as MetaIcon, text: "Fully in Bangalore" },
    ],
    href: "/courses/campus-bootcamp",
  },
  {
    badge: "FAST TRACK",
    title: "AI & Automation Sprint — On-Campus",
    gradient: "from-emerald-500 to-teal-700",
    Icon: Zap,
    type: "campus" as const,
    isNew: true,
    meta: [
      { icon: "briefcase" as MetaIcon, text: "Basic coding experience" },
      { icon: "clock" as MetaIcon, text: "Duration: 2 months" },
      { icon: "check" as MetaIcon, text: "Hands-on AI projects" },
    ],
    href: "/courses/campus-ai",
  },
];

const MetaIconMap: Record<MetaIcon, typeof Briefcase> = {
  briefcase: Briefcase,
  clock: Clock,
  check: CheckSquare,
};

export function CoursesSection() {
  const [activeTab, setActiveTab] = useState<"online" | "campus">("online");
  const scrollRef = useRef<HTMLDivElement>(null);

  const filtered = COURSES.filter((c) => c.type === activeTab);

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

          {/* Tabs */}
          <div className="flex items-center gap-1 mt-8 p-1 rounded-full border border-white/10 bg-white/5">
            {(["online", "campus"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`h-9 px-5 rounded-full text-sm font-medium transition-all ${
                  activeTab === tab
                    ? "bg-primary text-white"
                    : "text-white/50 hover:text-white/80"
                }`}>
                {tab === "online" ? "Online Programs" : "On-Campus Programs"}
              </button>
            ))}
          </div>
        </div>
      </Container>

      {/* ── Full-width Carousel ── */}
      <div className="relative mt-2">

        {/* Left arrow — sibling of scroll track so top-0/bottom-0 is relative to this div, not the overflow container */}
        <button
          onClick={() => scroll("left")}
          aria-label="Previous"
          className="absolute left-0 top-0 bottom-0 z-20 w-20 sm:w-28 flex items-center justify-start pl-3 sm:pl-5 bg-linear-to-r from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent group cursor-pointer">
          <span className="h-10 w-10 border border-white/15 bg-[#1c1c1c]/90 flex items-center justify-center text-white/50 group-hover:text-white group-hover:border-white/35 group-hover:bg-[#252525] transition-all">
            <ChevronLeft className="h-5 w-5" />
          </span>
        </button>

        {/* Right arrow — same pattern */}
        <button
          onClick={() => scroll("right")}
          aria-label="Next"
          className="absolute right-0 top-0 bottom-0 z-20 w-20 sm:w-28 flex items-center justify-end pr-3 sm:pr-5 bg-linear-to-l from-[#0a0a0a] via-[#0a0a0a]/60 to-transparent group cursor-pointer">
          <span className="h-10 w-10 border border-white/15 bg-[#1c1c1c]/90 flex items-center justify-center text-white/50 group-hover:text-white group-hover:border-white/35 group-hover:bg-[#252525] transition-all">
            <ChevronRight className="h-5 w-5" />
          </span>
        </button>

        {/* Scroll track */}
        <div
          ref={scrollRef}
          className="no-scrollbar flex gap-2 overflow-x-auto px-20 sm:px-32">

          {filtered.map((course, i) => (
            <div
              key={i}
              className="flex-none w-72 sm:w-80 border border-white/8 bg-[#111] overflow-hidden flex flex-col hover:border-primary/30 transition-colors">
              {/* Gradient image area — fixed shorter height */}
              <div
                className={`h-44 sm:h-48 bg-linear-to-br ${course.gradient} flex items-center justify-center`}>
                <course.Icon
                  className="h-14 w-14 text-white/90"
                  strokeWidth={1.2}
                />
              </div>

              {/* Card content */}
              <div className="flex flex-col flex-1 p-5 gap-3 border-t border-primary/20">
                {/* Badge */}
                <p className="text-xs font-bold tracking-[0.15em] text-primary/60 uppercase flex items-center gap-1.5">
                  <span className="h-3 w-3 border border-primary/30 inline-flex items-center justify-center shrink-0">
                    <span className="h-1 w-1 bg-primary/50" />
                  </span>
                  {course.badge}
                </p>

                {/* Title */}
                <h3 className="text-base sm:text-lg font-bold text-white leading-snug">
                  {course.title}
                </h3>

                {/* Meta with icons */}
                <ul className="space-y-2 flex-1">
                  {course.meta.map((m, j) => {
                    const IconComp = MetaIconMap[m.icon];
                    return (
                      <li
                        key={j}
                        className="text-sm text-white/50 flex items-center gap-2.5">
                        <IconComp
                          className="h-3.5 w-3.5 text-white/30 shrink-0"
                          strokeWidth={1.5}
                        />
                        {m.text}
                      </li>
                    );
                  })}
                </ul>

                {/* NEW badge only */}
                {course.isNew && (
                  <div className="w-fit bg-primary/15 border border-primary/25 px-2.5 py-1">
                    <span className="text-xs font-bold text-primary uppercase tracking-wider">
                      New
                    </span>
                  </div>
                )}

                {/* Action buttons — sharp */}
                <div className="flex flex-col gap-2 mt-1">
                  <a
                    href={course.href}
                    className="h-11 border border-white/10 text-xs font-bold text-white/50 hover:text-white hover:border-white/25 transition-all flex items-center justify-center tracking-[0.15em] uppercase">
                    Go To Program
                  </a>
                  <a
                    href={`${course.href}/brochure`}
                    className="h-11 bg-primary hover:bg-primary/85 text-xs font-bold text-white transition-all flex items-center justify-center gap-2 tracking-[0.15em] uppercase">
                    <Download className="h-4 w-4" />
                    Brochure
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
