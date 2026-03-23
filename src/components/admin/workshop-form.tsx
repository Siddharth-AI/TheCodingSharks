'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { ImageUpload } from './image-upload';
import axios from 'axios';
import type { Workshop } from '@/types';
import { fetchCrmCourses, type CrmCourse } from '@/lib/crm-api';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, List, ListOrdered,
  Link2, Highlighter, Quote, Undo, Redo, X,
  ArrowLeft, Globe, ImageIcon, Calendar, Clock, MapPin, User, Tag, Code2,
} from 'lucide-react';

interface WorkshopFormProps {
  workshop?: Workshop;
}

export function WorkshopForm({ workshop }: WorkshopFormProps) {
  const router = useRouter();
  const isEdit = !!workshop;

  const [title, setTitle] = useState(workshop?.title || '');
  const [slug, setSlug] = useState(workshop?.slug || '');
  const [crmWorkshopName, setCrmWorkshopName] = useState(workshop?.crm_workshop_name || '');
  const [tagline, setTagline] = useState(workshop?.tagline || '');
  const [shortDescription, setShortDescription] = useState(workshop?.short_description || '');
  const [eventDate, setEventDate] = useState(workshop?.event_date?.slice(0, 10) || '');
  const [eventTime, setEventTime] = useState(workshop?.event_time || '');
  const [duration, setDuration] = useState(workshop?.duration || '');
  const [mode, setMode] = useState<'online' | 'offline'>(workshop?.mode as 'online' | 'offline' || 'online');
  const [platform, setPlatform] = useState(workshop?.platform || '');
  const [instructorName, setInstructorName] = useState(workshop?.instructor_name || '');
  const [instructorBio, setInstructorBio] = useState(workshop?.instructor_bio || '');
  const [price, setPrice] = useState(workshop?.price || 'Free');
  const [isFree, setIsFree] = useState(workshop?.is_free ?? true);
  const [seatsAvailable, setSeatsAvailable] = useState(workshop?.seats_available?.toString() || '');
  const [isActive, setIsActive] = useState(workshop?.is_active ?? true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [topics, setTopics] = useState<string[]>(workshop?.topics || []);
  const [topicInput, setTopicInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showHtmlImport, setShowHtmlImport] = useState(false);
  const [htmlImport, setHtmlImport] = useState('');
  const [crmCourses, setCrmCourses] = useState<CrmCourse[]>([]);
  const [crmCoursesLoading, setCrmCoursesLoading] = useState(true);

  useEffect(() => {
    fetchCrmCourses('workshop').then((data) => {
      setCrmCourses(data);
      setCrmCoursesLoading(false);
    });
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight.configure({ multicolor: false }),
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: workshop?.description || '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'min-h-[400px] p-6 text-white/85 text-sm focus:outline-none prose prose-invert prose-sm max-w-none leading-relaxed',
      },
    },
  });

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!isEdit || !workshop?.slug) {
      setSlug(
        value
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-')
          .replace(/-+/g, '-')
          .trim()
      );
    }
  }

  function addTopic() {
    const trimmed = topicInput.trim();
    if (trimmed && !topics.includes(trimmed)) setTopics([...topics, trimmed]);
    setTopicInput('');
  }

  function removeTopic(topic: string) {
    setTopics(topics.filter((t) => t !== topic));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('cs_access_token');
      const formData = new FormData();
      formData.append('title', title);
      formData.append('slug', slug);
      formData.append('crm_workshop_name', crmWorkshopName);
      if (tagline) formData.append('tagline', tagline);
      if (editor) formData.append('description', editor.getHTML());
      if (shortDescription) formData.append('short_description', shortDescription);
      if (eventDate) formData.append('event_date', eventDate);
      if (eventTime) formData.append('event_time', eventTime);
      if (duration) formData.append('duration', duration);
      formData.append('mode', mode);
      if (platform) formData.append('platform', platform);
      if (instructorName) formData.append('instructor_name', instructorName);
      if (instructorBio) formData.append('instructor_bio', instructorBio);
      formData.append('topics', JSON.stringify(topics));
      formData.append('price', price);
      formData.append('is_free', isFree.toString());
      if (seatsAvailable) formData.append('seats_available', seatsAvailable);
      formData.append('is_active', isActive.toString());
      if (imageFile) formData.append('image', imageFile);

      const headers = { Authorization: `Bearer ${token}` };

      if (isEdit) {
        await axios.put(`/api/admin/workshops/${workshop!.id}`, formData, { headers });
      } else {
        await axios.post('/api/admin/workshops', formData, { headers });
      }

      router.push('/admin/workshops');
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || 'Failed to save workshop'
        : 'Failed to save workshop';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* ── Top bar ──────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-[#0d0d0d] border-b border-white/8 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Workshops
          </button>
          <span className="text-white/15">/</span>
          <span className="text-white/70 text-sm font-medium">
            {isEdit ? 'Edit Workshop' : 'New Workshop'}
          </span>
        </div>
        <div className={`flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase px-3 py-1.5 border ${
          isActive
            ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/8'
            : 'text-white/30 border-white/10 bg-white/3'
        }`}>
          <Globe className="w-3 h-3" />
          {isActive ? 'Published' : 'Draft'}
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex gap-0 min-h-[calc(100vh-57px)]">

          {/* ── Main column ──────────────────────────────────────────── */}
          <div className="flex-1 min-w-0 border-r border-white/8">

            {/* Title + Slug */}
            <div className="px-8 py-8 border-b border-white/8">
              <input
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                className="w-full bg-transparent text-3xl font-bold text-white placeholder-white/15 focus:outline-none font-heading tracking-tight"
                placeholder="Workshop title…"
              />
              <div className="flex items-center gap-2 mt-4">
                <span className="text-white/25 text-xs font-mono">codingsharks.com/workshops/</span>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  pattern="[a-z0-9-]+"
                  className="flex-1 bg-transparent text-xs font-mono text-white/50 placeholder-white/20 focus:outline-none focus:text-white/80 border-b border-transparent focus:border-white/20 pb-0.5 transition-colors"
                  placeholder="workshop-slug"
                />
              </div>
            </div>

            {/* CRM Workshop — dropdown from CRM */}
            <div className="px-8 py-6 border-b border-white/8">
              <label className="flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase text-white/30 mb-3">
                <Tag className="w-3.5 h-3.5" /> CRM Workshop
              </label>
              {crmCoursesLoading ? (
                <p className="text-white/25 text-xs">Loading CRM workshops…</p>
              ) : (
                <select
                  value={crmWorkshopName}
                  onChange={(e) => setCrmWorkshopName(e.target.value)}
                  required
                  className="w-full bg-black/30 border border-white/10 px-3 py-2.5 text-white/80 text-sm focus:outline-none focus:border-white/25 transition-colors appearance-none"
                >
                  <option value="">Select CRM workshop…</option>
                  {crmCourses.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>
              )}
              <p className="text-white/20 text-[11px] mt-1.5">Lead form me is workshop ka CRM ID jayega</p>
            </div>

            {/* Tagline */}
            <div className="px-8 py-6 border-b border-white/8">
              <label className="text-xs font-bold tracking-[0.15em] uppercase text-white/30 mb-3 block">Tagline</label>
              <input
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-transparent text-sm text-white/70 placeholder-white/20 focus:outline-none border-b border-white/8 pb-1 focus:border-white/20 transition-colors"
                placeholder="One-liner shown under title…"
              />
            </div>

            {/* Short Description */}
            <div className="px-8 py-6 border-b border-white/8">
              <label className="text-xs font-bold tracking-[0.15em] uppercase text-white/30 mb-3 block">Short Description</label>
              <textarea
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                rows={3}
                className="w-full bg-transparent text-sm text-white/70 placeholder-white/20 focus:outline-none resize-none leading-relaxed"
                placeholder="Brief summary shown on workshop listing card…"
              />
            </div>

            {/* Topics */}
            <div className="px-8 py-6 border-b border-white/8">
              <label className="flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase text-white/30 mb-3">
                <Tag className="w-3.5 h-3.5" /> Topics Covered
              </label>
              {topics.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {topics.map((topic) => (
                    <span
                      key={topic}
                      className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-white/60 text-xs px-2.5 py-1"
                    >
                      {topic}
                      <button type="button" onClick={() => removeTopic(topic)} className="text-white/25 hover:text-white transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  value={topicInput}
                  onChange={(e) => setTopicInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTopic(); } }}
                  className="flex-1 min-w-0 bg-black/30 border border-white/10 px-3 py-2 text-white text-xs focus:outline-none focus:border-white/25 transition-colors placeholder-white/20"
                  placeholder="Add topic…"
                />
                <button
                  type="button"
                  onClick={addTopic}
                  className="bg-white/8 hover:bg-white/12 border border-white/10 text-white/60 hover:text-white text-xs px-3 py-2 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Instructor */}
            <div className="px-8 py-6 border-b border-white/8">
              <label className="flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase text-white/30 mb-3">
                <User className="w-3.5 h-3.5" /> Instructor
              </label>
              <div className="space-y-3">
                <input
                  value={instructorName}
                  onChange={(e) => setInstructorName(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 px-3 py-2.5 text-white/80 text-sm placeholder-white/20 focus:outline-none focus:border-white/25 transition-colors"
                  placeholder="Instructor name…"
                />
                <textarea
                  value={instructorBio}
                  onChange={(e) => setInstructorBio(e.target.value)}
                  rows={3}
                  className="w-full bg-black/30 border border-white/10 px-3 py-2.5 text-white/80 text-sm placeholder-white/20 focus:outline-none focus:border-white/25 transition-colors resize-none"
                  placeholder="Short bio…"
                />
              </div>
            </div>

            {/* Full Description */}
            <div className="px-8 py-6">
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase text-white/30">
                  <Code2 className="w-3.5 h-3.5" /> Full Description
                </label>
                <button
                  type="button"
                  onClick={() => setShowHtmlImport((v) => !v)}
                  className="text-xs text-white/25 hover:text-[#ff6b2c] transition-colors font-mono"
                >
                  {showHtmlImport ? '✕ Close' : '⟨/⟩ Import HTML'}
                </button>
              </div>

              {showHtmlImport && (
                <div className="bg-[#111] border border-white/8 p-4 mb-3 space-y-3">
                  <p className="text-white/35 text-xs">Paste raw HTML below then click Load</p>
                  <textarea
                    value={htmlImport}
                    onChange={(e) => setHtmlImport(e.target.value)}
                    rows={8}
                    className="w-full bg-black/40 border border-white/8 px-3 py-2 text-white/60 text-xs font-mono focus:outline-none focus:border-white/20 resize-none transition-colors"
                    placeholder="<h2>Heading</h2><p>Content...</p>"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (editor && htmlImport.trim()) {
                        editor.commands.setContent(htmlImport);
                        setHtmlImport('');
                        setShowHtmlImport(false);
                      }
                    }}
                    className="bg-[#ff6b2c] hover:bg-[#e55a1f] text-white text-xs font-bold px-5 py-2 uppercase tracking-widest transition-colors"
                  >
                    Load into Editor
                  </button>
                </div>
              )}

              <div className="border border-white/8 focus-within:border-white/20 transition-colors overflow-hidden">
                <TipTapToolbar editor={editor} />
                <div className="bg-[#0d0d0d]">
                  <EditorContent editor={editor} />
                </div>
              </div>
            </div>
          </div>

          {/* ── Sidebar ──────────────────────────────────────────────── */}
          <div className="w-[300px] shrink-0 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto bg-[#0d0d0d]">

            {error && (
              <div className="mx-5 mt-5 bg-red-500/8 border border-red-500/20 p-3 text-red-400 text-xs">
                {error}
              </div>
            )}

            {/* Cover Image */}
            <div className="p-5 border-b border-white/8">
              <label className="flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase text-white/30 mb-3">
                <ImageIcon className="w-3.5 h-3.5" /> Cover Image
              </label>
              <ImageUpload currentImageUrl={workshop?.base_url} onFileSelect={setImageFile} />
            </div>

            {/* Status */}
            <div className="p-5 border-b border-white/8">
              <label className="flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase text-white/30 mb-3">
                <Globe className="w-3.5 h-3.5" /> Status
              </label>
              <div className="flex items-center justify-between">
                <span className="text-sm text-white/60">{isActive ? 'Published' : 'Draft'}</span>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isActive ? 'bg-[#ff6b2c]' : 'bg-white/10'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
            </div>

            {/* Event Date & Time */}
            <div className="p-5 border-b border-white/8">
              <label className="flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase text-white/30 mb-3">
                <Calendar className="w-3.5 h-3.5" /> Event Date & Time
              </label>
              <div className="space-y-2">
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 px-3 py-2 text-white text-sm focus:outline-none focus:border-white/25 transition-colors"
                />
                <input
                  type="text"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 px-3 py-2 text-white text-sm focus:outline-none focus:border-white/25 transition-colors placeholder-white/20"
                  placeholder="e.g. 7:00 PM IST"
                />
              </div>
            </div>

            {/* Duration */}
            <div className="p-5 border-b border-white/8">
              <label className="flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase text-white/30 mb-3">
                <Clock className="w-3.5 h-3.5" /> Duration
              </label>
              <input
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full bg-black/30 border border-white/10 px-3 py-2 text-white text-sm focus:outline-none focus:border-white/25 transition-colors placeholder-white/20"
                placeholder="e.g. 2 hours"
              />
            </div>

            {/* Mode & Platform */}
            <div className="p-5 border-b border-white/8">
              <label className="flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase text-white/30 mb-3">
                <MapPin className="w-3.5 h-3.5" /> Mode
              </label>
              <div className="flex gap-2 mb-3">
                {(['online', 'offline'] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setMode(m)}
                    className={`flex-1 py-2 text-xs font-bold uppercase tracking-widest border transition-colors ${
                      mode === m
                        ? 'bg-[#ff6b2c]/15 border-[#ff6b2c]/50 text-[#ff6b2c]'
                        : 'border-white/10 text-white/40 hover:text-white/60'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
              {mode === 'online' && (
                <input
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 px-3 py-2 text-white text-sm focus:outline-none focus:border-white/25 transition-colors placeholder-white/20"
                  placeholder="Platform (Zoom, Google Meet…)"
                />
              )}
            </div>

            {/* Price */}
            <div className="p-5 border-b border-white/8">
              <label className="text-xs font-bold tracking-[0.15em] uppercase text-white/30 mb-3 block">Price</label>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-white/60">Free Workshop</span>
                <button
                  type="button"
                  onClick={() => { setIsFree(!isFree); if (!isFree) setPrice('Free'); }}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isFree ? 'bg-[#ff6b2c]' : 'bg-white/10'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isFree ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>
              {!isFree && (
                <input
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full bg-black/30 border border-white/10 px-3 py-2 text-white text-sm focus:outline-none focus:border-white/25 transition-colors placeholder-white/20"
                  placeholder="e.g. ₹499"
                />
              )}
            </div>

            {/* Seats */}
            <div className="p-5 border-b border-white/8">
              <label className="text-xs font-bold tracking-[0.15em] uppercase text-white/30 mb-3 block">Seats Available</label>
              <input
                type="number"
                value={seatsAvailable}
                onChange={(e) => setSeatsAvailable(e.target.value)}
                min={1}
                className="w-full bg-black/30 border border-white/10 px-3 py-2 text-white text-sm focus:outline-none focus:border-white/25 transition-colors placeholder-white/20"
                placeholder="Leave blank for unlimited"
              />
            </div>

            {/* Submit */}
            <div className="p-5">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#ff6b2c] hover:bg-[#e55a1f] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold uppercase tracking-widest py-3.5 transition-colors"
              >
                {isSubmitting ? 'Saving…' : isEdit ? 'Update Workshop' : 'Publish Workshop'}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="w-full mt-2 border border-white/8 hover:border-white/15 text-white/35 hover:text-white/60 text-xs uppercase tracking-widest py-2.5 transition-colors"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

// ─── TipTap Toolbar ────────────────────────────────────────────────────────────

function TipTapToolbar({ editor }: { editor: Editor | null }) {
  const setLink = useCallback(() => {
    if (!editor) return;
    const url = window.prompt('URL');
    if (url) editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    else editor.chain().focus().unsetLink().run();
  }, [editor]);

  if (!editor) return null;

  const btn = (active: boolean) =>
    `p-1.5 transition-colors ${active
      ? 'bg-[#ff6b2c]/20 text-[#ff6b2c]'
      : 'text-white/35 hover:text-white hover:bg-white/8'}`;

  const cmd = (action: () => void) => (e: React.MouseEvent) => {
    e.preventDefault();
    action();
  };

  return (
    <div className="flex flex-wrap items-center gap-0.5 px-3 py-2 bg-[#111] border-b border-white/8">
      <button type="button" onMouseDown={cmd(() => editor.chain().focus().toggleBold().run())} className={btn(editor.isActive('bold'))} title="Bold"><Bold className="w-3.5 h-3.5" /></button>
      <button type="button" onMouseDown={cmd(() => editor.chain().focus().toggleItalic().run())} className={btn(editor.isActive('italic'))} title="Italic"><Italic className="w-3.5 h-3.5" /></button>
      <button type="button" onMouseDown={cmd(() => editor.chain().focus().toggleUnderline().run())} className={btn(editor.isActive('underline'))} title="Underline"><UnderlineIcon className="w-3.5 h-3.5" /></button>
      <button type="button" onMouseDown={cmd(() => editor.chain().focus().toggleStrike().run())} className={btn(editor.isActive('strike'))} title="Strike"><Strikethrough className="w-3.5 h-3.5" /></button>
      <button type="button" onMouseDown={cmd(() => editor.chain().focus().toggleHighlight().run())} className={btn(editor.isActive('highlight'))} title="Highlight"><Highlighter className="w-3.5 h-3.5" /></button>
      <div className="w-px h-4 bg-white/10 mx-1.5" />
      <button type="button" onMouseDown={cmd(() => editor.chain().focus().setParagraph().run())} className={`${btn(!editor.isActive('heading'))} text-[10px] font-bold px-1`} title="Normal">P</button>
      <button type="button" onMouseDown={cmd(() => editor.chain().focus().toggleHeading({ level: 1 }).run())} className={`${btn(editor.isActive('heading', { level: 1 }))} text-[10px] font-bold px-1`} title="H1">H1</button>
      <button type="button" onMouseDown={cmd(() => editor.chain().focus().toggleHeading({ level: 2 }).run())} className={`${btn(editor.isActive('heading', { level: 2 }))} text-[10px] font-bold px-1`} title="H2">H2</button>
      <button type="button" onMouseDown={cmd(() => editor.chain().focus().toggleHeading({ level: 3 }).run())} className={`${btn(editor.isActive('heading', { level: 3 }))} text-[10px] font-bold px-1`} title="H3">H3</button>
      <div className="w-px h-4 bg-white/10 mx-1.5" />
      <button type="button" onMouseDown={cmd(() => editor.chain().focus().setTextAlign('left').run())} className={btn(editor.isActive({ textAlign: 'left' }))} title="Left"><AlignLeft className="w-3.5 h-3.5" /></button>
      <button type="button" onMouseDown={cmd(() => editor.chain().focus().setTextAlign('center').run())} className={btn(editor.isActive({ textAlign: 'center' }))} title="Center"><AlignCenter className="w-3.5 h-3.5" /></button>
      <button type="button" onMouseDown={cmd(() => editor.chain().focus().setTextAlign('right').run())} className={btn(editor.isActive({ textAlign: 'right' }))} title="Right"><AlignRight className="w-3.5 h-3.5" /></button>
      <div className="w-px h-4 bg-white/10 mx-1.5" />
      <button type="button" onMouseDown={cmd(() => editor.chain().focus().toggleBulletList().run())} className={btn(editor.isActive('bulletList'))} title="Bullet"><List className="w-3.5 h-3.5" /></button>
      <button type="button" onMouseDown={cmd(() => editor.chain().focus().toggleOrderedList().run())} className={btn(editor.isActive('orderedList'))} title="Numbered"><ListOrdered className="w-3.5 h-3.5" /></button>
      <button type="button" onMouseDown={cmd(() => editor.chain().focus().toggleBlockquote().run())} className={btn(editor.isActive('blockquote'))} title="Quote"><Quote className="w-3.5 h-3.5" /></button>
      <div className="w-px h-4 bg-white/10 mx-1.5" />
      <button type="button" onMouseDown={cmd(setLink)} className={btn(editor.isActive('link'))} title="Link"><Link2 className="w-3.5 h-3.5" /></button>
      <div className="w-px h-4 bg-white/10 mx-1.5" />
      <button type="button" onMouseDown={cmd(() => editor.chain().focus().undo().run())} className={btn(false)} disabled={!editor.can().undo()} title="Undo"><Undo className="w-3.5 h-3.5" /></button>
      <button type="button" onMouseDown={cmd(() => editor.chain().focus().redo().run())} className={btn(false)} disabled={!editor.can().redo()} title="Redo"><Redo className="w-3.5 h-3.5" /></button>
    </div>
  );
}
