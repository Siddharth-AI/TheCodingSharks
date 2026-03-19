'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import { ImageUpload } from './image-upload';
import axios from 'axios';
import type { BlogWithTags } from '@/types';
import {
  Bold, Italic, Underline as UnderlineIcon, Strikethrough,
  AlignLeft, AlignCenter, AlignRight, List, ListOrdered,
  Link2, Highlighter, Quote, Undo, Redo, X,
  ArrowLeft, FileText, Clock, Tag, ImageIcon, Globe, Code2,
} from 'lucide-react';

interface BlogFormProps {
  blog?: BlogWithTags;
}

export function BlogForm({ blog }: BlogFormProps) {
  const router = useRouter();
  const isEdit = !!blog;

  const [title, setTitle] = useState(blog?.title || '');
  const [slug, setSlug] = useState(blog?.slug || '');
  const [excerpt, setExcerpt] = useState(blog?.excerpt || '');
  const [readTime, setReadTime] = useState(blog?.read_time?.toString() || '');
  const [isActive, setIsActive] = useState(blog?.is_active ?? true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [tags, setTags] = useState<string[]>(blog?.tags?.map((t) => t.name) || []);
  const [tagInput, setTagInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showHtmlImport, setShowHtmlImport] = useState(false);
  const [htmlImport, setHtmlImport] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Highlight.configure({ multicolor: false }),
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: blog?.description || '',
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: 'min-h-[520px] p-6 text-white/85 text-sm focus:outline-none prose prose-invert prose-sm max-w-none leading-relaxed',
      },
    },
  });

  function handleTitleChange(value: string) {
    setTitle(value);
    if (!isEdit || !blog?.slug) {
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

  function addTag() {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) setTags([...tags, trimmed]);
    setTagInput('');
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
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
      if (excerpt) formData.append('excerpt', excerpt);
      if (editor) formData.append('description', editor.getHTML());
      if (readTime) formData.append('read_time', readTime);
      formData.append('is_active', isActive.toString());
      if (imageFile) formData.append('image', imageFile);

      const headers = { Authorization: `Bearer ${token}` };
      let blogId: string;

      if (isEdit) {
        const { data } = await axios.put(`/api/admin/blogs/${blog!.id}`, formData, { headers });
        blogId = data.data.id;
      } else {
        const { data } = await axios.post('/api/admin/blogs', formData, { headers });
        blogId = data.data.id;
      }

      const existingTagNames = blog?.tags?.map((t) => t.name) || [];
      const newTags = tags.filter((t) => !existingTagNames.includes(t));
      for (const name of newTags) {
        await axios.post(`/api/admin/blogs/${blogId}/tags`, { name }, { headers });
      }

      router.push('/admin/blogs');
    } catch (err) {
      const msg = axios.isAxiosError(err)
        ? err.response?.data?.message || 'Failed to save blog'
        : 'Failed to save blog';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      {/* ── Top bar ──────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-[#0d0d0d] border-b border-white/8 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            Blogs
          </button>
          <span className="text-white/15">/</span>
          <span className="text-white/70 text-sm font-medium">
            {isEdit ? 'Edit Post' : 'New Post'}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase px-3 py-1.5 border ${
            isActive
              ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/8'
              : 'text-white/30 border-white/10 bg-white/3'
          }`}>
            <Globe className="w-3 h-3" />
            {isActive ? 'Published' : 'Draft'}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="flex gap-0 min-h-[calc(100vh-57px)]">

          {/* ── Main column ──────────────────────────────────────── */}
          <div className="flex-1 min-w-0 border-r border-white/8">

            {/* Title block */}
            <div className="px-8 py-8 border-b border-white/8">
              <input
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                className="w-full bg-transparent text-3xl font-bold text-white placeholder-white/15 focus:outline-none font-heading tracking-tight"
                placeholder="Post title…"
              />
              <div className="flex items-center gap-2 mt-4">
                <span className="text-white/25 text-xs font-mono">codingsharks.com/blog/</span>
                <input
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  pattern="[a-z0-9-]+"
                  className="flex-1 bg-transparent text-xs font-mono text-white/50 placeholder-white/20 focus:outline-none focus:text-white/80 border-b border-transparent focus:border-white/20 pb-0.5 transition-colors"
                  placeholder="post-slug"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div className="px-8 py-6 border-b border-white/8">
              <label className="flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase text-white/30 mb-3">
                <FileText className="w-3.5 h-3.5" /> Excerpt
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                rows={3}
                className="w-full bg-transparent text-sm text-white/70 placeholder-white/20 focus:outline-none resize-none leading-relaxed"
                placeholder="Short description shown in blog listing — keep it under 160 characters…"
              />
            </div>

            {/* Content Editor */}
            <div className="px-8 py-6">
              <div className="flex items-center justify-between mb-3">
                <label className="flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase text-white/30">
                  <Code2 className="w-3.5 h-3.5" /> Content
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

          {/* ── Sidebar ──────────────────────────────────────────── */}
          <div className="w-[300px] shrink-0 sticky top-[57px] h-[calc(100vh-57px)] overflow-y-auto bg-[#0d0d0d]">

            {/* Error */}
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
              <ImageUpload
                currentImageUrl={blog?.base_url}
                onFileSelect={setImageFile}
              />
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
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isActive ? 'bg-[#ff6b2c]' : 'bg-white/10'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    isActive ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            </div>

            {/* Read time */}
            <div className="p-5 border-b border-white/8">
              <label className="flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase text-white/30 mb-3">
                <Clock className="w-3.5 h-3.5" /> Read Time
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  min={1}
                  className="w-20 bg-black/30 border border-white/10 px-3 py-2 text-white text-sm focus:outline-none focus:border-white/25 transition-colors"
                  placeholder="5"
                />
                <span className="text-white/30 text-sm">minutes</span>
              </div>
            </div>

            {/* Tags */}
            <div className="p-5 border-b border-white/8">
              <label className="flex items-center gap-2 text-xs font-bold tracking-[0.15em] uppercase text-white/30 mb-3">
                <Tag className="w-3.5 h-3.5" /> Tags
              </label>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="flex items-center gap-1.5 bg-white/5 border border-white/10 text-white/60 text-xs px-2.5 py-1"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="text-white/25 hover:text-white transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                  className="flex-1 min-w-0 bg-black/30 border border-white/10 px-3 py-2 text-white text-xs focus:outline-none focus:border-white/25 transition-colors placeholder-white/20"
                  placeholder="Add tag…"
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="bg-white/8 hover:bg-white/12 border border-white/10 text-white/60 hover:text-white text-xs px-3 py-2 transition-colors"
                >
                  Add
                </button>
              </div>
            </div>

            {/* Submit */}
            <div className="p-5">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#ff6b2c] hover:bg-[#e55a1f] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold uppercase tracking-widest py-3.5 transition-colors"
              >
                {isSubmitting ? 'Saving…' : isEdit ? 'Update Post' : 'Publish Post'}
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

// ─── TipTap Toolbar ───────────────────────────────────────────────────────────

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
      {/* Text style */}
      <button type="button" onMouseDown={cmd(() => editor.chain().focus().toggleBold().run())} className={btn(editor.isActive('bold'))} title="Bold"><Bold className="w-3.5 h-3.5" /></button>
      <button type="button" onMouseDown={cmd(() => editor.chain().focus().toggleItalic().run())} className={btn(editor.isActive('italic'))} title="Italic"><Italic className="w-3.5 h-3.5" /></button>
      <button type="button" onMouseDown={cmd(() => editor.chain().focus().toggleUnderline().run())} className={btn(editor.isActive('underline'))} title="Underline"><UnderlineIcon className="w-3.5 h-3.5" /></button>
      <button type="button" onMouseDown={cmd(() => editor.chain().focus().toggleStrike().run())} className={btn(editor.isActive('strike'))} title="Strikethrough"><Strikethrough className="w-3.5 h-3.5" /></button>
      <button type="button" onMouseDown={cmd(() => editor.chain().focus().toggleHighlight().run())} className={btn(editor.isActive('highlight'))} title="Highlight"><Highlighter className="w-3.5 h-3.5" /></button>

      <div className="w-px h-4 bg-white/10 mx-1.5" />

      {/* Headings */}
      <button type="button" onMouseDown={cmd(() => editor.chain().focus().setParagraph().run())} className={`${btn(!editor.isActive('heading'))} text-[10px] font-bold px-1`} title="Normal">P</button>
      <button type="button" onMouseDown={cmd(() => editor.chain().focus().toggleHeading({ level: 1 }).run())} className={`${btn(editor.isActive('heading', { level: 1 }))} text-[10px] font-bold px-1`} title="Heading 1">H1</button>
      <button type="button" onMouseDown={cmd(() => editor.chain().focus().toggleHeading({ level: 2 }).run())} className={`${btn(editor.isActive('heading', { level: 2 }))} text-[10px] font-bold px-1`} title="Heading 2">H2</button>
      <button type="button" onMouseDown={cmd(() => editor.chain().focus().toggleHeading({ level: 3 }).run())} className={`${btn(editor.isActive('heading', { level: 3 }))} text-[10px] font-bold px-1`} title="Heading 3">H3</button>

      <div className="w-px h-4 bg-white/10 mx-1.5" />

      {/* Align */}
      <button type="button" onMouseDown={cmd(() => editor.chain().focus().setTextAlign('left').run())} className={btn(editor.isActive({ textAlign: 'left' }))} title="Align Left"><AlignLeft className="w-3.5 h-3.5" /></button>
      <button type="button" onMouseDown={cmd(() => editor.chain().focus().setTextAlign('center').run())} className={btn(editor.isActive({ textAlign: 'center' }))} title="Center"><AlignCenter className="w-3.5 h-3.5" /></button>
      <button type="button" onMouseDown={cmd(() => editor.chain().focus().setTextAlign('right').run())} className={btn(editor.isActive({ textAlign: 'right' }))} title="Align Right"><AlignRight className="w-3.5 h-3.5" /></button>

      <div className="w-px h-4 bg-white/10 mx-1.5" />

      {/* Lists */}
      <button type="button" onMouseDown={cmd(() => editor.chain().focus().toggleBulletList().run())} className={btn(editor.isActive('bulletList'))} title="Bullet List"><List className="w-3.5 h-3.5" /></button>
      <button type="button" onMouseDown={cmd(() => editor.chain().focus().toggleOrderedList().run())} className={btn(editor.isActive('orderedList'))} title="Numbered List"><ListOrdered className="w-3.5 h-3.5" /></button>
      <button type="button" onMouseDown={cmd(() => editor.chain().focus().toggleBlockquote().run())} className={btn(editor.isActive('blockquote'))} title="Blockquote"><Quote className="w-3.5 h-3.5" /></button>

      <div className="w-px h-4 bg-white/10 mx-1.5" />

      {/* Link */}
      <button type="button" onMouseDown={cmd(setLink)} className={btn(editor.isActive('link'))} title="Link"><Link2 className="w-3.5 h-3.5" /></button>

      <div className="w-px h-4 bg-white/10 mx-1.5" />

      {/* History */}
      <button type="button" onMouseDown={cmd(() => editor.chain().focus().undo().run())} className={btn(false)} disabled={!editor.can().undo()} title="Undo"><Undo className="w-3.5 h-3.5" /></button>
      <button type="button" onMouseDown={cmd(() => editor.chain().focus().redo().run())} className={btn(false)} disabled={!editor.can().redo()} title="Redo"><Redo className="w-3.5 h-3.5" /></button>
    </div>
  );
}
