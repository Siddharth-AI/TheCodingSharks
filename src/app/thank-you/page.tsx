"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import codingLogo from "@/assets/images/Coding.png";

const REDIRECT_SECS = 3;

function ThankYouContent() {
  const params = useSearchParams();
  const router = useRouter();
  const from = params.get("from") || "/";
  const pdf = params.get("pdf"); // e.g. "/pdfs/Data-Analytics.pdf"
  const courseName = params.get("course") || "";

  const [count, setCount] = useState(REDIRECT_SECS);
  const downloadedRef = useRef(false);

  /* trigger PDF download once */
  useEffect(() => {
    if (!pdf || downloadedRef.current) return;
    downloadedRef.current = true;
    setTimeout(() => {
      const a = document.createElement("a");
      a.href = pdf;
      a.download = pdf.split("/").pop() ?? "brochure.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }, 600);
  }, [pdf]);

  /* countdown + redirect */
  useEffect(() => {
    if (count <= 0) {
      router.push(from);
      return;
    }
    const t = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [count, from, router]);

  const progress = ((REDIRECT_SECS - count) / REDIRECT_SECS) * 100;

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden"
      style={{ background: "#0a0a0a" }}
    >
      {/* ── Background glows ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(255,107,44,0.18) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none"
        style={{
          width: "60vw",
          height: "40vh",
          background:
            "radial-gradient(ellipse at center bottom, rgba(255,107,44,0.08) 0%, transparent 70%)",
        }}
      />

      {/* ── Dot grid ── */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.06]"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      {/* ── Animated sparks ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${4 + i * 2}px`,
              height: `${4 + i * 2}px`,
              background: `rgba(255,${80 + i * 20},44,${0.5 - i * 0.06})`,
              left: `${10 + i * 14}%`,
              top: `${15 + (i % 3) * 25}%`,
              animation: `floatSpark ${3 + i * 0.7}s ease-in-out ${i * 0.4}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* ── Card ── */}
      <div
        className="relative z-10 w-full max-w-md mx-auto px-6 flex flex-col items-center text-center"
        style={{ animation: "fadeUp 0.6s cubic-bezier(0.34,1.56,0.64,1) both" }}
      >
        {/* Logo */}
        <div className="mb-10">
          <Image
            src={codingLogo}
            alt="CodingSharks"
            width={140}
            height={46}
            className="h-9 w-auto mx-auto opacity-80"
          />
        </div>

        {/* Animated check circle */}
        <div className="relative mb-8">
          {/* Outer pulse ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: "rgba(255,107,44,0.12)",
              animation: "pulseRing 2s ease-out infinite",
              transform: "scale(1.35)",
            }}
          />
          {/* Inner circle */}
          <div
            className="relative size-24 rounded-full flex items-center justify-center"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,107,44,0.25) 0%, rgba(255,60,0,0.15) 100%)",
              border: "2px solid rgba(255,107,44,0.4)",
              boxShadow: "0 0 40px rgba(255,107,44,0.3), inset 0 1px 0 rgba(255,255,255,0.08)",
            }}
          >
            <svg
              width="44"
              height="44"
              viewBox="0 0 44 44"
              fill="none"
              style={{ animation: "drawCheck 0.5s ease 0.3s both" }}
            >
              <path
                d="M9 22l9 9 17-17"
                stroke="#ff6b2c"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="40"
                strokeDashoffset="0"
                style={{ animation: "drawCheck 0.5s ease 0.3s both" }}
              />
            </svg>
          </div>
        </div>

        {/* Heading */}
        <h1
          className="text-4xl sm:text-5xl font-bold text-white mb-3 leading-tight"
          style={{ fontFamily: "var(--font-heading)", letterSpacing: "-0.02em" }}
        >
          You&apos;re{" "}
          <span
            style={{
              background: "linear-gradient(90deg, #ff6b2c, #ff9a5c)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            all set!
          </span>
        </h1>

        <p className="text-white/50 text-base leading-relaxed mb-2">
          A CodingSharks advisor will reach out within
        </p>
        <p className="text-white font-bold text-lg mb-8">
          24 hours via call &amp; WhatsApp
        </p>

        {/* PDF notification */}
        {pdf && (
          <div
            className="w-full flex items-center gap-3 px-4 py-3 mb-8 text-left"
            style={{
              background: "rgba(255,107,44,0.08)",
              border: "1px solid rgba(255,107,44,0.2)",
            }}
          >
            <div
              className="shrink-0 size-9 rounded flex items-center justify-center"
              style={{ background: "rgba(255,107,44,0.15)" }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path
                  d="M9 2v10M5 8l4 4 4-4M2 16h14"
                  stroke="#ff6b2c"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <p className="text-white/90 text-sm font-semibold">
                {courseName ? `${courseName} brochure` : "Your brochure"} is downloading…
              </p>
              <p className="text-white/40 text-xs mt-0.5">
                Check your Downloads folder
              </p>
            </div>
          </div>
        )}

        {/* What's next */}
        <div
          className="w-full mb-8"
          style={{
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <p className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase px-5 pt-4 pb-3 border-b border-white/5">
            What happens next
          </p>
          {[
            { step: "01", text: "Advisor reviews your application" },
            { step: "02", text: "You get a call within 24 hours" },
            { step: "03", text: "Free 1-on-1 counselling session" },
            { step: "04", text: "Get your personalised roadmap" },
          ].map(({ step, text }) => (
            <div
              key={step}
              className="flex items-center gap-4 px-5 py-3 border-b border-white/5 last:border-0"
            >
              <span
                className="shrink-0 text-[10px] font-bold tabular-nums"
                style={{ color: "#ff6b2c" }}
              >
                {step}
              </span>
              <span className="text-white/55 text-sm">{text}</span>
            </div>
          ))}
        </div>

        {/* Countdown redirect */}
        <div className="flex flex-col items-center gap-3">
          {/* Progress bar */}
          <div
            className="w-48 h-0.5 rounded-full overflow-hidden"
            style={{ background: "rgba(255,255,255,0.08)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-1000 ease-linear"
              style={{
                width: `${progress}%`,
                background: "linear-gradient(90deg, #ff6b2c, #ff9a5c)",
              }}
            />
          </div>
          <p className="text-white/30 text-xs">
            Redirecting in{" "}
            <span className="text-white/60 font-semibold tabular-nums">{count}s</span>
          </p>
        </div>

        {/* Manual back link */}
        <button
          onClick={() => router.push(from)}
          className="mt-6 text-xs text-white/25 hover:text-white/50 transition-colors underline underline-offset-2"
        >
          Go back now
        </button>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulseRing {
          0%   { opacity: 0.8; transform: scale(1.35); }
          100% { opacity: 0;   transform: scale(1.7); }
        }
        @keyframes floatSpark {
          from { transform: translateY(0) rotate(0deg); opacity: 0.6; }
          to   { transform: translateY(-20px) rotate(180deg); opacity: 0.15; }
        }
        @keyframes drawCheck {
          from { stroke-dashoffset: 40; }
          to   { stroke-dashoffset: 0; }
        }
      `}</style>
    </div>
  );
}

export default function ThankYouPage() {
  return (
    <Suspense>
      <ThankYouContent />
    </Suspense>
  );
}
