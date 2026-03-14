import Link from "next/link"

import nav from "@/data/nav.json"
import site from "@/data/site.json"

import { Container } from "@/components/layout/container"
import { Separator } from "@/components/ui/separator"

export function SiteFooter() {
  return (
    <footer className="border-t border-border/70 bg-background">
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="space-y-3 md:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <span className="text-lg font-semibold tracking-tight text-foreground">
                {site.brand.name}
              </span>
              <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">
                {site.brand.taglineShort}
              </span>
            </Link>
            <p className="max-w-md text-sm leading-relaxed text-muted-foreground">
              {site.brand.description}
            </p>
            <p className="text-sm text-muted-foreground">
              {site.contact.email} · {site.contact.phone}
            </p>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Company</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {nav.footer.company.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium text-foreground">Programs</p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {nav.footer.programs.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="my-10 bg-border/60" />

        <div className="flex flex-col gap-4 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© {new Date().getFullYear()} {site.brand.name}. All rights reserved.</p>
          <div className="flex flex-wrap gap-4">
            {nav.footer.legal.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </footer>
  )
}
