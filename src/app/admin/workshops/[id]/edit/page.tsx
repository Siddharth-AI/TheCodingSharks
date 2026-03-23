'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { WorkshopForm } from '@/components/admin/workshop-form';
import type { Workshop } from '@/types';

export default function EditWorkshopPage() {
  const { id } = useParams<{ id: string }>();
  const [workshop, setWorkshop] = useState<Workshop | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchWorkshop() {
      try {
        const token = localStorage.getItem('cs_access_token');
        const { data } = await axios.get(`/api/admin/workshops/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWorkshop(data.data);
      } catch {
        setError('Failed to load workshop');
      } finally {
        setLoading(false);
      }
    }
    fetchWorkshop();
  }, [id]);

  if (loading) {
    return <div className="flex items-center justify-center py-24 text-zinc-500">Loading…</div>;
  }

  if (error || !workshop) {
    return <div className="flex items-center justify-center py-24 text-red-400">{error || 'Workshop not found'}</div>;
  }

  return <WorkshopForm workshop={workshop} />;
}
