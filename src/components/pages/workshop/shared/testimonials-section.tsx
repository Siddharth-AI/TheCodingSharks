'use client';

import { useState } from 'react';
import type { WorkshopJson } from '../types';

function getYouTubeId(url: string): string | null {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&?/\s]+)/);
  return m?.[1] ?? null;
}

interface Props {
  workshop: WorkshopJson;
  dark?: boolean;
}

const INITIAL_SHOW = 2;

export function TestimonialsSection({ workshop, dark = false }: Props) {
  const [showAll, setShowAll] = useState(false);

  // Only show testimonials that have a youtube_url
  const videoTestimonials = (workshop.testimonials ?? []).filter(t => !!t.youtube_url);
  if (videoTestimonials.length === 0) return null;

  const primary = workshop.page_primary_color || '#ea580c';
  const bg = dark ? '#0f1319' : '#f9fafb';
  const headingColor = dark ? '#ffffff' : '#111827';
  const subColor = dark ? 'rgba(255,255,255,0.5)' : '#6b7280';
  const cardBg = dark ? 'rgba(255,255,255,0.06)' : '#ffffff';
  const cardBorder = dark ? 'rgba(255,255,255,0.1)' : '#e5e7eb';

  const visible = showAll ? videoTestimonials : videoTestimonials.slice(0, INITIAL_SHOW);
  const hasMore = videoTestimonials.length > INITIAL_SHOW;

  return (
    <section className="py-16 px-4 sm:px-8" style={{ backgroundColor: bg }}>
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.25em] mb-2" style={{ color: primary }}>
            Student Success Stories
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold" style={{ color: headingColor }}>
            Hear From Our Students
          </h2>
        </div>

        {/* Grid — no horizontal scroll */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {visible.map((t, i) => {
            const videoId = getYouTubeId(t.youtube_url!);
            if (!videoId) return null;
            return (
              <div key={i} className="rounded-2xl overflow-hidden border" style={{ backgroundColor: cardBg, borderColor: cardBorder }}>
                <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
                  <iframe
                    src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
                    title={t.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                  />
                </div>
                <div className="p-4">
                  <p className="font-bold text-sm" style={{ color: headingColor }}>{t.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: subColor }}>{t.role}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* View More / View Less */}
        {hasMore && (
          <div className="flex justify-center mt-8">
            <button
              onClick={() => setShowAll(v => !v)}
              className="px-8 py-3 rounded-xl font-bold text-sm border-2 transition-colors hover:opacity-80"
              style={{ borderColor: primary, color: primary, backgroundColor: 'transparent' }}
            >
              {showAll ? 'View Less ↑' : `View More (${videoTestimonials.length - INITIAL_SHOW} more) ↓`}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
