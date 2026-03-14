import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"

type Props = {
  params: Promise<{ slug: string }>
}

export default async function CourseDetailPage({ params }: Props) {
  const { slug } = await params

  return (
    <Section>
      <Container>
        <h1 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
          {slug.replace(/-/g, " ")}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
          Course detail page coming next.
        </p>
      </Container>
    </Section>
  )
}