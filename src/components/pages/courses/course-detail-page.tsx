"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Code2,
  Brain,
  Monitor,
  Server,
  GitBranch,
  Cloud,
  Building2,
  Zap,
  Briefcase,
  Clock,
  CheckSquare,
  ChevronDown,
  ChevronUp,
  ArrowLeft,
  Users,
  BarChart3,
  Layers,
  FlaskConical,
  Terminal,
  Cpu,
} from "lucide-react";
import Image from "next/image";
import { Container } from "@/components/layout/container";
import courses from "@/data/courses.json";
import { ApplyNowButton } from "@/components/common/apply-now-button";
import { openLeadModal } from "@/components/common/lead-modal";
import { fetchCrmCourses, submitLeadToCrm } from "@/lib/crm-api";

type Course = (typeof courses)[number];

const ICON_MAP: Record<string, React.ElementType> = {
  "full-stack": Code2,
  "ai-agents": Brain,
  frontend: Monitor,
  backend: Server,
  "system-design": GitBranch,
  "dsa-mastery": GitBranch,
  devops: Cloud,
  "campus-bootcamp": Building2,
  "campus-ai": Zap,
  "data-analytics": BarChart3,
  "data-science": FlaskConical,
  "python-for-data-science": Terminal,
  "c-cpp": Cpu,
};

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

const SLUG_TO_PDF: Record<string, string> = {
  "data-analytics": "/pdfs/Data-Analytics.pdf",
  "data-science": "/pdfs/Data-Science.pdf",
  "python-for-data-science": "/pdfs/Python.pdf",
  "full-stack": "/pdfs/Fullsstack.pdf",
  "c-cpp": "/pdfs/C-Cpp.pdf",
};

const META_ICON_MAP: Record<string, React.ElementType> = {
  briefcase: Briefcase,
  clock: Clock,
  check: CheckSquare,
};

