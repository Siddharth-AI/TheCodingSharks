import { notFound } from 'next/navigation';
import workshops from '@/data/workshops.json';
import { WorkshopDetailPage } from '@/components/pages/workshop/workshop-detail-page';

interface WorkshopPageProps {
  params: Promise<{ slug: string }>;
}

export default async function WorkshopPage({ params }: WorkshopPageProps) {
  const { slug } = await params;
  const workshop = workshops.find((w) => w.slug === slug && w.is_active);
  if (!workshop) notFound();
  return <WorkshopDetailPage workshop={workshop} />;
}
