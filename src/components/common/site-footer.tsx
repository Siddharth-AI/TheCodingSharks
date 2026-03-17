import Link from "next/link"
import site from "@/data/site.json"
import { Container } from "@/components/layout/container"

const socials = [
  {
    label: "Instagram",
    href: site.socials.instagram || "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/>
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" strokeWidth="0"/>
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: site.socials.linkedin || "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>
      </svg>
    ),
  },
  {
    label: "YouTube",
    href: site.socials.youtube || "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z"/>
        <polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="white"/>
      </svg>
    ),
  },
  {
    label: "Twitter / X",
    href: "#",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
      </svg>
    ),
  },
]

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Blog", href: "/blog" },
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms & Conditions", href: "/terms" },
]

export function SiteFooter() {
  return (
    <footer className="bg-[#0a0a0a] border-t border-white/5 pb-14">
      <Container className="pt-14">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1.2fr]">

          {/* ── Brand column ── */}
          <div className="flex flex-col gap-5">
            <Link href="/" className="inline-flex items-center gap-2 group">
              <span className="text-xl font-bold text-white font-heading tracking-tight group-hover:text-primary transition-colors">
                {site.brand.name}
              </span>
            </Link>
            <p className="text-sm text-white/45 leading-relaxed max-w-xs">
              {site.brand.description}
            </p>
            <div className="flex items-center gap-3 mt-1">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="size-9 rounded-full border border-white/10 bg-white/4 flex items-center justify-center text-white/50 hover:text-white hover:border-primary/50 hover:bg-primary/10 transition-all"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* ── Quick links ── */}
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase mb-5">Quick Links</p>
            <ul className="flex flex-col gap-3">
              {quickLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-sm text-white/55 hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-white/30 uppercase mb-5">Contact</p>
            <div className="flex flex-col gap-4 text-sm">
              <div>
                <p className="text-white/30 text-[11px] uppercase tracking-widest mb-1">Online · 11am – 8pm</p>
                <a href={`tel:${site.contact.phone}`} className="text-primary hover:underline underline-offset-2">
                  {site.contact.phone}
                </a>
              </div>
              <div>
                <p className="text-white/30 text-[11px] uppercase tracking-widest mb-1">Email</p>
                <a href={`mailto:${site.contact.email}`} className="text-white/55 hover:text-white transition-colors break-all">
                  {site.contact.email}
                </a>
              </div>
              <div>
                <p className="text-white/30 text-[11px] uppercase tracking-widest mb-1">Address</p>
                <address className="not-italic text-white/45 text-[13px] leading-relaxed">
                  {site.address.line1}<br />
                  {site.address.city}, {site.address.region}<br />
                  {site.address.country}
                </address>
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom bar ── */}
        <div className="mt-14 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-white/25">
            © {new Date().getFullYear()} {site.brand.name}. All rights reserved.
          </p>
          <p className="text-xs text-white/20">
            Built with ❤️ in India
          </p>
        </div>
      </Container>
    </footer>
  )
}
