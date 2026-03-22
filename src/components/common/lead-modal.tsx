"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import codingLogo from "@/assets/images/Coding.png";
import { fetchCrmCourses, submitLeadToCrm, type CrmCourse } from "@/lib/crm-api";

/* ── helper any component can call ── */
export function openLeadModal(source?: string) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("openLeadModal", { detail: { source } }));
  }
}

type FormState = {
  name: string;
  email: string;
  phone: string;
  courseId: string;
  background: string;
};

const BACKGROUNDS = [
  "Student / Fresher",
  "Working Professional (Non-Tech)",
  "Working Developer",
  "Freelancer",
  "Career Switcher",
  "Other",
];

export function LeadModal() {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [courses, setCourses] = useState<CrmCourse[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [form, setForm] = useState<FormState>({
    name: "", email: "", phone: "", courseId: "", background: "",
  });
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = () => {
      setOpen(true);
      setSubmitted(false);
      setError(null);
    };
    window.addEventListener("openLeadModal", handler);
    return () => window.removeEventListener("openLeadModal", handler);
  }, []);

  /* fetch courses when modal opens */
  useEffect(() => {
    if (!open) return;
    setCoursesLoading(true);
    fetchCrmCourses("all").then((data) => {
      setCourses(data);
      setCoursesLoading(false);
    });
  }, [open]);

  /* lock body scroll */
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const close = () => setOpen(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const cleanPhone = form.phone.replace(/\D/g, "").replace(/^91/, "").slice(-10);

    const result = await submitLeadToCrm({
      name: form.name,
      email: form.email,
      mobile: cleanPhone,
      courseInterest: form.courseId || undefined,
      notes: form.background ? `Background: ${form.background}` : undefined,
    });

    setLoading(false);
    if (result.success) {
      setSubmitted(true);
      setForm({ name: "", email: "", phone: "", courseId: "", background: "" });
    } else {
      setError("Something went wrong. Please try again.");
    }
  };

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      onClick={(e) => { if (e.target === overlayRef.current) close(); }}
      className="fixed inset-0 z-[999] flex items-center justify-center p-4 sm:p-6"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
    >
      <div
        className="relative w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col sm:flex-row shadow-2xl"
        style={{ animation: "modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1)" }}
      >
        {/* ── Close button ── */}
        <button
          onClick={close}
          className="absolute top-3 right-3 z-20 size-9 flex items-center justify-center rounded-full transition-all text-gray-400 hover:text-gray-700 hover:bg-gray-100"
          aria-label="Close"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
          </svg>
        </button>

        {/* ══════════════════════════════════════
            LEFT — Branding panel
        ══════════════════════════════════════ */}
        <div
          className="relative hidden sm:flex flex-col justify-between w-[42%] shrink-0 p-8 overflow-hidden"
          style={{ background: "#0a0a0a" }}
        >
          {/* orange glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(255,107,44,0.18) 0%, transparent 70%)" }} />

          {/* Brand */}
          <div className="relative z-10">
            <div className="mb-8">
              <Image src={codingLogo} alt="CodingSharks" width={140} height={46} className="h-10 w-auto" />
            </div>

            <h2 className="text-3xl font-bold text-white font-heading leading-tight tracking-tight mb-3">
              Your Next Chapter<br />
              <span className="text-primary italic">Starts Here</span>
            </h2>
            <p className="text-white/45 text-sm leading-relaxed mb-8">
              Fill in the form and a Shark will reach out within 24 hours to help you pick the right program.
            </p>

            {/* Benefits */}
            <ul className="flex flex-col gap-3">
              {[
                "1-on-1 mentorship from senior engineers",
                "Real projects — not just video lectures",
                "Placement support with 1200+ hiring partners",
                "Pay after placement with ISA option",
                "Decision in 48 hours. No pressure.",
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <svg className="mt-0.5 shrink-0" width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <circle cx="9" cy="9" r="9" fill="#ff6b2c" fillOpacity="0.2"/>
                    <path d="M5 9l3 3 5-5" stroke="#ff6b2c" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span className="text-white/65 text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Testimonial */}
          <div className="relative z-10 bg-white/5 border border-white/8 p-4 mt-8">
            <p className="text-white/60 text-xs leading-relaxed italic">
              &ldquo;₹4L to ₹32L in 6 months. No CS degree. Just the right system.&rdquo;
            </p>
            <div className="flex items-center gap-2 mt-3">
              <div className="size-7 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">R</div>
              <div>
                <p className="text-white/70 text-xs font-semibold">Rahul Gupta</p>
                <p className="text-white/35 text-[10px]">SWE @ Google · Cohort 9</p>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════
            RIGHT — Form panel
        ══════════════════════════════════════ */}
        <div className="flex-1 bg-white overflow-y-auto">
          {submitted ? (
            /* Success state */
            <div className="h-full min-h-[500px] flex flex-col items-center justify-center px-8 py-12 text-center">
              <div className="size-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center mb-6">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path d="M6 14l6 6 10-10" stroke="#16a34a" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 font-heading mb-2">You&apos;re in! 🎉</h3>
              <p className="text-gray-500 text-sm max-w-xs leading-relaxed">
                A CodingSharks advisor will reach out within 24 hours. Check your WhatsApp and email.
              </p>
              <button
                onClick={close}
                className="mt-8 bg-primary text-white font-bold text-sm uppercase tracking-widest px-8 py-3 hover:bg-primary/85 transition-colors"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="px-6 sm:px-10 py-10">
              {/* Mobile brand header */}
              <div className="mb-5 sm:hidden">
                <Image src={codingLogo} alt="CodingSharks" width={120} height={40} className="h-8 w-auto" />
              </div>

              <div className="mb-7">
                <p className="text-[10px] font-bold tracking-[0.22em] text-primary uppercase mb-2">FREE APPLICATION</p>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 font-heading leading-tight">
                  Apply in 15 Minutes
                </h3>
                <p className="text-gray-400 text-sm mt-1.5">
                  No resume needed. Just curiosity and commitment.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {/* Name */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Full Name *</label>
                  <input
                    required
                    type="text"
                    placeholder="Rahul Gupta"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="h-11 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-primary transition-colors"
                  />
                </div>

                {/* Email + Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Email *</label>
                    <input
                      required
                      type="email"
                      placeholder="rahul@gmail.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      className="h-11 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Phone *</label>
                    <input
                      required
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      className="h-11 border border-gray-200 px-4 text-sm text-gray-900 placeholder-gray-300 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>

                {/* Program */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Which Program?</label>
                  <select
                    value={form.courseId}
                    onChange={(e) => setForm({ ...form, courseId: e.target.value })}
                    className="h-11 border border-gray-200 px-4 text-sm text-gray-900 focus:outline-none focus:border-primary transition-colors bg-white appearance-none"
                  >
                    <option value="">Select a program…</option>
                    {coursesLoading ? (
                      <option disabled>Loading…</option>
                    ) : (
                      courses.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))
                    )}
                  </select>
                </div>

                {/* Background */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-600 uppercase tracking-wider">Current Background</label>
                  <div className="flex flex-wrap gap-2">
                    {BACKGROUNDS.map((bg) => (
                      <button
                        key={bg}
                        type="button"
                        onClick={() => setForm({ ...form, background: bg })}
                        className="text-xs px-3 py-1.5 border transition-all"
                        style={{
                          borderColor: form.background === bg ? "#ff6b2c" : "#e5e7eb",
                          background: form.background === bg ? "#fff5ee" : "#fff",
                          color: form.background === bg ? "#ff6b2c" : "#6b7280",
                          fontWeight: form.background === bg ? 600 : 400,
                        }}
                      >
                        {bg}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Error message */}
                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full bg-primary text-white text-xs sm:text-sm font-bold uppercase tracking-wide hover:bg-primary/85 transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                  style={{ height: "52px" }}
                >
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
                      <span className="sm:hidden">Apply Now — Free</span>
                      <span className="hidden sm:inline">Submit Application — Free</span>
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                        <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </>
                  )}
                </button>

                <p className="text-[11px] text-gray-400 text-center">
                  No spam. No credit card. Just a conversation with a Shark. 🦈
                </p>
              </form>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(12px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
