import { Star } from "lucide-react";

import home from "@/data/home.json";
import { Container } from "@/components/layout/container";

type Review = (typeof home.reviews)[number];

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < rating
              ? "fill-[#f59e0b] text-[#f59e0b]"
              : "fill-white/10 text-white/10"
          }`}
        />
      ))}
      <span className="ml-1 text-xs font-semibold text-white/40">
        {rating}.0
      </span>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <div
      className="w-105 flex-none flex flex-col gap-4 rounded-3xl border border-white/8 p-6 select-none overflow-hidden relative"
      style={{
        background: `linear-gradient(135deg, ${review.color}18 0%, #111111 45%, #0d0d0d 100%)`,
        boxShadow: `0 0 0 1px ${review.color}18`,
      }}>
      {/* subtle top-left glow */}
      <div
        className="pointer-events-none absolute -top-10 -left-10 h-32 w-32 rounded-full blur-2xl opacity-30"
        style={{ backgroundColor: review.color }}
      />

      {/* Avatar + name + role */}
      <div className="relative flex items-center gap-3">
        <div
          className="flex size-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white shadow-lg"
          style={{ backgroundColor: review.color }}>
          {review.initial}
        </div>
        <div>
          <p className="text-sm font-bold text-white leading-tight">
            {review.name}
          </p>
          <p className="text-xs text-white/40 mt-0.5">{review.role}</p>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px" style={{ backgroundColor: `${review.color}25` }} />

      {/* Stars */}
      <StarRating rating={review.rating} />

      {/* Text */}
      <p className="text-sm text-white/55 leading-relaxed line-clamp-3 relative">
        {review.text}
      </p>
    </div>
  );
}

// stronger fade — 12% each side so the partial cards at edges dissolve cleanly
const MASK =
  "linear-gradient(to right, transparent 0%, black 20%, black 80%, transparent 100%)";

export function ReviewsSection() {
  const { reviews } = home;
  const row1 = reviews.slice(0, Math.ceil(reviews.length / 2));
  const row2 = reviews.slice(Math.ceil(reviews.length / 2));

  return (
    <section className="bg-[#0a0a0a] py-16 sm:py-20 md:py-24 overflow-hidden border-t border-white/5">
      {/* Header */}
      <Container>
        <div className="flex flex-col items-center text-center mb-12 sm:mb-14">
          <p className="text-[10px] sm:text-xs font-bold tracking-[0.25em] text-primary uppercase mb-3">
            Hear From Our Students
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[56px] font-bold text-white font-heading tracking-tight">
            We Help Learners Become <br className="hidden sm:block" />
            Industry-Ready Developers.
          </h2>
        </div>
      </Container>

      {/* Row 1 — right to left */}
      <div
        className="marquee-pause relative overflow-hidden"
        style={{ maskImage: MASK, WebkitMaskImage: MASK }}>
        <div className="flex animate-marquee-left w-max gap-4 px-4">
          {[...row1, ...row1].map((review, i) => (
            <ReviewCard key={i} review={review} />
          ))}
        </div>
      </div>

      <div className="h-4" />

      {/* Row 2 — left to right */}
      <div
        className="marquee-pause relative overflow-hidden"
        style={{ maskImage: MASK, WebkitMaskImage: MASK }}>
        <div className="flex animate-marquee-right w-max gap-4 px-4">
          {[...row2, ...row2].map((review, i) => (
            <ReviewCard key={i} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