function CurriculumAccordion({ modules }: { modules: Course["curriculum"] }) {
  const [open, setOpen] = useState<number>(0);
  const VISIBLE = 2;
  const visible = modules.slice(0, VISIBLE);
  const locked = modules.slice(VISIBLE);

  return (
    <div className="flex flex-col gap-2">
      {/* First 2 modules — fully visible */}
      {visible.map((mod, i) => {
        const isOpen = open === i;
        return (
          <div
            key={i}
            className="border overflow-hidden transition-colors"
            style={{
              borderColor: isOpen
                ? "rgba(255,107,44,0.35)"
                : "rgba(255,255,255,0.08)",
            }}>
            <button
              onClick={() => setOpen(isOpen ? -1 : i)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left">
              <span className="font-semibold text-sm sm:text-base text-white">
                {mod.module}
              </span>
              {isOpen ? (
                <ChevronUp className="shrink-0 h-4 w-4 text-primary" />
              ) : (
                <ChevronDown className="shrink-0 h-4 w-4 text-white/30" />
              )}
            </button>
            <div
              style={{
                maxHeight: isOpen ? "400px" : "0px",
                overflow: "hidden",
                transition: "max-height 0.4s ease",
              }}>
              <ul className="px-5 pb-5 flex flex-col gap-2">
                {mod.topics.map((topic, j) => (
                  <li
                    key={j}
                    className="flex items-center gap-2.5 text-sm text-white/55">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary/60 shrink-0" />
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      })}

      {/* Locked modules — blurred preview */}
      {locked.length > 0 && (
        <div className="relative">
          {/* Blurred preview of remaining modules */}
          <div
            className="flex flex-col gap-2 pointer-events-none select-none"
            style={{ filter: "blur(3px)", opacity: 0.4 }}>
            {locked.map((mod, i) => (
              <div
                key={i}
                className="border border-white/8 px-5 py-4 flex items-center justify-between">
                <span className="font-semibold text-sm text-white">
                  {mod.module}
                </span>
                <ChevronDown className="shrink-0 h-4 w-4 text-white/30" />
              </div>
            ))}
          </div>

          {/* Gradient fade + unlock CTA */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center"
            style={{
              background:
                "linear-gradient(to bottom, transparent 0%, rgba(10,10,10,0.85) 40%, rgba(10,10,10,0.98) 100%)",
            }}>
            <div className="mt-auto pb-4 flex flex-col items-center text-center px-4">
              <div className="size-11 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center mb-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3"
                    y="11"
                    width="18"
                    height="11"
                    rx="2"
                    stroke="#ff6b2c"
                    strokeWidth="1.8"
                  />
                  <path
                    d="M7 11V7a5 5 0 0 1 10 0v4"
                    stroke="#ff6b2c"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p className="text-white font-bold text-sm mb-1">
                more modules inside
              </p>
              <p className="text-white/40 text-xs mb-4">
                Download the full curriculum to see all topics
              </p>
              <button
                onClick={() => openLeadModal("curriculum-unlock")}
                className="inline-flex items-center gap-2 bg-primary hover:bg-primary/85 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 transition-colors">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
                  <path
                    d="M6.5 1v8M3 6.5l3.5 3.5L10 6.5M1 12h11"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Download Full Curriculum
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HeroForm({ course }: { course: Course }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [crmCourseId, setCrmCourseId] = useState<string>("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", background: "" });

  // Match this course to its CRM UUID using explicit crmCourseName field
  useEffect(() => {
    const lookupName = (course as Course & { crmCourseName?: string }).crmCourseName ?? course.title;
    fetchCrmCourses("all").then((crmCourses) => {
      const match = crmCourses.find(
        (c) => c.name.toLowerCase() === lookupName.toLowerCase()
      );
      if (match) setCrmCourseId(match.id);
    });
  }, [course]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const result = await submitLeadToCrm({
      name: form.name,
      email: form.email,
      mobile: form.phone.replace(/\D/g, "").slice(-10),
      courseInterest: crmCourseId || undefined,
      notes: form.background ? `Background: ${form.background}` : undefined,
    });

    setLoading(false);
    if (result.success) {
      setForm({ name: "", email: "", phone: "", background: "" });
      const pdf = SLUG_TO_PDF[course.slug];
      const params = new URLSearchParams({ from: `/courses/${course.slug}` });
      if (pdf) {
        params.set("pdf", pdf);
        params.set("course", course.title);
      }
      router.push(`/thank-you?${params.toString()}`);
    } else {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div
      className="bg-white shadow-2xl overflow-hidden"
      style={{ boxShadow: "0 24px 64px rgba(0,0,0,0.45)" }}>
      {/* Gradient top accent */}
      <div className={`h-1.5 bg-linear-to-r ${course.gradient}`} />

      <div className="p-6">
        <>
            {/* Header */}
            <div className="mb-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="h-5 w-1 bg-primary" />
                <p className="text-[10px] font-bold tracking-[0.22em] text-primary uppercase">
                  Free Counselling
                </p>
              </div>
              <h3 className="text-gray-900 font-bold text-xl font-heading leading-tight">
                Talk to an Advisor
              </h3>
              <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                Get clarity on fees, schedule & placement in 10 mins.
              </p>
            </div>

            {/* Trust row */}
            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
              <div className="flex -space-x-2">
                {["#ff6b2c", "#1e40af", "#16a34a"].map((c, i) => (
                  <div
                    key={i}
                    className="size-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: c }}>
                    {["R", "A", "S"][i]}
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500">
                <span className="font-semibold text-gray-700">
                  980+ students
                </span>{" "}
                enrolled this program
              </p>
            </div>

            <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
              <input
                required
                type="text"
                placeholder="Your Full Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full h-11 bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
              />
              <input
                required
                type="email"
                placeholder="Email Address"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full h-11 bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
              />
              <div className="flex gap-2">
                <div className="shrink-0 w-16 h-11 bg-gray-50 border border-gray-200 flex items-center justify-center text-sm text-gray-600 font-semibold gap-1">
                  🇮🇳 +91
                </div>
                <input
                  required
                  type="tel"
                  placeholder="WhatsApp Number"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="flex-1 min-w-0 h-11 bg-gray-50 border border-gray-200 px-4 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors"
                />
              </div>
              <select
                value={form.background}
                onChange={(e) => setForm({ ...form, background: e.target.value })}
                className="w-full h-11 bg-gray-50 border border-gray-200 px-4 text-sm text-gray-600 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 transition-colors appearance-none cursor-pointer">
                <option value="" disabled>I am a…</option>
                {["Student / Fresher", "Working Professional", "Career Switcher", "Freelancer"].map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white text-sm font-bold uppercase tracking-wide transition-all shadow-[0_4px_16px_rgba(255,107,44,0.35)] hover:shadow-[0_6px_24px_rgba(255,107,44,0.45)] flex items-center justify-center gap-2 mt-1 disabled:opacity-70">
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    Submitting…
                  </>
                ) : (
                  <>
                    Get Free Callback
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </>
                )}
              </button>
              <p className="text-[11px] text-gray-400 text-center">
                No spam · Free · Response in 24 hours
              </p>
            </form>
          </>
      </div>
    </div>
  );
}

export function CourseDetailPage({ slug }: { slug: string }) {
  const course = courses.find((c) => c.slug === slug);

  if (!course) {
    return (
      <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/40 text-lg">Course not found</p>
          <Link
            href="/courses"
            className="mt-4 inline-block text-primary hover:underline">
            ← Back to programs
          </Link>
        </div>
      </div>
    );
  }

  const Icon = ICON_MAP[course.slug] ?? Code2;
  const heroImg = COURSE_IMAGE[course.slug];

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      {/* ── Hero ── */}
      <div className="relative overflow-hidden pt-20 pb-16 sm:pt-24 sm:pb-20 lg:pb-24">
        {/* Background image */}
        {heroImg ? (
          <Image
            src={heroImg}
            alt=""
            fill
            className="object-cover scale-105 blur-sm"
            priority
            aria-hidden
          />
        ) : (
          <div className={`absolute inset-0 bg-linear-to-br ${course.gradient}`} />
        )}
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-[#0a0a0a]/60" />

        {/* Dot grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        {/* Bottom fade */}
        <div
          className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
          style={{ background: "linear-gradient(to bottom, transparent, #0a0a0a)" }}
        />

        <Container>
          {/* Breadcrumb */}
          <Link
            href="/courses"
            className="relative z-10 inline-flex items-center gap-2 text-white/50 text-sm hover:text-white transition-colors mb-5">
            <ArrowLeft className="h-4 w-4" /> All Programs
          </Link>

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.6fr_380px] gap-8 lg:gap-10 items-center">
            {/* Left — info */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-[10px] font-bold tracking-[0.22em] text-white/80 uppercase border border-white/25 px-3 py-1">
                  {course.badge}
                </span>
                {course.isNew && (
                  <span className="text-[10px] font-bold tracking-widest text-white uppercase bg-primary px-3 py-1">
                    New
                  </span>
                )}
                <span className="text-[10px] font-bold tracking-widest text-white/60 uppercase border border-white/15 px-3 py-1">
                  On-Campus
                </span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white font-heading tracking-tight leading-tight max-w-3xl">
                {course.title}
              </h1>
              <p className="mt-4 text-sm sm:text-base text-white/65 max-w-2xl leading-relaxed">
                {course.tagline}
              </p>

              {/* Meta pills */}
              <div className="flex flex-wrap gap-2 sm:gap-3 mt-5 sm:mt-6">
                {course.meta.map((m, i) => {
                  const MetaIcon = META_ICON_MAP[m.icon] ?? Briefcase;
                  return (
                    <span
                      key={i}
                      className="inline-flex items-center gap-2 text-xs text-white/70 border border-white/20 px-3 py-1.5 bg-white/5">
                      <MetaIcon
                        className="h-3.5 w-3.5 text-white/40"
                        strokeWidth={1.5}
                      />
                      {m.text}
                    </span>
                  );
                })}
              </div>

              {/* Quick stats */}
              <div className="flex flex-wrap gap-2 mt-7">
                {[
                  { value: course.placementRate, label: "Placement Rate" },
                  { value: course.students, label: "Students Enrolled" },
                  { value: course.projectCount, label: "Real Projects" },
                ].map((s, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center text-center py-2.5 px-5 border border-white/10 bg-white/5">
                    <span className="text-lg sm:text-xl font-bold text-white font-heading leading-none">
                      {s.value}
                    </span>
                    <span className="text-[10px] text-white/40 mt-1 leading-tight whitespace-nowrap">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* Key highlights */}
              <div className="mt-6 flex flex-col gap-2.5">
                {course.whatYouLearn.slice(0, 3).map((item, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <svg
                      className="mt-0.5 shrink-0"
                      width="16"
                      height="16"
                      viewBox="0 0 16 16"
                      fill="none">
                      <circle
                        cx="8"
                        cy="8"
                        r="8"
                        fill="#ff6b2c"
                        fillOpacity="0.2"
                      />
                      <path
                        d="M4.5 8.5l2.5 2.5 4.5-4.5"
                        stroke="#ff6b2c"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-sm text-white/70 leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              {/* Mobile form */}
              <div className="mt-8 lg:hidden">
                <HeroForm course={course} />
              </div>
            </div>

            {/* Right — Inline form (desktop only) */}
            <div className="hidden lg:block">
              <HeroForm course={course} />
            </div>
          </div>
        </Container>
      </div>

      {/* ── Main content ── */}
      <Container className="py-14 sm:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-12 items-start">
          {/* ── LEFT column ── */}
          <div className="flex flex-col gap-14">
            {/* Overview */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-heading mb-4">
                About This Program
              </h2>
              <p className="text-white/55 leading-relaxed text-sm sm:text-base">
                {course.description}
              </p>
            </section>

            {/* What you'll learn */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-heading mb-6">
                What You&apos;ll Learn
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.whatYouLearn.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-white/3 border border-white/6 px-4 py-3">
                    <svg
                      className="mt-0.5 shrink-0"
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none">
                      <circle
                        cx="9"
                        cy="9"
                        r="9"
                        fill="#ff6b2c"
                        fillOpacity="0.15"
                      />
                      <path
                        d="M5 9.5l3 3 5-5"
                        stroke="#ff6b2c"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-sm text-white/65 leading-relaxed">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Curriculum */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-heading mb-6">
                Curriculum
              </h2>
              <CurriculumAccordion modules={course.curriculum} />
            </section>

            {/* Projects */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-heading mb-6">
                What You&apos;ll Build
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {course.projects.map((p, i) => (
                  <div
                    key={i}
                    className="border border-white/8 bg-white/3 p-5 flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      <span className="size-8 bg-primary/15 border border-primary/25 flex items-center justify-center text-primary font-bold text-sm">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <h4 className="font-bold text-white text-sm">{p.name}</h4>
                    </div>
                    <p className="text-xs text-white/45 leading-relaxed pl-11">
                      {p.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Who it's for */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-heading mb-6">
                Who Is This For
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {course.whoIsItFor.map((w, i) => (
                  <div key={i} className="border border-white/8 bg-white/3 p-5">
                    <h4 className="font-bold text-white text-sm mb-2">
                      {w.title}
                    </h4>
                    <p className="text-xs text-white/45 leading-relaxed">
                      {w.desc}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Tech stack */}
            <section>
              <h2 className="text-xl sm:text-2xl font-bold text-white font-heading mb-6">
                Tools & Technologies
              </h2>
              <div className="flex flex-wrap gap-2">
                {course.tools.map((tool) => (
                  <span
                    key={tool}
                    className="text-xs font-medium text-white/60 border border-white/12 bg-white/4 px-3 py-1.5">
                    {tool}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* ── RIGHT: Sticky CTA card ── */}
          <div className="lg:sticky lg:top-24 flex flex-col gap-4">
            <div className="border border-white/10 bg-[#111] overflow-hidden">
              {/* Gradient top */}
              <div className={`h-2 bg-linear-to-r ${course.gradient}`} />

              <div className="p-6 flex flex-col gap-5">
                {/* Quick info */}
                <div className="flex flex-col gap-2">
                  {[
                    { label: "Duration", value: course.duration },
                    { label: "Mode", value: course.mode },
                    { label: "Level", value: course.level },
                    { label: "Students", value: course.students },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="flex justify-between text-sm">
                      <span className="text-white/35">{item.label}</span>
                      <span className="text-white/75 font-medium">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTAs */}
                <div className="flex flex-col gap-2 pt-1">
                  <ApplyNowButton
                    source="course-detail-sidebar"
                    className="h-12 bg-primary hover:bg-primary/85 text-white text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2 transition-colors">
                    Apply Now — Free
                  </ApplyNowButton>
                  <ApplyNowButton
                    source="course-detail-sidebar-call"
                    className="h-12 border border-white/15 hover:border-white/30 text-white/60 hover:text-white text-sm font-medium flex items-center justify-center transition-all">
                    Book a Free Career Call
                  </ApplyNowButton>
                </div>

                <p className="text-[11px] text-white/25 text-center">
                  Free application · No credit card · 48hr decision
                </p>
              </div>
            </div>

            {/* Included */}
            <div className="border border-white/8 bg-white/3 p-5">
              <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-4">
                What&apos;s Included
              </p>
              <ul className="flex flex-col gap-2.5">
                {[
                  "Live sessions with senior engineers",
                  "1-on-1 weekly mentor reviews",
                  "Lifetime access to recordings",
                  "Private Discord community",
                  "Resume & LinkedIn reviews",
                  "Direct referrals to hiring partners",
                ].map((item, i) => (
                  <li
                    key={i}
                    className="flex items-center gap-2.5 text-xs text-white/50">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle
                        cx="7"
                        cy="7"
                        r="7"
                        fill="#ff6b2c"
                        fillOpacity="0.15"
                      />
                      <path
                        d="M4 7l2.5 2.5 4-4"
                        stroke="#ff6b2c"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </Container>

      {/* ── Bottom CTA ── */}
      <div className="border-t border-white/5 bg-[#0d0d0d] py-16">
        <Container>
          <div className="flex flex-col items-center text-center gap-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-white font-heading tracking-tight">
              Ready to start your journey?
            </h2>
            <p className="text-sm text-white/40 max-w-md">
              Apply in 15 minutes. Get a decision in 48 hours. Start building in
              days.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <ApplyNowButton
                source="course-detail-bottom"
                className="inline-flex items-center gap-2 bg-primary px-8 py-4 text-sm font-bold text-white uppercase tracking-widest hover:bg-primary/85 transition-colors">
                Apply Now — It&apos;s Free
              </ApplyNowButton>
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 border border-white/15 px-8 py-4 text-sm font-medium text-white/60 hover:text-white hover:border-white/30 transition-all">
                ← All Programs
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </div>
  );
}
