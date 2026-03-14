import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"

type Props = {
  title: string
  description?: string
}

export function BasicPage({ title, description }: Props) {
  return (
    <Section>
      <Container>
        <h1 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">{title}</h1>
        {description ? (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">{description}</p>
        ) : null}
        <div className="mt-8 rounded-2xl border border-border bg-card/20 p-6 text-sm text-muted-foreground">
          Content coming next.
        </div>
      </Container>
    </Section>
  )
}