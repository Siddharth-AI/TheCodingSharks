'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { Calendar, Clock, ArrowLeft, ArrowRight, Tag } from 'lucide-react';
import { Container } from '@/components/layout/container';
import type { BlogWithTags } from '@/types';

interface BlogDetailPageProps {
  slug: string;
}

export function BlogDetailPage({ slug }: BlogDetailPageProps) {
  const [blog, setBlog] = useState<BlogWithTags | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchBlog() {
      try {
        const { data } = await axios.get(`/api/public/blogs/${slug}`);
        setBlog(data.data);
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [slug]);

  if (loading) return <DetailSkeleton />;
  if (notFound || !blog) return <NotFound />;

  return (
    <div className="bg-[#0a0a0a] min-h-screen">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <div className="relative overflow-hidden pt-20 pb-16 sm:pt-28 sm:pb-24">
        {/* Cover image as blurred background */}
        {blog.base_url && (
          <Image
            src={blog.base_url}
            alt=""
            fill
            className="object-cover scale-105 blur-sm"
            sizes="100vw"
            priority
            aria-hidden
          />
        )}
        {/* Dark overlay — light enough to see image, heavy enough to read text */}
        <div className="absolute inset-0 bg-[#0a0a0a]/55" />
        {/* Dot grid texture */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(to bottom, rgba(10,10,10,0.15) 0%, rgba(10,10,10,0.75) 60%, rgba(10,10,10,1) 100%)',
          }}
        />

        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Back */}
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-white/35 hover:text-white text-sm mb-8 transition-colors group"
            >
              <ArrowLeft className="h-3.5 w-3.5 group-hover:-translate-x-0.5 transition-transform" />
              Back to Blog
            </Link>

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {blog.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="inline-block text-[10px] font-bold tracking-[0.18em] text-primary uppercase border border-primary/30 px-3 py-1"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white leading-[1.1] tracking-tight font-heading mb-5">
              {blog.title}
            </h1>

            {/* Excerpt */}
            {blog.excerpt && (
              <p className="text-white/45 text-base sm:text-lg leading-relaxed mb-8">
                {blog.excerpt}
              </p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-4 pt-6 border-t border-white/8">
              {/* Author */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 border border-primary/30 bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-primary text-[10px] font-bold tracking-wider">CS</span>
                </div>
                <span className="text-white/50 text-sm font-medium">CodingSharks Team</span>
              </div>

              <span className="text-white/15 hidden sm:block">·</span>

              <div className="flex items-center gap-3 text-[11px] font-bold tracking-[0.15em] text-white/30 uppercase">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3 w-3 shrink-0" />
                  {new Date(blog.created_at).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })}
                </span>
                {blog.read_time && (
                  <>
                    <span className="text-white/15">·</span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3 shrink-0" />
                      {blog.read_time} min read
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* ── Article Content ───────────────────────────────────────────── */}
      <Container className="pt-0 pb-24">
        <div className="max-w-4xl mx-auto">

          {/* Content body */}
          <div className="border border-white/8 bg-[#111] p-6 sm:p-8 lg:p-10">
            {blog.description ? (
              <div
                className="blog-content"
                dangerouslySetInnerHTML={{ __html: blog.description }}
              />
            ) : (
              <p className="text-white/30 text-base">No content available.</p>
            )}
          </div>

          {/* Tags footer */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <Tag className="h-3.5 w-3.5 text-white/20 shrink-0" />
              {blog.tags.map((tag) => (
                <span
                  key={tag.id}
                  className="text-[10px] font-bold tracking-[0.18em] text-white/35 uppercase border border-white/10 px-3 py-1 hover:border-primary/30 hover:text-primary transition-colors"
                >
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {/* ── Bottom CTA ──────────────────────────────────────────────── */}
          <div className="mt-16 border border-white/8 bg-white/3 p-5 sm:p-8 lg:p-12 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-[10px] font-bold tracking-[0.22em] text-primary uppercase block mb-2">
                Ready to level up?
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-white font-heading">
                Start Your Journey with CodingSharks
              </h3>
              <p className="mt-2 text-sm text-white/45">
                Join 2000+ students who learned to code and got placed in top companies.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 bg-primary px-8 py-4 text-sm font-bold text-white uppercase tracking-widest hover:bg-primary/85 transition-colors"
              >
                Explore Courses <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 border border-white/10 px-8 py-4 text-sm font-bold text-white/50 hover:text-white hover:border-white/25 uppercase tracking-widest transition-all"
              >
                <ArrowLeft className="h-4 w-4" /> All Posts
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}

/* ── Skeleton ───────────────────────────────────────────────────────────────── */
function DetailSkeleton() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen">
      <div className="border-b border-white/8 pt-20 pb-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="h-3 w-24 bg-white/8 animate-pulse mb-8" />
          <div className="space-y-3 mb-6">
            <div className="h-9 bg-white/8 animate-pulse" />
            <div className="h-9 w-4/5 bg-white/8 animate-pulse" />
            <div className="h-9 w-3/5 bg-white/8 animate-pulse" />
          </div>
          <div className="h-4 bg-white/6 animate-pulse mb-2" />
          <div className="h-4 w-3/5 bg-white/6 animate-pulse mb-8" />
          <div className="flex items-center gap-4 pt-6 border-t border-white/8">
            <div className="w-8 h-8 bg-white/8 animate-pulse" />
            <div className="h-3 w-32 bg-white/8 animate-pulse" />
            <div className="h-3 w-24 bg-white/6 animate-pulse" />
          </div>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        <div className="aspect-[16/7] bg-white/6 animate-pulse" />
      </div>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="border border-white/8 bg-[#111] p-8 space-y-3">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className={`h-3 bg-white/6 animate-pulse ${i % 4 === 0 ? 'w-3/4' : i % 3 === 0 ? 'w-4/5' : 'w-full'}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── Not Found ──────────────────────────────────────────────────────────────── */
function NotFound() {
  return (
    <div className="bg-[#0a0a0a] min-h-screen flex items-center justify-center">
      <div className="text-center px-4 border border-white/8 bg-[#111] p-12 max-w-md mx-4">
        <span className="inline-block text-[10px] font-bold tracking-[0.28em] text-primary uppercase border border-primary/30 px-4 py-1.5 mb-6">
          404
        </span>
        <h1 className="text-3xl font-bold text-white font-heading mb-3">Post not found</h1>
        <p className="text-white/40 text-sm mb-8">This blog post doesn&apos;t exist or has been removed.</p>
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 border border-white/10 px-8 py-4 text-sm font-bold text-white/50 hover:text-white hover:border-white/25 uppercase tracking-widest transition-all"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Blog
        </Link>
      </div>
    </div>
  );
}
