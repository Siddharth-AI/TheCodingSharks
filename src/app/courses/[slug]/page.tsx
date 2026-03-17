import { CourseDetailPage } from "@/components/pages/courses/course-detail-page";
import courses from "@/data/courses.json";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return courses.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const course = courses.find((c) => c.slug === slug);
  return {
    title: course?.title ?? "Program",
    description: course?.tagline ?? "",
  };
}

export default async function CourseDetailRoute({ params }: Props) {
  const { slug } = await params;
  return <CourseDetailPage slug={slug} />;
}