"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Calendar,
  Clock,
  Users,
  ArrowLeft,
  CheckCircle2,
  User,
  ChevronRight,
  Loader2,
} from "lucide-react";
import axios from "axios";
import { fetchCrmCourses, submitLeadToCrm } from "@/lib/crm-api";
import { Container } from "@/components/layout/container";
import type { Workshop } from "@/types";

interface WorkshopDetailPageProps {
  slug: string;
}

export function WorkshopDetailPage({ slug }: WorkshopDetailPageProps) {
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showFixedForm, setShowFixedForm] = useState(true);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchWorkshop() {
      try {
        const { data } = await axios.get(`/api/public/workshops/${slug}`);
        setWorkshop(data.data);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchWorkshop();
  }, [slug]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowFixedForm(!entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loading]);

  if (loading) return <DetailSkeleton />;
  if (notFound || !workshop) return <NotFound />;

  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      {/* ── Hero background — fixed height, sits behind hero text only ── */}
      <div className="absolute inset-x-0 top-0 h-130 sm:h-140 overflow-hidden pointer-events-none">
        {workshop.base_url && (
          <Image
            src={workshop.base_url}
            alt=""
            fill
            className="object-cover scale-105 blur-sm"
            sizes="100vw"
            priority
            aria-hidden
          />
        )}
        <div className="absolute inset-0 bg-[#0a0a0a]/65" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to bottom, rgba(10,10,10,0.1) 0%, rgba(10,10,10,0.6) 70%, rgba(10,10,10,1) 100%)",
          }}
        />
      </div>

      {/* ── Fixed form — desktop only, never moves on scroll ────────── */}
      <div
        className={`hidden lg:block fixed z-40 transition-opacity duration-200 ${showFixedForm ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        style={{
          top: "88px",
          right: "max(1rem, calc((100vw - 80rem) / 2 + 1rem))",
          width: "calc((min(100vw, 80rem) - 8rem) / 3)",
        }}>
        <RegistrationForm
          workshopSlug={slug}
          workshopTitle={workshop.title}
          crmWorkshopName={workshop.crm_workshop_name}
          isFree={workshop.is_free}
          price={workshop.price}
        />
      </div>

      {/* ── Single grid wrapping hero + body ─────────────────────────── */}
      <Container className="relative">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-start">
          {/* ── Left: hero text + body content ───────────────────────── */}
          <div className="lg:col-span-2">
            {/* Hero text */}
            <div className="pt-24 sm:pt-28 pb-10">
              <Link
                href="/workshops"
                className="inline-flex items-center gap-2 text-white/35 hover:text-white text-sm mb-8 transition-colors group">
                <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
                Back to Workshops
              </Link>

              <div className="flex items-center gap-3 mb-5">
                <span
                  className={`text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 ${
                    workshop.is_free
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-primary/20 text-primary border border-primary/30"
                  }`}>
                  {workshop.is_free ? "Free Workshop" : workshop.price}
                </span>
                <span
                  className={`text-[10px] font-bold tracking-[0.2em] uppercase px-3 py-1 border ${
                    workshop.mode === "online"
                      ? "border-cyan-500/30 text-cyan-400 bg-cyan-500/10"
                      : "border-amber-500/30 text-amber-400 bg-amber-500/10"
                  }`}>
                  {workshop.mode === "online"
                    ? workshop.platform || "Online"
                    : "Offline"}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-heading tracking-tight leading-tight mb-4">
                {workshop.title}
              </h1>

              {workshop.tagline && (
                <p className="text-base sm:text-lg text-white/55 leading-relaxed max-w-2xl mb-6">
                  {workshop.tagline}
                </p>
              )}

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-sm text-white/40">
                {workshop.event_date && (
                  <span className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    {new Date(workshop.event_date).toLocaleDateString("en-IN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                )}
                {workshop.event_time && (
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-primary" />
                    {workshop.event_time}
                  </span>
                )}
                {workshop.duration && (
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-white/25" />
                    {workshop.duration}
                  </span>
                )}
                {workshop.seats_available && (
                  <span className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-white/25" />
                    {workshop.seats_available} seats
                  </span>
                )}
              </div>
            </div>

            {/* Body content */}
            <div className="space-y-10 pb-24">
              {workshop.topics && workshop.topics.length > 0 && (
                <section>
                  <h2 className="text-xl font-bold text-white font-heading mb-5">
                    What You&apos;ll Learn
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {workshop.topics.map((topic, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 bg-white/3 border border-white/8 p-4">
                        <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm text-white/70">{topic}</span>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {workshop.description && (
                <section>
                  <h2 className="text-xl font-bold text-white font-heading mb-5">
                    About This Workshop
                  </h2>
                  <div
                    className="prose prose-invert prose-sm max-w-none text-white/65 leading-relaxed
                      prose-headings:text-white prose-headings:font-heading
                      prose-a:text-primary prose-strong:text-white/90
                      prose-li:text-white/65 prose-blockquote:border-primary/40 prose-blockquote:text-white/50"
                    dangerouslySetInnerHTML={{ __html: workshop.description }}
                  />
                </section>
              )}

              {workshop.instructor_name && (
                <section>
                  <h2 className="text-xl font-bold text-white font-heading mb-5">
                    About the Instructor
                  </h2>
                  <div className="flex items-start gap-4 border border-white/8 bg-white/3 p-5">
                    <div className="h-12 w-12 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="font-bold text-white text-base">
                        {workshop.instructor_name}
                      </p>
                      {workshop.instructor_bio && (
                        <p className="text-sm text-white/50 mt-1 leading-relaxed">
                          {workshop.instructor_bio}
                        </p>
                      )}
                    </div>
                  </div>
                </section>
              )}

              {/* Mobile: form at bottom */}
              <div className="lg:hidden">
                <RegistrationForm
                  workshopSlug={slug}
                  workshopTitle={workshop.title}
                  crmWorkshopName={workshop.crm_workshop_name}
                  isFree={workshop.is_free}
                  price={workshop.price}
                />
              </div>
            </div>
          </div>

          {/* placeholder — keeps left col from expanding full width */}
          <div className="hidden lg:block lg:col-span-1" aria-hidden />
        </div>

        {/* sentinel — form hides when this enters viewport (footer approaching) */}
        <div ref={sentinelRef} />
      </Container>
    </div>
  );
}

// ─── Registration Form ────────────────────────────────────────────────────────

function RegistrationForm({
  workshopTitle,
  crmWorkshopName,
  isFree,
  price,
}: {
  workshopSlug: string;
  workshopTitle: string;
  crmWorkshopName: string;
  isFree: boolean;
  price: string;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [crmCourseId, setCrmCourseId] = useState<string>("");

  useEffect(() => {
    if (!crmWorkshopName) return;
    fetchCrmCourses("workshop").then((courses) => {
      const match = courses.find(
        (c) => c.name.toLowerCase() === crmWorkshopName.toLowerCase()
      );
      if (match) setCrmCourseId(match.id);
    });
  }, [crmWorkshopName]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);
    const mobile = phone.replace(/\D/g, "").replace(/^91/, "").slice(-10);
    const result = await submitLeadToCrm({
      name,
      email,
      mobile,
      courseInterest: crmCourseId || undefined,
    });
    setIsSubmitting(false);
    if (result.success) {
      setSuccess(true);
    } else {
      setError(result.error ?? "Registration failed. Please try again.");
    }
  }

  if (success) {
    return (
      <div className="border border-emerald-500/25 bg-emerald-500/8 p-6 text-center">
        <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-4" />
        <h3 className="font-bold text-white text-lg mb-2">
          You&apos;re Registered!
        </h3>
        <p className="text-sm text-white/50">
          We&apos;ll send event details to your email. See you there!
        </p>
      </div>
    );
  }

  return (
    <div className="border border-white/10 bg-[#111] p-6">
      <div className="mb-5">
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/30 mb-1">
          Register for
        </p>
        <h3 className="font-bold text-white leading-snug line-clamp-2">
          {workshopTitle}
        </h3>
        <div className="mt-3 flex items-center gap-2">
          <span
            className={`text-sm font-bold ${isFree ? "text-emerald-400" : "text-primary"}`}>
            {isFree ? "FREE" : price}
          </span>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/8 border border-red-500/20 p-3 text-red-400 text-xs mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/30 mb-1.5 block">
            Full Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full bg-black/40 border border-white/10 px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-primary/40 transition-colors"
            placeholder="Your name"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/30 mb-1.5 block">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-black/40 border border-white/10 px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-primary/40 transition-colors"
            placeholder="you@email.com"
          />
        </div>

        <div>
          <label className="text-[10px] font-bold tracking-[0.15em] uppercase text-white/30 mb-1.5 block">
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            className="w-full bg-black/40 border border-white/10 px-3 py-2.5 text-white text-sm placeholder-white/20 focus:outline-none focus:border-primary/40 transition-colors"
            placeholder="+91 98765 43210"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary hover:bg-primary/85 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-sm uppercase tracking-widest py-3.5 transition-colors flex items-center justify-center gap-2 mt-2">
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Registering…
            </>
          ) : (
            <>
              Register Now <ChevronRight className="h-4 w-4" />
            </>
          )}
        </button>

        <p className="text-[10px] text-white/25 text-center mt-2">
          Free. No spam. Event details sent to your email.
        </p>
      </form>
    </div>
  );
}

// ─── Loading / Error states ───────────────────────────────────────────────────

function DetailSkeleton() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <div className="h-80 bg-white/3 animate-pulse" />
      <Container className="py-16">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="h-8 w-2/3 bg-white/8 rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-white/5 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-white/5 rounded animate-pulse" />
        </div>
      </Container>
    </div>
  );
}

function NotFound() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
      <div className="text-center">
        <p className="text-white/30 text-lg mb-4">Workshop not found</p>
        <Link
          href="/workshops"
          className="text-primary text-sm hover:underline">
          ← Back to Workshops
        </Link>
      </div>
    </div>
  );
}
