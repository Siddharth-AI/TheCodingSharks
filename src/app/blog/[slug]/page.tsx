import { BlogDetailPage } from '@/components/pages/blog/blog-detail-page';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  return <BlogDetailPage slug={slug} />;
}
