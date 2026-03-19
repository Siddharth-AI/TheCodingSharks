'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FileText, Plus } from 'lucide-react';
import axios from 'axios';

export default function AdminDashboardPage() {
  const [totalBlogs, setTotalBlogs] = useState<number | null>(null);
  const [activeBlogs, setActiveBlogs] = useState<number | null>(null);

  useEffect(() => {
    async function fetchStats() {
      try {
        const token = localStorage.getItem('cs_access_token');
        const { data } = await axios.get('/api/admin/blogs?limit=1', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalBlogs(data.data.meta.total);
        const { data: activeData } = await axios.get('/api/admin/blogs?limit=1&includeDeleted=false', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setActiveBlogs(activeData.data.meta.total);
      } catch {
        // ignore
      }
    }
    fetchStats();
  }, []);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-zinc-400 text-sm mt-1">Welcome to CodingSharks admin</p>
        </div>
        <Link
          href="/admin/blogs/new"
          className="flex items-center gap-2 bg-[#ff6b2c] hover:bg-[#e55a1f] text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Blog
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        <StatCard
          icon={<FileText className="w-5 h-5 text-[#ff6b2c]" />}
          label="Total Blogs"
          value={totalBlogs}
          href="/admin/blogs"
        />
        <StatCard
          icon={<FileText className="w-5 h-5 text-green-400" />}
          label="Active Blogs"
          value={activeBlogs}
          href="/admin/blogs"
        />
      </div>

      {/* Quick links */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <h2 className="text-white font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/blogs/new"
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" /> Create Blog Post
          </Link>
          <Link
            href="/admin/blogs"
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            <FileText className="w-4 h-4" /> Manage Blogs
          </Link>
          <Link
            href="/"
            target="_blank"
            className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-white text-sm px-4 py-2 rounded-lg transition-colors"
          >
            View Site ↗
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | null;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-zinc-900 border border-zinc-800 hover:border-zinc-600 rounded-xl p-5 flex items-center gap-4 transition-colors"
    >
      <div className="bg-zinc-800 p-3 rounded-lg">{icon}</div>
      <div>
        <p className="text-zinc-400 text-sm">{label}</p>
        <p className="text-white text-2xl font-bold">{value ?? '—'}</p>
      </div>
    </Link>
  );
}
