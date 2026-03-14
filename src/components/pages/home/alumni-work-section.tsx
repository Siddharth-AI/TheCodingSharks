import Image from "next/image";

import home from "@/data/home.json";

import { ButtonLink } from "@/components/common/button-link";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";

import { ArrowRight, ArrowUpRight } from "lucide-react";

const tileLayout = [
  "col-span-12 md:col-span-6 lg:col-span-4 row-span-2",
  "col-span-12 md:col-span-6 lg:col-span-4 row-span-1",
  "col-span-12 md:col-span-6 lg:col-span-4 row-span-1",
  "col-span-12 md:col-span-6 lg:col-span-4 row-span-1",
  "col-span-12 md:col-span-6 lg:col-span-4 row-span-1 lg:row-span-2",
  "col-span-12 md:col-span-12 lg:col-span-8 row-span-1",
];

export function AlumniWorkSection() {
  const { alumniWork } = home;

  return (
    <Section className="border-t border-border/70">
      <Container>
        <div className="mx-auto max-w-3xl text-center">
          <p className="mx-auto mb-4 w-fit rounded-full border border-border bg-card/20 px-4 py-2 text-xs tracking-wide text-muted-foreground">
            COMMUNITY
          </p>
          <h2 className="text-balance text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            {alumniWork.headline}
          </h2>
          <p className="mt-4 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
            {alumniWork.description}
          </p>

          <div className="mt-7 flex justify-center">
            <ButtonLink
              href="/placements"
              size="lg"
              className="h-12 rounded-full px-8">
              <span className="mr-2">Explore More</span>
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
          </div>
        </div>

        <div className="mt-12 grid auto-rows-[220px] grid-cols-12 gap-4 lg:auto-rows-[240px] lg:grid-flow-dense">
          {alumniWork.grid.map((item, idx) => (
            <article
              key={item.title}
              className={
                "group relative overflow-hidden rounded-3xl border border-border bg-card/10 " +
                (tileLayout[idx] ?? "col-span-12")
              }>
              <Image
                src={item.imageUrl}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 33vw, 100vw"
                className="object-cover transition duration-500 will-change-transform group-hover:scale-[1.03] group-hover:grayscale"
              />

              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-64 opacity-0 transition-opacity duration-300 group-hover:opacity-100 sm:h-80">
                <div className="absolute inset-0 bg-gradient-to-t from-primary/55 via-black/75 to-transparent" />
              </div>

              <div className="absolute inset-x-0 bottom-0 translate-y-3 p-5 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                <p className="text-sm font-semibold text-foreground">
                  {item.title}
                </p>
                <p className="mt-1 text-sm text-foreground/85">{item.label}</p>
              </div>

              <div className="absolute right-4 top-4">
                <div className="grid size-11 place-items-center rounded-full border opacity-100 transition-all duration-300 border-primary/40 bg-primary text-primary-foreground">
                  <ArrowUpRight
                    className="size-5 transition-transform duration-500 group-hover:rotate-45"
                    aria-hidden="true"
                  />
                </div>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </Section>
  );
}
