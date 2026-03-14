import Image from "next/image"

import home from "@/data/home.json"

import { Container } from "@/components/layout/container"
import { Section } from "@/components/layout/section"

export function SupportersSection() {
  const supporters = home.supporters

  return (
    <Section className="border-t border-border/70">
      <Container>
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            {supporters.title}
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            {supporters.subtitle}
          </p>
        </div>

        <div className="mt-10 -mx-4 px-4 lg:mx-0 lg:px-0">
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:grid lg:snap-none lg:grid-cols-6 lg:overflow-visible lg:pb-0">
            {supporters.items.map((item) => (
              <article
                key={item.name}
                className="group min-w-[240px] snap-start rounded-2xl border border-border bg-card/20 p-4 transition-transform hover:-translate-y-0.5 hover:border-primary/40 lg:min-w-0"
              >
                <div className="relative overflow-hidden rounded-2xl bg-[color:var(--accent-green)]/15">
                  <div className="pointer-events-none absolute inset-0">
                    <div className="absolute left-1/2 top-1/2 size-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[color:var(--accent-green)]/40" />
                  </div>
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={item.avatarUrl}
                      alt={item.name}
                      fill
                      sizes="(min-width: 1024px) 180px, 240px"
                      className="object-cover object-top grayscale-[0.25] transition group-hover:grayscale-0"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-sm font-semibold text-foreground">{item.name}</p>
                  <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                    {item.roles.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-6 border-t border-border/50 pt-8">
          {supporters.logoStrip.map((logo) => (
            <span
              key={logo}
              className="text-sm font-semibold tracking-wide text-foreground/70"
            >
              {logo}
            </span>
          ))}
          <span className="text-sm text-muted-foreground">…and 50+ founders</span>
        </div>
      </Container>
    </Section>
  )
}