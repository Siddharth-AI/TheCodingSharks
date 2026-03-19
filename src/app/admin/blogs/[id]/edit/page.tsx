'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { BlogForm } from '@/components/admin/blog-form';
import type { BlogWithTags } from '@/types';

export default function EditBlogPage() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<BlogWithTags | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchBlog() {
      try {
        const token = localStorage.getItem('cs_access_token');
        const { data } = await axios.get(`/api/admin/blogs/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBlog(data.data);
      } catch {
        setError('Failed to load blog');
      } finally {
        setLoading(false);
      }
    }
    fetchBlog();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-zinc-500">Loading…</div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex items-center justify-center py-24 text-red-400">{error || 'Blog not found'}</div>
    );
  }

  return <BlogForm blog={blog} />;
}
