'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Pencil, Trash2, ToggleLeft, ToggleRight, Plus, RefreshCw, CalendarDays, ExternalLink } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAdminWorkshops, deleteWorkshop, toggleWorkshopStatus } from '@/store/slices/workshopSlice';
import type { Workshop } from '@/types';

export function WorkshopTable() {
  const dispatch = useAppDispatch();
  const { workshops, meta, isLoading, error } = useAppSelector((s) => s.workshop);
  const [page, setPage] = useState(1);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchAdminWorkshops({ page, limit: 10 }));
  }, [dispatch, page]);

  async function handleToggle(id: string) {
    await dispatch(toggleWorkshopStatus(id));
  }

  async function handleDelete(id: string) {
    if (deleteConfirm === id) {
      await dispatch(deleteWorkshop(id));
      setDeleteConfirm(null);
      dispatch(fetchAdminWorkshops({ page, limit: 10 }));
    } else {
      setDeleteConfirm(id);
      setTimeout(() => setDeleteConfirm(null), 3000);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6 lg:p-8">

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Workshops</h1>
          <p className="text-white/30 text-sm mt-1">
            {meta ? `${meta.total} total workshop${meta.total !== 1 ? 's' : ''}` : '—'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => dispatch(fetchAdminWorkshops({ page, limit: 10 }))}
            className="h-10 w-10 flex items-center justify-center border border-white/10 hover:border-white/20 text-white/30 hover:text-white transition-colors"
            title="Refresh"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/admin/workshops/new"
            className="h-10 flex items-center gap-2 bg-[#ff6b2c] hover:bg-[#e55a1f] text-white text-xs font-bold uppercase tracking-widest px-5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            New Workshop
          </Link>
        </div>
      </div>

      {/* ── Error ──────────────────────────────────────────────────────── */}
      {error && (
        <div className="bg-red-500/8 border border-red-500/20 p-3 text-red-400 text-xs mb-6">
          {error}
        </div>
      )}

      {/* ── Table ──────────────────────────────────────────────────────── */}
      <div className="border border-white/8 overflow-hidden">
        {isLoading ? (
          <div>
            <div className="flex bg-[#111] border-b border-white/8 px-5 py-3 gap-4">
              {['Title', 'Date', 'Mode', 'Status', 'Actions'].map((h) => (
                <span key={h} className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/20 flex-1">{h}</span>
              ))}
            </div>
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-white/5">
                <div className="flex-1 h-3 bg-white/6 animate-pulse" />
                <div className="w-24 h-3 bg-white/4 animate-pulse" />
                <div className="w-16 h-3 bg-white/4 animate-pulse" />
                <div className="w-14 h-5 bg-white/4 animate-pulse" />
                <div className="w-20 h-3 bg-white/4 animate-pulse" />
              </div>
            ))}
          </div>
        ) : workshops.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <CalendarDays className="w-10 h-10 text-white/10" strokeWidth={1.2} />
            <p className="text-white/30 text-sm">No workshops yet</p>
            <Link
              href="/admin/workshops/new"
              className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#ff6b2c] border border-[#ff6b2c]/30 px-4 py-2 hover:bg-[#ff6b2c]/5 transition-colors"
            >
              + Create First Workshop
            </Link>
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-[#111] border-b border-white/8">
                <th className="text-left text-[10px] font-bold tracking-[0.18em] uppercase text-white/25 px-5 py-3 w-[35%]">Title</th>
                <th className="text-left text-[10px] font-bold tracking-[0.18em] uppercase text-white/25 px-5 py-3 w-[15%]">Date</th>
                <th className="text-left text-[10px] font-bold tracking-[0.18em] uppercase text-white/25 px-5 py-3 w-[10%]">Mode</th>
                <th className="text-left text-[10px] font-bold tracking-[0.18em] uppercase text-white/25 px-5 py-3 w-[10%]">Price</th>
                <th className="text-left text-[10px] font-bold tracking-[0.18em] uppercase text-white/25 px-5 py-3 w-[10%]">Status</th>
                <th className="text-left text-[10px] font-bold tracking-[0.18em] uppercase text-white/25 px-5 py-3 w-[20%]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {workshops.map((workshop: Workshop) => (
                <tr key={workshop.id} className="hover:bg-white/2 transition-colors group">
                  <td className="px-5 py-4 align-middle">
                    <p className="text-white/85 text-sm font-medium truncate max-w-xs">{workshop.title}</p>
                    {workshop.tagline && (
                      <p className="text-white/25 text-xs truncate mt-0.5 max-w-xs">{workshop.tagline}</p>
                    )}
                  </td>

                  <td className="px-5 py-4 align-middle">
                    <span className="text-white/40 text-xs">
                      {workshop.event_date
                        ? new Date(workshop.event_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '—'}
                    </span>
                  </td>

                  <td className="px-5 py-4 align-middle">
                    <span className={`text-[10px] font-bold tracking-[0.12em] uppercase px-2 py-0.5 border ${
                      workshop.mode === 'online'
                        ? 'text-cyan-400 border-cyan-500/20 bg-cyan-500/8'
                        : 'text-amber-400 border-amber-500/20 bg-amber-500/8'
                    }`}>
                      {workshop.mode}
                    </span>
                  </td>

                  <td className="px-5 py-4 align-middle">
                    <span className={`text-xs font-bold ${workshop.is_free ? 'text-emerald-400' : 'text-white/60'}`}>
                      {workshop.is_free ? 'Free' : workshop.price}
                    </span>
                  </td>

                  <td className="px-5 py-4 align-middle">
                    <span className={`inline-block text-[10px] font-bold tracking-[0.15em] uppercase px-2.5 py-1 border ${
                      workshop.is_active
                        ? 'text-emerald-400 border-emerald-500/25 bg-emerald-500/8'
                        : 'text-white/25 border-white/10 bg-white/3'
                    }`}>
                      {workshop.is_active ? 'Live' : 'Draft'}
                    </span>
                  </td>

                  <td className="px-5 py-4 align-middle">
                    <div className="flex items-center gap-0.5">
                      <button
                        onClick={() => handleToggle(workshop.id)}
                        title={workshop.is_active ? 'Set to Draft' : 'Publish'}
                        className={`h-8 w-8 flex items-center justify-center transition-colors ${
                          workshop.is_active ? 'text-emerald-400 hover:text-white/40' : 'text-white/20 hover:text-emerald-400'
                        }`}
                      >
                        {workshop.is_active ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
                      </button>

                      <Link
                        href={`/workshops/${workshop.slug}`}
                        target="_blank"
                        title="Preview"
                        className="h-8 w-8 flex items-center justify-center text-white/20 hover:text-white/70 transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      <Link
                        href={`/admin/workshops/${workshop.id}/edit`}
                        title="Edit"
                        className="h-8 w-8 flex items-center justify-center text-white/20 hover:text-white transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => handleDelete(workshop.id)}
                        title={deleteConfirm === workshop.id ? 'Click again to confirm' : 'Delete'}
                        className={`h-8 w-8 flex items-center justify-center transition-colors ${
                          deleteConfirm === workshop.id ? 'text-red-400 bg-red-500/10' : 'text-white/20 hover:text-red-400'
                        }`}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── Pagination ─────────────────────────────────────────────────── */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <span className="text-xs text-white/20 font-mono">
            Page {meta.page} / {meta.totalPages}
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="h-9 px-5 border border-white/10 text-xs font-bold text-white/40 hover:text-white hover:border-white/20 uppercase tracking-[0.15em] transition-all disabled:opacity-25 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(meta.totalPages, p + 1))}
              disabled={page === meta.totalPages}
              className="h-9 px-5 border border-white/10 text-xs font-bold text-white/40 hover:text-white hover:border-white/20 uppercase tracking-[0.15em] transition-all disabled:opacity-25 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
