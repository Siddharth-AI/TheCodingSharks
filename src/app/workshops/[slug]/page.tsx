import { WorkshopDetailPage } from '@/components/pages/workshop/workshop-detail-page';

interface WorkshopPageProps {
  params: Promise<{ slug: string }>;
}

export default async function WorkshopPage({ params }: WorkshopPageProps) {
  const { slug } = await params;
  return <WorkshopDetailPage slug={slug} />;
}
