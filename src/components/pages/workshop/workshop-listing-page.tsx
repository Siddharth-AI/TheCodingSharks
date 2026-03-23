'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, MapPin, ArrowRight, Users } from 'lucide-react';
import axios from 'axios';
import { Container } from '@/components/layout/container';
import type { Workshop, PaginationMeta } from '@/types';

const GRADIENTS = [
  'from-violet-500 to-purple-800',
  'from-rose-500 to-pink-700',
  'from-orange-500 to-red-700',
  'from-cyan-500 to-blue-800',
  'from-emerald-500 to-teal-700',
  'from-fuchsia-500 to-pink-700',
  'from-indigo-500 to-blue-800',
  'from-amber-500 to-orange-700',
];

function getGradient(slug: string) {
  let hash = 0;
  for (let i = 0; i < slug.length; i++) hash = slug.charCodeAt(i) + ((hash << 5) - hash);
  return GRADIENTS[Math.abs(hash) % GRADIENTS.length];
}

function WorkshopCard({ workshop }: { workshop: Workshop }) {
  const gradient = getGradient(workshop.slug);
  const isPast = workshop.event_date ? new Date(workshop.event_date) < new Date() : false;

  return (
    <Link
      href={`/workshops/${workshop.slug}`}
      className="group border border-white/8 bg-[#111] overflow-hidden flex flex-col hover:border-primary/40 transition-all duration-300"
    >
      {/* Cover */}
      <div className="relative h-48 overflow-hidden">
        {workshop.base_url ? (
          <Image
            src={workshop.base_url}
            alt={workshop.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className={`w-full h-full bg-linear-to-br ${gradient} flex items-center justify-center`}>
            <span className="text-6xl font-black text-white/15 select-none">
              {workshop.title[0]?.toUpperCase()}
            </span>
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-[#111] to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className={`text-[10px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 ${
            workshop.is_free
              ? 'bg-emerald-500/90 text-white'
              : 'bg-[#ff6b2c]/90 text-white'
          }`}>
            {workshop.is_free ? 'Free' : workshop.price}
          </span>
          {isPast && (
            <span className="text-[10px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 bg-white/20 text-white/70">
              Past Event
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-5 gap-3 border-t border-primary/20">
        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 text-[10px] font-bold tracking-[0.12em] text-white/30 uppercase">
          {workshop.event_date && (
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3 w-3 shrink-0" />
              {new Date(workshop.event_date).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric',
              })}
            </span>
          )}
          {workshop.event_time && (
            <>
              <span className="text-white/15">·</span>
              <span className="flex items-center gap-1.5">
                <Clock className="h-3 w-3 shrink-0" />
                {workshop.event_time}
              </span>
            </>
          )}
          {workshop.duration && (
            <>
              <span className="text-white/15">·</span>
              <span>{workshop.duration}</span>
            </>
          )}
        </div>

        {/* Title */}
        <h3 className="text-base font-bold text-white leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {workshop.title}
        </h3>

        {/* Tagline or short desc */}
        {(workshop.tagline || workshop.short_description) && (
          <p className="text-xs text-white/40 leading-relaxed flex-1 line-clamp-2">
            {workshop.tagline || workshop.short_description}
          </p>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between mt-1 pt-3 border-t border-white/5">
          <div className="flex items-center gap-2 text-[10px] text-white/30 uppercase font-bold tracking-wider">
            <MapPin className="h-3 w-3" />
            {workshop.mode === 'online' ? (workshop.platform || 'Online') : 'Offline'}
          </div>
          <span className="text-xs font-bold text-primary tracking-wider uppercase flex items-center gap-1.5 group-hover:gap-2.5 transition-all">
            Register <ArrowRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}

export function WorkshopListingPage() {
  const [workshops, setWorkshops] = useState<Workshop[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWorkshops() {
      setLoading(true);
      try {
        const { data } = await axios.get(`/api/public/workshops?page=${page}&limit=9`);
        setWorkshops(data.data.data);
        setMeta(data.data.meta);
      } catch { /* ignore */ } finally {
        setLoading(false);
      }
    }
    fetchWorkshops();
  }, [page]);

  return (
    <div className="bg-[#0a0a0a] min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden pt-24 pb-14 sm:pt-32 sm:pb-16">
        <Image
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1920&q=80"
          alt=""
          fill
          className="object-cover scale-105 blur-sm"
          priority
          aria-hidden
        />
        <div className="absolute inset-0 bg-[#0a0a0a]/65" />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 55% at 50% -10%, rgba(255,107,44,0.15) 0%, transparent 65%)',
          }}
        />
        <div
          className="absolute inset-x-0 bottom-0 h-32 pointer-events-none"
          style={{ background: 'linear-gradient(to bottom, transparent, #0a0a0a)' }}
        />

        <Container className="relative z-10">
          <div className="flex flex-col items-center text-center">
            <span className="inline-block text-[10px] font-bold tracking-[0.28em] text-primary uppercase border border-primary/30 px-4 py-1.5 mb-6">
              LIVE WORKSHOPS & EVENTS
            </span>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white font-heading tracking-tight leading-tight max-w-3xl">
              Learn Live from{' '}
              <span className="text-primary italic">Industry Experts</span>
            </h1>
            <p className="mt-5 text-sm sm:text-base text-white/45 max-w-xl leading-relaxed">
              Free and paid live workshops on cutting-edge tech — join thousands of engineers levelling up their skills.
            </p>
          </div>
        </Container>
      </div>

      {/* ── Grid ─────────────────────────────────────────────────────── */}
      <Container className="pt-4 pb-20 sm:pb-24">

        {loading ? (
          <WorkshopSkeleton />
        ) : workshops.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {workshops.map((w) => (
              <WorkshopCard key={w.id} workshop={w} />
            ))}
          </div>
        )}

        {meta && meta.totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-10 px-5 border border-white/10 text-xs font-bold text-white/50 hover:text-white hover:border-white/25 uppercase tracking-[0.15em] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>
            <span className="px-4 text-xs text-white/25 font-mono">
              {meta.page} / {meta.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages}
              className="h-10 px-5 border border-white/10 text-xs font-bold text-white/50 hover:text-white hover:border-white/25 uppercase tracking-[0.15em] transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        )}

        <div className="mt-20 border border-white/8 bg-white/3 p-5 sm:p-8 lg:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white font-heading">
              Want structured learning?
            </h3>
            <p className="mt-2 text-sm text-white/45">
              Explore our full-length courses with placement support.
            </p>
          </div>
          <Link
            href="/courses"
            className="shrink-0 inline-flex items-center gap-2 bg-primary px-8 py-4 text-sm font-bold text-white uppercase tracking-widest hover:bg-primary/85 transition-colors"
          >
            Explore Courses <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Container>
    </div>
  );
}

function WorkshopSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="border border-white/8 bg-[#111] overflow-hidden">
          <div className="h-48 bg-white/5 animate-pulse" />
          <div className="p-5 space-y-3">
            <div className="h-2.5 w-2/5 bg-white/8 rounded animate-pulse" />
            <div className="h-4 bg-white/8 rounded animate-pulse" />
            <div className="h-4 w-4/5 bg-white/8 rounded animate-pulse" />
            <div className="h-3 w-full bg-white/5 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="border border-white/8 bg-white/3 py-24 flex flex-col items-center text-center gap-4">
      <Users className="h-10 w-10 text-white/15" strokeWidth={1.2} />
      <p className="text-white/50 text-base font-medium">No workshops scheduled</p>
      <p className="text-white/25 text-sm">Check back soon — new events are on the way.</p>
    </div>
  );
}
